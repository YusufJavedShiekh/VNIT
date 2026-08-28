import { useLocation } from "../context/LocationContext";

import RecommendationPanel from "../components/RecommendationPanel";
import DeploymentComparison from "../components/DeploymentComparison";
import ManualOverride from "../components/ManualOverride";

import {
  areaSituation,
} from "../data/vigilMockData";

function Recommendations() {
  const { location } = useLocation();

  const selected =
    areaSituation[location.area];

  const zone =
    location.area || "Sitabuldi";

  const required =
    selected?.policeRequired || 8;

  const current =
    selected?.policeAllocated || 5;

  const risk =
    selected?.riskScore || 94;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          VIGIL Decision Support
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
          AI Police Deployment Recommendations
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          AI-assisted deployment decisions for{" "}
          <strong>{zone}</strong>.
        </p>
      </div>

      <RecommendationPanel
        recommendation={{
          zone,
          riskScore: risk,

          priority:
            risk >= 85
              ? "Critical"
              : risk >= 70
              ? "High"
              : "Medium",

          currentOfficers: current,

          requiredOfficers: required,

          additionalOfficers:
            Math.max(
              required - current,
              0
            ),

          reason: [
            "Current traffic conditions",
            "Traffic-risk score",
            "Existing police deployment",
            "Estimated operational requirement",
          ],

          recommendedAction:
            `Deploy ${Math.max(
              required - current,
              0
            )} additional officer${
              required - current === 1
                ? ""
                : "s"
            } to ${zone}.`,

          confidence: 92,
        }}
      />

      <DeploymentComparison />

      <ManualOverride />

    </div>
  );
}

export default Recommendations;