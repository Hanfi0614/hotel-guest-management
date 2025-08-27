import { NavLink, Outlet } from "react-router-dom";

function linkCls({ isActive }: { isActive: boolean }) {
  return [
    "px-3 py-2 rounded-lg transition",
    isActive ? "bg-white text-navy-dark" : "text-white/90 hover:text-white"
  ].join(" ");
}

export default function Shell() {
  return (
    <div className="min-h-screen flex flex-col">
      
      
      <header className="bg-navy-dark shadow-md sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <NavLink to="/" className={linkCls}>Home</NavLink>
          <NavLink to="/guests" className={linkCls}>Guests</NavLink>
          <div className="ml-auto">
            <NavLink to="/guests/new" className={linkCls}>Add Guest</NavLink>
          </div>
        </nav>
      </header>

      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
