// app/components/DentalSurfHero.tsx
import Image from "next/image";

export default function DentalSurfHero() {
  return (
    <section className="relative w-full">
      {/* IMAGE DE FOND */}
      <Image
        src="/dentalsurfcontest2026.png" // ton image sans texte
        alt="Dental Surf Contest Background"
        width={1200}
        height={1800}
        priority
        className="w-full h-auto block"
      />

      {/* OVERLAY TEXTE */}
     <div className="absolute inset-0 flex flex-col items-center justify-start pt-4 sm:pt-10 md:pt-14 text-center">
  
  {/* Phrase fine */}
  <p className="text-white text-xl sm:text-3xl md:text-5xl lg:text-7xl font-agdasima tracking-wide leading-none">
    Vendredi 4 septembre la 3ème édition
  </p>

  {/* Titre principal */}
  <h1 className="font-agdasima text-[2.5rem] md:text-6xl lg:text-9xl font-bold uppercase tracking-wide text-[#A9F5FC] leading-none">
    Dental Surf Contest
  </h1>

  {/* Année */}
  <div className="font-agdasima text-7xl md:text-7xl lg:text-8xl font-bold text-[#FFF4C4] leading-none -mt-2 md:-mt-4">
    2026
  </div>

</div>
    </section>
  );
}