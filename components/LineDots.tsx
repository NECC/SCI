export const LineDots = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div className="bg-yellow-300 h-4 w-4 rounded-full -translate-y-1/2 -translate-x-1/2 absolute top-0 left-0 "></div>
      <div className="bg-yellow-300 h-4 w-4 rounded-full translate-y-1/2 -translate-x-1/2 absolute bottom-0 left-0 "></div>
    </div>
  );
};
