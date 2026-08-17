import { useState } from "react";
import {
  cameras as mockCameras,
} from "../data/vigilMockData";

import CCTVViewer from "../components/CCTVViewer";
import VideoUpload from "../components/VideoUpload";

function Cameras({ officer }) {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

 const cameras =
  mockCameras.map(
    (camera, index) => ({
      ...camera,

      type:
        index === 0
          ? "Traffic Junction"
          : index === 1
          ? "Main Road"
          : "Traffic Camera",

      vehicles:
        camera.status === "Online"
          ? 50 + index * 8
          : 0,
    })
  );

  const onlineCount = cameras.filter(
    (camera) => camera.status === "Online"
  ).length;

  const offlineCount = cameras.filter(
    (camera) => camera.status === "Offline"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Surveillance
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            CCTV & Video Control Room
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor Nagpur traffic cameras and upload traffic footage
            for analysis.
          </p>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Upload Traffic Video
        </button>

      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <StatCard
          title="Total Cameras"
          value={cameras.length}
          icon="📹"
          description="Registered CCTV units"
        />

        <StatCard
          title="Online"
          value={onlineCount}
          icon="🟢"
          description="Currently operational"
          valueClass="text-green-600"
        />

        <StatCard
          title="Offline"
          value={offlineCount}
          icon="🔴"
          description="Require attention"
          valueClass="text-red-600"
        />

      </div>

      {/* Camera grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {cameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onOpen={() => setSelectedCamera(camera)}
          />
        ))}

      </div>

      {/* Selected camera viewer */}
      {selectedCamera && (
        <CCTVViewer
          camera={selectedCamera}
          onClose={() => setSelectedCamera(null)}
        />
      )}

      {/* Upload modal */}
      {showUpload && (
        <VideoUpload
          onClose={() => setShowUpload(false)}
        />
      )}

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <span className="text-2xl">
          {icon}
        </span>

      </div>

    </div>
  );
}

function CameraCard({ camera, onOpen }) {
  const online = camera.status === "Online";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Camera preview */}
      <div className="relative flex h-48 items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="text-4xl">
            📹
          </div>

          <p className="mt-2 text-xs font-semibold text-slate-300">
            {online
              ? "LIVE CAMERA FEED"
              : "CAMERA OFFLINE"}
          </p>

        </div>

        {/* Status */}
        <div className="absolute left-3 top-3">

          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
              online
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            ● {camera.status}
          </span>

        </div>

        {/* Camera ID */}
        <span className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-[10px] text-white">
          {camera.id}
        </span>

      </div>

      {/* Information */}
      <div className="p-4">

        <div className="flex items-start justify-between gap-3">

          <div>

            <h3 className="text-sm font-bold text-slate-900">
              {camera.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              📍 {camera.area}
            </p>

          </div>

          <span className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">
            {camera.type}
          </span>

        </div>

        {online && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">

            <div>
              <p className="text-[10px] text-slate-400">
                Traffic Density
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {camera.vehicles}%
              </p>
            </div>

            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${camera.vehicles}%`,
                }}
              />

            </div>

          </div>
        )}

        <button
          onClick={onOpen}
          className="mt-4 w-full rounded-xl bg-blue-50 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          {online ? "Open Camera" : "View Details"}
        </button>

      </div>

    </div>
  );
}

export default Cameras;