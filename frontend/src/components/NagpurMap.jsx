import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

import { NAGPUR_CENTER } from "../data/nagpurLocations";

import { useLocation } from "../context/LocationContext";

import {
  areaSituation,
} from "../data/vigilMockData";


/*
 * =========================================================
 * MAP SETTINGS
 * =========================================================
 */

const DEFAULT_ZOOM = 11;


/*
 * =========================================================
 * HEATMAP GRADIENT
 *
 * Green  -> Low
 * Yellow -> Moderate
 * Orange -> High
 * Red    -> Critical
 * =========================================================
 */

const HEAT_GRADIENT = {
  0.00: "#16a34a",
  0.25: "#22c55e",
  0.45: "#facc15",
  0.65: "#f59e0b",
  0.80: "#f97316",
  1.00: "#dc2626",
};


/*
 * =========================================================
 * NAGPUR AREA COORDINATES
 *
 * These are map visualization coordinates for the
 * current VIGIL frontend mock-data stage.
 *
 * The backend will eventually replace these with
 * real CCTV / traffic coordinates.
 * =========================================================
 */

const NAGPUR_AREA_COORDINATES = {

  "Sadar": [
    21.1577,
    79.0882,
  ],

  "Sitabuldi": [
    21.1458,
    79.0882,
  ],

  "Dharampeth": [
    21.1491,
    79.0688,
  ],

  "Civil Lines": [
    21.1535,
    79.0722,
  ],

  "Mahal": [
    21.1415,
    79.1010,
  ],

  "Itwari": [
    21.1550,
    79.1025,
  ],

  "Dhantoli": [
    21.1320,
    79.0880,
  ],

  "Laxmi Nagar": [
    21.1307,
    79.0618,
  ],

  "Ambazari": [
    21.1430,
    79.0465,
  ],

  "Ajni": [
    21.1217,
    79.0915,
  ],

  "Manish Nagar": [
    21.1075,
    79.0805,
  ],

  "Wardha Road": [
    21.1178,
    79.0918,
  ],

  "Ganeshpeth": [
    21.1365,
    79.0935,
  ],

  "Cotton Market": [
    21.1370,
    79.0980,
  ],

  "Gandhibagh": [
    21.1445,
    79.0990,
  ],

  "Nandanvan": [
    21.1320,
    79.1235,
  ],

  "Sakkardara": [
    21.1250,
    79.1160,
  ],

  "Pratap Nagar": [
    21.1190,
    79.0475,
  ],

  "Bajaj Nagar": [
    21.1325,
    79.0555,
  ],

  "Mankapur": [
    21.1780,
    79.0820,
  ],

  "Gittikhadan": [
    21.1755,
    79.0530,
  ],

  "Jaripatka": [
    21.1785,
    79.1030,
  ],

  "Wadi": [
    21.1450,
    79.0150,
  ],

  "Hudkeshwar": [
    21.0980,
    79.1160,
  ],

  "Sonegaon": [
    21.1125,
    79.0900,
  ],

  "Lakadganj": [
    21.1580,
    79.1165,
  ],
};


/*
 * =========================================================
 * NORMALIZE AREA NAME
 * =========================================================
 */

function normalizeAreaName(
  name = ""
) {
  return String(name)
    .trim()
    .toLowerCase();
}


/*
 * =========================================================
 * FIND AREA COORDINATES
 * =========================================================
 */

function getAreaCoordinates(
  areaName
) {
  if (!areaName) {
    return null;
  }

  const target =
    normalizeAreaName(
      areaName
    );

  const entry =
    Object.entries(
      NAGPUR_AREA_COORDINATES
    ).find(
      ([area]) =>
        normalizeAreaName(
          area
        ) === target
    );

  return entry
    ? entry[1]
    : null;
}


/*
 * =========================================================
 * GET AREA RISK
 * =========================================================
 */

function getAreaRisk(
  areaName
) {
  if (!areaName) {
    return 0;
  }

  const target =
    normalizeAreaName(
      areaName
    );

  const entry =
    Object.entries(
      areaSituation || {}
    ).find(
      ([area]) =>
        normalizeAreaName(
          area
        ) === target
    );

  return Number(
    entry?.[1]?.riskScore
  ) || Number(
    entry?.[1]?.trafficDensity
  ) || 50;
}


/*
 * =========================================================
 * RISK -> HEAT INTENSITY
 * =========================================================
 */

function getIntensity(
  risk
) {
  const value =
    Number(risk) || 0;

  return Math.max(
    0.12,
    Math.min(
      value / 100,
      1
    )
  );
}


/*
 * =========================================================
 * CREATE CITY HEAT POINTS
 *
 * One heat cluster for EVERY VIGIL area.
 * =========================================================
 */

function createNagpurHeatPoints() {

  return Object.entries(
    NAGPUR_AREA_COORDINATES
  )
    .map(
      ([area, coordinates]) => {

        const risk =
          getAreaRisk(
            area
          );

        const intensity =
          getIntensity(
            risk
          );

        return [
          coordinates[0],
          coordinates[1],
          intensity,
        ];
      }
    );
}


/*
 * =========================================================
 * MAP CONTROLLER
 *
 * Nagpur -> zoom 11
 * Area   -> zoom 14
 * Street -> zoom 17
 * =========================================================
 */

function MapController({
  location,
}) {

  const map =
    useMap();


  useEffect(() => {

    const lat =
      Number(location?.lat);

    const lng =
      Number(location?.lng);


    /*
     * -------------------------------------------------------
     * NAGPUR
     * -------------------------------------------------------
     */

    if (
      location?.scope ===
        "nagpur"
    ) {

      map.flyTo(
        [
          NAGPUR_CENTER.lat,
          NAGPUR_CENTER.lng,
        ],
        DEFAULT_ZOOM,
        {
          animate: true,
          duration: 1.2,
        }
      );

      return;
    }


    /*
     * -------------------------------------------------------
     * SEARCHED AREA / STREET
     * -------------------------------------------------------
     */

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {

      map.flyTo(
        [
          lat,
          lng,
        ],
        Number(
          location.zoom
        ) || 14,
        {
          animate: true,
          duration: 1.2,
        }
      );
    }

  }, [
    map,
    location?.scope,
    location?.lat,
    location?.lng,
    location?.zoom,
  ]);


  return null;
}


/*
 * =========================================================
 * HEATMAP LAYER
 * =========================================================
 */

function HeatMapLayer({
  location,
}) {

  const map =
    useMap();


  useEffect(() => {

    /*
     * -------------------------------------------------------
     * REMOVE OLD HEATMAP
     * -------------------------------------------------------
     */

    const oldHeatLayers = [];

    map.eachLayer(
      (layer) => {

        if (
          layer instanceof
          L.HeatLayer
        ) {
          oldHeatLayers.push(
            layer
          );
        }

      }
    );

    oldHeatLayers.forEach(
      (layer) => {

        if (
          map.hasLayer(
            layer
          )
        ) {
          map.removeLayer(
            layer
          );
        }

      }
    );


    /*
     * =======================================================
     * CASE 1
     *
     * ENTIRE NAGPUR
     * =======================================================
     */

    if (
      location?.scope ===
        "nagpur"
    ) {

      const cityPoints =
        createNagpurHeatPoints();


      const heatLayer =
        L.heatLayer(
          cityPoints,
          {
            radius: 42,

            blur: 30,

            maxZoom: 16,

            max: 1,

            minOpacity: 0.45,

            gradient:
              HEAT_GRADIENT,
          }
        );


      heatLayer.addTo(
        map
      );


      return () => {

        if (
          map.hasLayer(
            heatLayer
          )
        ) {
          map.removeLayer(
            heatLayer
          );
        }

      };
    }


    /*
     * =======================================================
     * CASE 2
     *
     * SEARCHED AREA / STREET
     * =======================================================
     */

    const lat =
      Number(location?.lat);

    const lng =
      Number(location?.lng);


    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {

      return undefined;
    }


    /*
     * Try to get actual mock-data risk
     * for the selected area.
     */

    const areaRisk =
      getAreaRisk(
        location?.area
      );


    /*
     * If the search result belongs to
     * one of our VIGIL areas, use its
     * actual mock risk.
     *
     * Otherwise use 70 as a sensible
     * selected-location default.
     */

    const risk =
      location?.area &&
      getAreaCoordinates(
        location.area
      )
        ? areaRisk
        : 70;


    const intensity =
      getIntensity(
        risk
      );


    /*
     * -------------------------------------------------------
     * CREATE A LOCAL HEAT CLUSTER
     * -------------------------------------------------------
     *
     * This creates a smooth heat region
     * instead of one tiny dot.
     */

    const selectedPoints = [

      [
        lat,
        lng,
        intensity,
      ],

      [
        lat + 0.002,
        lng,
        intensity * 0.92,
      ],

      [
        lat - 0.002,
        lng,
        intensity * 0.92,
      ],

      [
        lat,
        lng + 0.002,
        intensity * 0.92,
      ],

      [
        lat,
        lng - 0.002,
        intensity * 0.92,
      ],

      [
        lat + 0.004,
        lng + 0.002,
        intensity * 0.72,
      ],

      [
        lat - 0.004,
        lng - 0.002,
        intensity * 0.72,
      ],

      [
        lat + 0.002,
        lng - 0.004,
        intensity * 0.72,
      ],

      [
        lat - 0.002,
        lng + 0.004,
        intensity * 0.72,
      ],

      [
        lat + 0.006,
        lng,
        intensity * 0.48,
      ],

      [
        lat - 0.006,
        lng,
        intensity * 0.48,
      ],

      [
        lat,
        lng + 0.006,
        intensity * 0.48,
      ],

      [
        lat,
        lng - 0.006,
        intensity * 0.48,
      ],
    ];


    const heatLayer =
      L.heatLayer(
        selectedPoints,
        {
          radius:
            location?.scope ===
            "street"
              ? 38
              : 50,

          blur:
            location?.scope ===
            "street"
              ? 28
              : 34,

          maxZoom: 18,

          max: 1,

          minOpacity: 0.55,

          gradient:
            HEAT_GRADIENT,
        }
      );


    heatLayer.addTo(
      map
    );


    return () => {

      if (
        map.hasLayer(
          heatLayer
        )
      ) {
        map.removeLayer(
          heatLayer
        );
      }

    };

  }, [
    map,
    location?.scope,
    location?.area,
    location?.street,
    location?.lat,
    location?.lng,
    location?.zoom,
  ]);


  return null;
}


/*
 * =========================================================
 * SELECTED LOCATION MARKER
 * =========================================================
 */

function SelectedLocationMarker({
  location,
}) {

  const map =
    useMap();


  useEffect(() => {

    /*
     * Remove old VIGIL marker.
     */

    map.eachLayer(
      (layer) => {

        if (
          layer instanceof
            L.CircleMarker &&
          layer.options?.className ===
            "vigil-selected-marker"
        ) {

          map.removeLayer(
            layer
          );

        }

      }
    );


    /*
     * Don't show marker for entire Nagpur.
     */

    if (
      location?.scope ===
        "nagpur"
    ) {
      return;
    }


    const lat =
      Number(location?.lat);

    const lng =
      Number(location?.lng);


    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }


    const marker =
      L.circleMarker(
        [
          lat,
          lng,
        ],
        {
          radius: 7,

          className:
            "vigil-selected-marker",

          color: "#ffffff",

          weight: 3,

          fillColor:
            "#2563eb",

          fillOpacity: 1,
        }
      );


    marker
      .bindPopup(
        `
        <div style="min-width:180px">
          <strong>
            ${
              location?.displayName ||
              location?.street ||
              location?.area ||
              "Selected Location"
            }
          </strong>

          ${
            location?.street
              ? `<br/><span>Road: ${location.street}</span>`
              : ""
          }

          ${
            location?.area
              ? `<br/><span>Area: ${location.area}</span>`
              : ""
          }
        </div>
        `
      )
      .addTo(map);


    return () => {

      if (
        map.hasLayer(
          marker
        )
      ) {
        map.removeLayer(
          marker
        );
      }

    };

  }, [
    map,
    location?.scope,
    location?.lat,
    location?.lng,
    location?.displayName,
    location?.area,
    location?.street,
  ]);


  return null;
}


/*
 * =========================================================
 * MAP STATUS
 * =========================================================
 */

function MapStatus({
  location,
}) {

  return (
    <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">

      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        VIGIL Heatmap
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {
          location?.scope ===
          "nagpur"
            ? "Entire Nagpur City"
            : location?.street ||
              location?.area ||
              location?.displayName ||
              "Selected Location"
        }
      </p>

      <div className="mt-2 flex items-center gap-3 text-[10px] font-semibold">

        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Low
        </span>

        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          Moderate
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
  );
}


/*
 * =========================================================
 * NAGPUR MAP
 * =========================================================
 */

function NagpurMap() {

  /*
   * IMPORTANT:
   *
   * We read LocationContext directly here.
   *
   * Therefore Dashboard does NOT need to pass
   * selectedLocation as a prop.
   */

  const {
    location,
  } = useLocation();


  return (
    <div className="relative h-full w-full">

      <MapContainer
        center={[
          NAGPUR_CENTER.lat,
          NAGPUR_CENTER.lng,
        ]}
        zoom={DEFAULT_ZOOM}
        minZoom={10}
        maxZoom={18}
        scrollWheelZoom={true}
        className="h-full w-full"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <MapController
          location={
            location
          }
        />


        <HeatMapLayer
          location={
            location
          }
        />


        <SelectedLocationMarker
          location={
            location
          }
        />

      </MapContainer>


      <MapStatus
        location={
          location
        }
      />

    </div>
  );
}


export default NagpurMap;