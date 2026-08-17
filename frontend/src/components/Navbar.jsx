import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  NAGPUR_AREAS,
  NAGPUR_POLICE_STATIONS,
} from "../data/nagpurLocations";

import {
  searchNagpurLocations,
} from "../services/locationApi";

import {
  useLocation,
} from "../context/LocationContext";

function Navbar({
  onMenuClick,
  officer,
}) {
  const {
    location,
    selectArea,
    selectPoliceStation,
    selectSearchResult,
    selectNagpur,
  } = useLocation();

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const searchRef = useRef(null);

  const debounceRef =
    useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  const performSearch = async (
    value
  ) => {
    const text =
      value.trim().toLowerCase();

    if (!text) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const areaResults =
        NAGPUR_AREAS
          .filter((area) =>
            area.searchTerms.some(
              (term) =>
                term.includes(text) ||
                text.includes(term)
            )
          )
          .map((area) => ({
            kind: "area",
            id: area.id,
            name: area.name,
            displayName: area.name,
          }));

      const stationResults =
        NAGPUR_POLICE_STATIONS
          .filter((station) =>
            station
              .toLowerCase()
              .includes(text)
          )
          .map((station) => ({
            kind: "policeStation",
            id: station,
            name: station,
            displayName: station,
          }));

      const geographicResults =
        await searchNagpurLocations(
          value
        );

      const streetResults =
        geographicResults.map(
          (result) => ({
            ...result,
            kind: "street",
          })
        );

      setResults([
        ...areaResults,
        ...stationResults,
        ...streetResults,
      ]);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value) => {
    setQuery(value);
    setOpen(true);

    clearTimeout(
      debounceRef.current
    );

    debounceRef.current =
      setTimeout(() => {
        performSearch(value);
      }, 450);
  };

  const handleSelect = async (
    result
  ) => {
    setOpen(false);

    setQuery(result.name);

    if (result.kind === "area") {
      /*
       * Geocode the selected area so
       * the map can fly to it.
       */

      const geoResults =
        await searchNagpurLocations(
          result.name
        );

      const first =
        geoResults[0];

      if (first) {
        selectArea({
          area: result.name,
          lat: first.lat,
          lng: first.lng,
          source: "area-search",
        });
      }

      return;
    }

    if (
      result.kind ===
      "policeStation"
    ) {
      const geoResults =
        await searchNagpurLocations(
          result.name
        );

      const first =
        geoResults[0];

      if (first) {
        selectPoliceStation({
          policeStation:
            result.name,
          area:
            first.neighbourhood ||
            first.address?.suburb ||
            "",
          lat: first.lat,
          lng: first.lng,
          source:
            "station-search",
        });
      }

      return;
    }

    if (result.kind === "street") {
      selectSearchResult(result);
    }
  };

  const clearLocation = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    selectNagpur();
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white border-b border-slate-200 z-50">
      <div className="h-full px-4 md:px-6 flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-100"
        >
          ☰
        </button>

        <div
          ref={searchRef}
          className="relative flex-1 max-w-3xl"
        >
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4">

            <span className="text-slate-400">
              🔎
            </span>

            <input
              value={query}
              onChange={(event) =>
                handleChange(
                  event.target.value
                )
              }
              onFocus={() =>
                setOpen(true)
              }
              placeholder="Search Nagpur area, road, street or police station..."
              className="w-full bg-transparent outline-none px-3 py-3 text-sm"
            />

            {query && (
              <button
                onClick={
                  clearLocation
                }
                className="text-slate-400 hover:text-red-500 text-lg"
              >
                ×
              </button>
            )}
          </div>

          {open && (
            <div className="absolute top-14 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">

              {!query && (
                <button
                  onClick={
                    clearLocation
                  }
                  className="w-full text-left px-4 py-4 hover:bg-slate-50"
                >
                  <p className="font-semibold">
                     Nagpur City
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    City-wide traffic intelligence
                  </p>
                </button>
              )}

              {loading && (
                <div className="px-4 py-4 text-sm text-slate-500">
                  Searching Nagpur locations...
                </div>
              )}

              {!loading &&
                results.map(
                  (result, index) => (
                    <button
                      key={`${result.kind}-${result.id}-${index}`}
                      onClick={() =>
                        handleSelect(
                          result
                        )
                      }
                      className="w-full text-left px-4 py-3 border-t border-slate-100 hover:bg-blue-50"
                    >
                      <div className="flex gap-3">

                        <span>
                          {result.kind ===
                          "area"
                            ? "📍"
                            : result.kind ===
                              "policeStation"
                            ? "👮"
                            : "🛣️"}
                        </span>

                        <div className="min-w-0">
                          <p className="font-medium text-sm">
                            {result.name}
                          </p>

                          <p className="text-xs text-slate-500 truncate">
                            {result.kind ===
                            "area"
                              ? "Nagpur City Area"
                              : result.kind ===
                                "policeStation"
                              ? "Police Station"
                              : result.displayName}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                )}

              {!loading &&
                query &&
                results.length ===
                  0 && (
                  <div className="px-4 py-5 text-sm text-slate-500">
                    No matching Nagpur location found.
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="hidden xl:block text-right">
          <p className="text-[10px] uppercase text-slate-400">
            Selected Location
          </p>

          <p className="text-sm font-semibold">
            {location.displayName}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            👮
          </div>

          <div>
            <p className="text-sm font-semibold">
              {officer?.name ||
                "Traffic Officer"}
            </p>

            <p className="text-xs text-slate-500">
              {officer?.station ||
                "Nagpur City Police"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;