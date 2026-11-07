import type { Dict } from "./index";

const en: Dict = {
  meta: {
    title: "Shabahang Studio | Design, Motion & IT",
    description: "A full studio for design, digital and IT, for brands that never sleep.",
  },
  nav: { work: "Work", services: "Services", studio: "Studio", contact: "Contact", talk: "Let's talk" },
  hero: {
    eyebrow: "Design · Digital · IT",
    title: "Shabahang",
    sub: "STUDIO",
    tagline: "While everyone sleeps, we stay awake.",
    desc: "Design, motion and IT, crafted for brands that never sleep.",
    cta1: "Start a project",
    cta2: "View our work",
    scroll: "Scroll",
  },
  services: {
    kicker: "Services",
    title: "Five pillars, one studio",
    items: [
      { key: "brand", name: "Brand", en: "برند و هویت", line: "Give your business a face.", detail: "Logo, visual identity, catalogues, packaging graphics and logo motion." },
      { key: "web", name: "Web & Software", en: "سایت و نرم‌افزار", line: "Get online.", detail: "Company sites, online stores and custom panels, with 3 months of free support." },
      { key: "growth", name: "Content & Growth", en: "محتوا و رشد", line: "Get seen.", detail: "Monthly packages for design, motion, content and page management." },
      { key: "it", name: "IT & Infrastructure", en: "IT و زیرساخت", line: "Keep your systems healthy and on.", detail: "User support, monitoring, backups and VoIP on a monthly contract." },
      { key: "product", name: "Product Design", en: "طراحی محصول", line: "Turn your idea into a product.", detail: "Industrial design, modelling and rendering, prototyping and 3D printing." },
    ],
  },
  work: {
    kicker: "Work",
    title: "Selected projects",
    note: "Case studies are coming soon.",
    placeholder: "[Project — awaiting content]",
  },
  cta: {
    title: "Ready for a brand that never sleeps?",
    desc: "Tell us about your project and let's begin.",
    button: "Start a project",
    contact: "[YOUR EMAIL] · [YOUR PHONE]",
  },
  footer: { rights: "Shabahang Studio. All rights reserved." },
};
export default en;
