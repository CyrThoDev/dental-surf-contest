import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative w-full">
      <Image
        src="/dentalsurfcontestaffiche.png"
        alt="Dental Surf Contest 2026"
        width={1200}
        height={1800}
        priority
        className="w-full h-auto object-cover"
      />
    </section>
  )
}