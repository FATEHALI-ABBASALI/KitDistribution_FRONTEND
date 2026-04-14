export default function Loading({ text = "Loading..." }) {
  return (
    <div className="loading-overlay">

      {/* Spinner */}
      <div className="loading-spinner"></div>

      {/* Text */}
      <p className="loading-text">{text}</p>

    </div>
  );
}
