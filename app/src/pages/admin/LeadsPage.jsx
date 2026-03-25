import { useEffect, useState } from 'react'
import { Search, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })
      setLeads(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = leads.filter((l) =>
    (l.email || '').toLowerCase().includes(search.toLowerCase())
  )

  function exportCSV() {
    const header = 'Email,Fecha\n'
    const rows = filtered.map((l) => `${l.email},${new Date(l.created_at).toLocaleDateString()}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'neurochef-leads.csv'
    a.click()
  }

  if (loading) return <p className="text-text-muted text-sm">Cargando leads...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-1">Leads</h1>
          <p className="text-text-secondary">{leads.length} emails en waitlist</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sage-500 text-white text-sm font-semibold hover:bg-sage-600 transition"
        >
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-5 py-3 text-text-muted font-medium">Email</th>
              <th className="px-5 py-3 text-text-muted font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-text-muted">
                  No hay leads
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-stone-50 hover:bg-cream transition">
                  <td className="px-5 py-3">{lead.email}</td>
                  <td className="px-5 py-3 text-text-secondary">
                    {new Date(lead.created_at).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
