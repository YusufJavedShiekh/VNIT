import { useLocation } from "../context/LocationContext";

import NagpurMap from "../components/NagpurMap";
import RiskSummary from "../components/RiskSummary";
import RiskRanking from "../components/RiskRanking";
import IncidentSimulator from "../components/IncidentSimulator";

import {
  areaSituation,
  incidents,
  citySituation,
} from "../data/vigilMockData";

function RiskAnalysis() {
  const { location } = useLocation();

  const selected =
    areaSituation[location.area];

  const risk =
    selected?.riskScore ??
    citySituation.trafficDensity;

  const visibleIncidents =
    location.scope === "nagpur"
      ? incidents
      : incidents.filter(
          (incident) =>
            incident.area ===
            location.area
        );

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          VIGIL Intelligence
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
          Traffic Risk Analysis
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Risk analysis for{" "}
          <strong>
            {location.displayName}
          </strong>
        </p>
      </div>

      <RiskSummary
        data={{
          totalZones:
            location.scope === "nagpur"
              ? 18
              : 1,

          criticalZones:
            risk >= 85 ? 1 : 0,

          highRiskZones:
            risk >= 70 && risk < 85
              ? 1
              : 0,

          mediumRiskZones:
            risk >= 50 && risk < 70
              ? 1
              : 0,

          lowRiskZones:
            risk < 50 ? 1 : 0,

          averageRisk: risk,

          accidents:
            visibleIncidents.filter(
              (item) =>
                item.type === "Accident"
            ).length,

          congestion:
            selected?.trafficDensity ??
            citySituation.trafficDensity,
        }}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-5">
          <h2 className="font-bold">
            Geographic Risk Visualization
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Nagpur risk heatmap.
          </p>
        </div>

        <div className="h-[520px]">
          <NagpurMap />
        </div>

      </div>

      <RiskRanking />

      <IncidentSimulator />

    </div>
  );
}

export default RiskAnalysis;