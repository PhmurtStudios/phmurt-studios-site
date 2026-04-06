// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN MANAGER — TIMELINE TAB (lazy-loaded module)
// ═══════════════════════════════════════════════════════════════════════════

/* Shared core references from main bundle */
const { useState, useEffect, useCallback, useRef, useMemo } = React;
const {
  T, getHpColor, DND_CONDITIONS, CONDITION_HELP,
  Tag, HpBar, PowerBar, LinkBtn, CrimsonBtn, Section, Input, Select, Textarea, Modal, ToggleSwitch,
  eid, uid, cmClone, cmSafeInt, cmAbilityMod, cmHumanizeKey,
  getFantasyIcon, DiceRoller, ConfirmFlyout,
} = window.__CM;
const { ChevronDown, ChevronRight, ChevronLeft, Swords, Users, MapPin, Crown, Scroll, Clock, Star, BookOpen, Dice6, Target, Heart, CheckCircle, Circle, ArrowRight, Plus, Compass, Mountain, Castle, Skull, Flag, TrendingUp, TrendingDown, Minus, SkipForward, Search, Bell, Settings, X, Edit3, Trash2, Eye, EyeOff, Globe, Layers, Activity, Upload, Download, FileText, Save, Copy, Calendar, Lock, Unlock, ToggleLeft, ToggleRight, AlertTriangle, Package, Shield, Wand2, Filter } = window.LucideReact || {};
const FilterIcon = Filter || Layers;

// ═══════════════════════════════════════════════════════════════════════════
// TIMELINE
// ═══════════════════════════════════════════════════════════════════════════

const TIMELINE_EVENT_TYPES = [
  { id:"encounter", label:"Combat" },
  { id:"discovery", label:"Discovery" },
  { id:"roleplay", label:"Roleplay" },
  { id:"world_change", label:"World" },
  { id:"loot", label:"Loot" },
  { id:"quest_complete", label:"Quest" },
];

const TIMELINE_EVENT_CSS = {
  encounter: "--event-encounter",
  discovery: "--event-discovery",
  roleplay: "--event-roleplay",
  world_change: "--event-worldchange",
  loot: "--event-loot",
  quest_complete: "--event-quest",
};

function inferEventImportance(ev) {
  if (ev.importance === "major" || ev.importance === "minor" || ev.importance === "standard") return ev.importance;
  if (ev.type === "quest_complete" || ev.type === "world_change") return "major";
  if (ev.type === "loot" || ev.type === "discovery") return "minor";
  if (ev.type === "encounter") return "major";
  return "standard";
}

function timelineEventHeadline(ev) {
  if (ev.headline && String(ev.headline).trim()) return String(ev.headline).trim();
  const t = (ev.text || "").trim();
  if (!t) return "Untitled event";
  const max = 58;
  if (t.length <= max) return t;
  const slice = t.slice(0, max);
  const sp = slice.lastIndexOf(" ");
  return (sp > 24 ? slice.slice(0, sp) : slice) + "…";
}

function TimelineView({ data, setData, onNav, viewRole }) {
  const isPlayerView = viewRole === "player";
  const [open,setOpen] = useState(new Set([data.timeline[0]?.id]));
  const [_dmViewInternal,setDmView] = useState(!isPlayerView);
  const dmView = isPlayerView ? false : _dmViewInternal; // Players can NEVER see DM-only content
  const [addingSession, setAddingSession] = useState(false);
  const [addingEvent, setAddingEvent] = useState(null);
  const [newSession, setNewSession] = useState({ title:"", date:new Date().toISOString().split('T')[0], summary:"", dmOnly:false });
  const [newEvent, setNewEvent] = useState({ type:"encounter", text:"", outcome:"", dmOnly:false, location:"", importance:"standard", scope:"", headline:"", linkedNames:"" });
  const [editNotes, setEditNotes] = useState({});
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCharacter, setFilterCharacter] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [compactLayout, setCompactLayout] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState(() => new Set());
  const [hoverSession, setHoverSession] = useState(null);
  const [hoverEventKey, setHoverEventKey] = useState(null);
  const [narrow, setNarrow] = useState(typeof window !== "undefined" ? window.innerWidth < 920 : true);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const latestSessionId = data.timeline[0]?.id;
  const activeFilterTally = (filterType !== "all" ? 1 : 0) + (filterCharacter ? 1 : 0) + (filterLocation ? 1 : 0);

  useEffect(() => {
    const w = () => setNarrow(window.innerWidth < 920);
    w();
    window.addEventListener("resize", w);
    return () => window.removeEventListener("resize", w);
  }, []);

  const characterOptions = useMemo(() => {
    const party = (data.party || []).map(p => p.name).filter(Boolean);
    const npc = (data.npcs || []).map(n => n.name).filter(Boolean);
    return [...new Set([...party, ...npc])].sort((a, b) => a.localeCompare(b));
  }, [data.party, data.npcs]);

  const locationOptions = useMemo(() => {
    const fromEv = (data.timeline || []).flatMap(s => (s.events || []).map(e => e.location).filter(Boolean));
    const regs = (data.regions || []).map(r => r.name).filter(Boolean);
    return [...new Set([...fromEv, ...regs])].sort((a, b) => a.localeCompare(b));
  }, [data.timeline, data.regions]);

  const evIcons = { encounter:Swords, discovery:Search, roleplay:Users, world_change:Globe, loot:Package, quest_complete:CheckCircle };
  const scopeIcons = { character:Heart, world:Globe, party:Users };

  const toggle = id => setOpen(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleEventKey = (sessionId, evId) => {
    const key = `${sessionId}:${evId}`;
    setExpandedEvents(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const addSession = () => {
    if(!newSession.title) return;
    const n = data.sessionsPlayed + 1;
    setData(d=>({...d, sessionsPlayed:n, timeline:[{id:uid(),n,title:newSession.title,date:newSession.date,summary:newSession.summary,events:[],changes:[],notes:"",dmOnly:newSession.dmOnly},...d.timeline],
      activity:[{time:"Just now",text:`Session ${n}: ${newSession.title}`},...d.activity].slice(0,20)}));
    setNewSession({ title:"", date:new Date().toISOString().split('T')[0], summary:"", dmOnly:false });
    setAddingSession(false);
  };
  const addEvent = (sessionId) => {
    if(!newEvent.text) return;
    const linkedNames = newEvent.linkedNames ? newEvent.linkedNames.split(",").map(x => x.trim()).filter(Boolean) : [];
    const headline = (newEvent.headline || "").trim();
    const payload = {
      id: eid(),
      type: newEvent.type,
      text: newEvent.text,
      outcome: newEvent.outcome || "",
      dmOnly: !!newEvent.dmOnly,
      location: (newEvent.location || "").trim() || undefined,
      scope: (newEvent.scope || "").trim() || undefined,
      importance: newEvent.importance && newEvent.importance !== "standard" ? newEvent.importance : undefined,
      headline: headline || undefined,
      linkedNames: linkedNames.length ? linkedNames : undefined,
    };
    Object.keys(payload).forEach(k => { if (payload[k] === undefined) delete payload[k]; });
    setData(d=>({...d,timeline:d.timeline.map(s=>s.id===sessionId?{...s,events:[...s.events,payload]}:s)}));
    setNewEvent({ type:"encounter", text:"", outcome:"", dmOnly:false, location:"", importance:"standard", scope:"", headline:"", linkedNames:"" });
    setAddingEvent(null);
  };
  const saveNotes = (sessionId, notes) => {
    setData(d=>({...d,timeline:d.timeline.map(s=>s.id===sessionId?{...s,notes}:s)}));
  };

  const eventPassesFilters = (ev) => {
    if (filterType !== "all" && ev.type !== filterType) return false;
    if (filterLocation && (ev.location || "") !== filterLocation) return false;
    if (filterCharacter) {
      const fc = filterCharacter.toLowerCase();
      const linked = (ev.linkedNames || []).some(n => String(n).toLowerCase() === fc);
      const inText = String(ev.text || "").toLowerCase().includes(fc);
      if (!linked && !inText) return false;
    }
    return true;
  };

  const sessionMatchesFilters = (s) => {
    if (s.dmOnly && !dmView) return false;
    const q = searchQuery.trim().toLowerCase();
    const matchStr = (t) => !q || String(t||"").toLowerCase().includes(q);
    const events = (s.events||[]).filter(ev => !(ev.dmOnly && !dmView));
    if (events.length === 0) {
      if (filterType !== "all" || filterLocation || filterCharacter) return false;
      return !q || matchStr(s.title) || matchStr(s.summary) || matchStr(s.date);
    }
    const anyHard = events.some(eventPassesFilters);
    if (!anyHard) return false;
    if (!q) return true;
    const metaMatch = matchStr(s.title) || matchStr(s.summary) || matchStr(s.date);
    const evSearch = (ev) => eventPassesFilters(ev) && (matchStr(ev.text) || matchStr(ev.outcome) || matchStr(ev.location) || (ev.linkedNames||[]).some(n => matchStr(n)));
    if (events.some(evSearch)) return true;
    return metaMatch;
  };

  const visibleCount = data.timeline.filter(sessionMatchesFilters).length;

  return (
    <div style={{ padding: compactLayout ? "16px 28px 28px" : "20px 40px 36px", maxWidth:1040, margin:"0 auto", width:"100%", transition:"padding 0.25s ease" }}>
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:12, rowGap:10, marginBottom: filtersExpanded ? 12 : 6 }}>
        <div style={{ flex:"1 1 160px", minWidth:0 }}>
          <div style={{ fontSize: compactLayout ? 20 : 22, color:T.text, fontWeight:400, fontFamily:T.body, letterSpacing:"0.02em", lineHeight:1.2 }}>Timeline</div>
          <div style={{ fontSize:12, color:T.textMuted, fontWeight:300, marginTop:2 }}>
            {data.timeline.length} session{data.timeline.length !== 1 ? "s" : ""}{visibleCount < data.timeline.length ? ` · ${visibleCount} visible` : ""}
          </div>
        </div>
        {data.timeline.length > 0 && (
          <div style={{ flex:"2 1 240px", minWidth:0, maxWidth:360, position:"relative" }}>
            <Search size={13} color={T.textFaint} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", opacity:0.7 }}/>
            <Input value={searchQuery} onChange={setSearchQuery} placeholder="Search…" style={{ paddingLeft:32, paddingTop:7, paddingBottom:7, fontSize:13, background:T.bgInput, borderColor:T.borderMid }} />
          </div>
        )}
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:8, marginLeft:"auto" }}>
          {data.timeline.length > 0 && (
            <button type="button" onClick={()=>setFiltersExpanded(e => !e)} style={{
              display:"inline-flex", alignItems:"center", gap:6, padding:"6px 10px", cursor:"pointer",
              background: activeFilterTally ? T.crimsonSoft : "transparent", border:`1px solid ${activeFilterTally ? T.crimsonBorder : T.border}`,
              borderRadius:"3px", fontFamily:T.body, fontSize:12, color: activeFilterTally ? T.crimson : T.textMuted, fontWeight:400,
            }}>
              <FilterIcon size={13}/>
              <span>Filters{activeFilterTally ? ` · ${activeFilterTally}` : ""}</span>
              <ChevronDown size={14} color={T.textMuted} style={{ transform: filtersExpanded ? "rotate(180deg)" : "none", transition:"transform 0.2s ease" }}/>
            </button>
          )}
          {!isPlayerView && <ToggleSwitch on={dmView} onToggle={()=>setDmView(!dmView)} label="DM" />}
          <button type="button" title="Comfort vs compact density" onClick={()=>setCompactLayout(c=>!c)} style={{
            display:"inline-flex", alignItems:"center", gap:4, padding:"6px 8px", cursor:"pointer",
            background:"transparent", border:`1px solid ${T.border}`, borderRadius:"3px", color:T.textFaint,
          }}><Layers size={13}/></button>
          {!isPlayerView && <CrimsonBtn onClick={()=>setAddingSession(true)}><Plus size={12}/> Session</CrimsonBtn>}
        </div>
      </div>

      {data.timeline.length > 0 && filtersExpanded && (
        <div style={{
          marginBottom:18, padding:"12px 14px",
          background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px",
          animation:"fadeIn 0.2s ease",
        }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center", marginBottom:10 }}>
            <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1.5px", color:T.textFaint, textTransform:"uppercase", marginRight:4 }}>Event type</span>
            <button type="button" onClick={()=>setFilterType("all")} style={{
              padding:"4px 10px", borderRadius:"3px", cursor:"pointer", fontFamily:T.body, fontSize:11,
              border:`1px solid ${filterType==="all"?T.crimson:T.borderMid}`,
              background: filterType==="all" ? T.crimsonSoft : T.bgInput, color: filterType==="all" ? T.crimson : T.textMuted,
            }}>All</button>
            {TIMELINE_EVENT_TYPES.map(t => {
              const sel = filterType === t.id;
              const accent = cssVar(TIMELINE_EVENT_CSS[t.id] || "--event-encounter");
              return (
                <button type="button" key={t.id} onClick={()=>setFilterType(t.id)} style={{
                  padding:"4px 10px", borderRadius:"3px", cursor:"pointer", fontFamily:T.body, fontSize:11,
                  border:`1px solid ${sel ? accent : T.borderMid}`,
                  background: sel ? cssVar("--tag-info-bg") : T.bgInput,
                  color: sel ? accent : T.textMuted,
                }}>{t.label}</button>
              );
            })}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"flex-end" }}>
            <div style={{ flex:"1 1 140px", minWidth:120 }}>
              <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", display:"block", marginBottom:4 }}>Character</span>
              <Select value={filterCharacter} onChange={setFilterCharacter} style={{ width:"100%", padding:"6px 8px", fontSize:12 }}>
                <option value="">Any</option>
                {characterOptions.map(name => <option key={name} value={name}>{name}</option>)}
              </Select>
            </div>
            <div style={{ flex:"1 1 140px", minWidth:120 }}>
              <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", display:"block", marginBottom:4 }}>Location</span>
              <Select value={filterLocation} onChange={setFilterLocation} style={{ width:"100%", padding:"6px 8px", fontSize:12 }}>
                <option value="">Any</option>
                {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      <Modal open={addingSession} onClose={()=>setAddingSession(false)} title="Log New Session">
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Input value={newSession.title} onChange={v=>setNewSession(p=>({...p,title:v}))} placeholder="Session title" />
          <Input value={newSession.date} onChange={v=>setNewSession(p=>({...p,date:v}))} type="date" />
          <Textarea value={newSession.summary} onChange={v=>setNewSession(p=>({...p,summary:v}))} placeholder="Session summary..." rows={4} />
          <ToggleSwitch on={newSession.dmOnly} onToggle={()=>setNewSession(p=>({...p,dmOnly:!p.dmOnly}))} label="DM Only" />
          <CrimsonBtn onClick={addSession}><Plus size={12}/> Log Session</CrimsonBtn>
        </div>
      </Modal>

      {data.timeline.length === 0 && (
        <Section style={{ textAlign:"center", padding:48 }}>
          <Clock size={32} color={T.textFaint} style={{ marginBottom:16 }}/>
          <p style={{ fontSize:14, color:T.textMuted, fontWeight:300, margin:"0 0 16px" }}>No sessions logged yet.</p>
          <CrimsonBtn onClick={()=>setAddingSession(true)}><Plus size={12}/> Log First Session</CrimsonBtn>
        </Section>
      )}

      {data.timeline.length > 0 && visibleCount === 0 && (
        <Section style={{ textAlign:"center", padding:32, marginBottom:24 }}>
          <p style={{ fontSize:14, color:T.textMuted, fontWeight:300, margin:0 }}>No sessions match your search or filters. Try clearing filters or broadening your search.</p>
          <button type="button" onClick={()=>{ setSearchQuery(""); setFilterType("all"); setFilterCharacter(""); setFilterLocation(""); }} style={{
            marginTop:14, padding:"8px 16px", cursor:"pointer", background:T.crimsonSoft, border:`1px solid ${T.crimsonBorder}`,
            borderRadius:"2px", fontFamily:T.ui, fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:T.crimson, fontWeight:500,
          }}>Reset filters</button>
        </Section>
      )}

      {visibleCount > 0 && (
      <div style={{ position:"relative", width:"100%", paddingTop: narrow ? 2 : 12, paddingBottom: narrow ? 8 : 20, paddingLeft: narrow ? (compactLayout ? 24 : 30) : 0 }}>
        {!narrow && (
          <div aria-hidden style={{
            position:"absolute", left:"50%", top:8, bottom:12, width:2, marginLeft:-1,
            borderRadius:2,
            background:`linear-gradient(180deg, ${T.crimsonBorder} 0%, ${T.crimsonDim} 45%, ${T.crimsonBorder} 100%)`,
            opacity:0.85,
            zIndex:0, pointerEvents:"none",
          }}/>
        )}
        {narrow && (
          <div style={{
            position:"absolute", left: compactLayout ? 5 : 7, top:2, bottom:8, width:2, borderRadius:"2px",
            background:`linear-gradient(180deg, ${T.crimsonBorder} 0%, ${T.crimsonDim} 50%, ${T.crimsonBorder} 100%)`,
            opacity:0.9, zIndex:0,
          }}/>
        )}

        {data.timeline.map((s, timelineIdx) => {
          const isOpen = open.has(s.id);
          if (!sessionMatchesFilters(s)) return null;
          const isLatest = s.id === latestSessionId;
          const sessionPad = compactLayout ? 14 : 18;
          const onLeft = timelineIdx % 2 === 0;
          const dotMm = compactLayout ? 14 : 18;
          const timelineDot = (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop: compactLayout ? 14 : 18 }}>
              <div style={{ width:2, height: compactLayout ? 8 : 10, background:T.crimsonBorder, borderRadius:1, marginBottom:3, opacity:0.7 }} />
              <div style={{
                width: dotMm, height: dotMm, borderRadius:"50%",
                background: isLatest ? T.crimson : T.bgCard,
                border:`2px solid ${isLatest ? T.crimson : T.crimsonBorder}`,
                boxShadow: isLatest ? `0 0 0 3px ${T.crimsonSoft}` : "none",
                zIndex:2, flexShrink:0,
              }}/>
            </div>
          );

          const sessionCard = (
              <Section style={{
                cursor:"default", transition:"box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                padding: sessionPad,
                border:`1px solid ${isLatest ? T.crimsonBorder : T.borderMid}`,
                background: timelineIdx % 2 === 0 ? T.bgCard : T.bgMid,
                boxShadow: hoverSession===s.id
                  ? `0 4px 16px rgba(0,0,0,0.12)`
                  : "0 1px 0 rgba(0,0,0,0.06)",
                transform: "none",
              }}
                onMouseEnter={()=>setHoverSession(s.id)}
                onMouseLeave={()=>setHoverSession(null)}
              >
                {/* Session header — click to expand */}
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={e=>{ if(e.key==="Enter"||e.key===" ") { e.preventDefault(); toggle(s.id); } }}
                  onClick={()=>toggle(s.id)}
                  style={{ cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}
                >
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:8, marginBottom: compactLayout ? 4 : 6 }}>
                      <span style={{
                        fontFamily:T.ui, fontSize: compactLayout ? 8 : 9, letterSpacing:"1px", color:T.crimson, fontWeight:600,
                      }}>Session {s.n}</span>
                      {isLatest && <Tag variant="info">Latest</Tag>}
                      {s.dmOnly && <Tag variant="muted"><Lock size={8}/> DM</Tag>}
                    </div>
                    <div style={{
                      fontFamily:T.body,
                      fontSize: compactLayout ? 15 : isLatest ? 19 : 17,
                      color:T.text, fontWeight: isLatest ? 500 : 400,
                      marginBottom:4, lineHeight:1.3, letterSpacing:"0.01em",
                    }}>{s.title}</div>
                    <div style={{ fontSize:11, color:T.textMuted, fontWeight:300, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", fontFamily:T.body }}>
                      <Calendar size={11} color={T.textFaint}/> {s.date}
                      <span style={{ color:T.border }}>|</span>
                      <span>{s.events?.length||0} events</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0, minWidth:28 }}>
                    {isOpen ? <ChevronUp size={18} color={T.crimson}/> : <ChevronDown size={18} color={T.textMuted}/>}
                  </div>
                </div>

                {isOpen && <div onClick={e=>e.stopPropagation()} style={{ animation:"fadeIn 0.22s ease" }}>
                  <p style={{
                    fontSize: compactLayout ? 12 : 13, color:T.textDim, lineHeight:1.65, margin:"12px 0 14px", fontWeight:300,
                    borderTop:`1px solid ${T.borderMid}`, paddingTop:12,
                  }}>{s.summary}</p>

                  {/* Events */}
                  {s.events?.length > 0 && (
                    <div style={{ display:"flex", flexDirection:"column", gap: compactLayout ? 6 : 8, marginBottom:12, paddingLeft: compactLayout ? 6 : 10, borderLeft:`1px solid ${T.borderMid}`, marginTop:2 }}>
                      {s.events.map(ev => {
                        if(ev.dmOnly && !dmView) return null;
                        if (!eventPassesFilters(ev)) return null;
                        const q = searchQuery.trim().toLowerCase();
                        const matchStr = (t) => !q || String(t||"").toLowerCase().includes(q);
                        if (q) {
                          const evMatch = `${ev.text} ${ev.outcome||""} ${ev.location||""}`.toLowerCase().includes(q) || (ev.linkedNames||[]).some(n => matchStr(n));
                          const metaMatch = matchStr(s.title) || matchStr(s.summary) || matchStr(s.date);
                          if (!evMatch && !metaMatch) return null;
                        }

                        const EvIcon = evIcons[ev.type] || Circle;
                        const col = cssVar(TIMELINE_EVENT_CSS[ev.type] || "--event-encounter");
                        const imp = inferEventImportance(ev);
                        const evKey = `${s.id}:${ev.id}`;
                        const evOpen = expandedEvents.has(evKey);
                        const major = imp === "major";
                        const minor = imp === "minor";
                        const padY = minor ? 5 : major ? 9 : 7;
                        const padX = minor ? 8 : major ? 12 : 10;
                        const iconBox = major ? 30 : minor ? 22 : 26;
                        const ScopeIc = ev.scope && scopeIcons[ev.scope] ? scopeIcons[ev.scope] : null;
                        const evHover = hoverEventKey === evKey;
                        const hl = timelineEventHeadline(ev);
                        const typeLabel = TIMELINE_EVENT_TYPES.find(t=>t.id===ev.type)?.label || ev.type;
                        const metaParts = [typeLabel];
                        if (ev.location) metaParts.push(ev.location);
                        if (s.n) metaParts.push(`Session ${s.n}`);
                        const metaLine = metaParts.join(" · ");

                        return (
                          <div key={ev.id} style={{ position:"relative", paddingLeft: 0, marginBottom: major ? 10 : 5 }}>
                            <div
                              role="button"
                              tabIndex={0}
                              aria-expanded={evOpen}
                              onKeyDown={e=>{ if(e.key==="Enter"||e.key===" ") { e.preventDefault(); toggleEventKey(s.id, ev.id); } }}
                              onClick={()=>toggleEventKey(s.id, ev.id)}
                              onMouseEnter={()=>setHoverEventKey(evKey)}
                              onMouseLeave={()=>setHoverEventKey(null)}
                              style={{
                                display:"flex", gap: 10,
                                alignItems:"flex-start",
                                padding:`${padY}px ${padX}px`,
                                background: evHover ? T.bgHover : (minor ? T.bgInput : T.bgCard),
                                borderRadius: 3,
                                border:`1px solid ${T.borderMid}`,
                                borderLeft:`3px solid ${col}`,
                                boxShadow: evHover ? "0 2px 8px rgba(0,0,0,0.08)" : "0 1px 0 rgba(0,0,0,0.04)",
                                opacity: minor ? 0.92 : (ev.dmOnly ? 0.75 : 1),
                                cursor:"pointer",
                                transition:"background 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                              }}
                            >
                              <div style={{
                                width: iconBox, height: iconBox, borderRadius: 6, flexShrink:0,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                background: T.bgMid,
                                border:`1px solid ${T.borderMid}`,
                              }}>
                                <EvIcon size={major ? 15 : minor ? 11 : 13} color={col}/>
                              </div>
                              <div style={{ flex:1, minWidth:0, paddingTop:1 }}>
                                <div style={{
                                  fontFamily:T.body,
                                  fontSize: major ? 14 : minor ? 12.5 : 13,
                                  color:T.text,
                                  fontWeight: major ? 500 : 400,
                                  lineHeight:1.35,
                                }}>{hl}</div>
                                {!evOpen && (
                                  <div style={{ fontSize:11, color:T.textMuted, marginTop:3, fontWeight:300, lineHeight:1.4 }}>
                                    {metaLine}{ev.dmOnly ? <span style={{ color:T.textFaint }}> · DM only</span> : null}
                                  </div>
                                )}
                                {evOpen && (
                                  <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${T.borderMid}`, animation:"fadeIn 0.2s ease" }}>
                                    <p style={{ fontSize:13, color:T.textDim, lineHeight:1.65, fontWeight:300, margin:0 }}>{ev.text}</p>
                                    {ev.outcome && (
                                      <div style={{ fontSize:12, color:T.textMuted, marginTop:10, fontWeight:300, fontStyle:"italic" }}>
                                        {ev.outcome}
                                      </div>
                                    )}
                                    <div style={{ fontSize:10, color:T.textFaint, marginTop:10, display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
                                      {ScopeIc && <span style={{ display:"inline-flex", alignItems:"center", gap:3 }}><ScopeIc size={10}/> {ev.scope}</span>}
                                      {ev.location && <span style={{ display:"inline-flex", alignItems:"center", gap:3 }}><MapPin size={10} color={col}/> {ev.location}</span>}
                                      {major && <span style={{ fontFamily:T.ui, letterSpacing:"0.08em", textTransform:"uppercase" }}>Key beat</span>}
                                    </div>
                                    {(ev.linkedNames||[]).length > 0 && (
                                      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
                                        {(ev.linkedNames||[]).map(name => (
                                          <span key={name} style={{ fontSize:10, padding:"2px 6px", borderRadius:2, background:T.bgInput, border:`1px solid ${T.borderMid}`, color:T.textMuted }}>{name}</span>
                                        ))}
                                      </div>
                                    )}
                                    {onNav && (
                                      <div style={{ marginTop:12, display:"flex", flexWrap:"wrap", gap:6 }}>
                                        <button type="button" onClick={e=>{ e.stopPropagation(); onNav("world"); }} style={{
                                          display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", cursor:"pointer",
                                          background:T.crimsonSoft, border:`1px solid ${T.crimsonBorder}`, borderRadius:"2px",
                                          fontFamily:T.body, fontSize:11, color:T.crimson, fontWeight:500,
                                        }}><Globe size={12}/> Map</button>
                                        <button type="button" onClick={e=>{ e.stopPropagation(); onNav("play"); }} style={{
                                          display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", cursor:"pointer",
                                          background:T.bgInput, border:`1px solid ${T.borderMid}`, borderRadius:"2px",
                                          fontFamily:T.body, fontSize:11, color:T.textMuted,
                                        }}><Swords size={12}/> Play</button>
                                        <button type="button" onClick={e=>{ e.stopPropagation(); onNav("notes"); }} style={{
                                          display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", cursor:"pointer",
                                          background:T.bgInput, border:`1px solid ${T.borderMid}`, borderRadius:"2px",
                                          fontFamily:T.body, fontSize:11, color:T.textMuted,
                                        }}><BookOpen size={12}/> Notes</button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div style={{ flexShrink:0, paddingTop:2, opacity:0.65 }}>
                                {evOpen ? <ChevronUp size={15} color={T.crimson}/> : <ChevronDown size={15} color={T.textMuted}/>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* World Changes */}
                  {s.changes?.length > 0 && (
                    <div style={{ padding:10, background:T.bgInput, border:`1px solid ${T.borderMid}`, borderRadius:"3px", marginBottom:12 }}>
                      <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textMuted, textTransform:"uppercase", display:"block", marginBottom:6 }}>World changes</span>
                      {s.changes.map((c,ci) => <div key={ci} style={{ fontSize:12, color:T.textDim, fontWeight:300, padding:"2px 0" }}>· {c}</div>)}
                    </div>
                  )}

                  {/* DM Notes — DM only */}
                  {dmView && !isPlayerView && (
                    <div style={{ marginTop:12 }}>
                      <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textMuted, textTransform:"uppercase" }}>DM Notes</span>
                      <Textarea value={editNotes[s.id]!=null?editNotes[s.id]:(s.notes||"")} onChange={v=>setEditNotes(p=>({...p,[s.id]:v}))} rows={2} style={{ marginTop:6 }} placeholder="Private notes..." />
                      {editNotes[s.id]!=null && editNotes[s.id]!==(s.notes||"") && (
                        <CrimsonBtn small onClick={()=>{saveNotes(s.id,editNotes[s.id]);setEditNotes(p=>{const n={...p};delete n[s.id];return n;});}} style={{marginTop:6}}><Save size={10}/> Save</CrimsonBtn>
                      )}
                    </div>
                  )}

                  {/* Add event — DM only */}
                  {!isPlayerView && <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}` }}>
                    {addingEvent===s.id ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        <Select value={newEvent.type} onChange={v=>setNewEvent(p=>({...p,type:v}))} style={{width:"100%"}}>
                          <option value="encounter">Encounter</option>
                          <option value="discovery">Discovery</option>
                          <option value="roleplay">Roleplay</option>
                          <option value="world_change">World Change</option>
                          <option value="loot">Loot</option>
                          <option value="quest_complete">Quest Complete</option>
                        </Select>
                        <Select value={newEvent.importance||"standard"} onChange={v=>setNewEvent(p=>({...p,importance:v}))} style={{width:"100%"}}>
                          <option value="standard">Importance · Standard</option>
                          <option value="major">Major beat</option>
                          <option value="minor">Minor note</option>
                        </Select>
                        <Select value={newEvent.scope||""} onChange={v=>setNewEvent(p=>({...p,scope:v}))} style={{width:"100%"}}>
                          <option value="">Scope (optional)</option>
                          <option value="party">Party</option>
                          <option value="world">World</option>
                          <option value="character">Character</option>
                        </Select>
                        <Input value={newEvent.headline} onChange={v=>setNewEvent(p=>({...p,headline:v}))} placeholder="Short headline (shown when collapsed)" />
                        <Input value={newEvent.linkedNames} onChange={v=>setNewEvent(p=>({...p,linkedNames:v}))} placeholder="Linked characters (comma-separated)" />
                        <Input value={newEvent.text} onChange={v=>setNewEvent(p=>({...p,text:v}))} placeholder="What happened?" />
                        <Input value={newEvent.outcome} onChange={v=>setNewEvent(p=>({...p,outcome:v}))} placeholder="Outcome (optional)" />
                        <Input value={newEvent.location} onChange={v=>setNewEvent(p=>({...p,location:v}))} placeholder="Location (optional)" />
                        <ToggleSwitch on={newEvent.dmOnly} onToggle={()=>setNewEvent(p=>({...p,dmOnly:!p.dmOnly}))} label="DM Only" />
                        <div style={{ display:"flex", gap:8 }}>
                          <CrimsonBtn small onClick={()=>addEvent(s.id)}><Plus size={10}/> Add</CrimsonBtn>
                          <CrimsonBtn small secondary onClick={()=>setAddingEvent(null)}><X size={10}/> Cancel</CrimsonBtn>
                        </div>
                      </div>
                    ) : (
                      <LinkBtn onClick={()=>setAddingEvent(s.id)}><Plus size={10}/> Add Event</LinkBtn>
                    )}
                  </div>}
                </div>}
              </Section>
          );
          if (narrow) {
            return (
              <div key={s.id} style={{ marginBottom: compactLayout ? 14 : 18, position:"relative" }}>
                <div style={{
                  position:"absolute", left: compactLayout ? -22 : -28, top: compactLayout ? 22 : 26,
                  width: compactLayout ? 20 : 24, height:2, background:T.crimsonBorder, borderRadius:1, opacity:0.85,
                }}/>
                <div style={{ position:"absolute", left: compactLayout ? -34 : -40, top: compactLayout ? 14 : 18,
                  width: compactLayout ? 14 : 18, height: compactLayout ? 14 : 18, borderRadius:"50%",
                  background: isLatest ? T.crimson : T.bgCard,
                  border:`2px solid ${isLatest ? T.crimson : T.crimsonBorder}`,
                  boxShadow: isLatest ? `0 0 0 4px ${T.crimsonSoft}, 0 2px 8px rgba(0,0,0,0.25)` : "0 2px 6px rgba(0,0,0,0.15)",
                  zIndex:2,
                }}/>
                {sessionCard}
              </div>
            );
          }
          return (
            <div key={s.id} style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 48px minmax(0,1fr)", alignItems:"start", marginBottom: compactLayout ? 16 : 22, position:"relative", zIndex:1 }}>
              {onLeft ? (
                <>
                  <div style={{ display:"flex", justifyContent:"flex-end", paddingRight:8, paddingTop:4 }}>
                    <div style={{ width:"100%", maxWidth:488 }}>{sessionCard}</div>
                  </div>
                  {timelineDot}
                  <div />
                </>
              ) : (
                <>
                  <div />
                  {timelineDot}
                  <div style={{ display:"flex", justifyContent:"flex-start", paddingLeft:8, paddingTop:4 }}>
                    <div style={{ width:"100%", maxWidth:488 }}>{sessionCard}</div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

// Register for lazy-loader
window.CampaignTimelineView = TimelineView;
