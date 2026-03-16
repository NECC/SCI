export default async function Layout({ children }: { children: React.ReactNode }) {
  // Use padding to offset the fixed nav height instead of negative margin
  return (
    <div className="min-h-screen pt-[72px]">
      {children}
    </div>
  );
}
