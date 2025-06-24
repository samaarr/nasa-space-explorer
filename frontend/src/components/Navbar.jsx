import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-background text-white  px-6 py-4 flex gap-6 shadow-sm border-b border-gray-700">
      <Link to="/" className="hover:underline">APOD</Link>
      <Link to="/mars" className="hover:underline">Mars Rover</Link>
      <Link to="/neo" className="hover:underline">NEO Tracker</Link>
      <Link to="/epic" className="hover:underline">EPIC</Link>
    </nav>
  );
}

console.log('🧭 Navbar loaded');
