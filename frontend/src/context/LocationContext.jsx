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

  const selectNagpur = () => {
    setLocation(DEFAULT_LOCATION);
  };

  const selectArea = ({
    area,
    lat,
    lng,
    source = "area-selector",
  }) => {
    setLocation({
      scope: "area",

      area,

      street: "",
      policeStation: "",

      displayName: area,

      lat,
      lng,

      zoom: 14,

      source,
    });
  };

  const selectStreet = ({
    area = "",
    street,
    lat,
    lng,
    policeStation = "",
    source = "street-selector",
  }) => {
    setLocation({
      scope: "street",

      area,
      street,
      policeStation,

      displayName: street,

      lat,
      lng,

      zoom: 17,

      source,
    });
  };

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

      lat,
      lng,

      zoom: 16,

      source,
    });
  };

  const selectSearchResult = (
    result
  ) => {
    const address = result.address || {};

    const detectedArea =
      result.neighbourhood ||
      result.address?.suburb ||
      result.address?.quarter ||
      "";

    const detectedStreet =
      result.road || "";

    /*
     * If the result is a road/street,
     * retain the parent area.
     */

    if (
      result.type === "road" ||
      result.type === "residential" ||
      result.type === "pedestrian" ||
      result.type === "path"
    ) {
      selectStreet({
        area: detectedArea,
        street:
          detectedStreet ||
          result.name,
        lat: result.lat,
        lng: result.lng,
        source: "direct-search",
      });

      return;
    }

    /*
     * Otherwise treat it as an area/location.
     */

    selectArea({
      area:
        result.name ||
        detectedArea ||
        "Selected Nagpur Location",

      lat: result.lat,
      lng: result.lng,

      source: "direct-search",
    });
  };

  const value = useMemo(
    () => ({
      location,

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