import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();         // highlight active page

  const item = (path, label) => (
    <Link
      to={path}
      className={`
        hover:underline
        ${pathname === path ? "text-white" : "text-white/80"}
      `}
    >
      {label}
    </Link>
  );

  return (
    <nav
      className="
        fixed top-0 inset-x-0 z-50
        flex items-center justify-between
        h-14 px-4 md:px-8
        backdrop-blur-md bg-black/30
      "
    >
      {/* brand / logo */}
      <div className="text-lg font-bold tracking-wide text-white">
        NASA&nbsp;Explorer
      </div>

      {/* nav items */}
      <ul className="flex space-x-6 text-sm md:text-base">
        {item("/",      "APOD")}
        {item("/mars",  "Mars Rover")}
        {item("/neo",   "NEO Tracker")}
        {item("/epic",  "EPIC")}
      </ul>
    </nav>
  );
}
