import { SORT_OPTIONS } from "../utils/constants";

function multiToggle(currentValues, value) {
  return currentValues.includes(value)
    ? currentValues.filter((item) => item !== value)
    : [...currentValues, value];
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export default function FilterPanel({ products, filters, maxPrice, onChange }) {
  const styles = uniqueSorted(products.map((p) => p.style));
  const brands = uniqueSorted(products.map((p) => p.brand));
  const movements = uniqueSorted(products.map((p) => p.movement));
  const activeFilterCount =
    filters.styles.length +
    filters.brands.length +
    filters.movements.length +
    (filters.search.trim() ? 1 : 0);

  const resetAll = () => {
    onChange({
      styles: [],
      brands: [],
      movements: [],
      search: "",
      sortBy: "featured",
      priceRange: [0, maxPrice]
    });
  };

  return (
    <div className="filter-card p-3 p-lg-4">
      <div className="row g-3 align-items-end">
        <div className="col-lg-4">
          <label className="form-label mb-1">Search</label>
          <input
            className="form-control"
            placeholder="Name, brand, description..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>

        <div className="col-md-6 col-lg-3">
          <label className="form-label mb-1">Sort</label>
          <select
            className="form-select"
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 col-lg-3">
          <label className="form-label mb-1">Max Price: ${filters.priceRange[1]}</label>
          <input
            className="form-range"
            type="range"
            min="0"
            max={maxPrice}
            step="50"
            value={filters.priceRange[1]}
            onChange={(e) => onChange({ priceRange: [0, Number(e.target.value)] })}
          />
        </div>

        <div className="col-lg-2 text-lg-end">
          <button className="btn btn-outline-secondary w-100" onClick={resetAll}>
            Reset ({activeFilterCount})
          </button>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <FilterGroup
          title="Style"
          values={styles}
          selected={filters.styles}
          onToggle={(value) => onChange({ styles: multiToggle(filters.styles, value) })}
        />
        <FilterGroup
          title="Brand"
          values={brands}
          selected={filters.brands}
          onToggle={(value) => onChange({ brands: multiToggle(filters.brands, value) })}
        />
        <FilterGroup
          title="Movement"
          values={movements}
          selected={filters.movements}
          onToggle={(value) => onChange({ movements: multiToggle(filters.movements, value) })}
        />
      </div>
    </div>
  );
}

function FilterGroup({ title, values, selected, onToggle }) {
  return (
    <div className="col-md-4">
      <div className="filter-group-card h-100">
        <h6 className="mb-2">{title}</h6>
        {!values.length && <p className="text-muted small mb-0">No options</p>}
        {values.map((value) => {
          const id = `${title}-${value}`.replace(/\s+/g, "-").toLowerCase();
          return (
            <div className="form-check" key={value}>
              <input
                id={id}
                className="form-check-input"
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => onToggle(value)}
              />
              <label className="form-check-label text-capitalize" htmlFor={id}>
                {value}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
