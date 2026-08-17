import { useState } from "react";

function CCTVViewer({ camera, onClose }) {
  const [playing, setPlaying] = useState(false);

  if (!camera) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <h2 className="text-sm font-bold text-slate-900">
                {camera.name}
              </h2>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              {camera.id} • {camera.area}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>

        </div>

        {/* Viewer */}
        <div className="relative flex h-[55vh] min-h-[320px] items-center justify-center bg-slate-950">

          {camera.status === "Online" ? (
            <>

              {/* Temporary camera feed */}
              <div className="text-center">

                <div className="text-6xl">
                  📹
                </div>

                <p className="mt-4 text-sm font-semibold text-white">
                  LIVE CCTV FEED
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {camera.name}
                </p>

                <button
                  onClick={() =>
                    setPlaying((previous) => !previous)
                  }
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  {playing ? "Pause Feed" : "Start Feed"}
                </button>

              </div>

              {/* Live indicator */}
              <div className="absolute left-4 top-4 rounded-lg bg-red-600 px-3 py-1.5 text-[10px] font-bold text-white">
                ● LIVE
              </div>

              {/* Camera ID */}
              <div className="absolute right-4 top-4 rounded-lg bg-black/60 px-3 py-1.5 text-[10px] text-white">
                {camera.id}
              </div>

              {/* Timestamp */}
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-[10px] text-white">
                VIGIL SURVEILLANCE
              </div>

            </>
          ) : (
            <div className="text-center">

              <div className="text-5xl">
                ⚠️
              </div>

              <p className="mt-4 font-semibold text-white">
                Camera Offline
              </p>

              <p className="mt-2 text-xs text-slate-400">
                This camera is currently unavailable.
              </p>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex gap-5">

            <div>
              <p className="text-[10px] text-slate-400">
                Status
              </p>

              <p className="text-xs font-semibold text-green-600">
                {camera.status}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">
                Location
              </p>

              <p className="text-xs font-semibold text-slate-700">
                {camera.area}
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Close Viewer
          </button>

        </div>

      </div>

    </div>
  );
}

export default CCTVViewer;