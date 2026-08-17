import React from "react";

const defaultData = {
  totalZones: 18,
  criticalZones: 4,
  highRiskZones: 5,
  mediumRiskZones: 6,
  lowRiskZones: 3,
  averageRisk: 72,
  accidents: 24,
  congestion: 68,
};

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

function RiskCard({ title, value, description, icon, color }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              color || "text-gray-900"
            }`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

function RiskDistribution({
  critical,
  high,
  medium,
  low,
}) {
  const total = critical + high + medium + low;

  const getPercentage = (value) => {
    if (total === 0) {
      return 0;
    }

    return Math.round((value / total) * 100);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div>
        <h3 className="font-bold text-gray-900">
          Risk Distribution
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Current distribution of monitored traffic zones
        </p>
      </div>

      {/* Distribution bar */}
      <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-gray-100">

        <div
          className="bg-red-600"
          style={{
            width: `${getPercentage(critical)}%`,
          }}
        />

        <div
          className="bg-orange-500"
          style={{
            width: `${getPercentage(high)}%`,
          }}
        />

        <div
          className="bg-yellow-500"
          style={{
            width: `${getPercentage(medium)}%`,
          }}
        />

        <div
          className="bg-green-600"
          style={{
            width: `${getPercentage(low)}%`,
          }}
        />

      </div>

      {/* Legend */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">

        <DistributionItem
          color="bg-red-600"
          label="Critical"
          value={critical}
        />

        <DistributionItem
          color="bg-orange-500"
          label="High"
          value={high}
        />

        <DistributionItem
          color="bg-yellow-500"
          label="Medium"
          value={medium}
        />

        <DistributionItem
          color="bg-green-600"
          label="Low"
          value={low}
        />

      </div>

    </div>
  );
}

function DistributionItem({
  color,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-3 w-3 rounded-full ${color}`}
      />

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="text-sm font-bold text-gray-900">
          {value}
        </p>
      </div>

    </div>
  );
}

function RiskSummary({
  data = defaultData,
}) {
  const averageRisk = data.averageRisk ?? 0;

  return (
    <section className="space-y-5">

      {/* Heading */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Traffic Risk Summary
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current traffic-risk conditions across monitored Nagpur zones.
        </p>
      </div>

      {/* Main cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <RiskCard
          title="Total Zones"
          value={data.totalZones}
          description="Currently monitored"
          icon="📍"
        />

        <RiskCard
          title="Critical Zones"
          value={data.criticalZones}
          description="Immediate attention required"
          icon="🔴"
          color="text-red-600"
        />

        <RiskCard
          title="Average Risk"
          value={`${averageRisk}/100`}
          description="Overall city risk"
          icon="📊"
          color={getRiskColor(averageRisk)}
        />

        <RiskCard
          title="Accidents"
          value={data.accidents}
          description="Currently recorded"
          icon="🚨"
          color="text-red-600"
        />

      </div>

      {/* Secondary information */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Congestion */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="font-bold text-gray-900">
                Overall Congestion
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Estimated traffic congestion across monitored zones
              </p>
            </div>

            <span className="text-2xl font-bold text-orange-600">
              {data.congestion}%
            </span>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">

            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(data.congestion, 0),
                  100
                )}%`,
              }}
            />

          </div>

          <div className="mt-2 flex justify-between text-[10px] text-gray-400">
            <span>Low</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>

        </div>

        {/* Zone breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div>
            <h3 className="font-bold text-gray-900">
              Zone Breakdown
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Number of zones by current risk level
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs text-red-600">
                Critical
              </p>

              <p className="mt-1 text-2xl font-bold text-red-700">
                {data.criticalZones}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-4">
              <p className="text-xs text-orange-600">
                High
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-700">
                {data.highRiskZones}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <p className="text-xs text-yellow-600">
                Medium
              </p>

              <p className="mt-1 text-2xl font-bold text-yellow-700">
                {data.mediumRiskZones}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Distribution */}
      <RiskDistribution
        critical={data.criticalZones}
        high={data.highRiskZones}
        medium={data.mediumRiskZones}
        low={data.lowRiskZones}
      />

    </section>
  );
}

export default RiskSummary;