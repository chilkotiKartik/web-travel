import { useMemo, useState } from 'react'
import { ErrorState } from '../../components/ui/States'
import { useAdminData } from '../../context/AdminDataContext'
import { useDebounce } from '../../hooks/useDebounce'
import { downloadCSV } from '../../lib/csv'
import {
  EmptyPanel,
  ExportButton,
  MailButton,
  PageHeading,
  SearchBox,
  TableSkeleton,
  WhatsAppButton,
  dateFmt,
} from '../../components/admin/ui'

export default function Messages() {
  const { messages, reload } = useAdminData()
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('all')
  const debounced = useDebounce(search, 200)
  const rows = messages.data

  const subjects = useMemo(() => Array.from(new Set(rows.map((m) => m.subject).filter(Boolean))), [rows])

  const filtered = useMemo(() => {
    let result = subject === 'all' ? rows : rows.filter((m) => m.subject === subject)
    const q = debounced.trim().toLowerCase()
    if (q) {
      result = result.filter((m) =>
        [m.name, m.email, m.phone, m.subject, m.message].some((f) => String(f || '').toLowerCase().includes(q))
      )
    }
    return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [rows, subject, debounced])

  function exportCSV() {
    downloadCSV(
      'wayfare-messages.csv',
      [
        { key: 'createdAt', label: 'Received' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message' },
      ],
      filtered.map((m) => ({
        createdAt: dateFmt.format(new Date(m.createdAt)),
        name: m.name,
        email: m.email,
        phone: m.phone,
        subject: m.subject,
        message: m.message,
      }))
    )
  }

  return (
    <div className="space-y-4">
      <PageHeading title="Messages" subtitle="Everything sent through the contact form.">
        <ExportButton onClick={exportCSV} />
      </PageHeading>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={setSearch} placeholder="Search sender or message text…" />
        {subjects.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {['all', ...subjects].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSubject(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  subject === s ? 'bg-navy-950 text-white' : 'bg-white text-ink-700 hover:bg-mist-100'
                }`}
              >
                {s === 'all' ? 'All subjects' : s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
        {messages.status === 'loading' && <TableSkeleton cols={4} />}
        {messages.status === 'error' && (
          <div className="p-6">
            <ErrorState message={messages.error?.message} onRetry={() => reload('messages')} />
          </div>
        )}
        {messages.status === 'success' && rows.length === 0 && <EmptyPanel text="No messages yet." />}
        {messages.status === 'success' && rows.length > 0 && filtered.length === 0 && <EmptyPanel text="No messages match your search." />}
        {messages.status === 'success' && filtered.length > 0 && (
          <div className="divide-y divide-ink-900/6">
            {filtered.map((m) => (
              <div key={m.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink-900">{m.name}</p>
                    <p className="text-xs text-ink-500">
                      {m.email}
                      {m.phone ? ` · ${m.phone}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600">{m.subject}</span>
                    <span className="text-xs text-ink-500">{dateFmt.format(new Date(m.createdAt))}</span>
                    <MailButton email={m.email} subject={`Re: ${m.subject}`} body={`Hi ${m.name},\n\n`} />
                    <WhatsAppButton phone={m.phone} message={`Hi ${m.name}, this is Wayfare replying to your message!`} />
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-ink-700">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
