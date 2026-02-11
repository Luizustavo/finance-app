export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#405259] px-4 py-8">
      {/* Scattered topographic contours */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cluster 1 — top left */}
        <g transform="translate(30, 40) scale(1.4)">
          <path d="M60 5 C30 5, 5 30, 5 60 S30 115, 60 115 S115 90, 115 60 S90 5, 60 5Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M60 18 C38 18, 18 38, 18 60 S38 102, 60 102 S102 82, 102 60 S82 18, 60 18Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M60 32 C47 32, 32 47, 32 60 S47 88, 60 88 S88 73, 88 60 S73 32, 60 32Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M60 44 C53 44, 44 53, 44 60 S53 76, 60 76 S76 67, 76 60 S67 44, 60 44Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 2 — top right */}
        <g transform="translate(760, 50) scale(1.2)">
          <path d="M50 2 C22 8, 2 30, 5 55 S28 100, 55 95 S98 68, 95 42 S72 -4, 50 2Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M50 16 C32 20, 16 36, 18 55 S34 88, 55 84 S86 64, 84 44 S66 10, 50 16Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M50 30 C40 33, 30 42, 32 55 S42 76, 55 73 S74 60, 73 47 S60 26, 50 30Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 3 — center left */}
        <g transform="translate(60, 420) scale(1.3)">
          <path d="M45 0 C18 5, 0 25, 3 50 S22 92, 50 88 S92 65, 88 38 S68 -5, 45 0Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M45 14 C26 18, 14 32, 16 50 S30 80, 50 77 S80 60, 78 42 S62 9, 45 14Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M45 28 C34 30, 28 40, 29 50 S37 68, 50 66 S68 56, 67 45 S55 25, 45 28Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M47 38 C42 39, 38 44, 39 50 S43 59, 50 58 S59 53, 58 47 S52 37, 47 38Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 4 — right middle */}
        <g transform="translate(820, 380) scale(1.5)">
          <path d="M40 5 C18 10, 0 28, 5 52 S24 90, 48 85 S88 60, 82 35 S60 0, 40 5Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M40 20 C28 24, 14 36, 18 52 S30 78, 48 74 S76 55, 72 38 S52 14, 40 20Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M42 34 C36 36, 28 43, 30 52 S38 66, 48 64 S64 52, 62 42 S48 30, 42 34Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 5 — bottom left */}
        <g transform="translate(120, 740) scale(1.6)">
          <path d="M55 2 C25 6, 2 32, 8 58 S32 102, 60 96 S105 68, 98 40 S78 -2, 55 2Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M55 18 C34 22, 18 40, 22 58 S38 90, 58 85 S90 64, 86 44 S72 12, 55 18Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M55 34 C44 36, 34 46, 36 58 S44 78, 58 75 S76 62, 74 48 S64 30, 55 34Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M55 46 C50 47, 46 52, 47 58 S51 66, 57 65 S65 59, 64 52 S60 44, 55 46Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 6 — bottom right */}
        <g transform="translate(700, 780) scale(1.3)">
          <path d="M42 4 C20 10, 4 28, 8 50 S26 86, 48 80 S84 58, 78 34 S62 -2, 42 4Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M42 18 C28 22, 16 34, 19 50 S30 74, 48 70 S72 54, 68 38 S54 12, 42 18Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M43 32 C36 34, 28 42, 30 50 S38 64, 48 62 S62 52, 60 42 S50 28, 43 32Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 7 — top center */}
        <g transform="translate(400, 70) scale(1.1)">
          <path d="M35 3 C16 8, 3 22, 6 40 S20 72, 38 68 S68 48, 64 28 S52 -2, 35 3Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M35 16 C24 19, 14 30, 16 40 S24 60, 38 57 S56 44, 54 32 S44 12, 35 16Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M36 28 C32 29, 26 35, 27 40 S32 50, 38 49 S48 42, 47 36 S40 26, 36 28Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 8 — bottom center */}
        <g transform="translate(440, 880) scale(1.2)">
          <path d="M30 2 C14 6, 2 18, 5 32 S16 58, 32 54 S56 38, 52 22 S44 -2, 30 2Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M30 12 C20 15, 12 24, 14 32 S22 48, 32 45 S46 34, 44 25 S38 8, 30 12Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 9 — center area */}
        <g transform="translate(480, 500) scale(1.0)">
          <path d="M40 2 C18 7, 2 22, 5 42 S20 78, 42 74 S78 52, 74 30 S58 -3, 40 2Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M40 14 C26 18, 14 28, 16 42 S26 66, 42 63 S66 48, 64 34 S52 10, 40 14Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M40 26 C34 28, 26 34, 28 42 S34 56, 42 54 S56 46, 54 38 S46 24, 40 26Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
        {/* Cluster 10 — far right center-bottom */}
        <g transform="translate(900, 600) scale(1.4)">
          <path d="M35 4 C16 8, 4 20, 6 36 S18 64, 36 60 S64 44, 60 26 S50 0, 35 4Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
          <path d="M35 16 C24 19, 14 28, 16 36 S24 52, 36 49 S52 40, 50 30 S44 12, 35 16Z" fill="none" stroke="#A7D5F2" strokeWidth="0.8" />
        </g>
      </svg>

      {/* Top wavy divider — taller */}
      <svg
        className="absolute left-0 top-0 w-full"
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "30vh" }}
      >
        <path
          d="M0,140 C180,240 360,40 540,140 C720,240 900,40 1080,140 C1260,240 1380,80 1440,140 L1440,0 L0,0 Z"
          fill="#62ABD9"
          fillOpacity="0.12"
        />
        <path
          d="M0,100 C200,200 440,20 680,110 C920,200 1160,30 1440,100 L1440,0 L0,0 Z"
          fill="#A7D5F2"
          fillOpacity="0.07"
        />
        <path
          d="M0,60 C300,150 600,-10 900,70 C1100,130 1300,20 1440,60 L1440,0 L0,0 Z"
          fill="#C2E5F2"
          fillOpacity="0.05"
        />
      </svg>

      {/* Bottom wavy divider — taller */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "30vh" }}
      >
        <path
          d="M0,140 C180,40 360,240 540,140 C720,40 900,240 1080,140 C1260,40 1380,200 1440,140 L1440,280 L0,280 Z"
          fill="#62ABD9"
          fillOpacity="0.12"
        />
        <path
          d="M0,180 C200,80 440,260 680,170 C920,80 1160,250 1440,180 L1440,280 L0,280 Z"
          fill="#A7D5F2"
          fillOpacity="0.07"
        />
        <path
          d="M0,220 C300,130 600,290 900,210 C1100,150 1300,260 1440,220 L1440,280 L0,280 Z"
          fill="#C2E5F2"
          fillOpacity="0.05"
        />
      </svg>

      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  )
}
