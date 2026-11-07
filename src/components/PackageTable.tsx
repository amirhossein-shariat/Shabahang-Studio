import type { Pkg } from "@/dictionaries/services";

export default function PackageTable({ pkg, price }: { pkg: Pkg; price: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-start">
            <th scope="col" className="p-4 text-start font-normal text-muted">{pkg.priceNote}</th>
            {pkg.levels.map((l, i) => (
              <th key={l} scope="col" className="p-4 text-start">
                <span className={["text-amber", "text-text", "text-gold"][i] + " text-base font-black"}>{l}</span>
                <span className="mt-1 block text-xs font-normal text-muted">{price}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pkg.rows.map((r, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0 align-top">
              <th scope="row" className="p-4 text-start font-normal">
                {r.group && <span className="mb-1 block text-xs font-bold tracking-wider text-gold">{r.group}</span>}
                {r.label}
              </th>
              {r.v.map((v, j) => (
                <td key={j} className={"p-4 " + (v === "—" ? "text-muted" : "text-text")}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
