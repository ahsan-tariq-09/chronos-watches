import { SORT_OPTIONS } from "../utils/constants";

function multiToggle(currentValues, value) {
  return currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value];
}

export default function FilterPanel({ products, filters, maxPrice, onChange }) {
  const styles = [...new Set(products.map((p) => p.style))];
  const brands = [...new Set(products.map((p) => p.brand))];
  const movements = [...new Set(products.map((p) => p.movement))];

  return (
    <div className="row g-3">
      <div className="col-md-3"><input className="form-control" placeholder="Search by name, brand, description..." value={filters.search} onChange={(e) => onChange({ search: e.target.value })} /></div>
      <div className="col-md-3">
        <select className="form-select" value={filters.sortBy} onChange={(e) => onChange({ sortBy: e.target.value })}>
          {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label mb-1">Max Price: ${filters.priceRange[1]}</label>
        <input className="form-range" type="range" min="0" max={maxPrice} step="50" value={filters.priceRange[1]} onChange={(e) => onChange({ priceRange: [0, Number(e.target.value)] })} />
      </div>
      <div className="col-md-3 text-end"><button className="btn btn-outline-secondary btn-sm" onClick={() => onChange({ styles: [], brands: [], movements: [], search: "", sortBy: "featured", priceRange: [0, maxPrice] })}>Reset Filters</button></div>

      <FilterGroup title="Style" values={styles} selected={filters.styles} onToggle={(value) => onChange({ styles: multiToggle(filters.styles, value) })} />
      <FilterGroup title="Brand" values={brands} selected={filters.brands} onToggle={(value) => onChange({ brands: multiToggle(filters.brands, value) })} />
      <FilterGroup title="Movement" values={movements} selected={filters.movements} onToggle={(value) => onChange({ movements: multiToggle(filters.movements, value) })} />
    </div>
  );
}

function FilterGroup({ title, values, selected, onToggle }) {
  return (
    <div className="col-md-4">
      <div className="filter-card">
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
