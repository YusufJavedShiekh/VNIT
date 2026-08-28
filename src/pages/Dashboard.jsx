import {
  useEffect,
  useMemo,
  useState,
} from "react";

import NagpurMap from "../components/NagpurMap";

import {
  useLocation,
} from "../context/LocationContext";

import {
  citySituation,
  areaSituation,
  incidents,
} from "../data/vigilMockData";

import {
  NAGPUR_BOUNDS,
} from "../data/nagpurLocations";


function Dashboard() {

  const {
    location,
    setLocation,
  } = useLocation();


  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    searchResults,
    setSearchResults,
  ] = useState([]);

  const [
    loadingSearch,
    setLoadingSearch,
  ] = useState(false);

  const [
    searchError,
    setSearchError,
  ] = useState("");


  /*
   * =========================================================
   * LOCATION STATE
   * =========================================================
   */

  const hasSelectedLocation =
    location?.scope === "area" ||
    location?.scope === "street";

  const selectedArea =
    location?.area || "";

  const selectedRoad =
    location?.street || "";


  /*
   * =========================================================
   * SELECTED AREA DATA
   * =========================================================
   */

  const selectedAreaData =
    areaSituation[
      selectedArea
    ] || null;


  /*
   * =========================================================
   * SEARCH NAGPUR
   * =========================================================
   */

  useEffect(() => {

    if (
      !searchQuery.trim()
    ) {
      setSearchResults([]);
      return;
    }

    /*
     * Don't search again after the user
     * has selected an exact result.
     */

    if (
      searchQuery ===
        location?.displayName ||
      searchQuery ===
        location?.street ||
      searchQuery ===
        location?.area
    ) {
      return;
    }

    const controller =
      new AbortController();

    const timer =
      setTimeout(
        async () => {

          try {

            setLoadingSearch(true);
            setSearchError("");

            const params =
              new URLSearchParams({
                q:
                  `${searchQuery}, Nagpur, Maharashtra, India`,

                format:
                  "jsonv2",

                addressdetails:
                  "1",

                limit:
                  "10",

                countrycodes:
                  "in",

                /*
                 * Bounding box restricts
                 * results to Nagpur.
                 *
                 * The actual final filter
                 * below provides another
                 * layer of protection.
                 */
                viewbox:
                  `${NAGPUR_BOUNDS.west},${NAGPUR_BOUNDS.north},${NAGPUR_BOUNDS.east},${NAGPUR_BOUNDS.south}`,

                bounded:
                  "1",
              });


            const response =
              await fetch(
                `https://nominatim.openstreetmap.org/search?${params}`,
                {
                  signal:
                    controller.signal,

                  headers: {
                    Accept:
                      "application/json",
                  },
                }
              );


            if (
              !response.ok
            ) {
              throw new Error(
                "Location search failed."
              );
            }


            const data =
              await response.json();


            /*
             * ------------------------------------------------
             * Nagpur-only filtering
             * ------------------------------------------------
             */

            const nagpurResults =
              data.filter(
                (item) => {

                  const address =
                    item.address ||
                    {};

                  const city =
                    (
                      address.city ||
                      address.town ||
                      address.municipality ||
                      ""
                    ).toLowerCase();

                  const display =
                    (
                      item.display_name ||
                      ""
                    ).toLowerCase();

                  const lat =
                    Number(
                      item.lat
                    );

                  const lng =
                    Number(
                      item.lon
                    );

                  const insideBounds =
                    Number.isFinite(
                      lat
                    ) &&
                    Number.isFinite(
                      lng
                    ) &&
                    lat >=
                      NAGPUR_BOUNDS.south &&
                    lat <=
                      NAGPUR_BOUNDS.north &&
                    lng >=
                      NAGPUR_BOUNDS.west &&
                    lng <=
                      NAGPUR_BOUNDS.east;


                  return (
                    insideBounds &&
                    (
                      city.includes(
                        "nagpur"
                      ) ||
                      display.includes(
                        "nagpur"
                      )
                    )
                  );
                }
              );


            /*
             * ------------------------------------------------
             * Remove police stations.
             * ------------------------------------------------
             */

            const filteredResults =
              nagpurResults.filter(
                (item) => {

                  const type =
                    (
                      item.type ||
                      ""
                    ).toLowerCase();

                  const category =
                    (
                      item.category ||
                      ""
                    ).toLowerCase();

                  const name =
                    (
                      item.display_name ||
                      ""
                    ).toLowerCase();


                  const isPoliceStation =
                    type.includes(
                      "police"
                    ) ||
                    category.includes(
                      "police"
                    ) ||
                    name.includes(
                      "police station"
                    );


                  return (
                    !isPoliceStation
                  );
                }
              );


            setSearchResults(
              filteredResults
            );

          } catch (
            error
          ) {

            if (
              error.name !==
              "AbortError"
            ) {

              console.error(
                error
              );

              setSearchError(
                "Unable to search Nagpur locations right now."
              );
            }

          } finally {

            setLoadingSearch(
              false
            );
          }

        },
        500
      );


    return () => {

      clearTimeout(
        timer
      );

      controller.abort();

    };

  }, [
    searchQuery,
    location?.displayName,
    location?.street,
    location?.area,
  ]);


  /*
   * =========================================================
   * SEARCH RESULT SELECTION
   * =========================================================
   */

  function handleSearchSelect(
    result
  ) {

    const address =
      result.address ||
      {};

    const lat =
      Number(
        result.lat
      );

    const lng =
      Number(
        result.lon
      );


    const road =
      address.road ||
      "";


    const area =
      address.suburb ||
      address.neighbourhood ||
      address.city_district ||
      address.quarter ||
      "";


    const resultName =
      result.name ||
      result.display_name ||
      "";


    const type =
      (
        result.type ||
        ""
      ).toLowerCase();


    const roadTypes = [
      "road",
      "residential",
      "tertiary",
      "secondary",
      "primary",
      "pedestrian",
      "living_street",
      "service",
      "unclassified",
      "path",
      "footway",
      "cycleway",
      "track",
    ];


    /*
     * --------------------------------------------------------
     * Nagpur city itself
     * --------------------------------------------------------
     */

    const isNagpur =
      resultName
        .toLowerCase()
        .trim() ===
        "nagpur";


    if (
      isNagpur &&
      !road
    ) {

      setLocation({
        scope:
          "nagpur",

        area:
          "",

        street:
          "",

        policeStation:
          "",

        displayName:
          "Entire Nagpur City",

        lat:
          Number.isFinite(
            lat
          )
            ? lat
            : null,

        lng:
          Number.isFinite(
            lng
          )
            ? lng
            : null,

        zoom:
          11,

        source:
          "search",
      });


      setSearchQuery(
        "Nagpur"
      );

      setSearchResults(
        []
      );

      return;
    }


    /*
     * --------------------------------------------------------
     * Street / Road
     * --------------------------------------------------------
     */

    if (
      road &&
      roadTypes.includes(
        type
      )
    ) {

      setLocation({
        scope:
          "street",

        area:
          area,

        street:
          road,

        policeStation:
          "",

        displayName:
          road,

        lat:
          lat,

        lng:
          lng,

        zoom:
          17,

        source:
          "search",
      });


      setSearchQuery(
        road
      );

      setSearchResults(
        []
      );

      return;
    }


    /*
     * --------------------------------------------------------
     * Area
     * --------------------------------------------------------
     */

    const areaName =
      area ||
      resultName;


    setLocation({
      scope:
        "area",

      area:
        areaName,

      street:
        "",

      policeStation:
        "",

      displayName:
        areaName,

      lat:
        lat,

      lng:
        lng,

      zoom:
        14,

      source:
        "search",
    });


    setSearchQuery(
      areaName
    );

    setSearchResults(
      []
    );
  }


  /*
   * =========================================================
   * CLEAR SEARCH
   * =========================================================
   */

  function handleClearSearch() {

    setSearchQuery("");

    setSearchResults([]);

    setSearchError("");

    setLocation({
      scope:
        "nagpur",

      area:
        "",

      street:
        "",

      policeStation:
        "",

      displayName:
        "Entire Nagpur City",

      lat:
        null,

      lng:
        null,

      zoom:
        11,

      source:
        "default",
    });
  }


  /*
   * =========================================================
   * VISIBLE INCIDENTS
   * =========================================================
   */

  const visibleIncidents =
    useMemo(
      () => {

        /*
         * No selected area/street.
         *
         * Selected-location data should not
         * appear.
         */

        if (
          !hasSelectedLocation
        ) {
          return [];
        }


        /*
         * Street
         */

        if (
          selectedRoad
        ) {

          const road =
            selectedRoad
              .toLowerCase();

          return incidents.filter(
            (incident) => {

              const incidentRoad =
                (
                  incident.road ||
                  ""
                ).toLowerCase();

              return (
                incidentRoad ===
                  road ||
                incidentRoad.includes(
                  road
                ) ||
                road.includes(
                  incidentRoad
                )
              );
            }
          );
        }


        /*
         * Area
         */

        if (
          selectedArea
        ) {

          const area =
            selectedArea
              .toLowerCase();

          return incidents.filter(
            (incident) => {

              const incidentArea =
                (
                  incident.area ||
                  ""
                ).toLowerCase();

              return (
                incidentArea ===
                  area ||
                incidentArea.includes(
                  area
                ) ||
                area.includes(
                  incidentArea
                )
              );
            }
          );
        }


        return [];

      },
      [
        hasSelectedLocation,
        selectedArea,
        selectedRoad,
      ]
    );


  /*
   * =========================================================
   * ACCIDENTS
   * =========================================================
   */

  const selectedAccidents =
    visibleIncidents.filter(
      (incident) =>
        (
          incident.type ||
          ""
        ).toLowerCase() ===
        "accident"
    );


  /*
   * =========================================================
   * EMERGENCY ALERT
   * =========================================================
   */

  const latestAccident =
    selectedAccidents
      .slice()
      .sort(
        (
          first,
          second
        ) => {

          const firstTime =
            new Date(
              first.timestamp ||
                first.time ||
                0
            ).getTime();

          const secondTime =
            new Date(
              second.timestamp ||
                second.time ||
                0
            ).getTime();

          return (
            secondTime -
            firstTime
          );
        }
      )[0] ||
    null;


  /*
   * =========================================================
   * SELECTED LOCATION METRICS
   * =========================================================
   */

  const trafficDensity =
    hasSelectedLocation
      ? (
          selectedAreaData
            ?.trafficDensity ??
          0
        )
      : 0;


  const riskScore =
    hasSelectedLocation
      ? (
          selectedAreaData
            ?.riskScore ??
          Math.round(
            trafficDensity *
              0.8
          )
        )
      : 0;


  const policeAllocated =
    hasSelectedLocation
      ? (
          selectedAreaData
            ?.policeAllocated ??
          0
        )
      : 0;


  const policeRequired =
    hasSelectedLocation
      ? (
          selectedAreaData
            ?.policeRequired ??
          0
        )
      : 0;


  const policeGap =
    Math.max(
      policeRequired -
        policeAllocated,
      0
    );


  /*
   * =========================================================
   * TRAFFIC RANKING
   * =========================================================
   */

  const trafficRanking =
    hasSelectedLocation
      ? calculateTrafficRanking(
          selectedArea
        )
      : null;


  /*
   * =========================================================
   * CCTV
   * =========================================================
   */

  const cctvCameras =
    hasSelectedLocation
      ? (
          selectedAreaData?.cctv ||
          selectedAreaData?.cameras ||
          []
        )
      : [];


  /*
   * =========================================================
   * OVERALL NAGPUR INFORMATION
   * =========================================================
   */

  const nagpurAccidents =
    incidents.filter(
      (incident) =>
        (
          incident.type ||
          ""
        ).toLowerCase() ===
        "accident"
    ).length;


  const nagpurCriticalIncidents =
    incidents.filter(
      (incident) =>
        (
          incident.severity ||
          ""
        ).toLowerCase() ===
        "critical"
    ).length;


  const nagpurHighRiskAreas =
    citySituation.highRiskAreas ||
    0;


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="relative">

          <div className="relative">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              🔍
            </span>


            <input
              type="text"
              value={
                searchQuery
              }
              onChange={(
                event
              ) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search Nagpur area or street..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-24 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />


            {loadingSearch && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                Searching...
              </span>
            )}


            {searchQuery &&
              !loadingSearch && (
                <button
                  type="button"
                  onClick={
                    handleClearSearch
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Clear
                </button>
              )}

          </div>


          {searchResults.length >
            0 && (
            <SearchResults
              results={
                searchResults
              }
              onSelect={
                handleSearchSelect
              }
            />
          )}

        </div>


        {searchError && (
          <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {searchError}
          </p>
        )}

      </section>


      {/* =====================================================
          EMERGENCY ALERT
      ====================================================== */}

      {hasSelectedLocation &&
        latestAccident && (

        <section className="rounded-2xl border border-red-200 bg-red-50 p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-xl">
              🚨
            </div>


            <div>

              <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                Emergency Alert
              </p>


              <h2 className="mt-1 text-lg font-bold text-red-900">
                Accident detected
              </h2>


              <p className="mt-1 text-sm text-red-800">
                {latestAccident.road ||
                  latestAccident.area ||
                  location.displayName}
              </p>


              {latestAccident.severity && (
                <p className="mt-1 text-xs font-semibold text-red-700">
                  Severity:{" "}
                  {
                    latestAccident.severity
                  }
                </p>
              )}

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          SELECTED LOCATION DATA
      ====================================================== */}

      {hasSelectedLocation && (

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Selected Location
            </p>


            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {selectedRoad ||
                selectedArea}
            </h2>


            {selectedRoad &&
              selectedArea && (
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
              value={
                policeAllocated
              }
              icon="👮"
            />


            <MetricCard
              title="Police Needed"
              value={
                policeRequired
              }
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
                riskScore >= 70
                  ? "text-red-600"
                  : riskScore >= 40
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
                {policeGap} additional
                officer
                {policeGap > 1
                  ? "s"
                  : ""}{" "}
                required based on
                the current available
                data.
              </p>

            </div>

          )}

        </section>

      )}


      {/* =====================================================
          MAP
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-5">

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <h2 className="font-bold text-slate-900">
              Nagpur Traffic Risk Map
            </h2>


            <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-500">

              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Low
              </span>


              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                No Data
              </span>


              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                Moderate
              </span>


              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                High
              </span>

            </div>

          </div>

        </div>


        <div className="h-[520px]">

          <NagpurMap />

        </div>

      </section>


      {/* =====================================================
          CCTV
      ====================================================== */}

      {hasSelectedLocation && (

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              CCTV Coverage
            </p>


            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Cameras on{" "}
              {selectedRoad ||
                selectedArea}
            </h2>

          </div>


          {cctvCameras.length >
          0 ? (

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

              {cctvCameras.map(
                (
                  camera,
                  index
                ) => (

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
                No CCTV camera record is
                currently available for
                this location.
              </p>

            </div>

          )}

        </section>

      )}


      {/* =====================================================
          OVERALL NAGPUR INFORMATION
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
            Overall traffic and incident
            indicators across Nagpur city.
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
            value={
              nagpurAccidents
            }
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


      {/* =====================================================
          OSM ATTRIBUTION
      ====================================================== */}

      <div className="px-1 pb-4 text-[10px] leading-5 text-slate-400">

        <p>
          Location search and map data may
          use OpenStreetMap data. ©
          OpenStreetMap contributors.
        </p>


        <p>
          Traffic, police deployment,
          incident and CCTV values will be
          connected to the VIGIL backend as
          the system moves from mock data to
          live operational data.
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
  onSelect,
}) {
  return (
    <div className="absolute left-0 right-0 top-full z-[1000] mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

      {results.map(
        (
          result,
          index
        ) => {

          const address =
            result.address ||
            {};

          const road =
            address.road;

          const area =
            address.suburb ||
            address.neighbourhood ||
            address.city_district ||
            address.quarter;

          const title =
            road ||
            area ||
            result.name ||
            result.display_name;


          return (

            <button
              key={`${result.place_id}-${index}`}
              type="button"
              onClick={() =>
                onSelect(
                  result
                )
              }
              className="w-full rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
            >

              <p className="text-sm font-bold text-slate-800">
                {title}
              </p>


              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                {result.display_name}
              </p>

            </button>

          );
        }
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
  valueClass =
    "text-slate-900",
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
            Camera{" "}
            {cameraNumber}
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
 * ============================================================
 */

function calculateTrafficRanking(
  currentArea
) {

  if (
    !currentArea
  ) {
    return null;
  }


  const entries =
    Object.entries(
      areaSituation || {}
    );


  if (
    !entries.length
  ) {
    return null;
  }


  const sorted =
    entries.sort(
      (
        [, first],
        [, second]
      ) =>
        (
          second?.trafficDensity ||
          0
        ) -
        (
          first?.trafficDensity ||
          0
        )
    );


  const index =
    sorted.findIndex(
      ([area]) =>
        area.toLowerCase() ===
        currentArea.toLowerCase()
    );


  if (
    index === -1
  ) {
    return null;
  }


  return index + 1;
}


export default Dashboard;