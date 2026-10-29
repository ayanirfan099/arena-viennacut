import Link from "next/link";
export default function NotFound() {
  return (
    <main
      className="wrap section"
      style={{ minHeight: "70vh", display: "grid", alignContent: "center" }}
    >
      <div className="eyebrow">404 · Vienna Cuts demo</div>
      <h1
        className="serif"
        style={{ fontSize: "clamp(54px,9vw,100px)", margin: "14px 0" }}
      >
        Nothing here.
      </h1>
      <p className="muted">
        Diese Seite gibt es in diesem Demonstrationsprojekt nicht.
      </p>
      <Link className="btn" href="/">
        Zur Startseite
      </Link>
    </main>
  );
}
