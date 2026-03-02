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
      <div className="absolute inset-0 flex flex-col items-center pt-16 md:pt-24 lg:pt-28 text-center">
        
        {/* Phrase fine */}
        <p className="text-white text-sm md:text-lg tracking-wide font-light">
          Vendredi 4 septembre la 3ème édition
        </p>

        {/* Titre principal */}
        <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-wide text-[#9EE7E5]">
          Dental Surf Contest
        </h1>

        {/* Année */}
        <div className="mt-2 text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#F5D28C]">
          2026
        </div>

      </div>
    </section>
  );
}