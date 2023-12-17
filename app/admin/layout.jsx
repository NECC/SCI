import Sidebar from "@components/admin/SideBar";

export default async function AdminLayout({ children }) {
  return (
    <div className="flex">
        <Sidebar />
        {children}
    </div>
  );
}
