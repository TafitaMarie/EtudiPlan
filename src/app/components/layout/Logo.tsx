export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ÉtudiPlan"
    >
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <g transform="translate(4,4)">
        <path d="M8 12L24 4L40 12L24 20L8 12Z" fill="url(#lg)" />
        <rect x="20" y="12" width="8" height="10" rx="1" fill="url(#lg)" />
        <path
          d="M6 16V24C6 26.2 14 28 24 28C34 28 42 26.2 42 24V16"
          stroke="url(#lg)"
          strokeWidth="2"
          fill="none"
        />
      </g>
      <text
        x="52"
        y="30"
        fontFamily="system-ui,-apple-system,sans-serif"
        fontSize="22"
        fontWeight="800"
        fill="var(--foreground, #0f172a)"
      >
        Étudi
      </text>
      <text
        x="108"
        y="30"
        fontFamily="system-ui,-apple-system,sans-serif"
        fontSize="22"
        fontWeight="300"
        fill="#2563eb"
      >
        Plan
      </text>
    </svg>
  );
}
