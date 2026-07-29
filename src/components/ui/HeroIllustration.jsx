export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 240 240"
      className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#34D399" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="120" cy="120" r="110" fill="url(#heroGlow)" />

      {/* Mortar */}
      <path
        d="M100 148c0-12 40-12 40 0l-6 18c-2 6-10 10-14 10h0c-4 0-12-4-14-10l-6-18z"
        fill="#374151"
        opacity="0.9"
      />
      {/* Pestle */}
      <rect x="117" y="112" width="6" height="36" rx="3" fill="#6B7280" transform="rotate(15 120 130)" />
      <ellipse cx="120" cy="112" rx="8" ry="5" fill="#9CA3AF" transform="rotate(15 120 112)" />

      {/* Bottle body */}
      <rect x="138" y="100" width="28" height="52" rx="6" fill="#34D399" fillOpacity="0.25" stroke="#34D399" strokeWidth="1.5" />
      {/* Bottle neck */}
      <rect x="145" y="90" width="14" height="14" rx="3" fill="#34D399" fillOpacity="0.15" stroke="#34D399" strokeWidth="1.2" />
      {/* Bottle cap */}
      <rect x="143" y="86" width="18" height="6" rx="2" fill="#34D399" fillOpacity="0.4" />
      {/* Bottle label */}
      <rect x="142" y="118" width="20" height="14" rx="2" fill="white" fillOpacity="0.5" />
      {/* Leaf on bottle */}
      <path
        d="M145 108c1-4 4-7 8-8"
        stroke="#34D399"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M147 108c1-3 3-5 6-6"
        stroke="#34D399"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Large leaf top-left */}
      <path
        d="M88 74c-6 14-2 28 2 32 4-4 8-18 2-32z"
        fill="#34D399"
        fillOpacity="0.35"
      />
      <path
        d="M88 74c2 6 3 12 2 18"
        stroke="#34D399"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Small leaf top */}
      <path
        d="M108 70c-2 8 2 16 4 18 2-2 6-10 4-18z"
        fill="#34D399"
        fillOpacity="0.25"
      />

      {/* Small leaves bottom */}
      <path
        d="M94 168c-4 8 0 16 2 18 2-2 4-10 2-18z"
        fill="#34D399"
        fillOpacity="0.2"
      />

      {/* Cross/plus decoration */}
      <circle cx="152" cy="132" r="2" fill="#34D399" fillOpacity="0.5" />
      <circle cx="152" cy="138" r="1.5" fill="#34D399" fillOpacity="0.4" />
      <circle cx="155" cy="135" r="1.5" fill="#34D399" fillOpacity="0.4" />

      {/* Droplets */}
      <ellipse cx="98" cy="108" rx="2" ry="3" fill="#34D399" fillOpacity="0.3" />
      <ellipse cx="104" cy="104" rx="1.5" ry="2.5" fill="#34D399" fillOpacity="0.25" />
    </svg>
  );
}
