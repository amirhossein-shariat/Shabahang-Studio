import type { ReactNode } from "react";

/** Section wrapper. Items marked [data-item] reveal on scroll through CSS (see globals.css). */
export default function Reveal({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
