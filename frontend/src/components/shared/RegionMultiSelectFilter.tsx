import { useEffect, useRef, useState } from "react";
import { BOROUGHS, BOROUGH_NEIGHBORHOODS } from "./BoroughNeighborhoodDropdown";

export type RegionSelection = { boroughs: string[]; neighborhoods: string[] };

type RegionMultiSelectFilterProps = {
  onChange?: (value: RegionSelection) => void;
  value?: RegionSelection;
};

const EMPTY_SELECTION: RegionSelection = { boroughs: [], neighborhoods: [] };
const NAMES_SUMMARY_LIMIT = 2;

// A neighborhood name (e.g. "Other") can repeat across boroughs, so a plain
// `neighborhoods` string is only unambiguous for a given borough once that
// borough is also present in `boroughs`.
function isNeighborhoodChecked(selection: RegionSelection, borough: string, neighborhood: string): boolean {
  return selection.neighborhoods.includes(neighborhood) && selection.boroughs.includes(borough);
}

function isBoroughFullyChecked(selection: RegionSelection, borough: string): boolean {
  return BOROUGH_NEIGHBORHOODS[borough].every((n) => isNeighborhoodChecked(selection, borough, n));
}

function summarizeSelection(selection: RegionSelection): string {
  // Only collapse into the borough name once every neighborhood in it is checked —
  // `boroughs` also includes boroughs with just one neighborhood picked.
  const fullBoroughs = selection.boroughs.filter((b) => isBoroughFullyChecked(selection, b));
  const partialNeighborhoods = selection.neighborhoods.filter((n) => !fullBoroughs.some((b) => BOROUGH_NEIGHBORHOODS[b].includes(n)));

  const labels = [...fullBoroughs, ...partialNeighborhoods];
  if (labels.length === 0) return "Select area";
  if (labels.length <= NAMES_SUMMARY_LIMIT) return labels.join(", ");
  return `${labels.length} areas selected`;
}

export default function RegionMultiSelectFilter({ onChange, value }: RegionMultiSelectFilterProps) {
  const [internalValue, setInternalValue] = useState<RegionSelection>(EMPTY_SELECTION);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selection = value ?? internalValue;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const emit = (next: RegionSelection) => {
    setInternalValue(next);
    onChange?.(next);
  };

  const toggleNeighborhood = (borough: string, neighborhood: string) => {
    const isChecked = isNeighborhoodChecked(selection, borough, neighborhood);
    const neighborhoodStillNeededElsewhere =
      selection.neighborhoods.includes(neighborhood) &&
      selection.boroughs.some((b) => b !== borough && BOROUGH_NEIGHBORHOODS[b].includes(neighborhood) && isNeighborhoodChecked(selection, b, neighborhood));

    if (isChecked) {
      const boroughHasOtherChecked = BOROUGH_NEIGHBORHOODS[borough].some(
        (n) => n !== neighborhood && isNeighborhoodChecked(selection, borough, n)
      );
      emit({
        boroughs: boroughHasOtherChecked ? selection.boroughs : selection.boroughs.filter((b) => b !== borough),
        neighborhoods: neighborhoodStillNeededElsewhere ? selection.neighborhoods : selection.neighborhoods.filter((n) => n !== neighborhood),
      });
    } else {
      emit({
        boroughs: selection.boroughs.includes(borough) ? selection.boroughs : [...selection.boroughs, borough],
        neighborhoods: selection.neighborhoods.includes(neighborhood) ? selection.neighborhoods : [...selection.neighborhoods, neighborhood],
      });
    }
  };

  const toggleBorough = (borough: string) => {
    const boroughNeighborhoods = BOROUGH_NEIGHBORHOODS[borough];

    if (isBoroughFullyChecked(selection, borough)) {
      emit({
        boroughs: selection.boroughs.filter((b) => b !== borough),
        neighborhoods: selection.neighborhoods.filter((n) => {
          if (!boroughNeighborhoods.includes(n)) return true;
          // Keep the name if another selected borough also needs it (e.g. "Other").
          return selection.boroughs.some((b) => b !== borough && BOROUGH_NEIGHBORHOODS[b].includes(n) && isNeighborhoodChecked(selection, b, n));
        }),
      });
    } else {
      emit({
        boroughs: selection.boroughs.includes(borough) ? selection.boroughs : [...selection.boroughs, borough],
        neighborhoods: [...new Set([...selection.neighborhoods, ...boroughNeighborhoods])],
      });
    }
  };

  return (
    <div className="relative flex-1" ref={containerRef}>
      <button
        className="w-full flex items-center justify-between bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-3 pr-2 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className={`truncate ${selection.boroughs.length === 0 && selection.neighborhoods.length === 0 ? "text-on-surface-variant" : ""}`}>
          {summarizeSelection(selection)}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-72 max-h-80 overflow-y-auto bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 p-2">
          {BOROUGHS.map((borough) => (
            <div className="mb-2 last:mb-0" key={borough}>
              <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container cursor-pointer">
                <input
                  checked={isBoroughFullyChecked(selection, borough)}
                  className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded"
                  onChange={() => toggleBorough(borough)}
                  ref={(el) => {
                    if (el) el.indeterminate = !isBoroughFullyChecked(selection, borough) && selection.boroughs.includes(borough);
                  }}
                  type="checkbox"
                />
                <span className="font-headline-sm text-headline-sm text-on-surface">{borough}</span>
              </label>
              <div className="pl-7 flex flex-col">
                {BOROUGH_NEIGHBORHOODS[borough].map((neighborhood) => (
                  <label
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container cursor-pointer"
                    key={neighborhood}
                  >
                    <input
                      checked={isNeighborhoodChecked(selection, borough, neighborhood)}
                      className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded"
                      onChange={() => toggleNeighborhood(borough, neighborhood)}
                      type="checkbox"
                    />
                    <span className="font-body-md text-body-md text-on-surface">{neighborhood}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
