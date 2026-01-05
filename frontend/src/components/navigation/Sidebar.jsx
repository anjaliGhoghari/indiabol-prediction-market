import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/app" },
  { name: "Markets", path: "/app/markets" },
  { name: "My Predictions", path: "/app/predictions" },
  { name: "Profile", path: "/app/profile" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 px-4 py-6">
      <h1 className="text-2xl font-bold mb-8 font-sans text-indigo-800">
         🪷 INDIABol
      </h1>

      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === "/app"}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg text-sm font-medium transition
       ${
         isActive
           ? "bg-indigo-50 text-indigo-600"
           : "text-gray-600 hover:bg-gray-100"
       }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
}
