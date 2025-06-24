// frontend/src/components/Spinner.jsx
/**
 * Minimal inline spinner.
 * - size = diameter in rems (default 1.5rem → size={6})
 * - className lets you tweak margin, color, etc. from the parent
 *
 * Example:
 *   {loading && <Spinner className="mx-auto my-8 text-blue-400" />}
 */
export default function Spinner({ size = 6, className = "" }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      style={{ width: `${size / 4}rem`, height: `${size / 4}rem` }}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-70"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
      />
    </svg>
  );
}
