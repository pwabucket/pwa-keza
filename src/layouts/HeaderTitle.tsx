/** Page title for the header, with an optional icon, truncated to fit */
export default function HeaderTitle({
  icon,
  children,
}: {
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center gap-2 min-w-0">
      {icon ? <img src={icon} alt="" className="size-8 shrink-0" /> : null}
      <h1 className="font-bold truncate min-w-0">{children}</h1>
    </div>
  );
}
