import Spinner from "./Spinner";

/**
 * Full-screen loading overlay.
 * • covers the viewport
 * • applies CSS blur via filter on a pseudo-element
 * • shows a centered Spinner
 *
 * To use, just render {loading && <LoadingOverlay />} anywhere in your app.
 */
export default function LoadingOverlay({ spinnerSize = 8 }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{
        backdropFilter: "blur(4px)",        // blur anything behind
        background: "rgba(0,0,0,0.35)",     // subtle dark tint
      }}
    >
      <Spinner size={spinnerSize} className="text-white" />
    </div>
  );
}
