import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowRight, ArrowUp, Bathtub, Bed, Buildings, CaretDown, Check, CheckCircle,
  Envelope, Globe, House, Key, List, MagnifyingGlass, MapPin, Palette, PencilRuler,
  Phone, Quotes, Ruler, ShieldCheck, Sparkle, Star, Users, WarningCircle, X,
  Compass, Camera, ChatCircle, CalendarCheck,
} from '@phosphor-icons/react'
import en from '../locales/en/common.json'
import ar from '../locales/ar/common.json'
import HeroArt from './art.tsx'

type Lang = 'en' | 'ar'
type Dict = Record<string, any>

const ICONS: Record<string, any> = {
  house: House, buildings: Buildings, key: Key, compass: Compass, palette: Palette,
  pencil: PencilRuler, camera: Camera, users: Users, chat: ChatCircle, calendar: CalendarCheck,
  shield: ShieldCheck, sparkle: Sparkle, star: Star, map: MapPin, phone: Phone, mail: Envelope,
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const C = ICONS[name] || Sparkle
  return <C size={size} weight="regular" aria-hidden="true" />
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`${className} transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      {children}
    </div>
  )
}

function Tagline({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const words = text.split(' ')
  return (
    <section aria-label="tagline" className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <div ref={ref}>
        <p className="heading-3 text-wrap-balance">
          {words.map((w, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ opacity: visible ? 1 : 0.3, transitionDelay: visible ? `${i * 70}ms` : '0ms' }}
            >
              {w}
              {'\u00a0'}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('035-interior-design-studio')
      return saved === 'ar' || saved === 'en' ? (saved as Lang) : 'en'
    } catch { return 'en' }
  })
  const t: Dict = lang === 'ar' ? (ar as Dict) : (en as Dict)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const [menuOpen, setMenuOpen] = useState(false)
  const [route, setRoute] = useState(window.location.hash)
  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [detail, setDetail] = useState<Dict | null>(null)
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null)
  const [cookie, setCookie] = useState(() => { try { return localStorage.getItem('035-interior-design-studio-cookie') === 'yes' } catch { return false } })
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [savedCount, setSavedCount] = useState(() => {
    try { return (JSON.parse(localStorage.getItem('035-interior-design-studio-inquiries') || '[]') as unknown[]).length } catch { return 0 }
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.title = t.metaTitle
    try { localStorage.setItem('035-interior-design-studio', lang) } catch { /* ignore */ }
  }, [lang])

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const is404 = route.startsWith('#/') && route !== '#/'
  const categories: string[] = useMemo(() => ['all', ...Array.from(new Set((t.collection.items as Dict[]).map((i) => i.category as string)))], [t])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (t.collection.items as Dict[]).filter((i) => {
      const okCat = cat === 'all' || i.category === cat
      const hay = `${i.title} ${i.location} ${i.desc}`.toLowerCase()
      return okCat && (!q || hay.includes(q))
    })
  }, [t, cat, query])

  function switchLang(l: Lang) { setLang(l); setMenuOpen(false) }

  function submitForm(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = t.form.errors.required
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t.form.errors.email
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone.trim())) errs.phone = t.form.errors.phone
    if (!form.message.trim()) errs.message = t.form.errors.required
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    try {
      const prev = JSON.parse(localStorage.getItem('035-interior-design-studio-inquiries') || '[]') as Dict[]
      prev.push({ ...form, at: new Date().toISOString() })
      localStorage.setItem('035-interior-design-studio-inquiries', JSON.stringify(prev))
      setSavedCount(prev.length)
    } catch { /* ignore */ }
    setSent(true)
  }

  function goTo(id: string) {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const btnPrimary = 'button-md inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-3 py-2 text-[var(--accent-ink)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]'
  const btnGhost = 'button-md inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-[var(--ink)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]'
  const inputCls = 'w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]'

  if (is404) {
    return (
      <div dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg)] px-4 text-center text-[var(--ink)]">
        <House size={48} weight="regular" aria-hidden="true" />
        <h1 className="heading-2">{t.notFound.title}</h1>
        <p className="body-3 max-w-md">{t.notFound.body}</p>
        <a href="#top" onClick={(e) => { e.preventDefault(); setRoute(''); window.location.hash = ''; }} className={btnPrimary}>{t.notFound.back}</a>
      </div>
    )
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-[var(--accent-ink)]">{t.misc.skip}</a>

      {/* Nav */}
      <header className="fixed inset-x-0 top-4 z-40 px-4">
        <nav aria-label="main" className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]/90 px-4 py-2 shadow-sm backdrop-blur-md">
          <a href="#top" onClick={(e) => { e.preventDefault(); goTo('top') }} className="flex items-center gap-2" aria-current="page">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-ink)]"><Icon name={t.brandIcon} size={18} /></span>
            <span className="title-1">{t.brand}</span>
          </a>
          <ul className="hidden items-center gap-6 lg:flex">
            {(t.nav.links as Dict[]).map((l) => (
              <li key={l.id}><a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); goTo(l.id) }} className="title-4 text-[var(--ink)] transition-colors duration-300 hover:text-[var(--accent)]">{l.label}</a></li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-[var(--line)] p-1" role="group" aria-label={t.nav.language}>
              <button type="button" onClick={() => switchLang('en')} aria-pressed={lang === 'en'} className={`button-sm rounded-lg px-3 py-2 transition-all duration-300 ${lang === 'en' ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'text-[var(--ink)]'}`}>EN</button>
              <button type="button" onClick={() => switchLang('ar')} aria-pressed={lang === 'ar'} className={`button-sm rounded-lg px-3 py-2 transition-all duration-300 ${lang === 'ar' ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'text-[var(--ink)]'}`}>عربي</button>
            </div>
            <button type="button" onClick={() => goTo('contact')} className={`${btnPrimary} hidden sm:inline-flex`}>{t.nav.cta}</button>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={t.nav.menu} className="rounded-xl border border-[var(--line)] p-2 transition-all duration-300 hover:bg-[var(--surface)] lg:hidden">
              {menuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-[var(--line)] bg-[var(--surface)]/95 p-4 shadow-lg backdrop-blur-md lg:hidden">
            <ul className="flex flex-col gap-1">
              {(t.nav.links as Dict[]).map((l, i) => (
                <li key={l.id} className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transitionDelay: `${i * 60}ms`, transform: 'translateY(0)', opacity: 1 }}>
                  <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); goTo(l.id) }} className="title-2 block rounded-xl px-3 py-2 transition-colors duration-300 hover:bg-[var(--bg)]">{l.label}</a>
                </li>
              ))}
              <li><button type="button" onClick={() => goTo('contact')} className={`${btnPrimary} mt-2 w-full`}>{t.nav.cta}</button></li>
            </ul>
          </div>
        )}
      </header>

      <main id="main">
        {/* Hero */}
        <section id="top" className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:pt-40">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="max-w-[680px]">
              <p className="caption-1 mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2"><Globe size={14} aria-hidden="true" />{t.hero.eyebrow}</p>
              <h1 className="heading-1 hero-gradient">{t.hero.title} <span className="block">{t.hero.titleAccent}</span></h1>
              <p className="body-3 mt-4 text-[var(--muted)]">{t.hero.sub}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button type="button" onClick={() => goTo('contact')} className={btnPrimary}>{t.hero.cta}<ArrowRight size={18} aria-hidden="true" /></button>
                <button type="button" onClick={() => goTo('collection')} className={btnGhost}>{t.hero.secondary}</button>
              </div>
              <p className="caption-2 mt-8 flex items-center gap-2 text-[var(--muted)]"><ShieldCheck size={16} aria-hidden="true" />{t.hero.proof}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
              <HeroArt alt={t.hero.alt} />
            </div>
          </div>
        </section>

        {/* Benefits */}
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <section id="benefits" aria-labelledby="benefits-title">
            <p className="caption-1 text-[var(--accent)]">{t.benefits.eyebrow}</p>
            <h2 id="benefits-title" className="heading-3 mt-2 max-w-[680px]">{t.benefits.title}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(t.benefits.items as Dict[]).map((b) => (
                <article key={b.title} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-ink)]"><Icon name={b.icon} size={24} /></span>
                  <h3 className="title-1">{b.title}</h3>
                  <p className="body-6 mt-2 text-[var(--muted)]">{b.body}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Tagline text={t.tagline} />

        {/* How it works */}
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <section id="how" aria-labelledby="how-title">
            <p className="caption-1 text-[var(--accent)]">{t.how.eyebrow}</p>
            <h2 id="how-title" className="heading-3 mt-2 max-w-[680px]">{t.how.title}</h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {(t.how.steps as Dict[]).map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <span className="title-1 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)]">{i + 1}</span>
                  <h3 className="title-1 mt-4">{s.title}</h3>
                  <p className="body-6 mt-2 text-[var(--muted)]">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        {/* Collection */}
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <section id="collection" aria-labelledby="collection-title">
            <p className="caption-1 text-[var(--accent)]">{t.collection.eyebrow}</p>
            <h2 id="collection-title" className="heading-3 mt-2 max-w-[680px]">{t.collection.title}</h2>
            <p className="body-3 mt-2 max-w-[680px] text-[var(--muted)]">{t.collection.sub}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <span className="sr-only">{t.collection.searchLabel}</span>
                <MagnifyingGlass size={18} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.collection.searchPlaceholder} className={`${inputCls} ps-10`} />
              </label>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t.collection.filterLabel}>
                {categories.map((c) => (
                  <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={`button-sm rounded-full border px-3 py-2 transition-all duration-300 ${cat === c ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'}`}>
                    {c === 'all' ? t.collection.allLabel : c}
                  </button>
                ))}
              </div>
            </div>
            {filtered.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
                <MagnifyingGlass size={32} className="mx-auto mb-4 text-[var(--muted)]" aria-hidden="true" />
                <h3 className="title-1">{t.collection.emptyTitle}</h3>
                <p className="body-6 mt-2 text-[var(--muted)]">{t.collection.emptyBody}</p>
                <button type="button" onClick={() => { setQuery(''); setCat('all') }} className={`${btnGhost} mt-4`}>{t.collection.clearFilters}</button>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <article key={item.id} className="flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                    <div className="flex h-40 items-center justify-center gap-2 bg-[var(--bg)] p-4" role="img" aria-label={`${item.title}, ${item.location}`}>
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-ink)]"><Icon name={item.icon} size={32} /></span>
                      <span className="caption-3 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2">{item.tag}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="caption-3 text-[var(--accent)]">{t.collection.sampleLabel} · {item.category}</p>
                      <h3 className="title-1">{item.title}</h3>
                      <p className="body-6 flex items-center gap-2 text-[var(--muted)]"><MapPin size={14} aria-hidden="true" />{item.location}</p>
                      <p className="body-6 flex flex-wrap gap-4 text-[var(--muted)]">
                        {item.meta1 && <span className="flex items-center gap-1"><Bed size={14} aria-hidden="true" />{item.meta1}</span>}
                        {item.meta2 && <span className="flex items-center gap-1"><Bathtub size={14} aria-hidden="true" />{item.meta2}</span>}
                        {item.meta3 && <span className="flex items-center gap-1"><Ruler size={14} aria-hidden="true" />{item.meta3}</span>}
                      </p>
                      <p className="title-1 mt-2">{item.price}</p>
                      <button type="button" onClick={() => setDetail(item)} className={`${btnGhost} mt-2 w-full`}>{t.collection.viewDetails}</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Reveal>

        {/* People / services */}
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <section id="people" aria-labelledby="people-title">
            <p className="caption-1 text-[var(--accent)]">{t.people.eyebrow}</p>
            <h2 id="people-title" className="heading-3 mt-2 max-w-[680px]">{t.people.title}</h2>
            <p className="body-3 mt-2 max-w-[680px] text-[var(--muted)]">{t.people.sub}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(t.people.items as Dict[]).map((p) => (
                <article key={p.name} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]"><Icon name={p.icon} size={24} /></span>
                  <h3 className="title-1">{p.name}</h3>
                  <p className="caption-2 mt-1 text-[var(--accent)]">{p.role}</p>
                  <p className="body-6 mt-2 text-[var(--muted)]">{p.body}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Social proof */}
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <section id="proof" aria-labelledby="proof-title">
            <p className="caption-1 text-[var(--accent)]">{t.proof.eyebrow}</p>
            <h2 id="proof-title" className="heading-3 mt-2 max-w-[680px]">{t.proof.title}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {(t.proof.items as Dict[]).map((q) => (
                <figure key={q.name} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <Quotes size={24} className="mb-4 text-[var(--accent)]" aria-hidden="true" />
                  <blockquote className="body-3">{q.quote}</blockquote>
                  <figcaption className="mt-4">
                    <p className="title-3">{q.name}</p>
                    <p className="caption-2 text-[var(--muted)]">{q.role}</p>
                    <p className="caption-3 mt-2 rounded-full bg-[var(--bg)] px-3 py-2 inline-block">{t.proof.sampleLabel}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Pricing */}
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <section id="pricing" aria-labelledby="pricing-title">
            <p className="caption-1 text-[var(--accent)]">{t.pricing.eyebrow}</p>
            <h2 id="pricing-title" className="heading-3 mt-2 max-w-[680px]">{t.pricing.title}</h2>
            <p className="body-3 mt-2 max-w-[680px] text-[var(--muted)]">{t.pricing.sub}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {(t.pricing.plans as Dict[]).map((plan) => (
                <article key={plan.name} className={`flex flex-col gap-4 rounded-2xl border p-4 ${plan.featured ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-[var(--line)] bg-[var(--surface)]'}`}>
                  <h3 className="title-1">{plan.name}</h3>
                  <p className="heading-4">{plan.price}</p>
                  <p className="caption-2 text-[var(--muted)]">{plan.per}</p>
                  <ul className="flex flex-col gap-2">
                    {(plan.features as string[]).map((f) => (
                      <li key={f} className="body-6 flex items-start gap-2"><Check size={16} className="mt-1 shrink-0 text-[var(--accent)]" aria-hidden="true" />{f}</li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => goTo('contact')} className={`${plan.featured ? btnPrimary : btnGhost} mt-auto w-full`}>{plan.cta}</button>
                </article>
              ))}
            </div>
            <p className="caption-2 mt-4 text-[var(--muted)]">{t.pricing.note}</p>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal className="mx-auto max-w-3xl px-4 py-16">
          <section id="faq" aria-labelledby="faq-title">
            <p className="caption-1 text-[var(--accent)]">{t.faq.eyebrow}</p>
            <h2 id="faq-title" className="heading-3 mt-2">{t.faq.title}</h2>
            <div className="mt-8 flex flex-col gap-4">
              {(t.faq.items as Dict[]).map((f, i) => (
                <div key={f.q} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-4 px-4 py-2 text-start">
                    <span className="title-2 py-2">{f.q}</span>
                    <CaretDown size={18} className={`shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${openFaq === i ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {openFaq === i && <p className="body-3 px-4 pb-4 text-[var(--muted)]">{f.a}</p>}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Contact form */}
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <section id="contact" aria-labelledby="contact-title">
            <div className="grid gap-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-8 lg:grid-cols-2">
              <div>
                <p className="caption-1 text-[var(--accent)]">{t.form.eyebrow}</p>
                <h2 id="contact-title" className="heading-3 mt-2">{t.form.title}</h2>
                <p className="body-3 mt-2 text-[var(--muted)]">{t.form.sub}</p>
                <p className="caption-2 mt-8 flex items-center gap-2 text-[var(--muted)]"><CheckCircle size={16} aria-hidden="true" />{t.form.savedNote.replace('{{count}}', String(savedCount))}</p>
              </div>
              {sent ? (
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-8 text-center" role="status">
                  <CheckCircle size={40} className="mx-auto mb-4 text-[var(--accent)]" aria-hidden="true" />
                  <h3 className="title-1">{t.form.successTitle}</h3>
                  <p className="body-3 mt-2 text-[var(--muted)]">{t.form.successBody}</p>
                  <button type="button" onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', type: '', message: '' }) }} className={`${btnGhost} mt-4`}>{t.form.sendAnother}</button>
                </div>
              ) : (
                <form onSubmit={submitForm} noValidate className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="f-name" className="title-4 mb-2 block">{t.form.name}</label>
                    <input id="f-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.form.namePh} className={inputCls} />
                    {errors.name && <p className="caption-2 mt-2 flex items-center gap-1 text-red-600"><WarningCircle size={14} aria-hidden="true" />{errors.name}</p>}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="f-email" className="title-4 mb-2 block">{t.form.email}</label>
                      <input id="f-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.form.emailPh} className={inputCls} />
                      {errors.email && <p className="caption-2 mt-2 flex items-center gap-1 text-red-600"><WarningCircle size={14} aria-hidden="true" />{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="f-phone" className="title-4 mb-2 block">{t.form.phone}</label>
                      <input id="f-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.form.phonePh} className={inputCls} />
                      {errors.phone && <p className="caption-2 mt-2 flex items-center gap-1 text-red-600"><WarningCircle size={14} aria-hidden="true" />{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="f-type" className="title-4 mb-2 block">{t.form.type}</label>
                    <select id="f-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
                      <option value="">{t.form.typePlaceholder}</option>
                      {(t.form.typeOptions as string[]).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-message" className="title-4 mb-2 block">{t.form.message}</label>
                    <textarea id="f-message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.form.messagePh} className={inputCls} />
                    {errors.message && <p className="caption-2 mt-2 flex items-center gap-1 text-red-600"><WarningCircle size={14} aria-hidden="true" />{errors.message}</p>}
                  </div>
                  <button type="submit" className={btnPrimary}>{t.form.submit}<ArrowRight size={18} aria-hidden="true" /></button>
                </form>
              )}
            </div>
          </section>
        </Reveal>

        {/* Final CTA */}
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <section aria-labelledby="final-title" className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center sm:p-16">
            <h2 id="final-title" className="heading-3 mx-auto max-w-[680px]">{t.finalCta.title}</h2>
            <p className="body-3 mx-auto mt-2 max-w-[680px] text-[var(--muted)]">{t.finalCta.sub}</p>
            <button type="button" onClick={() => goTo('contact')} className={`${btnPrimary} mt-8`}>{t.finalCta.cta}<ArrowRight size={18} aria-hidden="true" /></button>
          </section>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="title-1 flex items-center gap-2"><Icon name={t.brandIcon} size={20} />{t.brand}</p>
            <p className="body-6 mt-2 text-[var(--muted)]">{t.footer.about}</p>
          </div>
          {(t.footer.columns as Dict[]).map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="title-3 mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2">
                {(col.links as Dict[]).map((l) => (
                  <li key={l.label}><a href={`#${l.href}`} onClick={(e) => { e.preventDefault(); goTo(l.href) }} className="body-6 text-[var(--muted)] transition-colors duration-300 hover:text-[var(--ink)]">{l.label}</a></li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="title-3 mb-4">{t.footer.legalTitle}</p>
            <ul className="flex flex-col gap-2">
              <li><button type="button" onClick={() => setLegal('privacy')} className="body-6 text-[var(--muted)] transition-colors duration-300 hover:text-[var(--ink)]">{t.footer.privacy}</button></li>
              <li><button type="button" onClick={() => setLegal('terms')} className="body-6 text-[var(--muted)] transition-colors duration-300 hover:text-[var(--ink)]">{t.footer.terms}</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--line)]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <p className="caption-2 text-[var(--muted)]">{t.footer.rights}</p>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="button-sm flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2 transition-all duration-300 hover:bg-[var(--bg)]">{t.footer.backTop}<ArrowUp size={14} aria-hidden="true" /></button>
          </div>
        </div>
      </footer>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={detail.title} onClick={() => setDetail(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-[var(--ink)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h3 className="title-1">{detail.title}</h3>
              <button type="button" onClick={() => setDetail(null)} aria-label={t.misc.close} className="rounded-xl border border-[var(--line)] p-2 transition-all duration-300 hover:bg-[var(--bg)]"><X size={18} /></button>
            </div>
            <p className="body-6 mt-2 flex items-center gap-2 text-[var(--muted)]"><MapPin size={14} aria-hidden="true" />{detail.location}</p>
            <p className="body-3 mt-4">{detail.desc}</p>
            <p className="title-1 mt-4">{detail.price}</p>
            <button type="button" onClick={() => { setDetail(null); goTo('contact') }} className={`${btnPrimary} mt-8 w-full`}>{t.collection.askAbout}<ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
      )}

      {/* Legal modal */}
      {legal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true" onClick={() => setLegal(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-[var(--ink)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h3 className="title-1">{legal === 'privacy' ? t.footer.privacyTitle : t.footer.termsTitle}</h3>
              <button type="button" onClick={() => setLegal(null)} aria-label={t.misc.close} className="rounded-xl border border-[var(--line)] p-2 transition-all duration-300 hover:bg-[var(--bg)]"><X size={18} /></button>
            </div>
            <p className="body-3 mt-4 text-[var(--muted)]">{legal === 'privacy' ? t.footer.privacyBody : t.footer.termsBody}</p>
          </div>
        </div>
      )}

      {/* Cookie banner */}
      {!cookie && (
        <div className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-lg sm:flex-row sm:items-center" role="region" aria-label="cookie">
          <p className="body-6 flex-1 text-[var(--muted)]">{t.cookie.text}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => { try { localStorage.setItem('035-interior-design-studio-cookie', 'yes') } catch { /* ignore */ } setCookie(true) }} className={btnPrimary}>{t.cookie.accept}</button>
            <button type="button" onClick={() => setCookie(true)} className={btnGhost}>{t.cookie.decline}</button>
          </div>
        </div>
      )}
    </div>
  )
}
