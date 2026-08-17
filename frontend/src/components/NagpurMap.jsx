import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect, useMemo } from "react";

import "leaflet.heat";
import L from "leaflet";

import {
  NAGPUR_CENTER,
  NAGPUR_BOUNDS,
} from "../data/nagpurLocations";

import {
  incidents,
} from "../data/vigilMockData";

import {
  useLocation,
} from "../context/LocationContext";

import "leaflet/dist/leaflet.css";


// ======================================================
// MAP CONTROLLER
// ======================================================

function MapController({
  selectedLocation,
}) {

  const map = useMap();

  const { location } =
    useLocation();


  useEffect(() => {

    // --------------------------------------------------
    // PRIORITY 1:
    // Location selected from the new dashboard search
    // --------------------------------------------------

    if (
      selectedLocation &&
      selectedLocation.latitude != null &&
      selectedLocation.longitude != null
    ) {

      map.flyTo(
        [
          selectedLocation.latitude,
          selectedLocation.longitude,
        ],
        16,
        {
          duration: 1.2,
        }
      );

      return;
    }


    // --------------------------------------------------
    // PRIORITY 2:
    // Existing LocationContext
    // --------------------------------------------------

    if (
      location.lat != null &&
      location.lng != null
    ) {

      map.flyTo(
        [
          location.lat,
          location.lng,
        ],
        location.zoom || 11,
        {
          duration: 1.2,
        }
      );

    }

  }, [
    selectedLocation,
    location.lat,
    location.lng,
    location.zoom,
    map,
  ]);


  return null;
}


// ======================================================
// HEAT LAYER
// ======================================================

function HeatLayer({
  selectedLocation,
}) {

  const map = useMap();

  const { location } =
    useLocation();


  const points = useMemo(() => {

    // --------------------------------------------------
    // Determine current location
    // --------------------------------------------------

    const latitude =
      selectedLocation?.latitude ??
      location.lat ??
      NAGPUR_CENTER.lat;


    const longitude =
      selectedLocation?.longitude ??
      location.lng ??
      NAGPUR_CENTER.lng;


    // --------------------------------------------------
    // Determine selected road / area
    // --------------------------------------------------

    const selectedRoad =
      selectedLocation?.road ||
      location.street ||
      null;


    const selectedArea =
      selectedLocation?.area ||
      location.area ||
      null;


    // --------------------------------------------------
    // Find relevant incidents
    // --------------------------------------------------

    let relevantIncidents =
      incidents;


    if (selectedRoad) {

      relevantIncidents =
        incidents.filter(
          (incident) => {

            if (!incident.road) {
              return false;
            }

            return (
              incident.road
                .toLowerCase()
                .includes(
                  selectedRoad.toLowerCase()
                )
            );

          }
        );

    } else if (selectedArea) {

      relevantIncidents =
        incidents.filter(
          (incident) =>
            incident.area ===
            selectedArea
        );

    } else if (
      location.scope ===
      "nagpur"
    ) {

      relevantIncidents =
        incidents;

    }


    // --------------------------------------------------
    // IMPORTANT:
    //
    // Only use real coordinates if the incident
    // actually contains coordinates.
    //
    // We do NOT create fake road coordinates.
    // --------------------------------------------------

    const coordinatePoints =
      relevantIncidents
        .filter(
          (incident) =>
            incident.lat != null &&
            incident.lng != null
        )
        .map(
          (incident) => {

            let intensity =
              0.45;


            if (
              incident.severity ===
              "Critical"
            ) {

              intensity = 1;

            } else if (
              incident.severity ===
              "High"
            ) {

              intensity = 0.8;

            } else if (
              incident.severity ===
              "Medium"
            ) {

              intensity = 0.6;

            } else {

              intensity = 0.35;

            }


            return [
              Number(incident.lat),
              Number(incident.lng),
              intensity,
            ];

          }
        );


    // --------------------------------------------------
    // If actual traffic/incident coordinates exist,
    // use them.
    // --------------------------------------------------

    if (
      coordinatePoints.length > 0
    ) {

      return coordinatePoints;

    }


    // --------------------------------------------------
    // NO DATA
    //
    // Show a yellow heat point instead of
    // inventing a risk score.
    // --------------------------------------------------

    return [
      [
        latitude,
        longitude,
        0.25,
      ],
    ];

  }, [
    selectedLocation,
    location,
  ]);


  // --------------------------------------------------
  // Create / update heatmap
  // --------------------------------------------------

  useEffect(() => {

    if (!L.heatLayer) {

      console.warn(
        "leaflet.heat is not loaded."
      );

      return;

    }


    const heat =
      L.heatLayer(
        points,
        {

          radius: 45,

          blur: 30,

          maxZoom: 18,

          max: 1,

          // ------------------------------------------------
          // Yellow is deliberately used for the lowest
          // intensity / no-data state.
          // ------------------------------------------------

          gradient: {

            0.0:
              "#fde047",

            0.25:
              "#facc15",

            0.5:
              "#fb923c",

            0.75:
              "#ef4444",

            1.0:
              "#991b1b",

          },

        }
      ).addTo(map);


    return () => {

      map.removeLayer(
        heat
      );

    };

  }, [
    map,
    points,
  ]);


  return null;
}


// ======================================================
// LOCATION MARKER
// ======================================================

function LocationMarker({
  selectedLocation,
}) {

  const { location } =
    useLocation();


  // --------------------------------------------------
  // Search-selected location gets priority
  // --------------------------------------------------

  if (
    selectedLocation &&
    selectedLocation.latitude != null &&
    selectedLocation.longitude != null
  ) {

    return (

      <Marker
        position={[
          selectedLocation.latitude,
          selectedLocation.longitude,
        ]}
      >

        <Popup>

          <div className="min-w-[190px]">

            <strong>
              {selectedLocation.road ||
                selectedLocation.displayName}
            </strong>


            <br />


            <span>
              Area:{" "}
              {selectedLocation.area ||
                "Nagpur"}
            </span>


            {selectedLocation.station && (

              <>
                <br />

                <span>
                  Police Station:{" "}
                  {selectedLocation.station}
                </span>
              </>

            )}


            <br />

            <span>
              Coordinates:{" "}
              {selectedLocation.latitude.toFixed(
                5
              )}
              ,{" "}
              {selectedLocation.longitude.toFixed(
                5
              )}
            </span>

          </div>

        </Popup>

      </Marker>

    );

  }


  // --------------------------------------------------
  // Existing LocationContext marker
  // --------------------------------------------------

  if (
    location.scope ===
    "nagpur"
  ) {

    return null;

  }


  if (
    location.lat == null ||
    location.lng == null
  ) {

    return null;

  }


  return (

    <Marker
      position={[
        location.lat,
        location.lng,
      ]}
    >

      <Popup>

        <strong>
          {location.displayName}
        </strong>


        {location.area && (

          <>
            <br />

            Area:{" "}
            {location.area}
          </>

        )}


        {location.street && (

          <>
            <br />

            Street:{" "}
            {location.street}
          </>

        )}


        {location.policeStation && (

          <>
            <br />

            Police Station:{" "}
            {location.policeStation}
          </>

        )}

      </Popup>

    </Marker>

  );
}


// ======================================================
// NAGPUR MAP
// ======================================================

function NagpurMap({
  selectedLocation,
}) {

  return (

    <MapContainer

      center={[
        NAGPUR_CENTER.lat,
        NAGPUR_CENTER.lng,
      ]}

      zoom={11}

      minZoom={10}

      maxZoom={19}

      maxBounds={[
        [
          NAGPUR_BOUNDS.south,
          NAGPUR_BOUNDS.west,
        ],
        [
          NAGPUR_BOUNDS.north,
          NAGPUR_BOUNDS.east,
        ],
      ]}

      maxBoundsViscosity={1.0}

      scrollWheelZoom={true}

      className="h-full w-full"

    >

      {/* -----------------------------------------------
          OpenStreetMap
      ------------------------------------------------ */}

      <TileLayer

        attribution="&copy; OpenStreetMap contributors"

        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

      />


      {/* -----------------------------------------------
          Automatically zoom to selected location
      ------------------------------------------------ */}

      <MapController
        selectedLocation={
          selectedLocation
        }
      />


      {/* -----------------------------------------------
          Traffic / risk heatmap
      ------------------------------------------------ */}

      <HeatLayer
        selectedLocation={
          selectedLocation
        }
      />


      {/* -----------------------------------------------
          Selected location marker
      ------------------------------------------------ */}

      <LocationMarker
        selectedLocation={
          selectedLocation
        }
      />

    </MapContainer>

  );
}


export default NagpurMap;