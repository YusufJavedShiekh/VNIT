import React from "react";

const comparisonData = [
  {
    zone: "Sitabuldi",
    risk: 94,
    required: 8,
    current: 5,
    shortage: 3,
    priority: "Critical",
  },
  {
    zone: "Wardha Road",
    risk: 88,
    required: 7,
    current: 5,
    shortage: 2,
    priority: "Critical",
  },
  {
    zone: "Central Avenue",
    risk: 84,
    required: 6,
    current: 4,
    shortage: 2,
    priority: "High",
  },
  {
    zone: "Manewada",
    risk: 76,
    required: 5,
    current: 4,
    shortage: 1,
    priority: "High",
  },
  {
    zone: "Kamptee Road",
    risk: 71,
    required: 5,
    current: 3,
    shortage: 2,
    priority: "High",
  },
];

function getRiskColor(risk) {
  if (risk >= 85) {
    return "bg-red-600";
  }

  if (risk >= 70) {
    return "bg-orange-500";
  }

  if (risk >= 50) {
    return "bg-yellow-500";
  }

  return "bg-green-600";
}

function DeploymentComparison() {
  const totalRequired = comparisonData.reduce(
    (sum, item) => sum + item.required,
    0
  );

  const totalCurrent = comparisonData.reduce(
    (sum, item) => sum + item.current,
    0
  );

  const totalShortage = comparisonData.reduce(
    (sum, item) => sum + item.shortage,
    0
  );

  return (
    <section className="space-y-5">

      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Deployment Comparison
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Compare current police allocation with VIGIL's
          estimated requirements.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <ComparisonCard
          title="Required"
          value={totalRequired}
          description="Officers required"
        />

        <ComparisonCard
          title="Currently Deployed"
          value={totalCurrent}
          description="Officers deployed"
          color="text-blue-600"
        />

        <ComparisonCard
          title="Deployment Gap"
          value={totalShortage}
          description="Additional officers needed"
          color="text-red-600"
        />

      </div>

      {/* Comparison */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="space-y-6">

          {comparisonData.map((item) => {

            const currentPercentage =
              (item.current / item.required) * 100;

            const riskPercentage = item.risk;

            return (
              <div key={item.zone}>

                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

                  <div>

                    <div className="flex items-center gap-2">

                      <p className="text-sm font-bold text-gray-900">
                        {item.zone}
                      </p>

                      <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold text-gray-600">
                        {item.priority}
                      </span>

                    </div>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Risk Score: {item.risk}/100
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-xs font-bold text-gray-800">
                      {item.current} / {item.required}
                    </p>

                    <p className="text-[10px] text-red-600">
                      {item.shortage} additional needed
                    </p>

                  </div>

                </div>

                {/* Risk */}
                <div className="mt-3">

                  <div className="flex justify-between text-[9px] text-gray-400">
                    <span>Risk</span>
                    <span>{riskPercentage}%</span>
                  </div>

                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className={`h-full rounded-full ${getRiskColor(
                        item.risk
                      )}`}
                      style={{
                        width: `${riskPercentage}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Deployment */}
                <div className="mt-3">

                  <div className="flex justify-between text-[9px] text-gray-400">
                    <span>Deployment coverage</span>
                    <span>
                      {Math.round(currentPercentage)}%
                    </span>
                  </div>

                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${Math.min(
                          currentPercentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Interpretation */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

        <p className="text-xs font-bold text-blue-700">
          VIGIL Analysis
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-700">
          The highest-risk zones currently have a deployment
          gap. VIGIL can prioritize additional officers for
          locations where the traffic-risk score is high and
          current deployment is below the estimated requirement.
        </p>

      </div>

    </section>
  );
}

function ComparisonCard({
  title,
  value,
  description,
  color = "text-gray-900",
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {description}
      </p>

    </div>
  );
}

export default DeploymentComparison;