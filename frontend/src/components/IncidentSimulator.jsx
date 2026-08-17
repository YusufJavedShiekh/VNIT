import React, { useState } from "react";

const incidentTypes = [
  "Accident",
  "Traffic Congestion",
  "Road Obstruction",
  "Vehicle Breakdown",
  "Emergency",
];

const locations = [
  "Sitabuldi",
  "Wardha Road",
  "Central Avenue",
  "Manewada",
  "Kamptee Road",
  "Dharampeth",
  "Sadar",
  "Ajni",
];

const severityLevels = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

function IncidentSimulator() {
  const [incidentType, setIncidentType] =
    useState("Accident");

  const [location, setLocation] =
    useState("Sitabuldi");

  const [severity, setSeverity] =
    useState("Critical");

  const [vehicleCount, setVehicleCount] =
    useState(2);

  const [roadBlocked, setRoadBlocked] =
    useState(false);

  const [simulated, setSimulated] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const simulateIncident = () => {
    let baseRisk = 30;

    if (incidentType === "Accident") {
      baseRisk += 25;
    }

    if (incidentType === "Traffic Congestion") {
      baseRisk += 20;
    }

    if (incidentType === "Road Obstruction") {
      baseRisk += 15;
    }

    if (incidentType === "Vehicle Breakdown") {
      baseRisk += 10;
    }

    if (incidentType === "Emergency") {
      baseRisk += 30;
    }

    if (severity === "Medium") {
      baseRisk += 10;
    }

    if (severity === "High") {
      baseRisk += 20;
    }

    if (severity === "Critical") {
      baseRisk += 30;
    }

    baseRisk += Math.min(vehicleCount * 3, 15);

    if (roadBlocked) {
      baseRisk += 10;
    }

    const riskScore = Math.min(baseRisk, 100);

    let officersRequired = 2;

    if (riskScore >= 85) {
      officersRequired = 8;
    } else if (riskScore >= 70) {
      officersRequired = 6;
    } else if (riskScore >= 50) {
      officersRequired = 4;
    }

    let riskLevel = "Low";

    if (riskScore >= 85) {
      riskLevel = "Critical";
    } else if (riskScore >= 70) {
      riskLevel = "High";
    } else if (riskScore >= 50) {
      riskLevel = "Medium";
    }

    setResult({
      riskScore,
      riskLevel,
      officersRequired,
    });

    setSimulated(true);
  };

  const resetSimulation = () => {
    setSimulated(false);
    setResult(null);
    setIncidentType("Accident");
    setLocation("Sitabuldi");
    setSeverity("Critical");
    setVehicleCount(2);
    setRoadBlocked(false);
  };

  return (
    <section className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Incident Simulator
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Simulate a traffic incident and observe how VIGIL
          would evaluate the risk and deployment requirement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Input */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <h3 className="font-bold text-gray-900">
            Incident Parameters
          </h3>

          <div className="mt-5 space-y-4">

            {/* Type */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Incident Type
              </label>

              <select
                value={incidentType}
                onChange={(event) =>
                  setIncidentType(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

            </div>

            {/* Location */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Nagpur Location
              </label>

              <select
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

            {/* Severity */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Severity
              </label>

              <div className="mt-2 grid grid-cols-4 gap-2">

                {severityLevels.map((level) => (

                  <button
                    key={level}
                    onClick={() => setSeverity(level)}
                    className={`rounded-xl border px-2 py-3 text-[10px] font-semibold transition ${
                      severity === level
                        ? level === "Critical"
                          ? "border-red-600 bg-red-600 text-white"
                          : level === "High"
                          ? "border-orange-500 bg-orange-500 text-white"
                          : level === "Medium"
                          ? "border-yellow-500 bg-yellow-500 text-white"
                          : "border-green-600 bg-green-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {level}
                  </button>

                ))}

              </div>

            </div>

            {/* Vehicles */}
            <div>

              <div className="flex items-center justify-between">

                <label className="text-xs font-semibold text-gray-700">
                  Vehicles Involved
                </label>

                <span className="font-bold text-blue-600">
                  {vehicleCount}
                </span>

              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={vehicleCount}
                onChange={(event) =>
                  setVehicleCount(
                    Number(event.target.value)
                  )
                }
                className="mt-3 w-full"
              />

            </div>

            {/* Road blocked */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">

              <div>
                <p className="text-xs font-semibold text-gray-700">
                  Road Completely Blocked
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Simulate complete traffic obstruction.
                </p>
              </div>

              <input
                type="checkbox"
                checked={roadBlocked}
                onChange={(event) =>
                  setRoadBlocked(event.target.checked)
                }
                className="h-5 w-5"
              />

            </label>

          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">

            <button
              onClick={simulateIncident}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Run Simulation
            </button>

            <button
              onClick={resetSimulation}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>

          </div>

        </div>

        {/* Result */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <h3 className="font-bold text-gray-900">
            Simulation Result
          </h3>

          {!simulated ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                🧠
              </div>

              <p className="mt-4 font-semibold text-gray-800">
                Ready for simulation
              </p>

              <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500">
                Configure an incident and run the simulation
                to see the estimated VIGIL risk score.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-5">

              {/* Location */}
              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-[10px] text-gray-400">
                  Simulated Incident
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {incidentType} · {location}
                </p>

              </div>

              {/* Risk */}
              <div className="rounded-2xl border border-gray-100 p-5 text-center">

                <p className="text-xs text-gray-500">
                  Estimated Risk Score
                </p>

                <p
                  className={`mt-2 text-5xl font-bold ${
                    result.riskLevel === "Critical"
                      ? "text-red-600"
                      : result.riskLevel === "High"
                      ? "text-orange-600"
                      : result.riskLevel === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {result.riskScore}
                </p>

                <p className="mt-2 text-sm font-bold">
                  {result.riskLevel} Risk
                </p>

              </div>

              {/* Deployment */}
              <div className="rounded-xl bg-blue-50 p-4">

                <p className="text-xs font-semibold text-blue-700">
                  Estimated Police Requirement
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-700">
                  {result.officersRequired}
                </p>

                <p className="text-xs text-gray-500">
                  officers recommended for this scenario
                </p>

              </div>

              {/* Factors */}
              <div>

                <p className="text-xs font-bold text-gray-700">
                  Simulation Factors
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">

                  <Factor
                    label="Severity"
                    value={severity}
                  />

                  <Factor
                    label="Vehicles"
                    value={vehicleCount}
                  />

                  <Factor
                    label="Road Blocked"
                    value={roadBlocked ? "Yes" : "No"}
                  />

                  <Factor
                    label="Location"
                    value={location}
                  />

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

function Factor({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">

      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-gray-800">
        {value}
      </p>

    </div>
  );
}

export default IncidentSimulator;