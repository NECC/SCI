export default async function Layout({ children }) {
  return (
      <div className="overflow-hidden h-[100vh] mt-[-72px]">
        {children}
      </div>
  );
}
