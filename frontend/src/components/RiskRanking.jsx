import React, { useState } from "react";

const riskZones = [
  {
    rank: 1,
    location: "Sitabuldi",
    area: "Sitabuldi Main Road",
    riskScore: 94,
    trafficLevel: "Very High",
    accidents: 8,
    congestion: 91,
    status: "Critical",
  },
  {
    rank: 2,
    location: "Wardha Road",
    area: "Wardha Road - Ajni",
    riskScore: 88,
    trafficLevel: "Very High",
    accidents: 6,
    congestion: 86,
    status: "Critical",
  },
  {
    rank: 3,
    location: "Central Avenue",
    area: "Central Avenue Road",
    riskScore: 84,
    trafficLevel: "Very High",
    accidents: 5,
    congestion: 82,
    status: "High",
  },
  {
    rank: 4,
    location: "Manewada",
    area: "Manewada Road",
    riskScore: 76,
    trafficLevel: "High",
    accidents: 4,
    congestion: 73,
    status: "High",
  },
  {
    rank: 5,
    location: "Kamptee Road",
    area: "Kamptee Road - Indora",
    riskScore: 71,
    trafficLevel: "High",
    accidents: 3,
    congestion: 69,
    status: "High",
  },
  {
    rank: 6,
    location: "Dharampeth",
    area: "Dharampeth Main Road",
    riskScore: 63,
    trafficLevel: "Medium",
    accidents: 2,
    congestion: 60,
    status: "Medium",
  },
  {
    rank: 7,
    location: "Sadar",
    area: "Sadar Main Road",
    riskScore: 57,
    trafficLevel: "Medium",
    accidents: 2,
    congestion: 54,
    status: "Medium",
  },
  {
    rank: 8,
    location: "Ajni",
    area: "Ajni Square",
    riskScore: 48,
    trafficLevel: "Medium",
    accidents: 1,
    congestion: 45,
    status: "Low",
  },
];

function getRiskColor(score) {
  if (score >= 85) {
    return "text-red-600";
  }

  if (score >= 70) {
    return "text-orange-600";
  }

  if (score >= 50) {
    return "text-yellow-600";
  }

  return "text-green-600";
}

function getRiskBackground(score) {
  if (score >= 85) {
    return "bg-red-100";
  }

  if (score >= 70) {
    return "bg-orange-100";
  }

  if (score >= 50) {
    return "bg-yellow-100";
  }

  return "bg-green-100";
}

function getRiskBar(score) {
  if (score >= 85) {
    return "bg-red-600";
  }

  if (score >= 70) {
    return "bg-orange-500";
  }

  if (score >= 50) {
    return "bg-yellow-500";
  }

  return "bg-green-600";
}

function RiskRanking() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [filter, setFilter] = useState("All");

  const filteredZones =
    filter === "All"
      ? riskZones
      : riskZones.filter((zone) => zone.status === filter);

  return (
    <section className="space-y-5">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Traffic Risk Ranking
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Ranked Nagpur locations based on current traffic risk.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1">

          {["All", "Critical", "High", "Medium", "Low"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  filter === item
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            )
          )}

        </div>

      </div>

      {/* Ranking */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Desktop header */}
        <div className="hidden grid-cols-[70px_1.5fr_1fr_100px_120px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-400 md:grid">

          <span>Rank</span>
          <span>Location</span>
          <span>Traffic</span>
          <span>Risk</span>
          <span>Status</span>

        </div>

        <div className="divide-y divide-gray-100">

          {filteredZones.map((zone) => (

            <div
              key={zone.rank}
              onClick={() => setSelectedZone(zone)}
              className={`cursor-pointer p-5 transition hover:bg-gray-50 ${
                selectedZone?.rank === zone.rank
                  ? "bg-blue-50"
                  : ""
              }`}
            >

              {/* Desktop */}
              <div className="hidden grid-cols-[70px_1.5fr_1fr_100px_120px] items-center gap-4 md:grid">

                {/* Rank */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                    zone.rank <= 3
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  #{zone.rank}
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {zone.location}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    {zone.area}
                  </p>
                </div>

                {/* Traffic */}
                <div>
                  <p className="text-xs font-semibold text-gray-700">
                    {zone.trafficLevel}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Congestion {zone.congestion}%
                  </p>
                </div>

                {/* Risk */}
                <div>
                  <p
                    className={`text-lg font-bold ${getRiskColor(
                      zone.riskScore
                    )}`}
                  >
                    {zone.riskScore}
                  </p>

                  <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${getRiskBar(
                        zone.riskScore
                      )}`}
                      style={{
                        width: `${zone.riskScore}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${getRiskBackground(
                    zone.riskScore
                  )} ${getRiskColor(zone.riskScore)}`}
                >
                  {zone.status}
                </span>

              </div>

              {/* Mobile */}
              <div className="md:hidden">

                <div className="flex items-start gap-3">

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      zone.rank <= 3
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    #{zone.rank}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="font-bold text-gray-900">
                          {zone.location}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {zone.area}
                        </p>
                      </div>

                      <p
                        className={`text-xl font-bold ${getRiskColor(
                          zone.riskScore
                        )}`}
                      >
                        {zone.riskScore}
                      </p>

                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className={`h-full rounded-full ${getRiskBar(
                          zone.riskScore
                        )}`}
                        style={{
                          width: `${zone.riskScore}%`,
                        }}
                      />

                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
                        🚦 {zone.trafficLevel}
                      </span>

                      <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
                        🚨 {zone.accidents} accidents
                      </span>

                      <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
                        📊 {zone.congestion}%
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Selected zone */}
      {selectedZone && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Selected Risk Zone
              </p>

              <h3 className="mt-1 text-lg font-bold text-gray-900">
                {selectedZone.location}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {selectedZone.area}
              </p>
            </div>

            <div className="text-left sm:text-right">

              <p
                className={`text-3xl font-bold ${getRiskColor(
                  selectedZone.riskScore
                )}`}
              >
                {selectedZone.riskScore}/100
              </p>

              <p className="text-xs text-gray-500">
                Risk Score
              </p>

            </div>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <InfoItem
              label="Traffic"
              value={selectedZone.trafficLevel}
            />

            <InfoItem
              label="Congestion"
              value={`${selectedZone.congestion}%`}
            />

            <InfoItem
              label="Accidents"
              value={selectedZone.accidents}
            />

            <InfoItem
              label="Status"
              value={selectedZone.status}
            />

          </div>

        </div>
      )}

    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-3">

      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}

export default RiskRanking;