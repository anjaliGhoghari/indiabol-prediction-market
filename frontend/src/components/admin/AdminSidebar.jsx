import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/admin" },
  { name: "Create Market", path: "/admin/create" },
  { name: "Markets", path: "/admin/markets" },
 
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 px-5 py-6">
      <h1 className="text-2xl font-bold mb-10 text-green-500">
        Admin Panel
      </h1>

      <nav className="space-y-2">
        {links.map((l) => (
          <NavLink
            key={l.name}
            to={l.path}
            end={l.path === "/admin"}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm transition
               ${
                 isActive
                   ? "bg-slate-800 text-emerald-400"
                   : "text-slate-400 hover:bg-slate-800"
               }`
            }
          >
            {l.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
