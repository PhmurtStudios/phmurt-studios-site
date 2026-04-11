const { useState, useEffect, useCallback, useRef, useMemo } = React;

// ═══════════════════════════════
// CONFIG
// ═══════════════════════════════
const API_BASE_URL = null; // Set to your .NET backend URL when deployed, e.g. 'https://api.phmurtstudios.com'

// ═══════════════════════════════
// MOCK DATA
// ═══════════════════════════════
// ── Supabase reference ──────────────────────────────────────────────
const sb = (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;

// ── Admin data-fetching hook ────────────────────────────────────────
function useAdminQuery(fetchFn, deps = []) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetch_ = useCallback(() => {
    if (!sb) {
      setLoading(false);
      setError('Supabase connection failed. The Supabase JS library may not have loaded. Check your network connection and reload the page.');
      return;
    }
    setLoading(true);
    fetchFn(sb)
      .then(d  => { setData(d); setError(null); })
      .catch(e => {
        const msg = e.message || 'Load failed';
        if (msg.includes('JWT')) setError('Session expired. Please reload the page and sign in again.');
        else if (msg.includes('permission') || msg.includes('policy')) setError('Permission denied. Your admin role may need to be re-verified. Try signing out and back in.');
        else setError(msg);
      })
      .finally(() => setLoading(false));
  }, deps);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch_(); }, [fetch_]);
  return { data, loading, error, refetch: fetch_ };
}

// (Legacy mock data removed — all pages now use live Supabase queries)

// ═══════════════════════════════
// ICONS (inline SVG components)
// ═══════════════════════════════
const Icons = {
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Tenants: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Keys: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Clients: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Audit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  RateLimit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Refresh: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Flag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Sliders: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  ClipboardList: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>,
  Tool: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Crown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20l-2-12-5 5-3-7-3 7-5-5z"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
};

// ═══════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function timeAgo(iso) {
  if (!iso) return 'Never';
  const now = new Date();
  const d = new Date(iso);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}
// ═══════════════════════════════
// AUDIT LOG HELPER
// ═══════════════════════════════
async function logAuditEvent(action, targetType, targetId, details = {}) {
  if (!sb) return;
  try {
    const { data: { session } } = await sb.auth.getSession();
    const user = session && session.user;
    await sb.from('admin_audit_log').insert({
      admin_id: user ? user.id : null,
      admin_email: user ? user.email : null,
      action,
      target_type: targetType,
      target_id: String(targetId || ''),
      details,
    });
  } catch (e) { /* best-effort logging */ }
}

// ═══════════════════════════════
// TOAST SYSTEM
// ═══════════════════════════════
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}

// ═══════════════════════════════
// MODAL COMPONENT
// ═══════════════════════════════
function Modal({ title, children, onClose, footer }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-sm" onClick={onClose} style={{border:'none',padding:'4px'}}><Icons.X /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════
// DASHBOARD PAGE  (live Supabase data)
// ═══════════════════════════════
function DashboardPage({ onNavigate }) {
  const { data: stats, loading, error } = useAdminQuery(async (db) => {
    // Use UTC midnight so "today" is consistent regardless of admin's local timezone
    const todayUTC = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z';
    // Use regular GET with count instead of HEAD requests (HEAD returns 503 on some Supabase tiers)
    const [users, chars, camps, visits, recent] = await Promise.all([
      db.from('profiles').select('id', { count: 'exact' }).limit(0),
      db.from('characters').select('id', { count: 'exact' }).limit(0),
      Promise.resolve(db.from('campaigns').select('id', { count: 'exact' }).limit(0)).catch(() => ({ count: null, error: null })),
      db.from('site_visits').select('id', { count: 'exact' }).limit(0).gte('visited_at', todayUTC),
      db.from('profiles').select('id, name, email, created_at, is_admin, is_banned').order('created_at', { ascending: false }).limit(5),
    ]);
    if (users.error) throw users.error;
    if (chars.error) throw chars.error;
    // campaigns may fail due to RLS policy — show partial results instead of crashing
    if (visits.error) throw visits.error;
    if (recent.error) throw recent.error;
    return {
      users:   users.count  || 0,
      chars:   chars.count  || 0,
      camps:   (camps && camps.count) || '—',
      visits:  visits.count || 0,
      recent:  recent.data  || [],
    };
  });

  if (loading) return <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)',fontFamily:'Spectral,serif'}}>Loading…</div>;
  if (error)   return <div style={{padding:'40px',color:'var(--danger)',fontFamily:'Spectral,serif',background:'rgba(212,67,58,0.06)',border:'1px solid rgba(212,67,58,0.2)',borderRadius:8,margin:20,textAlign:'center',lineHeight:1.6}}><div style={{fontSize:18,marginBottom:8}}>Connection Error</div><div style={{fontSize:13,color:'var(--text-muted)'}}>{error}</div><button onClick={() => window.location.reload()} style={{marginTop:16,padding:'8px 20px',background:'rgba(212,67,58,0.12)',border:'1px solid rgba(212,67,58,0.3)',borderRadius:4,color:'var(--danger)',cursor:'pointer',fontFamily:'Spectral,serif',fontSize:12}}>Reload Page</button></div>;

  const s = stats || { users:0, chars:0, camps:0, visits:0, recent:[] };

  return (
    <div>
      <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px',marginBottom:'24px'}}>Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Registered Users</div>
          <div className="stat-value">{s.users}</div>
          <div className="stat-sub">All-time sign-ups</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Characters</div>
          <div className="stat-value">{s.chars}</div>
          <div className="stat-sub">Saved character sheets</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Campaigns</div>
          <div className="stat-value">{s.camps}</div>
          <div className="stat-sub">Active campaigns</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Visits Today</div>
          <div className="stat-value">{s.visits}</div>
          <div className="stat-sub">Page loads since midnight</div>
        </div>
      </div>

      <div className="card" style={{marginBottom:'24px'}}>
        <div className="card-header"><h2>Newest Members</h2></div>
        <div className="card-body" style={{padding:0}}>
          {s.recent.length === 0 && <div className="empty-state"><p>No users yet.</p></div>}
          {s.recent.map(u => (
            <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 24px',borderBottom:'1px solid var(--border-mid)'}}>
              <div>
                <div style={{fontSize:'13px',fontWeight:600,color:'var(--text)'}}>{u.name || (u.email || '').split('@')[0] || 'Unknown'}</div>
                <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{u.email || '—'}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                {u.is_admin && <span className="badge badge-admin">Admin</span>}
                {u.is_banned && <span className="badge badge-suspended">Banned</span>}
                <span style={{fontSize:'11px',color:'var(--text-faint)'}}>{timeAgo(u.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        <div className="card">
          <div className="card-header"><h2>Quick Links</h2></div>
          <div className="card-body">
            {[
              { label: 'Manage Users',    desc: 'View, ban, or delete accounts',  page: 'users' },
              { label: 'Characters',      desc: 'Browse all saved character sheets', page: 'characters' },
              { label: 'Campaigns',       desc: 'Browse all saved campaigns',     page: 'campaigns' },
              { label: 'Site Traffic',    desc: 'Page visit analytics',           page: 'traffic' },
            ].map(link => (
              <div key={link.page} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border-mid)'}}>
                <div>
                  <div style={{fontSize:'13px',fontWeight:600}}>{link.label}</div>
                  <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{link.desc}</div>
                </div>
                <button className="btn btn-sm" onClick={() => onNavigate && onNavigate(link.page)}>
                  <Icons.Eye />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Platform Status</h2></div>
          <div className="card-body">
            {[
              { label: 'Auth Backend',         value: sb ? 'Supabase ✓' : 'Local (not configured)', ok: !!sb },
              { label: 'Session Persistence',  value: 'Supabase session (no local auth fallback)', ok: !!sb },
              { label: 'Character Cloud Sync', value: 'Enabled', ok: true },
              { label: 'Campaign Cloud Sync',  value: 'Enabled', ok: true },
              { label: 'Page Visit Tracking',  value: sb ? 'Enabled' : 'Unavailable', ok: !!sb },
              { label: 'Admin Gate',           value: 'Image key + role verification', ok: true },
              { label: 'Sign-in Throttling',   value: '8 attempts / 10 min window', ok: true },
            ].map((item, i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border-mid)'}}>
                <span style={{fontSize:'13px'}}>{item.label}</span>
                <span style={{fontSize:'12px',color:item.ok?'#5ee09a':'#ef4444',display:'flex',alignItems:'center',gap:'4px'}}>
                  {item.ok ? <span style={{fontSize:'10px'}}>✓</span> : <span style={{fontSize:'10px'}}>✗</span>} {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════
// CAMPAIGNS PAGE  (live Supabase data)
// ═══════════════════════════════
function CampaignsPage({ addToast, canDeleteContent }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterFlag, setFilterFlag] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { data: campaigns, loading, error, refetch } = useAdminQuery(async (db) => {
    const { data, error } = await db
      .from('campaigns')
      .select('id, data, owner_id, name, system, flagged, flag_reason, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    return data || [];
  });

  const filtered = (campaigns || []).filter(c => {
    if (filterFlag === 'flagged' && !c.flagged) return false;
    if (!search) return true;
    const name = (c.data && c.data.name) || c.name || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
           (c.owner_id || '').toLowerCase().includes(search.toLowerCase());
  });

  async function deleteCampaign(id) {
    if (!canDeleteContent) { addToast('Only superusers can delete campaigns.', 'error'); return; }
    if (!confirm('Delete this campaign? This cannot be undone.')) return;
    const { error } = await sb.from('campaigns').delete().eq('id', id);
    if (error) { addToast('Delete failed. Please check your permissions and try again.', 'error'); return; }
    logAuditEvent('delete_campaign', 'campaign', id, { name: selected?.name });
    addToast('Campaign deleted.', 'success');
    setSelected(null);
    refetch();
  }

  async function toggleFlag(c, reason) {
    const next = !c.flagged;
    const { error } = await sb.from('campaigns').update({ flagged: next, flag_reason: next ? (reason || 'Flagged by admin') : null }).eq('id', c.id);
    if (error) { addToast('Flag update failed. Please try again.', 'error'); return; }
    logAuditEvent(next ? 'flag_campaign' : 'unflag_campaign', 'campaign', c.id, { reason: reason || 'Flagged by admin' });
    addToast(next ? 'Campaign flagged.' : 'Flag removed.', next ? 'error' : 'success');
    refetch();
  }

  async function bulkFlag() {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const { error } = await sb.from('campaigns').update({ flagged: true, flag_reason: 'Bulk flagged by admin' }).in('id', ids);
    if (error) { addToast('Bulk flag failed.', 'error'); return; }
    addToast(ids.length + ' campaigns flagged.', 'success');
    setSelectedIds(new Set()); refetch();
  }

  async function bulkDelete() {
    if (selectedIds.size === 0 || !canDeleteContent) return;
    if (!confirm('Delete ' + selectedIds.size + ' campaigns? This cannot be undone.')) return;
    const ids = Array.from(selectedIds);
    const { error } = await sb.from('campaigns').delete().in('id', ids);
    if (error) { addToast('Bulk delete failed.', 'error'); return; }
    addToast(ids.length + ' campaigns deleted.', 'success');
    setSelectedIds(new Set()); refetch();
  }

  function toggleSelect(id) {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  // Detail view
  if (selected) {
    const d = selected.data || {};
    const players = d.players || d.party || d.members || [];
    const npcs = d.npcs || d.npcList || [];
    const sessions = d.sessions || d.sessionLog || [];
    const quests = d.quests || [];
    return (
      <div>
        <button className="btn btn-sm" onClick={() => setSelected(null)} style={{marginBottom:'16px'}}><Icons.Back /> Back to Campaigns</button>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
          <div>
            <h1 style={{fontFamily:'Cinzel,serif',fontSize:'22px',fontWeight:600,letterSpacing:'1px',marginBottom:'4px'}}>{d.name || selected.name || 'Untitled Campaign'}</h1>
            <div style={{fontSize:'13px',color:'var(--text-muted)'}}>{d.description || '—'}</div>
          </div>
          <div className="btn-group">
            <button className={`btn btn-sm ${selected.flagged ? 'btn-primary' : 'btn-danger'}`} onClick={() => toggleFlag(selected)}>{selected.flagged ? 'Unflag' : 'Flag'}</button>
            <button className="btn btn-sm btn-danger" onClick={() => deleteCampaign(selected.id)} disabled={!canDeleteContent}>Delete</button>
          </div>
        </div>
        {selected.flagged && <div style={{padding:'10px 14px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,marginBottom:'16px',fontSize:'13px',color:'#ef4444'}}>Flagged: {selected.flag_reason || 'No reason given'}</div>}

        <div className="stat-grid" style={{marginBottom:'20px'}}>
          <div className="stat-card"><div className="stat-label">Players</div><div className="stat-value">{players.length}</div></div>
          <div className="stat-card"><div className="stat-label">NPCs</div><div className="stat-value">{npcs.length}</div></div>
          <div className="stat-card"><div className="stat-label">Sessions</div><div className="stat-value">{sessions.length}</div></div>
          <div className="stat-card"><div className="stat-label">Quests</div><div className="stat-value">{quests.length}</div></div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <div className="card">
            <div className="card-header"><h2>Details</h2></div>
            <div className="card-body" style={{fontSize:'13px',display:'grid',gap:'8px'}}>
              <div><span style={{color:'var(--text-muted)'}}>Owner ID: </span><span className="mono" style={{fontSize:'11px'}}>{selected.owner_id}</span></div>
              <div><span style={{color:'var(--text-muted)'}}>System: </span>{d.system || selected.system || '5e'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Invite Code: </span>{d.inviteCode || '—'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Created: </span>{formatDateTime(selected.created_at)}</div>
              <div><span style={{color:'var(--text-muted)'}}>Updated: </span>{formatDateTime(selected.updated_at)}</div>
              {d.calendar && <div><span style={{color:'var(--text-muted)'}}>Calendar: </span>{typeof d.calendar === 'object' ? (d.calendar.name || 'Custom') : d.calendar}</div>}
              {d.economy && <div><span style={{color:'var(--text-muted)'}}>Economy: </span>Enabled</div>}
            </div>
          </div>
          {players.length > 0 && <div className="card">
            <div className="card-header"><h2>Party Members ({players.length})</h2></div>
            <div className="card-body" style={{fontSize:'13px'}}>{players.map((p, i) => <div key={i} style={{padding:'6px 0',borderBottom:'1px solid var(--border-mid)',display:'flex',justifyContent:'space-between'}}><span style={{fontWeight:600}}>{typeof p === 'string' ? p : (p.name || p.characterName || 'Player ' + (i+1))}</span><span style={{color:'var(--text-muted)',fontSize:'11px'}}>{p.class || p.role || ''} {p.level ? 'Lv' + p.level : ''}</span></div>)}</div>
          </div>}
          {npcs.length > 0 && <div className="card">
            <div className="card-header"><h2>NPCs ({npcs.length})</h2></div>
            <div className="card-body" style={{fontSize:'13px'}}>{npcs.slice(0, 20).map((n, i) => <div key={i} style={{padding:'4px 0',borderBottom:'1px solid var(--border-mid)'}}>{typeof n === 'string' ? n : (n.name || 'NPC ' + (i+1))}{n.role ? <span style={{color:'var(--text-muted)'}}> — {n.role}</span> : ''}</div>)}{npcs.length > 20 && <div style={{padding:'8px 0',color:'var(--text-muted)'}}>+ {npcs.length - 20} more</div>}</div>
          </div>}
          {sessions.length > 0 && <div className="card">
            <div className="card-header"><h2>Session Log ({sessions.length})</h2></div>
            <div className="card-body" style={{fontSize:'13px'}}>{sessions.slice(-10).reverse().map((s, i) => <div key={i} style={{padding:'6px 0',borderBottom:'1px solid var(--border-mid)'}}><span style={{fontWeight:600}}>{s.title || s.name || 'Session ' + (sessions.length - i)}</span>{s.date && <span style={{color:'var(--text-muted)',fontSize:'11px',marginLeft:8}}>{s.date}</span>}{s.summary && <div style={{color:'var(--text-muted)',fontSize:'12px',marginTop:2}}>{String(s.summary).slice(0, 120)}{s.summary.length > 120 ? '…' : ''}</div>}</div>)}</div>
          </div>}
          {quests.length > 0 && <div className="card" style={{gridColumn:'1 / -1'}}>
            <div className="card-header"><h2>Quests ({quests.length})</h2></div>
            <div className="card-body" style={{fontSize:'13px'}}>{quests.map((q, i) => <div key={i} style={{padding:'6px 0',borderBottom:'1px solid var(--border-mid)',display:'flex',justifyContent:'space-between'}}><span>{typeof q === 'string' ? q : (q.name || q.title || 'Quest ' + (i+1))}</span>{q.status && <span className={`badge ${q.status === 'complete' || q.status === 'completed' ? 'badge-active' : 'badge-info'}`}>{q.status}</span>}</div>)}</div>
          </div>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Campaigns</h1>
        <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
      </div>

      <div style={{display:'flex',gap:'16px',alignItems:'center',marginBottom:'20px',flexWrap:'wrap'}}>
        <div className="search-bar" style={{maxWidth:'360px'}}>
          <Icons.Search />
          <input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-pills">
          {[['all','All'],['flagged','Flagged']].map(([k,l]) => (
            <span key={k} className={`pill ${filterFlag===k?'active':''}`} onClick={() => setFilterFlag(k)}>{l}</span>
          ))}
        </div>
        {selectedIds.size > 0 && <div className="btn-group">
          <button className="btn btn-sm btn-danger" onClick={bulkFlag}>Flag ({selectedIds.size})</button>
          <button className="btn btn-sm btn-danger" onClick={bulkDelete} disabled={!canDeleteContent}>Delete ({selectedIds.size})</button>
        </div>}
      </div>

      {loading && <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)',fontFamily:'Spectral,serif'}}>Loading…</div>}
      {error && error.includes('infinite recursion') ? (
        <div style={{padding:'20px'}}>
          <div style={{color:'var(--danger)',fontFamily:'Spectral,serif',marginBottom:'12px'}}>{error}</div>
          <div className="card" style={{marginTop:'12px'}}>
            <div className="card-header"><h2>Fix Required: Campaigns RLS Policy</h2></div>
            <div className="card-body">
              <p style={{fontFamily:'Spectral,serif',fontSize:'13px',color:'var(--text-muted)',marginBottom:'12px'}}>
                The campaigns table has a Row Level Security policy that references itself, causing infinite recursion.
                Run this SQL in the Supabase SQL Editor to fix it:
              </p>
              <pre style={{background:'rgba(0,0,0,0.3)',padding:'12px',borderRadius:'6px',fontSize:'11px',color:'#c9a84c',overflow:'auto',whiteSpace:'pre-wrap'}}>{`-- Drop the recursive policy
DROP POLICY IF EXISTS "Users can view campaigns they participate in" ON campaigns;
DROP POLICY IF EXISTS "campaigns_select" ON campaigns;

-- Recreate with a non-recursive policy
CREATE POLICY "campaigns_select" ON campaigns FOR SELECT
  USING (
    owner_id = auth.uid()
    OR id::text IN (
      SELECT jsonb_array_elements_text(data->'players')
      FROM campaigns c2
      WHERE c2.owner_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT (jsonb_array_elements(data->'players')->>'userId')::uuid
      FROM campaigns c3
      WHERE c3.id = campaigns.id
    )
  );

-- Simpler alternative: just allow owners + admins
-- DROP POLICY IF EXISTS "campaigns_select" ON campaigns;
-- CREATE POLICY "campaigns_select" ON campaigns FOR SELECT
--   USING (owner_id = auth.uid());
-- CREATE POLICY "campaigns_admin_select" ON campaigns FOR SELECT
--   USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true)));`}</pre>
            </div>
          </div>
        </div>
      ) : error && <div style={{padding:'20px',color:'var(--danger)',fontFamily:'Spectral,serif'}}>{error}</div>}

      {!loading && !error && (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr><th style={{width:'30px'}}></th><th>Campaign Name</th><th>System</th><th>Owner ID</th><th>Updated</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{textAlign:'center',color:'var(--text-muted)',padding:'40px 16px'}}>No campaigns found.</td></tr>
              )}
              {filtered.map(c => {
                const name = (c.data && c.data.name) || c.name || 'Untitled Campaign';
                return (
                  <tr key={c.id} style={c.flagged ? {background:'rgba(239,68,68,0.04)'} : {}}>
                    <td><input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                    <td style={{fontWeight:600,color:'var(--text)',cursor:'pointer'}} onClick={() => setSelected(c)}>
                      {name} {c.flagged && <span style={{color:'#ef4444',fontSize:'10px'}}>⚑</span>}
                    </td>
                    <td><span className="badge badge-info">{(c.data && c.data.system) || c.system || '5e'}</span></td>
                    <td className="mono" style={{fontSize:'11px'}}>{c.owner_id}</td>
                    <td>{timeAgo(c.updated_at)}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm" onClick={() => setSelected(c)}><Icons.Eye /></button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteCampaign(c.id)} disabled={!canDeleteContent}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════
// USERS PAGE  (live Supabase data)
// ═══════════════════════════════
function UsersPage({ addToast, canManageAdmins }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userChars, setUserChars] = useState([]);
  const [userCamps, setUserCamps] = useState([]);
  const [userVisits, setUserVisits] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const { data: users, loading, error, refetch } = useAdminQuery(async (db) => {
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data || [];
  });

  const filtered = (users || []).filter(u => {
    if (filter === 'admin'  && !u.is_admin)  return false;
    if (filter === 'banned' && !u.is_banned) return false;
    if (search && !(u.name  || '').toLowerCase().includes(search.toLowerCase()) &&
                  !(u.email || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function selectUser(u) {
    setSelectedUser(u);
    setNoteText(u.admin_notes || '');
    if (!sb) return;
    const [chars, camps, visits] = await Promise.all([
      sb.from('characters').select('id, name, class, race, level, builder_type, updated_at').eq('owner_id', u.id).order('updated_at', { ascending: false }).limit(20).then(r => r.data || []).catch(() => []),
      Promise.resolve(sb.from('campaigns').select('id, name, data, system, updated_at').eq('owner_id', u.id).order('updated_at', { ascending: false }).limit(20)).then(r => r.data || []).catch(() => []),
      sb.from('site_visits').select('page, visited_at').eq('user_id', u.id).order('visited_at', { ascending: false }).limit(30).then(r => r.data || []).catch(() => []),
    ]);
    setUserChars(chars);
    setUserCamps(camps);
    setUserVisits(visits);
  }

  async function toggleBan(user) {
    if (!canManageAdmins) { addToast('Superuser privileges required.', 'error'); return; }
    if (user.is_superuser) { addToast('Superuser accounts cannot be modified.', 'error'); return; }
    const next = !user.is_banned;
    const { error } = await sb.from('profiles').update({ is_banned: next }).eq('id', user.id);
    if (error) { addToast('Update failed. Please check your permissions and try again.', 'error'); return; }
    logAuditEvent(next ? 'ban_user' : 'unban_user', 'user', user.id, { email: user.email, name: user.name });
    addToast(next ? 'User banned.' : 'User unbanned.', next ? 'error' : 'success');
    refetch(); setSelectedUser(null);
  }

  async function toggleAdmin(user) {
    if (!canManageAdmins) { addToast('Only superusers can change admin roles.', 'error'); return; }
    if (user.is_superuser) { addToast('Superuser accounts cannot be modified.', 'error'); return; }
    const next = !user.is_admin;
    const { error } = await sb.from('profiles').update({ is_admin: next }).eq('id', user.id);
    if (error) { addToast('Update failed. Please check your permissions and try again.', 'error'); return; }
    logAuditEvent(next ? 'grant_admin' : 'revoke_admin', 'user', user.id, { email: user.email });
    addToast(next ? 'Admin privileges granted.' : 'Admin privileges removed.', 'success');
    refetch(); setSelectedUser(null);
  }

  async function deleteUser(id, user) {
    if (!canManageAdmins) { addToast('Only superusers can delete users.', 'error'); return; }
    if (user && user.is_superuser) { addToast('Superuser accounts cannot be deleted.', 'error'); return; }
    if (!confirm('Delete this profile row? If auth/user data exists elsewhere, remove it separately.')) return;
    const { error } = await sb.from('profiles').delete().eq('id', id);
    if (error) { addToast('Delete failed. Please check your permissions and try again.', 'error'); return; }
    logAuditEvent('delete_user', 'user', id, { email: user?.email, name: user?.name });
    addToast('User deleted.', 'success');
    refetch(); setSelectedUser(null);
  }

  async function sendPasswordReset(email) {
    if (!sb) { addToast('Supabase not configured.', 'error'); return; }
    const { error } = await sb.auth.resetPasswordForEmail(email);
    if (error) { addToast('Reset email failed. Please try again.', 'error'); return; }
    logAuditEvent('password_reset', 'user', null, { email });
    addToast('Password reset email sent.', 'success');
  }

  async function saveNote() {
    if (!selectedUser || !sb) return;
    setSavingNote(true);
    const { error } = await sb.from('profiles').update({ admin_notes: noteText || null }).eq('id', selectedUser.id);
    setSavingNote(false);
    if (error) { addToast('Failed to save note. Please try again.', 'error'); return; }
    addToast('Note saved.', 'success');
    refetch();
  }

  // Full detail view
  if (selectedUser) {
    const u = selectedUser;
    return (
      <div>
        <button className="btn btn-sm" onClick={() => setSelectedUser(null)} style={{marginBottom:'16px'}}><Icons.Back /> Back to Users</button>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
          <div>
            <h1 style={{fontFamily:'Cinzel,serif',fontSize:'22px',fontWeight:600,letterSpacing:'1px',marginBottom:'4px'}}>{u.name || (u.email || '').split('@')[0] || 'Unknown'}</h1>
            <div style={{fontSize:'13px',color:'var(--text-muted)'}}>{u.email || '—'}</div>
          </div>
          <div className="btn-group">
            <button className="btn btn-sm" onClick={() => sendPasswordReset(u.email)}>Send Password Reset</button>
            <button className={`btn btn-sm ${u.is_banned ? 'btn-primary' : 'btn-danger'}`} onClick={() => toggleBan(u)}>{u.is_banned ? 'Unban' : 'Ban'}</button>
            <button className="btn btn-sm" onClick={() => toggleAdmin(u)} disabled={!canManageAdmins}>{u.is_admin ? 'Remove Admin' : 'Make Admin'}</button>
            <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id, u)} disabled={!canManageAdmins}>Delete</button>
          </div>
        </div>

        <div className="stat-grid" style={{marginBottom:'20px'}}>
          <div className="stat-card"><div className="stat-label">Characters</div><div className="stat-value">{userChars.length}</div></div>
          <div className="stat-card"><div className="stat-label">Campaigns</div><div className="stat-value">{userCamps.length}</div></div>
          <div className="stat-card"><div className="stat-label">Recent Visits</div><div className="stat-value">{userVisits.length}</div></div>
          <div className="stat-card"><div className="stat-label">Status</div><div className="stat-value" style={{fontSize:'14px'}}>{u.is_banned ? 'Banned' : u.is_superuser ? 'Superuser' : u.is_admin ? 'Admin' : 'Active'}</div></div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <div className="card">
            <div className="card-header"><h2>Account Info</h2></div>
            <div className="card-body" style={{fontSize:'13px',display:'grid',gap:'8px'}}>
              <div><span style={{color:'var(--text-muted)'}}>User ID: </span><span className="mono" style={{fontSize:'11px'}}>{u.id}</span></div>
              <div><span style={{color:'var(--text-muted)'}}>Name: </span>{u.name || '—'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Email: </span>{u.email || '—'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Joined: </span>{formatDateTime(u.created_at)}</div>
              <div><span style={{color:'var(--text-muted)'}}>Admin: </span>{u.is_admin ? '✓ Yes' : 'No'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Superuser: </span>{u.is_superuser ? '✓ Yes' : 'No'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Banned: </span>{u.is_banned ? '✓ Yes' : 'No'}</div>
              {u.tags && u.tags.length > 0 && <div><span style={{color:'var(--text-muted)'}}>Tags: </span>{u.tags.join(', ')}</div>}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h2>Admin Notes</h2></div>
            <div className="card-body">
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add internal notes about this user…" style={{width:'100%',minHeight:'100px',background:'rgba(255,255,255,0.04)',border:'1px solid var(--border-mid)',color:'var(--text)',fontFamily:'Spectral,serif',fontSize:'13px',padding:'10px',borderRadius:4,resize:'vertical',boxSizing:'border-box'}} />
              <button className="btn btn-sm" onClick={saveNote} disabled={savingNote} style={{marginTop:'8px'}}>{savingNote ? 'Saving…' : 'Save Note'}</button>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h2>Characters ({userChars.length})</h2></div>
            <div className="card-body" style={{padding:0}}>
              {userChars.length === 0 ? <div className="empty-state" style={{padding:'20px'}}><p>No characters.</p></div> :
              userChars.map(c => (
                <div key={c.id} style={{display:'flex',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid var(--border-mid)',fontSize:'13px'}}>
                  <div><span style={{fontWeight:600}}>{c.name || 'Unnamed'}</span><span style={{color:'var(--text-muted)',marginLeft:8}}>{[c.race, c.class].filter(Boolean).join(' · ')}</span></div>
                  <span style={{color:'var(--text-faint)',fontSize:'11px'}}>{timeAgo(c.updated_at)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h2>Campaigns ({userCamps.length})</h2></div>
            <div className="card-body" style={{padding:0}}>
              {userCamps.length === 0 ? <div className="empty-state" style={{padding:'20px'}}><p>No campaigns.</p></div> :
              userCamps.map(c => (
                <div key={c.id} style={{display:'flex',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid var(--border-mid)',fontSize:'13px'}}>
                  <span style={{fontWeight:600}}>{c.name || (c.data && c.data.name) || 'Untitled'}</span>
                  <span style={{color:'var(--text-faint)',fontSize:'11px'}}>{timeAgo(c.updated_at)}</span>
                </div>
              ))}
            </div>
          </div>
          {userVisits.length > 0 && <div className="card" style={{gridColumn:'1 / -1'}}>
            <div className="card-header"><h2>Recent Activity ({userVisits.length})</h2></div>
            <div className="card-body" style={{padding:0}}>
              {userVisits.slice(0, 15).map((v, i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 16px',borderBottom:'1px solid var(--border-mid)',fontSize:'12px'}}>
                  <span className="mono">{v.page || '/'}</span>
                  <span style={{color:'var(--text-faint)'}}>{formatDateTime(v.visited_at)}</span>
                </div>
              ))}
            </div>
          </div>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Users</h1>
        <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
      </div>

      <div style={{display:'flex',gap:'16px',alignItems:'center',marginBottom:'20px',flexWrap:'wrap'}}>
        <div className="search-bar">
          <Icons.Search />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-pills">
          {[['all','All'],['admin','Admins'],['banned','Banned']].map(([k,l]) => (
            <span key={k} className={`pill ${filter===k?'active':''}`} onClick={() => setFilter(k)}>{l}</span>
          ))}
        </div>
      </div>

      {loading && <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)',fontFamily:'Spectral,serif'}}>Loading…</div>}
      {error   && <div style={{padding:'20px',color:'var(--danger)',fontFamily:'Spectral,serif'}}>{error}</div>}

      {!loading && !error && (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="5" style={{textAlign:'center',color:'var(--text-muted)',padding:'40px 16px'}}>No users found.</td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{fontWeight:600,color:'var(--text)',cursor:'pointer'}} onClick={() => selectUser(u)}>{u.name || '—'}</td>
                  <td className="mono">{u.email}</td>
                  <td>
                    {u.is_superuser && <span className="badge badge-admin" style={{marginRight:'4px',background:'rgba(201,168,76,0.12)',color:'#c9a84c'}}>Superuser</span>}
                    {u.is_admin && !u.is_superuser && <span className="badge badge-admin" style={{marginRight:'4px'}}>Admin</span>}
                    {u.is_banned ? <span className="badge badge-suspended">Banned</span>
                                 : <span className="badge badge-active">Active</span>}
                  </td>
                  <td>{formatDate(u.created_at)}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => selectUser(u)}><Icons.Eye /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════
// CHARACTERS PAGE  (live Supabase data)
// ═══════════════════════════════
function CharactersPage({ addToast, canDeleteContent }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterFlag, setFilterFlag] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { data: characters, loading, error, refetch } = useAdminQuery(async (db) => {
    const { data, error } = await db
      .from('characters')
      .select('id, owner_id, name, race, class, level, builder_type, data, flagged, flag_reason, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data || [];
  });

  const filtered = (characters || []).filter(c => {
    if (filterFlag === 'flagged' && !c.flagged) return false;
    if (!search) return true;
    const d    = c.data || {};
    const name = (d.name || c.name || '').toLowerCase();
    const race = (d.race || c.race || '').toLowerCase();
    const cls  = (d.class || d.class_ || c.class || '').toLowerCase();
    const q    = search.toLowerCase();
    return name.includes(q) || race.includes(q) || cls.includes(q) ||
           (c.owner_id || '').toLowerCase().includes(q);
  });

  async function deleteCharacter(id) {
    if (!canDeleteContent) { addToast('Only superusers can delete characters.', 'error'); return; }
    if (!confirm('Delete this character sheet? This cannot be undone.')) return;
    const { error } = await sb.from('characters').delete().eq('id', id);
    if (error) { addToast('Delete failed. Please check your permissions and try again.', 'error'); return; }
    logAuditEvent('delete_character', 'character', id, { name: selected?.name });
    addToast('Character deleted.', 'success');
    setSelected(null);
    refetch();
  }

  async function toggleFlag(c, reason) {
    const next = !c.flagged;
    const { error } = await sb.from('characters').update({ flagged: next, flag_reason: next ? (reason || 'Flagged by admin') : null }).eq('id', c.id);
    if (error) { addToast('Flag update failed. Please try again.', 'error'); return; }
    logAuditEvent(next ? 'flag_character' : 'unflag_character', 'character', c.id, { reason: reason || 'Flagged by admin' });
    addToast(next ? 'Character flagged.' : 'Flag removed.', next ? 'error' : 'success');
    refetch();
  }

  async function bulkFlag() {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const { error } = await sb.from('characters').update({ flagged: true, flag_reason: 'Bulk flagged by admin' }).in('id', ids);
    if (error) { addToast('Bulk flag failed. Please try again.', 'error'); return; }
    logAuditEvent('bulk_flag_characters', 'character', null, { count: ids.length, ids });
    addToast(ids.length + ' characters flagged.', 'success');
    setSelectedIds(new Set());
    refetch();
  }

  async function bulkDelete() {
    if (selectedIds.size === 0 || !canDeleteContent) return;
    if (!confirm('Delete ' + selectedIds.size + ' characters? This cannot be undone.')) return;
    const ids = Array.from(selectedIds);
    const { error } = await sb.from('characters').delete().in('id', ids);
    if (error) { addToast('Bulk delete failed. Please check your permissions and try again.', 'error'); return; }
    addToast(ids.length + ' characters deleted.', 'success');
    setSelectedIds(new Set());
    refetch();
  }

  function toggleSelect(id) {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  // Detail view
  if (selected) {
    const d = selected.data || {};
    const abilities = d.abilities || d.abilityScores || {};
    const equipment = d.equipment || d.items || [];
    const spells = d.spells || d.spellsKnown || [];
    const feats = d.feats || [];
    const skills = d.skills || {};
    return (
      <div>
        <button className="btn btn-sm" onClick={() => setSelected(null)} style={{marginBottom:'16px'}}><Icons.Back /> Back to Characters</button>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
          <div>
            <h1 style={{fontFamily:'Cinzel,serif',fontSize:'22px',fontWeight:600,letterSpacing:'1px',marginBottom:'4px'}}>{d.name || selected.name || 'Unnamed Character'}</h1>
            <div style={{fontSize:'13px',color:'var(--text-muted)'}}>
              {[d.race || selected.race, d.class || d.class_ || selected.class].filter(Boolean).join(' · ')} {d.level || selected.level ? '(Level ' + (d.level || selected.level) + ')' : ''}
            </div>
          </div>
          <div className="btn-group">
            <button className={`btn btn-sm ${selected.flagged ? 'btn-primary' : 'btn-danger'}`} onClick={() => toggleFlag(selected)}>{selected.flagged ? 'Unflag' : 'Flag'}</button>
            <button className="btn btn-sm btn-danger" onClick={() => deleteCharacter(selected.id)} disabled={!canDeleteContent}>Delete</button>
          </div>
        </div>
        {selected.flagged && <div style={{padding:'10px 14px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,marginBottom:'16px',fontSize:'13px',color:'#ef4444'}}>Flagged: {selected.flag_reason || 'No reason given'}</div>}

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <div className="card">
            <div className="card-header"><h2>Details</h2></div>
            <div className="card-body" style={{fontSize:'13px',display:'grid',gap:'8px'}}>
              <div><span style={{color:'var(--text-muted)'}}>Owner ID: </span><span className="mono" style={{fontSize:'11px'}}>{selected.owner_id}</span></div>
              <div><span style={{color:'var(--text-muted)'}}>System: </span>{(d.system === '3.5e' || d.bab !== undefined || d.class_) ? '3.5e' : '5e'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Created: </span>{formatDateTime(selected.created_at)}</div>
              <div><span style={{color:'var(--text-muted)'}}>Updated: </span>{formatDateTime(selected.updated_at)}</div>
              <div><span style={{color:'var(--text-muted)'}}>HP: </span>{d.hp || d.hitPoints || d.maxHp || '—'}</div>
              <div><span style={{color:'var(--text-muted)'}}>AC: </span>{d.ac || d.armorClass || '—'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Background: </span>{d.background || '—'}</div>
              <div><span style={{color:'var(--text-muted)'}}>Alignment: </span>{d.alignment || '—'}</div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h2>Ability Scores</h2></div>
            <div className="card-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
              {['STR','DEX','CON','INT','WIS','CHA'].map(ab => {
                const val = abilities[ab] || abilities[ab.toLowerCase()] || abilities[ab.charAt(0) + ab.slice(1).toLowerCase()] || '—';
                return <div key={ab} style={{textAlign:'center',padding:'8px',background:'rgba(255,255,255,0.02)',borderRadius:4}}><div style={{fontSize:'10px',color:'var(--text-muted)',letterSpacing:'1px'}}>{ab}</div><div style={{fontSize:'18px',fontWeight:600}}>{typeof val === 'object' ? (val.score || val.value || '—') : val}</div></div>;
              })}
            </div>
          </div>
          {feats.length > 0 && <div className="card">
            <div className="card-header"><h2>Feats ({feats.length})</h2></div>
            <div className="card-body" style={{fontSize:'13px'}}>{feats.map((f, i) => <div key={i} style={{padding:'4px 0',borderBottom:'1px solid var(--border-mid)'}}>{typeof f === 'string' ? f : (f.name || f.feat || JSON.stringify(f))}</div>)}</div>
          </div>}
          {Array.isArray(equipment) && equipment.length > 0 && <div className="card">
            <div className="card-header"><h2>Equipment ({equipment.length})</h2></div>
            <div className="card-body" style={{fontSize:'13px'}}>{equipment.slice(0, 30).map((e, i) => <div key={i} style={{padding:'4px 0',borderBottom:'1px solid var(--border-mid)'}}>{typeof e === 'string' ? e : (e.name || e.item || JSON.stringify(e))}</div>)}{equipment.length > 30 && <div style={{color:'var(--text-muted)',padding:'8px 0'}}>+ {equipment.length - 30} more items</div>}</div>
          </div>}
          {Array.isArray(spells) && spells.length > 0 && <div className="card">
            <div className="card-header"><h2>Spells ({spells.length})</h2></div>
            <div className="card-body" style={{fontSize:'13px'}}>{spells.slice(0, 20).map((s, i) => <div key={i} style={{padding:'4px 0',borderBottom:'1px solid var(--border-mid)'}}>{typeof s === 'string' ? s : (s.name || s.spell || JSON.stringify(s))}</div>)}{spells.length > 20 && <div style={{color:'var(--text-muted)',padding:'8px 0'}}>+ {spells.length - 20} more spells</div>}</div>
          </div>}
          {Object.keys(skills).length > 0 && <div className="card" style={{gridColumn:'1 / -1'}}>
            <div className="card-header"><h2>Skills</h2></div>
            <div className="card-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px',fontSize:'12px'}}>{Object.entries(skills).map(([k, v]) => <div key={k}><span style={{color:'var(--text-muted)'}}>{k}: </span>{typeof v === 'object' ? (v.total || v.bonus || v.value || '—') : v}</div>)}</div>
          </div>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Characters</h1>
        <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
      </div>

      <div style={{display:'flex',gap:'16px',alignItems:'center',marginBottom:'20px',flexWrap:'wrap'}}>
        <div className="search-bar" style={{maxWidth:'360px'}}>
          <Icons.Search />
          <input placeholder="Search by name, race, or class…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-pills">
          {[['all','All'],['flagged','Flagged']].map(([k,l]) => (
            <span key={k} className={`pill ${filterFlag===k?'active':''}`} onClick={() => setFilterFlag(k)}>{l}</span>
          ))}
        </div>
        {selectedIds.size > 0 && <div className="btn-group">
          <button className="btn btn-sm btn-danger" onClick={bulkFlag}>Flag ({selectedIds.size})</button>
          <button className="btn btn-sm btn-danger" onClick={bulkDelete} disabled={!canDeleteContent}>Delete ({selectedIds.size})</button>
        </div>}
      </div>

      {loading && <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)',fontFamily:'Spectral,serif'}}>Loading…</div>}
      {error   && <div style={{padding:'20px',color:'var(--danger)',fontFamily:'Spectral,serif'}}>{error}</div>}

      {!loading && !error && (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr><th style={{width:'30px'}}></th><th>Character Name</th><th>Race · Class</th><th>Level</th><th>System</th><th>Updated</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="7" style={{textAlign:'center',color:'var(--text-muted)',padding:'40px 16px'}}>No characters found.</td></tr>
              )}
              {filtered.map(c => {
                const d   = c.data || {};
                const sub = [d.race || c.race, d.class || d.class_ || c.class].filter(Boolean).join(' · ') || '—';
                return (
                  <tr key={c.id} style={c.flagged ? {background:'rgba(239,68,68,0.04)'} : {}}>
                    <td><input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                    <td style={{fontWeight:600,color:'var(--text)',cursor:'pointer'}} onClick={() => setSelected(c)}>
                      {d.name || c.name || 'Unnamed'} {c.flagged && <span style={{color:'#ef4444',fontSize:'10px'}}>⚑</span>}
                    </td>
                    <td>{sub}</td>
                    <td>{d.level || c.level || '—'}</td>
                    <td><span className="badge badge-info">{(d.system === '3.5e' || d.bab !== undefined || d.class_) ? '3.5e' : '5e'}</span></td>
                    <td>{timeAgo(c.updated_at)}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm" onClick={() => setSelected(c)}><Icons.Eye /></button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteCharacter(c.id)} disabled={!canDeleteContent}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════
// TRAFFIC PAGE  (live site_visits data)
// ═══════════════════════════════
function TrafficPage() {
  const [rangeDays, setRangeDays] = useState(14);
  const [pageQuery, setPageQuery] = useState('');
  const [showOnlySuspicious, setShowOnlySuspicious] = useState(false);

  const { data: visits, loading, error, refetch } = useAdminQuery(async (db) => {
    // Fetch 2x the time range so we can compute trend vs previous window
    const doubleCutoff = new Date(Date.now() - (rangeDays * 2 * 24 * 60 * 60 * 1000)).toISOString();
    const { data, error } = await db
      .from('site_visits')
      .select('id, page, visited_at, user_id, session_id, user_agent, referrer')
      .gte('visited_at', doubleCutoff)
      .order('visited_at', { ascending: false })
      .limit(rangeDays >= 60 ? 10000 : 6000);
    if (error) throw error;
    return data || [];
  }, [rangeDays]);

  const normalizePath = useCallback((p) => {
    const raw = String(p || '/').trim() || '/';
    if (raw.length > 180) return raw.slice(0, 177) + '...';
    return raw;
  }, []);

  const isSuspiciousPath = useCallback((p) => {
    const v = String(p || '').toLowerCase();
    return (
      v.indexOf('<') !== -1 ||
      v.indexOf('>') !== -1 ||
      v.indexOf('javascript:') !== -1 ||
      v.indexOf('%3c') !== -1 ||
      v.indexOf('%3e') !== -1 ||
      v.indexOf('union%20select') !== -1 ||
      v.indexOf('..') !== -1 ||
      v.indexOf('<script') !== -1 ||
      v.indexOf('script>') !== -1
    );
  }, []);

  const stats = useMemo(() => {
    if (!visits) return {
      byPage: {}, byDay: {}, byHour: {}, total: 0, uniqueUsers: 0, uniqueVisitors: 0,
      anonymous: 0, suspiciousCount: 0, suspiciousByPath: {}, previousWindowTotal: 0, peakHour: null,
    };
    const byPage = {}, byDay = {}, byHour = {}, suspiciousByPath = {};
    const userSet = new Set();
    const sessionSet = new Set();
    const now = Date.now();
    const currentWindowMs = rangeDays * 24 * 60 * 60 * 1000;
    const currStart = now - currentWindowMs;
    let currentWindowTotal = 0;
    let previousWindowTotal = 0;
    let anonymous = 0;
    let suspiciousCount = 0;

    visits.forEach(v => {
      const ts = Date.parse(v.visited_at || 0);
      const inCurrentWindow = !isNaN(ts) && ts >= currStart;

      // Count previous window visits for trend comparison
      if (!isNaN(ts) && !inCurrentWindow) {
        previousWindowTotal += 1;
        return; // Don't include previous window visits in current stats
      }

      currentWindowTotal += 1;
      const p = normalizePath(v.page || '/');
      byPage[p] = (byPage[p] || 0) + 1;
      const d = (v.visited_at || '').slice(0, 10);
      if (d) byDay[d] = (byDay[d] || 0) + 1;
      const hr = (v.visited_at || '').slice(11, 13);
      if (hr) byHour[hr] = (byHour[hr] || 0) + 1;
      if (v.user_id) userSet.add(v.user_id);
      else anonymous += 1;
      // Track unique visitors by session_id (works for both logged-in and anonymous)
      if (v.session_id) sessionSet.add(v.session_id);
      else if (v.user_id) sessionSet.add('u_' + v.user_id);
      if (isSuspiciousPath(p)) {
        suspiciousCount += 1;
        suspiciousByPath[p] = (suspiciousByPath[p] || 0) + 1;
      }
    });
    const peakHour = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0] || null;
    return {
      byPage,
      byDay,
      byHour,
      total: currentWindowTotal,
      uniqueUsers: userSet.size,
      uniqueVisitors: sessionSet.size,
      anonymous: anonymous,
      suspiciousCount,
      suspiciousByPath,
      previousWindowTotal,
      peakHour,
    };
  }, [visits, rangeDays, normalizePath, isSuspiciousPath]);

  const topPages = useMemo(() => {
    const q = pageQuery.trim().toLowerCase();
    return Object.entries(stats.byPage)
      .filter(([page]) => !q || page.toLowerCase().indexOf(q) !== -1)
      .filter(([page]) => !showOnlySuspicious || isSuspiciousPath(page))
      .sort((a,b) => b[1]-a[1])
      .slice(0, 25);
  }, [stats.byPage, pageQuery, showOnlySuspicious, isSuspiciousPath]);

  const recentDays = Object.entries(stats.byDay).sort((a,b) => b[0].localeCompare(a[0])).slice(0, Math.min(rangeDays, 30));
  const maxDay     = Math.max(1, ...recentDays.map(([,v]) => v));
  const today      = new Date().toISOString().slice(0,10);
  const previous = stats.previousWindowTotal || 0;
  const deltaPct = previous > 0 ? Math.round(((stats.total - previous) / previous) * 100) : null;
  const suspiciousTop = Object.entries(stats.suspiciousByPath).sort((a, b) => b[1] - a[1]).slice(0, 10);

  function exportCsv() {
    function csvSafe(value) {
      var s = String(value == null ? '' : value);
      if (/^[=\-+@]/.test(s)) s = "'" + s; // Prevent CSV formula injection when opened in spreadsheets.
      return '"' + s.replace(/"/g, '""') + '"';
    }
    const rows = [['id', 'page', 'visited_at', 'user_id', 'session_id', 'user_agent', 'referrer']]
      .concat((visits || []).map(v => [
        csvSafe(v.id || ''),
        csvSafe(v.page || '/'),
        csvSafe(v.visited_at || ''),
        csvSafe(v.user_id || ''),
        csvSafe(v.session_id || ''),
        csvSafe(v.user_agent || ''),
        csvSafe(v.referrer || ''),
      ]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'traffic-' + rangeDays + 'd.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Site Traffic</h1>
        <div style={{display:'flex',gap:'8px'}}>
          <button className="btn btn-sm" onClick={exportCsv}>Export CSV</button>
          <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
        </div>
      </div>

      <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap',marginBottom:'18px'}}>
        <div className="filter-pills" style={{marginBottom:0}}>
          {[7, 14, 30, 90].map((d) => (
            <span key={d} className={`pill ${rangeDays===d?'active':''}`} onClick={() => setRangeDays(d)}>{d}d</span>
          ))}
        </div>
        <div className="search-bar" style={{marginBottom:0,maxWidth:'320px'}}>
          <Icons.Search />
          <input placeholder="Filter page path..." value={pageQuery} onChange={e => setPageQuery(e.target.value)} />
        </div>
        <label style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',color:'var(--text-muted)',cursor:'pointer'}}>
          <input type="checkbox" checked={showOnlySuspicious} onChange={e => setShowOnlySuspicious(e.target.checked)} />
          Suspicious paths only
        </label>
      </div>

      {loading && <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)',fontFamily:'Spectral,serif'}}>Loading…</div>}
      {error   && <div style={{padding:'20px',color:'var(--danger)',fontFamily:'Spectral,serif'}}>{error}</div>}

      {!loading && !error && (
        <>
          {visits && visits.length >= (rangeDays >= 60 ? 10000 : 6000) && (
            <div style={{background:'rgba(212,67,58,0.08)',border:'1px solid rgba(212,67,58,0.25)',padding:'10px 16px',marginBottom:'16px',borderRadius:'6px',fontSize:'12px',color:'var(--text-muted)'}}>
              <strong style={{color:'var(--danger)'}}>Data truncated:</strong> The query limit was reached. Stats below may be incomplete. Try selecting a shorter time range for accurate results.
            </div>
          )}
          <div className="stat-grid" style={{marginBottom:'24px'}}>
            <div className="stat-card">
              <div className="stat-label">Visits Tracked</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-sub">Last {rangeDays} days</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Unique Pages</div>
              <div className="stat-value">{Object.keys(stats.byPage).length}</div>
              <div className="stat-sub">Distinct URLs visited</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Today</div>
              <div className="stat-value">{stats.byDay[today] || 0}</div>
              <div className="stat-sub">Page loads since midnight</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Unique Visitors</div>
              <div className="stat-value">{stats.uniqueVisitors}</div>
              <div className="stat-sub">{stats.uniqueUsers} logged in, {stats.anonymous} anonymous page loads</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Trend vs Prior Window</div>
              <div className="stat-value">
                {deltaPct == null ? 'N/A' : (deltaPct > 0 ? '+' : '') + deltaPct + '%'}
              </div>
              <div className="stat-sub">Compared with previous {rangeDays} days</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Suspicious Paths</div>
              <div className="stat-value">{stats.suspiciousCount}</div>
              <div className="stat-sub">Potential probes / malformed URLs</div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <div className="card">
              <div className="card-header"><h2>Top Pages</h2></div>
              <div className="card-body" style={{padding:0}}>
                {topPages.length === 0 && <div className="empty-state"><p>No visit data yet.</p></div>}
                {topPages.map(([page, count]) => (
                  <div key={page} style={{display:'flex',alignItems:'center',padding:'10px 24px',borderBottom:'1px solid var(--border-mid)',gap:'12px'}}>
                    <span className="mono" style={{fontSize:'11px',color:'var(--text)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{page}</span>
                    <div style={{width:'80px',height:'5px',background:'rgba(255,255,255,0.03)',borderRadius:'3px',overflow:'hidden',flexShrink:0}}>
                      <div style={{height:'100%',width:`${Math.round(count/topPages[0][1]*100)}%`,background:'var(--accent)',borderRadius:'3px'}} />
                    </div>
                    <span style={{fontSize:'12px',color:'var(--text-muted)',minWidth:'28px',textAlign:'right',flexShrink:0}}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2>Daily Visits</h2></div>
              <div className="card-body" style={{padding:0}}>
                {recentDays.length === 0 && <div className="empty-state"><p>No visit data yet.</p></div>}
                {recentDays.map(([day, count]) => (
                  <div key={day} style={{display:'flex',alignItems:'center',padding:'8px 24px',borderBottom:'1px solid var(--border-mid)',gap:'12px'}}>
                    <span style={{fontSize:'12px',color:'var(--text-dim)',minWidth:'90px',flexShrink:0}}>{day}</span>
                    <div style={{flex:1,height:'5px',background:'rgba(255,255,255,0.03)',borderRadius:'3px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${Math.round(count/maxDay*100)}%`,background:'var(--accent)',borderRadius:'3px'}} />
                    </div>
                    <span style={{fontSize:'12px',color:'var(--text-muted)',minWidth:'28px',textAlign:'right',flexShrink:0}}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginTop:'16px'}}>
            <div className="card">
              <div className="card-header"><h2>Hourly Distribution (UTC)</h2></div>
              <div className="card-body" style={{padding:0}}>
                {Array.from({ length: 24 }).map((_, idx) => {
                  const key = String(idx).padStart(2, '0');
                  const count = stats.byHour[key] || 0;
                  const peak = stats.peakHour ? stats.peakHour[1] : 1;
                  return (
                    <div key={key} style={{display:'flex',alignItems:'center',padding:'8px 24px',borderBottom:'1px solid var(--border-mid)',gap:'12px'}}>
                      <span style={{fontSize:'12px',color:'var(--text-dim)',minWidth:'46px',flexShrink:0}}>{key}:00</span>
                      <div style={{flex:1,height:'5px',background:'rgba(255,255,255,0.03)',borderRadius:'3px',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${Math.round((count / Math.max(1, peak)) * 100)}%`,background:'var(--accent)',borderRadius:'3px'}} />
                      </div>
                      <span style={{fontSize:'12px',color:'var(--text-muted)',minWidth:'28px',textAlign:'right',flexShrink:0}}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2>Suspicious Path Watchlist</h2></div>
              <div className="card-body" style={{padding:0}}>
                {suspiciousTop.length === 0 && <div className="empty-state"><p>No suspicious path patterns detected.</p></div>}
                {suspiciousTop.map(([path, count]) => (
                  <div key={path} style={{display:'flex',alignItems:'center',padding:'10px 24px',borderBottom:'1px solid var(--border-mid)',gap:'12px'}}>
                    <span className="mono" style={{fontSize:'11px',color:'var(--text)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{path}</span>
                    <span style={{fontSize:'12px',color:'var(--danger)',minWidth:'28px',textAlign:'right',flexShrink:0}}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// (ClientsPage removed — not applicable to Phmurt Studios game site)

// (AuditLogPage and RateLimitsPage removed — replaced with Traffic page)

// ═══════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════
// ── Manage Admins card (used inside SettingsPage) ────────────────────────────
function AdminKeySetupCard({ addToast, canManageAdmins }) {
  const [storedHash, setStoredHash] = useState('');
  const [computedHash, setComputedHash] = useState('');
  const [keyImage, setKeyImage] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setStoredHash('Configured via EXPECTED_HASH in admin source');
  }, []);

  function computeDHash(imgEl) {
    const W = 9, H = 8;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, W, H);
    const px = ctx.getImageData(0, 0, W, H).data;
    let hash = '';
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W - 1; c++) {
        const i1 = (r * W + c) * 4, i2 = i1 + 4;
        const g1 = 0.299*px[i1] + 0.587*px[i1+1] + 0.114*px[i1+2];
        const g2 = 0.299*px[i2] + 0.587*px[i2+1] + 0.114*px[i2+2];
        hash += g1 > g2 ? '1' : '0';
      }
    }
    return hash;
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setStatus('Please upload an image file.');
      return;
    }
    setStatus('Analysing…');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const hash = computeDHash(img);
        setComputedHash(hash);
        setKeyImage(img.src);
        setStatus('Image analysed. Review the hash below and save if correct.');
      };
      img.onerror = () => setStatus('Could not read image.');
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function saveKeyHash() {
    if (!canManageAdmins) {
      addToast('Only superusers can change the admin key hash.', 'error');
      return;
    }
    if (!computedHash) {
      addToast('No hash computed. Please upload an image first.', 'error');
      return;
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      addToast('Clipboard access unavailable. Copy the hash manually from preview.', 'error');
      return;
    }
    navigator.clipboard.writeText(computedHash)
      .then(() => addToast('Hash copied. Update EXPECTED_HASH in admin.html and redeploy.', 'success'))
      .catch(() => addToast('Could not copy hash automatically. Copy it manually from the preview.', 'error'));
  }

  function clearKeyHash() {
    if (!canManageAdmins) {
      addToast('Only superusers can clear the admin key hash.', 'error');
      return;
    }
    setComputedHash('');
    setKeyImage(null);
    setStatus('');
    addToast('Preview cleared.', 'info');
  }

  return (
    <div className="card" style={{gridColumn:'1 / -1'}}>
      <div className="card-header"><h2>Admin Key Setup</h2></div>
      <div className="card-body">
        <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'20px',lineHeight:'1.7'}}>
          Generate a key image hash. To rotate the admin key, copy the new hash and replace <code style={{background:'rgba(255,255,255,0.04)',padding:'2px 6px',borderRadius:'4px',fontSize:'11px'}}>EXPECTED_HASH</code> in <code style={{background:'rgba(255,255,255,0.04)',padding:'2px 6px',borderRadius:'4px',fontSize:'11px'}}>admin.html</code>, then redeploy.
        </p>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'24px'}}>
          <div>
            <div style={{fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'10px',fontFamily:'Cinzel,serif'}}>Current Key Hash</div>
            <div style={{background:'var(--bg-input)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px',fontSize:'11px',fontFamily:'monospace',color:'var(--accent)',wordBreak:'break-all',minHeight:'60px',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
              {storedHash === 'Not configured' ? (
                <span style={{color:'var(--text-muted)'}}>No key configured yet</span>
              ) : storedHash.length > 50 ? (
                storedHash
              ) : (
                storedHash
              )}
            </div>
          </div>

          <div>
            <div style={{fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'10px',fontFamily:'Cinzel,serif'}}>Upload New Key Image</div>
            <label style={{display:'block',border:'2px dashed var(--accent-border)',borderRadius:'8px',padding:'20px',textAlign:'center',cursor:'pointer',transition:'all 0.2s',background:'var(--bg-input)'}}>
              <div style={{fontSize:'24px',marginBottom:'8px'}}>⊞</div>
              <div style={{fontSize:'12px',color:'var(--text-muted)',fontFamily:'Spectral,serif'}}>Click to upload image</div>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={!canManageAdmins} style={{display:'none'}} />
            </label>
          </div>
        </div>

        {status && (
          <div style={{padding:'10px 12px',background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:'8px',fontSize:'12px',color:'var(--text-muted)',marginBottom:'16px'}}>
            {status}
          </div>
        )}

        {computedHash && (
          <div style={{background:'var(--bg-mid)',border:'1px solid var(--border)',borderRadius:'3px',padding:'16px',marginBottom:'16px'}}>
            <div style={{fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'10px',fontFamily:'Cinzel,serif'}}>New Hash Preview</div>
            <div style={{background:'rgba(255,255,255,0.01)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'8px',padding:'12px',fontSize:'11px',fontFamily:'monospace',color:'var(--accent)',wordBreak:'break-all',marginBottom:'12px'}}>
              {computedHash}
            </div>
            {keyImage && (
              <div style={{marginBottom:'12px'}}>
                <img src={keyImage} alt="Key preview" style={{maxWidth:'100%',maxHeight:'200px',borderRadius:'3px',border:'1px solid var(--border)'}} />
              </div>
            )}
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={saveKeyHash}
                style={{flex:1,padding:'10px',background:'rgba(201,168,76,0.12)',color:'var(--accent)',border:'1px solid rgba(201,168,76,0.3)',fontFamily:'Cinzel,serif',fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px'}}>
                Copy Hash
              </button>
              <button onClick={() => { setComputedHash(''); setKeyImage(null); setStatus(''); }}
                style={{flex:1,padding:'10px',background:'transparent',color:'var(--text-muted)',border:'1px solid var(--border)',fontFamily:'Cinzel,serif',fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',borderRadius:'3px'}}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {storedHash !== 'Not configured' && !computedHash && (
          <div style={{display:'flex',gap:'10px'}}>
            <button onClick={clearKeyHash}
              style={{flex:1,padding:'10px',background:'transparent',color:'var(--danger)',border:'1px solid rgba(239,68,68,0.2)',fontFamily:'Cinzel,serif',fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px'}}>
              Clear Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ManageAdminsCard({ addToast, canManageAdmins }) {
  const [admins, setAdmins]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [email, setEmail]       = useState('');
  const [working, setWorking]   = useState(false);

  function fetchAdmins() {
    if (!sb) { setLoading(false); return; }
    setLoading(true);
    sb.from('profiles').select('*')
      .or('is_admin.eq.true,is_superuser.eq.true').order('email')
      .then(r => { setAdmins(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }
  useEffect(() => { fetchAdmins(); }, []);

  async function grantAdmin() {
    if (!canManageAdmins) { addToast('Only superusers can grant admin access.', 'error'); return; }
    if (!sb) { addToast('Supabase not configured.', 'error'); return; }
    const addr = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!addr) { addToast('Enter an email address.', 'error'); return; }
    setWorking(true);
    // Look up the user in profiles by email
    const { data: rows, error } = await sb.from('profiles').select('id, email').eq('email', addr).limit(1);
    if (error || !rows || rows.length === 0) {
      addToast('No account found with that email. They must sign up first.', 'error');
      setWorking(false); return;
    }
    const { error: upErr } = await sb.from('profiles').update({ is_admin: true }).eq('id', rows[0].id);
    if (upErr) { addToast('Failed to grant admin. Please try again.', 'error'); }
    else       { addToast('Admin privileges granted.', 'success'); setEmail(''); fetchAdmins(); }
    setWorking(false);
  }

  async function revokeAdmin(user) {
    if (!canManageAdmins) { addToast('Only superusers can revoke admin access.', 'error'); return; }
    if (!sb) return;
    if (!confirm('Remove admin access from this account?')) return;
    const { error } = await sb.from('profiles').update({ is_admin: false }).eq('id', user.id);
    if (error) addToast('Failed to revoke admin access. Please try again.', 'error');
    else       { addToast('Admin access removed.', 'success'); fetchAdmins(); }
  }

  return (
    <div className="card" style={{gridColumn:'1 / -1'}}>
      <div className="card-header"><h2>Manage Admin Accounts</h2></div>
      <div className="card-body">
        {!sb ? (
          <p style={{fontSize:'13px',color:'var(--text-muted)'}}>Supabase must be configured to manage admins here.</p>
        ) : (
          <>
            {/* Grant form */}
            <div style={{display:'flex',gap:'10px',marginBottom:'24px',alignItems:'flex-end'}}>
              <div style={{flex:1}}>
                <label style={{fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'6px',fontFamily:'Cinzel,serif'}}>Grant Admin by Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  onKeyDown={e => e.key === 'Enter' && grantAdmin()}
                  style={{width:'100%',padding:'9px 12px',background:'var(--bg-input)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'Spectral,serif',fontSize:'13px',borderRadius:'8px',outline:'none'}}
                />
              </div>
              <button onClick={grantAdmin} disabled={!canManageAdmins || working || !email.trim()}
                style={{padding:'9px 20px',background:'rgba(201,168,76,0.12)',color:'var(--accent)',border:'1px solid rgba(201,168,76,0.3)',fontFamily:'Cinzel,serif',fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',opacity:(!canManageAdmins||working||!email.trim())?0.5:1,whiteSpace:'nowrap'}}>
                {working ? 'Granting…' : 'Grant Admin'}
              </button>
            </div>

            {/* Admin list */}
            {loading ? (
              <p style={{fontSize:'13px',color:'var(--text-muted)'}}>Loading…</p>
            ) : admins.length === 0 ? (
              <p style={{fontSize:'13px',color:'var(--text-muted)'}}>No admin accounts found in the database.</p>
            ) : (
              <div className="data-table" style={{overflowX:'auto'}}>
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                  <tbody>
                    {admins.map(u => (
                      <tr key={u.id}>
                        <td>{u.name || '—'}</td>
                        <td><code style={{fontSize:'12px'}}>{u.email}</code></td>
                        <td>
                          {u.is_superuser
                            ? <span style={{fontSize:'11px',padding:'3px 8px',background:'rgba(201,168,76,0.08)',color:'var(--accent)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:'999px'}}>Superuser</span>
                            : <span style={{fontSize:'11px',padding:'3px 8px',background:'rgba(167,139,250,0.08)',color:'#a78bfa',border:'1px solid rgba(167,139,250,0.2)',borderRadius:'999px'}}>Admin</span>
                          }
                        </td>
                        <td>
                          {u.is_superuser
                            ? <span style={{fontSize:'11px',color:'var(--text-faint)'}}>Protected</span>
                            : <button onClick={() => revokeAdmin(u)}
                                style={{padding:'5px 12px',background:'rgba(239,68,68,0.06)',color:'var(--danger)',border:'1px solid rgba(239,68,68,0.15)',fontFamily:'Cinzel,serif',fontSize:'10px',letterSpacing:'1px',cursor:'pointer',borderRadius:'8px'}}>
                                Revoke
                              </button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SettingsPage({ addToast, canManageAdmins }) {
  const sbConfigured = !!sb;

  return (
    <div>
      <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px',marginBottom:'24px'}}>Settings</h1>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
        <div className="card">
          <div className="card-header"><h2>Supabase Connection</h2></div>
          <div className="card-body">
            <div style={{padding:'12px',background: sbConfigured ? 'rgba(94,224,154,0.06)' : 'rgba(239,68,68,0.06)',border:`1px solid ${sbConfigured?'rgba(94,224,154,0.15)':'rgba(239,68,68,0.15)'}`,borderRadius:'8px',fontSize:'13px',color:sbConfigured?'#5ee09a':'#ef4444',marginBottom:'20px'}}>
              {sbConfigured ? '✓ Supabase is connected. Cloud auth and data sync are active.' : '✗ Supabase is not configured. Open supabase-config.js and set your URL and anon key.'}
            </div>
            <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:'1.7',margin:0}}>
              To configure Supabase, open <code style={{background:'rgba(255,255,255,0.04)',padding:'2px 6px',borderRadius:'4px',fontSize:'11px'}}>supabase-config.js</code> and set <code style={{background:'rgba(255,255,255,0.04)',padding:'2px 6px',borderRadius:'4px',fontSize:'11px'}}>SUPABASE_URL</code> and <code style={{background:'rgba(255,255,255,0.04)',padding:'2px 6px',borderRadius:'4px',fontSize:'11px'}}>SUPABASE_ANON_KEY</code> from your Supabase project dashboard under Settings → API.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Admin Access</h2></div>
          <div className="card-body">
            <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:'1.7',marginBottom:'16px'}}>
              Admin access is controlled by <code style={{background:'rgba(255,255,255,0.04)',padding:'2px 6px',borderRadius:'4px',fontSize:'11px'}}>profiles.is_admin</code> / <code style={{background:'rgba(255,255,255,0.04)',padding:'2px 6px',borderRadius:'4px',fontSize:'11px'}}>profiles.is_superuser</code> in Supabase. Email allowlist fallback is disabled for tighter security.
            </p>
            {[
              { label: '2-Factor Gate', desc: 'Image key + account role verification required', on: true },
              { label: 'Supabase Role Checks', desc: 'Admin/superuser flags validated before access', on: sbConfigured },
              { label: 'Sign-in Throttling', desc: 'Temporary lock after repeated failed attempts', on: true },
              { label: 'Cloud Sync', desc: 'Characters & campaigns synced to Supabase', on: sbConfigured },
              { label: 'Visit Tracking', desc: 'Page loads logged to site_visits table', on: sbConfigured },
            ].map((s, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border-mid)'}}>
                <div>
                  <div style={{fontSize:'13px'}}>{s.label}</div>
                  <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{s.desc}</div>
                </div>
                <div className={`toggle ${s.on ? 'on' : ''}`} style={{pointerEvents:'none'}} />
              </div>
            ))}
          </div>
        </div>

        <ManageAdminsCard addToast={addToast} canManageAdmins={canManageAdmins} />

        <AdminKeySetupCard addToast={addToast} canManageAdmins={canManageAdmins} />

        <div className="card" style={{gridColumn:'1 / -1'}}>
          <div className="card-header"><h2>Database Schema</h2></div>
          <div className="card-body">
            <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'16px',lineHeight:'1.7'}}>
              Run the SQL below in your Supabase SQL Editor to create the required tables and Row Level Security policies. This only needs to be done once.
            </p>
            <div className="key-block" style={{maxHeight:'200px'}}>
{`-- profiles: auto-created on signup
create table if not exists public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  name       text,
  email      text,
  is_admin    boolean default false,
  is_superuser boolean default false,
  is_banned   boolean default false,
  admin_notes text,
  tags        text[],
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Self read"     on public.profiles for select using (auth.uid() = id);
create policy "Self update"   on public.profiles for update using (auth.uid() = id);
create policy "Superuser all" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_superuser = true));

-- characters
create table if not exists public.characters (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid references auth.users on delete cascade not null,
  name         text,
  race         text,
  class        text,
  level        integer default 1,
  data         jsonb not null default '{}',
  builder_type text  default '5e',
  flagged      boolean default false,
  flag_reason  text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
alter table public.characters enable row level security;
create policy "Own access" on public.characters for all using (auth.uid() = owner_id);
create policy "Admin read" on public.characters for select using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true)));
create policy "Superuser delete" on public.characters for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and is_superuser = true));

-- campaigns
create table if not exists public.campaigns (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users on delete cascade not null,
  name        text default 'Unnamed Campaign',
  description text,
  system      text default '5e',
  invite_code text,
  data        jsonb not null default '{}',
  flagged     boolean default false,
  flag_reason text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.campaigns enable row level security;
create policy "Own access" on public.campaigns for all using (auth.uid() = owner_id);
create policy "Admin read" on public.campaigns for select using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true)));
create policy "Superuser delete" on public.campaigns for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and is_superuser = true));

-- site_visits
create table if not exists public.site_visits (
  id         bigserial primary key,
  page       text,
  user_id    uuid,
  session_id text,
  user_agent text,
  referrer   text,
  visited_at timestamptz default now()
);
alter table public.site_visits enable row level security;
create policy "Anon insert" on public.site_visits for insert with check (true);
create policy "Admin read"  on public.site_visits for select using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true)));

-- site_errors (client-side JS error reporting)
create table if not exists public.site_errors (
  id         bigserial primary key,
  message    text,
  stack      text,
  page       text,
  user_agent text,
  user_id    uuid,
  created_at timestamptz default now()
);
alter table public.site_errors enable row level security;
create policy "Anon insert" on public.site_errors for insert with check (true);
create policy "Admin read"  on public.site_errors for select using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true)));

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email);
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════
// FLAGGED CONTENT PAGE
// ═══════════════════════════════
function FlaggedContentPage({ addToast, canDeleteContent }) {
  const { data, loading, error, refetch } = useAdminQuery(async (db) => {
    const [chars, camps] = await Promise.all([
      db.from('characters').select('id, owner_id, name, race, class, level, data, flagged, flag_reason, updated_at').eq('flagged', true).order('updated_at', { ascending: false }).limit(100).then(r => r.data || []).catch(() => []),
      Promise.resolve(db.from('campaigns').select('id, owner_id, name, data, flagged, flag_reason, updated_at').eq('flagged', true).order('updated_at', { ascending: false }).limit(100)).then(r => r.data || []).catch(() => []),
    ]);
    return { characters: chars, campaigns: camps };
  });

  const flagged = data || { characters: [], campaigns: [] };
  const total = flagged.characters.length + flagged.campaigns.length;

  async function unflagChar(id) {
    await sb.from('characters').update({ flagged: false, flag_reason: null }).eq('id', id);
    addToast('Character unflagged.', 'success'); refetch();
  }
  async function unflagCamp(id) {
    await sb.from('campaigns').update({ flagged: false, flag_reason: null }).eq('id', id);
    addToast('Campaign unflagged.', 'success'); refetch();
  }
  async function deleteChar(id) {
    if (!canDeleteContent) return;
    if (!confirm('Delete this character?')) return;
    await sb.from('characters').delete().eq('id', id);
    addToast('Character deleted.', 'success'); refetch();
  }
  async function deleteCamp(id) {
    if (!canDeleteContent) return;
    if (!confirm('Delete this campaign?')) return;
    await sb.from('campaigns').delete().eq('id', id);
    addToast('Campaign deleted.', 'success'); refetch();
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel,serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Flagged Content</h1>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <span style={{fontSize:'13px',color:'var(--text-muted)'}}>{total} flagged items</span>
          <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
        </div>
      </div>

      {loading && <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)',fontFamily:'Spectral,serif'}}>Loading…</div>}
      {error && <div style={{padding:'20px',color:'var(--danger)',fontFamily:'Spectral,serif'}}>{error}</div>}

      {!loading && !error && total === 0 && (
        <div className="card"><div className="card-body" style={{textAlign:'center',padding:'60px',color:'var(--text-muted)'}}>
          <div style={{fontSize:'32px',marginBottom:'12px'}}>✓</div>
          <div style={{fontFamily:'Spectral,serif',fontSize:'16px'}}>No flagged content. All clear.</div>
        </div></div>
      )}

      {flagged.characters.length > 0 && (
        <div className="card" style={{marginBottom:'20px'}}>
          <div className="card-header"><h2>Flagged Characters ({flagged.characters.length})</h2></div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Reason</th><th>Owner</th><th>Updated</th><th></th></tr></thead>
            <tbody>{flagged.characters.map(c => {
              const d = c.data || {};
              return (
                <tr key={c.id} style={{background:'rgba(239,68,68,0.04)'}}>
                  <td style={{fontWeight:600}}>{d.name || c.name || 'Unnamed'}</td>
                  <td style={{fontSize:'12px',color:'#ef4444'}}>{c.flag_reason || '—'}</td>
                  <td className="mono" style={{fontSize:'11px'}}>{c.owner_id}</td>
                  <td>{timeAgo(c.updated_at)}</td>
                  <td><div className="btn-group">
                    <button className="btn btn-sm btn-primary" onClick={() => unflagChar(c.id)}>Unflag</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteChar(c.id)} disabled={!canDeleteContent}>Delete</button>
                  </div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {flagged.campaigns.length > 0 && (
        <div className="card">
          <div className="card-header"><h2>Flagged Campaigns ({flagged.campaigns.length})</h2></div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Reason</th><th>Owner</th><th>Updated</th><th></th></tr></thead>
            <tbody>{flagged.campaigns.map(c => {
              const name = (c.data && c.data.name) || c.name || 'Untitled';
              return (
                <tr key={c.id} style={{background:'rgba(239,68,68,0.04)'}}>
                  <td style={{fontWeight:600}}>{name}</td>
                  <td style={{fontSize:'12px',color:'#ef4444'}}>{c.flag_reason || '—'}</td>
                  <td className="mono" style={{fontSize:'11px'}}>{c.owner_id}</td>
                  <td>{timeAgo(c.updated_at)}</td>
                  <td><div className="btn-group">
                    <button className="btn btn-sm btn-primary" onClick={() => unflagCamp(c.id)}>Unflag</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteCamp(c.id)} disabled={!canDeleteContent}>Delete</button>
                  </div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════
// ERROR LOG PAGE
// ═══════════════════════════════
function ErrorLogPage() {
  const [filterText, setFilterText] = useState('');
  const [rangeDays, setRangeDays] = useState(7);

  const { data: errors, loading, error, refetch } = useAdminQuery(async (db) => {
    const cutoff = new Date(Date.now() - rangeDays * 86400000).toISOString();
    const { data, error } = await db
      .from('site_errors')
      .select('*')
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data || [];
  }, [rangeDays]);

  const filtered = (errors || []).filter(e => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (e.message || '').toLowerCase().includes(q) || (e.page || '').toLowerCase().includes(q);
  });

  const grouped = useMemo(() => {
    const map = {};
    (filtered || []).forEach(e => {
      const key = (e.message || 'Unknown error').slice(0, 120);
      if (!map[key]) map[key] = { message: key, count: 0, lastSeen: e.created_at, pages: new Set(), users: new Set() };
      map[key].count++;
      if (e.page) map[key].pages.add(e.page);
      if (e.user_id) map[key].users.add(e.user_id);
      if (e.created_at > map[key].lastSeen) map[key].lastSeen = e.created_at;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [filtered]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel,serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Error Log</h1>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <div className="filter-pills">
            {[7,14,30].map(d => <span key={d} className={`pill ${rangeDays===d?'active':''}`} onClick={() => setRangeDays(d)}>{d}d</span>)}
          </div>
          <button className="btn" onClick={refetch}><Icons.Refresh /></button>
        </div>
      </div>

      <div className="stat-grid" style={{marginBottom:'20px'}}>
        <div className="stat-card"><div className="stat-label">Total Errors</div><div className="stat-value">{filtered.length}</div></div>
        <div className="stat-card"><div className="stat-label">Unique Errors</div><div className="stat-value">{grouped.length}</div></div>
        <div className="stat-card"><div className="stat-label">Affected Pages</div><div className="stat-value">{new Set((filtered || []).map(e => e.page).filter(Boolean)).size}</div></div>
        <div className="stat-card"><div className="stat-label">Affected Users</div><div className="stat-value">{new Set((filtered || []).map(e => e.user_id).filter(Boolean)).size}</div></div>
      </div>

      <div className="search-bar" style={{marginBottom:'20px',maxWidth:'400px'}}>
        <Icons.Search />
        <input placeholder="Filter by error message or page…" value={filterText} onChange={e => setFilterText(e.target.value)} />
      </div>

      {loading && <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Loading…</div>}
      {error && <div style={{padding:'20px',color:'var(--danger)'}}>{error}</div>}

      {!loading && !error && grouped.length === 0 && (
        <div className="card"><div className="card-body" style={{textAlign:'center',padding:'60px',color:'var(--text-muted)'}}>
          <div style={{fontSize:'32px',marginBottom:'12px'}}>✓</div>
          <div style={{fontFamily:'Spectral,serif',fontSize:'16px'}}>No errors in the last {rangeDays} days.</div>
        </div></div>
      )}

      {!loading && !error && grouped.length > 0 && (
        <div className="card">
          <table className="data-table">
            <thead><tr><th>Error Message</th><th>Count</th><th>Pages</th><th>Users</th><th>Last Seen</th></tr></thead>
            <tbody>{grouped.map((g, i) => (
              <tr key={i}>
                <td style={{fontFamily:'monospace',fontSize:'11px',maxWidth:'400px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#ef4444'}}>{g.message}</td>
                <td style={{fontWeight:600}}>{g.count}</td>
                <td>{g.pages.size}</td>
                <td>{g.users.size}</td>
                <td>{timeAgo(g.lastSeen)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════
// ENGAGEMENT PAGE
// ═══════════════════════════════
function EngagementPage() {
  const [rangeDays, setRangeDays] = useState(30);

  const { data, loading, error, refetch } = useAdminQuery(async (db) => {
    const cutoff = new Date(Date.now() - rangeDays * 86400000).toISOString();
    const [profiles, chars, camps, visits] = await Promise.all([
      db.from('profiles').select('id, created_at').order('created_at', { ascending: false }).limit(2000).then(r => r.data || []).catch(() => []),
      db.from('characters').select('id, owner_id, created_at').order('created_at', { ascending: false }).limit(2000).then(r => r.data || []).catch(() => []),
      Promise.resolve(db.from('campaigns').select('id, owner_id, data, system, created_at').order('created_at', { ascending: false }).limit(1000)).then(r => r.data || []).catch(() => []),
      db.from('site_visits').select('user_id, session_id, page, visited_at').gte('visited_at', cutoff).order('visited_at', { ascending: false }).limit(10000).then(r => r.data || []).catch(() => []),
    ]);
    return { profiles, chars, camps, visits };
  }, [rangeDays]);

  const stats = useMemo(() => {
    if (!data) return null;
    const { profiles, chars, camps, visits } = data;
    const now = Date.now();
    const cutoffMs = rangeDays * 86400000;

    // Sign-ups over time (by day)
    const signupsByDay = {};
    profiles.forEach(p => { const d = (p.created_at || '').slice(0, 10); if (d) signupsByDay[d] = (signupsByDay[d] || 0) + 1; });

    // Active users (visited in range) — count both logged-in users and unique sessions
    const activeUserIds = new Set();
    const activeSessionIds = new Set();
    const visitsByPage = {};
    visits.forEach(v => {
      if (v.user_id) activeUserIds.add(v.user_id);
      if (v.session_id) activeSessionIds.add(v.session_id);
      else if (v.user_id) activeSessionIds.add('u_' + v.user_id);
      const p = v.page || '/';
      visitsByPage[p] = (visitsByPage[p] || 0) + 1;
    });

    // Churned users (signed up, not visited in range)
    const churned = profiles.filter(p => !activeUserIds.has(p.id) && Date.parse(p.created_at) < now - cutoffMs).length;

    // Funnel
    const usersWithChars = new Set(chars.map(c => c.owner_id));
    const usersWithCamps = new Set(camps.map(c => c.owner_id));
    const totalUsers = profiles.length;
    const withChar = usersWithChars.size;
    const withCamp = usersWithCamps.size;
    const withBoth = [...usersWithChars].filter(id => usersWithCamps.has(id)).length;

    // Retention: cohort by sign-up week, % active in range
    const cohorts = {};
    profiles.forEach(p => {
      const d = new Date(p.created_at);
      const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      if (!cohorts[key]) cohorts[key] = { week: key, total: 0, active: 0 };
      cohorts[key].total++;
      if (activeUserIds.has(p.id)) cohorts[key].active++;
    });
    const cohortList = Object.values(cohorts).sort((a, b) => b.week.localeCompare(a.week)).slice(0, 12);

    // Campaign stats
    const systemCounts = {};
    let totalPlayers = 0;
    camps.forEach(c => {
      const sys = (c.data && c.data.system) || c.system || '5e';
      systemCounts[sys] = (systemCounts[sys] || 0) + 1;
      const players = (c.data && (c.data.players || c.data.party || c.data.members)) || [];
      totalPlayers += players.length;
    });
    const avgPartySize = camps.length > 0 ? (totalPlayers / camps.length).toFixed(1) : '—';

    // Feature usage (top pages by logged-in visits)
    const featurePages = Object.entries(visitsByPage)
      .filter(([p]) => !p.includes('admin'))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Recent sign-ups (last N days)
    const recentSignups = Object.entries(signupsByDay).sort((a, b) => b[0].localeCompare(a[0])).slice(0, Math.min(rangeDays, 30));
    const maxSignup = Math.max(1, ...recentSignups.map(([, v]) => v));

    return {
      totalUsers, activeUsers: activeUserIds.size, uniqueVisitors: activeSessionIds.size, churned,
      withChar, withCamp, withBoth,
      cohortList, systemCounts, avgPartySize,
      featurePages, recentSignups, maxSignup,
      totalChars: chars.length, totalCamps: camps.length,
    };
  }, [data, rangeDays]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel,serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Engagement</h1>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <div className="filter-pills">
            {[7,14,30,60].map(d => <span key={d} className={`pill ${rangeDays===d?'active':''}`} onClick={() => setRangeDays(d)}>{d}d</span>)}
          </div>
          <button className="btn" onClick={refetch}><Icons.Refresh /></button>
        </div>
      </div>

      {loading && <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Loading…</div>}
      {error && <div style={{padding:'20px',color:'var(--danger)'}}>{error}</div>}

      {!loading && !error && stats && (<>
        <div className="stat-grid" style={{marginBottom:'20px'}}>
          <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value">{stats.totalUsers}</div></div>
          <div className="stat-card"><div className="stat-label">Active Users ({rangeDays}d)</div><div className="stat-value" style={{color:'#5ee09a'}}>{stats.activeUsers}</div><div className="stat-sub">Logged-in users who visited</div></div>
          <div className="stat-card"><div className="stat-label">Unique Visitors ({rangeDays}d)</div><div className="stat-value">{stats.uniqueVisitors}</div><div className="stat-sub">All visitors incl. anonymous</div></div>
          <div className="stat-card"><div className="stat-label">Churned</div><div className="stat-value" style={{color:'var(--text-muted)'}}>{stats.churned}</div></div>
          <div className="stat-card"><div className="stat-label">Avg Party Size</div><div className="stat-value">{stats.avgPartySize}</div></div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          {/* Funnel */}
          <div className="card">
            <div className="card-header"><h2>User Funnel</h2></div>
            <div className="card-body">
              {[
                { label: 'Signed Up', value: stats.totalUsers, pct: 100 },
                { label: 'Created a Character', value: stats.withChar, pct: stats.totalUsers ? Math.round(stats.withChar / stats.totalUsers * 100) : 0 },
                { label: 'Started a Campaign', value: stats.withCamp, pct: stats.totalUsers ? Math.round(stats.withCamp / stats.totalUsers * 100) : 0 },
                { label: 'Both', value: stats.withBoth, pct: stats.totalUsers ? Math.round(stats.withBoth / stats.totalUsers * 100) : 0 },
              ].map((step, i) => (
                <div key={i} style={{marginBottom:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',marginBottom:'4px'}}>
                    <span>{step.label}</span>
                    <span style={{color:'var(--accent)'}}>{step.value} ({step.pct}%)</span>
                  </div>
                  <div style={{height:'8px',background:'rgba(255,255,255,0.04)',borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:'100%',width:step.pct+'%',background:'var(--accent)',borderRadius:4,transition:'width .3s'}} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Systems */}
          <div className="card">
            <div className="card-header"><h2>Campaign Systems</h2></div>
            <div className="card-body">
              {Object.entries(stats.systemCounts).sort((a,b) => b[1]-a[1]).map(([sys, count]) => (
                <div key={sys} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border-mid)',fontSize:'13px'}}>
                  <span style={{fontWeight:600}}>{sys}</span>
                  <span style={{color:'var(--text-muted)'}}>{count} campaigns</span>
                </div>
              ))}
              {Object.keys(stats.systemCounts).length === 0 && <div style={{color:'var(--text-muted)',fontSize:'13px',padding:'16px 0',textAlign:'center'}}>No campaigns yet.</div>}
            </div>
          </div>

          {/* Sign-ups chart */}
          <div className="card">
            <div className="card-header"><h2>Sign-ups by Day</h2></div>
            <div className="card-body" style={{maxHeight:'220px',overflowY:'auto'}}>
              {stats.recentSignups.map(([day, count]) => (
                <div key={day} style={{display:'flex',alignItems:'center',gap:'8px',padding:'3px 0',fontSize:'12px'}}>
                  <span style={{width:'80px',color:'var(--text-muted)',flexShrink:0}}>{day.slice(5)}</span>
                  <div style={{flex:1,height:'6px',background:'rgba(255,255,255,0.04)',borderRadius:3}}>
                    <div style={{height:'100%',width:Math.max(2, count/stats.maxSignup*100)+'%',background:'var(--accent)',borderRadius:3}} />
                  </div>
                  <span style={{width:'24px',textAlign:'right',color:'var(--text-muted)'}}>{count}</span>
                </div>
              ))}
              {stats.recentSignups.length === 0 && <div style={{color:'var(--text-muted)',fontSize:'13px',padding:'16px 0',textAlign:'center'}}>No sign-ups in range.</div>}
            </div>
          </div>

          {/* Feature usage */}
          <div className="card">
            <div className="card-header"><h2>Feature Usage (Top Pages)</h2></div>
            <div className="card-body">
              {stats.featurePages.map(([page, count], i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border-mid)',fontSize:'12px'}}>
                  <span className="mono" style={{maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{page}</span>
                  <span style={{fontWeight:600}}>{count}</span>
                </div>
              ))}
              {stats.featurePages.length === 0 && <div style={{color:'var(--text-muted)',fontSize:'13px',padding:'16px 0',textAlign:'center'}}>No visit data.</div>}
            </div>
          </div>

          {/* Retention cohorts */}
          <div className="card" style={{gridColumn:'1 / -1'}}>
            <div className="card-header"><h2>Retention by Sign-up Cohort</h2></div>
            <table className="data-table">
              <thead><tr><th>Week of</th><th>Signed Up</th><th>Active ({rangeDays}d)</th><th>Retention</th><th></th></tr></thead>
              <tbody>{stats.cohortList.map(c => {
                const pct = c.total > 0 ? Math.round(c.active / c.total * 100) : 0;
                return (
                  <tr key={c.week}>
                    <td style={{fontWeight:600}}>{c.week}</td>
                    <td>{c.total}</td>
                    <td>{c.active}</td>
                    <td style={{color: pct >= 50 ? '#5ee09a' : pct >= 25 ? 'var(--accent)' : '#ef4444'}}>{pct}%</td>
                    <td style={{width:'120px'}}><div style={{height:'6px',background:'rgba(255,255,255,0.04)',borderRadius:3}}><div style={{height:'100%',width:pct+'%',background: pct >= 50 ? '#5ee09a' : pct >= 25 ? 'var(--accent)' : '#ef4444',borderRadius:3}} /></div></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      </>)}
    </div>
  );
}

// ═══════════════════════════════
// AUDIT LOG PAGE
// ═══════════════════════════════
function AuditLogPage() {
  const [filterAction, setFilterAction] = useState('all');
  const [filterTarget, setFilterTarget] = useState('all');
  const [search, setSearch] = useState('');

  const { data: logs, loading, error, refetch } = useAdminQuery(async (db) => {
    const { data, error } = await db
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data || [];
  });

  const actionTypes = useMemo(() => {
    if (!logs) return [];
    return [...new Set(logs.map(l => l.action))].sort();
  }, [logs]);
  const targetTypes = useMemo(() => {
    if (!logs) return [];
    return [...new Set(logs.map(l => l.target_type).filter(Boolean))].sort();
  }, [logs]);

  const filtered = (logs || []).filter(l => {
    if (filterAction !== 'all' && l.action !== filterAction) return false;
    if (filterTarget !== 'all' && l.target_type !== filterTarget) return false;
    if (search) {
      const q = search.toLowerCase();
      return (l.action || '').toLowerCase().includes(q) ||
             (l.admin_email || '').toLowerCase().includes(q) ||
             (l.target_id || '').toLowerCase().includes(q) ||
             JSON.stringify(l.details || {}).toLowerCase().includes(q);
    }
    return true;
  });

  const actionColor = (action) => {
    if (action.includes('delete')) return '#ef4444';
    if (action.includes('ban')) return '#ef4444';
    if (action.includes('flag')) return '#f59e0b';
    if (action.includes('grant') || action.includes('create')) return '#5ee09a';
    return 'var(--accent)';
  };

  if (loading) return <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Loading…</div>;
  if (error) return <div style={{padding:'40px',color:'var(--danger)'}}>{error}</div>;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Audit Log</h1>
        <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
      </div>

      <div style={{display:'flex',gap:'12px',marginBottom:'20px',flexWrap:'wrap',alignItems:'center'}}>
        <div className="search-bar" style={{maxWidth:'300px'}}>
          <Icons.Search />
          <input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)} style={{padding:'8px 12px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'12px',fontFamily:'Spectral,serif'}}>
          <option value="all">All Actions</option>
          {actionTypes.map(a => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={filterTarget} onChange={e => setFilterTarget(e.target.value)} style={{padding:'8px 12px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'12px',fontFamily:'Spectral,serif'}}>
          <option value="all">All Targets</option>
          {targetTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{filtered.length} entries</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><Icons.ClipboardList /><p>No audit log entries yet. Actions will appear here as you moderate content.</p></div>
      ) : (
        <div className="card" style={{overflow:'hidden'}}>
          <table className="data-table">
            <thead><tr><th>Time</th><th>Admin</th><th>Action</th><th>Target</th><th>Details</th></tr></thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td style={{whiteSpace:'nowrap',fontSize:'11px'}}>{formatDateTime(l.created_at)}</td>
                  <td style={{fontSize:'12px'}}>{l.admin_email ? l.admin_email.split('@')[0] : '—'}</td>
                  <td><span style={{padding:'2px 8px',borderRadius:'10px',fontSize:'11px',background:`${actionColor(l.action)}18`,color:actionColor(l.action),fontWeight:600}}>{l.action.replace(/_/g, ' ')}</span></td>
                  <td style={{fontSize:'12px'}}>{l.target_type ? <span>{l.target_type} <span className="mono" style={{fontSize:'10px',color:'var(--text-faint)'}}>{(l.target_id || '').slice(0, 8)}</span></span> : '—'}</td>
                  <td style={{fontSize:'11px',color:'var(--text-muted)',maxWidth:'250px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.details && Object.keys(l.details).length > 0 ? Object.entries(l.details).map(([k,v]) => `${k}: ${v}`).join(', ') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════
// ANNOUNCEMENTS PAGE
// ═══════════════════════════════
function AnnouncementsPage({ addToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', dismissible: true, starts_at: '', expires_at: '', show_on: '' });

  const { data: announcements, loading, error, refetch } = useAdminQuery(async (db) => {
    const { data, error } = await db
      .from('site_announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  });

  function resetForm() {
    setForm({ title: '', message: '', type: 'info', dismissible: true, starts_at: '', expires_at: '', show_on: '' });
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(a) {
    setForm({
      title: a.title || '', message: a.message || '', type: a.type || 'info',
      dismissible: a.dismissible !== false, starts_at: a.starts_at ? a.starts_at.slice(0, 16) : '',
      expires_at: a.expires_at ? a.expires_at.slice(0, 16) : '',
      show_on: (a.show_on || []).join(', '),
    });
    setEditing(a);
    setShowForm(true);
  }

  async function saveAnnouncement() {
    if (!form.title.trim() || !form.message.trim()) { addToast('Title and message are required.', 'error'); return; }
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type,
      dismissible: form.dismissible,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : new Date().toISOString(),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      show_on: form.show_on ? form.show_on.split(',').map(s => s.trim()).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error } = await sb.from('site_announcements').update(payload).eq('id', editing.id);
      if (error) { addToast('Update failed. Please try again.', 'error'); return; }
      logAuditEvent('update_announcement', 'announcement', editing.id, { title: payload.title });
      addToast('Announcement updated.', 'success');
    } else {
      const { data: sess } = await sb.auth.getSession();
      payload.created_by = sess?.session?.user?.id || null;
      payload.is_active = true;
      const { error } = await sb.from('site_announcements').insert(payload);
      if (error) { addToast('Create failed. Please try again.', 'error'); return; }
      logAuditEvent('create_announcement', 'announcement', null, { title: payload.title });
      addToast('Announcement created.', 'success');
    }
    resetForm();
    refetch();
  }

  async function toggleActive(a) {
    const next = !a.is_active;
    const { error } = await sb.from('site_announcements').update({ is_active: next, updated_at: new Date().toISOString() }).eq('id', a.id);
    if (error) { addToast('Update failed. Please try again.', 'error'); return; }
    logAuditEvent(next ? 'activate_announcement' : 'deactivate_announcement', 'announcement', a.id, { title: a.title });
    addToast(next ? 'Announcement activated.' : 'Announcement deactivated.', 'success');
    refetch();
  }

  async function deleteAnnouncement(a) {
    if (!confirm('Delete this announcement permanently?')) return;
    const { error } = await sb.from('site_announcements').delete().eq('id', a.id);
    if (error) { addToast('Delete failed. Please try again.', 'error'); return; }
    logAuditEvent('delete_announcement', 'announcement', a.id, { title: a.title });
    addToast('Announcement deleted.', 'success');
    refetch();
  }

  const typeColors = { info: '#58aaff', warning: '#f59e0b', success: '#5ee09a', danger: '#ef4444' };

  if (loading) return <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Loading…</div>;
  if (error) return <div style={{padding:'40px',color:'var(--danger)'}}>{error}</div>;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Announcements</h1>
        <div className="btn-group">
          <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}><Icons.Plus /> New Announcement</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{marginBottom:'24px'}}>
          <div className="card-header"><h2>{editing ? 'Edit Announcement' : 'New Announcement'}</h2></div>
          <div className="card-body" style={{display:'grid',gap:'14px'}}>
            <div>
              <label style={{fontSize:'11px',fontFamily:'Cinzel,serif',letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Title</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Scheduled Maintenance" style={{width:'100%',padding:'8px 12px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'13px'}} />
            </div>
            <div>
              <label style={{fontSize:'11px',fontFamily:'Cinzel,serif',letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Message</label>
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="We'll be performing maintenance from 2-4 AM EST." rows={3} style={{width:'100%',padding:'8px 12px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'13px',resize:'vertical'}} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'12px'}}>
              <div>
                <label style={{fontSize:'11px',fontFamily:'Cinzel,serif',letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{width:'100%',padding:'8px 12px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'12px'}}>
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Warning (Yellow)</option>
                  <option value="success">Success (Green)</option>
                  <option value="danger">Danger (Red)</option>
                </select>
              </div>
              <div>
                <label style={{fontSize:'11px',fontFamily:'Cinzel,serif',letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Starts At</label>
                <input type="datetime-local" value={form.starts_at} onChange={e => setForm({...form, starts_at: e.target.value})} style={{width:'100%',padding:'8px 12px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'12px'}} />
              </div>
              <div>
                <label style={{fontSize:'11px',fontFamily:'Cinzel,serif',letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Expires At</label>
                <input type="datetime-local" value={form.expires_at} onChange={e => setForm({...form, expires_at: e.target.value})} style={{width:'100%',padding:'8px 12px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'12px'}} />
              </div>
              <div style={{display:'flex',alignItems:'flex-end',paddingBottom:'4px'}}>
                <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',cursor:'pointer'}}>
                  <input type="checkbox" checked={form.dismissible} onChange={e => setForm({...form, dismissible: e.target.checked})} /> Dismissible
                </label>
              </div>
            </div>
            <div>
              <label style={{fontSize:'11px',fontFamily:'Cinzel,serif',letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Show On Pages (comma-separated, blank = all)</label>
              <input value={form.show_on} onChange={e => setForm({...form, show_on: e.target.value})} placeholder="/character-builder.html, /campaigns.html" style={{width:'100%',padding:'8px 12px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'13px'}} />
            </div>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={saveAnnouncement}>{editing ? 'Update' : 'Create'}</button>
              <button className="btn" onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {(announcements || []).length === 0 ? (
        <div className="empty-state"><Icons.Bell /><p>No announcements yet. Create one to display a banner across your site.</p></div>
      ) : (
        <div style={{display:'grid',gap:'12px'}}>
          {(announcements || []).map(a => (
            <div key={a.id} className="card" style={{opacity: a.is_active ? 1 : 0.5}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px',borderBottom:'1px solid var(--border-mid)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background: a.is_active ? '#5ee09a' : 'var(--text-faint)'}} />
                  <div>
                    <div style={{fontSize:'14px',fontWeight:600}}>{a.title}</div>
                    <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>{a.message.length > 120 ? a.message.slice(0, 120) + '…' : a.message}</div>
                  </div>
                </div>
                <div className="btn-group">
                  <span style={{padding:'3px 10px',borderRadius:'10px',fontSize:'10px',fontWeight:600,color:typeColors[a.type] || '#58aaff',background:`${typeColors[a.type] || '#58aaff'}18`}}>{a.type}</span>
                  <button className="btn btn-sm" onClick={() => toggleActive(a)}>{a.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button className="btn btn-sm" onClick={() => startEdit(a)}><Icons.Settings /></button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteAnnouncement(a)}><Icons.Trash /></button>
                </div>
              </div>
              <div style={{padding:'10px 20px',fontSize:'11px',color:'var(--text-faint)',display:'flex',gap:'16px'}}>
                <span>Created: {formatDateTime(a.created_at)}</span>
                {a.expires_at && <span>Expires: {formatDateTime(a.expires_at)}</span>}
                {a.show_on && a.show_on.length > 0 && <span>Pages: {a.show_on.join(', ')}</span>}
                <span>{a.dismissible ? 'Dismissible' : 'Persistent'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════
// DATA EXPORT PAGE
// ═══════════════════════════════
function DataExportPage({ addToast }) {
  const [exporting, setExporting] = useState(null);

  function toCSV(data, columns) {
    if (!data || data.length === 0) return '';
    const header = columns.map(c => c.label || c.key).join(',');
    const rows = data.map(row => columns.map(c => {
      let val = c.key.includes('.') ? c.key.split('.').reduce((o, k) => (o || {})[k], row) : row[c.key];
      if (val === null || val === undefined) val = '';
      if (typeof val === 'object') val = JSON.stringify(val);
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(','));
    return header + '\n' + rows.join('\n');
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  async function exportData(type) {
    if (!sb) { addToast('Supabase not configured.', 'error'); return; }
    setExporting(type);
    try {
      let csv, filename;
      const timestamp = new Date().toISOString().slice(0, 10);
      switch (type) {
        case 'users': {
          const { data, error } = await sb.from('profiles').select('id, name, email, is_admin, is_superuser, is_banned, is_beta_user, admin_notes, tags, created_at').order('created_at', { ascending: false }).limit(10000);
          if (error) throw error;
          csv = toCSV(data, [
            { key: 'id', label: 'User ID' }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
            { key: 'is_admin', label: 'Admin' }, { key: 'is_superuser', label: 'Superuser' }, { key: 'is_banned', label: 'Banned' },
            { key: 'is_beta_user', label: 'Beta User' }, { key: 'admin_notes', label: 'Notes' }, { key: 'tags', label: 'Tags' }, { key: 'created_at', label: 'Joined' },
          ]);
          filename = `phmurt-users-${timestamp}.csv`;
          break;
        }
        case 'characters': {
          const { data, error } = await sb.from('characters').select('id, owner_id, name, race, class, level, builder_type, flagged, flag_reason, created_at, updated_at').order('updated_at', { ascending: false }).limit(10000);
          if (error) throw error;
          csv = toCSV(data, [
            { key: 'id', label: 'Character ID' }, { key: 'owner_id', label: 'Owner ID' }, { key: 'name', label: 'Name' },
            { key: 'race', label: 'Race' }, { key: 'class', label: 'Class' }, { key: 'level', label: 'Level' },
            { key: 'builder_type', label: 'Builder' }, { key: 'flagged', label: 'Flagged' }, { key: 'flag_reason', label: 'Flag Reason' },
            { key: 'created_at', label: 'Created' }, { key: 'updated_at', label: 'Updated' },
          ]);
          filename = `phmurt-characters-${timestamp}.csv`;
          break;
        }
        case 'campaigns': {
          const { data, error } = await sb.from('campaigns').select('id, owner_id, name, system, flagged, flag_reason, created_at, updated_at').order('updated_at', { ascending: false }).limit(10000);
          if (error) throw error;
          csv = toCSV(data, [
            { key: 'id', label: 'Campaign ID' }, { key: 'owner_id', label: 'Owner ID' }, { key: 'name', label: 'Name' },
            { key: 'system', label: 'System' }, { key: 'flagged', label: 'Flagged' }, { key: 'flag_reason', label: 'Flag Reason' },
            { key: 'created_at', label: 'Created' }, { key: 'updated_at', label: 'Updated' },
          ]);
          filename = `phmurt-campaigns-${timestamp}.csv`;
          break;
        }
        case 'audit': {
          const { data, error } = await sb.from('admin_audit_log').select('*').order('created_at', { ascending: false }).limit(10000);
          if (error) throw error;
          csv = toCSV(data, [
            { key: 'id', label: 'ID' }, { key: 'admin_email', label: 'Admin' }, { key: 'action', label: 'Action' },
            { key: 'target_type', label: 'Target Type' }, { key: 'target_id', label: 'Target ID' },
            { key: 'details', label: 'Details' }, { key: 'created_at', label: 'Time' },
          ]);
          filename = `phmurt-audit-log-${timestamp}.csv`;
          break;
        }
        case 'errors': {
          const { data, error } = await sb.from('site_errors').select('*').order('created_at', { ascending: false }).limit(10000);
          if (error) throw error;
          csv = toCSV(data, [
            { key: 'id', label: 'ID' }, { key: 'message', label: 'Error' }, { key: 'page', label: 'Page' },
            { key: 'user_agent', label: 'Browser' }, { key: 'user_id', label: 'User ID' }, { key: 'created_at', label: 'Time' },
          ]);
          filename = `phmurt-errors-${timestamp}.csv`;
          break;
        }
        case 'visits': {
          const { data, error } = await sb.from('site_visits').select('*').order('visited_at', { ascending: false }).limit(10000);
          if (error) throw error;
          csv = toCSV(data, [
            { key: 'id', label: 'ID' }, { key: 'page', label: 'Page' }, { key: 'user_id', label: 'User ID' }, { key: 'visited_at', label: 'Visited At' },
          ]);
          filename = `phmurt-visits-${timestamp}.csv`;
          break;
        }
        default: throw new Error('Unknown export type');
      }
      downloadCSV(csv, filename);
      logAuditEvent('export_data', type, null, { filename });
      addToast(`Exported ${type} data.`, 'success');
    } catch (e) {
      addToast('Export failed: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setExporting(null);
    }
  }

  const exports = [
    { type: 'users',      label: 'Users',        desc: 'All registered user profiles (ID, name, email, status, join date)',           icon: Icons.Users },
    { type: 'characters', label: 'Characters',    desc: 'All character sheets (ID, owner, name, race, class, level, flags)',          icon: Icons.Keys },
    { type: 'campaigns',  label: 'Campaigns',     desc: 'All campaigns (ID, owner, name, system, flags)',                             icon: Icons.Tenants },
    { type: 'audit',      label: 'Audit Log',     desc: 'Admin action history (who did what, when)',                                   icon: Icons.ClipboardList },
    { type: 'errors',     label: 'Error Log',     desc: 'Client-side JavaScript errors (message, page, browser, user)',                icon: Icons.X },
    { type: 'visits',     label: 'Site Visits',   desc: 'Page visit records (page, user, timestamp)',                                  icon: Icons.RateLimit },
  ];

  return (
    <div>
      <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px',marginBottom:'24px'}}>Data Export</h1>
      <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'24px',lineHeight:1.6}}>
        Export your site data as CSV files. Exports are limited to the most recent 10,000 records per table.
      </p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        {exports.map(exp => {
          const Icon = exp.icon;
          return (
            <div key={exp.type} className="card">
              <div className="card-body" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'8px',background:'var(--accent-soft)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent)'}}><Icon /></div>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:600}}>{exp.label}</div>
                    <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>{exp.desc}</div>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => exportData(exp.type)} disabled={exporting === exp.type} style={{minWidth:'100px'}}>
                  {exporting === exp.type ? 'Exporting…' : <><Icons.Download /> Export</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════
// FEATURE FLAGS & MAINTENANCE MODE PAGE
// ═══════════════════════════════
// ═══════════════════════════════
// TIER MANAGEMENT PAGE
// ═══════════════════════════════
function TierManagementPage({ addToast }) {
  const [saving, setSaving] = useState(false);
  const [editingList, setEditingList] = useState(null); // 'free_features'|'free_locked'|'pro_features'|'free_feature_keys'
  const [editListValue, setEditListValue] = useState('');

  // All tier-related site_settings keys
  const tierKeys = [
    'free_max_characters', 'free_max_campaigns',
    'paid_max_characters', 'paid_max_campaigns',
    'pro_price_monthly', 'pro_price_yearly', 'pro_price_yearly_savings',
    'free_tier_features', 'free_tier_locked', 'pro_tier_features',
    'free_feature_keys',
  ];

  const { data: settings, loading, error, refetch } = useAdminQuery(async (db) => {
    const { data, error } = await db
      .from('site_settings')
      .select('*')
      .in('key', tierKeys);
    if (error) throw error;
    // Build map
    const map = {};
    (data || []).forEach(s => {
      try { map[s.key] = JSON.parse(s.value); } catch { map[s.key] = s.value; }
    });
    return map;
  });

  const s = settings || {};

  // Defaults for display
  const freeMaxChars = s.free_max_characters ?? 3;
  const freeMaxCamps = s.free_max_campaigns ?? 1;
  const paidMaxChars = s.paid_max_characters ?? -1;
  const paidMaxCamps = s.paid_max_campaigns ?? -1;
  const priceMonthly = s.pro_price_monthly ?? '$4.99/mo';
  const priceYearly = s.pro_price_yearly ?? '$49.99/yr';
  const yearlySavings = s.pro_price_yearly_savings ?? 'Save $10';
  const freeFeatures = s.free_tier_features || ['Character Builder (5e & 3.5e)','Interactive Character Sheets','Dice Roller','Learn to Play Guides','Art Gallery','Basic Campaign Management'];
  const freeLocked = s.free_tier_locked || ['Unlimited Characters & Campaigns','Generators (Names, Loot, Encounters, Quests)','Advanced Campaign Tabs (Heist, Intrigue, Prophecy, Puzzles)','Downtime & Religion Systems','Hexcrawl & World Atlas','Economy & Faction War Engines','Battle Map & Living World','Priority Support'];
  const proFeatures = s.pro_tier_features || ['Everything in Free, plus:','Unlimited Characters & Campaigns','All Generators','All Campaign Systems','All World-Building Tools','Priority Support'];
  const freeFeatureKeys = s.free_feature_keys || ['character-builder','character-sheet','dice-roller','basic-campaign','learn','gallery'];

  async function updateSetting(key, value) {
    setSaving(true);
    try {
      const { data: sess } = await sb.auth.getSession();
      const { error } = await sb.from('site_settings').upsert({
        key,
        value: JSON.stringify(value),
        updated_by: sess?.session?.user?.id || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
      if (error) throw error;
      logAuditEvent('update_tier_setting', 'setting', key, { new_value: value });
      addToast(`Updated ${key.replace(/_/g, ' ')}`, 'success');
      refetch();
    } catch (e) {
      addToast('Failed: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setSaving(false);
    }
  }

  function startEditList(key, currentValue) {
    setEditingList(key);
    setEditListValue(Array.isArray(currentValue) ? currentValue.join('\n') : '');
  }

  function saveEditList(key) {
    const items = editListValue.split('\n').map(s => s.trim()).filter(Boolean);
    updateSetting(key, items);
    setEditingList(null);
  }

  // Number input with inline save
  function NumberField({ label, description, settingKey, value, unit }) {
    const [val, setVal] = useState(String(value));
    const [dirty, setDirty] = useState(false);
    useEffect(() => { setVal(String(value)); setDirty(false); }, [value]);
    return (
      <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border-mid)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'13px',fontWeight:600}}>{label}</div>
            <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>{description}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <input
              type="number"
              value={val}
              onChange={e => { setVal(e.target.value); setDirty(true); }}
              onKeyDown={e => { if (e.key === 'Enter' && dirty) { updateSetting(settingKey, Number(val)); setDirty(false); } }}
              style={{width:'80px',padding:'6px 10px',background:'var(--bg-card)',border:'1px solid var(--accent-border)',borderRadius:'4px',color:'var(--text)',fontSize:'13px',textAlign:'center'}}
            />
            {unit && <span style={{fontSize:'11px',color:'var(--text-muted)'}}>{unit}</span>}
            {dirty && <button className="btn btn-sm btn-primary" onClick={() => { updateSetting(settingKey, Number(val)); setDirty(false); }} disabled={saving}>Save</button>}
          </div>
        </div>
      </div>
    );
  }

  // Text input with inline save
  function TextField({ label, description, settingKey, value }) {
    const [val, setVal] = useState(value);
    const [dirty, setDirty] = useState(false);
    useEffect(() => { setVal(value); setDirty(false); }, [value]);
    return (
      <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border-mid)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{flex:1,marginRight:'16px'}}>
            <div style={{fontSize:'13px',fontWeight:600}}>{label}</div>
            <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>{description}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <input
              type="text"
              value={val}
              onChange={e => { setVal(e.target.value); setDirty(true); }}
              onKeyDown={e => { if (e.key === 'Enter' && dirty) { updateSetting(settingKey, val); setDirty(false); } }}
              style={{width:'160px',padding:'6px 10px',background:'var(--bg-card)',border:'1px solid var(--accent-border)',borderRadius:'4px',color:'var(--text)',fontSize:'13px'}}
            />
            {dirty && <button className="btn btn-sm btn-primary" onClick={() => { updateSetting(settingKey, val); setDirty(false); }} disabled={saving}>Save</button>}
          </div>
        </div>
      </div>
    );
  }

  // List editor component
  function ListSection({ title, description, settingKey, items }) {
    const isEditing = editingList === settingKey;
    return (
      <div style={{marginBottom:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px',padding:'0 4px'}}>
          <div>
            <div style={{fontSize:'13px',fontWeight:600}}>{title}</div>
            <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>{description}</div>
          </div>
          <button className="btn btn-sm" onClick={() => isEditing ? saveEditList(settingKey) : startEditList(settingKey, items)} disabled={saving}>
            {isEditing ? <><Icons.Check /> Save</> : 'Edit'}
          </button>
        </div>
        {isEditing ? (
          <textarea
            value={editListValue}
            onChange={e => setEditListValue(e.target.value)}
            rows={Math.max(4, items.length + 1)}
            style={{width:'100%',padding:'10px 12px',background:'var(--bg-card)',border:'1px solid var(--accent-border)',borderRadius:'6px',color:'var(--text)',fontSize:'12px',lineHeight:1.8,fontFamily:'Spectral, serif',resize:'vertical'}}
            placeholder="One item per line"
          />
        ) : (
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid var(--border-mid)',borderRadius:'6px',padding:'10px 14px'}}>
            {items.map((item, i) => (
              <div key={i} style={{padding:'4px 0',fontSize:'12px',color:'var(--text-dim)',display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{color:'var(--crimson, #d4433a)',fontSize:'8px'}}>&#9670;</span> {item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Loading…</div>;
  if (error) return <div style={{padding:'40px',color:'var(--danger)'}}>{error}</div>;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Tier Management</h1>
        <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
      </div>

      {/* Overview Cards */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
        <div className="stat-card" style={{borderLeft:'3px solid var(--text-muted)'}}>
          <div className="stat-label">Free Tier</div>
          <div className="stat-value" style={{fontSize:'18px'}}>{freeMaxChars} chars / {freeMaxCamps} camp</div>
          <div className="stat-sub">{freeFeatures.length} features included</div>
        </div>
        <div className="stat-card" style={{borderLeft:'3px solid var(--crimson, #d4433a)'}}>
          <div className="stat-label">Pro Tier</div>
          <div className="stat-value" style={{fontSize:'18px'}}>{paidMaxChars < 0 ? 'Unlimited' : paidMaxChars}</div>
          <div className="stat-sub">{priceMonthly} · {priceYearly}</div>
        </div>
      </div>

      {/* Limits Section */}
      <div className="card" style={{marginBottom:'20px'}}>
        <div className="card-header" style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{color:'#f59e0b'}}><Icons.Shield /></div>
          <h2 style={{color:'#f59e0b'}}>Limits</h2>
        </div>
        <div className="card-body" style={{padding:0}}>
          <div style={{padding:'10px 20px 6px',fontSize:'11px',fontFamily:'Cinzel,serif',letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',borderBottom:'1px solid var(--border-mid)'}}>Free Tier</div>
          <NumberField label="Max Characters" description="Maximum characters a free user can create (-1 = unlimited)" settingKey="free_max_characters" value={freeMaxChars} />
          <NumberField label="Max Campaigns" description="Maximum campaigns a free user can create (-1 = unlimited)" settingKey="free_max_campaigns" value={freeMaxCamps} />
          <div style={{padding:'10px 20px 6px',fontSize:'11px',fontFamily:'Cinzel,serif',letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',borderBottom:'1px solid var(--border-mid)'}}>Pro Tier</div>
          <NumberField label="Max Characters" description="Maximum characters a Pro user can create (-1 = unlimited)" settingKey="paid_max_characters" value={paidMaxChars} />
          <NumberField label="Max Campaigns" description="Maximum campaigns a Pro user can create (-1 = unlimited)" settingKey="paid_max_campaigns" value={paidMaxCamps} />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="card" style={{marginBottom:'20px'}}>
        <div className="card-header" style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{color:'#5ee09a'}}><Icons.Shield /></div>
          <h2 style={{color:'#5ee09a'}}>Pricing Display</h2>
        </div>
        <div className="card-body" style={{padding:0}}>
          <TextField label="Monthly Price" description="Displayed on upgrade modals and pricing page (e.g. $4.99/mo)" settingKey="pro_price_monthly" value={priceMonthly} />
          <TextField label="Yearly Price" description="Displayed on upgrade modals and pricing page (e.g. $49.99/yr)" settingKey="pro_price_yearly" value={priceYearly} />
          <TextField label="Yearly Savings Label" description="Savings message shown below pricing buttons (e.g. Save $10)" settingKey="pro_price_yearly_savings" value={yearlySavings} />
        </div>
        <div style={{padding:'12px 20px',background:'rgba(255,255,255,0.015)',borderTop:'1px solid var(--border-mid)',fontSize:'11px',color:'var(--text-faint)'}}>
          These are display values only. Actual charge amounts are set in your Stripe dashboard.
        </div>
      </div>

      {/* Free Tier Features */}
      <div className="card" style={{marginBottom:'20px'}}>
        <div className="card-header" style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{color:'var(--text-muted)'}}><Icons.Sliders /></div>
          <h2>Free Tier</h2>
        </div>
        <div className="card-body">
          <ListSection title="Included Features" description="Feature list shown on the pricing page for the Free tier" settingKey="free_tier_features" items={freeFeatures} />
          <ListSection title="Locked Features" description="Features shown as locked/unavailable to free users (upsell list)" settingKey="free_tier_locked" items={freeLocked} />
          <ListSection title="Feature Gate Keys" description="Internal feature keys that free users can access (used by PhmurtGate). Add keys like 'generators' to unlock them for free users." settingKey="free_feature_keys" items={freeFeatureKeys} />
        </div>
      </div>

      {/* Pro Tier Features */}
      <div className="card" style={{marginBottom:'20px'}}>
        <div className="card-header" style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{color:'var(--crimson, #d4433a)'}}><Icons.Crown /></div>
          <h2 style={{color:'var(--crimson, #d4433a)'}}>Pro Tier</h2>
        </div>
        <div className="card-body">
          <ListSection title="Pro Features" description="Feature list shown on the pricing page for the Pro tier" settingKey="pro_tier_features" items={proFeatures} />
        </div>
      </div>

      {/* Info box */}
      <div className="card">
        <div className="card-body" style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:1.7}}>
          <strong style={{color:'var(--text-dim)'}}>How it works:</strong> Limits are enforced in real-time — when a user saves, phmurt-auth.js reads these values from the database. Feature gate keys control which features are accessible to free users via <code style={{background:'rgba(255,255,255,0.06)',padding:'1px 5px',borderRadius:'3px',fontSize:'11px'}}>PhmurtGate(featureName)</code>. Feature and locked lists are display-only for the pricing page and upgrade modals. Changes take effect on the next page load.
        </div>
      </div>
    </div>
  );
}

function FeatureFlagsPage({ addToast, viewer }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [confirmMaintenance, setConfirmMaintenance] = useState(false);

  const { data: settings, loading, error, refetch } = useAdminQuery(async (db) => {
    const { data, error } = await db
      .from('site_settings')
      .select('*')
      .order('category')
      .order('key');
    if (error) throw error;
    return data || [];
  });

  const categories = useMemo(() => {
    if (!settings) return [];
    return [...new Set(settings.map(s => s.category))].sort();
  }, [settings]);

  const filtered = (settings || []).filter(s => filterCat === 'all' || s.category === filterCat);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(s => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [filtered]);

  const catLabels = {
    maintenance: 'Maintenance Mode',
    features: 'Feature Flags',
    beta: 'Beta Features',
    limits: 'Rate Limits & Guardrails',
    general: 'General Settings',
  };
  const catIcons = {
    maintenance: Icons.Tool,
    features: Icons.Sliders,
    beta: Icons.Flag,
    limits: Icons.Shield,
    general: Icons.Settings,
  };
  const catColors = {
    maintenance: '#ef4444',
    features: '#58aaff',
    beta: '#a78bfa',
    limits: '#f59e0b',
    general: 'var(--accent)',
  };

  function parseValue(raw) {
    try { return JSON.parse(raw); } catch { return raw; }
  }

  async function toggleBoolean(setting) {
    const current = parseValue(setting.value);
    const next = !current;

    // Maintenance mode requires confirmation
    if (setting.key === 'maintenance_mode' && next && !confirmMaintenance) {
      setConfirmMaintenance(true);
      return;
    }
    setConfirmMaintenance(false);

    const { data: sess } = await sb.auth.getSession();
    const { error } = await sb.from('site_settings').update({
      value: JSON.stringify(next),
      updated_by: sess?.session?.user?.id || null,
      updated_at: new Date().toISOString(),
    }).eq('key', setting.key);
    if (error) { addToast('Update failed. Please try again.', 'error'); return; }
    logAuditEvent('toggle_setting', 'setting', setting.key, { old_value: current, new_value: next, label: setting.label });
    addToast(`${setting.label}: ${next ? 'ON' : 'OFF'}`, next ? 'success' : 'info');
    refetch();
  }

  async function saveEditValue(setting) {
    let parsed;
    try {
      if (setting.data_type === 'number') parsed = Number(editValue);
      else if (setting.data_type === 'json') parsed = JSON.parse(editValue);
      else parsed = editValue;
    } catch {
      addToast('Invalid value format.', 'error'); return;
    }

    const { data: sess } = await sb.auth.getSession();
    const { error } = await sb.from('site_settings').update({
      value: JSON.stringify(parsed),
      updated_by: sess?.session?.user?.id || null,
      updated_at: new Date().toISOString(),
    }).eq('key', setting.key);
    if (error) { addToast('Update failed. Please try again.', 'error'); return; }
    logAuditEvent('update_setting', 'setting', setting.key, { old_value: parseValue(setting.value), new_value: parsed, label: setting.label });
    addToast(`${setting.label} updated.`, 'success');
    setEditingKey(null);
    refetch();
  }

  function startEdit(s) {
    const val = parseValue(s.value);
    setEditValue(typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val));
    setEditingKey(s.key);
  }

  // Check maintenance status
  const maintenanceSetting = (settings || []).find(s => s.key === 'maintenance_mode');
  const isMaintenanceOn = maintenanceSetting && parseValue(maintenanceSetting.value) === true;

  if (loading) return <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Loading…</div>;
  if (error) return <div style={{padding:'40px',color:'var(--danger)'}}>{error}</div>;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Feature Flags & Site Config</h1>
        <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
      </div>

      {/* Maintenance Mode Banner */}
      {isMaintenanceOn && (
        <div style={{padding:'14px 20px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{fontSize:'20px'}}>⚠</div>
            <div>
              <div style={{fontSize:'14px',fontWeight:600,color:'#ef4444'}}>MAINTENANCE MODE IS ACTIVE</div>
              <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>Users cannot save data. Turn off when maintenance is complete.</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => toggleBoolean(maintenanceSetting)} style={{background:'#5ee09a',borderColor:'#5ee09a'}}>End Maintenance</button>
        </div>
      )}

      {/* Maintenance Confirmation Modal */}
      {confirmMaintenance && (
        <Modal title="Enable Maintenance Mode?" onClose={() => setConfirmMaintenance(false)} footer={
          <div className="btn-group">
            <button className="btn btn-danger" onClick={() => { setConfirmMaintenance(false); toggleBoolean(maintenanceSetting); }}>Yes, Enable Maintenance Mode</button>
            <button className="btn" onClick={() => setConfirmMaintenance(false)}>Cancel</button>
          </div>
        }>
          <div style={{fontSize:'13px',lineHeight:1.7,color:'var(--text-muted)'}}>
            <p style={{marginBottom:12}}>This will put the entire site into maintenance mode. Users will see a maintenance banner and will not be able to save characters, campaigns, or other data.</p>
            <p style={{marginBottom:12}}>Before enabling, make sure to set the <strong>Maintenance Message</strong> and optionally the <strong>Maintenance ETA</strong> so users know what's happening.</p>
            <p style={{color:'#ef4444',fontWeight:600}}>Are you sure you want to continue?</p>
          </div>
        </Modal>
      )}

      {/* Category filter pills */}
      <div className="filter-pills" style={{marginBottom:'24px'}}>
        <span className={`pill ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>All</span>
        {categories.map(cat => (
          <span key={cat} className={`pill ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)} style={filterCat === cat ? {borderColor: catColors[cat], color: catColors[cat], background: `${catColors[cat]}12`} : {}}>
            {catLabels[cat] || cat}
          </span>
        ))}
      </div>

      {/* Settings grouped by category */}
      {Object.entries(grouped).map(([category, items]) => {
        const CatIcon = catIcons[category] || Icons.Settings;
        return (
          <div key={category} className="card" style={{marginBottom:'20px'}}>
            <div className="card-header" style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{color: catColors[category] || 'var(--accent)'}}><CatIcon /></div>
              <h2 style={{color: catColors[category] || 'var(--accent)'}}>{catLabels[category] || category}</h2>
            </div>
            <div className="card-body" style={{padding:0}}>
              {items.map(s => {
                const val = parseValue(s.value);
                const isBoolean = s.data_type === 'boolean';
                const isEditing = editingKey === s.key;
                return (
                  <div key={s.key} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',borderBottom:'1px solid var(--border-mid)'}}>
                    <div style={{flex:1,marginRight:'20px'}}>
                      <div style={{fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'8px'}}>
                        {s.label || s.key}
                        {s.key === 'maintenance_mode' && val === true && <span style={{padding:'1px 8px',borderRadius:'10px',fontSize:'9px',background:'rgba(239,68,68,0.15)',color:'#ef4444',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px'}}>ACTIVE</span>}
                      </div>
                      <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>{s.description}</div>
                      <div style={{fontSize:'10px',color:'var(--text-faint)',marginTop:'4px',fontFamily:'monospace'}}>{s.key} ({s.data_type}){s.updated_at ? ` · Updated ${timeAgo(s.updated_at)}` : ''}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:'180px',justifyContent:'flex-end'}}>
                      {isBoolean ? (
                        <div
                          className={`toggle ${val ? 'on' : ''}`}
                          onClick={() => toggleBoolean(s)}
                          style={{cursor:'pointer'}}
                        />
                      ) : isEditing ? (
                        <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                          {s.data_type === 'json' ? (
                            <textarea value={editValue} onChange={e => setEditValue(e.target.value)} rows={3} style={{width:'200px',padding:'6px',background:'var(--bg-card)',border:'1px solid var(--accent-border)',borderRadius:'4px',color:'var(--text)',fontSize:'12px',fontFamily:'monospace',resize:'vertical'}} />
                          ) : (
                            <input
                              type={s.data_type === 'number' ? 'number' : 'text'}
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              style={{width:'200px',padding:'6px 10px',background:'var(--bg-card)',border:'1px solid var(--accent-border)',borderRadius:'4px',color:'var(--text)',fontSize:'12px'}}
                              onKeyDown={e => { if (e.key === 'Enter') saveEditValue(s); if (e.key === 'Escape') setEditingKey(null); }}
                              autoFocus
                            />
                          )}
                          <button className="btn btn-sm btn-primary" onClick={() => saveEditValue(s)}><Icons.Check /></button>
                          <button className="btn btn-sm" onClick={() => setEditingKey(null)}><Icons.X /></button>
                        </div>
                      ) : (
                        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                          <span className="mono" style={{fontSize:'12px',color:'var(--text-dim)',maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </span>
                          <button className="btn btn-sm" onClick={() => startEdit(s)} style={{padding:'4px 8px',fontSize:'10px'}}>Edit</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quick actions panel */}
      <div className="card">
        <div className="card-header"><h2>Quick Actions</h2></div>
        <div className="card-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}>
          <button className="btn" onClick={() => {
            const featureFlags = (settings || []).filter(s => s.category === 'features');
            featureFlags.forEach(s => {
              if (parseValue(s.value) !== true) toggleBoolean(s);
            });
          }} style={{padding:'14px',textAlign:'center'}}>
            <div style={{fontSize:'18px',marginBottom:'4px'}}>✓</div>
            <div style={{fontSize:'11px'}}>Enable All Features</div>
          </button>
          <button className="btn" onClick={() => {
            const betaFlags = (settings || []).filter(s => s.category === 'beta');
            betaFlags.forEach(s => {
              if (parseValue(s.value) !== false) toggleBoolean(s);
            });
          }} style={{padding:'14px',textAlign:'center'}}>
            <div style={{fontSize:'18px',marginBottom:'4px'}}>⨉</div>
            <div style={{fontSize:'11px'}}>Disable All Beta</div>
          </button>
          <button className="btn btn-danger" onClick={() => {
            if (maintenanceSetting && !isMaintenanceOn) toggleBoolean(maintenanceSetting);
          }} style={{padding:'14px',textAlign:'center'}} disabled={isMaintenanceOn}>
            <div style={{fontSize:'18px',marginBottom:'4px'}}>⚠</div>
            <div style={{fontSize:'11px'}}>{isMaintenanceOn ? 'Maintenance Active' : 'Emergency Maintenance'}</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════
// CLEANUP PAGE (Data Hygiene)
// ═══════════════════════════════
function CleanupPage({ addToast }) {
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [manualCounts, setManualCounts] = useState(null);

  async function loadCounts() {
    if (!sb) return;
    try {
      const [errors, visits, audit] = await Promise.all([
        sb.from('site_errors').select('id', { count: 'exact' }).limit(0),
        sb.from('site_visits').select('id', { count: 'exact' }).limit(0),
        sb.from('admin_audit_log').select('id', { count: 'exact' }).limit(0),
      ]);
      setManualCounts({
        errors: errors.count || 0,
        visits: visits.count || 0,
        audit: audit.count || 0,
      });
    } catch (e) { /* ignore */ }
  }

  useEffect(() => { loadCounts(); }, []);

  async function runCleanup() {
    if (!sb) { addToast('Supabase not configured.', 'error'); return; }
    setRunning(true);
    try {
      const { data, error } = await sb.rpc('run_admin_cleanup');
      if (error) throw error;
      setLastResult(data);
      logAuditEvent('run_cleanup', 'system', null, data);
      addToast('Cleanup complete!', 'success');
      loadCounts();
    } catch (e) {
      addToast('Cleanup failed: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px',marginBottom:'24px'}}>Data Cleanup</h1>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'24px'}}>
        <div className="stat-card">
          <div className="stat-label">Error Entries</div>
          <div className="stat-value">{manualCounts ? manualCounts.errors : '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Visit Entries</div>
          <div className="stat-value">{manualCounts ? manualCounts.visits : '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Audit Entries</div>
          <div className="stat-value">{manualCounts ? manualCounts.audit : '—'}</div>
        </div>
      </div>

      <div className="card" style={{marginBottom:'20px'}}>
        <div className="card-header"><h2>Automatic Cleanup</h2></div>
        <div className="card-body">
          <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:1.7,marginBottom:'16px'}}>
            Runs the server-side cleanup function. This deletes error log entries older than the configured retention period,
            visit log entries past retention, audit log entries older than 365 days, and deactivates expired announcements.
            Retention periods are configured in Feature Flags under "Rate Limits & Guardrails."
          </p>
          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <button className="btn btn-primary" onClick={runCleanup} disabled={running}>
              {running ? 'Running…' : <><Icons.Trash /> Run Cleanup Now</>}
            </button>
            <button className="btn" onClick={loadCounts}><Icons.Refresh /> Refresh Counts</button>
          </div>
          {lastResult && (
            <div style={{marginTop:'16px',padding:'12px 16px',background:'rgba(94,224,154,0.06)',border:'1px solid rgba(94,224,154,0.15)',borderRadius:'8px',fontSize:'13px'}}>
              <div style={{fontWeight:600,color:'#5ee09a',marginBottom:'8px'}}>Cleanup Results</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',fontSize:'12px',color:'var(--text-muted)'}}>
                <div>Errors deleted: <strong style={{color:'var(--text)'}}>{lastResult.errors_deleted}</strong></div>
                <div>Visits deleted: <strong style={{color:'var(--text)'}}>{lastResult.visits_deleted}</strong></div>
                <div>Audit deleted: <strong style={{color:'var(--text)'}}>{lastResult.audit_deleted}</strong></div>
              </div>
              <div style={{fontSize:'11px',color:'var(--text-faint)',marginTop:'6px'}}>Ran at: {lastResult.ran_at ? formatDateTime(lastResult.ran_at) : 'just now'}</div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2>Cleanup Schedule</h2></div>
        <div className="card-body">
          <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:1.7}}>
            For automatic scheduled cleanup, enable <strong>pg_cron</strong> in your Supabase project
            (Dashboard → Database → Extensions) and add a cron job:
          </p>
          <div className="json-view" style={{marginTop:'12px',fontSize:'12px'}}>
{`-- Run cleanup daily at 3:00 AM UTC
select cron.schedule(
  'phmurt-daily-cleanup',
  '0 3 * * *',
  $$ select public.run_admin_cleanup() $$
);`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════
// SUBSCRIPTIONS PAGE
// ═══════════════════════════════
function SubscriptionsPage({ addToast }) {
  const { data, loading, error, refetch } = useAdminQuery(async (db) => {
    const [allProfiles, stripeEvents] = await Promise.all([
      db.from('profiles')
        .select('id, name, email, subscription_tier, subscription_status, stripe_customer_id, subscription_started_at, subscription_expires_at, subscription_cancel_at, created_at')
        .order('subscription_started_at', { ascending: false, nullsFirst: false })
        .limit(500),
      db.from('stripe_events')
        .select('id, stripe_event_id, event_type, customer_id, processed, created_at')
        .order('created_at', { ascending: false })
        .limit(50)
        .then(r => r.data || [])
        .catch(() => []),
    ]);
    if (allProfiles.error) throw allProfiles.error;
    const profiles = allProfiles.data || [];
    const proUsers = profiles.filter(p => p.subscription_tier === 'pro' && p.subscription_status === 'active');
    const pastDueUsers = profiles.filter(p => p.subscription_status === 'past_due');
    const cancelingUsers = profiles.filter(p => p.subscription_cancel_at && p.subscription_status === 'active');
    // MRR: yearly subs contribute $50/12 ≈ $4.17/mo, monthly contribute $5/mo
    // We can approximate by checking subscription_expires_at: if >6 months out, likely yearly
    const monthlyPro = proUsers.filter(p => {
      if (!p.subscription_expires_at) return true;
      const exp = new Date(p.subscription_expires_at);
      const start = p.subscription_started_at ? new Date(p.subscription_started_at) : new Date();
      return (exp - start) < 180 * 24 * 60 * 60 * 1000; // Less than ~6 months = monthly
    });
    const yearlyPro = proUsers.filter(p => !monthlyPro.includes(p));
    const totalRevenue = (monthlyPro.length * 5) + Math.round(yearlyPro.length * 50 / 12 * 100) / 100;
    return {
      profiles,
      proUsers,
      pastDueUsers,
      cancelingUsers,
      totalUsers: profiles.length,
      totalPro: proUsers.length,
      monthlyCount: monthlyPro.length,
      yearlyCount: yearlyPro.length,
      mrr: totalRevenue,
      stripeEvents,
    };
  });

  const [filterTier, setFilterTier] = useState('all');
  const [search, setSearch] = useState('');

  async function manualSetTier(userId, tier) {
    // SECURITY: Validate tier and userId before sending to DB
    if (tier !== 'free' && tier !== 'pro') { addToast('Invalid tier value.', 'error'); return; }
    if (!userId || typeof userId !== 'string' || !/^[0-9a-f-]{36}$/i.test(userId)) { addToast('Invalid user ID.', 'error'); return; }
    const { error } = await sb.from('profiles').update({
      subscription_tier: tier,
      subscription_status: tier === 'pro' ? 'active' : null,
      subscription_started_at: tier === 'pro' ? new Date().toISOString() : null,
      subscription_expires_at: null,
    }).eq('id', userId);
    if (error) { addToast('Update failed. Please try again.', 'error'); return; }
    logAuditEvent('manual_subscription_change', 'user', userId, { new_tier: tier });
    addToast(`User tier set to ${tier}.`, 'success');
    refetch();
  }

  if (loading) return <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>Loading…</div>;
  if (error) return <div style={{padding:'40px',color:'var(--danger)'}}>{error}</div>;

  const s = data || { profiles: [], proUsers: [], pastDueUsers: [], cancelingUsers: [], totalUsers: 0, totalPro: 0, monthlyCount: 0, yearlyCount: 0, mrr: 0, stripeEvents: [] };

  const filtered = s.profiles.filter(p => {
    if (filterTier === 'pro' && p.subscription_tier !== 'pro') return false;
    if (filterTier === 'free' && p.subscription_tier !== 'free') return false;
    if (filterTier === 'past_due' && p.subscription_status !== 'past_due') return false;
    if (search) {
      const q = search.toLowerCase();
      return (p.name || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cinzel, serif',fontSize:'20px',fontWeight:600,letterSpacing:'1px'}}>Phmurt Studios Pro</h1>
        <button className="btn" onClick={refetch}><Icons.Refresh /> Refresh</button>
      </div>

      {/* Revenue stats */}
      <div className="stat-grid" style={{marginBottom:'24px'}}>
        <div className="stat-card">
          <div className="stat-label">Pro Subscribers</div>
          <div className="stat-value">{s.totalPro}</div>
          <div className="stat-sub">{s.monthlyCount} monthly · {s.yearlyCount} yearly</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Est. MRR</div>
          <div className="stat-value" style={{color:'#5ee09a'}}>${s.mrr.toFixed(2)}</div>
          <div className="stat-sub">${s.monthlyCount * 5} monthly + ${Math.round(s.yearlyCount * 50/12)} yearly</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Past Due</div>
          <div className="stat-value" style={{color: s.pastDueUsers.length > 0 ? '#f59e0b' : 'var(--accent)'}}>{s.pastDueUsers.length}</div>
          <div className="stat-sub">Failed payments</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Canceling</div>
          <div className="stat-value" style={{color: s.cancelingUsers.length > 0 ? '#ef4444' : 'var(--accent)'}}>{s.cancelingUsers.length}</div>
          <div className="stat-sub">Set to cancel at period end</div>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="card" style={{marginBottom:'20px'}}>
        <div className="card-header"><h2>Conversion</h2></div>
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',gap:'16px',fontSize:'13px'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'24px',fontWeight:700,fontFamily:'Cinzel,serif'}}>{s.totalUsers}</div>
              <div style={{color:'var(--text-muted)',fontSize:'11px'}}>Total Users</div>
            </div>
            <div style={{color:'var(--text-faint)',fontSize:'20px'}}>→</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'24px',fontWeight:700,fontFamily:'Cinzel,serif',color:'#5ee09a'}}>{s.totalPro}</div>
              <div style={{color:'var(--text-muted)',fontSize:'11px'}}>Pro</div>
            </div>
            <div style={{color:'var(--text-faint)',fontSize:'20px'}}>=</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'24px',fontWeight:700,fontFamily:'Cinzel,serif',color:'var(--accent)'}}>{s.totalUsers > 0 ? Math.round(s.totalPro / s.totalUsers * 100) : 0}%</div>
              <div style={{color:'var(--text-muted)',fontSize:'11px'}}>Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* User list */}
      <div style={{display:'flex',gap:'12px',marginBottom:'16px',flexWrap:'wrap',alignItems:'center'}}>
        <div className="search-bar" style={{maxWidth:'300px'}}>
          <Icons.Search />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-pills">
          {['all','pro','free','past_due'].map(f => (
            <span key={f} className={`pill ${filterTier === f ? 'active' : ''}`} onClick={() => setFilterTier(f)}>
              {f === 'all' ? 'All' : f === 'past_due' ? 'Past Due' : f.charAt(0).toUpperCase() + f.slice(1)}
            </span>
          ))}
        </div>
        <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{filtered.length} users</span>
      </div>

      <div className="card" style={{overflow:'hidden',marginBottom:'24px'}}>
        <table className="data-table">
          <thead><tr><th>User</th><th>Tier</th><th>Status</th><th>Started</th><th>Expires</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.slice(0, 100).map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{fontSize:'13px',fontWeight:600}}>{p.name || (p.email || '').split('@')[0] || 'Unknown'}</div>
                  <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{p.email || '—'}</div>
                </td>
                <td>
                  <span style={{padding:'2px 10px',borderRadius:'10px',fontSize:'11px',fontWeight:600,
                    background: p.subscription_tier === 'pro' ? 'rgba(94,224,154,0.12)' : 'rgba(255,255,255,0.04)',
                    color: p.subscription_tier === 'pro' ? '#5ee09a' : 'var(--text-muted)',
                  }}>
                    {p.subscription_tier === 'pro' ? 'PRO' : 'FREE'}
                  </span>
                </td>
                <td style={{fontSize:'12px',color: p.subscription_status === 'active' ? '#5ee09a' : p.subscription_status === 'past_due' ? '#f59e0b' : 'var(--text-muted)'}}>
                  {p.subscription_status || '—'}
                  {p.subscription_cancel_at && <span style={{fontSize:'10px',color:'#ef4444',marginLeft:'4px'}}>(canceling)</span>}
                </td>
                <td style={{fontSize:'12px'}}>{p.subscription_started_at ? formatDate(p.subscription_started_at) : '—'}</td>
                <td style={{fontSize:'12px'}}>{p.subscription_expires_at ? formatDate(p.subscription_expires_at) : '—'}</td>
                <td>
                  <div className="btn-group">
                    {p.subscription_tier !== 'pro' && (
                      <button className="btn btn-sm btn-primary" onClick={() => manualSetTier(p.id, 'pro')} style={{fontSize:'10px'}}>Grant Pro</button>
                    )}
                    {p.subscription_tier === 'pro' && (
                      <button className="btn btn-sm btn-danger" onClick={() => manualSetTier(p.id, 'free')} style={{fontSize:'10px'}}>Revoke</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Stripe events */}
      {s.stripeEvents.length > 0 && (
        <div className="card">
          <div className="card-header"><h2>Recent Stripe Events</h2></div>
          <div className="card-body" style={{maxHeight:'300px',overflowY:'auto'}}>
            {s.stripeEvents.map(e => (
              <div key={e.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border-mid)',fontSize:'12px'}}>
                <div>
                  <span style={{fontWeight:600}}>{e.event_type}</span>
                  <span className="mono" style={{fontSize:'10px',color:'var(--text-faint)',marginLeft:'8px'}}>{(e.customer_id || '').slice(0, 18)}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{width:'6px',height:'6px',borderRadius:'50%',background: e.processed ? '#5ee09a' : '#f59e0b'}} />
                  <span style={{color:'var(--text-muted)'}}>{timeAgo(e.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════
// MAIN APP
// ═══════════════════════════════
function AdminApp() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [viewer, setViewer] = useState(null);
  const toastId = useRef(0);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    if (!sb || !sb.auth) return;
    sb.auth.getSession()
      .then(({ data }) => {
        const user = data && data.session && data.session.user;
        if (!user) return;
        return sb.from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
          .then(({ data: profile }) => {
            const email = (profile && profile.email) || user.email || '';
            const name = (profile && profile.name) || (user.user_metadata && user.user_metadata.name) || (email ? email.split('@')[0] : 'Admin');
            setViewer({
              id: user.id,
              email: email,
              name: name,
              isAdmin: !!(profile && profile.is_admin),
              isSuperuser: !!(profile && profile.is_superuser),
            });
          });
      })
      .catch(() => {});
  }, []);

  // ── Admin session timeout (30 min inactivity) ──
  useEffect(() => {
    const TIMEOUT_MS = 30 * 60 * 1000;
    let timer = null;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.removeItem('phmurt_admin_img_ok');
        window.location.reload();
      }, TIMEOUT_MS);
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(ev => document.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(ev => document.removeEventListener(ev, resetTimer));
    };
  }, []);

  const canManageAdmins = !!(viewer && viewer.isSuperuser);

  const navItems = [
    { section: 'Overview' },
    { id: 'dashboard',      label: 'Dashboard',       icon: Icons.Dashboard },
    { section: 'Content' },
    { id: 'users',          label: 'Users',            icon: Icons.Users },
    { id: 'characters',     label: 'Characters',       icon: Icons.Keys },
    { id: 'campaigns',      label: 'Campaigns',        icon: Icons.Tenants },
    { section: 'Moderation' },
    { id: 'flagged',        label: 'Flagged',          icon: Icons.Shield },
    { section: 'Analytics' },
    { id: 'traffic',        label: 'Site Traffic',     icon: Icons.RateLimit },
    { id: 'engagement',     label: 'Engagement',       icon: Icons.Audit },
    { id: 'errors',         label: 'Error Log',        icon: Icons.X },
    { section: 'Revenue' },
    { id: 'subscriptions',  label: 'Subscriptions',    icon: Icons.Shield },
    { id: 'tiers',           label: 'Tier Management',  icon: Icons.Crown },
    { section: 'Admin Tools' },
    { id: 'audit',          label: 'Audit Log',        icon: Icons.ClipboardList },
    { id: 'announcements',  label: 'Announcements',    icon: Icons.Bell },
    { id: 'flags',          label: 'Feature Flags',    icon: Icons.Sliders },
    { id: 'export',         label: 'Data Export',      icon: Icons.Download },
    { id: 'cleanup',        label: 'Data Cleanup',     icon: Icons.Trash },
    { section: 'System' },
    { id: 'settings',       label: 'Settings',         icon: Icons.Settings },
  ];

  const renderPage = () => {
    switch(page) {
      case 'dashboard':     return <DashboardPage onNavigate={setPage} />;
      case 'users':         return <UsersPage addToast={addToast} canManageAdmins={canManageAdmins} />;
      case 'characters':    return <CharactersPage addToast={addToast} canDeleteContent={canManageAdmins} />;
      case 'campaigns':     return <CampaignsPage addToast={addToast} canDeleteContent={canManageAdmins} />;
      case 'flagged':       return <FlaggedContentPage addToast={addToast} canDeleteContent={canManageAdmins} />;
      case 'traffic':       return <TrafficPage />;
      case 'engagement':    return <EngagementPage />;
      case 'errors':        return <ErrorLogPage />;
      case 'subscriptions': return <SubscriptionsPage addToast={addToast} />;
      case 'tiers':          return <TierManagementPage addToast={addToast} />;
      case 'audit':         return <AuditLogPage />;
      case 'announcements': return <AnnouncementsPage addToast={addToast} />;
      case 'flags':         return <FeatureFlagsPage addToast={addToast} viewer={viewer} />;
      case 'export':        return <DataExportPage addToast={addToast} />;
      case 'cleanup':       return <CleanupPage addToast={addToast} />;
      case 'settings':      return <SettingsPage addToast={addToast} canManageAdmins={canManageAdmins} />;
      default:              return <DashboardPage onNavigate={setPage} />;
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    localStorage.setItem('phmurt_theme', isLight ? 'light' : 'dark');
  };

  // Apply saved theme
  useEffect(() => {
    const saved = localStorage.getItem('phmurt_theme');
    if (saved === 'light') document.documentElement.classList.add('light-mode');
  }, []);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div>
            <h1>Phmurt Studios</h1>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item, i) => {
            if (item.section) {
              return <div key={i} className="sidebar-section"><span className="sidebar-section-label">{item.section}</span></div>;
            }
            const Icon = item.icon;
            return (
              <div className="sidebar-section" key={item.id}>
                <div
                  className={`sidebar-item ${page === item.id ? 'active' : ''}`}
                  onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                >
                  <Icon />
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <a href="index.html" style={{color:'var(--accent)',textDecoration:'none',fontSize:'12px',fontFamily:'Cinzel, serif',letterSpacing:'1px'}}>
            ← Back to Site
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Icons.Menu />
            </button>
            <span style={{fontFamily:'Cinzel, serif',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--text-muted)'}}>
              {navItems.find(n => n.id === page)?.label || 'Dashboard'}
            </span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <button className="btn btn-sm" onClick={toggleTheme} style={{border:'1px solid var(--accent-border)',borderRadius:'50%',width:'32px',height:'32px',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Icons.Moon />
            </button>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'rgba(201,168,76,0.15)',border:'1px solid rgba(201,168,76,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontFamily:'Cinzel',color:'var(--accent)'}}>
                {((viewer && viewer.name) ? viewer.name : 'Admin').charAt(0).toUpperCase()}
              </div>
              <span style={{fontSize:'13px'}}>
                {(viewer && viewer.name) || 'Admin'}
                {(viewer && viewer.isSuperuser) ? ' (Superuser)' : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="admin-content">
          {renderPage()}
        </div>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ═══════════════════════════════
// MOUNT
// ═══════════════════════════════
const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
