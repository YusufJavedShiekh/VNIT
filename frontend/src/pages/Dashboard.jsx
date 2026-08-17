import { useEffect, useMemo, useState } from "react";

import NagpurMap from "../components/NagpurMap";

import { useLocation } from "../context/LocationContext";

import {
  citySituation,
  areaSituation,
  incidents,
} from "../data/vigilMockData";

function Dashboard() {
  const { location, setLocation } = useLocation();

  const [areaQuery, setAreaQuery] = useState("");
  const [roadQuery, setRoadQuery] = useState("");

  const [areaResults, setAreaResults] = useState([]);
  const [roadResults, setRoadResults] = useState([]);

  const [selectedArea, setSelectedArea] = useState(
    location?.area || ""
  );

  const [selectedRoad, setSelectedRoad] = useState(
    location?.street || ""
  );

  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingRoads, setLoadingRoads] = useState(false);

  const [searchError, setSearchError] = useState("");

  /*
   * ---------------------------------------------------------
   * CURRENT LOCATION DATA
   * ---------------------------------------------------------
   */

  const selectedAreaData =
    areaSituation[selectedArea] || null;

  /*
   * ---------------------------------------------------------
   * INCIDENT DATA
   * ---------------------------------------------------------
   */

  const visibleIncidents = useMemo(() => {
    if (!selectedArea && location?.scope === "nagpur") {
      return incidents;
    }

    if (selectedArea) {
      return incidents.filter(
        (incident) =>
          incident.area?.toLowerCase() ===
          selectedArea.toLowerCase()
      );
    }

    return incidents;
  }, [
    selectedArea,
    location?.scope,
  ]);

  /*
   * ---------------------------------------------------------
   * SEARCH NAGPUR AREAS
   *
   * This uses OpenStreetMap/Nominatim for the development
   * version.
   *
   * IMPORTANT:
   * Nominatim should NOT be used for autocomplete or bulk
   * downloading of all roads.
   *
   * Later we will move this request to the VIGIL backend.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!areaQuery.trim()) {
      setAreaResults([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoadingAreas(true);
        setSearchError("");

        const params = new URLSearchParams({
          q: `${areaQuery}, Nagpur, Maharashtra, India`,
          format: "jsonv2",
          addressdetails: "1",
          limit: "8",
          countrycodes: "in",
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Location search failed."
          );
        }

        const data = await response.json();

        const nagpurResults = data.filter((item) => {
          const address = item.address || {};

          const city =
            address.city ||
            address.town ||
            address.municipality ||
            "";

          return city
            .toLowerCase()
            .includes("nagpur");
        });

        setAreaResults(nagpurResults);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setSearchError(
            "Unable to search Nagpur locations right now."
          );
        }
      } finally {
        setLoadingAreas(false);
      }
    }, 700);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [areaQuery]);

  /*
   * ---------------------------------------------------------
   * SEARCH ROADS/STREETS INSIDE SELECTED AREA
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (
      !selectedArea ||
      !roadQuery.trim()
    ) {
      setRoadResults([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoadingRoads(true);
        setSearchError("");

        const searchText =
          `${roadQuery}, ${selectedArea}, Nagpur, Maharashtra, India`;

        const params = new URLSearchParams({
          q: searchText,
          format: "jsonv2",
          addressdetails: "1",
          limit: "10",
          countrycodes: "in",
          layer: "address",
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Road search failed."
          );
        }

        const data = await response.json();

        const roadResultsFiltered =
          data.filter((item) => {
            const address =
              item.address || {};

            const city =
              address.city ||
              address.town ||
              address.municipality ||
              "";

            return city
              .toLowerCase()
              .includes("nagpur");
          });

        setRoadResults(
          roadResultsFiltered
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);

          setSearchError(
            "Unable to search roads right now."
          );
        }
      } finally {
        setLoadingRoads(false);
      }
    }, 700);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    selectedArea,
    roadQuery,
  ]);

  /*
   * ---------------------------------------------------------
   * SELECT AREA
   * ---------------------------------------------------------
   */

  function handleAreaSelect(result) {
    const address =
      result.address || {};

    const areaName =
      address.suburb ||
      address.neighbourhood ||
      address.city_district ||
      address.quarter ||
      result.display_name;

    const lat =
      Number(result.lat);

    const lng =
      Number(result.lon);

    setSelectedArea(areaName);
    setSelectedRoad("");

    setAreaQuery(areaName);
    setRoadQuery("");

    setAreaResults([]);
    setRoadResults([]);

    setLocation({
      scope: "area",
      area: areaName,
      street: "",
      displayName: areaName,
      lat,
      lng,
      zoom: 14,
    });
  }

  /*
   * ---------------------------------------------------------
   * SELECT ROAD
   * ---------------------------------------------------------
   */

  function handleRoadSelect(result) {
    const address =
      result.address || {};

    const roadName =
      address.road ||
      result.display_name;

    const areaName =
      address.suburb ||
      address.neighbourhood ||
      address.city_district ||
      address.quarter ||
      selectedArea;

    const lat =
      Number(result.lat);

    const lng =
      Number(result.lon);

    setSelectedArea(areaName);
    setSelectedRoad(roadName);

    setRoadQuery(roadName);

    setRoadResults([]);

    setLocation({
      scope: "road",
      area: areaName,
      street: roadName,
      displayName: roadName,
      lat,
      lng,
      zoom: 17,
    });
  }

  /*
   * ---------------------------------------------------------
   * RESET SEARCH
   * ---------------------------------------------------------
   */

  function handleResetSearch() {
    setAreaQuery("");
    setRoadQuery("");

    setSelectedArea("");
    setSelectedRoad("");

    setAreaResults([]);
    setRoadResults([]);

    setSearchError("");

    setLocation({
      scope: "nagpur",
      area: "",
      street: "",
      displayName: "Entire Nagpur City",
      lat: null,
      lng: null,
      zoom: 11,
    });
  }

  /*
   * ---------------------------------------------------------
   * TRAFFIC DATA
   * ---------------------------------------------------------
   */

  const trafficDensity =
    selectedAreaData?.trafficDensity ??
    citySituation.trafficDensity ??
    0;

  const riskScore =
    selectedAreaData?.riskScore ??
    Math.round(
      trafficDensity * 0.8 +
        (citySituation.highRiskAreas || 0) * 2
    );

  const policeAllocated =
    selectedAreaData?.policeAllocated ??
    citySituation.policeDeployed ??
    0;

  const policeRequired =
    selectedAreaData?.policeRequired ??
    citySituation.policeRequired ??
    0;

  const policeGap = Math.max(
    policeRequired -
      policeAllocated,
    0
  );

  /*
   * ---------------------------------------------------------
   * TRAFFIC RANKING
   *
   * For now this is calculated from the available
   * areaSituation data.
   *
   * Later backend will calculate the actual ranking
   * from real traffic data.
   * ---------------------------------------------------------
   */

  const trafficRanking =
    calculateTrafficRanking(
      selectedArea
    );

  /*
   * ---------------------------------------------------------
   * CCTV DATA
   *
   * Uses the CCTV data if your mock data already contains it.
   * Otherwise an empty list is shown rather than inventing
   * cameras.
   * ---------------------------------------------------------
   */

  const cctvCameras =
    selectedAreaData?.cctv ||
    selectedAreaData?.cameras ||
    [];

  /*
   * ---------------------------------------------------------
   * OVERALL NAGPUR DATA
   * ---------------------------------------------------------
   */

  const nagpurAccidents =
    incidents.filter(
      (incident) =>
        incident.type ===
        "Accident"
    ).length;

  const nagpurCriticalIncidents =
    incidents.filter(
      (incident) =>
        incident.severity ===
        "Critical"
    ).length;

  const nagpurHighRiskAreas =
    citySituation.highRiskAreas ||
    0;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            VIGIL Command Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
            Nagpur Traffic Intelligence
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Search a Nagpur area and then select a
            road or street to inspect its traffic
            conditions, risk level, police deployment
            and CCTV coverage.
          </p>
        </div>

      </section>


      {/* =====================================================
          LOCATION SEARCH
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-4">

          <h2 className="text-lg font-bold text-slate-900">
            Search Nagpur Location
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            First select an area, then select a road
            or street inside that area.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* AREA SEARCH */}

          <div className="relative">

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Nagpur Area
            </label>

            <div className="relative">

              <input
                type="text"
                value={areaQuery}
                onChange={(event) =>
                  setAreaQuery(
                    event.target.value
                  )
                }
                placeholder="Search area, neighbourhood..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {loadingAreas && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  Searching...
                </span>
              )}

            </div>


            {areaResults.length > 0 && (
              <SearchResults
                results={areaResults}
                type="area"
                onSelect={handleAreaSelect}
              />
            )}

          </div>


          {/* ROAD SEARCH */}

          <div className="relative">

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Road / Street
            </label>

            <div className="relative">

              <input
                type="text"
                value={roadQuery}
                disabled={!selectedArea}
                onChange={(event) =>
                  setRoadQuery(
                    event.target.value
                  )
                }
                placeholder={
                  selectedArea
                    ? "Search road or street..."
                    : "Select an area first"
                }
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  selectedArea
                    ? "border-slate-300 bg-white text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                }`}
              />

              {loadingRoads && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  Searching...
                </span>
              )}

            </div>


            {roadResults.length > 0 && (
              <SearchResults
                results={roadResults}
                type="road"
                onSelect={handleRoadSelect}
              />
            )}

          </div>

        </div>


        {/* CURRENT LOCATION */}

        <div className="mt-5 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Current Monitoring Location
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {selectedRoad ||
                selectedArea ||
                "Entire Nagpur City"}
            </p>

            {selectedRoad && (
              <p className="mt-1 text-xs text-slate-500">
                Area: {selectedArea}
              </p>
            )}

          </div>


          {(selectedArea ||
            selectedRoad) && (
            <button
              type="button"
              onClick={
                handleResetSearch
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Clear Search
            </button>
          )}

        </div>


        {searchError && (
          <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {searchError}
          </p>
        )}

      </section>


      {/* =====================================================
          SELECTED ROAD INFORMATION
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            Selected Location
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {selectedRoad ||
              selectedArea ||
              "Entire Nagpur City"}
          </h2>

          {selectedRoad && (
            <p className="mt-1 text-xs text-slate-500">
              {selectedArea}
            </p>
          )}

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <MetricCard
            title="Traffic Density"
            value={`${trafficDensity}%`}
            icon="🚦"
          />

          <MetricCard
            title="Police Allocated"
            value={policeAllocated}
            icon="👮"
          />

          <MetricCard
            title="Police Needed"
            value={policeRequired}
            icon="👮"
          />

          <MetricCard
            title="Traffic Risk"
            value={`${Math.min(
              riskScore,
              100
            )}/100`}
            icon="⚠️"
            valueClass={
              riskScore >= 85
                ? "text-red-600"
                : riskScore >= 70
                ? "text-orange-600"
                : "text-green-600"
            }
          />

          <MetricCard
            title="Traffic Ranking"
            value={
              trafficRanking
                ? `#${trafficRanking}`
                : "N/A"
            }
            icon="🏆"
          />

        </div>


        {policeGap > 0 && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-bold text-red-800">
              Police Deployment Gap
            </p>

            <p className="mt-1 text-xs text-red-700">
              {policeGap} additional officer
              {policeGap > 1 ? "s" : ""} required
              based on the current available data.
            </p>

          </div>
        )}

      </section>


      {/* =====================================================
          MAP
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-5">

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="font-bold text-slate-900">
                Nagpur Traffic Risk Map
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                The map automatically moves to the
                selected Nagpur location.
              </p>

            </div>


            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">

              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Low
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                No/Low Data
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                High
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                Critical
              </span>

            </div>

          </div>

        </div>


        <div className="h-[520px]">

          <NagpurMap
            selectedLocation={
              location
            }
          />

        </div>

      </section>


      {/* =====================================================
          CCTV
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            CCTV Coverage
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Cameras on{" "}
            {selectedRoad ||
              selectedArea ||
              "Selected Location"}
          </h2>

        </div>


        {cctvCameras.length > 0 ? (

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {cctvCameras.map(
              (camera, index) => (
                <CCTVCard
                  key={
                    camera.id ||
                    camera.cameraNo ||
                    index
                  }
                  camera={
                    camera
                  }
                />
              )
            )}

          </div>

        ) : (

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

            <div className="text-3xl">
              📹
            </div>

            <p className="mt-3 text-sm font-bold text-slate-700">
              CCTV data not available
            </p>

            <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-slate-500">
              No CCTV camera record is currently
              available in the frontend dataset for
              this location. We should connect this
              section to the VIGIL backend/CCTV
              database rather than displaying
              invented camera information.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          OVERALL NAGPUR SITUATION
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            City-Wide Intelligence
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Overall Nagpur Traffic Situation
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Overall traffic and incident indicators
            across Nagpur city.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <MetricCard
            title="City Traffic Density"
            value={`${citySituation.trafficDensity || 0}%`}
            icon="🚦"
          />

          <MetricCard
            title="Accidents"
            value={nagpurAccidents}
            icon="🚑"
            valueClass="text-red-600"
          />

          <MetricCard
            title="Critical Incidents"
            value={
              nagpurCriticalIncidents
            }
            icon="🚨"
            valueClass="text-red-600"
          />

          <MetricCard
            title="High-Risk Areas"
            value={
              nagpurHighRiskAreas
            }
            icon="⚠️"
            valueClass="text-orange-600"
          />

        </div>

      </section>


      {/* OSM ATTRIBUTION / DATA NOTE */}

      <div className="px-1 pb-4 text-[10px] leading-5 text-slate-400">

        <p>
          Location search and map data may use
          OpenStreetMap data. © OpenStreetMap
          contributors.
        </p>

        <p>
          Traffic, police deployment, incident and
          CCTV values will be connected to the VIGIL
          backend as the system moves from mock data
          to live operational data.
        </p>

      </div>

    </div>
  );
}


/*
 * ============================================================
 * SEARCH RESULT COMPONENT
 * ============================================================
 */

function SearchResults({
  results,
  type,
  onSelect,
}) {
  return (
    <div className="absolute left-0 right-0 top-full z-[1000] mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

      {results.map(
        (result, index) => (
          <button
            key={
              `${result.place_id}-${index}`
            }
            type="button"
            onClick={() =>
              onSelect(result)
            }
            className="w-full rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
          >

            <p className="text-sm font-bold text-slate-800">

              {type === "road"
                ? result.address
                    ?.road ||
                  result.display_name
                : result.address
                    ?.suburb ||
                  result.address
                    ?.neighbourhood ||
                  result.address
                    ?.city_district ||
                  result.display_name}

            </p>

            <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
              {result.display_name}
            </p>

          </button>
        )
      )}

    </div>
  );
}


/*
 * ============================================================
 * METRIC CARD
 * ============================================================
 */

function MetricCard({
  title,
  value,
  icon,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${valueClass}`}
          >
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


/*
 * ============================================================
 * CCTV CARD
 * ============================================================
 */

function CCTVCard({
  camera,
}) {
  const cameraNumber =
    camera.cameraNo ||
    camera.id ||
    "Unknown";

  const place =
    camera.place ||
    camera.location ||
    "Location unavailable";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

      <div className="flex h-36 items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="text-3xl">
            📹
          </div>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            CCTV Camera
          </p>

        </div>

      </div>


      <div className="p-4">

        <div className="flex items-center justify-between">

          <p className="text-sm font-bold text-slate-800">
            Camera {cameraNumber}
          </p>

          <span className="rounded-full bg-green-100 px-2 py-1 text-[9px] font-bold text-green-700">
            AVAILABLE
          </span>

        </div>

        <p className="mt-2 text-xs text-slate-500">
          {place}
        </p>

      </div>

    </div>
  );
}


/*
 * ============================================================
 * TRAFFIC RANKING
 *
 * Uses the existing areaSituation object.
 * This is temporary frontend logic.
 * Backend will eventually calculate the real ranking.
 * ============================================================
 */

function calculateTrafficRanking(
  currentArea
) {
  if (!currentArea) {
    return null;
  }

  const entries =
    Object.entries(
      areaSituation || {}
    );

  if (!entries.length) {
    return null;
  }

  const sorted =
    entries.sort(
      ([, first], [, second]) =>
        (second?.trafficDensity || 0) -
        (first?.trafficDensity || 0)
    );

  const index =
    sorted.findIndex(
      ([area]) =>
        area.toLowerCase() ===
        currentArea.toLowerCase()
    );

  if (index === -1) {
    return null;
  }

  return index + 1;
}


export default Dashboard;