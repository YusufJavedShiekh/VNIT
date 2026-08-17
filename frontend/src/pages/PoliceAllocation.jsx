import { useState } from "react";
import { useLocation } from "../context/LocationContext";

const allocationData = {
  Sadar: {
    required: 18,
    deployed: 12,
    risk: 82,
    streets: [
      {
        street: "Sadar Main Road",
        required: 10,
        deployed: 7,
      },
      {
        street: "Residency Road",
        required: 8,
        deployed: 5,
      },
    ],
  },

  Sitabuldi: {
    required: 20,
    deployed: 14,
    risk: 92,
    streets: [
      {
        street: "Sitabuldi Main Road",
        required: 11,
        deployed: 8,
      },
      {
        street: "Central Avenue",
        required: 9,
        deployed: 6,
      },
    ],
  },

  "Wardha Road": {
    required: 16,
    deployed: 11,
    risk: 84,
    streets: [
      {
        street: "Wardha Road",
        required: 9,
        deployed: 6,
      },
      {
        street: "Airport Road",
        required: 7,
        deployed: 5,
      },
    ],
  },

  Dharampeth: {
    required: 14,
    deployed: 10,
    risk: 76,
    streets: [
      {
        street: "West High Court Road",
        required: 8,
        deployed: 6,
      },
      {
        street: "North Ambazari Road",
        required: 6,
        deployed: 4,
      },
    ],
  },
};

function PoliceAllocation() {
  const { location } = useLocation();

  const [manualDeployed, setManualDeployed] =
    useState("");

  const [shift, setShift] =
    useState("");

  const [note, setNote] =
    useState("");

  const [message, setMessage] =
    useState("");

  const data =
    allocationData[location.area] || null;

  const isStreetSelected =
    location.street &&
    data?.streets?.some(
      (item) =>
        item.street === location.street
    );

  const streetData =
    isStreetSelected
      ? data.streets.find(
          (item) =>
            item.street ===
            location.street
        )
      : null;

  const required =
    streetData?.required ??
    data?.required ??
    0;

  const defaultDeployed =
    streetData?.deployed ??
    data?.deployed ??
    0;

  const deployed =
    manualDeployed === ""
      ? defaultDeployed
      : Number(manualDeployed);

  const gap = Math.max(
    required - deployed,
    0
  );

  const excess = Math.max(
    deployed - required,
    0
  );

  const risk =
    streetData
      ? Math.round(
          data.risk +
            (streetData.required -
              data.required) *
              0.5
        )
      : data?.risk || 0;

  const handleOverride = (event) => {
    event.preventDefault();

    if (manualDeployed === "") {
      setMessage(
        "Enter the actual number of deployed officers."
      );
      return;
    }

    setMessage(
      `Manual deployment updated for ${location.displayName}.`
    );
  };

  if (location.scope === "nagpur") {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h1 className="text-2xl font-bold">
            Police Allocation
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Select an area or street from the
            dashboard search bar to view police
            requirements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase text-slate-400">
          Operations
        </p>

        <h1 className="text-3xl font-bold">
          Police Allocation
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {location.displayName}
        </p>
      </div>

      {/* Requirement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <Stat
          title="Traffic Risk"
          value={`${risk}/100`}
          valueClass={
            risk >= 85
              ? "text-red-600"
              : risk >= 70
              ? "text-orange-600"
              : "text-green-600"
          }
        />

        <Stat
          title="Police Required"
          value={required}
        />

        <Stat
          title="Currently Deployed"
          value={deployed}
          valueClass="text-blue-600"
        />

        <Stat
          title="Deployment Gap"
          value={gap}
          valueClass={
            gap > 0
              ? "text-red-600"
              : "text-green-600"
          }
        />

      </div>

      {/* Recommendation */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">

        <p className="text-xs uppercase font-semibold text-blue-600">
          VIGIL Recommendation
        </p>

        <h2 className="text-lg font-bold text-slate-900 mt-1">
          {gap > 0
            ? `Deploy ${gap} additional officer${
                gap > 1 ? "s" : ""
              }`
            : "Current deployment meets requirement"}
        </h2>

        <p className="text-sm text-slate-600 mt-1">
          Recommended deployment for{" "}
          <strong>
            {location.displayName}
          </strong>{" "}
          based on the current traffic-risk
          requirement.
        </p>
      </div>

      {/* Manual Override */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

        <h2 className="text-lg font-bold">
          Manual Override
        </h2>

        <p className="text-sm text-slate-500 mt-1 mb-5">
          Enter the actual deployment decided
          by the police officer.
        </p>

        <form
          onSubmit={handleOverride}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >

          <div>
            <label className="text-sm font-medium">
              Actual Officers Deployed
            </label>

            <input
              type="number"
              min="0"
              value={manualDeployed}
              onChange={(event) =>
                setManualDeployed(
                  event.target.value
                )
              }
              placeholder={String(
                defaultDeployed
              )}
              className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Shift
            </label>

            <select
              value={shift}
              onChange={(event) =>
                setShift(event.target.value)
              }
              className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white"
            >
              <option value="">
                Select shift
              </option>

              <option>
                00:00 – 08:00
              </option>

              <option>
                08:00 – 16:00
              </option>

              <option>
                16:00 – 00:00
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Deployment Note
            </label>

            <input
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              placeholder="Optional note"
              className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-3 w-full md:w-fit px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Apply Manual Override
          </button>

        </form>

        {message && (
          <p className="mt-4 text-sm text-green-600">
            {message}
          </p>
        )}

      </div>

      {/* Deployment Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">

        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold">
            Deployment Comparison
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Required officers compared with
            actual deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">

          <Comparison
            label="Required"
            value={required}
          />

          <Comparison
            label="Actual"
            value={deployed}
          />

          <Comparison
            label={
              gap > 0
                ? "Additional Needed"
                : excess > 0
                ? "Above Requirement"
                : "Deployment Status"
            }
            value={
              gap > 0
                ? gap
                : excess > 0
                ? excess
                : "Covered"
            }
          />

        </div>
      </div>

      {/* Street Deployment */}
      {data && data.streets && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <div className="p-5 border-b border-slate-200">
            <h2 className="font-bold">
              Street-Level Requirement
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Police requirement under{" "}
              {location.area}.
            </p>
          </div>

          {data.streets.map(
            (street) => {
              const streetGap =
                Math.max(
                  street.required -
                    street.deployed,
                  0
                );

              return (
                <div
                  key={street.street}
                  className="p-5 border-b border-slate-100 last:border-b-0 flex items-center gap-4"
                >

                  <div className="flex-1">
                    <p className="font-semibold">
                      {street.street}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Required:{" "}
                      {street.required}
                      {" • "}
                      Deployed:{" "}
                      {street.deployed}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        streetGap > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {streetGap}
                    </p>

                    <p className="text-xs text-slate-500">
                      {streetGap > 0
                        ? "needed"
                        : "covered"}
                    </p>
                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

function Stat({
  title,
  value,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p
        className={`text-3xl font-bold mt-2 ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function Comparison({
  label,
  value,
}) {
  return (
    <div className="p-5 border-b md:border-b-0 md:border-r last:border-0 border-slate-100">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}

export default PoliceAllocation;