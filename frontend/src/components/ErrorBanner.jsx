export default function ErrorBanner({ msg }) {
  return (
    <div className="p-3 rounded bg-red-100 text-red-700 text-center text-sm">
      {msg}
    </div>
  );
}
