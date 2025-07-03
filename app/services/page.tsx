import { Services } from "@/components/services"

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-2">
      <h1 className="text-5xl font-extrabold mb-0 text-center">Наши услуги</h1>
      <div className="max-w-3xl mx-auto mt-0 pt-0 gap-y-0">
        <Services />
      </div>
    </div>
  )
} 