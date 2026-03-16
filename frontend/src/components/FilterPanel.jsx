import { SORT_OPTIONS } from "../utils/constants";

function multiToggle(currentValues, value) {
  return currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value];
}

export default function FilterPanel({ products, filters, maxPrice, onChange, onReset }) {
  const styles = [...new Set(products.map((p) => p.style))];
  const brands = [...new Set(products.map((p) => p.brand))];
  const movements = [...new Set(products.map((p) => p.movement))];

  return (
    <div className="filter-panel card border-0 shadow-sm">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-lg-4 col-md-6">
            <label className="form-label">Search</label>
            <input
              className="form-control"
              placeholder="Name, brand, description..."
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
            />
          </div>

          <div className="col-lg-3 col-md-6">
            <label className="form-label">Sort By</label>
            <select className="form-select" value={filters.sortBy} onChange={(e) => onChange({ sortBy: e.target.value })}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="col-lg-3 col-md-8">
            <label className="form-label d-flex justify-content-between">
              <span>Max Price</span><span className="text-muted">${filters.priceRange[1]}</span>
            </label>
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

          <div className="col-lg-2 col-md-4 d-grid">
            <button className="btn btn-outline-secondary" onClick={onReset}>Reset</button>
          </div>

          <FilterGroup title="Style" values={styles} selected={filters.styles} onToggle={(value) => onChange({ styles: multiToggle(filters.styles, value) })} />
          <FilterGroup title="Brand" values={brands} selected={filters.brands} onToggle={(value) => onChange({ brands: multiToggle(filters.brands, value) })} />
          <FilterGroup title="Movement" values={movements} selected={filters.movements} onToggle={(value) => onChange({ movements: multiToggle(filters.movements, value) })} />
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, values, selected, onToggle }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="filter-card h-100">
        <h6>{title}</h6>
        {values.map((value) => (
          <div className="form-check" key={value}>
            <input id={`${title}-${value}`} className="form-check-input" type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} />
            <label className="form-check-label" htmlFor={`${title}-${value}`}>{value}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
