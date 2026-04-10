const T = window.__PHMURT_THEME || {};
try { if (window.T) Object.assign(T, window.T); } catch(e) {}
if (!T.bg) T.bg = "var(--bg)";
if (!T.bgNav) T.bgNav = "var(--bg-nav)";
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

/* ═══════════════════════════════════════════════════════════════════════════
   COLOR MAPS
   ═══════════════════════════════════════════════════════════════════════════ */

const CRColors = {
  0: "#8a7c6f", 0.125: "#8a7c6f", 0.25: "#8a7c6f", 0.5: "#8a7c6f",
  1: "#8a7c6f", 2: "#6ba85c", 3: "#5c9ba8", 4: "#5c7ba8",
  5: "#6b5ca8", 6: "#8a5ca8", 7: "#a85c6b", 8: "#a87c5c", 9: "#a8a35c",
  10: "#d4433a", 11: "#d4433a", 12: "#d4433a", 13: "#d4433a", 14: "#d4433a",
  15: "#d4433a", 16: "#d4433a", 17: "#b8860b", 18: "#b8860b", 19: "#b8860b",
  20: "#b8860b", 21: "#b8860b", 22: "#8b0000", 23: "#8b0000", 24: "#8b0000",
  25: "#8b0000", 26: "#8b0000", 27: "#8b0000", 28: "#8b0000", 29: "#8b0000", 30: "#8b0000"
};

const RarityColors = {
  common: "#808080", uncommon: "#6ba85c", rare: "#5c7ba8",
  very_rare: "#8a5ca8", legendary: "#a8a35c", artifact: "#d4433a"
};

const SchoolColors = {
  abjuration: "#8a5ca8", conjuration: "#a85c6b", divination: "#6ba85c",
  enchantment: "#a8a35c", evocation: "#d4433a", illusion: "#5c9ba8",
  necromancy: "#808080", transmutation: "#a87c5c"
};

const FeatCatColors = {
  combat: "#d4433a", magic: "#8a5ca8", skill: "#6ba85c",
  racial: "#a8a35c", defensive: "#5c7ba8", utility: "#a87c5c"
};

const AbilityNames = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

function calcModifier(score) {
  return Math.floor((score - 10) / 2);
}

function fmtMod(score) {
  const m = calcModifier(score);
  return (m >= 0 ? "+" : "") + m;
}

/* Shared inline-style helpers */
const inputStyle = {
  width: "100%", padding: "8px 10px", backgroundColor: T.bg, color: T.text,
  border: "1px solid " + T.border, borderRadius: "6px", boxSizing: "border-box",
  fontFamily: T.body, fontSize: "13px", transition: "border-color 0.2s"
};
const selectStyle = { ...inputStyle };
const labelStyle = {
  color: T.textMuted, fontSize: "11px", fontFamily: T.ui, letterSpacing: "0.05em",
  textTransform: "uppercase", display: "block", marginBottom: "4px"
};
const sectionHead = {
  color: T.gold, fontFamily: T.heading, fontSize: "13px", fontWeight: "bold",
  marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px"
};
const pillBtn = (active) => ({
  padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px",
  fontFamily: T.ui, border: active ? "1px solid " + T.gold : "1px solid " + T.border,
  backgroundColor: active ? T.gold : "transparent",
  color: active ? T.bg : T.textMuted, transition: "all 0.2s", whiteSpace: "nowrap"
});
const primaryBtn = {
  padding: "10px 18px", backgroundColor: T.crimson, color: T.bg, border: "none",
  borderRadius: "6px", cursor: "pointer", fontFamily: T.heading, fontSize: "13px",
  letterSpacing: "0.03em", transition: "opacity 0.2s"
};
const secondaryBtn = {
  padding: "10px 18px", backgroundColor: "transparent", color: T.text,
  border: "1px solid " + T.border, borderRadius: "6px", cursor: "pointer",
  fontFamily: T.heading, fontSize: "13px", transition: "all 0.2s"
};
const dangerBtn = {
  ...secondaryBtn, color: T.crimson, borderColor: T.crimson
};
const cardBase = {
  backgroundColor: T.bgCard, borderRadius: "8px", padding: "16px",
  cursor: "pointer", transition: "all 0.25s ease",
  border: "1px solid " + T.border, position: "relative", overflow: "hidden"
};

/* ═══════════════════════════════════════════════════════════════════════════
   STAT BLOCK PREVIEW (Monsters)
   ═══════════════════════════════════════════════════════════════════════════ */

function StatBlockPreview({ monster }) {
  const abilities = monster.abilities || [10,10,10,10,10,10];
  return (
    <div style={{
      fontFamily: "'Spectral', serif", fontSize: "13px", lineHeight: "1.6",
      backgroundColor: T.bgCard, border: "2px solid " + T.gold, borderRadius: "8px",
      padding: "20px", color: T.text, maxWidth: "500px"
    }}>
      <div style={{ borderBottom: "2px solid " + T.gold, paddingBottom: "8px", marginBottom: "12px" }}>
        <div style={{ fontFamily: T.heading, fontSize: "20px", color: T.gold, marginBottom: "2px" }}>
          {monster.name || "Unnamed"}
        </div>
        <div style={{ fontStyle: "italic", fontSize: "12px", color: T.textMuted }}>
          {monster.size ? monster.size.charAt(0).toUpperCase() + monster.size.slice(1) : "Medium"}{" "}
          {monster.type || "humanoid"}, {monster.alignment || "unaligned"}
        </div>
      </div>

      <div style={{ borderBottom: "1px solid " + T.border, paddingBottom: "8px", marginBottom: "8px", fontSize: "13px" }}>
        <div><strong style={{ color: T.crimson }}>Armor Class</strong> {monster.ac || 10}</div>
        <div><strong style={{ color: T.crimson }}>Hit Points</strong> {monster.hpFormula || "10"}</div>
        <div><strong style={{ color: T.crimson }}>Speed</strong> {monster.speed || "30 ft."}</div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px",
        textAlign: "center", borderBottom: "1px solid " + T.border, paddingBottom: "10px", marginBottom: "10px"
      }}>
        {AbilityNames.map((name, i) => (
          <div key={name}>
            <div style={{ fontFamily: T.heading, fontSize: "11px", color: T.gold, marginBottom: "2px" }}>{name}</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>{abilities[i] || 10}</div>
            <div style={{ fontSize: "11px", color: T.textMuted }}>({fmtMod(abilities[i] || 10)})</div>
          </div>
        ))}
      </div>

      {monster.skills && monster.skills.length > 0 && (
        <div style={{ fontSize: "12px", marginBottom: "4px" }}><strong style={{ color: T.crimson }}>Skills</strong> {monster.skills.join(", ")}</div>
      )}
      {monster.senses && <div style={{ fontSize: "12px", marginBottom: "4px" }}><strong style={{ color: T.crimson }}>Senses</strong> {monster.senses}</div>}
      {monster.languages && <div style={{ fontSize: "12px", marginBottom: "4px" }}><strong style={{ color: T.crimson }}>Languages</strong> {monster.languages}</div>}
      <div style={{ fontSize: "12px", marginBottom: "12px" }}>
        <strong style={{ color: T.crimson }}>Challenge</strong> {monster.cr || 1} ({monster.xp || 200} XP)
      </div>

      {monster.traits && monster.traits.length > 0 && (
        <div style={{ borderTop: "1px solid " + T.border, paddingTop: "10px", marginBottom: "10px" }}>
          {monster.traits.map((t, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <strong style={{ fontStyle: "italic" }}>{t.name || "Trait"}.</strong>{" "}
              <span style={{ fontSize: "12px", color: T.textMuted }}>{t.description || ""}</span>
            </div>
          ))}
        </div>
      )}

      {monster.actions && monster.actions.length > 0 && (
        <div style={{ borderTop: "2px solid " + T.crimson, paddingTop: "10px", marginBottom: "10px" }}>
          <div style={{ fontFamily: T.heading, fontSize: "16px", color: T.crimson, marginBottom: "8px" }}>Actions</div>
          {monster.actions.map((a, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <strong style={{ fontStyle: "italic" }}>{a.name || "Action"}.</strong>{" "}
              <span style={{ fontSize: "12px", color: T.textMuted }}>{a.description || ""}</span>
            </div>
          ))}
        </div>
      )}

      {monster.legendaryActions && monster.legendaryActions.length > 0 && (
        <div style={{ borderTop: "2px solid " + T.gold, paddingTop: "10px" }}>
          <div style={{ fontFamily: T.heading, fontSize: "16px", color: T.gold, marginBottom: "8px" }}>Legendary Actions</div>
          {monster.legendaryActions.map((la, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <strong style={{ fontStyle: "italic" }}>{la.name || "Action"}.</strong>{" "}
              <span style={{ fontSize: "12px", color: T.textMuted }}>{la.description || ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARD COMPONENTS — Visual cards for the library grid
   ═══════════════════════════════════════════════════════════════════════════ */

function MonsterCard({ monster, onExpand }) {
  const cr = monster.cr || 0;
  const crColor = CRColors[cr] || "#666";
  return (
    <div onClick={onExpand} style={{ ...cardBase, borderLeft: "3px solid " + crColor }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "15px", lineHeight: "1.3" }}>{monster.name}</h3>
        <div style={{
          backgroundColor: crColor, color: T.bg , padding: "3px 10px",
          borderRadius: "12px", fontSize: "11px", fontWeight: "bold",
          fontFamily: T.ui, whiteSpace: "nowrap", marginLeft: "8px"
        }}>CR {cr}</div>
      </div>
      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "8px", fontStyle: "italic" }}>
        {monster.size ? monster.size.charAt(0).toUpperCase() + monster.size.slice(1) : "Medium"} {monster.type || "humanoid"}, {monster.alignment || "unaligned"}
      </div>
      <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: T.text, marginBottom: "10px" }}>
        <span>AC {monster.ac || 10}</span>
        <span>HP {monster.hpFormula || "10"}</span>
        <span>{monster.speed || "30 ft."}</span>
      </div>
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {monster.description || "No description"}
      </div>
      {monster.legendaryActions && monster.legendaryActions.length > 0 && (
        <div style={{ marginTop: "8px", fontSize: "10px", color: T.gold, fontFamily: T.ui }}>LEGENDARY</div>
      )}
    </div>
  );
}

function ItemCard({ item, onExpand }) {
  const rarityColor = RarityColors[item.rarity] || "#666";
  return (
    <div onClick={onExpand} style={{ ...cardBase, borderLeft: "3px solid " + rarityColor }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "15px", lineHeight: "1.3" }}>{item.name}</h3>
        <div style={{
          backgroundColor: rarityColor, color: T.bg , padding: "3px 10px",
          borderRadius: "12px", fontSize: "11px", fontWeight: "bold",
          fontFamily: T.ui, whiteSpace: "nowrap", marginLeft: "8px"
        }}>{(item.rarity || "common").replace("_", " ").toUpperCase()}</div>
      </div>
      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "8px", fontStyle: "italic" }}>
        {item.type || "wondrous item"}
        {item.attunement && <span style={{ marginLeft: "8px", color: T.crimson, fontWeight: "bold" }}>Requires Attunement</span>}
      </div>
      {item.damage && <div style={{ fontSize: "12px", color: T.text, marginBottom: "6px" }}>Damage: {item.damage} {item.damageType || ""}</div>}
      {item.charges && <div style={{ fontSize: "12px", color: T.text, marginBottom: "6px" }}>Charges: {item.charges} {item.recharge ? "(" + item.recharge + ")" : ""}</div>}
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {item.description || "No description"}
      </div>
      {item.cursed && <div style={{ marginTop: "8px", fontSize: "10px", color: T.crimson, fontFamily: T.ui }}>CURSED</div>}
    </div>
  );
}

function SpellCard({ spell, onExpand }) {
  const schoolColor = SchoolColors[spell.school] || "#666";
  return (
    <div onClick={onExpand} style={{ ...cardBase, borderLeft: "3px solid " + schoolColor }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "15px", lineHeight: "1.3" }}>{spell.name}</h3>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {spell.concentration && <span style={{ fontSize: "10px", color: T.crimson, fontWeight: "bold", fontFamily: T.ui }}>CONC</span>}
          {spell.ritual && <span style={{ fontSize: "10px", color: "#6ba85c", fontWeight: "bold", fontFamily: T.ui }}>RIT</span>}
          <div style={{
            width: "30px", height: "30px", borderRadius: "50%", backgroundColor: schoolColor,
            color: T.bg, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: "bold", fontFamily: T.heading
          }}>{spell.level || 0}</div>
        </div>
      </div>
      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "8px", fontStyle: "italic" }}>
        {spell.level === 0 ? "Cantrip" : "Level " + spell.level} {(spell.school || "evocation").charAt(0).toUpperCase() + (spell.school || "evocation").slice(1)}
      </div>
      <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: T.text, marginBottom: "8px", flexWrap: "wrap" }}>
        <span>{spell.castingTime || "1 action"}</span>
        <span>{spell.range || "60 feet"}</span>
        <span>{spell.duration || "Instantaneous"}</span>
      </div>
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {spell.description || "No description"}
      </div>
    </div>
  );
}

function NPCCard({ npc, onExpand }) {
  return (
    <div onClick={onExpand} style={{ ...cardBase, borderLeft: "3px solid " + T.gold }}>
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "15px" }}>{npc.name}</h3>
      </div>
      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "6px", fontStyle: "italic" }}>
        {npc.race || "Human"} {npc.class ? npc.class + " " : ""}{npc.level ? "(Level " + npc.level + ")" : ""}
      </div>
      {npc.faction && <div style={{ fontSize: "11px", color: T.gold, marginBottom: "6px" }}>{npc.faction}</div>}
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {npc.personality || "No personality defined"}
      </div>
    </div>
  );
}

function ClassFeatureCard({ feature, onExpand }) {
  return (
    <div onClick={onExpand} style={{ ...cardBase, borderLeft: "3px solid " + T.crimson }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "15px", lineHeight: "1.3" }}>{feature.name}</h3>
        {feature.level && (
          <div style={{
            backgroundColor: T.crimson, color: T.bg , padding: "3px 10px",
            borderRadius: "12px", fontSize: "11px", fontWeight: "bold", fontFamily: T.ui
          }}>Lvl {feature.level}</div>
        )}
      </div>
      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "6px", fontStyle: "italic" }}>
        {feature.className || "Any Class"} {feature.featureType === "subclass" && feature.subclassName ? "- " + feature.subclassName : ""}
      </div>
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {feature.description || "No description"}
      </div>
    </div>
  );
}

function FeatCard({ feat, onExpand }) {
  const catColor = FeatCatColors[feat.category] || "#666";
  return (
    <div onClick={onExpand} style={{ ...cardBase, borderLeft: "3px solid " + catColor }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "15px", lineHeight: "1.3" }}>{feat.name}</h3>
        <div style={{
          backgroundColor: catColor, color: T.bg , padding: "3px 10px",
          borderRadius: "12px", fontSize: "11px", fontWeight: "bold",
          fontFamily: T.ui, whiteSpace: "nowrap", marginLeft: "8px"
        }}>{(feat.category || "general").toUpperCase()}</div>
      </div>
      {feat.prerequisite && feat.prerequisite !== "None" && (
        <div style={{ fontSize: "11px", color: T.crimson, marginBottom: "6px" }}>Prerequisite: {feat.prerequisite}</div>
      )}
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {feat.description || "No description"}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CREATOR MODALS
   ═══════════════════════════════════════════════════════════════════════════ */

function ModalShell({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: T.bgNav, display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000, padding: "20px", boxSizing: "border-box"
    }}>
      <div style={{
        backgroundColor: T.bgCard, border: "2px solid " + T.gold, borderRadius: "12px",
        padding: "24px", maxHeight: "90vh", overflowY: "auto", maxWidth: "720px", width: "100%",
        boxShadow: "0 20px 60px " + T.bgNav
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid " + T.border, paddingBottom: "12px" }}>
          <h2 style={{ color: T.gold, fontFamily: T.heading, margin: 0, fontSize: "22px" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: T.textMuted, fontSize: "24px",
            cursor: "pointer", padding: "4px 8px", lineHeight: 1
          }} aria-label="Close">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TemplatePickerGrid({ templates, onSelect }) {
  const entries = Object.entries(templates);
  if (!entries.length) return null;
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={sectionHead}>
        <span style={{ fontSize: "16px" }}>&#9670;</span> Quick Start from Template
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
        {entries.map(([key, tmpl]) => (
          <button key={key} onClick={() => onSelect(key)} style={{
            padding: "10px", backgroundColor: T.bg, border: "1px solid " + T.border,
            borderRadius: "6px", cursor: "pointer", textAlign: "left", transition: "all 0.2s",
            color: T.text
          }}>
            <div style={{ fontSize: "12px", fontFamily: T.heading, color: T.gold, marginBottom: "4px" }}>
              {(tmpl.name || key).replace(/_/g, " ")}
            </div>
            <div style={{ fontSize: "10px", color: T.textFaint, lineHeight: "1.3" }}>
              {tmpl.type || tmpl.school || tmpl.className || tmpl.category || tmpl.race || ""}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FeatureListEditor({ label, items, onChange }) {
  const add = () => onChange([...(items || []), { name: "", description: "" }]);
  const update = (idx, field, val) => {
    const arr = [...items]; arr[idx] = { ...arr[idx], [field]: val }; onChange(arr);
  };
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={sectionHead}><span style={{ fontSize: "14px" }}>&#9670;</span> {label}</div>
        <button onClick={add} style={{ ...primaryBtn, padding: "4px 10px", fontSize: "11px" }}>+ Add</button>
      </div>
      {items && items.map((f, idx) => (
        <div key={idx} style={{
          marginBottom: "8px", padding: "10px", backgroundColor: T.bg,
          borderRadius: "6px", borderLeft: "3px solid " + T.gold
        }}>
          <input type="text" value={f.name} placeholder="Name" onChange={e => update(idx, "name", e.target.value)}
            style={{ ...inputStyle, marginBottom: "6px", fontSize: "12px" }} />
          <textarea value={f.description} placeholder="Description" onChange={e => update(idx, "description", e.target.value)}
            style={{ ...inputStyle, minHeight: "50px", fontSize: "12px", resize: "vertical" }} />
          <button onClick={() => remove(idx)} style={{ ...dangerBtn, padding: "3px 8px", fontSize: "10px", marginTop: "6px" }}>Remove</button>
        </div>
      ))}
    </div>
  );
}

function MonsterCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", size: "medium", type: "", alignment: "unaligned", description: "",
    ac: 10, hpFormula: "1d8", speed: "30 ft.",
    abilities: [10, 10, 10, 10, 10, 10], skills: [], senses: "", languages: "",
    traits: [], actions: [], legendaryActions: [], cr: 1, xp: 200
  });

  const applyTemplate = (key) => {
    const tmpl = templates && templates[key];
    if (!tmpl) return;
    setForm(f => ({
      ...f,
      name: tmpl.name || f.name,
      size: tmpl.size ? tmpl.size.toLowerCase() : f.size,
      type: tmpl.type || f.type,
      alignment: tmpl.alignment || f.alignment,
      ac: tmpl.ac || f.ac,
      hp: tmpl.hp || f.hp,
      hpFormula: tmpl.hp ? String(tmpl.hp) : f.hpFormula,
      speed: tmpl.speed || f.speed,
      abilities: tmpl.stats ? [tmpl.stats.str, tmpl.stats.dex, tmpl.stats.con, tmpl.stats.int, tmpl.stats.wis, tmpl.stats.cha] : f.abilities,
      senses: tmpl.senses || f.senses,
      languages: tmpl.languages || f.languages,
      cr: tmpl.cr != null ? tmpl.cr : f.cr,
      xp: tmpl.xp || f.xp,
      description: tmpl.description || f.description,
      traits: (tmpl.traits || []).map(t => ({ name: t.name, description: t.desc || t.description || "" })),
      actions: (tmpl.actions || []).map(a => ({ name: a.name, description: a.desc || a.description || "" })),
      legendaryActions: (tmpl.legendaryActions || []).map(la => ({ name: la.name, description: la.desc || la.description || "" }))
    }));
  };

  const save = () => { onSave(form); onClose(); };
  const setAbility = (i, v) => { const a = [...form.abilities]; a[i] = parseInt(v) || 10; setForm({ ...form, abilities: a }); };

  return (
    <ModalShell title={initialData ? "Edit Monster" : "Create Monster"} onClose={onClose}>
      <TemplatePickerGrid templates={templates} onSelect={applyTemplate} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Type</label><input type="text" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="humanoid, beast, undead..." style={inputStyle} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Size</label>
          <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} style={selectStyle}>
            {["tiny","small","medium","large","huge","gargantuan"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>AC</label><input type="number" value={form.ac} onChange={e => setForm({ ...form, ac: parseInt(e.target.value) || 10 })} style={inputStyle} /></div>
        <div><label style={labelStyle}>HP Formula</label><input type="text" value={form.hpFormula} onChange={e => setForm({ ...form, hpFormula: e.target.value })} placeholder="4d8+8" style={inputStyle} /></div>
        <div><label style={labelStyle}>Speed</label><input type="text" value={form.speed} onChange={e => setForm({ ...form, speed: e.target.value })} placeholder="30 ft." style={inputStyle} /></div>
      </div>

      <div style={sectionHead}><span style={{ fontSize: "14px" }}>&#9670;</span> Ability Scores</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px", marginBottom: "16px" }}>
        {AbilityNames.map((name, i) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: T.gold, fontFamily: T.ui, marginBottom: "3px" }}>{name}</div>
            <input type="number" value={form.abilities[i]} onChange={e => setAbility(i, e.target.value)}
              style={{ ...inputStyle, textAlign: "center", padding: "6px 4px" }} />
            <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "2px" }}>{fmtMod(form.abilities[i])}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>CR</label><input type="number" step="0.125" value={form.cr} onChange={e => setForm({ ...form, cr: parseFloat(e.target.value) || 0 })} style={inputStyle} /></div>
        <div><label style={labelStyle}>XP</label><input type="number" value={form.xp} onChange={e => setForm({ ...form, xp: parseInt(e.target.value) || 0 })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Alignment</label><input type="text" value={form.alignment} onChange={e => setForm({ ...form, alignment: e.target.value })} style={inputStyle} /></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Senses</label><input type="text" value={form.senses} onChange={e => setForm({ ...form, senses: e.target.value })} placeholder="darkvision 60 ft." style={inputStyle} /></div>
        <div><label style={labelStyle}>Languages</label><input type="text" value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} style={inputStyle} /></div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} />
      </div>

      <FeatureListEditor label="Traits" items={form.traits} onChange={traits => setForm({ ...form, traits })} />
      <FeatureListEditor label="Actions" items={form.actions} onChange={actions => setForm({ ...form, actions })} />
      <FeatureListEditor label="Legendary Actions" items={form.legendaryActions} onChange={legendaryActions => setForm({ ...form, legendaryActions })} />

      <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderTop: "1px solid " + T.border, paddingTop: "16px" }}>
        <button onClick={save} style={{ ...primaryBtn, flex: 1 }}>Save Monster</button>
        <button onClick={onClose} style={{ ...secondaryBtn, flex: 1 }}>Cancel</button>
      </div>
    </ModalShell>
  );
}

function ItemCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", type: "wondrous item", rarity: "common", attunement: false,
    description: "", damage: "", damageType: "", ac: "", charges: "", recharge: "",
    lore: "", cursed: false, curseEffect: "", value: "", weight: ""
  });

  const applyTemplate = (key) => {
    const tmpl = templates && templates[key];
    if (tmpl) setForm(f => ({ ...f, ...tmpl, recharge: tmpl.rechargeCondition || f.recharge }));
  };
  const save = () => { onSave(form); onClose(); };

  return (
    <ModalShell title={initialData ? "Edit Item" : "Create Item"} onClose={onClose}>
      <TemplatePickerGrid templates={templates} onSelect={applyTemplate} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={selectStyle}>
            {["wondrous item","weapon","armor","ring","wand","potion","scroll","accessory"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Rarity</label>
          <select value={form.rarity} onChange={e => setForm({ ...form, rarity: e.target.value })} style={selectStyle}>
            {Object.keys(RarityColors).map(r => <option key={r} value={r}>{r.replace("_"," ").toUpperCase()}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", paddingTop: "20px" }}>
          <label style={{ color: T.text, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.attunement} onChange={e => setForm({ ...form, attunement: e.target.checked })} />
            Requires Attunement
          </label>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Damage</label><input type="text" value={form.damage} onChange={e => setForm({ ...form, damage: e.target.value })} placeholder="1d8" style={inputStyle} /></div>
        <div><label style={labelStyle}>Damage Type</label><input type="text" value={form.damageType} onChange={e => setForm({ ...form, damageType: e.target.value })} placeholder="slashing" style={inputStyle} /></div>
        <div><label style={labelStyle}>Charges</label><input type="text" value={form.charges} onChange={e => setForm({ ...form, charges: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Recharge</label><input type="text" value={form.recharge} onChange={e => setForm({ ...form, recharge: e.target.value })} placeholder="at dawn" style={inputStyle} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Value (gp)</label><input type="text" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Weight (lbs)</label><input type="text" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} style={inputStyle} /></div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Lore / Flavor Text</label>
        <textarea value={form.lore} onChange={e => setForm({ ...form, lore: e.target.value })} style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} />
      </div>
      <div style={{
        marginBottom: "16px", padding: "14px", backgroundColor: T.crimsonDim,
        borderRadius: "8px", borderLeft: "3px solid " + T.crimson
      }}>
        <label style={{ color: T.text, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input type="checkbox" checked={form.cursed} onChange={e => setForm({ ...form, cursed: e.target.checked })} />
          Cursed Item
        </label>
        {form.cursed && (
          <textarea value={form.curseEffect} onChange={e => setForm({ ...form, curseEffect: e.target.value })}
            placeholder="Describe the curse effect..." style={{ ...inputStyle, marginTop: "10px", minHeight: "50px", resize: "vertical" }} />
        )}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderTop: "1px solid " + T.border, paddingTop: "16px" }}>
        <button onClick={save} style={{ ...primaryBtn, flex: 1 }}>Save Item</button>
        <button onClick={onClose} style={{ ...secondaryBtn, flex: 1 }}>Cancel</button>
      </div>
    </ModalShell>
  );
}

function SpellCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", level: 1, school: "evocation", ritual: false, concentration: false,
    castingTime: "1 action", range: "60 feet", duration: "Instantaneous",
    components: { v: false, s: false, m: false }, materialComponent: "",
    description: "", damage: "", damageType: "", saveType: "", higherLevels: "",
    classes: []
  });

  const applyTemplate = (key) => {
    const tmpl = templates && templates[key];
    if (tmpl) setForm(f => ({
      ...f, ...tmpl,
      components: tmpl.components || f.components,
      materialComponent: (tmpl.components && tmpl.components.materialDesc) || f.materialComponent,
      classes: tmpl.classes || f.classes
    }));
  };
  const save = () => { onSave(form); onClose(); };

  const schools = ["abjuration","conjuration","divination","enchantment","evocation","illusion","necromancy","transmutation"];
  const spellClasses = ["Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Warlock","Wizard"];

  return (
    <ModalShell title={initialData ? "Edit Spell" : "Create Spell"} onClose={onClose}>
      <TemplatePickerGrid templates={templates} onSelect={applyTemplate} />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Level (0=Cantrip)</label>
          <select value={form.level} onChange={e => setForm({ ...form, level: parseInt(e.target.value) })} style={selectStyle}>
            {[0,1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l === 0 ? "Cantrip" : l}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>School</label>
          <select value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} style={selectStyle}>
            {schools.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingTop: "20px" }}>
          <label style={{ color: T.text, fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.ritual} onChange={e => setForm({ ...form, ritual: e.target.checked })} /> Ritual
          </label>
          <label style={{ color: T.text, fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.concentration} onChange={e => setForm({ ...form, concentration: e.target.checked })} /> Concentration
          </label>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Casting Time</label><input type="text" value={form.castingTime} onChange={e => setForm({ ...form, castingTime: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Range</label><input type="text" value={form.range} onChange={e => setForm({ ...form, range: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Duration</label><input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inputStyle} /></div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Components</label>
        <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
          {["v","s","m"].map(c => (
            <label key={c} style={{ color: T.text, fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.components[c]} onChange={e => setForm({ ...form, components: { ...form.components, [c]: e.target.checked } })} />
              {c === "v" ? "Verbal" : c === "s" ? "Somatic" : "Material"}
            </label>
          ))}
        </div>
        {form.components.m && (
          <input type="text" value={form.materialComponent} onChange={e => setForm({ ...form, materialComponent: e.target.value })}
            placeholder="Material component description" style={{ ...inputStyle, marginTop: "8px" }} />
        )}
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Damage</label><input type="text" value={form.damage} onChange={e => setForm({ ...form, damage: e.target.value })} placeholder="3d6" style={inputStyle} /></div>
        <div><label style={labelStyle}>Damage Type</label><input type="text" value={form.damageType} onChange={e => setForm({ ...form, damageType: e.target.value })} placeholder="fire" style={inputStyle} /></div>
        <div><label style={labelStyle}>Save Type</label>
          <select value={form.saveType} onChange={e => setForm({ ...form, saveType: e.target.value })} style={selectStyle}>
            <option value="">None</option>
            {["STR","DEX","CON","INT","WIS","CHA"].map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>At Higher Levels</label>
        <textarea value={form.higherLevels} onChange={e => setForm({ ...form, higherLevels: e.target.value })} style={{ ...inputStyle, minHeight: "50px", resize: "vertical" }} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Available to Classes</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "6px" }}>
          {spellClasses.map(cls => (
            <label key={cls} style={{ color: T.text, fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={(form.classes || []).includes(cls)} onChange={e => {
                setForm({ ...form, classes: e.target.checked ? [...(form.classes || []), cls] : (form.classes || []).filter(c => c !== cls) });
              }} /> {cls}
            </label>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderTop: "1px solid " + T.border, paddingTop: "16px" }}>
        <button onClick={save} style={{ ...primaryBtn, flex: 1 }}>Save Spell</button>
        <button onClick={onClose} style={{ ...secondaryBtn, flex: 1 }}>Cancel</button>
      </div>
    </ModalShell>
  );
}

function NPCCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", race: "Human", class: "", level: 1, background: "",
    personality: "", ideal: "", bond: "", flaw: "", appearance: "", backstory: "",
    abilities: [10,10,10,10,10,10], equipment: "", spells: "", motivation: "", faction: ""
  });

  const applyTemplate = (key) => {
    const tmpl = templates && templates[key];
    if (tmpl) setForm(f => ({
      ...f, ...tmpl,
      abilities: tmpl.stats ? [tmpl.stats.str,tmpl.stats.dex,tmpl.stats.con,tmpl.stats.int,tmpl.stats.wis,tmpl.stats.cha] : f.abilities,
      motivation: tmpl.secretMotivation || f.motivation,
      equipment: Array.isArray(tmpl.equipment) ? tmpl.equipment.join(", ") : f.equipment,
      spells: Array.isArray(tmpl.spells) ? tmpl.spells.join(", ") : f.spells
    }));
  };
  const save = () => { onSave(form); onClose(); };
  const setAbility = (i, v) => { const a = [...form.abilities]; a[i] = parseInt(v) || 10; setForm({ ...form, abilities: a }); };

  return (
    <ModalShell title={initialData ? "Edit NPC" : "Create NPC"} onClose={onClose}>
      <TemplatePickerGrid templates={templates} onSelect={applyTemplate} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Race</label><input type="text" value={form.race} onChange={e => setForm({ ...form, race: e.target.value })} style={inputStyle} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Class</label><input type="text" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} placeholder="Fighter" style={inputStyle} /></div>
        <div><label style={labelStyle}>Level</label><input type="number" value={form.level} onChange={e => setForm({ ...form, level: parseInt(e.target.value) || 1 })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Background</label><input type="text" value={form.background} onChange={e => setForm({ ...form, background: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Faction</label><input type="text" value={form.faction} onChange={e => setForm({ ...form, faction: e.target.value })} style={inputStyle} /></div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Appearance</label>
        <textarea value={form.appearance} onChange={e => setForm({ ...form, appearance: e.target.value })} style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} />
      </div>

      <div style={sectionHead}><span style={{ fontSize: "14px" }}>&#9670;</span> Ability Scores</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px", marginBottom: "16px" }}>
        {AbilityNames.map((name, i) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: T.gold, fontFamily: T.ui, marginBottom: "3px" }}>{name}</div>
            <input type="number" value={form.abilities[i]} onChange={e => setAbility(i, e.target.value)}
              style={{ ...inputStyle, textAlign: "center", padding: "6px 4px" }} />
            <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "2px" }}>{fmtMod(form.abilities[i])}</div>
          </div>
        ))}
      </div>

      <div style={sectionHead}><span style={{ fontSize: "14px" }}>&#9670;</span> Personality Traits</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Personality</label><input type="text" value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Ideal</label><input type="text" value={form.ideal} onChange={e => setForm({ ...form, ideal: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Bond</label><input type="text" value={form.bond} onChange={e => setForm({ ...form, bond: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Flaw</label><input type="text" value={form.flaw} onChange={e => setForm({ ...form, flaw: e.target.value })} style={inputStyle} /></div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Backstory</label>
        <textarea value={form.backstory} onChange={e => setForm({ ...form, backstory: e.target.value })} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Equipment (comma-separated)</label><input type="text" value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Spells (comma-separated)</label><input type="text" value={form.spells} onChange={e => setForm({ ...form, spells: e.target.value })} style={inputStyle} /></div>
      </div>
      <div style={{
        marginBottom: "16px", padding: "14px", backgroundColor: T.crimsonDim,
        borderRadius: "8px", borderLeft: "3px solid " + T.gold
      }}>
        <label style={{ ...labelStyle, color: T.gold }}>Secret Motivation (DM Only)</label>
        <textarea value={form.motivation} onChange={e => setForm({ ...form, motivation: e.target.value })}
          placeholder="What does this NPC really want?" style={{ ...inputStyle, minHeight: "50px", resize: "vertical" }} />
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderTop: "1px solid " + T.border, paddingTop: "16px" }}>
        <button onClick={save} style={{ ...primaryBtn, flex: 1 }}>Save NPC</button>
        <button onClick={onClose} style={{ ...secondaryBtn, flex: 1 }}>Cancel</button>
      </div>
    </ModalShell>
  );
}

function ClassFeatureCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", featureType: "class", className: "", subclassName: "",
    level: 1, description: "", mechanics: "", prerequisite: "None"
  });

  const applyTemplate = (key) => {
    const tmpl = templates && templates[key];
    if (tmpl) setForm(f => ({ ...f, ...tmpl }));
  };
  const save = () => { onSave(form); onClose(); };
  const classes = ["Barbarian","Bard","Cleric","Druid","Fighter","Monk","Paladin","Ranger","Rogue","Sorcerer","Warlock","Wizard"];

  return (
    <ModalShell title={initialData ? "Edit Class Feature" : "Create Class Feature"} onClose={onClose}>
      <TemplatePickerGrid templates={templates} onSelect={applyTemplate} />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Feature Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Type</label>
          <select value={form.featureType} onChange={e => setForm({ ...form, featureType: e.target.value })} style={selectStyle}>
            <option value="class">Class Feature</option>
            <option value="subclass">Subclass Feature</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Class</label>
          <select value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} style={selectStyle}>
            <option value="">Any</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {form.featureType === "subclass" && (
          <div><label style={labelStyle}>Subclass Name</label><input type="text" value={form.subclassName} onChange={e => setForm({ ...form, subclassName: e.target.value })} placeholder="Path of..." style={inputStyle} /></div>
        )}
        <div><label style={labelStyle}>Level</label><input type="number" min="1" max="20" value={form.level} onChange={e => setForm({ ...form, level: parseInt(e.target.value) || 1 })} style={inputStyle} /></div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Prerequisite</label>
        <input type="text" value={form.prerequisite} onChange={e => setForm({ ...form, prerequisite: e.target.value })} style={inputStyle} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Mechanics / Rules Text</label>
        <textarea value={form.mechanics} onChange={e => setForm({ ...form, mechanics: e.target.value })}
          placeholder="Describe the exact mechanical effect: actions, saving throws, damage, durations, etc."
          style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderTop: "1px solid " + T.border, paddingTop: "16px" }}>
        <button onClick={save} style={{ ...primaryBtn, flex: 1 }}>Save Feature</button>
        <button onClick={onClose} style={{ ...secondaryBtn, flex: 1 }}>Cancel</button>
      </div>
    </ModalShell>
  );
}

function FeatCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", category: "combat", prerequisite: "None",
    description: "", benefits: [""], source: "homebrew"
  });

  const applyTemplate = (key) => {
    const tmpl = templates && templates[key];
    if (tmpl) setForm(f => ({ ...f, ...tmpl }));
  };
  const save = () => { onSave(form); onClose(); };
  const updateBenefit = (idx, val) => {
    const b = [...form.benefits]; b[idx] = val; setForm({ ...form, benefits: b });
  };
  const addBenefit = () => setForm({ ...form, benefits: [...form.benefits, ""] });
  const removeBenefit = (idx) => setForm({ ...form, benefits: form.benefits.filter((_, i) => i !== idx) });

  return (
    <ModalShell title={initialData ? "Edit Feat" : "Create Feat"} onClose={onClose}>
      <TemplatePickerGrid templates={templates} onSelect={applyTemplate} />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Feat Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={selectStyle}>
            {Object.keys(FeatCatColors).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Prerequisite</label>
        <input type="text" value={form.prerequisite} onChange={e => setForm({ ...form, prerequisite: e.target.value })} placeholder="None, or a specific requirement" style={inputStyle} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={sectionHead}><span style={{ fontSize: "14px" }}>&#9670;</span> Benefits</div>
          <button onClick={addBenefit} style={{ ...primaryBtn, padding: "4px 10px", fontSize: "11px" }}>+ Add Benefit</button>
        </div>
        {form.benefits.map((b, idx) => (
          <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "start" }}>
            <div style={{ color: T.gold, fontFamily: T.heading, fontSize: "14px", paddingTop: "8px", minWidth: "20px" }}>{idx + 1}.</div>
            <textarea value={b} onChange={e => updateBenefit(idx, e.target.value)}
              style={{ ...inputStyle, flex: 1, minHeight: "40px", resize: "vertical" }} />
            {form.benefits.length > 1 && (
              <button onClick={() => removeBenefit(idx)} style={{ ...dangerBtn, padding: "6px 8px", fontSize: "11px", marginTop: "2px" }}>&times;</button>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderTop: "1px solid " + T.border, paddingTop: "16px" }}>
        <button onClick={save} style={{ ...primaryBtn, flex: 1 }}>Save Feat</button>
        <button onClick={onClose} style={{ ...secondaryBtn, flex: 1 }}>Cancel</button>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DETAIL VIEWS — Expanded view when clicking a card
   ═══════════════════════════════════════════════════════════════════════════ */

function DetailToolbar({ onBack, onEdit, onDuplicate, onDelete, onExportJSON }) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
      <button onClick={onBack} style={{ ...secondaryBtn, padding: "8px 14px" }}>&#8592; Back</button>
      <div style={{ flex: 1 }} />
      <button onClick={onEdit} style={{ ...primaryBtn, padding: "8px 14px" }}>Edit</button>
      <button onClick={onDuplicate} style={{ ...secondaryBtn, padding: "8px 14px" }}>Duplicate</button>
      <button onClick={onExportJSON} style={{ ...secondaryBtn, padding: "8px 14px" }}>Copy JSON</button>
      <button onClick={onDelete} style={{ ...dangerBtn, padding: "8px 14px" }}>Delete</button>
    </div>
  );
}

function MonsterDetail({ monster }) {
  return <StatBlockPreview monster={monster} />;
}

function ItemDetail({ item }) {
  const rarityColor = RarityColors[item.rarity] || "#666";
  return (
    <div style={{ backgroundColor: T.bgCard, padding: "20px", borderRadius: "8px", border: "1px solid " + T.border, maxWidth: "600px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px", borderBottom: "2px solid " + rarityColor, paddingBottom: "12px" }}>
        <div>
          <div style={{ fontFamily: T.heading, fontSize: "22px", color: T.gold }}>{item.name}</div>
          <div style={{ fontStyle: "italic", color: T.textMuted, fontSize: "13px", marginTop: "2px" }}>
            {item.type || "Wondrous Item"}, {(item.rarity || "common").replace("_"," ")}
            {item.attunement && <span style={{ color: T.crimson, marginLeft: "8px" }}>(requires attunement)</span>}
          </div>
        </div>
      </div>
      <div style={{ fontSize: "14px", color: T.text, lineHeight: "1.7", marginBottom: "12px" }}>{item.description}</div>
      {item.damage && <div style={{ fontSize: "13px", marginBottom: "6px" }}><strong style={{ color: T.crimson }}>Damage:</strong> {item.damage} {item.damageType || ""}</div>}
      {item.ac && <div style={{ fontSize: "13px", marginBottom: "6px" }}><strong style={{ color: T.crimson }}>AC Bonus:</strong> {item.ac}</div>}
      {item.charges && <div style={{ fontSize: "13px", marginBottom: "6px" }}><strong style={{ color: T.crimson }}>Charges:</strong> {item.charges} {item.recharge ? "(recharges " + item.recharge + ")" : ""}</div>}
      {item.value && <div style={{ fontSize: "13px", marginBottom: "6px" }}><strong style={{ color: T.crimson }}>Value:</strong> {item.value} gp</div>}
      {item.weight && <div style={{ fontSize: "13px", marginBottom: "6px" }}><strong style={{ color: T.crimson }}>Weight:</strong> {item.weight} lbs</div>}
      {item.lore && (
        <div style={{ marginTop: "12px", padding: "12px", backgroundColor: T.bg, borderRadius: "6px", fontStyle: "italic", fontSize: "13px", color: T.textMuted, borderLeft: "3px solid " + T.gold }}>
          {item.lore}
        </div>
      )}
      {item.cursed && (
        <div style={{ marginTop: "12px", padding: "12px", backgroundColor: T.crimsonDim, borderRadius: "6px", borderLeft: "3px solid " + T.crimson }}>
          <strong style={{ color: T.crimson }}>Curse:</strong> <span style={{ fontSize: "13px" }}>{item.curseEffect}</span>
        </div>
      )}
    </div>
  );
}

function SpellDetail({ spell }) {
  const schoolColor = SchoolColors[spell.school] || "#666";
  return (
    <div style={{ backgroundColor: T.bgCard, padding: "20px", borderRadius: "8px", border: "1px solid " + T.border, maxWidth: "600px" }}>
      <div style={{ borderBottom: "2px solid " + schoolColor, paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ fontFamily: T.heading, fontSize: "22px", color: T.gold }}>{spell.name}</div>
        <div style={{ fontStyle: "italic", color: T.textMuted, fontSize: "13px", marginTop: "2px" }}>
          {spell.level === 0 ? "Cantrip" : "Level " + spell.level} {(spell.school || "evocation").charAt(0).toUpperCase() + (spell.school || "").slice(1)}
          {spell.ritual && " (ritual)"}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px", fontSize: "13px" }}>
        <div><strong style={{ color: T.crimson }}>Casting Time:</strong> {spell.castingTime}</div>
        <div><strong style={{ color: T.crimson }}>Range:</strong> {spell.range}</div>
        <div><strong style={{ color: T.crimson }}>Duration:</strong> {spell.duration} {spell.concentration && "(concentration)"}</div>
        <div><strong style={{ color: T.crimson }}>Components:</strong> {[spell.components?.v && "V", spell.components?.s && "S", spell.components?.m && "M"].filter(Boolean).join(", ") || "None"}
          {spell.materialComponent && " (" + spell.materialComponent + ")"}
        </div>
      </div>
      <div style={{ fontSize: "14px", color: T.text, lineHeight: "1.7", marginBottom: "12px" }}>{spell.description}</div>
      {spell.damage && <div style={{ fontSize: "13px", marginBottom: "6px" }}><strong style={{ color: T.crimson }}>Damage:</strong> {spell.damage} {spell.damageType || ""}</div>}
      {spell.saveType && <div style={{ fontSize: "13px", marginBottom: "6px" }}><strong style={{ color: T.crimson }}>Save:</strong> {spell.saveType.toUpperCase()}</div>}
      {spell.higherLevels && (
        <div style={{ marginTop: "12px", padding: "12px", backgroundColor: T.bg, borderRadius: "6px", borderLeft: "3px solid " + schoolColor }}>
          <strong style={{ color: T.gold, fontSize: "12px" }}>At Higher Levels:</strong>
          <div style={{ fontSize: "13px", marginTop: "4px", color: T.textMuted }}>{spell.higherLevels}</div>
        </div>
      )}
      {spell.classes && spell.classes.length > 0 && (
        <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {spell.classes.map(c => (
            <span key={c} style={{ padding: "3px 10px", backgroundColor: T.bg, border: "1px solid " + T.border, borderRadius: "12px", fontSize: "11px", color: T.textMuted }}>{c}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function NPCDetail({ npc, viewRole }) {
  return (
    <div style={{ backgroundColor: T.bgCard, padding: "20px", borderRadius: "8px", border: "1px solid " + T.border, maxWidth: "600px" }}>
      <div style={{ borderBottom: "2px solid " + T.gold, paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ fontFamily: T.heading, fontSize: "22px", color: T.gold }}>{npc.name}</div>
        <div style={{ fontStyle: "italic", color: T.textMuted, fontSize: "13px", marginTop: "2px" }}>
          {npc.race || "Human"} {npc.class ? npc.class + " " : ""}{npc.level ? "(Level " + npc.level + ")" : ""}
          {npc.background && " - " + npc.background}
        </div>
        {npc.faction && <div style={{ color: T.gold, fontSize: "12px", marginTop: "4px" }}>{npc.faction}</div>}
      </div>
      {npc.appearance && <div style={{ fontSize: "13px", marginBottom: "10px" }}><strong style={{ color: T.crimson }}>Appearance:</strong> {npc.appearance}</div>}
      {npc.personality && <div style={{ fontSize: "13px", marginBottom: "10px" }}><strong style={{ color: T.crimson }}>Personality:</strong> {npc.personality}</div>}
      {npc.ideal && <div style={{ fontSize: "13px", marginBottom: "10px" }}><strong style={{ color: T.crimson }}>Ideal:</strong> {npc.ideal}</div>}
      {npc.bond && <div style={{ fontSize: "13px", marginBottom: "10px" }}><strong style={{ color: T.crimson }}>Bond:</strong> {npc.bond}</div>}
      {npc.flaw && <div style={{ fontSize: "13px", marginBottom: "10px" }}><strong style={{ color: T.crimson }}>Flaw:</strong> {npc.flaw}</div>}
      {npc.backstory && (
        <div style={{ marginTop: "12px", padding: "12px", backgroundColor: T.bg, borderRadius: "6px", borderLeft: "3px solid " + T.gold }}>
          <strong style={{ color: T.gold, fontSize: "12px" }}>Backstory:</strong>
          <div style={{ fontSize: "13px", marginTop: "4px", color: T.textMuted, lineHeight: "1.6" }}>{npc.backstory}</div>
        </div>
      )}
      {npc.equipment && <div style={{ fontSize: "13px", marginTop: "10px" }}><strong style={{ color: T.crimson }}>Equipment:</strong> {npc.equipment}</div>}
      {npc.spells && <div style={{ fontSize: "13px", marginTop: "6px" }}><strong style={{ color: T.crimson }}>Spells:</strong> {npc.spells}</div>}
      {viewRole === "dm" && npc.motivation && (
        <div style={{ marginTop: "16px", padding: "12px", backgroundColor: T.crimsonDim, borderRadius: "6px", borderLeft: "3px solid " + T.crimson }}>
          <strong style={{ color: T.crimson, fontSize: "12px" }}>Secret Motivation (DM Only):</strong>
          <div style={{ fontSize: "13px", marginTop: "4px" }}>{npc.motivation}</div>
        </div>
      )}
    </div>
  );
}

function ClassFeatureDetail({ feature }) {
  return (
    <div style={{ backgroundColor: T.bgCard, padding: "20px", borderRadius: "8px", border: "1px solid " + T.border, maxWidth: "600px" }}>
      <div style={{ borderBottom: "2px solid " + T.crimson, paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ fontFamily: T.heading, fontSize: "22px", color: T.gold }}>{feature.name}</div>
        <div style={{ fontStyle: "italic", color: T.textMuted, fontSize: "13px", marginTop: "2px" }}>
          {feature.featureType === "subclass" ? "Subclass" : "Class"} Feature
          {feature.className && " - " + feature.className}
          {feature.subclassName && " (" + feature.subclassName + ")"}
          {feature.level && " (Level " + feature.level + ")"}
        </div>
      </div>
      {feature.prerequisite && feature.prerequisite !== "None" && (
        <div style={{ fontSize: "13px", marginBottom: "10px" }}><strong style={{ color: T.crimson }}>Prerequisite:</strong> {feature.prerequisite}</div>
      )}
      <div style={{ fontSize: "14px", color: T.text, lineHeight: "1.7", marginBottom: "12px" }}>{feature.description}</div>
      {feature.mechanics && (
        <div style={{ marginTop: "12px", padding: "12px", backgroundColor: T.bg, borderRadius: "6px", borderLeft: "3px solid " + T.crimson }}>
          <strong style={{ color: T.crimson, fontSize: "12px" }}>Mechanics:</strong>
          <div style={{ fontSize: "13px", marginTop: "4px", color: T.textMuted, lineHeight: "1.6" }}>{feature.mechanics}</div>
        </div>
      )}
    </div>
  );
}

function FeatDetail({ feat }) {
  const catColor = FeatCatColors[feat.category] || "#666";
  return (
    <div style={{ backgroundColor: T.bgCard, padding: "20px", borderRadius: "8px", border: "1px solid " + T.border, maxWidth: "600px" }}>
      <div style={{ borderBottom: "2px solid " + catColor, paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ fontFamily: T.heading, fontSize: "22px", color: T.gold }}>{feat.name}</div>
        <div style={{ fontStyle: "italic", color: T.textMuted, fontSize: "13px", marginTop: "2px" }}>
          {(feat.category || "General").charAt(0).toUpperCase() + (feat.category || "").slice(1)} Feat
        </div>
      </div>
      {feat.prerequisite && feat.prerequisite !== "None" && (
        <div style={{ fontSize: "13px", marginBottom: "12px", padding: "8px 12px", backgroundColor: T.crimsonDim, borderRadius: "6px" }}>
          <strong style={{ color: T.crimson }}>Prerequisite:</strong> {feat.prerequisite}
        </div>
      )}
      <div style={{ fontSize: "14px", color: T.text, lineHeight: "1.7", marginBottom: "16px" }}>{feat.description}</div>
      {feat.benefits && feat.benefits.length > 0 && (
        <div>
          <div style={{ ...sectionHead, marginBottom: "8px" }}><span style={{ fontSize: "14px" }}>&#9670;</span> Benefits</div>
          {feat.benefits.map((b, i) => (
            <div key={i} style={{
              display: "flex", gap: "10px", marginBottom: "8px", padding: "10px",
              backgroundColor: T.bg, borderRadius: "6px", borderLeft: "3px solid " + catColor
            }}>
              <span style={{ color: catColor, fontFamily: T.heading, fontWeight: "bold", minWidth: "20px" }}>{i + 1}.</span>
              <span style={{ fontSize: "13px", color: T.text, lineHeight: "1.5" }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARD LIBRARY GRID
   ═══════════════════════════════════════════════════════════════════════════ */

function CardLibrary({ items, category, onExpand, emptyMsg }) {
  if (!items || items.length === 0) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>
          {category === "monsters" ? "&#9737;" : category === "items" ? "&#9876;" : category === "spells" ? "&#10022;" : category === "npcs" ? "&#9673;" : category === "classFeatures" ? "&#9733;" : "&#10038;"}
        </div>
        <div style={{ color: T.textMuted, fontFamily: T.body, fontSize: "15px", fontStyle: "italic" }}>{emptyMsg}</div>
        <div style={{ color: T.textFaint, fontSize: "12px", marginTop: "8px" }}>Click the "New" button above to get started</div>
      </div>
    );
  }

  const cardMap = {
    monsters: MonsterCard, items: ItemCard, spells: SpellCard,
    npcs: NPCCard, classFeatures: ClassFeatureCard, feats: FeatCard
  };
  const propMap = {
    monsters: "monster", items: "item", spells: "spell",
    npcs: "npc", classFeatures: "feature", feats: "feat"
  };
  const Component = cardMap[category] || MonsterCard;
  const propName = propMap[category] || "monster";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "16px", padding: "20px"
    }}>
      {items.map((item, idx) => (
        <Component key={idx} {...{ [propName]: item }} onExpand={() => onExpand(idx)} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   IMPORT / EXPORT MODALS
   ═══════════════════════════════════════════════════════════════════════════ */

function ImportModal({ onImport, onClose }) {
  const [jsonText, setJsonText] = React.useState("");
  const [error, setError] = React.useState("");

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        onImport(parsed);
      } else {
        onImport([parsed]);
      }
      onClose();
    } catch (e) {
      setError("Invalid JSON: " + e.message);
    }
  };

  return (
    <ModalShell title="Import Homebrew" onClose={onClose}>
      <p style={{ color: T.textMuted, fontSize: "13px", marginBottom: "12px" }}>
        Paste exported JSON data below. Supports single items or arrays.
      </p>
      <textarea value={jsonText} onChange={e => { setJsonText(e.target.value); setError(""); }}
        placeholder='Paste JSON here...' style={{ ...inputStyle, minHeight: "200px", resize: "vertical", fontFamily: "monospace", fontSize: "12px" }} />
      {error && <div style={{ color: T.crimson, fontSize: "12px", marginTop: "8px" }}>{error}</div>}
      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button onClick={handleImport} style={{ ...primaryBtn, flex: 1 }}>Import</button>
        <button onClick={onClose} style={{ ...secondaryBtn, flex: 1 }}>Cancel</button>
      </div>
    </ModalShell>
  );
}

function ExportModal({ items, categoryLabel, onClose }) {
  const jsonStr = JSON.stringify(items, null, 2);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      /* fallback: select the textarea */
    }
  };

  return (
    <ModalShell title={"Export " + categoryLabel} onClose={onClose}>
      <p style={{ color: T.textMuted, fontSize: "13px", marginBottom: "12px" }}>
        Copy this JSON data to save or share your homebrew {categoryLabel.toLowerCase()}.
      </p>
      <textarea readOnly value={jsonStr}
        style={{ ...inputStyle, minHeight: "250px", fontFamily: "monospace", fontSize: "11px", resize: "vertical" }} />
      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button onClick={handleCopy} style={{ ...primaryBtn, flex: 1 }}>
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
        <button onClick={onClose} style={{ ...secondaryBtn, flex: 1 }}>Close</button>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN VIEW COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

window.CampaignHomebrewView = function CampaignHomebrewView({ data, setData, viewRole }) {
  const [activeTab, setActiveTab] = React.useState("monsters");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name");
  const [showCreator, setShowCreator] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [expandedCard, setExpandedCard] = React.useState(null);
  const [showImport, setShowImport] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);

  const homebrew = data._homebrew || { monsters: [], items: [], spells: [], npcs: [], classFeatures: [], feats: [] };

  const categoryData = {
    monsters: { data: homebrew.monsters || [], label: "Monsters", icon: "\u2739", singular: "Monster", templates: window.MONSTER_TEMPLATES || {} },
    items: { data: homebrew.items || [], label: "Items", icon: "\u2694", singular: "Item", templates: window.ITEM_TEMPLATES || {} },
    spells: { data: homebrew.spells || [], label: "Spells", icon: "\u2726", singular: "Spell", templates: window.SPELL_TEMPLATES || {} },
    npcs: { data: homebrew.npcs || [], label: "NPCs", icon: "\u25C9", singular: "NPC", templates: window.NPC_TEMPLATES || {} },
    classFeatures: { data: homebrew.classFeatures || [], label: "Class Features", icon: "\u2605", singular: "Feature", templates: window.CLASS_FEATURE_TEMPLATES || {} },
    feats: { data: homebrew.feats || [], label: "Feats", icon: "\u2736", singular: "Feat", templates: window.FEAT_TEMPLATES || {} }
  };

  const currentCat = categoryData[activeTab];

  /* Sort + filter */
  const sorted = React.useMemo(() => {
    let arr = [...currentCat.data];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      arr = arr.filter(item => (item.name || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.type || "").toLowerCase().includes(q));
    }
    arr.sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "cr" && activeTab === "monsters") return (a.cr || 0) - (b.cr || 0);
      if (sortBy === "level" && (activeTab === "spells" || activeTab === "classFeatures")) return (a.level || 0) - (b.level || 0);
      if (sortBy === "rarity" && activeTab === "items") {
        const order = { common: 0, uncommon: 1, rare: 2, very_rare: 3, legendary: 4, artifact: 5 };
        return (order[a.rarity] || 0) - (order[b.rarity] || 0);
      }
      if (sortBy === "newest") return -1; /* keep order (newest last in array) */
      return 0;
    });
    return arr;
  }, [currentCat.data, searchTerm, sortBy, activeTab]);

  /* CRUD handlers */
  const handleCreate = (form) => {
    const updated = { ...homebrew, [activeTab]: [...currentCat.data, form] };
    setData(d => ({ ...d, _homebrew: updated }));
    setShowCreator(false);
    setEditingItem(null);
  };

  const handleEdit = (idx) => {
    setEditingItem(currentCat.data[idx]);
    setShowCreator(true);
    setExpandedCard(null);
  };

  const handleEditSave = (form) => {
    const newArr = [...currentCat.data];
    const origIdx = currentCat.data.indexOf(editingItem);
    if (origIdx >= 0) newArr[origIdx] = form;
    const updated = { ...homebrew, [activeTab]: newArr };
    setData(d => ({ ...d, _homebrew: updated }));
    setShowCreator(false);
    setEditingItem(null);
  };

  const handleDuplicate = (idx) => {
    const original = currentCat.data[idx];
    const clone = JSON.parse(JSON.stringify(original));
    clone.name = (clone.name || "Copy") + " (Copy)";
    const updated = { ...homebrew, [activeTab]: [...currentCat.data, clone] };
    setData(d => ({ ...d, _homebrew: updated }));
    setExpandedCard(null);
  };

  const handleDelete = (idx) => {
    if (!confirm("Delete this " + currentCat.singular.toLowerCase() + "? This cannot be undone.")) return;
    const updated = { ...homebrew, [activeTab]: currentCat.data.filter((_, i) => i !== idx) };
    setData(d => ({ ...d, _homebrew: updated }));
    setExpandedCard(null);
  };

  const handleCopyJSON = (idx) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(currentCat.data[idx], null, 2));
      if (window.psToast) window.psToast("Copied to clipboard!");
    } catch (e) { /* silent */ }
  };

  const handleImport = (items) => {
    const updated = { ...homebrew, [activeTab]: [...currentCat.data, ...items] };
    setData(d => ({ ...d, _homebrew: updated }));
    if (window.psToast) window.psToast("Imported " + items.length + " " + currentCat.label.toLowerCase() + "!");
  };

  /* Sort options per category */
  const sortOptions = { monsters: ["name","cr","newest"], items: ["name","rarity","newest"], spells: ["name","level","newest"], npcs: ["name","newest"], classFeatures: ["name","level","newest"], feats: ["name","newest"] };

  /* Creator component map */
  const creatorMap = { monsters: MonsterCreator, items: ItemCreator, spells: SpellCreator, npcs: NPCCreator, classFeatures: ClassFeatureCreator, feats: FeatCreator };
  const CreatorComponent = creatorMap[activeTab];

  /* Detail component map */
  const detailMap = { monsters: MonsterDetail, items: ItemDetail, spells: SpellDetail, npcs: NPCDetail, classFeatures: ClassFeatureDetail, feats: FeatDetail };
  const DetailComponent = detailMap[activeTab];
  const detailPropMap = { monsters: "monster", items: "item", spells: "spell", npcs: "npc", classFeatures: "feature", feats: "feat" };

  /* Total count */
  const totalCount = Object.values(categoryData).reduce((sum, cat) => sum + cat.data.length, 0);

  return (
    <div style={{ backgroundColor: T.bg, color: T.text, fontFamily: T.body, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ─── Header ─── */}
      <div style={{ borderBottom: "1px solid " + T.border, padding: "28px 24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "6px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "30px", fontFamily: T.heading, color: T.crimson, letterSpacing: "0.02em" }}>
              Homebrew Workshop
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: T.textMuted, fontStyle: "italic" }}>
              Forge custom content for your campaign
              {totalCount > 0 && <span style={{ marginLeft: "12px", color: T.textFaint }}>({totalCount} total creations)</span>}
            </p>
          </div>
        </div>

        {/* ─── Category Tabs ─── */}
        <div style={{ display: "flex", gap: "8px", marginTop: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
          {Object.entries(categoryData).map(([key, cat]) => (
            <button key={key} onClick={() => { setActiveTab(key); setSearchTerm(""); setExpandedCard(null); setSortBy("name"); }}
              style={pillBtn(activeTab === key)}>
              <span>{cat.icon}</span> {cat.label} {cat.data.length > 0 && <span style={{ opacity: 0.7 }}>({cat.data.length})</span>}
            </button>
          ))}
        </div>

        {/* ─── Action Bar ─── */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <input type="text" placeholder={"Search " + currentCat.label.toLowerCase() + "..."} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: "32px" }} />
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textFaint, fontSize: "14px" }}>&#128269;</span>
          </div>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...selectStyle, width: "auto", minWidth: "120px" }}>
            {(sortOptions[activeTab] || ["name"]).map(s => (
              <option key={s} value={s}>Sort: {s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <button onClick={() => { setEditingItem(null); setShowCreator(true); }} style={primaryBtn}>
            + New {currentCat.singular}
          </button>
          <button onClick={() => setShowImport(true)} style={secondaryBtn}>Import</button>
          {currentCat.data.length > 0 && (
            <button onClick={() => setShowExport(true)} style={secondaryBtn}>Export All</button>
          )}
        </div>
      </div>

      {/* ─── Content Area ─── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {expandedCard !== null && currentCat.data[expandedCard] ? (
          <div style={{ padding: "20px 24px" }}>
            <DetailToolbar
              onBack={() => setExpandedCard(null)}
              onEdit={() => handleEdit(expandedCard)}
              onDuplicate={() => handleDuplicate(expandedCard)}
              onDelete={() => handleDelete(expandedCard)}
              onExportJSON={() => handleCopyJSON(expandedCard)}
            />
            <DetailComponent
              {...{ [detailPropMap[activeTab]]: currentCat.data[expandedCard] }}
              viewRole={viewRole}
            />
          </div>
        ) : (
          <CardLibrary items={sorted} category={activeTab} onExpand={setExpandedCard}
            emptyMsg={"No " + currentCat.label.toLowerCase() + " created yet. Click \"+ New " + currentCat.singular + "\" to get started!"} />
        )}
      </div>

      {/* ─── Modals ─── */}
      {showCreator && CreatorComponent && (
        <CreatorComponent
          templates={currentCat.templates}
          onSave={editingItem ? handleEditSave : handleCreate}
          onClose={() => { setShowCreator(false); setEditingItem(null); }}
          initialData={editingItem}
        />
      )}
      {showImport && <ImportModal onImport={handleImport} onClose={() => setShowImport(false)} />}
      {showExport && <ExportModal items={currentCat.data} categoryLabel={currentCat.label} onClose={() => setShowExport(false)} />}
    </div>
  );
};
