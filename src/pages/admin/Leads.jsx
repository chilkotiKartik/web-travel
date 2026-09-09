import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ErrorState } from '../../components/ui/States'
import { useAdminData } from '../../context/AdminDataContext'
import { useDebounce } from '../../hooks/useDebounce'
import { updateEnquiryNotes, updateEnquiryStatus } from '../../lib/api'
import { downloadCSV } from '../../lib/csv'
import {
  EmptyPanel,
  ExportButton,
  LEAD_STATUSES,
  MailButton,
  PageHeading,
  SearchBox,
  TableSkeleton,
  WhatsAppButton,
  dateFmt,
  leadStatusMeta,
} from '../../components/admin/ui'

function LeadNotes({ lead, onSaved }) {
  const [value, setValue] = useState(lead.adminNotes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const dirty = value !== (lead.adminNotes || '')

  async function save() {
    setSaving(true)
    setError(null)
    try {
      await updateEnquiryNotes(lead.id, value)
      await onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <label htmlFor={`notes-${lead.id}`} className="text-xs font-bold uppercase tracking-wide text-ink-500">
        Internal notes
      </label>
      <textarea
        id={`notes-${lead.id}`}
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Called on Tue, wants a Nov 12 departure, budget is flexible…"
        className="mt-1.5 w-full rounded-xl border border-ink-900/15 bg-white p-3 text-sm outline-none focus:border-blue-600"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-navy-800 disabled:opacity-40"
        >
          {saving ? 'Saving…' : dirty ? 'Save note' : 'Saved'}
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  )
}

function LeadRow({ lead, onReload }) {
  const [open, setOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const meta = leadStatusMeta(lead.status)
  const waMsg = `Hi ${lead.contact.name}, this is Wayfare — following up on your ${lead.destination || 'trip'} enquiry!`

  async function changeStatus(status) {
    setUpdating(true)
    setError(null)
    try {
      await updateEnquiryStatus(lead.id, status)
      await onReload()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink-900">{lead.contact.name}</p>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.tone}`}>{meta.label}</span>
            <span className="rounded-full bg-ink-900/5 px-2.5 py-0.5 text-xs font-medium text-ink-500">via {lead.source}</span>
            {lead.adminNotes && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">📝 Note</span>}
          </div>
          <p className="mt-1 text-xs text-ink-500">
            {lead.contact.email} · {lead.contact.phone || 'no phone'}
          </p>
          <p className="mt-1.5 text-sm text-ink-700">
            {lead.destination || 'Any destination'} · {lead.tripType || 'Trip type TBD'} · {lead.travelers} traveller
            {lead.travelers === 1 ? '' : 's'} · {lead.budgetBand || 'budget TBD'}
          </p>
          <p className="mt-1 text-xs text-ink-400">{dateFmt.format(new Date(lead.createdAt))}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <WhatsAppButton phone={lead.contact.phone} message={waMsg} />
          <MailButton email={lead.contact.email} subject={`Your Wayfare ${lead.destination || 'trip'} enquiry`} body={`Hi ${lead.contact.name},\n\n`} />
          <select
            value={lead.status}
            disabled={updating}
            onChange={(e) => changeStatus(e.target.value)}
            aria-label={`Pipeline stage for ${lead.contact.name}`}
            className="rounded-full border border-ink-900/15 bg-white px-3 py-2 text-xs font-semibold text-ink-900 outline-none focus:border-blue-600 disabled:opacity-50"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="rounded-full border border-ink-900/15 px-3 py-2 text-xs font-bold text-ink-900 transition-colors hover:bg-mist-100"
          >
            {open ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">Couldn't update: {error}</p>}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-5 rounded-xl bg-mist-100/60 p-4 sm:grid-cols-2">
              <dl className="space-y-2 text-sm">
                {[
                  ['Travel window', lead.tripStart ? `${lead.tripStart} → ${lead.tripEnd || 'open'}` : 'Not set'],
                  ['Hotels', lead.hotelPreference || '—'],
                  ['Transport', lead.transportPreference || '—'],
                  ['Budget', lead.budgetBand || '—'],
                  ['Special needs', lead.specialNeeds || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="w-32 shrink-0 text-xs font-bold uppercase tracking-wide text-ink-500">{k}</dt>
                    <dd className="min-w-0 flex-1 text-ink-700">{v}</dd>
                  </div>
                ))}
              </dl>
              <LeadNotes lead={lead} onSaved={onReload} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Leads() {
  const { enquiries, reload } = useAdminData()
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('all')
  const [sort, setSort] = useState('newest')
  const debounced = useDebounce(search, 200)
  const rows = enquiries.data

  const counts = useMemo(() => {
    const map = { all: rows.length }
    LEAD_STATUSES.forEach((s) => {
      map[s.id] = rows.filter((e) => e.status === s.id).length
    })
    return map
  }, [rows])

  const filtered = useMemo(() => {
    let result = stage === 'all' ? rows : rows.filter((e) => e.status === stage)
    const q = debounced.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (e) =>
          e.contact.name.toLowerCase().includes(q) ||
          e.contact.email.toLowerCase().includes(q) ||
          (e.contact.phone || '').includes(q) ||
          (e.destination || '').toLowerCase().includes(q) ||
          (e.adminNotes || '').toLowerCase().includes(q) ||
          leadStatusMeta(e.status).label.toLowerCase().includes(q)
      )
    }
    const sorted = [...result]
    if (sort === 'newest') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    else if (sort === 'oldest') sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    else if (sort === 'name') sorted.sort((a, b) => a.contact.name.localeCompare(b.contact.name))
    else if (sort === 'travellers') sorted.sort((a, b) => (b.travelers || 0) - (a.travelers || 0))
    return sorted
  }, [rows, stage, debounced, sort])

  function exportCSV() {
    downloadCSV(
      'wayfare-leads.csv',
      [
        { key: 'createdAt', label: 'Created' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'destination', label: 'Destination' },
        { key: 'tripType', label: 'Trip Type' },
        { key: 'travelers', label: 'Travellers' },
        { key: 'budgetBand', label: 'Budget' },
        { key: 'status', label: 'Status' },
        { key: 'source', label: 'Source' },
        { key: 'notes', label: 'Internal Notes' },
      ],
      filtered.map((e) => ({
        createdAt: dateFmt.format(new Date(e.createdAt)),
        name: e.contact.name,
        email: e.contact.email,
        phone: e.contact.phone,
        destination: e.destination,
        tripType: e.tripType,
        travelers: e.travelers,
        budgetBand: e.budgetBand,
        status: leadStatusMeta(e.status).label,
        source: e.source,
        notes: e.adminNotes,
      }))
    )
  }

  const reloadLeads = () => reload('enquiries')

  return (
    <div className="space-y-4">
      <PageHeading title="Leads" subtitle="Every enquiry from the trip planner and contact forms, in one pipeline.">
        <ExportButton onClick={exportCSV} />
      </PageHeading>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={setSearch} placeholder="Search name, email, phone, notes…" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort leads"
          className="w-full rounded-full border border-ink-900/15 bg-white px-4 py-2 text-xs font-semibold text-ink-900 outline-none sm:w-auto"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
          <option value="travellers">Most travellers</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[{ id: 'all', label: 'All' }, ...LEAD_STATUSES].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStage(s.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              stage === s.id ? 'bg-navy-950 text-white' : 'bg-white text-ink-700 hover:bg-mist-100'
            }`}
          >
            {s.label}
            <span className={`ml-1.5 ${stage === s.id ? 'text-white/60' : 'text-ink-500'}`}>{counts[s.id] || 0}</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
        {enquiries.status === 'loading' && <TableSkeleton cols={5} />}
        {enquiries.status === 'error' && (
          <div className="p-6">
            <ErrorState message={enquiries.error?.message} onRetry={reloadLeads} />
          </div>
        )}
        {enquiries.status === 'success' && rows.length === 0 && (
          <EmptyPanel text="No enquiries yet — they'll land here from the Custom Trip Planner." />
        )}
        {enquiries.status === 'success' && rows.length > 0 && filtered.length === 0 && <EmptyPanel text="No leads match this filter." />}
        {enquiries.status === 'success' && filtered.length > 0 && (
          <div className="divide-y divide-ink-900/6">
            {filtered.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onReload={reloadLeads} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
