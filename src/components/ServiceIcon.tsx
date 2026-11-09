const c = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** Small stroke icon set (24x24) used for services and the login page. */
export const ICONS = {
  pen: ["M4 20l4-1 11-11-3-3L5 16l-1 4z", "M14 7l3 3"],
  palette: ["M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 0 0 3-3A9 9 0 0 0 12 3z", c(8, 11, 0.6), c(12, 7.5, 0.6), c(16, 11, 0.6)],
  book: ["M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z", "M8 17h10"],
  box: ["M12 3l8 4v10l-8 4-8-4V7l8-4z", "M4 7l8 4 8-4", "M12 11v10"],
  play: [c(12, 12, 9), "M10 8.5l5 3.5-5 3.5v-7z"],
  globe: [c(12, 12, 9), "M3 12h18", "M12 3c3 3 3 15 0 18", "M12 3c-3 3-3 15 0 18"],
  bag: ["M6 8h12l-1 12H7L6 8z", "M9 8a3 3 0 0 1 6 0"],
  layers: ["M12 3l9 5-9 5-9-5 9-5z", "M3 13l9 5 9-5"],
  headset: ["M4 14v-2a8 8 0 0 1 16 0v2", "M4 14h3v5H5a1 1 0 0 1-1-1v-4z", "M20 14h-3v5h2a1 1 0 0 0 1-1v-4z"],
  camera: ["M4 8h3l2-3h6l2 3h3v11H4V8z", c(12, 13, 3.5)],
  film: ["M4 5h16v14H4z", "M8 5v14", "M16 5v14", "M4 10h4", "M4 14h4", "M16 10h4", "M16 14h4"],
  image: ["M4 5h16v14H4z", c(9, 10, 1.5), "M4 17l5-5 4 4 3-3 4 4"],
  calendar: ["M4 6h16v14H4z", "M4 10h16", "M8 3v4", "M16 3v4"],
  activity: ["M3 12h4l3-8 4 16 3-8h4"],
  database: ["M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z", "M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6", "M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"],
  wifi: ["M2 9a15 15 0 0 1 20 0", "M5 12.5a10 10 0 0 1 14 0", "M8.5 16a5 5 0 0 1 7 0", "M12 19.5h.01"],
  phone: ["M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"],
  server: ["M4 4h16v6H4z", "M4 14h16v6H4z", "M8 7h.01", "M8 17h.01"],
  users: [c(9, 8, 3), "M3 20a6 6 0 0 1 12 0", c(17, 8, 3), "M21 20a6 6 0 0 0-4-5.6"],
  grid: ["M4 4h16v16H4z", "M4 12h16", "M12 4v16"],
  text: ["M4 6h16", "M4 12h16", "M4 18h10"],
  user: [c(12, 8, 4), "M4 21a8 8 0 0 1 16 0"],
  lock: ["M6 11h12v9H6z", "M8 11V8a4 4 0 0 1 8 0v3"],
  eye: ["M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z", c(12, 12, 3)],
  eyeOff: ["M3 3l18 18", "M10.6 5.2A9.6 9.6 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9", "M6.4 6.5C3.7 8.3 2 12 2 12s4 7 10 7c1.5 0 2.9-.4 4.1-1"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  key: [c(8, 15, 4), "M11 12l9-9", "M16 7l3 3"],
} as const;

export type IconName = keyof typeof ICONS;

export default function ServiceIcon({ name, size = 22, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name].map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
