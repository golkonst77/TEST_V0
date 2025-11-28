import { NextResponse } from "next/server";
import {
  addNoteToLead,
  createLead,
  formatQuizNote,
  upsertContactByPhone,
} from "@/lib/amo";

type RequestBody = {
  name?: string
  phone: string
  discount?: number
  businessType?: string
  coupon?: string
  answers?: any[]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    if (!body?.phone) {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }

    const contact = await upsertContactByPhone(body.name, body.phone);
    const leadId = await createLead({
      name: body.businessType ? `Квиз: ${body.businessType}` : "Лид с квиза",
      price: body.discount,
      contactId: contact?.id,
    });

    if (leadId) {
      const note = formatQuizNote({
        phone: body.phone,
        discount: body.discount,
        businessType: body.businessType,
        coupon: body.coupon,
        answers: body.answers,
      });
      if (note) await addNoteToLead(leadId, note);
    }

    return NextResponse.json({ success: true, leadId, contactId: contact?.id });
  } catch (err: any) {
    // Hide internal details but keep message in logs
    console.error("/api/integrations/amocrm/lead error", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}




