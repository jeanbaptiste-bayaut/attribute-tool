import './404.scss';

function pageNotfound() {
  return (
    <div className="error-404">
      <h1>404 – Oops! Page not found</h1>
      <p>
        It looks like you're a bit lost. The page you’re looking for doesn’t
        exist, or maybe it moved somewhere else.
      </p>

      <img src="/404.gif" alt="Lost person illustration" />

      <div className="suggestions">
        <p>Here are some helpful links instead:</p>
        <section className="buttons">
          <button>
            <a href="/">Home</a>
          </button>
          <button>
            <a href="/products">Control</a>
          </button>

          <button>
            <a href="/upload">Upload</a>
          </button>
        </section>
      </div>
    </div>
  );
}

export default pageNotfound;
