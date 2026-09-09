import { useMemo, useState } from 'react'
import { ErrorState } from '../../components/ui/States'
import { useAdminData } from '../../context/AdminDataContext'
import { useDebounce } from '../../hooks/useDebounce'
import { downloadCSV } from '../../lib/csv'
import { TrendChart } from '../../components/admin/BarChart'
import {
  EmptyPanel,
  ExportButton,
  PageHeading,
  Panel,
  SearchBox,
  StatCard,
  TableSkeleton,
  bucketByDay,
  dateFmt,
} from '../../components/admin/ui'

const DAY = 24 * 60 * 60 * 1000

export default function Subscribers() {
  const { subscribers, reload } = useAdminData()
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)
  const debounced = useDebounce(search, 200)
  const rows = subscribers.data

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    const result = q ? rows.filter((s) => s.email.toLowerCase().includes(q)) : rows
    return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [rows, debounced])

  const last30 = rows.filter((s) => new Date(s.createdAt).getTime() >= Date.now() - 30 * DAY).length
  const domains = useMemo(() => {
    const map = new Map()
    rows.forEach((s) => {
      const d = s.email.split('@')[1] || 'unknown'
      map.set(d, (map.get(d) || 0) + 1)
    })
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [rows])

  function exportCSV() {
    downloadCSV(
      'wayfare-subscribers.csv',
      [
        { key: 'email', label: 'Email' },
        { key: 'createdAt', label: 'Subscribed' },
      ],
      filtered.map((s) => ({ email: s.email, createdAt: dateFmt.format(new Date(s.createdAt)) }))
    )
  }

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(filtered.map((s) => s.email).join(', '))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeading title="Subscribers" subtitle="Newsletter list, ready to paste into your mailer.">
        <button
          type="button"
          onClick={copyEmails}
          disabled={filtered.length === 0}
          className="rounded-full border border-ink-900/15 px-4 py-2 text-xs font-bold text-ink-900 transition-colors hover:bg-mist-100 disabled:opacity-40"
        >
          {copied ? '✓ Copied' : `Copy ${filtered.length} emails`}
        </button>
        <ExportButton onClick={exportCSV} />
      </PageHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Total subscribers" value={rows.length} icon="📬" accent="bg-blue-100 text-blue-600" />
        <StatCard label="Joined last 30 days" value={last30} icon="✨" accent="bg-green-100 text-green-600" delay={0.03} />
        <StatCard label="Top domain" value={domains[0] ? domains[0][0] : '—'} hint={domains[0] ? `${domains[0][1]} subscribers` : undefined} icon="🌐" accent="bg-amber-100 text-amber-600" delay={0.06} />
      </div>

      {rows.length > 0 && (
        <Panel title="Sign-ups, last 14 days" delay={0.05}>
          <TrendChart data={bucketByDay(rows)} />
        </Panel>
      )}

      <SearchBox value={search} onChange={setSearch} placeholder="Search email…" />

      <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
        {subscribers.status === 'loading' && <TableSkeleton cols={2} />}
        {subscribers.status === 'error' && (
          <div className="p-6">
            <ErrorState message={subscribers.error?.message} onRetry={() => reload('subscribers')} />
          </div>
        )}
        {subscribers.status === 'success' && rows.length === 0 && <EmptyPanel text="No subscribers yet." />}
        {subscribers.status === 'success' && rows.length > 0 && filtered.length === 0 && <EmptyPanel text="No subscribers match your search." />}
        {subscribers.status === 'success' && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-mist-100/60 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/6">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-mist-100/40">
                    <td className="px-5 py-3 text-ink-900">{s.email}</td>
                    <td className="px-5 py-3 text-xs text-ink-500">{dateFmt.format(new Date(s.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
