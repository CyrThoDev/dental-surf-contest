import Hero from "@/components/Hero"
import RegistrationForm from "@/components/RegistrationForm"

export default function Home() {
  return (
    <main className="flex flex-col gap-0">
      <Hero />
      <RegistrationForm />
    </main>
  )
}