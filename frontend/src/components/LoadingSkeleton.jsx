export default function LoadingSkeleton({ cards = 6 }) {
  return (
    <div className="row g-4" aria-label="Loading products">
      {Array.from({ length: cards }).map((_, index) => (
        <div className="col-md-6 col-lg-4" key={index}>
          <div className="card h-100 shadow-sm placeholder-glow">
            <div className="watch-card-image placeholder" />
            <div className="card-body">
              <h5 className="card-title placeholder col-8" />
              <p className="placeholder col-5" />
              <p className="placeholder col-4" />
              <div className="d-flex gap-2">
                <span className="btn btn-outline-secondary disabled placeholder col-4" />
                <span className="btn btn-primary disabled placeholder col-5" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
