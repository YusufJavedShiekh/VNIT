import { useState } from "react";
import { useLocation } from "../context/LocationContext";

function ControlRoom() {
  const { location } = useLocation();

  const [activeTab, setActiveTab] = useState("cctv");

  const [cameraForm, setCameraForm] = useState({
    name: "",
    url: "",
  });

  const [video, setVideo] = useState(null);

  const [cameras, setCameras] = useState([]);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState("info");

  /*
   * --------------------------------------------------
   * LOCATION
   * --------------------------------------------------
   */

  const isNagpurCity =
    location.scope === "nagpur";

  const hasSelectedLocation =
    !isNagpurCity &&
    (location.area || location.street);

  const selectedArea =
    location.area || "";

  const selectedStreet =
    location.street || "";

  const selectedLocationName =
    location.displayName ||
    selectedStreet ||
    selectedArea ||
    "Nagpur City";

  /*
   * --------------------------------------------------
   * MESSAGE
   * --------------------------------------------------
   */

  const showMessage = (
    text,
    type = "info"
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  /*
   * --------------------------------------------------
   * CCTV
   * --------------------------------------------------
   *
   * IMPORTANT:
   * Currently cameras are stored only in React state.
   *
   * Later:
   *
   * React
   * ↓
   * Flask API
   * ↓
   * Database
   *
   * We will replace setCameras() with an API request.
   */

  const handleCameraSubmit = (event) => {
    event.preventDefault();

    setMessage("");

    if (!hasSelectedLocation) {
      showMessage(
        "Select a Nagpur area or street before registering a CCTV camera.",
        "error"
      );

      return;
    }

    if (!cameraForm.name.trim()) {
      showMessage(
        "Please enter a camera name.",
        "error"
      );

      return;
    }

    /*
     * Generate a temporary frontend camera number.
     *
     * Later this should come from the backend/database.
     */
    const cameraNumber =
      `VIGIL-CCTV-${String(
        cameras.length + 1
      ).padStart(3, "0")}`;

    const newCamera = {
      id: Date.now(),

      cameraNumber,

      name: cameraForm.name.trim(),

      area: selectedArea,

      street:
        selectedStreet || selectedArea,

      location:
        selectedLocationName,

      streamUrl:
        cameraForm.url.trim(),

      status: "Registered",

      /*
       * These fields are intentionally
       * ready for backend integration later.
       */
      createdAt:
        new Date().toISOString(),
    };

    setCameras((previous) => [
      ...previous,
      newCamera,
    ]);

    setCameraForm({
      name: "",
      url: "",
    });

    showMessage(
      `${cameraNumber} registered successfully for ${selectedLocationName}.`,
      "success"
    );
  };

  /*
   * --------------------------------------------------
   * REMOVE CCTV
   * --------------------------------------------------
   *
   * Frontend-only for now.
   * Later this will become a DELETE API request.
   */

  const handleRemoveCamera = (cameraId) => {
    setCameras((previous) =>
      previous.filter(
        (camera) =>
          camera.id !== cameraId
      )
    );

    showMessage(
      "CCTV camera removed from the current frontend session.",
      "info"
    );
  };

  /*
   * --------------------------------------------------
   * VIDEO
   * --------------------------------------------------
   *
   * Currently we only select the video.
   *
   * Later:
   *
   * File
   * ↓
   * FormData
   * ↓
   * Flask
   * ↓
   * OpenCV / ML
   * ↓
   * Traffic analysis
   * ↓
   * Dashboard
   */

  const handleVideoSubmit = (event) => {
    event.preventDefault();

    setMessage("");

    if (!hasSelectedLocation) {
      showMessage(
        "Select a Nagpur area or street before uploading traffic footage.",
        "error"
      );

      return;
    }

    if (!video) {
      showMessage(
        "Please select a traffic video first.",
        "error"
      );

      return;
    }

    /*
     * We are NOT sending the file to a backend yet.
     *
     * This is intentionally kept frontend-only.
     */

    showMessage(
      `Video "${video.name}" is ready for backend analysis for ${selectedLocationName}.`,
      "success"
    );
  };

  /*
   * --------------------------------------------------
   * FILTER CAMERAS
   * --------------------------------------------------
   *
   * Only show cameras belonging to the
   * currently selected location.
   */

  const visibleCameras =
    cameras.filter((camera) => {
      if (selectedStreet) {
        return (
          camera.area === selectedArea &&
          camera.street === selectedStreet
        );
      }

      if (selectedArea) {
        return (
          camera.area === selectedArea
        );
      }

      return false;
    });

  return (
    <div className="p-4 md:p-6 lg:p-8">

      {/* ------------------------------------------------
          HEADER
      ------------------------------------------------ */}

      <div className="mb-6">

        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          VIGIL Operations
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Control Room
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage Nagpur traffic CCTV sources and
          prepare traffic footage for analysis.
        </p>

      </div>

      {/* ------------------------------------------------
          CURRENT LOCATION
      ------------------------------------------------ */}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Selected Monitoring Location
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {selectedLocationName}
            </h2>

            {selectedArea && (
              <p className="mt-1 text-sm text-slate-500">
                Area:{" "}
                <span className="font-medium text-slate-700">
                  {selectedArea}
                </span>
              </p>
            )}

            {selectedStreet && (
              <p className="text-sm text-slate-500">
                Road / Street:{" "}
                <span className="font-medium text-slate-700">
                  {selectedStreet}
                </span>
              </p>
            )}

          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3">

            <p className="text-[10px] font-bold uppercase text-slate-400">
              Scope
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {isNagpurCity
                ? "Entire Nagpur City"
                : "Selected Location"}
            </p>

          </div>

        </div>

      </section>

      {/* ------------------------------------------------
          WARNING WHEN NO LOCATION SELECTED
      ------------------------------------------------ */}

      {!hasSelectedLocation && (
        <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <div className="flex gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              ⚠️
            </div>

            <div>

              <p className="font-bold text-amber-800">
                Select a location first
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Search and select a Nagpur area or
                street from the dashboard before
                registering a CCTV camera or preparing
                traffic footage for analysis.
              </p>

            </div>

          </div>

        </section>
      )}

      {/* ------------------------------------------------
          TABS
      ------------------------------------------------ */}

      <div className="mb-5 flex gap-2">

        <button
          type="button"
          onClick={() => {
            setActiveTab("cctv");
            setMessage("");
          }}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
            activeTab === "cctv"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          📹 CCTV Management
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("video");
            setMessage("");
          }}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
            activeTab === "video"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          🎥 Traffic Video
        </button>

      </div>

      {/* ------------------------------------------------
          MESSAGE
      ------------------------------------------------ */}

      {message && (
        <div
          className={`mb-5 rounded-xl border p-4 text-sm ${
            messageType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : messageType === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* =================================================
          CCTV TAB
      ================================================= */}

      {activeTab === "cctv" && (
        <div className="space-y-6">

          {/* REGISTER CCTV */}

          <form
            onSubmit={handleCameraSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <div className="mb-5">

              <h2 className="text-lg font-bold text-slate-900">
                Register CCTV Camera
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Register a camera for the currently
                selected Nagpur location.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <Input
                label="Camera Name"
                value={cameraForm.name}
                onChange={(value) =>
                  setCameraForm({
                    ...cameraForm,
                    name: value,
                  })
                }
                placeholder="Sadar Main Camera"
              />

              <ReadOnlyField
                label="Area"
                value={
                  selectedArea ||
                  "Select an area"
                }
              />

              <ReadOnlyField
                label="Road / Street"
                value={
                  selectedStreet ||
                  selectedArea ||
                  "Select a street"
                }
              />

              <ReadOnlyField
                label="Camera Location"
                value={
                  selectedLocationName
                }
              />

              <div className="md:col-span-2">

                <Input
                  label="Camera Stream URL (optional)"
                  value={cameraForm.url}
                  onChange={(value) =>
                    setCameraForm({
                      ...cameraForm,
                      url: value,
                    })
                  }
                  placeholder="rtsp://camera-stream..."
                />

                <p className="mt-1 text-xs text-slate-400">
                  Backend integration will connect
                  this stream later.
                </p>

              </div>

            </div>

            <button
              type="submit"
              disabled={!hasSelectedLocation}
              className={`mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                hasSelectedLocation
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              Register CCTV Camera
            </button>

          </form>

          {/* REGISTERED CAMERAS */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <h2 className="font-bold text-slate-900">
                    CCTV Cameras
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Cameras registered for the selected
                    Nagpur location.
                  </p>

                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                  {visibleCameras.length} Camera
                  {visibleCameras.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>

            </div>

            {visibleCameras.length === 0 ? (
              <div className="p-8 text-center">

                <div className="text-4xl">
                  📹
                </div>

                <p className="mt-3 font-semibold text-slate-700">
                  No CCTV registered
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  No camera has been registered for
                  this selected location in the
                  current frontend session.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-slate-100">

                {visibleCameras.map(
                  (camera) => (
                    <div
                      key={camera.id}
                      className="p-5"
                    >

                      <div className="flex flex-col gap-4 md:flex-row md:items-center">

                        {/* CAMERA NUMBER */}

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          📹
                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-bold text-slate-900">
                              {camera.cameraNumber}
                            </h3>

                            <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold uppercase text-green-600">
                              {camera.status}
                            </span>

                          </div>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {camera.name}
                          </p>

                          <div className="mt-2 grid gap-1 text-xs text-slate-500 md:grid-cols-3">

                            <span>
                              Area:{" "}
                              <strong className="text-slate-700">
                                {camera.area}
                              </strong>
                            </span>

                            <span>
                              Street:{" "}
                              <strong className="text-slate-700">
                                {camera.street}
                              </strong>
                            </span>

                            <span>
                              Place:{" "}
                              <strong className="text-slate-700">
                                {camera.location}
                              </strong>
                            </span>

                          </div>

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveCamera(
                              camera.id
                            )
                          }
                          className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </div>
      )}

      {/* =================================================
          VIDEO TAB
      ================================================= */}

      {activeTab === "video" && (
        <form
          onSubmit={handleVideoSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          <div className="mb-6">

            <h2 className="text-lg font-bold text-slate-900">
              Traffic Video Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select traffic footage associated with
              the current Nagpur location.
            </p>

          </div>

          {/* LOCATION INFORMATION */}

          <div className="mb-5 grid gap-4 md:grid-cols-2">

            <ReadOnlyField
              label="Area"
              value={
                selectedArea ||
                "Select an area"
              }
            />

            <ReadOnlyField
              label="Road / Street"
              value={
                selectedStreet ||
                selectedArea ||
                "Select a street"
              }
            />

          </div>

          {/* FILE UPLOAD */}

          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">

            <div className="text-5xl">
              🎥
            </div>

            <p className="mt-4 font-bold text-slate-800">
              Select traffic footage
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Supported formats: MP4, AVI, MOV,
              WebM
            </p>

            <label className="mt-5 inline-flex cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">

              Select Video

              <input
                type="file"
                accept="video/mp4,video/avi,video/quicktime,video/webm,video/*"
                className="hidden"
                onChange={(event) => {
                  const selected =
                    event.target.files?.[0] ||
                    null;

                  setVideo(selected);

                  if (selected) {
                    setMessage("");
                  }
                }}
              />

            </label>

            {video && (
              <div className="mx-auto mt-5 max-w-md rounded-xl bg-slate-50 p-4 text-left">

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Selected File
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {video.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {(video.size / 1024 / 1024).toFixed(
                    2
                  )}{" "}
                  MB
                </p>

              </div>
            )}

          </div>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

            <p className="text-sm font-semibold text-blue-800">
              Backend analysis status
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Video analysis will be connected to
              the Python/Flask backend later. The
              frontend currently prepares the selected
              footage and location information only.
            </p>

          </div>

          <button
            type="submit"
            disabled={
              !hasSelectedLocation ||
              !video
            }
            className={`mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
              hasSelectedLocation && video
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            Prepare Video for Analysis
          </button>

        </form>
      )}

    </div>
  );
}

/*
 * ------------------------------------------------------
 * INPUT COMPONENT
 * ------------------------------------------------------
 */

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </label>
  );
}

/*
 * ------------------------------------------------------
 * READ ONLY FIELD
 * ------------------------------------------------------
 */

function ReadOnlyField({
  label,
  value,
}) {
  return (
    <div>

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        {value}
      </div>

    </div>
  );
}

export default ControlRoom;
