import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  NAGPUR_CENTER,
} from "../data/nagpurLocations";

const LocationContext =
  createContext(null);

const DEFAULT_LOCATION = {
  scope: "nagpur",

  area: "",
  street: "",
  policeStation: "",

  displayName: "Entire Nagpur City",

  lat: NAGPUR_CENTER.lat,
  lng: NAGPUR_CENTER.lng,

  zoom: 11,

  source: "default",
};

export function LocationProvider({
  children,
}) {
  const [location, setLocation] =
    useState(DEFAULT_LOCATION);

  /*
   * ---------------------------------------------------------
   * SELECT ENTIRE NAGPUR
   * ---------------------------------------------------------
   */

  const selectNagpur = () => {
    setLocation({
      ...DEFAULT_LOCATION,
    });
  };

  /*
   * ---------------------------------------------------------
   * SELECT AREA
   * ---------------------------------------------------------
   */

  const selectArea = ({
    area,
    lat,
    lng,
    displayName = area,
    source = "area-search",
  }) => {
    setLocation({
      scope: "area",

      area: area || "",
      street: "",
      policeStation: "",

      displayName,

      lat:
        Number.isFinite(Number(lat))
          ? Number(lat)
          : NAGPUR_CENTER.lat,

      lng:
        Number.isFinite(Number(lng))
          ? Number(lng)
          : NAGPUR_CENTER.lng,

      zoom: 14,

      source,
    });
  };

  /*
   * ---------------------------------------------------------
   * SELECT STREET
   * ---------------------------------------------------------
   */

  const selectStreet = ({
    area = "",
    street,
    lat,
    lng,
    displayName = street,
    source = "street-search",
  }) => {
    setLocation({
      scope: "street",

      area: area || "",
      street: street || "",
      policeStation: "",

      displayName,

      lat: Number(lat),
      lng: Number(lng),

      zoom: 17,

      source,
    });
  };

  /*
   * ---------------------------------------------------------
   * POLICE STATION
   *
   * Kept for compatibility with other VIGIL components.
   *
   * It is NOT used by the new Dashboard search bar.
   * ---------------------------------------------------------
   */

  const selectPoliceStation = ({
    area = "",
    policeStation,
    lat,
    lng,
    source = "station-selector",
  }) => {
    setLocation({
      scope: "policeStation",

      area,

      street: "",

      policeStation,

      displayName: policeStation,

      lat: Number(lat),
      lng: Number(lng),

      zoom: 16,

      source,
    });
  };

  /*
   * ---------------------------------------------------------
   * GENERIC SEARCH RESULT
   * ---------------------------------------------------------
   *
   * Kept so existing VIGIL components can still use it.
   * The Dashboard has its own Nagpur-only search handling.
   * ---------------------------------------------------------
   */

  const selectSearchResult = (
    result
  ) => {
    const address =
      result?.address || {};

    const detectedArea =
      address.suburb ||
      address.neighbourhood ||
      address.city_district ||
      address.quarter ||
      "";

    const detectedStreet =
      address.road || "";

    const resultName =
      result?.name ||
      result?.display_name ||
      "";

    const type =
      (
        result?.type ||
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
     * Street / road
     */

    if (
      detectedStreet &&
      roadTypes.includes(type)
    ) {
      selectStreet({
        area: detectedArea,
        street:
          detectedStreet ||
          resultName,
        lat: result?.lat,
        lng: result?.lon,
        displayName:
          detectedStreet ||
          resultName,
        source: "direct-search",
      });

      return;
    }

    /*
     * Area
     */

    selectArea({
      area:
        detectedArea ||
        resultName ||
        "Selected Nagpur Location",

      lat: result?.lat,
      lng: result?.lon,

      displayName:
        detectedArea ||
        resultName ||
        "Selected Nagpur Location",

      source: "direct-search",
    });
  };

  /*
   * ---------------------------------------------------------
   * CONTEXT VALUE
   * ---------------------------------------------------------
   *
   * setLocation is intentionally exposed because the existing
   * Dashboard and other VIGIL components use it.
   * ---------------------------------------------------------
   */

  const value = useMemo(
    () => ({
      location,

      setLocation,

      selectNagpur,
      selectArea,
      selectStreet,
      selectPoliceStation,
      selectSearchResult,
    }),
    [location]
  );

  return (
    <LocationContext.Provider
      value={value}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context =
    useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocation must be used inside LocationProvider"
    );
  }

  return context;
}