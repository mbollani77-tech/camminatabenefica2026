'use client';

import { useState } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState({});

  async function login(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Errore');
      return;
    }
    setParticipants(data.participants);
    setAuthed(true);
  }

  async function toggleGroupPaid(group_id, currentStatus) {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    await fetch('/api/admin/mark-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, group_id, status: newStatus }),
    });
    setParticipants((prev) =>
      prev.map((p) =>
        p.group_id === group_id && p.payment_method === 'cash' ? { ...p, payment_status: newStatus } : p
      )
    );
  }

  async function deleteParticipant(id) {
    if (!confirm('Eliminare questo partecipante? Potrai ripristinarlo in seguito dalla sezione "Eliminati".')) return;
    await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id }),
    });
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, is_deleted: true } : p)));
  }

  async function restoreParticipant(id) {
    await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id, restore: true }),
    });
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, is_deleted: false } : p)));
  }

  async function saveNote(id) {
    const note = noteDrafts[id];
    if (note === undefined) return;
    await fetch('/api/admin/update-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id, note }),
    });
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, note } : p)));
  }

  function exportCsv() {
    const activeOnly = participants.filter((p) => !p.is_deleted);
    const headers = ['Codice iscrizione', 'Data iscrizione', 'Nome', 'Cognome', 'Email', 'Telefono', 'Categoria', 'Importo', 'Metodo', 'Stato', 'Nota'];
    const rows = activeOnly.map((p) => [
      p.group_id.slice(0, 8),
      new Date(p.created_at).toLocaleString('it-IT'),
      p.first_name,
      p.last_name,
      p.email,
      p.phone || '',
      p.category,
      p.amount,
      p.payment_method === 'card' ? 'Online (carta)' : 'In loco',
      p.payment_status,
      p.note || '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'partecipanti.csv';
    a.click();
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 360, margin: '80px auto', padding: 20 }}>
        <h1 style={{ fontSize: 20 }}>Accesso admin</h1>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #d6d3d1' }}
          />
          {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: 10, borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 600 }}
          >
            {loading ? 'Attendere...' : 'Entra'}
          </button>
        </form>
      </main>
    );
  }

  const active = participants.filter((p) => !p.is_deleted);
  const deleted = participants.filter((p) => p.is_deleted);
  const totalPaid = active.filter((p) => p.payment_status === 'paid').length;
  const groupOrder = [];
  active.forEach((p) => {
    if (!groupOrder.includes(p.group_id)) groupOrder.push(p.group_id);
  });

  const columns = ['Iscrizione', 'Data', 'Nome', 'Email', 'Categoria', 'Importo', 'Metodo', 'Stato', 'Nota', 'Azioni'];

  return (
    <main style={{ maxWidth: 1150, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20 }}>
          Partecipanti: {active.length} ({groupOrder.length} iscrizioni) · Pagati: {totalPaid}
        </h1>
        <button
          onClick={exportCsv}
          style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#0f766e', color: '#fff', fontWeight: 600 }}
        >
          Esporta CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e7e5e4' }}>
              {columns.map((h) => (
                <th key={h} style={{ padding: 8, fontSize: 13, color: '#57534e' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.map((p) => {
              const groupIndex = groupOrder.indexOf(p.group_id);
              const rowBg = groupIndex % 2 === 0 ? '#fff' : '#f7fafc';
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f0efee', background: rowBg }}>
                  <td style={{ padding: 8, fontSize: 12, color: '#a8a29e' }}>{p.group_id.slice(0, 8)}</td>
                  <td style={{ padding: 8, fontSize: 12, color: '#78716c', whiteSpace: 'nowrap' }}>
                    {new Date(p.created_at).toLocaleDateString('it-IT')}
                    <br />
                    {new Date(p.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: 8 }}>{p.first_name} {p.last_name}</td>
                  <td style={{ padding: 8 }}>{p.email}</td>
                  <td style={{ padding: 8 }}>{p.category}</td>
                  <td style={{ padding: 8 }}>€{p.amount}</td>
                  <td style={{ padding: 8 }}>{p.payment_method === 'card' ? 'Online (carta)' : 'In loco'}</td>
                  <td style={{ padding: 8 }}>
                    {p.payment_status === 'paid' ? '✅ Pagato' : '⏳ In attesa'}
                    {p.payment_method === 'cash' && (
                      <div>
                        <button
                          onClick={() => toggleGroupPaid(p.group_id, p.payment_status)}
                          style={{ marginTop: 4, padding: '4px 8px', fontSize: 11, borderRadius: 6, border: '1px solid #16a34a', background: '#fff', color: '#16a34a', cursor: 'pointer' }}
                        >
                          {p.payment_status === 'paid' ? 'Segna non pagato' : 'Segna gruppo pagato'}
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 8, minWidth: 140 }}>
                    <input
                      defaultValue={p.note || ''}
                      placeholder="Aggiungi nota..."
                      onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      onBlur={() => saveNote(p.id)}
                      style={{ width: '100%', padding: '6px 8px', fontSize: 12, borderRadius: 6, border: '1px solid #e7e5e4' }}
                    />
                  </td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => deleteParticipant(p.id)}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #f3d6de', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: 12 }}
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 28 }}>
        <button
          onClick={() => setShowDeleted((v) => !v)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #d6d3d1', background: '#fff', color: '#57534e', cursor: 'pointer', fontSize: 13 }}
        >
          {showDeleted ? '▼' : '▶'} Eliminati ({deleted.length})
        </button>

        {showDeleted && (
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fdf5f5' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #e7e5e4' }}>
                  {['Iscrizione', 'Nome', 'Email', 'Categoria', 'Importo', 'Azioni'].map((h) => (
                    <th key={h} style={{ padding: 8, fontSize: 13, color: '#57534e' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deleted.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0efee' }}>
                    <td style={{ padding: 8, fontSize: 12, color: '#a8a29e' }}>{p.group_id.slice(0, 8)}</td>
                    <td style={{ padding: 8, opacity: 0.6 }}>{p.first_name} {p.last_name}</td>
                    <td style={{ padding: 8, opacity: 0.6 }}>{p.email}</td>
                    <td style={{ padding: 8, opacity: 0.6 }}>{p.category}</td>
                    <td style={{ padding: 8, opacity: 0.6 }}>€{p.amount}</td>
                    <td style={{ padding: 8 }}>
                      <button
                        onClick={() => restoreParticipant(p.id)}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #16a34a', background: '#fff', color: '#16a34a', cursor: 'pointer', fontSize: 12 }}
                      >
                        Ripristina
                      </button>
                    </td>
                  </tr>
                ))}
                {deleted.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 12, color: '#a8a29e', fontSize: 13 }}>
                      Nessun partecipante eliminato.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
