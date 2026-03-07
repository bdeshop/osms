import PackagesManager from "@/components/admin/packages/PackagesManager";

export const metadata = {
  title: "Packages Management",
  description: "Manage SMS packages and pricing",
};

export default function PackagesPage() {
  return <PackagesManager />;
}
