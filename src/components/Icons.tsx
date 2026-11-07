type P = { size?: number; className?: string };

function Svg({ size = 18, className = "", children }: P & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

export const PhoneIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
  </Svg>
);

export const TelegramIcon = (p: P) => (
  <Svg {...p}>
    <path d="M21.5 3.5 2.8 10.7l5.6 2.2 2.2 6.6 3.1-4 4.7 3.5z"/>
    <path d="M8.4 12.9 21.5 3.5"/>
  </Svg>
);

// Generic chat bubble: stand-in until the official Bale mark is supplied.
export const BaleIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 5.5h16V16H11l-5 4v-4H4z"/>
    <path d="M8.5 10.8h.01M12 10.8h.01M15.5 10.8h.01"/>
  </Svg>
);
