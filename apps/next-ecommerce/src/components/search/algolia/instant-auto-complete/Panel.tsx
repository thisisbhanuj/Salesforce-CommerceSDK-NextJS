export function Panel({
  children,
}: React.PropsWithChildren<{
  header?: React.ReactNode;
  footer?: React.ReactNode;
}>) {
  return (
    <div className="ais-Panel">
      <div className="ais-Panel-body">{children}</div>
    </div>
  );
}
