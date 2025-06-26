import { useEffect, useRef, useState } from "react";
import { api }          from "../services/nasaApi";
import Spinner          from "../components/Spinner";
import ErrorBanner      from "../components/ErrorBanner";
import LoadingOverlay   from "../components/LoadingOverlay";

/* helper: return Promise that resolves when <img> finishes */
const preload = url =>
  new Promise(res => {
    const img = new Image();
    img.onload = res;
    img.onerror = res;          
    img.src = url;
  });

export default function EpicCarousel() {
  const todayISO = new Date().toISOString().split("T")[0];

  const [date,        setDate]        = useState("2024-05-01");
  const [images,      setImages]      = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [jsonLoading,  setJsonLoading]  = useState(true);  // fetching list
  const [imgLoading,   setImgLoading]   = useState(false); // pre-caching jpgs
  const [error,        setError]        = useState(false);

  
  /* fetch list on date change */
  useEffect(() => {
    setJsonLoading(true);
    setError(false);

    api.get(`/epic?date=${date}`)
      .then(res => {
        const ready = res.data.map(o => {
          const [yyyy, mm, dd] = o.date.split(" ")[0].split("-");
          return {
            ...o,
            url: `https://epic.gsfc.nasa.gov/archive/natural/${yyyy}/${mm}/${dd}/jpg/${o.image}.jpg`,
          };
        });

        setImages(ready);
        setActiveIndex(0);
        setJsonLoading(false);

        /* ---------- pre-cache all images ---------- */
        setImgLoading(true);
        Promise.allSettled(ready.map(img => preload(img.url))).then(() =>
          setImgLoading(false)
        );
      })
      .catch(() => {
        setError(true);
        setJsonLoading(false);
      });
  }, [date]);

  /* arrow-key navigation (unchanged) */
  useEffect(() => {
    const handleKey = e => {
      if (e.key === "ArrowRight" && activeIndex < images.length - 1)
        setActiveIndex(i => i + 1);
      else if (e.key === "ArrowLeft" && activeIndex > 0)
        setActiveIndex(i => i - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, activeIndex]);

  /* ---------- early UI states ---------- */
  if (jsonLoading)  return <Spinner className="mx-auto mt-16 text-blue-400" />;
  if (error)        return <ErrorBanner msg="EPIC imagery unavailable" />;

  /* overlay while images still caching */
  const showOverlay = imgLoading;

  /* ---------- main render ---------- */
  return (
    <div
      className="min-h-screen bg-black text-white overflow-hidden flex flex-col p-6"
      tabIndex={0}
    >
      {showOverlay && <LoadingOverlay spinnerSize={10} />}
      <h1 className="text-2xl font-bold mb-4 text-center text-[#62aed0]">
        🟦 EPIC Earth Carousel
      </h1>

      <div className="flex flex-1 w-full max-w-screen-xl mx-auto">
        {/* left panel */}
        <div className="w-full md:w-1/3 pr-4">
          <label className="text-lg block mb-2">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            max={todayISO}
            className="p-2 rounded text-black w-full mb-2"
          />
          <p className="text-sm text-gray-400 mb-6">
            Showing Earth photos for {date} ± 1&nbsp;day
          </p>

          {images.length > 0 && (
            <div className="text-sm space-y-2">
              <p className="font-semibold break-words">{images[activeIndex].caption}</p>
              <p className="text-gray-400">
                📍 Lat&nbsp;{images[activeIndex].centroid_coordinates.lat},&nbsp;
                Lon&nbsp;{images[activeIndex].centroid_coordinates.lon}
              </p>
              <p className="text-gray-500">
                🕓 {images[activeIndex].date}<br />
                🧭 ID&nbsp;{images[activeIndex].identifier}
              </p>
              <p className="mt-4 text-blue-400">Use ← / → arrow keys to scroll</p>
            </div>
          )}
        </div>

        {/* right panel */}
        <div className="w-full md:w-2/3 relative flex items-center justify-center">
          {images.length === 0 ? (
            <Spinner />
          ) : (
            <div className="relative w-full">
              <img
                src={images[activeIndex].url}
                alt={images[activeIndex].caption}
                className="w-full max-h-[80vh] object-contain rounded shadow-md"
              />
              {/* progress bar */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-800 rounded-b overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${((activeIndex + 1) / images.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
