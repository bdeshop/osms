import ContactConfigManager from "@/components/admin/ContactConfigManager";

export const metadata = {
  title: "Contact Page Config | Admin Panel",
  description: "Manage global office locations and contact page headers",
};

export default function ContactConfigPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Contact Page Config</h1>
        <p className="text-gray-400">Manage the dynamic content shown on the public contact page.</p>
      </div>
      <ContactConfigManager />
    </div>
  );
}
