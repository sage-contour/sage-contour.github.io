import { closing } from '../data/content'
import { ContactForm } from './ContactForm'
import { Topography } from './Topography'

export function ClosingCTA() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-ink text-bg">
      <Topography className="opacity-60 invert" />
      <div className="container-x relative py-24 sm:py-32">
        <div className="reveal grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{closing.heading}</h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-bg/75">{closing.copy}</p>
            <p className="mt-10 max-w-xl font-serif text-xl leading-snug text-bg/90">{closing.finalLine}</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
