import { useEffect, useState } from "react";

import { useLocation } from "../context/LocationContext";

import {
  uploadTrafficVideosSequentially,
  getVideoAnalysisHistory,
} from "../services/videoApi";


const MAX_VIDEO_SIZE =
  1 * 1024 * 1024 * 1024;

const MAX_VIDEOS_PER_BATCH = 10;


function ControlRoom() {

  const { location } =
    useLocation();


  // --------------------------------------------------
  // ACTIVE TAB
  // --------------------------------------------------

  const [activeTab, setActiveTab] =
    useState("cctv");


  // --------------------------------------------------
  // CCTV FORM
  // --------------------------------------------------

  const [cameraForm, setCameraForm] =
    useState({
      name: "",
      url: "",
    });


  // --------------------------------------------------
  // VIDEO STATE
  // --------------------------------------------------

  const [videos, setVideos] =
    useState([]);

  const [processingVideos,
    setProcessingVideos] =
    useState(false);

  const [progress, setProgress] =
    useState({
      current: 0,
      total: 0,
      filename: "",
      status: "",
    });


  // --------------------------------------------------
  // MESSAGES
  // --------------------------------------------------

  const [message, setMessage] =
    useState("");

  const [messageType,
    setMessageType] =
    useState("info");


  // --------------------------------------------------
  // STORED RESULTS
  // --------------------------------------------------

  const [
    analysisResults,
    setAnalysisResults
  ] = useState([]);

  const [
    loadingHistory,
    setLoadingHistory
  ] = useState(false);


  // --------------------------------------------------
  // MOCK CCTV CAMERAS
  // --------------------------------------------------

  const [cameras, setCameras] =
    useState([
      {
        id: "mock-001",
        cameraNumber:
          "VIGIL-CCTV-001",
        name:
          "Sitabuldi Main Junction",
        area:
          "Sitabuldi",
        street:
          "Main Road",
        location:
          "Sitabuldi Main Junction",
        streamUrl:
          "rtsp://192.168.1.101:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-002",
        cameraNumber:
          "VIGIL-CCTV-002",
        name:
          "Dharampeth Traffic Camera",
        area:
          "Dharampeth",
        street:
          "West High Court Road",
        location:
          "Dharampeth",
        streamUrl:
          "rtsp://192.168.1.102:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-003",
        cameraNumber:
          "VIGIL-CCTV-003",
        name:
          "Wardha Road Junction",
        area:
          "Wardha Road",
        street:
          "Wardha Road",
        location:
          "Wardha Road Junction",
        streamUrl:
          "rtsp://192.168.1.103:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-004",
        cameraNumber:
          "VIGIL-CCTV-004",
        name:
          "Manish Nagar Camera",
        area:
          "Manish Nagar",
        street:
          "Manish Nagar Main Road",
        location:
          "Manish Nagar",
        streamUrl:
          "rtsp://192.168.1.104:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-005",
        cameraNumber:
          "VIGIL-CCTV-005",
        name:
          "Sadar Traffic Camera",
        area:
          "Sadar",
        street:
          "Sadar Main Road",
        location:
          "Sadar",
        streamUrl:
          "rtsp://192.168.1.105:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-006",
        cameraNumber:
          "VIGIL-CCTV-006",
        name:
          "Civil Lines Junction",
        area:
          "Civil Lines",
        street:
          "Civil Lines Road",
        location:
          "Civil Lines",
        streamUrl:
          "rtsp://192.168.1.106:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-007",
        cameraNumber:
          "VIGIL-CCTV-007",
        name:
          "Cotton Market Camera",
        area:
          "Cotton Market",
        street:
          "Cotton Market Road",
        location:
          "Cotton Market",
        streamUrl:
          "rtsp://192.168.1.107:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-008",
        cameraNumber:
          "VIGIL-CCTV-008",
        name:
          "Mahal Traffic Camera",
        area:
          "Mahal",
        street:
          "Mahal Road",
        location:
          "Mahal",
        streamUrl:
          "rtsp://192.168.1.108:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-009",
        cameraNumber:
          "VIGIL-CCTV-009",
        name:
          "Lakadganj Junction",
        area:
          "Lakadganj",
        street:
          "Lakadganj Road",
        location:
          "Lakadganj",
        streamUrl:
          "rtsp://192.168.1.109:554/stream",
        status:
          "Online",
      },

      {
        id: "mock-010",
        cameraNumber:
          "VIGIL-CCTV-010",
        name:
          "Itwari Traffic Camera",
        area:
          "Itwari",
        street:
          "Itwari Main Road",
        location:
          "Itwari",
        streamUrl:
          "rtsp://192.168.1.110:554/stream",
        status:
          "Online",
      },
    ]);


  // --------------------------------------------------
  // LOCATION
  // --------------------------------------------------

  const isNagpurCity =
    location.scope === "nagpur";

  const hasSelectedLocation =
    !isNagpurCity &&
    (
      location.area ||
      location.street
    );

  const selectedArea =
    location.area || "";

  const selectedStreet =
    location.street || "";

  const selectedLocationName =
    location.displayName ||
    selectedStreet ||
    selectedArea ||
    "Nagpur City";


  // --------------------------------------------------
  // MESSAGE HELPER
  // --------------------------------------------------

  const showMessage = (
    text,
    type = "info"
  ) => {
    setMessage(text);
    setMessageType(type);
  };


  // --------------------------------------------------
  // LOAD STORED ANALYSIS
  // --------------------------------------------------

  useEffect(() => {

    let active = true;


    async function loadHistory() {

      if (!selectedArea) {
        setAnalysisResults([]);
        return;
      }


      setLoadingHistory(true);


      try {

        const response =
          await getVideoAnalysisHistory(
            selectedArea
          );


        if (!active) {
          return;
        }


        setAnalysisResults(
          response.results || []
        );

      } catch (error) {

        console.error(
          "Unable to load video analysis history:",
          error
        );

      } finally {

        if (active) {
          setLoadingHistory(false);
        }

      }
    }


    loadHistory();


    return () => {
      active = false;
    };

  }, [selectedArea]);


  // --------------------------------------------------
  // CCTV REGISTER
  // --------------------------------------------------

  const handleCameraSubmit = (
    event
  ) => {

    event.preventDefault();


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


    const cameraNumber =
      `VIGIL-CCTV-${String(
        cameras.length + 1
      ).padStart(3, "0")}`;


    const newCamera = {

      id:
        `camera-${Date.now()}`,

      cameraNumber,

      name:
        cameraForm.name.trim(),

      area:
        selectedArea,

      street:
        selectedStreet ||
        selectedArea,

      location:
        selectedLocationName,

      streamUrl:
        cameraForm.url.trim(),

      status:
        "Registered",
    };


    setCameras(
      previous => [
        ...previous,
        newCamera,
      ]
    );


    setCameraForm({
      name: "",
      url: "",
    });


    showMessage(
      `${cameraNumber} registered successfully.`,
      "success"
    );
  };


  // --------------------------------------------------
  // CCTV REMOVE
  // --------------------------------------------------

  const handleRemoveCamera = (
    cameraId
  ) => {

    setCameras(
      previous =>
        previous.filter(
          camera =>
            camera.id !==
            cameraId
        )
    );


    showMessage(
      "CCTV camera removed.",
      "info"
    );
  };


  // --------------------------------------------------
  // VIDEO SELECT
  // --------------------------------------------------

  const handleVideoChange = (
    event
  ) => {

    const selectedFiles =
      Array.from(
        event.target.files || []
      );


    if (!selectedFiles.length) {
      return;
    }


    if (
      selectedFiles.length >
      MAX_VIDEOS_PER_BATCH
    ) {

      showMessage(
        `You can select a maximum of ${MAX_VIDEOS_PER_BATCH} videos at once.`,
        "error"
      );

      event.target.value = "";

      return;
    }


    const oversizedFile =
      selectedFiles.find(
        file =>
          file.size >
          MAX_VIDEO_SIZE
      );


    if (oversizedFile) {

      showMessage(
        `"${oversizedFile.name}" is larger than the 1 GB limit.`,
        "error"
      );

      event.target.value = "";

      return;
    }


    setVideos(
      selectedFiles
    );


    setProgress({
      current: 0,
      total:
        selectedFiles.length,
      filename: "",
      status: "",
    });


    setMessage("");
  };


  // --------------------------------------------------
  // VIDEO PROCESSING
  // --------------------------------------------------

  const handleVideoSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (!hasSelectedLocation) {

      showMessage(
        "Select a Nagpur area or street before analyzing traffic footage.",
        "error"
      );

      return;
    }


    if (!videos.length) {

      showMessage(
        "Please select at least one video.",
        "error"
      );

      return;
    }


    setProcessingVideos(true);

    setAnalysisResults([]);


    try {

      const results =
        await uploadTrafficVideosSequentially(
          videos,
          selectedArea,
          status => {

            setProgress(
              status
            );

          }
        );


      const successful =
        results.filter(
          item =>
            item.success
        );


      const failed =
        results.filter(
          item =>
            !item.success
        );


      const storedResults =
        successful.map(
          item =>
            item.result
        );


      setAnalysisResults(
        previous => [
          ...storedResults,
          ...previous,
        ]
      );


      if (
        failed.length === 0
      ) {

        showMessage(
          `${successful.length} video${successful.length !== 1 ? "s" : ""} analyzed successfully and stored.`,
          "success"
        );

      } else {

        showMessage(
          `${successful.length} video${successful.length !== 1 ? "s" : ""} analyzed successfully. ${failed.length} failed.`,
          "error"
        );
      }


      setVideos([]);


    } catch (error) {

      console.error(
        "Video processing error:",
        error
      );


      showMessage(
        error.message ||
        "Video processing failed.",
        "error"
      );

    } finally {

      setProcessingVideos(
        false
      );

    }
  };


  // --------------------------------------------------
  // VISIBLE CAMERAS
  // --------------------------------------------------

  const visibleCameras =
    cameras.filter(
      camera => {

        if (selectedStreet) {

          return (
            camera.area ===
              selectedArea &&
            camera.street ===
              selectedStreet
          );
        }


        if (selectedArea) {

          return (
            camera.area ===
            selectedArea
          );
        }


        return false;
      }
    );


  // --------------------------------------------------
  // RESULT HELPERS
  // --------------------------------------------------

  const getResultData = (
    item
  ) => {

    if (
      item?.results
    ) {
      return item.results;
    }


    if (
      item?.result?.results
    ) {
      return item.result.results;
    }


    return {};
  };


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="p-4 md:p-6 lg:p-8">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          VIGIL Operations
        </p>


        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Control Room
        </h1>


        <p className="mt-2 text-sm text-slate-500">
          Manage Nagpur traffic CCTV sources and analyze traffic footage.
        </p>

      </div>


      {/* =================================================
          CURRENT LOCATION
      ================================================= */}

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


      {/* =================================================
          LOCATION WARNING
      ================================================= */}

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
                Search and select a Nagpur area or street from the dashboard before registering a CCTV camera or analyzing traffic footage.
              </p>

            </div>

          </div>

        </section>

      )}


      {/* =================================================
          TABS
      ================================================= */}

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


      {/* =================================================
          MESSAGE
      ================================================= */}

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


          {/* CCTV FORM */}

          <form
            onSubmit={
              handleCameraSubmit
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <div className="mb-5">

              <h2 className="text-lg font-bold text-slate-900">
                Register CCTV Camera
              </h2>


              <p className="mt-1 text-sm text-slate-500">
                Register a camera for the currently selected Nagpur location.
              </p>

            </div>


            <div className="grid gap-4 md:grid-cols-2">


              <Input
                label="Camera Name"
                value={
                  cameraForm.name
                }
                onChange={
                  value =>
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
                  label="Camera Stream URL"
                  value={
                    cameraForm.url
                  }
                  onChange={
                    value =>
                      setCameraForm({
                        ...cameraForm,
                        url: value,
                      })
                  }
                  placeholder="rtsp://camera-stream..."
                />


                <p className="mt-1 text-xs text-slate-400">
                  Example: rtsp://192.168.1.100:554/stream
                </p>

              </div>

            </div>


            <button
              type="submit"
              disabled={
                !hasSelectedLocation
              }
              className={`mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                hasSelectedLocation
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              Register CCTV Camera
            </button>

          </form>


          {/* MOCK + REGISTERED CAMERAS */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">


            <div className="border-b border-slate-200 p-5">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <h2 className="font-bold text-slate-900">
                    CCTV Cameras
                  </h2>


                  <p className="mt-1 text-xs text-slate-500">
                    CCTV sources available for the selected Nagpur location.
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
                  No camera is currently registered for this location.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {visibleCameras.map(
                  camera => (

                    <div
                      key={
                        camera.id
                      }
                      className="p-5"
                    >

                      <div className="flex flex-col gap-4 md:flex-row md:items-center">


                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          📹
                        </div>


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
                              Location:{" "}

                              <strong className="text-slate-700">
                                {camera.location}
                              </strong>
                            </span>

                          </div>


                          <p className="mt-2 truncate text-[11px] text-slate-400">
                            {camera.streamUrl}
                          </p>

                        </div>


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
          onSubmit={
            handleVideoSubmit
          }
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >


          <div className="mb-6">

            <h2 className="text-lg font-bold text-slate-900">
              Traffic Video Analysis
            </h2>


            <p className="mt-1 text-sm text-slate-500">
              Select one or more traffic videos for sequential VIGIL analysis.
            </p>

          </div>


          {/* LOCATION */}

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


          {/* UPLOAD AREA */}

          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">


            <div className="text-5xl">
              🎥
            </div>


            <p className="mt-4 font-bold text-slate-800">
              Select traffic footage
            </p>


            <p className="mt-1 text-xs text-slate-500">
              MP4, AVI, MOV, MKV or WebM
            </p>


            <p className="mt-1 text-xs text-slate-400">
              Maximum 1 GB per video • Maximum 10 videos per batch
            </p>


            <label className="mt-5 inline-flex cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">

              Select Videos


              <input
                type="file"
                multiple
                accept="video/mp4,video/avi,video/quicktime,video/webm,video/x-matroska,video/*"
                className="hidden"
                onChange={
                  handleVideoChange
                }
              />

            </label>


            {/* SELECTED VIDEOS */}

            {videos.length > 0 && (

              <div className="mx-auto mt-5 max-w-2xl space-y-2 text-left">

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Selected Videos ({videos.length})
                </p>


                {videos.map(
                  (file, index) => (

                    <div
                      key={`${file.name}-${index}`}
                      className="rounded-xl bg-slate-50 p-3"
                    >

                      <div className="flex items-center justify-between gap-3">

                        <p className="truncate text-sm font-semibold text-slate-800">
                          {index + 1}.{" "}
                          {file.name}
                        </p>


                        <span className="shrink-0 text-xs text-slate-500">
                          {(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* =================================================
              PROCESSING STATUS
          ================================================= */}

          {processingVideos && (

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">


              <div className="flex items-center justify-between">

                <p className="text-sm font-semibold text-blue-800">
                  Processing videos sequentially
                </p>


                <span className="text-xs font-bold text-blue-600">
                  {progress.current} /{" "}
                  {progress.total}
                </span>

              </div>


              {progress.filename && (

                <p className="mt-2 truncate text-xs text-blue-600">
                  {progress.filename}
                </p>

              )}


              <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">

                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width:
                      progress.total
                        ? `${
                            (
                              progress.current /
                              progress.total
                            ) * 100
                          }%`
                        : "0%",
                  }}
                />

              </div>


              <p className="mt-2 text-[11px] text-blue-500">
                The next video starts only after the current video has completed processing.
              </p>

            </div>

          )}


          {/* =================================================
              BACKEND INFORMATION
          ================================================= */}

          {!processingVideos && (

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

              <p className="text-sm font-semibold text-blue-800">
                VIGIL Analysis Pipeline
              </p>


              <p className="mt-1 text-xs leading-5 text-blue-700">
                Each video is processed through vehicle detection, object tracking, speed estimation, traffic analysis, incident detection and the VIGIL risk model. Completed results are stored for later use.
              </p>

            </div>

          )}


          {/* =================================================
              ANALYZE BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={
              !hasSelectedLocation ||
              videos.length === 0 ||
              processingVideos
            }
            className={`mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
              hasSelectedLocation &&
              videos.length > 0 &&
              !processingVideos
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >

            {processingVideos
              ? "Processing Videos..."
              : `Analyze ${
                  videos.length
                    ? videos.length
                    : ""
                } Video${
                  videos.length !== 1
                    ? "s"
                    : ""
                }`}

          </button>


          {/* =================================================
              STORED RESULTS
          ================================================= */}

          <section className="mt-8 border-t border-slate-200 pt-6">


            <div className="flex items-center justify-between gap-3">

              <div>

                <h3 className="font-bold text-slate-900">
                  Processed Video Results
                </h3>


                <p className="mt-1 text-xs text-slate-500">
                  Completed VIGIL analyses stored for this area.
                </p>

              </div>


              {loadingHistory && (

                <span className="text-xs text-slate-400">
                  Loading...
                </span>

              )}

            </div>


            {/* NO RESULTS */}

            {!loadingHistory &&
              analysisResults.length === 0 && (

                <div className="mt-4 rounded-xl bg-slate-50 p-6 text-center">

                  <div className="text-3xl">
                    📊
                  </div>


                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    No processed videos yet
                  </p>


                  <p className="mt-1 text-xs text-slate-400">
                    Completed video analysis results will appear here.
                  </p>

                </div>

              )}


            {/* RESULTS */}

            <div className="mt-4 space-y-4">

              {analysisResults.map(
                (item, index) => {

                  const result =
                    getResultData(
                      item
                    );


                  const traffic =
                    result.traffic ||
                    {};


                  const risk =
                    result.risk ||
                    {};


                  const incidents =
                    result.incidents ||
                    [];


                  const video =
                    result.video ||
                    {};


                  return (

                    <div
                      key={
                        item.analysis_id ||
                        `${item.filename}-${index}`
                      }
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >


                      {/* RESULT HEADER */}

                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">


                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-600">
                              Analysis
                            </span>


                            {item.area && (

                              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                {item.area}
                              </span>

                            )}

                          </div>


                          <h4 className="mt-2 truncate text-sm font-bold text-slate-900">
                            {item.original_filename ||
                              item.filename ||
                              "Traffic Video"}
                          </h4>


                          {item.completed_at && (

                            <p className="mt-1 text-[11px] text-slate-400">
                              Completed:{" "}
                              {new Date(
                                item.completed_at
                              ).toLocaleString()}
                            </p>

                          )}

                        </div>


                        {/* RISK */}

                        <div
                          className={`rounded-xl px-4 py-3 text-center ${
                            risk.risk_level ===
                            "High"
                              ? "bg-red-50"
                              : risk.risk_level ===
                                "Medium"
                              ? "bg-amber-50"
                              : "bg-green-50"
                          }`}
                        >

                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Risk
                          </p>


                          <p
                            className={`mt-1 text-lg font-bold ${
                              risk.risk_level ===
                              "High"
                                ? "text-red-600"
                                : risk.risk_level ===
                                  "Medium"
                                ? "text-amber-600"
                                : "text-green-600"
                            }`}
                          >
                            {risk.risk_score !==
                            undefined
                              ? risk.risk_score
                              : "--"}
                          </p>


                          <p
                            className={`text-[10px] font-bold uppercase ${
                              risk.risk_level ===
                              "High"
                                ? "text-red-600"
                                : risk.risk_level ===
                                  "Medium"
                                ? "text-amber-600"
                                : "text-green-600"
                            }`}
                          >
                            {risk.risk_level ||
                              "Unknown"}
                          </p>

                        </div>

                      </div>


                      {/* METRICS */}

                      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">


                        <ResultMetric
                          label="Vehicles"
                          value={
                            traffic.average_vehicle_count ??
                            0
                          }
                        />


                        <ResultMetric
                          label="Avg Speed"
                          value={`${
                            traffic.average_speed_kmh ??
                            0
                          } km/h`}
                        />


                        <ResultMetric
                          label="Density"
                          value={
                            traffic.traffic_density ||
                            "Unknown"
                          }
                        />


                        <ResultMetric
                          label="Incidents"
                          value={
                            incidents.length
                          }
                        />

                      </div>


                      {/* VIDEO INFO */}

                      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-4">


                        <SmallInfo
                          label="FPS"
                          value={
                            video.fps ??
                            "--"
                          }
                        />


                        <SmallInfo
                          label="Total Frames"
                          value={
                            video.total_frames ??
                            "--"
                          }
                        />


                        <SmallInfo
                          label="Processed Frames"
                          value={
                            video.processed_frames ??
                            "--"
                          }
                        />


                        <SmallInfo
                          label="Resolution"
                          value={
                            video.width &&
                            video.height
                              ? `${video.width} × ${video.height}`
                              : "--"
                          }
                        />

                      </div>


                      {/* INCIDENTS */}

                      {incidents.length >
                        0 && (

                        <div className="mt-4">

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Detected Incidents
                          </p>


                          <div className="mt-2 space-y-2">

                            {incidents.map(
                              (
                                incident,
                                incidentIndex
                              ) => (

                                <div
                                  key={
                                    `${incident.type}-${incident.vehicle_id}-${incidentIndex}`
                                  }
                                  className="flex flex-col gap-2 rounded-xl border border-red-100 bg-red-50 p-3 md:flex-row md:items-center md:justify-between"
                                >

                                  <div>

                                    <p className="text-xs font-bold capitalize text-red-700">
                                      {(
                                        incident.type ||
                                        "Incident"
                                      ).replace(
                                        /_/g,
                                        " "
                                      )}
                                    </p>


                                    <p className="mt-1 text-[11px] text-red-500">
                                      Vehicle ID:{" "}
                                      {incident.vehicle_id ??
                                        "--"}
                                    </p>

                                  </div>


                                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase text-red-600">
                                    {incident.severity ||
                                      "Detected"}
                                  </span>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      )}


                      {/* RISK MODEL DETAILS */}

                      {risk.features && (

                        <details className="mt-4">

                          <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-700">
                            View risk model features
                          </summary>


                          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">

                            <SmallInfo
                              label="Hour"
                              value={
                                risk.features.hour
                              }
                            />


                            <SmallInfo
                              label="Day"
                              value={
                                risk.features.day_of_week
                              }
                            />


                            <SmallInfo
                              label="Vehicle Count"
                              value={
                                risk.features.vehicle_count
                              }
                            />


                            <SmallInfo
                              label="Average Speed"
                              value={
                                risk.features.average_speed_kmh
                              }
                            />


                            <SmallInfo
                              label="Density Score"
                              value={
                                risk.features.traffic_density_score
                              }
                            />


                            <SmallInfo
                              label="Accident Count"
                              value={
                                risk.features.accident_count
                              }
                            />

                          </div>

                        </details>

                      )}

                    </div>

                  );

                }
              )}

            </div>

          </section>

        </form>

      )}

    </div>
  );
}


// ======================================================
// INPUT
// ======================================================

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
        onChange={
          event =>
            onChange(
              event.target.value
            )
        }
        placeholder={
          placeholder
        }
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </label>

  );
}


// ======================================================
// READ ONLY FIELD
// ======================================================

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


// ======================================================
// RESULT METRIC
// ======================================================

function ResultMetric({
  label,
  value,
}) {

  return (

    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>


      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>

  );
}


// ======================================================
// SMALL INFORMATION
// ======================================================

function SmallInfo({
  label,
  value,
}) {

  return (

    <div>

      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>


      <p className="mt-1 text-xs font-semibold text-slate-700">
        {value ?? "--"}
      </p>

    </div>

  );
}


export default ControlRoom;