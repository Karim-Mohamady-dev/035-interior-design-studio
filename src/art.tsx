export default function HeroArt({ alt }: { alt: string }) {
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label={alt} className="h-auto w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="640" height="420" fill="#F7EFE8" />
      <rect y="300" width="640" height="120" fill="#E5D3C3" />
      <rect x="60" y="80" width="150" height="110" rx="4" fill="#FFFFFF" stroke="#C9A88F" stroke-width="2" />
      <rect x="76" y="96" width="118" height="78" fill="#D9A05B" />
      <rect x="250" y="70" width="120" height="130" rx="4" fill="#FFFFFF" stroke="#C9A88F" stroke-width="2" />
      <circle cx="310" cy="135" r="34" fill="#7A4A2B" />
      <rect x="410" y="90" width="170" height="110" rx="4" fill="#FFFFFF" stroke="#C9A88F" stroke-width="2" />
      <rect x="426" y="106" width="138" height="78" fill="#8FA98F" />
      <rect x="90" y="230" width="14" height="70" fill="#5C4632" />
      <rect x="240" y="230" width="14" height="70" fill="#5C4632" />
      <rect x="80" y="220" width="34" height="10" rx="4" fill="#E8C86A" />
      <rect x="230" y="220" width="34" height="10" rx="4" fill="#E8C86A" />
      <rect x="120" y="250" width="400" height="80" rx="16" fill="#7A4A2B" />
      <rect x="140" y="230" width="90" height="60" rx="12" fill="#9A6B4F" />
      <rect x="250" y="230" width="90" height="60" rx="12" fill="#9A6B4F" />
      <rect x="360" y="230" width="90" height="60" rx="12" fill="#9A6B4F" />
      <rect x="140" y="330" width="360" height="14" rx="7" fill="#C9A88F" />
      <path d="M540 330 q-10 -60 -40 -70 q30 20 20 50 q-20 -30 -45 -25 q25 20 20 45 z" fill="#5C7A4F" />
      <rect x="536" y="330" width="10" height="40" fill="#5C4632" />
    </svg>
  )
}
