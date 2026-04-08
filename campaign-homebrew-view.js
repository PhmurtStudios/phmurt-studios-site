const T = {
  bg: "#0c0804", bgNav: "#100c08", bgCard: "rgba(18,14,10,0.97)",
  text: "#e8dcc8", textMuted: "#a89878", textFaint: "#6a6050",
  crimson: "#d4433a", crimsonBorder: "rgba(212,67,58,0.15)",
  gold: "#c9a85c", border: "rgba(212,67,58,0.08)",
  heading: "'Cinzel', serif", body: "'Spectral', serif", ui: "'Cinzel', serif"
};

const CRColors = {
  0: "#8a7c6f", 1: "#8a7c6f", 2: "#6ba85c", 3: "#5c9ba8", 4: "#5c7ba8",
  5: "#6b5ca8", 6: "#8a5ca8", 7: "#a85c6b", 8: "#a87c5c", 9: "#a8a35c",
  10: "#d4433a", 11: "#d4433a", 12: "#d4433a", 13: "#d4433a", 14: "#d4433a",
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

const AbilityNames = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

function calcModifier(score) {
  return Math.floor((score - 10) / 2);
}

function calcCR(offensiveCR, defensiveCR) {
  return Math.ceil((offensiveCR + defensiveCR) / 2);
}

function StatBlockPreview({ monster }) {
  const mods = monster.abilities.map(s => calcModifier(s));
  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      fontSize: "11px",
      lineHeight: "1.4",
      backgroundColor: T.bgCard,
      border: `1px solid ${T.gold}`,
      padding: "12px",
      color: T.text,
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    }}>
      {`${(monster.name || "Unnamed").toUpperCase()}
${monster.size ? monster.size.charAt(0).toUpperCase() + monster.size.slice(1) : "Medium"} ${monster.type || "humanoid"}, ${monster.alignment || "unaligned"}

─────────────────────────────────────────
AC ${monster.ac || 10}  HP ${monster.hpFormula || "10"}
Speed ${monster.speed || "30 ft."}

${AbilityNames.map((name, i) => `${name} ${String(monster.abilities[i] || 10).padStart(2)} (${mods[i] >= 0 ? '+' : ''}${mods[i]})`).join('  ')}

${monster.skills ? 'Skills ' + monster.skills.join(', ') + '\n' : ''}${monster.senses ? 'Senses ' + monster.senses + '\n' : ''}${monster.languages ? 'Languages ' + monster.languages + '\n' : ''}Challenge ${monster.cr || 1} (${monster.xp || 200} XP)

${monster.traits && monster.traits.length > 0 ? '─────────────────────────────────────────\n' + monster.traits.map(t => `${t.name || "Trait"}. ${t.description || ""}`).join("\n\n") + "\n" : ''}
${monster.actions && monster.actions.length > 0 ? '─────────────────────────────────────────\nACTIONS\n' + monster.actions.map(a => `${a.name || "Action"}. ${a.description || ""}`).join("\n\n") + "\n" : ''}
${monster.legendaryActions && monster.legendaryActions.length > 0 ? '─────────────────────────────────────────\nLEGENDARY ACTIONS\n' + monster.legendaryActions.map(la => `${la.name || "Action"}. ${la.description || ""}`).join("\n\n") : ''}`}
    </div>
  );
}

function MonsterCard({ monster, onExpand }) {
  const mods = monster.abilities.map(s => calcModifier(s));
  const cr = monster.cr || 1;
  return (
    <div onClick={onExpand} style={{
      backgroundColor: T.bgCard,
      border: `1px solid ${T.crimsonBorder}`,
      borderRadius: "6px",
      padding: "12px",
      cursor: "pointer",
      transition: "all 0.2s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "14px" }}>{monster.name}</h3>
        <div style={{ backgroundColor: CRColors[cr] || "#666", color: "#000", padding: "2px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: "bold" }}>CR {cr}</div>
      </div>
      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "8px" }}>
        {monster.size ? monster.size.charAt(0).toUpperCase() + monster.size.slice(1) : "Medium"} {monster.type || "humanoid"}
      </div>
      <div style={{ fontSize: "12px", color: T.text, marginBottom: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
        <div>AC {monster.ac || 10}</div>
        <div>HP {monster.hpFormula || "10"}</div>
      </div>
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.3" }}>
        {monster.description || "No description"}
      </div>
    </div>
  );
}

function ItemCard({ item, onExpand }) {
  const rarityColor = RarityColors[item.rarity] || "#666";
  return (
    <div onClick={onExpand} style={{
      backgroundColor: T.bgCard,
      border: `1px solid ${T.crimsonBorder}`,
      borderRadius: "6px",
      padding: "12px",
      cursor: "pointer",
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "14px" }}>{item.name}</h3>
        <div style={{ backgroundColor: rarityColor, color: "#000", padding: "2px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: "bold" }}>
          {(item.rarity || "common").toUpperCase()}
        </div>
      </div>
      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "8px" }}>
        {item.type || "wondrous item"}
        {item.attunement && <span style={{ marginLeft: "8px", color: T.crimson }}>◆ Requires Attunement</span>}
      </div>
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.3" }}>
        {item.description || "No description"}
      </div>
    </div>
  );
}

function SpellCard({ spell, onExpand }) {
  const schoolColor = SchoolColors[spell.school] || "#666";
  return (
    <div onClick={onExpand} style={{
      backgroundColor: T.bgCard,
      border: `1px solid ${T.crimsonBorder}`,
      borderRadius: "6px",
      padding: "12px",
      cursor: "pointer",
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "14px" }}>{spell.name}</h3>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: schoolColor, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold" }}>
            {spell.level || 0}
          </div>
          {spell.concentration && <span style={{ fontSize: "10px", color: T.crimson, fontWeight: "bold" }}>C</span>}
        </div>
      </div>
      <div style={{ fontSize: "11px", color: T.textMuted, marginBottom: "8px" }}>
        {spell.school || "evocation"} {spell.ritual && "• Ritual"}
      </div>
      <div style={{ fontSize: "11px", color: T.text, marginBottom: "6px" }}>
        <strong>Casting:</strong> {spell.castingTime || "1 action"}
      </div>
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.3" }}>
        {spell.description || "No description"}
      </div>
    </div>
  );
}

function NPCCard({ npc, onExpand }) {
  return (
    <div onClick={onExpand} style={{
      backgroundColor: T.bgCard,
      border: `1px solid ${T.crimsonBorder}`,
      borderRadius: "6px",
      padding: "12px",
      cursor: "pointer",
      transition: "all 0.2s",
    }}>
      <div style={{ marginBottom: "8px" }}>
        <h3 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: "14px" }}>{npc.name}</h3>
      </div>
      <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "8px" }}>
        {npc.race || "Human"} {npc.class ? npc.class + " " : ""}{npc.level ? `(Level ${npc.level})` : ""}
      </div>
      {npc.faction && <div style={{ fontSize: "10px", color: T.gold, marginBottom: "8px", fontStyle: "italic" }}>{npc.faction}</div>}
      <div style={{ fontSize: "11px", color: T.textFaint, lineHeight: "1.3" }}>
        {npc.personality || "No personality defined"}
      </div>
    </div>
  );
}

function MonsterCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", size: "medium", type: "", alignment: "unaligned", description: "",
    ac: 10, hpFormula: "1d8", speed: "30 ft.",
    abilities: [10, 10, 10, 10, 10, 10], skills: [], senses: "", languages: "",
    traits: [], actions: [], legendaryActions: [],
  });

  const handleTemplateSelect = (templateName) => {
    const tmpl = window.MONSTER_TEMPLATES && window.MONSTER_TEMPLATES[templateName];
    if (tmpl) setForm({ ...form, ...tmpl });
  };

  const addFeature = (key) => {
    setForm(f => ({ ...f, [key]: [...(f[key] || []), { name: "", description: "" }] }));
  };

  const updateFeature = (key, idx, field, val) => {
    setForm(f => {
      const arr = [...f[key]];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...f, [key]: arr };
    });
  };

  const removeFeature = (key, idx) => {
    setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const offensiveCR = Math.max(0, calcModifier(form.abilities[0]) + (form.ac || 10) / 5);
  const defensiveCR = Math.max(0, form.ac || 10);
  const estimatedCR = calcCR(offensiveCR, defensiveCR);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        backgroundColor: T.bgCard, border: `2px solid ${T.gold}`, borderRadius: "8px",
        padding: "20px", maxHeight: "90vh", overflowY: "auto", maxWidth: "700px", width: "95%"
      }}>
        <h2 style={{ color: T.gold, fontFamily: T.heading, margin: "0 0 16px 0" }}>Create Monster</h2>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Template</label>
          <select onChange={e => handleTemplateSelect(e.target.value)} style={{
            width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.gold}`, borderRadius: "4px"
          }}>
            <option value="">-- Select template --</option>
            {templates && Object.keys(templates).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Type</label>
            <input type="text" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Size</label>
            <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
              <option value="tiny">Tiny</option><option value="small">Small</option><option value="medium">Medium</option>
              <option value="large">Large</option><option value="huge">Huge</option><option value="gargantuan">Gargantuan</option>
            </select>
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>AC</label>
            <input type="number" value={form.ac} onChange={e => setForm({ ...form, ac: parseInt(e.target.value) || 10 })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>HP Formula</label>
            <input type="text" value={form.hpFormula} onChange={e => setForm({ ...form, hpFormula: e.target.value })}
              placeholder="1d8" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Abilities (STR DEX CON INT WIS CHA)</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
            {form.abilities.map((ability, i) => (
              <div key={i}>
                <input type="number" value={ability} onChange={e => {
                  const arr = [...form.abilities];
                  arr[i] = parseInt(e.target.value) || 10;
                  setForm({ ...form, abilities: arr });
                }} style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
                <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "2px", textAlign: "center" }}>
                  {calcModifier(ability) >= 0 ? '+' : ''}{calcModifier(ability)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "60px" }} />
        </div>

        <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "rgba(212,67,58,0.1)", borderRadius: "4px", borderLeft: `3px solid ${T.crimson}` }}>
          <div style={{ fontSize: "12px", color: T.text, marginBottom: "4px" }}>
            <strong>Estimated CR: {estimatedCR}</strong>
          </div>
          <div style={{ fontSize: "11px", color: T.textMuted }}>Offensive CR: {offensiveCR.toFixed(1)} | Defensive CR: {defensiveCR.toFixed(1)}</div>
        </div>

        {["traits", "actions", "legendaryActions"].map((key) => (
          <div key={key} style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ color: T.gold, fontSize: "12px", fontWeight: "bold" }}>
                {key === "traits" ? "Traits" : key === "actions" ? "Actions" : "Legendary Actions"}
              </label>
              <button onClick={() => addFeature(key)} style={{
                padding: "4px 8px", backgroundColor: T.crimson, color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer", fontSize: "11px"
              }}>+ Add</button>
            </div>
            {form[key] && form[key].map((feature, idx) => (
              <div key={idx} style={{ marginBottom: "8px", padding: "8px", backgroundColor: T.bg, borderRadius: "4px", borderLeft: `2px solid ${T.gold}` }}>
                <input type="text" value={feature.name} placeholder="Name" onChange={e => updateFeature(key, idx, "name", e.target.value)}
                  style={{ width: "100%", padding: "4px", marginBottom: "4px", backgroundColor: "rgba(0,0,0,0.3)", color: T.text, border: `1px solid ${T.border}`, borderRadius: "3px", boxSizing: "border-box", fontSize: "12px" }} />
                <textarea value={feature.description} placeholder="Description" onChange={e => updateFeature(key, idx, "description", e.target.value)}
                  style={{ width: "100%", padding: "4px", marginBottom: "4px", backgroundColor: "rgba(0,0,0,0.3)", color: T.text, border: `1px solid ${T.border}`, borderRadius: "3px", boxSizing: "border-box", minHeight: "50px", fontSize: "12px" }} />
                <button onClick={() => removeFeature(key, idx)} style={{
                  padding: "2px 6px", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", fontSize: "10px"
                }}>Remove</button>
              </div>
            ))}
          </div>
        ))}

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: "8px", backgroundColor: T.crimson, color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: T.heading
          }}>Save Monster</button>
          <button onClick={onClose} style={{
            flex: 1, padding: "8px", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: T.heading
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ItemCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", type: "wondrous item", rarity: "common", attunement: false,
    description: "", damage: "", damageType: "", ac: "", charges: "", recharge: "",
    lore: "", cursed: false, curseEffect: "", value: "", weight: ""
  });

  const handleTemplateSelect = (templateName) => {
    const tmpl = window.ITEM_TEMPLATES && window.ITEM_TEMPLATES[templateName];
    if (tmpl) setForm({ ...form, ...tmpl });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        backgroundColor: T.bgCard, border: `2px solid ${T.gold}`, borderRadius: "8px",
        padding: "20px", maxHeight: "90vh", overflowY: "auto", maxWidth: "700px", width: "95%"
      }}>
        <h2 style={{ color: T.gold, fontFamily: T.heading, margin: "0 0 16px 0" }}>Create Item</h2>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Template</label>
          <select onChange={e => handleTemplateSelect(e.target.value)} style={{
            width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.gold}`, borderRadius: "4px"
          }}>
            <option value="">-- Select template --</option>
            {templates && Object.keys(templates).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
              <option value="wondrous item">Wondrous Item</option>
              <option value="weapon">Weapon</option>
              <option value="armor">Armor</option>
              <option value="accessory">Accessory</option>
              <option value="potion">Potion</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Rarity</label>
            <select value={form.rarity} onChange={e => setForm({ ...form, rarity: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
              {Object.keys(RarityColors).map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", paddingTop: "20px" }}>
            <label style={{ color: T.text, fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.attunement} onChange={e => setForm({ ...form, attunement: e.target.checked })} />
              Requires Attunement
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "80px" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Damage (if weapon)</label>
            <input type="text" value={form.damage} onChange={e => setForm({ ...form, damage: e.target.value })}
              placeholder="1d8" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Damage Type</label>
            <input type="text" value={form.damageType} onChange={e => setForm({ ...form, damageType: e.target.value })}
              placeholder="slashing" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Charges</label>
            <input type="text" value={form.charges} onChange={e => setForm({ ...form, charges: e.target.value })}
              placeholder="5" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Recharge</label>
            <input type="text" value={form.recharge} onChange={e => setForm({ ...form, recharge: e.target.value })}
              placeholder="dawn" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Lore</label>
          <textarea value={form.lore} onChange={e => setForm({ ...form, lore: e.target.value })}
            style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "60px" }} />
        </div>

        <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "rgba(212,67,58,0.1)", borderRadius: "4px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.cursed} onChange={e => setForm({ ...form, cursed: e.target.checked })} />
            Cursed Item
          </label>
          {form.cursed && (
            <textarea value={form.curseEffect} onChange={e => setForm({ ...form, curseEffect: e.target.value })}
              placeholder="Curse effect" style={{ width: "100%", padding: "6px", marginTop: "8px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "50px" }} />
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: "8px", backgroundColor: T.crimson, color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: T.heading
          }}>Save Item</button>
          <button onClick={onClose} style={{
            flex: 1, padding: "8px", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: T.heading
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function SpellCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", level: 1, school: "evocation", ritual: false, concentration: false,
    castingTime: "1 action", range: "60 feet", duration: "instantaneous",
    components: { v: false, s: false, m: false }, materialComponent: "",
    description: "", damage: "", damageType: "", saveType: "", higherLevels: "",
    classes: []
  });

  const handleTemplateSelect = (templateName) => {
    const tmpl = window.SPELL_TEMPLATES && window.SPELL_TEMPLATES[templateName];
    if (tmpl) setForm({ ...form, ...tmpl });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const schools = ["abjuration", "conjuration", "divination", "enchantment", "evocation", "illusion", "necromancy", "transmutation"];
  const spellClasses = ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"];

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        backgroundColor: T.bgCard, border: `2px solid ${T.gold}`, borderRadius: "8px",
        padding: "20px", maxHeight: "90vh", overflowY: "auto", maxWidth: "700px", width: "95%"
      }}>
        <h2 style={{ color: T.gold, fontFamily: T.heading, margin: "0 0 16px 0" }}>Create Spell</h2>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Template</label>
          <select onChange={e => handleTemplateSelect(e.target.value)} style={{
            width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.gold}`, borderRadius: "4px"
          }}>
            <option value="">-- Select template --</option>
            {templates && Object.keys(templates).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Level (0-9)</label>
            <select value={form.level} onChange={e => setForm({ ...form, level: parseInt(e.target.value) })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>School</label>
            <select value={form.school} onChange={e => setForm({ ...form, school: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
              {schools.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "20px" }}>
            <label style={{ color: T.text, fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.ritual} onChange={e => setForm({ ...form, ritual: e.target.checked })} />
              Ritual
            </label>
            <label style={{ color: T.text, fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.concentration} onChange={e => setForm({ ...form, concentration: e.target.checked })} />
              Concentration
            </label>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Casting Time</label>
            <input type="text" value={form.castingTime} onChange={e => setForm({ ...form, castingTime: e.target.value })}
              placeholder="1 action" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Range</label>
            <input type="text" value={form.range} onChange={e => setForm({ ...form, range: e.target.value })}
              placeholder="60 feet" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Duration</label>
          <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
            placeholder="instantaneous" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "8px" }}>Components</label>
          <div style={{ display: "flex", gap: "12px" }}>
            {["v", "s", "m"].map(c => (
              <label key={c} style={{ color: T.text, fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.components[c]} onChange={e => setForm({ ...form, components: { ...form.components, [c]: e.target.checked } })} />
                {c === "v" ? "Verbal" : c === "s" ? "Somatic" : "Material"}
              </label>
            ))}
          </div>
          {form.components.m && (
            <input type="text" value={form.materialComponent} onChange={e => setForm({ ...form, materialComponent: e.target.value })}
              placeholder="Material component" style={{ width: "100%", padding: "6px", marginTop: "8px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          )}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "80px" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Damage</label>
            <input type="text" value={form.damage} onChange={e => setForm({ ...form, damage: e.target.value })}
              placeholder="1d8" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Save Type</label>
            <select value={form.saveType} onChange={e => setForm({ ...form, saveType: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
              <option value="">None</option>
              <option value="str">STR</option><option value="dex">DEX</option><option value="con">CON</option>
              <option value="int">INT</option><option value="wis">WIS</option><option value="cha">CHA</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Higher Levels</label>
          <textarea value={form.higherLevels} onChange={e => setForm({ ...form, higherLevels: e.target.value })}
            style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "50px" }} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "8px" }}>Available Classes</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {spellClasses.map(cls => (
              <label key={cls} style={{ color: T.text, fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.classes.includes(cls)} onChange={e => {
                  setForm({
                    ...form,
                    classes: e.target.checked ? [...form.classes, cls] : form.classes.filter(c => c !== cls)
                  });
                }} />
                {cls}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: "8px", backgroundColor: T.crimson, color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: T.heading
          }}>Save Spell</button>
          <button onClick={onClose} style={{
            flex: 1, padding: "8px", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: T.heading
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function NPCCreator({ templates, onSave, onClose, initialData }) {
  const [form, setForm] = React.useState(initialData || {
    name: "", race: "Human", class: "", level: 1, background: "",
    personality: "", ideal: "", bond: "", flaw: "", appearance: "", backstory: "",
    abilities: [10, 10, 10, 10, 10, 10], equipment: "", spells: "", motivation: ""
  });

  const handleTemplateSelect = (templateName) => {
    const tmpl = window.NPC_TEMPLATES && window.NPC_TEMPLATES[templateName];
    if (tmpl) setForm({ ...form, ...tmpl });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        backgroundColor: T.bgCard, border: `2px solid ${T.gold}`, borderRadius: "8px",
        padding: "20px", maxHeight: "90vh", overflowY: "auto", maxWidth: "700px", width: "95%"
      }}>
        <h2 style={{ color: T.gold, fontFamily: T.heading, margin: "0 0 16px 0" }}>Create NPC</h2>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Template</label>
          <select onChange={e => handleTemplateSelect(e.target.value)} style={{
            width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.gold}`, borderRadius: "4px"
          }}>
            <option value="">-- Select template --</option>
            {templates && Object.keys(templates).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Race</label>
            <input type="text" value={form.race} onChange={e => setForm({ ...form, race: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Class</label>
            <input type="text" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}
              placeholder="Fighter" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Level</label>
            <input type="number" value={form.level} onChange={e => setForm({ ...form, level: parseInt(e.target.value) || 1 })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Background</label>
            <input type="text" value={form.background} onChange={e => setForm({ ...form, background: e.target.value })}
              placeholder="Soldier" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Appearance</label>
          <textarea value={form.appearance} onChange={e => setForm({ ...form, appearance: e.target.value })}
            style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "60px" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Personality</label>
            <input type="text" value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })}
              placeholder="Quick-witted and bold" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Ideal</label>
            <input type="text" value={form.ideal} onChange={e => setForm({ ...form, ideal: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Bond</label>
            <input type="text" value={form.bond} onChange={e => setForm({ ...form, bond: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Flaw</label>
            <input type="text" value={form.flaw} onChange={e => setForm({ ...form, flaw: e.target.value })}
              style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: T.text, fontSize: "12px", display: "block", marginBottom: "4px" }}>Backstory</label>
          <textarea value={form.backstory} onChange={e => setForm({ ...form, backstory: e.target.value })}
            style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "80px" }} />
        </div>

        <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "rgba(212,67,58,0.1)", borderRadius: "4px", borderLeft: `3px solid ${T.gold}` }}>
          <label style={{ color: T.gold, fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Secret Motivation (DM Only)</label>
          <textarea value={form.motivation} onChange={e => setForm({ ...form, motivation: e.target.value })}
            placeholder="What does this NPC really want?" style={{ width: "100%", padding: "6px", backgroundColor: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: "4px", boxSizing: "border-box", minHeight: "50px" }} />
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: "8px", backgroundColor: T.crimson, color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: T.heading
          }}>Save NPC</button>
          <button onClick={onClose} style={{
            flex: 1, padding: "8px", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: T.heading
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function CardLibrary({ items, category, onExpand, emptyMsg }) {
  if (!items || items.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: T.textMuted }}>
        {emptyMsg}
      </div>
    );
  }

  const Component = category === "monsters" ? MonsterCard : category === "items" ? ItemCard : category === "spells" ? SpellCard : NPCCard;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "16px",
      padding: "20px"
    }}>
      {items.map((item, idx) => (
        <Component key={idx} {...(category === "monsters" ? { monster: item } : category === "items" ? { item } : category === "spells" ? { spell: item } : { npc: item })} onExpand={() => onExpand(idx)} />
      ))}
    </div>
  );
}

window.CampaignHomebrewView = function CampaignHomebrewView({ data, setData, viewRole }) {
  const [activeTab, setActiveTab] = React.useState("monsters");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showCreator, setShowCreator] = React.useState(false);
  const [expandedCard, setExpandedCard] = React.useState(null);
  const [showStatBlock, setShowStatBlock] = React.useState(false);

  const homebrew = data._homebrew || { monsters: [], items: [], spells: [], npcs: [] };

  const categoryData = {
    monsters: { data: homebrew.monsters, label: "Monsters", icon: "🐉", templates: window.MONSTER_TEMPLATES || {} },
    items: { data: homebrew.items, label: "Items", icon: "⚔", templates: window.ITEM_TEMPLATES || {} },
    spells: { data: homebrew.spells, label: "Spells", icon: "✨", templates: window.SPELL_TEMPLATES || {} },
    npcs: { data: homebrew.npcs, label: "NPCs", icon: "👤", templates: window.NPC_TEMPLATES || {} }
  };

  const currentCat = categoryData[activeTab];
  const filtered = currentCat.data.filter(item => (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreate = (form) => {
    const updated = { ...homebrew, [activeTab]: [...currentCat.data, form] };
    setData(d => ({ ...d, _homebrew: updated }));
    setShowCreator(false);
  };

  const handleDelete = (idx) => {
    const updated = { ...homebrew, [activeTab]: currentCat.data.filter((_, i) => i !== idx) };
    setData(d => ({ ...d, _homebrew: updated }));
    setExpandedCard(null);
  };

  const CreatorComponent = activeTab === "monsters" ? MonsterCreator : activeTab === "items" ? ItemCreator : activeTab === "spells" ? SpellCreator : NPCCreator;

  return (
    <div style={{
      backgroundColor: T.bg,
      color: T.text,
      fontFamily: T.body,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: T.bgNav, borderBottom: `2px solid ${T.gold}`, padding: "24px 20px" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontFamily: T.heading, color: T.gold }}>Homebrew Workshop</h1>
        <p style={{ margin: 0, fontSize: "13px", color: T.textMuted, fontStyle: "italic" }}>Forge custom content for your campaign</p>

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: "12px", marginTop: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
          {Object.entries(categoryData).map(([key, cat]) => (
            <button key={key} onClick={() => { setActiveTab(key); setSearchTerm(""); }} style={{
              padding: "8px 12px",
              backgroundColor: activeTab === key ? T.crimson : "transparent",
              color: activeTab === key ? "#fff" : T.text,
              border: `1px solid ${activeTab === key ? T.crimson : T.border}`,
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: T.ui,
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}>
              <span>{cat.icon}</span> {cat.label} ({cat.data.length})
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "6px 12px",
              backgroundColor: T.bg,
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: "4px",
              fontFamily: T.body,
              fontSize: "12px"
            }} />
          <button onClick={() => setShowCreator(true)} style={{
            padding: "6px 12px",
            backgroundColor: T.gold,
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: T.heading,
            fontSize: "12px",
            fontWeight: "bold"
          }}>+ New {currentCat.label.slice(0, -1)}</button>
          <button style={{
            padding: "6px 12px",
            backgroundColor: T.bgCard,
            color: T.text,
            border: `1px solid ${T.border}`,
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: T.heading,
            fontSize: "12px"
          }}>Import</button>
          <button style={{
            padding: "6px 12px",
            backgroundColor: T.bgCard,
            color: T.text,
            border: `1px solid ${T.border}`,
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: T.heading,
            fontSize: "12px"
          }}>Export</button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {expandedCard !== null ? (
          <div style={{ padding: "20px" }}>
            <button onClick={() => setExpandedCard(null)} style={{
              padding: "6px 12px",
              backgroundColor: T.bgCard,
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: T.heading,
              fontSize: "12px",
              marginBottom: "16px"
            }}>← Back</button>

            {activeTab === "monsters" && (
              <div>
                <h2 style={{ color: T.gold, fontFamily: T.heading, marginTop: 0 }}>{currentCat.data[expandedCard]?.name}</h2>
                {currentCat.data[expandedCard] && <StatBlockPreview monster={currentCat.data[expandedCard]} />}
                <button onClick={() => handleDelete(expandedCard)} style={{
                  marginTop: "16px",
                  padding: "6px 12px",
                  backgroundColor: "#8b3a3a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>Delete</button>
              </div>
            )}

            {activeTab === "items" && currentCat.data[expandedCard] && (
              <div>
                <h2 style={{ color: T.gold, fontFamily: T.heading, marginTop: 0 }}>{currentCat.data[expandedCard].name}</h2>
                <div style={{ backgroundColor: T.bgCard, padding: "16px", borderRadius: "6px", border: `1px solid ${T.border}` }}>
                  <p><strong>Type:</strong> {currentCat.data[expandedCard].type}</p>
                  <p><strong>Rarity:</strong> {currentCat.data[expandedCard].rarity}</p>
                  <p><strong>Description:</strong> {currentCat.data[expandedCard].description}</p>
                  {currentCat.data[expandedCard].lore && <p><strong>Lore:</strong> {currentCat.data[expandedCard].lore}</p>}
                  {currentCat.data[expandedCard].cursed && <p style={{ color: T.crimson }}><strong>Cursed:</strong> {currentCat.data[expandedCard].curseEffect}</p>}
                </div>
                <button onClick={() => handleDelete(expandedCard)} style={{
                  marginTop: "16px",
                  padding: "6px 12px",
                  backgroundColor: "#8b3a3a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>Delete</button>
              </div>
            )}

            {activeTab === "spells" && currentCat.data[expandedCard] && (
              <div>
                <h2 style={{ color: T.gold, fontFamily: T.heading, marginTop: 0 }}>{currentCat.data[expandedCard].name}</h2>
                <div style={{ backgroundColor: T.bgCard, padding: "16px", borderRadius: "6px", border: `1px solid ${T.border}` }}>
                  <p><strong>Level:</strong> {currentCat.data[expandedCard].level} | <strong>School:</strong> {currentCat.data[expandedCard].school}</p>
                  <p><strong>Casting Time:</strong> {currentCat.data[expandedCard].castingTime}</p>
                  <p><strong>Range:</strong> {currentCat.data[expandedCard].range}</p>
                  <p><strong>Duration:</strong> {currentCat.data[expandedCard].duration}</p>
                  <p><strong>Description:</strong> {currentCat.data[expandedCard].description}</p>
                  {currentCat.data[expandedCard].higherLevels && <p><strong>Higher Levels:</strong> {currentCat.data[expandedCard].higherLevels}</p>}
                </div>
                <button onClick={() => handleDelete(expandedCard)} style={{
                  marginTop: "16px",
                  padding: "6px 12px",
                  backgroundColor: "#8b3a3a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>Delete</button>
              </div>
            )}

            {activeTab === "npcs" && currentCat.data[expandedCard] && (
              <div>
                <h2 style={{ color: T.gold, fontFamily: T.heading, marginTop: 0 }}>{currentCat.data[expandedCard].name}</h2>
                <div style={{ backgroundColor: T.bgCard, padding: "16px", borderRadius: "6px", border: `1px solid ${T.border}` }}>
                  <p><strong>Race:</strong> {currentCat.data[expandedCard].race} | <strong>Class:</strong> {currentCat.data[expandedCard].class} (Lvl {currentCat.data[expandedCard].level})</p>
                  <p><strong>Appearance:</strong> {currentCat.data[expandedCard].appearance}</p>
                  <p><strong>Personality:</strong> {currentCat.data[expandedCard].personality}</p>
                  <p><strong>Ideal:</strong> {currentCat.data[expandedCard].ideal}</p>
                  <p><strong>Bond:</strong> {currentCat.data[expandedCard].bond}</p>
                  <p><strong>Flaw:</strong> {currentCat.data[expandedCard].flaw}</p>
                  <p><strong>Backstory:</strong> {currentCat.data[expandedCard].backstory}</p>
                  {viewRole === "dm" && currentCat.data[expandedCard].motivation && (
                    <p style={{ color: T.gold, backgroundColor: "rgba(212,67,58,0.1)", padding: "8px", borderRadius: "4px" }}>
                      <strong>Secret Motivation:</strong> {currentCat.data[expandedCard].motivation}
                    </p>
                  )}
                </div>
                <button onClick={() => handleDelete(expandedCard)} style={{
                  marginTop: "16px",
                  padding: "6px 12px",
                  backgroundColor: "#8b3a3a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>Delete</button>
              </div>
            )}
          </div>
        ) : (
          <CardLibrary items={filtered} category={activeTab} onExpand={setExpandedCard} emptyMsg={`No ${currentCat.label.toLowerCase()} created yet.`} />
        )}
      </div>

      {/* Creator Modal */}
      {showCreator && (
        <CreatorComponent templates={currentCat.templates} onSave={handleCreate} onClose={() => setShowCreator(false)} />
      )}
    </div>
  );
};
