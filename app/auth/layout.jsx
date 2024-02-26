export default async function Layout({ children }) {
  return (
      <div className="overflow-hidden h-screen">
        {children}
      </div>
  );
}
