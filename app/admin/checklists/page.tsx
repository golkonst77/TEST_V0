"use client"

import { AdminLayout } from "@/components/admin-layout"
import { ChecklistManager } from "@/components/admin/checklist-manager"

export default function ChecklistsPage() {
  return (
    <AdminLayout
      title="Чек-листы"
      description="Управление чек-листами для квиза"
    >
      <div className="p-6">
        <ChecklistManager />
      </div>
    </AdminLayout>
  )
} 