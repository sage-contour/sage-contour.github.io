import { useState, type FormEvent } from 'react'
import { closing, FORM_ENDPOINT } from '../data/content'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const field =
  'w-full rounded-xl border border-bg/20 bg-bg/5 px-4 py-3 text-base text-bg placeholder:text-bg/40 ' +
  'outline-none transition-colors focus:border-accent focus:bg-bg/10 focus-visible:ring-2 focus-visible:ring-accent/60'

/** Contact form posted to formsubmit.co, so it works on static hosting. */
export function ContactForm() {
  const t = closing.form
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('_honey')) return // bot filled the hidden field
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-bg/15 bg-bg/5 p-6 sm:p-8" role="status" aria-live="polite">
        <p className="eyebrow text-bg/60">{t.eyebrow}</p>
        <p className="mt-4 font-serif text-xl leading-snug text-bg">{t.success}</p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-6 text-sm text-bg/70 underline-offset-4 hover:text-bg hover:underline">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-bg/15 bg-bg/5 p-6 sm:p-8" noValidate={false}>
      <p className="eyebrow text-bg/60">{t.eyebrow}</p>
      {/* formsubmit.co settings */}
      <input type="hidden" name="_subject" value={t.subject} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm text-bg/70">{t.name}</span>
          <input name="name" type="text" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-bg/70">{t.email}</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm text-bg/70">{t.message}</span>
        <textarea name="message" required rows={4} placeholder={t.messagePlaceholder} className={`${field} resize-y`} />
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={status === 'sending'} className="btn-primary bg-accent px-6 py-3 text-base text-bg hover:bg-accent-strong disabled:opacity-60">
          {status === 'sending' ? t.sending : t.submit}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-4 text-sm text-accent" role="alert">
          {t.error}
        </p>
      )}
    </form>
  )
}
