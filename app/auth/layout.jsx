export default async function Layout({ children }) {
  return (
      <div className="overflow-hidden h-screen -mt-[72px]">
        {children}
      </div>
  );
}
