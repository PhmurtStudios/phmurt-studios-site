/* ═══════════════════════════════════════════════════════════════════════════
   CAMPAIGN MANAGER — Initiative Tracker (lazy-loaded module)
   ═══════════════════════════════════════════════════════════════════════════
   Combat initiative tracker with turn order, HP tracking, conditions,
   and round counter. Data stored in campaign.data.initiative.
   ═══════════════════════════════════════════════════════════════════════════ */

const T = window.__PHMURT_THEME || {};
try { if (window.T) Object.assign(T, window.T); } catch(e) {}
if (!T.bg) T.bg = "var(--bg)";
if (!T.bgCard) T.bgCard = "var(--bg-card)";
if (!T.text) T.text = "var(--text)";
if (!T.textMuted) T.textMuted = "var(--text-dim)";
if (!T.textFaint) T.textFaint = "var(--text-faint)";
if (!T.crimson) T.crimson = "var(--crimson)";
if (!T.crimsonBorder) T.crimsonBorder = "var(--crimson-border)";
if (!T.gold) T.gold = "var(--gold)";
if (!T.border) T.border = "var(--border)";
if (!T.heading) T.heading = "'Cinzel', serif";
if (!T.body) T.body = "'Spectral', serif";
if (!T.ui) T.ui = "'Cinzel', serif";

const { useState, useCallback, useRef, useMemo } = React;
const Icons = window.LucideReact || {};

/* ── Condition Definitions ─────────────────────────────────────── */
const CONDITIONS = [
  { id: "blinded",       label: "Blinded",       icon: "🚫", color: "#808080" },
  { id: "charmed",       label: "Charmed",       icon: "💗", color: "#e88db4" },
  { id: "deafened",      label: "Deafened",      icon: "🔇", color: "#808080" },
  { id: "frightened",    label: "Frightened",    icon: "😨", color: "#a87c5c" },
  { id: "grappled",      label: "Grappled",      icon: "🤝", color: "#6ba85c" },
  { id: "incapacitated", label: "Incapacitated", icon: "💫", color: "#8a5ca8" },
  { id: "invisible",     label: "Invisible",     icon: "👻", color: "#5c9ba8" },
  { id: "paralyzed",     label: "Paralyzed",     icon: "⚡", color: "#a8a35c" },
  { id: "petrified",     label: "Petrified",     icon: "🪨", color: "#8a7c6f" },
  { id: "poisoned",      label: "Poisoned",      icon: "☠️", color: "#6ba85c" },
  { id: "prone",         label: "Prone",         icon: "⬇️", color: "#5c7ba8" },
  { id: "restrained",    label: "Restrained",    icon: "⛓️", color: "#a85c6b" },
  { id: "stunned",       label: "Stunned",       icon: "💥", color: "#d4433a" },
  { id: "unconscious",   label: "Unconscious",   icon: "💤", color: "#808080" },
  { id: "concentrating", label: "Concentrating", icon: "🎯", color: "#c792ea" },
];

/* ── Utility ───────────────────────────────────────────────────── */
function esc(v) {
  return String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ═══════════════════════════════════════════════════════════════════════════
   InitiativeTrackerView — Main Component
   ═══════════════════════════════════════════════════════════════════════════ */
function InitiativeTrackerView({ data, setData, viewRole }) {
  /* ── Local state for UI interactions ── */
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConditionPicker, setShowConditionPicker] = useState(null);
  const nameRef = useRef(null);

  /* ── Data accessors ── */
  const tracker = data.initiative || { combatants: [], round: 0, turn: 0, active: false };

  const update = useCallback(function(patch) {
    setData(function(prev) {
      return Object.assign({}, prev, {
        initiative: Object.assign({}, prev.initiative || { combatants: [], round: 0, turn: 0, active: false }, patch)
      });
    });
  }, [setData]);

  const combatants = tracker.combatants || [];
  const sorted = useMemo(function() {
    return combatants.slice().sort(function(a, b) {
      if (b.init !== a.init) return b.init - a.init;
      /* Tiebreaker: higher DEX mod wins */
      return (b.dexMod || 0) - (a.dexMod || 0);
    });
  }, [combatants]);

  /* ── Combatant CRUD ── */
  function addCombatant(e) {
    e.preventDefault();
    var form = e.target;
    var name = form.elements.cname.value.trim();
    var init = parseInt(form.elements.cinit.value, 10);
    var hp = parseInt(form.elements.chp.value, 10) || 0;
    var maxHp = parseInt(form.elements.cmaxhp.value, 10) || hp;
    var ac = parseInt(form.elements.cac.value, 10) || 10;
    var dexMod = parseInt(form.elements.cdex.value, 10) || 0;
    var type = form.elements.ctype.value || "enemy";

    if (!name) return;
    if (isNaN(init)) init = Math.floor(Math.random() * 20) + 1 + dexMod;

    var entry = {
      id: uid(),
      name: name,
      init: init,
      hp: hp,
      maxHp: maxHp,
      ac: ac,
      dexMod: dexMod,
      type: type,
      conditions: [],
      notes: "",
      deathSaves: { success: 0, fail: 0 }
    };

    var newList = combatants.concat([entry]);
    update({ combatants: newList });
    form.reset();
    setShowAddForm(false);
  }

  function removeCombatant(id) {
    update({ combatants: combatants.filter(function(c) { return c.id !== id; }) });
  }

  function updateCombatant(id, patch) {
    update({
      combatants: combatants.map(function(c) {
        return c.id === id ? Object.assign({}, c, patch) : c;
      })
    });
  }

  function adjustHp(id, amount) {
    var c = combatants.find(function(x) { return x.id === id; });
    if (!c) return;
    var newHp = Math.max(0, Math.min(c.maxHp || 999, c.hp + amount));
    updateCombatant(id, { hp: newHp });
  }

  function toggleCondition(id, condId) {
    var c = combatants.find(function(x) { return x.id === id; });
    if (!c) return;
    var conds = (c.conditions || []).slice();
    var idx = conds.indexOf(condId);
    if (idx >= 0) conds.splice(idx, 1); else conds.push(condId);
    updateCombatant(id, { conditions: conds });
    setShowConditionPicker(null);
  }

  /* ── Combat Flow ── */
  function startCombat() {
    update({ active: true, round: 1, turn: 0 });
  }

  function nextTurn() {
    var nextIdx = (tracker.turn + 1) % sorted.length;
    var newRound = nextIdx === 0 ? (tracker.round || 1) + 1 : tracker.round;
    update({ turn: nextIdx, round: newRound });
  }

  function prevTurn() {
    var prevIdx = tracker.turn - 1;
    var newRound = tracker.round;
    if (prevIdx < 0) {
      prevIdx = sorted.length - 1;
      newRound = Math.max(1, (tracker.round || 1) - 1);
    }
    update({ turn: prevIdx, round: newRound });
  }

  function endCombat() {
    update({ active: false, round: 0, turn: 0 });
  }

  function clearAll() {
    if (!confirm("Clear all combatants?")) return;
    update({ combatants: [], round: 0, turn: 0, active: false });
  }

  function rollAllInitiative() {
    var rolled = combatants.map(function(c) {
      var roll = Math.floor(Math.random() * 20) + 1 + (c.dexMod || 0);
      return Object.assign({}, c, { init: roll });
    });
    update({ combatants: rolled });
  }

  /* ── Inline HP Edit ── */
  function HpEditor({ c }) {
    const [amt, setAmt] = useState("");
    return (
      <div style={{ display:"flex", gap:4, alignItems:"center" }}>
        <button onClick={function() { adjustHp(c.id, -(parseInt(amt,10)||1)); setAmt(""); }}
          style={smallBtn("#d4433a")}>−</button>
        <input type="number" value={amt} onChange={function(e){ setAmt(e.target.value); }}
          placeholder="HP" style={{ width:42, padding:"3px 4px", background:"transparent", border:"1px solid "+T.border, borderRadius:3, color:T.text, fontFamily:T.body, fontSize:12, textAlign:"center" }} />
        <button onClick={function() { adjustHp(c.id, parseInt(amt,10)||1); setAmt(""); }}
          style={smallBtn("#6ba85c")}>+</button>
      </div>
    );
  }

  function smallBtn(color) {
    return { background:"transparent", border:"1px solid "+color, color:color, borderRadius:3, width:22, height:22, fontSize:14, fontWeight:"bold", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 };
  }

  /* ── Render ── */
  var activeId = tracker.active && sorted.length > 0 ? sorted[tracker.turn % sorted.length]?.id : null;

  return (
    <div style={{ padding:"32px 28px", maxWidth:900, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ fontFamily:T.heading, fontSize:20, color:T.text, margin:0 }}>Initiative Tracker</h2>
          <p style={{ fontFamily:T.body, fontSize:13, color:T.textMuted, margin:"4px 0 0" }}>
            {tracker.active ? "Round " + tracker.round + " · Turn " + ((tracker.turn % sorted.length) + 1) + " of " + sorted.length : "Set up your encounter and roll initiative"}
          </p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {!tracker.active && sorted.length >= 2 && (
            <button onClick={startCombat} style={actionBtn(T.crimson, true)}>⚔️ Start Combat</button>
          )}
          {tracker.active && (
            <>
              <button onClick={prevTurn} style={actionBtn(T.textMuted)}>← Prev</button>
              <button onClick={nextTurn} style={actionBtn(T.crimson, true)}>Next Turn →</button>
              <button onClick={endCombat} style={actionBtn(T.textFaint)}>End Combat</button>
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={function() { setShowAddForm(!showAddForm); }} style={actionBtn("#8b6914")}>
          + Add Combatant
        </button>
        {sorted.length > 0 && (
          <>
            <button onClick={rollAllInitiative} style={actionBtn(T.textMuted)}>🎲 Roll All Initiative</button>
            <button onClick={clearAll} style={actionBtn(T.textFaint)}>Clear All</button>
          </>
        )}
      </div>

      {/* Add Combatant Form */}
      {showAddForm && (
        <form onSubmit={addCombatant} style={{ background:T.bgCard, border:"1px solid "+T.border, borderRadius:6, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ fontFamily:T.heading, fontSize:11, letterSpacing:"2px", textTransform:"uppercase", color:T.crimson, marginBottom:12 }}>New Combatant</div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr", gap:10, alignItems:"end" }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input name="cname" ref={nameRef} required autoFocus placeholder="Goblin 1"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Initiative</label>
              <input name="cinit" type="number" placeholder="Auto"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>HP</label>
              <input name="chp" type="number" placeholder="0" defaultValue=""
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max HP</label>
              <input name="cmaxhp" type="number" placeholder="Same"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>AC</label>
              <input name="cac" type="number" placeholder="10" defaultValue="10"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>DEX Mod</label>
              <input name="cdex" type="number" placeholder="0" defaultValue="0"
                style={inputStyle} />
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:12, alignItems:"center" }}>
            <label style={labelStyle}>Type:</label>
            <select name="ctype" style={Object.assign({}, inputStyle, { width:120 })}>
              <option value="enemy">Enemy</option>
              <option value="player">Player</option>
              <option value="ally">Ally</option>
              <option value="lair">Lair Action</option>
            </select>
            <div style={{ flex:1 }} />
            <button type="button" onClick={function(){ setShowAddForm(false); }} style={actionBtn(T.textFaint)}>Cancel</button>
            <button type="submit" style={actionBtn(T.crimson, true)}>Add</button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {sorted.length === 0 && !showAddForm && (
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:48, marginBottom:16, opacity:0.3 }}>⚔️</div>
          <div style={{ fontFamily:T.heading, fontSize:16, color:T.textMuted, marginBottom:8 }}>No Combatants</div>
          <p style={{ fontFamily:T.body, fontSize:14, color:T.textFaint, marginBottom:20 }}>
            Add players and monsters to begin tracking initiative order.
          </p>
          <button onClick={function(){ setShowAddForm(true); }} style={actionBtn("#8b6914")}>+ Add First Combatant</button>
        </div>
      )}

      {/* Combatant List */}
      {sorted.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {sorted.map(function(c, idx) {
            var isActive = tracker.active && c.id === activeId;
            var isDead = c.hp <= 0 && c.maxHp > 0;
            var hpPct = c.maxHp > 0 ? Math.round((c.hp / c.maxHp) * 100) : 100;
            var hpColor = hpPct > 60 ? "#6ba85c" : hpPct > 25 ? "#a8a35c" : "#d4433a";
            var typeColors = { player:"#5c7ba8", ally:"#6ba85c", enemy:"#d4433a", lair:"#8a5ca8" };
            var typeColor = typeColors[c.type] || T.textMuted;
            var condObjs = (c.conditions || []).map(function(cid) {
              return CONDITIONS.find(function(cc) { return cc.id === cid; });
            }).filter(Boolean);

            return (
              <div key={c.id} style={{
                background: isActive ? "rgba(212,67,58,0.06)" : T.bgCard,
                border: "1px solid " + (isActive ? "rgba(212,67,58,0.3)" : T.border),
                borderRadius: 6,
                padding: "12px 16px",
                opacity: isDead ? 0.5 : 1,
                transition: "all 0.2s"
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                  {/* Left: Initiative + Name */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                    {/* Initiative badge */}
                    <div style={{
                      width:36, height:36, borderRadius:"50%",
                      background: isActive ? T.crimson : "rgba(255,255,255,0.04)",
                      border: "1px solid " + (isActive ? T.crimson : T.border),
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:T.heading, fontSize:14, fontWeight:"bold",
                      color: isActive ? "#fff" : T.text, flexShrink:0
                    }}>
                      {c.init}
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {isActive && <span style={{ fontFamily:T.heading, fontSize:8, letterSpacing:"2px", textTransform:"uppercase", color:T.crimson }}>ACTIVE</span>}
                        <div style={{ fontFamily:T.heading, fontSize:14, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {c.name}
                        </div>
                        <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", color:typeColor, border:"1px solid "+typeColor, padding:"1px 5px", borderRadius:3 }}>
                          {c.type}
                        </span>
                      </div>
                      {/* Conditions */}
                      <div style={{ display:"flex", gap:4, marginTop:3, flexWrap:"wrap" }}>
                        {condObjs.map(function(cond) {
                          return (
                            <span key={cond.id} title={cond.label}
                              onClick={function() { toggleCondition(c.id, cond.id); }}
                              style={{ cursor:"pointer", fontSize:11, padding:"1px 5px", borderRadius:3, background:"rgba(255,255,255,0.04)", border:"1px solid "+cond.color, color:cond.color, fontFamily:T.ui, letterSpacing:"0.5px" }}>
                              {cond.icon} {cond.label}
                            </span>
                          );
                        })}
                        <button onClick={function() { setShowConditionPicker(showConditionPicker === c.id ? null : c.id); }}
                          style={{ background:"none", border:"1px dashed "+T.border, borderRadius:3, color:T.textFaint, fontSize:10, padding:"1px 5px", cursor:"pointer", fontFamily:T.ui }}>
                          + Condition
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stats + Actions */}
                  <div style={{ display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
                    {/* AC */}
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"1.5px", textTransform:"uppercase", color:T.textFaint }}>AC</div>
                      <div style={{ fontFamily:T.heading, fontSize:16, color:T.text }}>{c.ac}</div>
                    </div>
                    {/* HP bar */}
                    <div style={{ textAlign:"center", minWidth:80 }}>
                      <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"1.5px", textTransform:"uppercase", color:T.textFaint, marginBottom:2 }}>HP</div>
                      <div style={{ fontFamily:T.heading, fontSize:16, color:hpColor }}>{c.hp} / {c.maxHp || "—"}</div>
                      {c.maxHp > 0 && (
                        <div style={{ width:"100%", height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, marginTop:3 }}>
                          <div style={{ width:hpPct+"%", height:"100%", background:hpColor, borderRadius:2, transition:"width 0.3s" }} />
                        </div>
                      )}
                    </div>
                    {/* HP adjust */}
                    <HpEditor c={c} />
                    {/* Remove */}
                    <button onClick={function() { removeCombatant(c.id); }}
                      style={{ background:"none", border:"none", color:T.textFaint, cursor:"pointer", fontSize:14, padding:4 }}
                      title="Remove">✕</button>
                  </div>
                </div>

                {/* Condition picker dropdown */}
                {showConditionPicker === c.id && (
                  <div style={{ marginTop:10, padding:10, background:"rgba(0,0,0,0.2)", borderRadius:4, display:"flex", flexWrap:"wrap", gap:6 }}>
                    {CONDITIONS.map(function(cond) {
                      var has = (c.conditions || []).indexOf(cond.id) >= 0;
                      return (
                        <button key={cond.id}
                          onClick={function() { toggleCondition(c.id, cond.id); }}
                          style={{
                            background: has ? cond.color : "transparent",
                            border: "1px solid " + cond.color,
                            color: has ? "#fff" : cond.color,
                            borderRadius: 4, padding:"4px 8px", cursor:"pointer",
                            fontFamily:T.ui, fontSize:10, letterSpacing:"0.5px"
                          }}>
                          {cond.icon} {cond.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Combat Summary Footer */}
      {tracker.active && sorted.length > 0 && (
        <div style={{ marginTop:20, padding:"12px 16px", background:T.bgCard, border:"1px solid "+T.border, borderRadius:6, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div style={{ fontFamily:T.body, fontSize:13, color:T.textMuted }}>
            Round <strong style={{ color:T.text }}>{tracker.round}</strong> · {sorted.filter(function(c){ return c.hp > 0 || c.maxHp === 0; }).length} combatants active · {sorted.filter(function(c){ return c.hp <= 0 && c.maxHp > 0; }).length} down
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={prevTurn} style={actionBtn(T.textMuted)}>← Prev</button>
            <button onClick={nextTurn} style={actionBtn(T.crimson, true)}>Next Turn →</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared Style Helpers ─────────────────────────────────────── */
var labelStyle = { display:"block", fontFamily:T.ui || "'Cinzel',serif", fontSize:8, letterSpacing:"1.5px", textTransform:"uppercase", color:T.textFaint || "#6b5e50", marginBottom:4 };
var inputStyle = { width:"100%", padding:"7px 8px", background:"transparent", border:"1px solid "+(T.border||"rgba(255,255,255,0.11)"), borderRadius:4, color:T.text||"#f2e8d6", fontFamily:T.body||"'Spectral',serif", fontSize:13 };

function actionBtn(color, filled) {
  return {
    fontFamily: T.ui || "'Cinzel',serif",
    fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase",
    padding: "7px 16px", borderRadius: 4, cursor: "pointer",
    background: filled ? color : "transparent",
    border: "1px solid " + color,
    color: filled ? "#fff" : color,
    transition: "all 0.15s"
  };
}

/* ── Register globally ─────────────────────────────────────────── */
window.CampaignInitiativeView = InitiativeTrackerView;
