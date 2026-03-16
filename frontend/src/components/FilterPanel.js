export class FilterPanel {
  constructor(container, onFilterChange) {
    this.container = container;
    this.onFilterChange = onFilterChange;
    this.filters = {
      priceRange: [0, 5000],
      styles: [],
      brands: [],
      movements: []
    };
  }

  render(products) {
    const styles = [...new Set(products.map((p) => p.style))];
    const brands = [...new Set(products.map((p) => p.brand))];
    const movements = [...new Set(products.map((p) => p.movement))];
    const maxPrice = Math.max(...products.map((p) => p.price), 5000);

    this.filters.priceRange = [0, maxPrice];

    this.container.innerHTML = `
      <div class="col-md-3">
        <div class="filter-card">
          <h5>Price Range</h5>
          <input id="priceRangeSlider" class="form-range price-slider" type="range" min="0" max="${maxPrice}" step="50" value="${maxPrice}">
          <div class="price-range-values">
            <span>$0</span>
            <span>$${maxPrice}</span>
          </div>
          <div id="priceSelected" class="mt-2">Selected: $0 - $${maxPrice}</div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="filter-card">
          <h5>Style</h5>
          ${styles.map((style) => `
            <div class="form-check">
              <input class="form-check-input style-filter" type="checkbox" value="${style}" id="style-${style}">
              <label class="form-check-label" for="style-${style}">${style}</label>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="col-md-3">
        <div class="filter-card">
          <h5>Brand</h5>
          ${brands.map((brand) => `
            <div class="form-check">
              <input class="form-check-input brand-filter" type="checkbox" value="${brand}" id="brand-${brand}">
              <label class="form-check-label" for="brand-${brand}">${brand}</label>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="col-md-3">
        <div class="filter-card">
          <h5>Movement</h5>
          ${movements.map((movement) => `
            <div class="form-check">
              <input class="form-check-input movement-filter" type="checkbox" value="${movement}" id="movement-${movement}">
              <label class="form-check-label" for="movement-${movement}">${movement}</label>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const priceSlider = this.container.querySelector("#priceRangeSlider");
    const priceSelected = this.container.querySelector("#priceSelected");

    priceSlider.addEventListener("input", (event) => {
      this.filters.priceRange = [0, Number(event.target.value)];
      priceSelected.textContent = `Selected: $0 - $${event.target.value}`;
      this.emit();
    });

    this.container.querySelectorAll(".style-filter").forEach((el) => {
      el.addEventListener("change", () => {
        this.filters.styles = [...this.container.querySelectorAll(".style-filter:checked")].map((cb) => cb.value);
        this.emit();
      });
    });

    this.container.querySelectorAll(".brand-filter").forEach((el) => {
      el.addEventListener("change", () => {
        this.filters.brands = [...this.container.querySelectorAll(".brand-filter:checked")].map((cb) => cb.value);
        this.emit();
      });
    });

    this.container.querySelectorAll(".movement-filter").forEach((el) => {
      el.addEventListener("change", () => {
        this.filters.movements = [...this.container.querySelectorAll(".movement-filter:checked")].map((cb) => cb.value);
        this.emit();
      });
    });
  }

  emit() {
    this.onFilterChange(this.filters);
  }
}