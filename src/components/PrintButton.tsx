"use client";

/** Opens the browser print dialog (Save as PDF). Hidden when printing. */
export default function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="print:hidden rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-midnight">
      {label}
    </button>
  );
}
