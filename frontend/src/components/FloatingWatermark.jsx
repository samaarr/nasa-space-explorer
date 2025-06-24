// src/components/FloatingWatermark.jsx
export default function FloatingWatermark() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 text-white opacity-70 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      <img src="/nasa-logo.png" alt="NASA Logo" className="w-6 h-6" />
      <span
        className="text-sm font-kosmos tracking-wide"
        style={{ textShadow: '0 0 3px black, 0 0 1px black' }}
        >
        NASA Space Explorer
        </span>
    </div>
  );
}
