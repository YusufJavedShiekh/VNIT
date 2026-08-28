import React, { useMemo, useState } from "react";
import ManualOverride from "../components/ManualOverride";
import {useLocation} from "../context/LocationContext";

const deploymentData = [
  {
    id: 1,
    station: "Sitabuldi Traffic Police Station",
    zone: "Sitabuldi",
    required: 8,
    available: 6,
    allocated: 5,
    shortage: 2,
    priority: "Critical",
  },
  {
    id: 2,
    station: "Sadar Traffic Police Station",
    zone: "Wardha Road",
    required: 7,
    available: 6,
    allocated: 5,
    shortage: 2,
    priority: "Critical",
  },
  {
    id: 3,
    station: "Gandhibagh Traffic Police Station",
    zone: "Central Avenue",
    required: 6,
    available: 5,
    allocated: 4,
    shortage: 2,
    priority: "High",
  },
  {
    id: 4,
    station: "Ajni Traffic Police Station",
    zone: "Manewada",
    required: 5,
    available: 5,
    allocated: 4,
    shortage: 1,
    priority: "High",
  },
  {
    id: 5,
    station: "Indora Traffic Police Station",
    zone: "Kamptee Road",
    required: 5,
    available: 4,
    allocated: 3,
    shortage: 2,
    priority: "High",
  },
  {
    id: 6,
    station: "Dharampeth Traffic Police Station",
    zone: "Dharampeth",
    required: 4,
    available: 4,
    allocated: 3,
    shortage: 1,
    priority: "Medium",
  },
];

function getPriorityClass(priority) {
  if (priority === "Critical") {
    return "bg-red-100 text-red-700";
  }

  if (priority === "High") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function PoliceAllocation() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredStations = useMemo(() => {
    if (!showAvailableOnly) {
      return deploymentData;
    }

    return deploymentData.filter(
      (station) => station.available > station.allocated
    );
  }, [showAvailableOnly]);

  const totalRequired = deploymentData.reduce(
    (sum, station) => sum + station.required,
    0
  );

  const totalAvailable = deploymentData.reduce(
    (sum, station) => sum + station.available,
    0
  );

  const totalAllocated = deploymentData.reduce(
    (sum, station) => sum + station.allocated,
    0
  );

  const totalShortage = deploymentData.reduce(
    (sum, station) => sum + station.shortage,
    0
  );

  return (
    <section className="space-y-5">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Police Allocation
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current officer deployment across high-risk Nagpur zones.
          </p>
        </div>

        <button
          onClick={() =>
            setShowAvailableOnly((previous) => !previous)
          }
          className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
            showAvailableOnly
              ? "bg-blue-600 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {showAvailableOnly
            ? "Showing Available Units"
            : "Show Available Units"}
        </button>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <SummaryCard
          title="Required"
          value={totalRequired}
          icon="👮"
          color="text-gray-900"
        />

        <SummaryCard
          title="Available"
          value={totalAvailable}
          icon="🟢"
          color="text-green-600"
        />

        <SummaryCard
          title="Allocated"
          value={totalAllocated}
          icon="📍"
          color="text-blue-600"
        />

        <SummaryCard
          title="Shortage"
          value={totalShortage}
          icon="⚠️"
          color="text-red-600"
        />

      </div>

      {/* Station list */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">

          <h3 className="font-bold text-gray-900">
            Station Deployment Status
          </h3>

        </div>

        <div className="divide-y divide-gray-100">

          {filteredStations.map((station) => {

            const allocationPercentage =
              station.required === 0
                ? 0
                : Math.round(
                    (station.allocated / station.required) * 100
                  );

            return (
              <div
                key={station.id}
                className="p-5 transition hover:bg-gray-50"
              >

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                  {/* Station */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h4 className="font-semibold text-gray-900">
                        {station.station}
                      </h4>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${getPriorityClass(
                          station.priority
                        )}`}
                      >
                        {station.priority}
                      </span>

                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Assigned zone: {station.zone}
                    </p>

                  </div>

                  {/* Numbers */}
                  <div className="grid grid-cols-3 gap-3 lg:w-72">

                    <OfficerNumber
                      label="Required"
                      value={station.required}
                    />

                    <OfficerNumber
                      label="Available"
                      value={station.available}
                      color="text-green-600"
                    />

                    <OfficerNumber
                      label="Allocated"
                      value={station.allocated}
                      color="text-blue-600"
                    />

                  </div>

                  {/* Progress */}
                  <div className="lg:w-52">

                    <div className="flex justify-between text-[10px]">

                      <span className="text-gray-400">
                        Deployment
                      </span>

                      <span className="font-bold text-gray-700">
                        {allocationPercentage}%
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className={`h-full rounded-full ${
                          allocationPercentage >= 90
                            ? "bg-green-600"
                            : allocationPercentage >= 70
                            ? "bg-orange-500"
                            : "bg-red-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            allocationPercentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setSelectedStation(station)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Details
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Selected station */}
      {selectedStation && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Deployment Details
              </p>

              <h3 className="mt-1 text-lg font-bold text-gray-900">
                {selectedStation.station}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {selectedStation.zone}
              </p>
            </div>

            <button
              onClick={() => setSelectedStation(null)}
              className="rounded-lg p-1 text-gray-400 hover:bg-white"
            >
              ✕
            </button>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <DetailCard
              label="Required"
              value={selectedStation.required}
            />

            <DetailCard
              label="Available"
              value={selectedStation.available}
            />

            <DetailCard
              label="Allocated"
              value={selectedStation.allocated}
            />

            <DetailCard
              label="Shortage"
              value={selectedStation.shortage}
              valueClass="text-red-600"
            />

          </div>

          {selectedStation.shortage > 0 && (
            <div className="mt-4 rounded-xl border border-red-100 bg-white p-4">

              <p className="text-xs font-bold text-red-700">
                Deployment Warning
              </p>

              <p className="mt-1 text-xs text-gray-600">
                This zone currently has a shortage of{" "}
                <strong>
                  {selectedStation.shortage}
                </strong>{" "}
                officer
                {selectedStation.shortage > 1 ? "s" : ""}.
                VIGIL should consider additional deployment.
              </p>

            </div>
          )}

        </div>
      )}

    </section>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs text-gray-500">
            {title}
          </p>

          <p className={`mt-1 text-2xl font-bold ${color}`}>
            {value}
          </p>
        </div>

        <span className="text-xl">
          {icon}
        </span>

      </div>

    </div>
  );
}

function OfficerNumber({
  label,
  value,
  color = "text-gray-900",
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-2 text-center">

      <p className="text-[9px] text-gray-400">
        {label}
      </p>

      <p className={`mt-1 text-sm font-bold ${color}`}>
        {value}
      </p>

    </div>
  );
}

function DetailCard({
  label,
  value,
  valueClass = "text-gray-900",
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-3">

      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className={`mt-1 text-xl font-bold ${valueClass}`}>
        {value}
      </p>

    </div>
  );
}

export default PoliceAllocation;