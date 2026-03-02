import Image from "next/image"

export default function Hero() {
  return (
<section className="w-full">
  <Image
    src="/dentalsurfcontest2026.png"
    alt="Dental Surf Contest 2026"
    width={1200}
    height={1800}
    priority
    className="w-full h-auto"
  />
</section>
  )
}