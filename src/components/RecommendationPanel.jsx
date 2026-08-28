import React, { useState } from "react";

const defaultRecommendation = {
  zone: "Sitabuldi",
  riskScore: 94,
  priority: "Critical",

  currentOfficers: 5,
  requiredOfficers: 8,

  additionalOfficers: 3,

  reason: [
    "Very high traffic congestion",
    "High accident frequency",
    "Current police deployment is below requirement",
    "Risk score is above the critical threshold",
  ],

  recommendedAction:
    "Deploy 3 additional traffic officers to Sitabuldi immediately.",

  confidence: 92,
};

function RecommendationPanel({
  recommendation = defaultRecommendation,
}) {
  const [approved, setApproved] = useState(false);

  const shortage =
    Math.max(
      recommendation.requiredOfficers -
        recommendation.currentOfficers,
      0
    );

  return (
    <section className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          VIGIL Deployment Recommendation
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          AI-assisted police deployment recommendation based on
          traffic risk and current officer availability.
        </p>
      </div>

      {/* Recommendation */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Top */}
        <div className="border-b border-gray-200 p-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Recommended Deployment
              </p>

              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {recommendation.zone}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Immediate traffic intervention recommended
              </p>

            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">

              <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
                {recommendation.priority} Priority
              </span>

              <span className="text-xs text-gray-500">
                Risk Score:{" "}
                <strong className="text-red-600">
                  {recommendation.riskScore}/100
                </strong>
              </span>

            </div>

          </div>

        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">

          {/* Deployment numbers */}
          <div>

            <h4 className="font-bold text-gray-900">
              Officer Requirement
            </h4>

            <div className="mt-4 grid grid-cols-3 gap-3">

              <NumberCard
                label="Required"
                value={recommendation.requiredOfficers}
              />

              <NumberCard
                label="Current"
                value={recommendation.currentOfficers}
                className="text-blue-600"
              />

              <NumberCard
                label="Additional"
                value={shortage}
                className="text-red-600"
              />

            </div>

            {/* Progress */}
            <div className="mt-5">

              <div className="flex justify-between">

                <span className="text-xs text-gray-500">
                  Current deployment
                </span>

                <span className="text-xs font-bold text-gray-700">
                  {recommendation.requiredOfficers === 0
                    ? 0
                    : Math.round(
                        (recommendation.currentOfficers /
                          recommendation.requiredOfficers) *
                          100
                      )}
                  %
                </span>

              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${
                      recommendation.requiredOfficers === 0
                        ? 0
                        : Math.min(
                            (recommendation.currentOfficers /
                              recommendation.requiredOfficers) *
                              100,
                            100
                          )
                    }%`,
                  }}
                />

              </div>

            </div>

            {/* Recommendation */}
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

              <p className="text-xs font-bold text-blue-700">
                VIGIL Recommendation
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-800">
                {recommendation.recommendedAction}
              </p>

            </div>

          </div>

          {/* Reasoning */}
          <div>

            <h4 className="font-bold text-gray-900">
              Recommendation Reasoning
            </h4>

            <p className="mt-1 text-xs text-gray-500">
              Factors contributing to the deployment recommendation.
            </p>

            <div className="mt-4 space-y-3">

              {recommendation.reason.map(
                (reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl bg-gray-50 p-3"
                  >

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {index + 1}
                    </span>

                    <p className="text-xs leading-5 text-gray-600">
                      {reason}
                    </p>

                  </div>
                )
              )}

            </div>

            {/* Confidence */}
            <div className="mt-5">

              <div className="flex justify-between">

                <span className="text-xs font-semibold text-gray-700">
                  Model Confidence
                </span>

                <span className="text-xs font-bold text-green-600">
                  {recommendation.confidence}%
                </span>

              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-green-600"
                  style={{
                    width: `${recommendation.confidence}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* Action */}
        <div className="border-t border-gray-200 bg-gray-50 p-5">

          {!approved ? (
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Officer Approval Required
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  AI recommendations do not automatically deploy
                  officers. A control officer must approve the action.
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => setApproved(true)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Approve Recommendation
                </button>

                <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                  Override
                </button>

              </div>

            </div>
          ) : (
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-bold text-green-700">
                    Recommendation Approved
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Deployment action is ready for execution.
                  </p>
                </div>

              </div>

              <button
                onClick={() => setApproved(false)}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Revoke Approval
              </button>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

function NumberCard({
  label,
  value,
  className = "text-gray-900",
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">

      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className={`mt-1 text-2xl font-bold ${className}`}>
        {value}
      </p>

    </div>
  );
}

export default RecommendationPanel;