export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="overflow-hidden h-screen -mt-[72px]">
        {children}
      </div>
  );
}
