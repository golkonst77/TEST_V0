/**
 * amoCRM minimal client
 *
 * Responsibilities:
 * - Exchange refresh_token -> access_token
 * - Lightweight fetch wrapper with 401 retry
 * - Helpers to upsert contact by phone, create lead and add a note
 */

import type { RequestInit } from "next/dist/server/web/spec-extension/request";

type AmoAuthResponse = {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token?: string
};

type AmoApiError = {
  status: number
  title: string
  detail?: string
};

// Environment variables
const AMO_SUBDOMAIN = process.env.AMO_SUBDOMAIN;
const AMO_CLIENT_ID = process.env.AMO_CLIENT_ID;
const AMO_CLIENT_SECRET = process.env.AMO_CLIENT_SECRET;
const AMO_REDIRECT_URI = process.env.AMO_REDIRECT_URI;
const AMO_REFRESH_TOKEN = process.env.AMO_REFRESH_TOKEN;

// Optional routing config
const AMO_PIPELINE_ID = process.env.AMO_PIPELINE_ID;
const AMO_STATUS_ID = process.env.AMO_STATUS_ID;
const AMO_RESPONSIBLE_USER_ID = process.env.AMO_RESPONSIBLE_USER_ID;

function assertEnv() {
  const missing: string[] = [];
  if (!AMO_SUBDOMAIN) missing.push("AMO_SUBDOMAIN");
  if (!AMO_CLIENT_ID) missing.push("AMO_CLIENT_ID");
  if (!AMO_CLIENT_SECRET) missing.push("AMO_CLIENT_SECRET");
  if (!AMO_REDIRECT_URI) missing.push("AMO_REDIRECT_URI");
  if (!AMO_REFRESH_TOKEN) missing.push("AMO_REFRESH_TOKEN");
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0; // epoch seconds

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

async function getAccessToken(): Promise<string> {
  assertEnv();
  if (cachedAccessToken && nowSec() < tokenExpiresAt - 30) {
    return cachedAccessToken;
  }

  const url = `https://${AMO_SUBDOMAIN}.amocrm.ru/oauth2/access_token`;
  const body = {
    client_id: AMO_CLIENT_ID as string,
    client_secret: AMO_CLIENT_SECRET as string,
    grant_type: "refresh_token",
    refresh_token: AMO_REFRESH_TOKEN as string,
    redirect_uri: AMO_REDIRECT_URI as string,
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // Avoid edge caching
    cache: "no-store",
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`amoCRM auth failed: ${resp.status} ${text}`);
  }

  const data = (await resp.json()) as AmoAuthResponse;
  cachedAccessToken = data.access_token;
  tokenExpiresAt = nowSec() + (data.expires_in || 0);
  return cachedAccessToken as string;
}

async function amoFetch(path: string, init?: RequestInit, retry401 = true) {
  const base = `https://${AMO_SUBDOMAIN}.amocrm.ru`;
  const token = await getAccessToken();

  const resp = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (resp.status === 401 && retry401) {
    // refresh and retry once
    cachedAccessToken = null;
    await getAccessToken();
    return amoFetch(path, init, false);
  }

  if (!resp.ok) {
    // Try to parse amo error for debugging
    let detail: string | undefined;
    try {
      const j = (await resp.json()) as AmoApiError | any;
      detail = typeof j === "string" ? j : j?.title || j?.detail;
    } catch {
      detail = await resp.text();
    }
    throw new Error(`amoCRM request failed: ${resp.status} ${detail ?? ""}`);
  }

  return resp.json();
}

function normalizePhone(phone: string): string {
  // Remove non-digits
  const digits = (phone || "").replace(/\D+/g, "");
  if (!digits) return phone;
  // RU numbers: make +7
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return "+7" + digits.slice(1);
  }
  if (digits.length === 10) {
    return "+7" + digits;
  }
  return (phone.startsWith("+") ? "" : "+") + digits;
}

export async function findContactByPhone(phone: string) {
  const normalized = normalizePhone(phone);
  // amo v4 filter by query
  const data = await amoFetch(`/api/v4/contacts?query=${encodeURIComponent(normalized)}`);
  return (data?._embedded?.contacts || []).find((c: any) => {
    const values: string[] = (c.custom_fields_values || [])
      .filter((f: any) => f.field_code === "PHONE")
      .flatMap((f: any) => (f.values || []).map((v: any) => (v.value || "").toString()));
    return values.some((v) => normalizePhone(v) === normalized);
  });
}

export async function createContact(name: string | undefined, phone: string) {
  const normalized = normalizePhone(phone);
  const payload = [{
    name: name || "Клиент квиза",
    custom_fields_values: [
      {
        field_code: "PHONE",
        values: [{ value: normalized }],
      },
    ],
  }];
  const res = await amoFetch(`/api/v4/contacts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res?._embedded?.contacts?.[0];
}

export async function upsertContactByPhone(name: string | undefined, phone: string) {
  const existing = await findContactByPhone(phone);
  if (existing) return existing;
  return createContact(name, phone);
}

export async function createLead(params: {
  name?: string
  price?: number
  contactId?: number
}) {
  const lead: any = {
    name: params.name || "Лид с квиза",
  };
  if (params.price && params.price > 0) lead.price = Math.round(params.price);
  if (AMO_PIPELINE_ID) lead.pipeline_id = Number(AMO_PIPELINE_ID);
  if (AMO_STATUS_ID) lead.status_id = Number(AMO_STATUS_ID);
  if (AMO_RESPONSIBLE_USER_ID) lead.responsible_user_id = Number(AMO_RESPONSIBLE_USER_ID);

  const resp = await amoFetch(`/api/v4/leads`, {
    method: "POST",
    body: JSON.stringify([lead]),
  });
  const leadId = resp?._embedded?.leads?.[0]?.id;

  if (params.contactId && leadId) {
    await amoFetch(`/api/v4/leads/${leadId}/link`, {
      method: "POST",
      body: JSON.stringify([
        {
          to_entity_id: params.contactId,
          to_entity_type: "contacts",
          metadata: { is_main: true },
        },
      ]),
    });
  }
  return leadId;
}

export async function addNoteToLead(leadId: number, text: string) {
  const payload = [
    {
      note_type: "common",
      params: { text },
    },
  ];
  await amoFetch(`/api/v4/leads/${leadId}/notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function formatQuizNote(data: {
  phone: string
  discount?: number
  businessType?: string
  coupon?: string
  answers?: any[]
}) {
  const parts = [
    `📞 Телефон: ${data.phone}`,
    data.discount ? `💰 Скидка: ${data.discount}` : undefined,
    data.businessType ? `🏢 Тип бизнеса: ${data.businessType}` : undefined,
    data.coupon ? `🎫 Купон: ${data.coupon}` : undefined,
    data.answers && data.answers.length
      ? `\n📝 Ответы:\n${data.answers
          .map((a, i) => `${i + 1}. ${(a?.question || a?.questionId || "Вопрос")} : ${a?.answer ?? a}`)
          .join("\n")}`
      : undefined,
  ].filter(Boolean);
  return parts.join("\n");
}

export { normalizePhone };




