export function Cell({ children }: { children: React.ReactNode }) {
  return <td className="py-3 px-2 items-center gap-2">{children}</td>;
}
