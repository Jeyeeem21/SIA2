import { useEffect, useState } from 'react'
import { apiRequest } from './api/client'

const blankStaff = { full_name: '', email: '', phone: '', position: '', department: '', status: 'pending', photo: null }
const badge = { requested: 'bg-amber-100 text-amber-800', approved: 'bg-blue-100 text-blue-800', printed: 'bg-violet-100 text-violet-800', released: 'bg-emerald-100 text-emerald-800' }

function App() {
  const [staff, setStaff] = useState([])
  const [cards, setCards] = useState([])
  const [form, setForm] = useState(blankStaff)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      const [staffResponse, cardResponse] = await Promise.all([apiRequest('/staff'), apiRequest('/staff-id-cards')])
      setStaff(staffResponse.data ?? [])
      setCards(cardResponse.data ?? [])
    } catch (requestError) { setError(requestError.message) }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(loadTimer)
  }, [])

  function change(event) {
    const { name, value, files } = event.target
    setForm((current) => ({ ...current, [name]: name === 'photo' ? files?.[0] ?? null : value }))
  }

  async function save(event) {
    event.preventDefault()
    setError('')
    const body = new FormData()
    Object.entries(form).forEach(([key, value]) => { if (value) body.append(key, value) })
    try {
      await apiRequest(editingId ? `/staff/${editingId}` : '/staff', { method: 'POST', body, headers: editingId ? { 'X-HTTP-Method-Override': 'PATCH' } : {} })
      setNotice(editingId ? 'Staff record updated.' : 'Staff record created.')
      setForm(blankStaff); setEditingId(null); await load()
    } catch (requestError) { setError(requestError.message) }
  }

  async function action(path, method = 'POST', body) {
    try { await apiRequest(path, { method, body: body && JSON.stringify(body) }); setNotice('ID status updated.'); await load() } catch (requestError) { setError(requestError.message) }
  }

  return <main className="min-h-screen bg-slate-100 p-5 text-slate-900 sm:p-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex items-center justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Service Management System</p><h1 className="text-3xl font-bold">Staff Management</h1></div><button onClick={() => window.print()} className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-white print:hidden">Print cards</button></header>
      {error && <p className="rounded-lg bg-red-50 p-4 text-red-800">{error}</p>}{notice && <p className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{notice}</p>}
      <section className="rounded-2xl bg-white p-6 shadow-sm print:hidden"><h2 className="mb-4 text-xl font-bold">{editingId ? 'Edit staff member' : 'Add staff member'}</h2><form onSubmit={save} className="grid gap-3 md:grid-cols-3">
        <Input label="Full name" name="full_name" value={form.full_name} onChange={change} required /><Input label="Email" name="email" type="email" value={form.email} onChange={change} required /><Input label="Phone" name="phone" value={form.phone} onChange={change} /><Input label="Position" name="position" value={form.position} onChange={change} /><Input label="Department" name="department" value={form.department} onChange={change} /><label className="grid gap-1 text-sm font-medium">Status<select name="status" value={form.status} onChange={change} className="rounded-lg border p-2"><option value="pending">Pending</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label><label className="grid gap-1 text-sm font-medium">Photo<input name="photo" type="file" accept="image/png,image/jpeg,image/webp" onChange={change} className="rounded-lg border p-2" /></label><div className="flex items-end gap-2"><button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">{editingId ? 'Save' : 'Add staff'}</button>{editingId && <button type="button" onClick={() => { setForm(blankStaff); setEditingId(null) }} className="font-semibold text-slate-600">Cancel</button>}</div>
      </form></section>
      <section className="rounded-2xl bg-white p-6 shadow-sm print:hidden"><h2 className="mb-4 text-xl font-bold">Staff directory</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="p-3">Name</th><th className="p-3">Department</th><th className="p-3">Staff status</th><th className="p-3">ID request</th><th className="p-3">Actions</th></tr></thead><tbody>{staff.map((member) => <tr key={member.id} className="border-b"><td className="p-3"><div className="flex items-center gap-2">{member.photo_url && <img src={member.photo_url} alt="" className="h-9 w-9 rounded-full object-cover" />}<span><b>{member.full_name}</b><br />{member.email}</span></div></td><td className="p-3">{member.department || '—'}<br />{member.position || ''}</td><td className="p-3 capitalize">{member.status}</td><td className="p-3">{member.id_card ? <Badge status={member.id_card.status} /> : 'Not requested'}</td><td className="space-x-2 p-3"><button onClick={() => { setEditingId(member.id); setForm({ ...blankStaff, ...member, photo: null }) }} className="font-semibold text-blue-700">Edit</button>{!member.id_card && <button onClick={() => action(`/staff/${member.id}/id-card-request`)} className="font-semibold text-emerald-700">Request ID</button>}</td></tr>)}</tbody></table></div></section>
      <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="mb-4 text-xl font-bold">ID lifecycle and release history</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <article key={card.id} className="rounded-xl border p-4"><div className="flex justify-between gap-2"><div><b>{card.staff?.full_name}</b><p className="text-sm text-slate-500">{card.card_number}</p></div><Badge status={card.status} /></div><div className="mt-4 flex gap-2 print:hidden">{card.status === 'requested' && <button onClick={() => action(`/staff-id-cards/${card.id}/status`, 'PATCH', { status: 'approved' })} className="rounded bg-blue-600 px-3 py-1 text-sm text-white">Approve</button>}{card.status === 'approved' && <button onClick={() => action(`/staff-id-cards/${card.id}/status`, 'PATCH', { status: 'printed' })} className="rounded bg-violet-600 px-3 py-1 text-sm text-white">Printed</button>}{card.status === 'printed' && <button onClick={() => { const recipient_name = window.prompt('Recipient name'); if (recipient_name) action(`/staff-id-cards/${card.id}/release`, 'POST', { recipient_name }) }} className="rounded bg-emerald-600 px-3 py-1 text-sm text-white">Release</button>}</div></article>)}</div></section>
    </div>
  </main>
}

function Input({ label, ...props }) { return <label className="grid gap-1 text-sm font-medium">{label}<input {...props} className="rounded-lg border p-2" /></label> }
function Badge({ status }) { return <span className={`rounded-full px-2 py-1 text-xs font-bold capitalize ${badge[status]}`}>{status}</span> }

export default App;
