export default function AmbientBackground({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const opacity = variant === "dark" ? 1 : 0.5;

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <div
        style={{
          position: "absolute",
          top: "-8rem",
          right: "-8rem",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74,191,191,0.15) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-8rem",
          left: "-8rem",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45,158,158,0.1) 0%, transparent 70%)",
          animation: "float 11s ease-in-out infinite reverse",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "33%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74,191,191,0.08) 0%, transparent 70%)",
          animation: "float 14s ease-in-out infinite",
          opacity,
        }}
      />
    </div>
  );
}
