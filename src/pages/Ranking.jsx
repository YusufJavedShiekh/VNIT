import { useState } from "react";

import { useLocation } from "../context/LocationContext";

/*
 * ============================================================
 * TEMPORARY FRONTEND DATA
 *
 * This is only for the frontend stage.
 *
 * Later this data will come from the VIGIL backend:
 *
 * Flask API
 * ↓
 * Traffic / ML data
 * ↓
 * Police deployment data
 * ↓
 * Ranking
 * ============================================================
 */

const rankingData = [
  {
    area: "Sitabuldi",

    trafficDensity: 92,
    trafficRisk: 92,
    trafficLevel: "Critical",

    policeAllocated: 5,
    policeRequired: 9,

    streets: [
      {
        name: "Main Road",
        trafficDensity: 94,
        trafficRisk: 94,
        trafficLevel: "Critical",

        policeAllocated: 2,
        policeRequired: 4,

        lat: 21.1458,
        lng: 79.0882,
      },

      {
        name: "Central Avenue",
        trafficDensity: 89,
        trafficRisk: 89,
        trafficLevel: "Critical",

        policeAllocated: 2,
        policeRequired: 3,

        lat: 21.151,
        lng: 79.087,
      },

      {
        name: "Mount Road",
        trafficDensity: 82,
        trafficRisk: 82,
        trafficLevel: "Very High",

        policeAllocated: 1,
        policeRequired: 2,

        lat: 21.148,
        lng: 79.084,
      },
    ],
  },

  {
    area: "Wardha Road",

    trafficDensity: 84,
    trafficRisk: 84,
    trafficLevel: "Very High",

    policeAllocated: 6,
    policeRequired: 10,

    streets: [
      {
        name: "Wardha Road",
        trafficDensity: 87,
        trafficRisk: 87,
        trafficLevel: "Critical",

        policeAllocated: 3,
        policeRequired: 5,

        lat: 21.118,
        lng: 79.081,
      },

      {
        name: "Airport Road",
        trafficDensity: 81,
        trafficRisk: 81,
        trafficLevel: "Very High",

        policeAllocated: 2,
        policeRequired: 3,

        lat: 21.092,
        lng: 79.059,
      },

      {
        name: "South Ambazari Road",
        trafficDensity: 74,
        trafficRisk: 74,
        trafficLevel: "High",

        policeAllocated: 1,
        policeRequired: 2,

        lat: 21.12,
        lng: 79.09,
      },
    ],
  },

  {
    area: "Sadar",

    trafficDensity: 82,
    trafficRisk: 82,
    trafficLevel: "Very High",

    policeAllocated: 4,
    policeRequired: 7,

    streets: [
      {
        name: "Sadar Main Road",
        trafficDensity: 85,
        trafficRisk: 85,
        trafficLevel: "Critical",

        policeAllocated: 2,
        policeRequired: 4,

        lat: 21.166,
        lng: 79.083,
      },

      {
        name: "Residency Road",
        trafficDensity: 78,
        trafficRisk: 78,
        trafficLevel: "High",

        policeAllocated: 1,
        policeRequired: 2,

        lat: 21.16,
        lng: 79.087,
      },

      {
        name: "Kasturchand Park Road",
        trafficDensity: 72,
        trafficRisk: 72,
        trafficLevel: "High",

        policeAllocated: 1,
        policeRequired: 1,

        lat: 21.154,
        lng: 79.085,
      },
    ],
  },

  {
    area: "Dharampeth",

    trafficDensity: 76,
    trafficRisk: 76,
    trafficLevel: "High",

    policeAllocated: 3,
    policeRequired: 6,

    streets: [
      {
        name: "West High Court Road",
        trafficDensity: 79,
        trafficRisk: 79,
        trafficLevel: "High",

        policeAllocated: 1,
        policeRequired: 3,

        lat: 21.146,
        lng: 79.057,
      },

      {
        name: "North Ambazari Road",
        trafficDensity: 73,
        trafficRisk: 73,
        trafficLevel: "High",

        policeAllocated: 1,
        policeRequired: 2,

        lat: 21.143,
        lng: 79.065,
      },

      {
        name: "L.A.D. College Road",
        trafficDensity: 68,
        trafficRisk: 68,
        trafficLevel: "Medium",

        policeAllocated: 1,
        policeRequired: 1,

        lat: 21.137,
        lng: 79.067,
      },
    ],
  },

  {
    area: "Mahal",

    trafficDensity: 69,
    trafficRisk: 69,
    trafficLevel: "Medium",

    policeAllocated: 3,
    policeRequired: 5,

    streets: [
      {
        name: "Mahal Main Road",
        trafficDensity: 72,
        trafficRisk: 72,
        trafficLevel: "High",

        policeAllocated: 1,
        policeRequired: 2,

        lat: 21.144,
        lng: 79.101,
      },

      {
        name: "Gandhi Gate Road",
        trafficDensity: 67,
        trafficRisk: 67,
        trafficLevel: "Medium",

        policeAllocated: 1,
        policeRequired: 2,

        lat: 21.145,
        lng: 79.104,
      },

      {
        name: "Narrow Gauge Road",
        trafficDensity: 63,
        trafficRisk: 63,
        trafficLevel: "Medium",

        policeAllocated: 1,
        policeRequired: 1,

        lat: 21.142,
        lng: 79.099,
      },
    ],
  },
];


/*
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */

function Ranking() {
  const [rankingType, setRankingType] =
    useState("traffic");

  const [expandedArea, setExpandedArea] =
    useState(null);

  const { selectArea } = useLocation();


  /*
   * ==========================================================
   * TRAFFIC RANKING
   * ==========================================================
   */

  const trafficRanking = [
    ...rankingData,
  ].sort(
    (a, b) =>
      b.trafficDensity -
      a.trafficDensity
  );


  /*
   * ==========================================================
   * POLICE REQUIREMENT RANKING
   *
   * Primary ranking:
   * Police requirement
   *
   * Secondary:
   * Deployment gap
   * ==========================================================
   */

  const policeRanking = [
    ...rankingData,
  ]
    .map((area) => ({
      ...area,

      deploymentGap:
        Math.max(
          area.policeRequired -
            area.policeAllocated,
          0
        ),

      requirementPercentage:
        area.policeRequired > 0
          ? Math.round(
              (area.policeRequired /
                area.policeAllocated) *
                100
            )
          : 0,
    }))
    .sort(
      (a, b) => {
        if (
          b.policeRequired !==
          a.policeRequired
        ) {
          return (
            b.policeRequired -
            a.policeRequired
          );
        }

        return (
          b.deploymentGap -
          a.deploymentGap
        );
      }
    );


  /*
   * ==========================================================
   * SELECT AREA
   * ==========================================================
   */

  function handleAreaClick(area) {
    const isAlreadyOpen =
      expandedArea === area.area;

    setExpandedArea(
      isAlreadyOpen
        ? null
        : area.area
    );
  }


  /*
   * ==========================================================
   * SELECT STREET
   *
   * This updates LocationContext.
   * Dashboard + map can therefore react to it.
   * ==========================================================
   */

  function handleStreetClick(
    area,
    street
  ) {
    selectArea({
      area: area.area,
      street: street.name,

      displayName:
        street.name,

      lat: street.lat,
      lng: street.lng,

      zoom: 17,

      source: "ranking",
    });
  }


  const activeRanking =
    rankingType === "traffic"
      ? trafficRanking
      : policeRanking;


  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6">

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          VIGIL Intelligence
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Nagpur Area Ranking
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Compare Nagpur areas according to
          traffic conditions and police deployment
          requirements. Select an area to inspect
          its individual roads and streets.
        </p>

      </div>


      {/* =====================================================
          RANKING TYPE SWITCH
      ====================================================== */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">

          <button
            type="button"
            onClick={() => {
              setRankingType(
                "traffic"
              );

              setExpandedArea(
                null
              );
            }}
            className={`rounded-xl px-5 py-4 text-left transition ${
              rankingType ===
              "traffic"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >

            <div className="flex items-center gap-3">

              <span className="text-2xl">
                🚦
              </span>

              <div>

                <p className="font-bold">
                  Traffic Ranking
                </p>

                <p
                  className={`mt-1 text-xs ${
                    rankingType ===
                    "traffic"
                      ? "text-blue-100"
                      : "text-slate-400"
                  }`}
                >
                  Rank areas by traffic
                  density and risk
                </p>

              </div>

            </div>

          </button>


          <button
            type="button"
            onClick={() => {
              setRankingType(
                "police"
              );

              setExpandedArea(
                null
              );
            }}
            className={`rounded-xl px-5 py-4 text-left transition ${
              rankingType ===
              "police"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >

            <div className="flex items-center gap-3">

              <span className="text-2xl">
                👮
              </span>

              <div>

                <p className="font-bold">
                  Police Requirement Ranking
                </p>

                <p
                  className={`mt-1 text-xs ${
                    rankingType ===
                    "police"
                      ? "text-blue-100"
                      : "text-slate-400"
                  }`}
                >
                  Rank areas by officer
                  requirement
                </p>

              </div>

            </div>

          </button>

        </div>

      </div>


      {/* =====================================================
          INFORMATION HEADER
      ====================================================== */}

      <div className="mb-4 rounded-xl border border-slate-200 bg-white px-5 py-4">

        {rankingType ===
        "traffic" ? (
          <>
            <p className="text-sm font-bold text-slate-800">
              Traffic Risk Ranking
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Areas are ranked from highest to
              lowest traffic density. Click an
              area to see the traffic ranking of
              roads and streets inside it.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-slate-800">
              Police Requirement Ranking
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Areas with the highest estimated
              police requirement appear first.
              The deployment gap shows how many
              additional officers may be needed.
            </p>
          </>
        )}

      </div>


      {/* =====================================================
          RANKING LIST
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {activeRanking.map(
          (area, index) => {

            const isOpen =
              expandedArea ===
              area.area;

            const deploymentGap =
              Math.max(
                area.policeRequired -
                  area.policeAllocated,
                0
              );

            return (
              <div
                key={area.area}
                className="border-b border-slate-100 last:border-b-0"
              >

                {/* =========================================
                    AREA ROW
                ========================================== */}

                <button
                  type="button"
                  onClick={() =>
                    handleAreaClick(
                      area
                    )
                  }
                  className="w-full px-4 py-5 text-left transition hover:bg-slate-50 md:px-6"
                >

                  <div className="flex items-center gap-3 md:gap-5">

                    {/* RANK */}

                    <div className="flex w-8 shrink-0 items-center justify-center">

                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? "bg-amber-100 text-amber-700"
                            : index === 1
                            ? "bg-slate-100 text-slate-600"
                            : index === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        #{index + 1}
                      </span>

                    </div>


                    {/* AREA NAME */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate font-bold text-slate-900">
                        {area.area}
                      </p>

                      {rankingType ===
                      "traffic" ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {area.trafficLevel}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-slate-500">
                          {area.policeRequired} officers
                          required
                        </p>
                      )}

                    </div>


                    {/* VALUES */}

                    {rankingType ===
                    "traffic" ? (
                      <div className="hidden text-right sm:block">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Traffic Density
                        </p>

                        <p
                          className={`mt-1 text-lg font-bold ${getTrafficColor(
                            area.trafficDensity
                          )}`}
                        >
                          {area.trafficDensity}%
                        </p>

                      </div>
                    ) : (
                      <div className="hidden text-right sm:block">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Police Needed
                        </p>

                        <p className="mt-1 text-lg font-bold text-blue-600">
                          {area.policeRequired}
                        </p>

                      </div>
                    )}


                    {/* SECOND VALUE */}

                    {rankingType ===
                    "traffic" ? (
                      <div className="text-right">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Risk
                        </p>

                        <p
                          className={`mt-1 text-lg font-bold ${getTrafficColor(
                            area.trafficRisk
                          )}`}
                        >
                          {area.trafficRisk}
                        </p>

                      </div>
                    ) : (
                      <div className="text-right">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Gap
                        </p>

                        <p
                          className={`mt-1 text-lg font-bold ${
                            deploymentGap >
                            0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {deploymentGap}
                        </p>

                      </div>
                    )}


                    {/* ARROW */}

                    <span className="w-5 shrink-0 text-center text-xs text-slate-400">

                      {isOpen
                        ? "▲"
                        : "▼"}

                    </span>

                  </div>


                  {/* MOBILE SUMMARY */}

                  <div className="mt-3 flex gap-4 pl-11 sm:hidden">

                    {rankingType ===
                    "traffic" ? (
                      <>
                        <span className="text-xs text-slate-500">
                          Density:
                          <strong
                            className={`ml-1 ${getTrafficColor(
                              area.trafficDensity
                            )}`}
                          >
                            {
                              area.trafficDensity
                            }
                            %
                          </strong>
                        </span>

                        <span className="text-xs text-slate-500">
                          Risk:
                          <strong
                            className={`ml-1 ${getTrafficColor(
                              area.trafficRisk
                            )}`}
                          >
                            {
                              area.trafficRisk
                            }
                          </strong>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-slate-500">
                          Needed:
                          <strong className="ml-1 text-blue-600">
                            {
                              area.policeRequired
                            }
                          </strong>
                        </span>

                        <span className="text-xs text-slate-500">
                          Gap:
                          <strong
                            className={`ml-1 ${
                              deploymentGap >
                              0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {
                              deploymentGap
                            }
                          </strong>
                        </span>
                      </>
                    )}

                  </div>

                </button>


                {/* =========================================
                    EXPANDED STREET LIST
                ========================================== */}

                {isOpen && (
                  <div className="bg-slate-50 px-4 pb-5 pt-1 md:px-8">

                    <div className="mb-3 flex items-center justify-between">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          {rankingType ===
                          "traffic"
                            ? "Street / Road Traffic Ranking"
                            : "Street / Road Police Requirement"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {area.area}
                        </p>

                      </div>

                    </div>


                    {/* STREET ROWS */}

                    <div className="space-y-2">

                      {getSortedStreets(
                        area.streets,
                        rankingType
                      ).map(
                        (
                          street,
                          streetIndex
                        ) => {

                          const streetGap =
                            Math.max(
                              street.policeRequired -
                                street.policeAllocated,
                              0
                            );

                          return (
                            <button
                              key={
                                street.name
                              }
                              type="button"
                              onClick={() =>
                                handleStreetClick(
                                  area,
                                  street
                                )
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm"
                            >

                              <div className="flex items-center gap-3">

                                {/* STREET RANK */}

                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                  {streetIndex +
                                    1}
                                </span>


                                {/* STREET NAME */}

                                <div className="min-w-0 flex-1">

                                  <p className="truncate text-sm font-bold text-slate-800">
                                    {
                                      street.name
                                    }
                                  </p>

                                  <p className="mt-1 text-[10px] text-slate-400">
                                    Click to view on map
                                  </p>

                                </div>


                                {/* TRAFFIC MODE */}

                                {rankingType ===
                                "traffic" ? (
                                  <>

                                    <div className="text-right">

                                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                        Density
                                      </p>

                                      <p
                                        className={`mt-1 text-sm font-bold ${getTrafficColor(
                                          street.trafficDensity
                                        )}`}
                                      >
                                        {
                                          street.trafficDensity
                                        }
                                        %
                                      </p>

                                    </div>

                                    <div className="hidden text-right sm:block">

                                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                        Risk
                                      </p>

                                      <p
                                        className={`mt-1 text-sm font-bold ${getTrafficColor(
                                          street.trafficRisk
                                        )}`}
                                      >
                                        {
                                          street.trafficRisk
                                        }
                                      </p>

                                    </div>

                                  </>
                                ) : (

                                  /* POLICE MODE */

                                  <>

                                    <div className="text-right">

                                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                        Needed
                                      </p>

                                      <p className="mt-1 text-sm font-bold text-blue-600">
                                        {
                                          street.policeRequired
                                        }
                                      </p>

                                    </div>

                                    <div className="text-right">

                                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                        Gap
                                      </p>

                                      <p
                                        className={`mt-1 text-sm font-bold ${
                                          streetGap >
                                          0
                                            ? "text-red-600"
                                            : "text-green-600"
                                        }`}
                                      >
                                        {
                                          streetGap
                                        }
                                      </p>

                                    </div>

                                  </>

                                )}


                                <span className="text-xs text-slate-300">
                                  →
                                </span>

                              </div>

                            </button>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

              </div>
            );
          }
        )}

      </div>


      {/* =====================================================
          FOOTNOTE
      ====================================================== */}

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">

        {rankingType ===
        "traffic" ? (
          <p className="text-xs leading-5 text-blue-700">
            <strong>Traffic ranking:</strong>{" "}
            Higher traffic density and risk values
            place an area or road higher in the
            ranking. Select a road to open its
            location on the VIGIL map.
          </p>
        ) : (
          <p className="text-xs leading-5 text-blue-700">
            <strong>Police ranking:</strong>{" "}
            Areas requiring more officers appear
            higher. The deployment gap indicates
            the difference between estimated
            requirement and currently allocated
            officers.
          </p>
        )}

      </div>

    </div>
  );
}


/*
 * ============================================================
 * SORT STREETS
 * ============================================================
 */

function getSortedStreets(
  streets,
  rankingType
) {
  if (!streets) {
    return [];
  }

  return [...streets].sort(
    (a, b) => {

      if (
        rankingType ===
        "traffic"
      ) {
        return (
          b.trafficDensity -
          a.trafficDensity
        );
      }

      const gapA =
        Math.max(
          a.policeRequired -
            a.policeAllocated,
          0
        );

      const gapB =
        Math.max(
          b.policeRequired -
            b.policeAllocated,
          0
        );

      if (
        gapB !== gapA
      ) {
        return gapB - gapA;
      }

      return (
        b.policeRequired -
        a.policeRequired
      );
    }
  );
}


/*
 * ============================================================
 * TRAFFIC COLOR
 * ============================================================
 */

function getTrafficColor(
  value
) {
  if (value >= 85) {
    return "text-red-600";
  }

  if (value >= 70) {
    return "text-orange-600";
  }

  if (value >= 50) {
    return "text-yellow-600";
  }

  return "text-green-600";
}


export default Ranking;
