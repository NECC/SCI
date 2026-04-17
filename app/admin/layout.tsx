

import Sidebar from "@components/admin/SideBar";
import Providers from "@/components/providers/Providers";

export const metadata = {
  title: 'Backoffice',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="admin-bg flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-auto">
          {children}
        </main>
      </div>
    </Providers>
  );
}

