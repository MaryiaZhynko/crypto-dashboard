import { Outlet } from 'react-router';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-sidebar flex justify-between items-center gap-3 px-2.5 md:px-4 lg:px-6 py-4 shadow-sm">
        <h1 className="text-lg font-semibold tracking-tight">
          Crypto Dashboard
        </h1>
      </header>
      <main className="flex-1 px-2.5 md:px-4 lg:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
