import {
  useMemo,
} from "react";

import {
  useLocation,
} from "../context/LocationContext";

import Charts from "../components/Charts";

import {
  areaRanking,
  incidents,
  citySituation,
  areaSituation,
} from "../data/vigilMockData";

function Analytics() {
  const {
    location,
  } = useLocation();

  const selectedArea =
    location.area;

  const selectedData =
    areaSituation[selectedArea] || null;

  const visibleIncidents =
    useMemo(() => {
      if (
        location.scope === "nagpur"
      ) {
        return incidents;
      }

      if (selectedArea) {
        return incidents.filter(
          (incident) =>
            incident.area ===
            selectedArea
        );
      }

      return incidents;
    }, [
      location.scope,
      selectedArea,
    ]);

  const totalIncidents =
    visibleIncidents.length;

  const criticalIncidents =
    visibleIncidents.filter(
      (incident) =>
        incident.severity ===
        "Critical"
    ).length;

  const highIncidents =
    visibleIncidents.filter(
      (incident) =>
        incident.severity ===
        "High"
    ).length;

  const moderateIncidents =
    visibleIncidents.filter(
      (incident) =>
        incident.severity ===
        "Moderate" ||
        incident.severity ===
        "Medium"
    ).length;

  const averageConfidence =
    totalIncidents === 0
      ? 0
      : Math.round(
          visibleIncidents.reduce(
            (
              total,
              incident
            ) =>
              total +
              (incident.confidence || 0),
            0
          ) /
            totalIncidents
        );

  const trafficDensity =
    selectedData
      ? selectedData.trafficDensity
      : citySituation.trafficDensity;

  const riskScore =
    selectedData
      ? selectedData.riskScore
      : citySituation.riskScore ||
        0;

  const policeAvailable =
    selectedData
      ? selectedData.policeAvailable
      : citySituation.policeAvailable;

  const policeAllocated =
    selectedData
      ? selectedData.policeAllocated
      : citySituation.policeDeployed;

  const policeRequired =
    selectedData
      ? selectedData.policeRequired
      : citySituation.policeRequired;

  const policeShortage =
    Math.max(
      policeRequired -
        policeAllocated,
      0
    );

  const sortedAreaRanking =
    [...areaRanking].sort(
      (a, b) =>
        b.traffic - a.traffic
    );

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">

      {/* HEADER */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          VIGIL Analytics
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
          Traffic Intelligence Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Analysis for{" "}
          <span className="font-semibold text-slate-700">
            {location.displayName}
          </span>
        </p>

      </section>

      {/* SUMMARY */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <AnalyticsCard
          title="Traffic Density"
          value={`${trafficDensity}%`}
          description="Current traffic level"
          icon="🚦"
        />

        <AnalyticsCard
          title="Risk Score"
          value={`${riskScore}/100`}
          description="Current risk assessment"
          icon="⚠️"
        />

        <AnalyticsCard
          title="Active Incidents"
          value={totalIncidents}
          description="Incidents in selected scope"
          icon="🚨"
          valueClass="text-red-600"
        />

        <AnalyticsCard
          title="AI Confidence"
          value={`${averageConfidence}%`}
          description="Average detection confidence"
          icon="🤖"
        />

      </section>

      {/* TRAFFIC CHARTS */}

      <Charts />

      {/* INCIDENT ANALYSIS */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <section className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="mb-5">
            <h2 className="text-lg font-bold">
              Incident Severity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Detected incidents in the selected location.
            </p>
          </div>

          <div className="space-y-5">

            <SeverityBar
              label="Critical"
              value={criticalIncidents}
              total={totalIncidents}
              symbol="🔴"
            />

            <SeverityBar
              label="High"
              value={highIncidents}
              total={totalIncidents}
              symbol="🟠"
            />

            <SeverityBar
              label="Moderate"
              value={moderateIncidents}
              total={totalIncidents}
              symbol="🟡"
            />

          </div>

        </section>

        {/* POLICE */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="mb-5">
            <h2 className="text-lg font-bold">
              Police Deployment Analysis
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Required versus currently allocated personnel.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <MetricBox
              label="Available"
              value={policeAvailable}
            />

            <MetricBox
              label="Allocated"
              value={policeAllocated}
            />

            <MetricBox
              label="Required"
              value={policeRequired}
            />

            <MetricBox
              label="Shortage"
              value={policeShortage}
              valueClass={
                policeShortage > 0
                  ? "text-red-600"
                  : "text-green-600"
              }
            />

          </div>

        </section>

      </section>

      {/* AREA RISK / DEPLOYMENT TABLE */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="mb-5">

          <h2 className="text-lg font-bold">
            Area Risk & Deployment Analysis
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Comparison of traffic, police requirements and allocation across Nagpur.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-slate-200 text-left">

                <th className="px-3 py-3">
                  Rank
                </th>

                <th className="px-3 py-3">
                  Area
                </th>

                <th className="px-3 py-3">
                  Traffic
                </th>

                <th className="px-3 py-3">
                  Risk
                </th>

                <th className="px-3 py-3">
                  Required
                </th>

                <th className="px-3 py-3">
                  Allocated
                </th>

                <th className="px-3 py-3">
                  Shortage
                </th>

              </tr>
            </thead>

            <tbody>

              {sortedAreaRanking.map(
                (area, index) => {

                  const shortage =
                    Math.max(
                      (area.required || 0) -
                        (area.allocated || 0),
                      0
                    );

                  return (
                    <tr
                      key={area.area}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      <td className="px-3 py-3 font-bold">
                        #{index + 1}
                      </td>

                      <td className="px-3 py-3 font-semibold">
                        {area.area}
                      </td>

                      <td className="px-3 py-3">
                        {area.traffic}%
                      </td>

                      <td className="px-3 py-3">
                        {area.risk ?? "-"}
                      </td>

                      <td className="px-3 py-3">
                        {area.required ?? "-"}
                      </td>

                      <td className="px-3 py-3">
                        {area.allocated ?? "-"}
                      </td>

                      <td className="px-3 py-3">

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            shortage > 5
                              ? "bg-red-50 text-red-600"
                              : shortage > 0
                              ? "bg-orange-50 text-orange-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {shortage}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* INCIDENT TABLE */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="mb-5">

          <h2 className="text-lg font-bold">
            Recent Incident Analytics
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Incident-level intelligence used by VIGIL.
          </p>

        </div>

        {visibleIncidents.length === 0 ? (

          <div className="py-10 text-center text-sm text-slate-500">
            No incidents found for this location.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-slate-200 text-left">

                  <th className="px-3 py-3">
                    Incident
                  </th>

                  <th className="px-3 py-3">
                    Area
                  </th>

                  <th className="px-3 py-3">
                    Severity
                  </th>

                  <th className="px-3 py-3">
                    Traffic
                  </th>

                  <th className="px-3 py-3">
                    AI Confidence
                  </th>

                  <th className="px-3 py-3">
                    Police
                  </th>

                </tr>
              </thead>

              <tbody>

                {visibleIncidents.map(
                  (incident) => (

                    <tr
                      key={incident.id}
                      className="border-b border-slate-100"
                    >

                      <td className="px-3 py-3">

                        <p className="font-semibold">
                          {incident.type}
                        </p>

                        <p className="text-xs text-slate-400">
                          {incident.id}
                        </p>

                      </td>

                      <td className="px-3 py-3">
                        {incident.area}
                      </td>

                      <td className="px-3 py-3">

                        <SeverityBadge
                          severity={
                            incident.severity
                          }
                        />

                      </td>

                      <td className="px-3 py-3">
                        {incident.trafficDensity ?? "-"}
                        {incident.trafficDensity != null
                          ? "%"
                          : ""}
                      </td>

                      <td className="px-3 py-3">
                        {incident.confidence ?? "-"}
                        {incident.confidence != null
                          ? "%"
                          : ""}
                      </td>

                      <td className="px-3 py-3">
                        {incident.policeAllocated ??
                          "-"}

                        /

                        {incident.policeRequired ??
                          "-"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      <footer className="py-6 text-center text-xs text-slate-400">
        VIGIL • Nagpur Traffic Intelligence & Police Deployment System
      </footer>

    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  description,
  icon,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${valueClass}`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>

        </div>

        <span className="text-2xl">
          {icon}
        </span>

      </div>

    </div>
  );
}

function SeverityBar({
  label,
  value,
  total,
  symbol,
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (value / total) * 100
        );

  return (
    <div>

      <div className="mb-2 flex justify-between">

        <span className="text-sm font-medium">
          {symbol} {label}
        </span>

        <span className="text-sm font-semibold">
          {value}
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-1 text-xs text-slate-400">
        {percentage}% of incidents
      </p>

    </div>
  );
}

function MetricBox({
  label,
  value,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}

function SeverityBadge({
  severity,
}) {
  let style =
    "bg-yellow-50 text-yellow-700";

  if (severity === "Critical") {
    style =
      "bg-red-50 text-red-600";
  } else if (
    severity === "High"
  ) {
    style =
      "bg-orange-50 text-orange-600";
  } else if (
    severity === "Moderate" ||
    severity === "Medium"
  ) {
    style =
      "bg-yellow-50 text-yellow-700";
  } else if (
    severity === "Low"
  ) {
    style =
      "bg-green-50 text-green-600";
  }

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold ${style}`}
    >
      {severity}
    </span>
  );
}

export default Analytics;