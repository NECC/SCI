import Sidebar from "@components/admin/SideBar";

export const metadata = {
  title: 'Backoffice',
};

export default async function AdminLayout({ children }) {
  return (
    <div className="flex">
        <Sidebar />
        {children}
    </div>
  );
}
