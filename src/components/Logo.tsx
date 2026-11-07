// Placeholder logo. Replace STAR_PATH / the whole component with the final SVG.
export const STAR_PATH =
  "M50 2 C53 34 66 47 98 50 C66 53 53 66 50 98 C47 66 34 53 2 50 C34 47 47 34 50 2 Z";

export function LogoMark({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <path d={STAR_PATH} fill="var(--gold)" />
    </svg>
  );
}

export default function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-black">شباهنگ</span>
          <span dir="ltr" className="whitespace-nowrap font-latin text-[9px] tracking-[0.3em] text-muted md:text-[10px]">
            SHABAHANG STUDIO
          </span>
        </span>
      )}
    </span>
  );
}
