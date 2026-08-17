import React, { useState } from "react";

const zones = [
  "Sitabuldi",
  "Wardha Road",
  "Central Avenue",
  "Manewada",
  "Kamptee Road",
  "Dharampeth",
  "Sadar",
  "Ajni",
];

const reasons = [
  "Local officer assessment",
  "Unexpected traffic condition",
  "Emergency situation",
  "Road closure",
  "Insufficient available units",
  "Other",
];

function ManualOverride() {
  const [zone, setZone] = useState("Sitabuldi");
  const [officers, setOfficers] = useState(5);
  const [reason, setReason] = useState(
    "Local officer assessment"
  );
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitOverride = () => {
    setSubmitted(true);
  };

  const resetOverride = () => {
    setSubmitted(false);
    setZone("Sitabuldi");
    setOfficers(5);
    setReason("Local officer assessment");
    setNotes("");
  };

  return (
    <section className="space-y-5">

      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Manual Deployment Override
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Allow an authorized traffic officer to override
          an AI-generated deployment recommendation when
          operational conditions require it.
        </p>
      </div>

      {/* Warning */}
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
            ⚠️
          </div>

          <div>

            <p className="text-sm font-bold text-orange-800">
              Manual Override
            </p>

            <p className="mt-1 text-xs leading-5 text-orange-700">
              Manual changes should only be made by authorized
              personnel when field conditions differ from the
              system recommendation.
            </p>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <h3 className="font-bold text-gray-900">
            Override Parameters
          </h3>

          <div className="mt-5 space-y-5">

            {/* Zone */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Traffic Zone
              </label>

              <select
                value={zone}
                onChange={(event) =>
                  setZone(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                {zones.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

            {/* Officers */}
            <div>

              <div className="flex justify-between">

                <label className="text-xs font-semibold text-gray-700">
                  Officers to Deploy
                </label>

                <span className="text-sm font-bold text-blue-600">
                  {officers}
                </span>

              </div>

              <input
                type="range"
                min="0"
                max="15"
                value={officers}
                onChange={(event) =>
                  setOfficers(
                    Number(event.target.value)
                  )
                }
                className="mt-4 w-full"
              />

              <div className="flex justify-between text-[10px] text-gray-400">
                <span>0</span>
                <span>15</span>
              </div>

            </div>

            {/* Reason */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Reason for Override
              </label>

              <select
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                {reasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

            {/* Notes */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Officer Notes
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={5}
                placeholder="Enter operational reason or field observations..."
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-blue-500"
              />

            </div>

            <button
              onClick={submitOverride}
              className="w-full rounded-xl bg-gray-900 py-3 text-xs font-semibold text-white hover:bg-gray-700"
            >
              Submit Manual Override
            </button>

          </div>

        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <h3 className="font-bold text-gray-900">
            Override Preview
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Review the change before it is recorded.
          </p>

          <div className="mt-5 space-y-3">

            <PreviewItem
              label="Zone"
              value={zone}
            />

            <PreviewItem
              label="Officers"
              value={officers}
            />

            <PreviewItem
              label="Reason"
              value={reason}
            />

            <PreviewItem
              label="Notes"
              value={
                notes.trim()
                  ? notes
                  : "No additional notes provided"
              }
            />

          </div>

          {submitted && (
            <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">

              <p className="text-xs font-bold text-green-700">
                Override Recorded
              </p>

              <p className="mt-1 text-xs leading-5 text-green-700">
                The manual deployment change for{" "}
                <strong>{zone}</strong> has been recorded
                for review.
              </p>

              <button
                onClick={resetOverride}
                className="mt-3 rounded-lg bg-white px-4 py-2 text-[10px] font-semibold text-gray-700 shadow-sm"
              >
                Create Another Override
              </button>

            </div>
          )}

        </div>

      </div>

      {/* Audit information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

        <h3 className="font-bold text-gray-900">
          Override Audit Policy
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <PolicyItem
            icon="🔐"
            title="Authorization"
            description="Only authorized officers should modify deployment."
          />

          <PolicyItem
            icon="📝"
            title="Reason Required"
            description="Every manual change should include an operational reason."
          />

          <PolicyItem
            icon="📊"
            title="Audit Trail"
            description="Override actions can later be stored for analysis."
          />

        </div>

      </div>

    </section>
  );
}

function PreviewItem({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-800">
        {value}
      </p>

    </div>
  );
}

function PolicyItem({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

      <span className="text-xl">
        {icon}
      </span>

      <p className="mt-3 text-xs font-bold text-gray-800">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-5 text-gray-500">
        {description}
      </p>

    </div>
  );
}

export default ManualOverride;