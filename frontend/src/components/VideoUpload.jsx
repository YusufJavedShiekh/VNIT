import { useState } from "react";
import {
  uploadTrafficVideo,
} from "../services/videoApi";

function VideoUpload({ onClose }) {
  const [file, setFile] = useState(null);
  const [area, setArea] = useState("Sitabuldi");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!file) {
    setMessage(
      "Please select a video file."
    );
    return;
  }

  setUploading(true);
  setMessage("");

  try {
    const result =
      await uploadTrafficVideo(
        file,
        area
      );

    setMessage(
      result.message ||
        "Video uploaded successfully."
    );
  } catch (error) {
    console.error(error);

    setMessage(
      "Video upload failed. Backend analysis will be available when Flask is connected."
    );
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>

            <h2 className="text-base font-bold text-slate-900">
              Upload Traffic Video
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Submit footage for future AI traffic analysis.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* Area */}
          <div>

            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Traffic Area
            </label>

            <select
              value={area}
              onChange={(event) =>
                setArea(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option>Sitabuldi</option>
              <option>Dharampeth</option>
              <option>Wardha Road</option>
              <option>Manish Nagar</option>
              <option>Sadar</option>
              <option>Civil Lines</option>
              <option>Cotton Market</option>
              <option>Mahal</option>
              <option>Lakadganj</option>
              <option>Itwari</option>
            </select>

          </div>

          {/* File */}
          <div>

            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Video File
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50">

              <span className="text-4xl">
                🎥
              </span>

              <span className="mt-3 text-sm font-semibold text-slate-700">
                {file
                  ? file.name
                  : "Choose a traffic video"}
              </span>

              <span className="mt-1 text-[10px] text-slate-400">
                MP4, MOV, AVI or WebM
              </span>

              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>

          </div>

          {/* Selected file */}
          {file && (
            <div className="rounded-xl bg-blue-50 p-3">

              <p className="text-xs font-semibold text-blue-800">
                Selected file
              </p>

              <p className="mt-1 truncate text-[10px] text-blue-600">
                {file.name}
              </p>

              <p className="mt-1 text-[10px] text-blue-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>

            </div>
          )}

          {/* Message */}
          {message && (
            <div className="rounded-xl bg-green-50 p-3 text-xs text-green-700">
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Processing..."
                : "Submit Video"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default VideoUpload;