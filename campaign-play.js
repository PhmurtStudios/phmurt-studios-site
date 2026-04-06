// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN MANAGER — PLAY TAB / BATTLEMAP (lazy-loaded module)
// ═══════════════════════════════════════════════════════════════════════════

/* Shared core references from main bundle */
const { useState, useEffect, useCallback, useRef, useMemo } = React;
const {
  T, getHpColor, cssVar, DND_CONDITIONS, CONDITION_HELP,
  Tag, HpBar, PowerBar, LinkBtn, CrimsonBtn, Section, Input, Select, Textarea, Modal, ToggleSwitch,
  eid, uid, cmClone, cmSafeInt, cmAbilityMod, cmHumanizeKey,
  getFantasyIcon, normalizeWorldMapState, ConfirmFlyout,
  ATLAS_LAND_PATH, ATLAS_ISLANDS, ATLAS_WATER_BODIES, ATLAS_RIVERS,
} = window.__CM;
const { ChevronDown, ChevronRight, ChevronLeft, Swords, Users, MapPin, Crown, Scroll, Clock, Star, BookOpen, Dice6, Target, Heart, CheckCircle, Circle, ArrowRight, Plus, Compass, Mountain, Castle, Skull, Flag, TrendingUp, TrendingDown, Minus, SkipForward, Search, Bell, Settings, X, Edit3, Trash2, Eye, EyeOff, Globe, Layers, Activity, Upload, Download, FileText, Save, Copy, Calendar, Lock, Unlock, ToggleLeft, ToggleRight, AlertTriangle, Package, Shield, Wand2, Map: MapIcon, LayoutDashboard, Link, RefreshCw, ChevronUp, MoreVertical, Check, Image, Bold, Italic, List, Type, Heading, Filter } = window.LucideReact || {};
const FilterIcon = Filter || Layers;
const PlayNavIcon = MapIcon || MapPin;

// ═══════════════════════════════════════════════════════════════════════════
// ATLAS GENERATOR — Seeded procedural map generation
// ═══════════════════════════════════════════════════════════════════════════

/* Mulberry32 PRNG — deterministic seeded random */
// ═══════════════════════════════════════════════════════════════════════════
// MONSTER ACTION VFX DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const MONSTER_ACTION_VFX = {
  "Fire Breath": { effect: "explosion", color: "#FF4500", radius: 80, shape: "cone", duration: 1.5, particles: 80, label: "Fire Breath" },
  "Cold Breath": { effect: "freeze", color: "#00BFFF", radius: 80, shape: "cone", duration: 1.5, particles: 80, label: "Cold Breath" },
  "Lightning Breath": { effect: "shockwave", color: "#FFD700", radius: 100, shape: "line", duration: 1.0, particles: 100, label: "Lightning Breath" },
  "Poison Breath": { effect: "poison", color: "#00FF00", radius: 80, shape: "cone", duration: 1.5, particles: 60, label: "Poison Breath" },
  "Acid Breath": { effect: "acid", color: "#9ACD32", radius: 100, shape: "line", duration: 1.2, particles: 70, label: "Acid Breath" },
  "Frightful Presence": { effect: "darkness", color: "#4B0082", radius: 120, shape: "sphere", duration: 2.0, particles: 40, label: "Frightful Presence" },
  "Tail Attack": { effect: "shockwave", color: "#8B7355", radius: 40, shape: "arc", duration: 0.8, particles: 30, label: "Tail Attack" },
  "Wing Attack": { effect: "shockwave", color: "#87CEEB", radius: 50, shape: "cone", duration: 0.9, particles: 35, label: "Wing Attack" },
  "Bite": { effect: "bolt", color: "#A9A9A9", radius: 20, shape: "single", duration: 0.5, particles: 15, label: "Bite" },
  "Claw": { effect: "bolt", color: "#8B0000", radius: 30, shape: "arc", duration: 0.6, particles: 20, label: "Claw" },
  "Tentacle": { effect: "conjuration", color: "#8B008B", radius: 25, shape: "line", duration: 0.7, particles: 25, label: "Tentacle" },
  "Web": { effect: "conjuration", color: "#C0C0C0", radius: 60, shape: "sphere", duration: 1.2, particles: 50, label: "Web" },
  "Petrifying Gaze": { effect: "shield", color: "#808080", radius: 70, shape: "cone", duration: 1.3, particles: 45, label: "Petrifying Gaze" },
  "Charge": { effect: "shockwave", color: "#FFD700", radius: 50, shape: "line", duration: 0.8, particles: 40, label: "Charge" },
  "Slam": { effect: "shockwave", color: "#8B7355", radius: 60, shape: "sphere", duration: 1.0, particles: 50, label: "Slam" },
  "Constrict": { effect: "conjuration", color: "#228B22", radius: 35, shape: "single", duration: 0.9, particles: 30, label: "Constrict" },
  "Spit Rock": { effect: "bolt", color: "#8B7355", radius: 20, shape: "single", duration: 0.6, particles: 25, label: "Spit Rock" },
  "Howl": { effect: "shockwave", color: "#8B0000", radius: 100, shape: "sphere", duration: 1.1, particles: 60, label: "Howl" },
  "Swallow": { effect: "darkness", color: "#000000", radius: 40, shape: "sphere", duration: 0.8, particles: 35, label: "Swallow" },
  "Rot": { effect: "necrotic", color: "#4B0082", radius: 50, shape: "sphere", duration: 1.2, particles: 55, label: "Rot" },
  "Life Drain": { effect: "necrotic", color: "#4B0082", radius: 45, shape: "line", duration: 1.0, particles: 50, label: "Life Drain" },
  "Paralyzing Touch": { effect: "freeze", color: "#00BFFF", radius: 30, shape: "single", duration: 0.7, particles: 20, label: "Paralyzing Touch" },
  "Pack Tactics": { effect: "radiant", color: "#FFD700", radius: 25, shape: "sphere", duration: 0.5, particles: 15, label: "Pack Tactics" },
  "Multiattack": { effect: "bolt", color: "#A9A9A9", radius: 35, shape: "sphere", duration: 0.9, particles: 40, label: "Multiattack" },
  "Innate Spellcasting": { effect: "radiant", color: "#FF00FF", radius: 50, shape: "sphere", duration: 1.0, particles: 45, label: "Innate Spellcasting" },
  "Engulf": { effect: "conjuration", color: "#4B7D5C", radius: 70, shape: "sphere", duration: 1.3, particles: 60, label: "Engulf" },
  "Stench": { effect: "poison", color: "#9ACD32", radius: 60, shape: "sphere", duration: 1.1, particles: 50, label: "Stench" },
  "Rend": { effect: "bolt", color: "#8B0000", radius: 40, shape: "line", duration: 0.7, particles: 30, label: "Rend" },
  "Gore": { effect: "bolt", color: "#FF6347", radius: 30, shape: "single", duration: 0.6, particles: 25, label: "Gore" },
  "Psychic Blast": { effect: "psychic", color: "#9370DB", radius: 70, shape: "cone", duration: 1.2, particles: 55, label: "Psychic Blast" },
  "Extract Brain": { effect: "necrotic", color: "#4B0082", radius: 50, shape: "single", duration: 1.0, particles: 40, label: "Extract Brain" },
  "Eye Rays": { effect: "shockwave", color: "#FF00FF", radius: 100, shape: "line", duration: 1.5, particles: 80, label: "Eye Rays" },
  "Antimagic Cone": { effect: "shield", color: "#4169E1", radius: 90, shape: "cone", duration: 1.3, particles: 50, label: "Antimagic Cone" },
  "Disintegration Ray": { effect: "force", color: "#00FF00", radius: 20, shape: "single", duration: 0.8, particles: 30, label: "Disintegration Ray" },
  "Death Ray": { effect: "necrotic", color: "#000000", radius: 20, shape: "single", duration: 0.8, particles: 30, label: "Death Ray" },
  "Charm Ray": { effect: "enchantment", color: "#FF69B4", radius: 20, shape: "single", duration: 0.8, particles: 25, label: "Charm Ray" },
  "Fear Ray": { effect: "psychic", color: "#4B0082", radius: 20, shape: "single", duration: 0.8, particles: 25, label: "Fear Ray" },
  // ── New monster actions (Goblin, Skeleton, Zombie, Ghoul, Troll, etc.) ──
  "Scimitar": { effect: "bolt", color: "#C0C0C0", radius: 20, shape: "single", duration: 0.4, particles: 12, label: "Scimitar" },
  "Shortbow": { effect: "bolt", color: "#8B7355", radius: 15, shape: "single", duration: 0.4, particles: 10, label: "Shortbow" },
  "Shortsword": { effect: "bolt", color: "#B8B8B8", radius: 18, shape: "single", duration: 0.4, particles: 12, label: "Shortsword" },
  "Dagger": { effect: "bolt", color: "#A0A0A0", radius: 15, shape: "single", duration: 0.3, particles: 10, label: "Dagger" },
  "Greataxe": { effect: "shockwave", color: "#8B0000", radius: 30, shape: "arc", duration: 0.6, particles: 25, label: "Greataxe" },
  "Greatclub": { effect: "shockwave", color: "#8B7355", radius: 35, shape: "single", duration: 0.5, particles: 20, label: "Greatclub" },
  "Javelin": { effect: "bolt", color: "#8B7355", radius: 15, shape: "single", duration: 0.4, particles: 12, label: "Javelin" },
  "Longsword": { effect: "bolt", color: "#C0C0C0", radius: 25, shape: "arc", duration: 0.5, particles: 15, label: "Longsword" },
  "Longbow": { effect: "bolt", color: "#8B7355", radius: 18, shape: "single", duration: 0.5, particles: 12, label: "Longbow" },
  "Morningstar": { effect: "shockwave", color: "#696969", radius: 25, shape: "single", duration: 0.5, particles: 18, label: "Morningstar" },
  "Spear": { effect: "bolt", color: "#8B7355", radius: 20, shape: "single", duration: 0.4, particles: 12, label: "Spear" },
  "Sling": { effect: "bolt", color: "#8B7355", radius: 12, shape: "single", duration: 0.4, particles: 8, label: "Sling" },
  "Claws": { effect: "bolt", color: "#8B0000", radius: 25, shape: "arc", duration: 0.5, particles: 18, label: "Claws" },
  "Beak": { effect: "bolt", color: "#FF8C00", radius: 20, shape: "single", duration: 0.4, particles: 12, label: "Beak" },
  "Mind Blast": { effect: "psychic", color: "#9370DB", radius: 60, shape: "cone", duration: 1.3, particles: 65, label: "Mind Blast" },
  "Create Specter": { effect: "necrotic", color: "#2F0040", radius: 40, shape: "sphere", duration: 1.5, particles: 40, label: "Create Specter" },
  "Repulsion Breath": { effect: "force", color: "#4169E1", radius: 30, shape: "cone", duration: 1.2, particles: 50, label: "Repulsion Breath" },
  // Beholder individual rays
  "Paralyzing Ray": { effect: "freeze", color: "#00CED1", radius: 20, shape: "single", duration: 0.8, particles: 25, label: "Paralyzing Ray" },
  "Slowing Ray": { effect: "freeze", color: "#87CEEB", radius: 20, shape: "single", duration: 0.8, particles: 25, label: "Slowing Ray" },
  "Enervation Ray": { effect: "necrotic", color: "#2F0040", radius: 20, shape: "single", duration: 0.8, particles: 30, label: "Enervation Ray" },
  "Telekinetic Ray": { effect: "force", color: "#4169E1", radius: 20, shape: "single", duration: 0.8, particles: 25, label: "Telekinetic Ray" },
  "Sleep Ray": { effect: "enchantment", color: "#DDA0DD", radius: 20, shape: "single", duration: 0.8, particles: 20, label: "Sleep Ray" },
  "Petrification Ray": { effect: "shield", color: "#808080", radius: 20, shape: "single", duration: 1.0, particles: 30, label: "Petrification Ray" }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMBAT ACTION ANIMATIONS (melee, ranged, dodge, dash, etc.)
// ═══════════════════════════════════════════════════════════════════════════


// ── Combat Action Animation Renderer ──
function renderActionAnimation(ctx, anim, gridSize, now) {
  const elapsed = (now - anim.startTime) / 1000;
  const progress = Math.min(elapsed / anim.duration, 1);
  if (progress >= 1) return false;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeIn = (t) => t * t * t;
  const cx = anim.x + gridSize / 2, cy = anim.y + gridSize / 2;
  const casterCx = (anim.casterX || anim.x) + gridSize / 2, casterCy = (anim.casterY || anim.y) + gridSize / 2;
  const targetCx = (anim.targetX || anim.x) + gridSize / 2, targetCy = (anim.targetY || anim.y) + gridSize / 2;
  ctx.save();
  const ep = easeOut(progress);
  const alpha = 1 - progress;
  switch (anim.type) {
    case "melee_attack": {
      const arc = Math.PI * 1.8, start = Math.PI * 0.25 - arc/2, cur = start + arc * easeOut(ep);
      const r = gridSize * 0.7;
      // Sweeping slash trail (fading afterimage)
      for (let i = 0; i < 14; i++) { const ta = cur - (i / 14) * arc * 0.5;
        const bx = cx + Math.cos(ta) * r, by = cy + Math.sin(ta) * r;
        const trailAlpha = alpha * (1 - i / 14) * 0.5;
        ctx.fillStyle = `rgba(255,220,160,${trailAlpha})`; ctx.beginPath(); ctx.arc(bx, by, 3 - i * 0.15, 0, Math.PI*2); ctx.fill(); }
      // Main blade edge with glow
      const tipX = cx + Math.cos(cur) * r, tipY = cy + Math.sin(cur) * r;
      ctx.shadowColor = anim.color || "rgba(255,200,120,0.8)"; ctx.shadowBlur = 12;
      ctx.strokeStyle = anim.color || "rgba(255,230,190,0.95)"; ctx.lineWidth = gridSize * 0.14; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(cur) * gridSize * 0.12, cy + Math.sin(cur) * gridSize * 0.12);
      ctx.lineTo(tipX, tipY); ctx.stroke();
      ctx.shadowBlur = 0;
      // Sparks flying off the swing
      for (let i = 0; i < 10; i++) { const a = cur + (Math.random()-0.5)*0.8, d = r*(0.6+Math.random()*0.4);
        const sparkSize = 1 + Math.random() * 2;
        ctx.fillStyle = `rgba(255,${180+Math.random()*75},80,${alpha*0.7})`; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*d, cy+Math.sin(a)*d, sparkSize, 0, Math.PI*2); ctx.fill(); }
      // Impact shockwave at end of swing
      if (ep > 0.75) { const ip = (ep - 0.75) / 0.25;
        ctx.strokeStyle = `rgba(255,220,150,${(1-ip)*0.4})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(tipX, tipY, gridSize * 0.35 * ip, 0, Math.PI*2); ctx.stroke(); }
      break; }
    case "ranged_attack": {
      const px = casterCx + (targetCx - casterCx) * ep, py = casterCy + (targetCy - casterCy) * ep;
      const angle = Math.atan2(targetCy - casterCy, targetCx - casterCx);
      // Glowing trail
      const trailLen = 8;
      for (let i = 1; i <= trailLen; i++) { const tp = Math.max(0, ep - i * 0.025);
        const tx = casterCx + (targetCx - casterCx) * tp, ty = casterCy + (targetCy - casterCy) * tp;
        ctx.fillStyle = `rgba(220,200,130,${alpha * (1 - i / trailLen) * 0.35})`; ctx.beginPath(); ctx.arc(tx, ty, 2.5 - i * 0.2, 0, Math.PI*2); ctx.fill(); }
      // Projectile with glow
      ctx.save(); ctx.translate(px, py); ctx.rotate(angle);
      ctx.shadowColor = "rgba(255,220,100,0.6)"; ctx.shadowBlur = 8;
      ctx.fillStyle = `rgba(230,210,140,${alpha})`; ctx.beginPath();
      ctx.moveTo(gridSize*0.22, 0); ctx.lineTo(-gridSize*0.08, gridSize*0.07); ctx.lineTo(-gridSize*0.06, 0); ctx.lineTo(-gridSize*0.08, -gridSize*0.07);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();
      // Impact burst
      if (ep > 0.85) { const ip = (ep - 0.85) / 0.15;
        for (let i=0;i<12;i++) { const a=(i/12)*Math.PI*2 + angle*0.5, d=gridSize*0.35*ip;
          const sparkAlpha = (1-ip) * 0.7;
          ctx.fillStyle=`rgba(255,220,120,${sparkAlpha})`; ctx.beginPath(); ctx.arc(targetCx+Math.cos(a)*d,targetCy+Math.sin(a)*d,2,0,Math.PI*2); ctx.fill(); }
        // Flash ring
        ctx.strokeStyle = `rgba(255,240,180,${(1-ip)*0.5})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(targetCx, targetCy, gridSize*0.25*ip, 0, Math.PI*2); ctx.stroke(); }
      break; }
    case "dodge": {
      for (let r=0;r<3;r++) { const rp=Math.max(0,Math.min(1,(ep-r*0.15)/(1-r*0.15))); const rad=gridSize*0.8*rp;
        ctx.strokeStyle=`rgba(100,150,255,${(1-rp)*0.5})`; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2); ctx.stroke(); }
      break; }
    case "dash": {
      for (let i=0;i<4;i++) { const gp=(ep-i*0.08); if(gp<0) break;
        ctx.fillStyle=`rgba(150,200,255,${Math.max(0,1-gp)*0.3})`; ctx.beginPath(); ctx.arc(cx-(targetCx-cx)*gp,cy-(targetCy-cy)*gp,gridSize*0.35,0,Math.PI*2); ctx.fill(); }
      for (let i=0;i<6;i++) { const sy=cy+(Math.sin(i*7.3)-0.5)*gridSize*0.4, sl=gridSize*0.3*alpha;
        ctx.strokeStyle=`rgba(150,200,255,${alpha*0.4})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cx-sl,sy); ctx.lineTo(cx,sy); ctx.stroke(); }
      break; }
    case "disengage": {
      ctx.globalAlpha=1-ep*0.7; ctx.fillStyle="rgba(200,200,200,0.3)"; ctx.beginPath(); ctx.arc(cx,cy,gridSize*0.35,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
      for (let i=0;i<5;i++) { const pp=(progress+i*0.08)%1, a=(i/5)*Math.PI*2+progress*Math.PI, d=gridSize*0.4*(1-pp);
        ctx.fillStyle=`rgba(100,100,100,${(1-pp)*0.6})`; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,2,0,Math.PI*2); ctx.fill(); }
      break; }
    case "shove": {
      const dx=targetCx-casterCx, dy=targetCy-casterCy, dist=Math.hypot(dx,dy)||1, angle=Math.atan2(dy,dx);
      for (let r=0;r<3;r++) { const rp=Math.max(0,Math.min(1,(ep-r*0.1)/(1-r*0.1))); const rd=dist*rp;
        ctx.strokeStyle=`rgba(255,150,100,${(1-rp)*0.6})`; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(casterCx+Math.cos(angle)*rd,casterCy+Math.sin(angle)*rd,gridSize*0.2+gridSize*0.2*rp,0,Math.PI*2); ctx.stroke(); }
      break; }
    case "grapple": {
      const rp=1-ep;
      for (let b=0;b<3;b++) { const br=gridSize*0.5-b*gridSize*0.12;
        ctx.strokeStyle=`rgba(200,140,50,${(1-rp)*(1-b*0.2)})`; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(cx,cy,br,0,Math.PI*2); ctx.stroke(); }
      break; }
    case "hide": {
      ctx.globalAlpha=Math.max(0,1-ep); ctx.fillStyle="rgba(50,50,50,0.4)"; ctx.beginPath(); ctx.arc(cx,cy,gridSize*0.35,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
      for (let i=0;i<6;i++) { const pp=(progress+i*0.06)%1;
        ctx.fillStyle=`rgba(30,30,30,${(1-pp)*0.5})`; ctx.beginPath(); ctx.arc(cx+(Math.sin(i*7)-0.5)*gridSize*0.5,cy+gridSize*0.3*(1-pp),2,0,Math.PI*2); ctx.fill(); }
      break; }
    case "help": {
      const lo=Math.sin(progress*Math.PI)*0.8;
      ctx.strokeStyle=`rgba(255,215,100,${lo})`; ctx.lineWidth=2; ctx.setLineDash([5,5]);
      ctx.beginPath(); ctx.moveTo(casterCx,casterCy); ctx.lineTo(targetCx,targetCy); ctx.stroke(); ctx.setLineDash([]);
      for (let i=0;i<5;i++) { const t=(progress+i/5)%1, sx=casterCx+(targetCx-casterCx)*t, sy=casterCy+(targetCy-casterCy)*t;
        ctx.fillStyle=`rgba(255,215,100,${lo})`; ctx.beginPath(); ctx.arc(sx,sy,Math.sin(t*Math.PI)*3,0,Math.PI*2); ctx.fill(); }
      break; }
    case "death_save_success": {
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,gridSize*0.8);
      g.addColorStop(0,`rgba(100,200,100,${alpha*0.8})`); g.addColorStop(1,"rgba(150,255,100,0)");
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,gridSize*0.8*ep,0,Math.PI*2); ctx.fill();
      break; }
    case "death_save_fail": {
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,gridSize*0.8);
      g.addColorStop(0,`rgba(200,50,50,${alpha*0.8})`); g.addColorStop(1,"rgba(100,0,0,0)");
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,gridSize*0.8*(1-ep),0,Math.PI*2); ctx.fill();
      break; }
    case "critical_hit": {
      const br=gridSize*0.3, mr=gridSize*1.5, cr=br+(mr-br)*ep;
      // Dramatic golden explosion burst
      ctx.shadowColor = "rgba(255,200,50,0.8)"; ctx.shadowBlur = 20;
      const g=ctx.createRadialGradient(cx,cy,cr*0.15,cx,cy,cr);
      g.addColorStop(0,`rgba(255,255,180,${alpha*0.9})`); g.addColorStop(0.3,`rgba(255,220,80,${alpha*0.6})`); g.addColorStop(0.7,`rgba(255,150,30,${alpha*0.25})`); g.addColorStop(1,"rgba(255,80,0,0)");
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      // Star burst rays — longer, with varying lengths
      for (let i=0;i<20;i++) { const a=(i/20)*Math.PI*2, rl=gridSize*(1.2+Math.sin(i*3.7)*0.4)*ep;
        const rayWidth = i % 2 === 0 ? 3 : 1.5;
        ctx.strokeStyle=`rgba(255,${200+Math.sin(i*2)*55},50,${alpha*0.7})`; ctx.lineWidth=rayWidth; ctx.lineCap="round"; ctx.beginPath();
        ctx.moveTo(cx+Math.cos(a)*br*0.5,cy+Math.sin(a)*br*0.5); ctx.lineTo(cx+Math.cos(a)*(br+rl),cy+Math.sin(a)*(br+rl)); ctx.stroke(); }
      // Inner white flash
      if (progress < 0.3) { const flashAlpha = (1 - progress/0.3) * 0.6;
        ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`; ctx.beginPath(); ctx.arc(cx,cy,gridSize*0.4*(1-progress/0.3)+gridSize*0.15,0,Math.PI*2); ctx.fill(); }
      // Floating sparks
      for (let i=0;i<16;i++) { const a=(i/16)*Math.PI*2+progress*2, d=gridSize*(0.5+1.2*ep);
        const sparkAlpha = alpha * (1 - (i%3)*0.2);
        ctx.fillStyle=`rgba(255,${180+i*4},${30+i*8},${sparkAlpha*0.6})`; ctx.beginPath();
        ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d-gridSize*0.3*ep,2+Math.random(),0,Math.PI*2); ctx.fill(); }
      ctx.lineCap="butt";
      break; }
    case "miss": {
      for (let i=0;i<3;i++) { const ly=targetCy+(i-1)*gridSize*0.15;
        ctx.strokeStyle=`rgba(150,150,150,${alpha*0.3})`; ctx.lineWidth=1; ctx.beginPath();
        ctx.moveTo(targetCx-gridSize*0.25*ep,ly); ctx.lineTo(targetCx+gridSize*0.25*ep,ly); ctx.stroke(); }
      break; }
    case "block": {
      const hs=gridSize*0.35*Math.sin(progress*Math.PI);
      ctx.fillStyle=`rgba(100,200,255,${alpha*0.4})`; ctx.strokeStyle=`rgba(150,220,255,${alpha*0.8})`; ctx.lineWidth=2;
      ctx.beginPath(); for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2-Math.PI/6;
        if(i===0)ctx.moveTo(cx+Math.cos(a)*hs,cy+Math.sin(a)*hs);else ctx.lineTo(cx+Math.cos(a)*hs,cy+Math.sin(a)*hs);}
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break; }
    case "opportunity_attack": {
      const sa=-Math.PI/4+Math.PI*0.5*ep, r=gridSize*0.5;
      ctx.strokeStyle=`rgba(255,100,100,${alpha*0.8})`; ctx.lineWidth=gridSize*0.12; ctx.lineCap="round";
      ctx.beginPath(); ctx.moveTo(cx+Math.cos(sa-Math.PI/6)*r,cy+Math.sin(sa-Math.PI/6)*r);
      ctx.lineTo(cx+Math.cos(sa+Math.PI/6)*r,cy+Math.sin(sa+Math.PI/6)*r); ctx.stroke();
      ctx.fillStyle=`rgba(255,100,100,${Math.sin(progress*Math.PI)*0.5})`; ctx.font=`bold ${gridSize*0.4}px Arial`;
      ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("!",cx,cy-gridSize*0.3);
      break; }
    case "second_wind": {
      for(let t=0;t<=4*Math.PI;t+=0.1){const r=gridSize*0.6*(t/(4*Math.PI))*ep;
        ctx.fillStyle=`rgba(100,200,100,${alpha*0.5})`; ctx.beginPath(); ctx.arc(cx+Math.cos(t)*r,cy+Math.sin(t)*r,2,0,Math.PI*2); ctx.fill();}
      break; }
    case "action_surge": {
      for(let r=0;r<4;r++){const rp=Math.max(0,Math.min(1,(ep-r*0.15)/(1-r*0.15))); const rad=gridSize*0.3+gridSize*0.4*rp;
        ctx.strokeStyle=`rgba(255,200,50,${(1-rp)*0.7})`; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2); ctx.stroke();}
      for(let i=0;i<12;i++){const pp=(progress+i*0.05)%1, a=(i/12)*Math.PI*2, d=gridSize*0.7*pp;
        ctx.fillStyle=`rgba(255,200,50,${(1-pp)*0.7})`; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d-gridSize*0.4*pp,2,0,Math.PI*2); ctx.fill();}
      break; }
    case "sneak_attack": {
      const da=-Math.PI/3+Math.PI*0.5*ep, dr=gridSize*0.55;
      // Shadow wisps coiling around the strike
      for(let i=0;i<10;i++){const sp=(progress+i*0.06)%1, a=(i/10)*Math.PI*2+progress*3;
        const d=gridSize*(0.3+0.4*sp)*(1-sp*0.5), rise = -gridSize*0.15*sp;
        ctx.fillStyle=`rgba(60,20,100,${(1-sp)*0.45})`; ctx.beginPath();
        ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d+rise,2.5-sp,0,Math.PI*2); ctx.fill();}
      // Dagger strike from the shadows
      ctx.save(); ctx.translate(cx+Math.cos(da)*dr,cy+Math.sin(da)*dr); ctx.rotate(da+Math.PI/2);
      ctx.shadowColor = "rgba(120,50,200,0.6)"; ctx.shadowBlur = 10;
      ctx.fillStyle=`rgba(140,80,200,${alpha*0.85})`; ctx.beginPath();
      ctx.moveTo(0,gridSize*0.22); ctx.lineTo(-gridSize*0.07,-gridSize*0.12); ctx.lineTo(0,-gridSize*0.18); ctx.lineTo(gridSize*0.07,-gridSize*0.12);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();
      // Purple burst on impact
      if (ep > 0.5 && ep < 0.9) { const bp = (ep - 0.5) / 0.4;
        const burstGrad = ctx.createRadialGradient(cx,cy,0,cx,cy,gridSize*0.5);
        burstGrad.addColorStop(0,`rgba(120,50,200,${(1-bp)*0.25})`);
        burstGrad.addColorStop(1,"rgba(60,20,120,0)");
        ctx.fillStyle=burstGrad; ctx.beginPath(); ctx.arc(cx,cy,gridSize*0.5*bp,0,Math.PI*2); ctx.fill(); }
      break; }
    case "divine_smite": {
      const bo=Math.sin(progress*Math.PI)*0.8;
      // Pillar of golden light descending from above
      ctx.save();
      ctx.shadowColor = "rgba(255,220,80,0.7)"; ctx.shadowBlur = 25;
      const pillarWidth = gridSize * 0.35 * bo;
      const pillarGrad = ctx.createLinearGradient(cx, cy - gridSize * 2, cx, cy);
      pillarGrad.addColorStop(0, `rgba(255,255,200,0)`);
      pillarGrad.addColorStop(0.3, `rgba(255,240,150,${bo * 0.6})`);
      pillarGrad.addColorStop(0.7, `rgba(255,220,80,${bo * 0.8})`);
      pillarGrad.addColorStop(1, `rgba(255,200,50,${bo * 0.9})`);
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(cx - pillarWidth/2, cy - gridSize * 2, pillarWidth, gridSize * 2);
      ctx.shadowBlur = 0; ctx.restore();
      // Radiant burst at ground level
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,gridSize*1.2);
      g.addColorStop(0,`rgba(255,255,180,${alpha*0.75})`); g.addColorStop(0.4,`rgba(255,220,80,${alpha*0.4})`); g.addColorStop(1,"rgba(255,160,30,0)");
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,gridSize*1.2*ep,0,Math.PI*2); ctx.fill();
      // Holy symbol / cross flash (brief)
      if (progress < 0.4) { const flashAlpha = (1 - progress/0.4) * 0.4;
        ctx.strokeStyle = `rgba(255,255,200,${flashAlpha})`; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(cx, cy - gridSize*0.3); ctx.lineTo(cx, cy + gridSize*0.2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - gridSize*0.2, cy - gridSize*0.1); ctx.lineTo(cx + gridSize*0.2, cy - gridSize*0.1); ctx.stroke(); ctx.lineCap = "butt"; }
      // Rising golden motes
      for (let i=0;i<10;i++) { const pp=(progress+i*0.08)%1, a=(i/10)*Math.PI*2;
        const d = gridSize * 0.5 * pp, rise = -gridSize * 0.8 * pp;
        ctx.fillStyle=`rgba(255,220,80,${(1-pp)*0.6})`; ctx.beginPath();
        ctx.arc(cx+Math.cos(a)*d,cy+rise,2,0,Math.PI*2); ctx.fill(); }
      break; }
    case "rage": {
      for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2, fx=cx+Math.cos(a)*(gridSize*0.4+gridSize*0.15*Math.sin(progress*Math.PI*4));
        const fy=cy+Math.sin(a)*(gridSize*0.4+gridSize*0.15*Math.sin(progress*Math.PI*4));
        const fh=gridSize*0.5*(1-Math.pow(i/8,2))*ep;
        ctx.fillStyle=`rgba(255,100,50,${Math.sin(progress*Math.PI)*0.6})`; ctx.beginPath();
        ctx.moveTo(fx,fy); ctx.lineTo(fx-fh*0.15,fy-fh); ctx.lineTo(fx+fh*0.15,fy-fh); ctx.closePath(); ctx.fill();}
      const ag=ctx.createRadialGradient(cx,cy,0,cx,cy,gridSize*0.8);
      ag.addColorStop(0,`rgba(255,100,50,${ep*0.2})`); ag.addColorStop(1,"rgba(255,50,0,0)");
      ctx.fillStyle=ag; ctx.beginPath(); ctx.arc(cx,cy,gridSize*0.8,0,Math.PI*2); ctx.fill();
      break; }

    // ── CROSSBOW BOLT: snappy dark bolt with metallic gleam and violent impact ──
    case "crossbow_bolt": {
      const px = casterCx + (targetCx - casterCx) * ep, py = casterCy + (targetCy - casterCy) * ep;
      const angle = Math.atan2(targetCy - casterCy, targetCx - casterCx);
      const boltLen = gridSize * 0.38;
      // Speed trail (thin streaks)
      for (let i = 1; i <= 6; i++) { const tp = Math.max(0, ep - i * 0.02);
        const tx = casterCx + (targetCx - casterCx) * tp, ty = casterCy + (targetCy - casterCy) * tp;
        ctx.fillStyle = `rgba(100,80,60,${alpha * (1 - i/6) * 0.4})`; ctx.beginPath(); ctx.arc(tx, ty, 1.5, 0, Math.PI*2); ctx.fill(); }
      // Bolt with subtle glow
      ctx.save(); ctx.translate(px, py); ctx.rotate(angle);
      ctx.shadowColor = "rgba(140,120,90,0.4)"; ctx.shadowBlur = 5;
      // Shaft
      ctx.strokeStyle = `rgba(70,55,35,${alpha})`; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-boltLen, 0); ctx.lineTo(boltLen * 0.3, 0); ctx.stroke();
      // Dark metal head
      ctx.fillStyle = `rgba(50,50,60,${alpha})`;
      ctx.beginPath(); ctx.moveTo(boltLen * 0.3, 0); ctx.lineTo(boltLen * 0.15, -3.5); ctx.lineTo(boltLen * 0.55, 0); ctx.lineTo(boltLen * 0.15, 3.5); ctx.closePath(); ctx.fill();
      // Crimson fletching
      ctx.fillStyle = `rgba(170,35,35,${alpha * 0.75})`;
      ctx.beginPath(); ctx.moveTo(-boltLen, 0); ctx.lineTo(-boltLen * 0.65, -5); ctx.lineTo(-boltLen * 0.55, 0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-boltLen, 0); ctx.lineTo(-boltLen * 0.65, 5); ctx.lineTo(-boltLen * 0.55, 0); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();
      // Violent impact sparks
      if (ep > 0.82) { const impactP = (ep - 0.82) / 0.18;
        // White flash at point of impact
        if (impactP < 0.3) { ctx.fillStyle = `rgba(255,255,240,${(1-impactP/0.3)*0.35})`; ctx.beginPath();
          ctx.arc(targetCx, targetCy, gridSize * 0.12, 0, Math.PI*2); ctx.fill(); }
        // Sparks flying outward from impact
        for (let i = 0; i < 12; i++) { const sa = (i / 12) * Math.PI * 2 + angle * 0.3, sd = gridSize * 0.35 * impactP;
          const sparkSize = 1 + Math.random() * 1.5;
          ctx.fillStyle = `rgba(255,${180+Math.random()*60},${60+Math.random()*60},${(1 - impactP) * 0.75})`; ctx.beginPath();
          ctx.arc(targetCx + Math.cos(sa) * sd, targetCy + Math.sin(sa) * sd, sparkSize, 0, Math.PI * 2); ctx.fill(); } }
      break; }

    // ── ARROW SHOT: graceful parabolic arc with luminous trail and thud impact ──
    case "arrow_shot": {
      const arcHeight = gridSize * 0.4;
      const px = casterCx + (targetCx - casterCx) * ep, py = casterCy + (targetCy - casterCy) * ep - Math.sin(ep * Math.PI) * arcHeight;
      const prevP = Math.max(0, ep - 0.04);
      const prevX = casterCx + (targetCx - casterCx) * prevP, prevY = casterCy + (targetCy - casterCy) * prevP - Math.sin(prevP * Math.PI) * arcHeight;
      const angle = Math.atan2(py - prevY, px - prevX);
      const arrLen = gridSize * 0.33;
      // Luminous arc trail (longer, with glow)
      for (let i = 1; i < 10; i++) { const tp = Math.max(0, ep - i * 0.02);
        const tx = casterCx + (targetCx - casterCx) * tp, ty = casterCy + (targetCy - casterCy) * tp - Math.sin(tp * Math.PI) * arcHeight;
        const trailAlpha = alpha * (1 - i / 10) * 0.35;
        ctx.fillStyle = `rgba(220,200,140,${trailAlpha})`; ctx.beginPath(); ctx.arc(tx, ty, 2 - i * 0.12, 0, Math.PI * 2); ctx.fill(); }
      ctx.save(); ctx.translate(px, py); ctx.rotate(angle);
      // Arrow with subtle golden glow
      ctx.shadowColor = "rgba(200,180,100,0.3)"; ctx.shadowBlur = 5;
      // Shaft
      ctx.strokeStyle = `rgba(150,120,70,${alpha})`; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-arrLen, 0); ctx.lineTo(arrLen * 0.3, 0); ctx.stroke();
      // Gleaming arrowhead
      ctx.fillStyle = `rgba(190,190,200,${alpha})`;
      ctx.beginPath(); ctx.moveTo(arrLen * 0.55, 0); ctx.lineTo(arrLen * 0.2, -4); ctx.lineTo(arrLen * 0.2, 4); ctx.closePath(); ctx.fill();
      // White feathers
      ctx.fillStyle = `rgba(220,215,200,${alpha * 0.65})`;
      ctx.beginPath(); ctx.moveTo(-arrLen, 0); ctx.lineTo(-arrLen * 0.75, -4.5); ctx.lineTo(-arrLen * 0.6, 0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-arrLen, 0); ctx.lineTo(-arrLen * 0.75, 4.5); ctx.lineTo(-arrLen * 0.6, 0); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();
      // Satisfying impact — dust puff and embedded arrow flash
      if (ep > 0.88) { const ip = (ep - 0.88) / 0.12;
        // Small dust cloud at impact point
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + angle, d = gridSize * 0.25 * ip;
          ctx.fillStyle = `rgba(180,160,120,${(1 - ip) * 0.5})`; ctx.beginPath();
          ctx.arc(targetCx + Math.cos(a) * d, targetCy + Math.sin(a) * d - gridSize * 0.1 * ip, 2, 0, Math.PI * 2); ctx.fill(); }
        // Brief flash ring
        ctx.strokeStyle = `rgba(200,180,120,${(1-ip)*0.4})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(targetCx, targetCy, gridSize * 0.18 * ip, 0, Math.PI*2); ctx.stroke(); }
      break; }

    // ── THROWN PROJECTILE: tumbling spin ──
    case "thrown_projectile": {
      const px = casterCx + (targetCx - casterCx) * ep, py = casterCy + (targetCy - casterCy) * ep;
      const spinAngle = ep * Math.PI * 6;
      ctx.save(); ctx.translate(px, py); ctx.rotate(spinAngle);
      ctx.fillStyle = `rgba(160,140,100,${alpha})`; ctx.beginPath();
      ctx.moveTo(0, -gridSize * 0.15); ctx.lineTo(-gridSize * 0.06, gridSize * 0.15); ctx.lineTo(gridSize * 0.06, gridSize * 0.15); ctx.closePath(); ctx.fill();
      ctx.restore();
      if (ep > 0.85) { const ip = (ep - 0.85) / 0.15;
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2, d = gridSize * 0.25 * ip;
          ctx.fillStyle = `rgba(160,140,100,${(1 - ip) * 0.5})`; ctx.beginPath(); ctx.arc(targetCx + Math.cos(a) * d, targetCy + Math.sin(a) * d, 2, 0, Math.PI * 2); ctx.fill(); } }
      break; }

    // ── SWORD SLASH: elegant sweeping arc with silver light trail ──
    case "sword_slash": {
      const sweepArc = Math.PI * 2.0;
      const startAngle = Math.atan2(targetCy - casterCy, targetCx - casterCx) - sweepArc / 2;
      const curAngle = startAngle + sweepArc * easeOut(ep);
      const bladeLen = gridSize * 0.72;
      // Luminous arc trail (fading crescent)
      ctx.save();
      for (let i = 0; i < 18; i++) { const ta = curAngle - (i / 18) * sweepArc * 0.45;
        const bx = cx + Math.cos(ta) * bladeLen, by = cy + Math.sin(ta) * bladeLen;
        const trailSize = 3.5 - i * 0.15;
        const trailAlpha = alpha * (1 - i / 18) * 0.5;
        ctx.fillStyle = `rgba(200,210,240,${trailAlpha})`; ctx.beginPath(); ctx.arc(bx, by, Math.max(0.5, trailSize), 0, Math.PI * 2); ctx.fill(); }
      // Silver blade with glow
      const tipX = cx + Math.cos(curAngle) * bladeLen, tipY = cy + Math.sin(curAngle) * bladeLen;
      ctx.shadowColor = "rgba(180,200,255,0.6)"; ctx.shadowBlur = 10;
      ctx.strokeStyle = (anim.color || "rgba(220,225,245,0.95)"); ctx.lineWidth = gridSize * 0.1; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(curAngle) * gridSize * 0.12, cy + Math.sin(curAngle) * gridSize * 0.12);
      ctx.lineTo(tipX, tipY); ctx.stroke();
      ctx.shadowBlur = 0;
      // Gleaming sparks at tip
      for (let i = 0; i < 8; i++) { const a = curAngle + (Math.random() - 0.5) * 0.6, d = bladeLen * (0.65 + Math.random() * 0.35);
        ctx.fillStyle = `rgba(255,${240+Math.random()*15},${200+Math.random()*55},${alpha * 0.7})`; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1 + Math.random() * 1.5, 0, Math.PI * 2); ctx.fill(); }
      // Slash line flash (brief bright arc segment at the current position)
      if (progress > 0.2 && progress < 0.7) {
        const flashAlpha = Math.sin((progress - 0.2) / 0.5 * Math.PI) * 0.3;
        ctx.strokeStyle = `rgba(255,255,255,${flashAlpha})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, bladeLen, curAngle - 0.3, curAngle + 0.1); ctx.stroke(); }
      ctx.restore();
      break; }

    // ── HEAVY SLASH: brutal overhead cleave with seismic impact ──
    case "heavy_slash": {
      const sweepArc = Math.PI * 2.2;
      const startAngle = Math.atan2(targetCy - casterCy, targetCx - casterCx) - sweepArc / 3;
      const curAngle = startAngle + sweepArc * easeIn(ep);
      const bladeLen = gridSize * 0.9;
      // Thick burning trail
      for (let i = 0; i < 20; i++) { const ta = curAngle - (i / 20) * sweepArc * 0.5;
        const bx = cx + Math.cos(ta) * bladeLen, by = cy + Math.sin(ta) * bladeLen;
        const trailSize = 4 - i * 0.15;
        ctx.fillStyle = `rgba(255,${150+i*4},${40+i*3},${alpha * (1 - i / 20) * 0.55})`; ctx.beginPath(); ctx.arc(bx, by, Math.max(0.5, trailSize), 0, Math.PI * 2); ctx.fill(); }
      // Massive blade with orange glow
      const tipX = cx + Math.cos(curAngle) * bladeLen, tipY = cy + Math.sin(curAngle) * bladeLen;
      ctx.shadowColor = "rgba(255,160,50,0.7)"; ctx.shadowBlur = 15;
      ctx.strokeStyle = (anim.color || "rgba(255,210,130,0.95)"); ctx.lineWidth = gridSize * 0.2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(curAngle) * gridSize * 0.08, cy + Math.sin(curAngle) * gridSize * 0.08);
      ctx.lineTo(tipX, tipY); ctx.stroke();
      ctx.shadowBlur = 0;
      // Ground-pound shockwave on impact (delayed to end of swing)
      if (ep > 0.65) { const rp = (ep - 0.65) / 0.35;
        // Double expanding rings
        for (let r = 0; r < 2; r++) { const rrp = Math.max(0, Math.min(1, (rp - r * 0.15) / 0.7));
          ctx.strokeStyle = `rgba(255,${180+r*40},${80+r*40},${(1 - rrp) * 0.5})`; ctx.lineWidth = 3 - r;
          ctx.beginPath(); ctx.arc(tipX, tipY, gridSize * (0.3 + 0.7 * rrp), 0, Math.PI * 2); ctx.stroke(); }
        // Debris/dust particles rising
        for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + rp * 0.5, d = gridSize * 0.5 * rp;
          ctx.fillStyle = `rgba(180,150,100,${(1 - rp) * 0.5})`; ctx.beginPath();
          ctx.arc(tipX + Math.cos(a) * d, tipY + Math.sin(a) * d - gridSize * 0.4 * rp * rp, 2.5 - rp, 0, Math.PI * 2); ctx.fill(); } }
      break; }

    // ── BLUNT IMPACT: devastating slam with concussive shockwave ──
    case "blunt_impact": {
      const impactTime = 0.35;
      if (progress < impactTime) {
        const wp = progress / impactTime;
        const dx = targetCx - casterCx, dy = targetCy - casterCy;
        const headX = casterCx + dx * easeIn(wp), headY = casterCy + dy * easeIn(wp);
        // Weapon head with motion blur trail
        for (let i = 0; i < 5; i++) { const twp = Math.max(0, wp - i * 0.04);
          const tx = casterCx + dx * easeIn(twp), ty = casterCy + dy * easeIn(twp);
          ctx.fillStyle = `rgba(160,160,180,${(1 - i/5) * alpha * 0.4})`; ctx.beginPath();
          ctx.arc(tx, ty, gridSize * (0.14 - i * 0.02), 0, Math.PI * 2); ctx.fill(); }
        ctx.shadowColor = "rgba(200,200,220,0.5)"; ctx.shadowBlur = 8;
        ctx.fillStyle = `rgba(190,190,210,${alpha})`; ctx.beginPath();
        ctx.arc(headX, headY, gridSize * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        const rp = (progress - impactTime) / (1 - impactTime);
        // White flash on impact
        if (rp < 0.15) { const flashAlpha = (1 - rp/0.15) * 0.5;
          ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`; ctx.beginPath();
          ctx.arc(targetCx, targetCy, gridSize * 0.3, 0, Math.PI * 2); ctx.fill(); }
        // Concentric shockwave rings
        for (let r = 0; r < 4; r++) { const rrp = Math.max(0, Math.min(1, (rp - r * 0.1) / 0.55));
          ctx.strokeStyle = `rgba(200,180,150,${(1 - rrp) * 0.55})`; ctx.lineWidth = 3.5 - r * 0.8;
          ctx.beginPath(); ctx.arc(targetCx, targetCy, gridSize * (0.15 + 0.8 * rrp), 0, Math.PI * 2); ctx.stroke(); }
        // Heavy debris flying outward and upward
        for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, d = gridSize * 0.6 * rp;
          const py = -gridSize * 0.5 * rp * (1 - (i % 3) * 0.2);
          ctx.fillStyle = `rgba(${120+i*8},${100+i*5},${80+i*3},${(1 - rp) * 0.6})`; ctx.beginPath();
          ctx.arc(targetCx + Math.cos(a) * d, targetCy + Math.sin(a) * d + py, 2 + Math.random(), 0, Math.PI * 2); ctx.fill(); }
        // Ground crack lines radiating from impact
        for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3, len = gridSize * 0.5 * Math.min(1, rp * 2);
          ctx.strokeStyle = `rgba(100,80,60,${(1 - rp) * 0.35})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(targetCx, targetCy);
          ctx.lineTo(targetCx + Math.cos(a) * len + Math.sin(i * 3.7) * 4, targetCy + Math.sin(a) * len + Math.cos(i * 2.3) * 4); ctx.stroke(); }
      }
      break; }

    // ── DAGGER STAB: lightning-fast precision strike with crimson flash ──
    case "dagger_stab": {
      const angle = Math.atan2(targetCy - casterCy, targetCx - casterCx);
      const stabDist = gridSize * 0.55;
      const jabProgress = progress < 0.3 ? easeIn(progress / 0.3) : 1 - easeOut((progress - 0.3) / 0.7);
      const dx = Math.cos(angle) * stabDist * jabProgress, dy = Math.sin(angle) * stabDist * jabProgress;
      // Speed lines leading into the stab
      if (progress < 0.5) { const slAlpha = (1 - progress/0.5) * 0.3;
        for (let i = 0; i < 4; i++) { const offset = (i - 1.5) * gridSize * 0.08;
          const perpX = -Math.sin(angle) * offset, perpY = Math.cos(angle) * offset;
          ctx.strokeStyle = `rgba(200,200,220,${slAlpha})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(cx + perpX - Math.cos(angle) * gridSize * 0.2, cy + perpY - Math.sin(angle) * gridSize * 0.2);
          ctx.lineTo(cx + dx + perpX, cy + dy + perpY); ctx.stroke(); } }
      ctx.save(); ctx.translate(cx + dx, cy + dy); ctx.rotate(angle + Math.PI / 4);
      // Blade with metallic sheen
      ctx.shadowColor = "rgba(200,200,220,0.5)"; ctx.shadowBlur = 6;
      ctx.fillStyle = `rgba(200,200,215,${alpha})`;
      ctx.beginPath(); ctx.moveTo(0, -gridSize * 0.17); ctx.lineTo(-gridSize * 0.04, 0); ctx.lineTo(0, gridSize * 0.05); ctx.lineTo(gridSize * 0.04, 0); ctx.closePath(); ctx.fill();
      // Handle
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(90,60,35,${alpha})`;
      ctx.fillRect(-gridSize * 0.03, gridSize * 0.05, gridSize * 0.06, gridSize * 0.09);
      ctx.restore();
      // Blood spray on impact — more dramatic with directional splatter
      if (progress > 0.25 && progress < 0.75) { const bp = (progress - 0.25) / 0.5;
        const impactX = cx + Math.cos(angle) * stabDist * 0.85, impactY = cy + Math.sin(angle) * stabDist * 0.85;
        for (let i = 0; i < 8; i++) {
          const spread = angle + (Math.random() - 0.3) * 1.2; // Biased forward
          const d = gridSize * (0.1 + 0.3 * bp) * (0.5 + Math.random() * 0.5);
          const dropSize = 1 + Math.random() * 2;
          ctx.fillStyle = `rgba(${150+Math.random()*40},20,20,${(1 - bp) * 0.55})`; ctx.beginPath();
          ctx.arc(impactX + Math.cos(spread) * d, impactY + Math.sin(spread) * d, dropSize, 0, Math.PI * 2); ctx.fill(); }
        // Brief crimson flash at point of impact
        if (bp < 0.3) { ctx.fillStyle = `rgba(200,40,40,${(1-bp/0.3)*0.25})`; ctx.beginPath();
          ctx.arc(impactX, impactY, gridSize * 0.15, 0, Math.PI * 2); ctx.fill(); } }
      break; }

    // ── SPEAR THRUST: powerful linear lunge with piercing flash ──
    case "spear_thrust": {
      const angle = Math.atan2(targetCy - casterCy, targetCx - casterCx);
      const thrustDist = gridSize * 0.75;
      const tp = progress < 0.45 ? easeIn(progress / 0.45) : 1;
      const retract = progress > 0.5 ? (progress - 0.5) / 0.5 : 0;
      const dist = thrustDist * tp * (1 - retract * 0.6);
      // Thrust motion lines
      if (progress < 0.6) { const mlAlpha = (1 - progress/0.6) * 0.25;
        for (let i = 0; i < 3; i++) { const offset = (i - 1) * gridSize * 0.06;
          const perpX = -Math.sin(angle) * offset, perpY = Math.cos(angle) * offset;
          ctx.strokeStyle = `rgba(180,160,120,${mlAlpha})`; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(cx + perpX, cy + perpY);
          ctx.lineTo(cx + Math.cos(angle) * dist + perpX, cy + Math.sin(angle) * dist + perpY); ctx.stroke(); } }
      ctx.save(); ctx.translate(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist); ctx.rotate(angle);
      // Long shaft with wood grain feel
      ctx.shadowColor = "rgba(160,140,90,0.3)"; ctx.shadowBlur = 4;
      ctx.strokeStyle = `rgba(130,100,60,${alpha})`; ctx.lineWidth = 2.8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-gridSize * 0.35, 0); ctx.lineTo(gridSize * 0.1, 0); ctx.stroke();
      // Gleaming spearhead
      ctx.fillStyle = `rgba(190,190,205,${alpha})`;
      ctx.beginPath(); ctx.moveTo(gridSize * 0.24, 0); ctx.lineTo(gridSize * 0.08, -4.5); ctx.lineTo(gridSize * 0.08, 4.5); ctx.closePath(); ctx.fill();
      // Edge highlight on spearhead
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.3})`; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(gridSize * 0.24, 0); ctx.lineTo(gridSize * 0.08, -4.5); ctx.stroke();
      ctx.shadowBlur = 0; ctx.restore();
      // Piercing impact — bright flash and blood mist
      if (progress > 0.4 && progress < 0.7) { const fp = (progress - 0.4) / 0.3;
        const impX = cx + Math.cos(angle) * thrustDist, impY = cy + Math.sin(angle) * thrustDist;
        // White pierce flash
        ctx.fillStyle = `rgba(255,255,220,${(1 - fp) * 0.45})`;
        ctx.beginPath(); ctx.arc(impX, impY, gridSize * 0.18 * fp, 0, Math.PI * 2); ctx.fill();
        // Directional blood mist
        for (let i = 0; i < 6; i++) { const spread = angle + (Math.random() - 0.3) * 0.8;
          const d = gridSize * 0.2 * fp * (0.5 + Math.random() * 0.5);
          ctx.fillStyle = `rgba(170,30,30,${(1 - fp) * 0.4})`; ctx.beginPath();
          ctx.arc(impX + Math.cos(spread) * d, impY + Math.sin(spread) * d, 1.5, 0, Math.PI * 2); ctx.fill(); } }
      break; }

    // ── STAFF STRIKE: overhead swing ──
    case "staff_strike": {
      const angle = Math.atan2(targetCy - casterCy, targetCx - casterCx);
      const swingArc = Math.PI * 1.2;
      const startA = angle - Math.PI / 2 - swingArc / 2;
      const curA = startA + swingArc * easeOut(ep);
      const staffLen = gridSize * 0.7;
      const tipX = cx + Math.cos(curA) * staffLen, tipY = cy + Math.sin(curA) * staffLen;
      // Staff body
      ctx.strokeStyle = `rgba(120,90,50,${alpha})`; ctx.lineWidth = gridSize * 0.06; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(curA) * gridSize * 0.1, cy + Math.sin(curA) * gridSize * 0.1);
      ctx.lineTo(tipX, tipY); ctx.stroke();
      // Trail
      for (let i = 0; i < 8; i++) { const ta = curA - (i / 8) * swingArc * 0.3;
        const tx = cx + Math.cos(ta) * staffLen, ty = cy + Math.sin(ta) * staffLen;
        ctx.fillStyle = `rgba(180,160,120,${alpha * (1 - i / 8) * 0.3})`; ctx.beginPath(); ctx.arc(tx, ty, 2, 0, Math.PI * 2); ctx.fill(); }
      // Ground impact
      if (ep > 0.8) { const ip = (ep - 0.8) / 0.2;
        ctx.strokeStyle = `rgba(180,160,120,${(1 - ip) * 0.4})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(tipX, tipY, gridSize * 0.3 * ip, 0, Math.PI * 2); ctx.stroke(); }
      break; }
  }
  ctx.restore();
  return true;
}




// ═══════════════════════════════════════════════════════════════════════════
// PLAY MODE
// ═══════════════════════════════════════════════════════════════════════════

// ─── BATTLEMAP (Canvas-based, Mode-driven, Phase 3 with Terrain & Dice Panel) ───────────────

// ── Dice expression parser ──
function parseDiceExpression(expr) {
  const trimmed = expr.trim().toLowerCase();

  // Handle "NxDICE+MOD" notation (e.g., "3x1d4+1" for Magic Missile = 3 separate rolls of 1d4+1)
  const multiMatch = trimmed.match(/^(\d+)x(.+)$/);
  if (multiMatch) {
    const repeatCount = parseInt(multiMatch[1]);
    const innerExpr = multiMatch[2];
    let combinedRolls = [];
    let combinedTotal = 0;
    let combinedMod = 0;
    for (let r = 0; r < repeatCount; r++) {
      const sub = parseDiceExpression(innerExpr);
      combinedRolls.push(...sub.rolls);
      combinedTotal += sub.total;
      combinedMod += sub.modifier;
    }
    return { rolls: combinedRolls, modifier: combinedMod, total: combinedTotal, expression: trimmed, details: combinedRolls.length > 0 ? combinedRolls.join(", ") : "no dice" };
  }

  const rolls = [];
  let total = 0;
  let modifier = 0;

  // Split on + or - but keep the sign
  const parts = trimmed.match(/[+-]?[^+-]+/g) || [];

  for (const part of parts) {
    const p = part.trim();

    // Match dice notation: XdY[kh/kl]Z
    const diceMatch = p.match(/^([+-])?(\d+)?d(\d+)(kh|kl)?(\d+)?$/);
    if (diceMatch) {
      const sign = diceMatch[1] === '-' ? -1 : 1;
      const count = parseInt(diceMatch[2] || 1);
      const sides = parseInt(diceMatch[3]);
      const keepOp = diceMatch[4];
      const keepNum = diceMatch[5] ? parseInt(diceMatch[5]) : count;

      const diceRolls = [];
      for (let i = 0; i < count; i++) {
        diceRolls.push(Math.floor(Math.random() * sides) + 1);
      }
      diceRolls.sort((a, b) => b - a);

      let diceTally = 0;
      if (keepOp === 'kh') {
        diceTally = diceRolls.slice(0, keepNum).reduce((a, b) => a + b, 0);
      } else if (keepOp === 'kl') {
        diceTally = diceRolls.slice(-keepNum).reduce((a, b) => a + b, 0);
      } else {
        diceTally = diceRolls.reduce((a, b) => a + b, 0);
      }

      diceTally *= sign;
      total += diceTally;
      rolls.push(...diceRolls.map(r => r * sign));
    } else {
      // Try to parse as modifier
      const num = parseInt(p);
      if (!isNaN(num)) {
        modifier += num;
        total += num;
      }
    }
  }

  return {
    rolls,
    modifier,
    total,
    expression: trimmed,
    details: rolls.length > 0 ? rolls.join(", ") : "no dice"
  };
}

// ── Terrain type definitions ──
const TERRAIN_TYPES = {
  difficult: { color: "rgba(255, 200, 20, 0.45)", label: "Difficult", cost: 2, icon: "D" },
  water: { color: "rgba(50, 160, 255, 0.42)", label: "Water", cost: 2, icon: "W" },
  deepwater: { color: "rgba(20, 80, 180, 0.55)", label: "Deep Water", cost: 3, icon: "~" },
  lava: { color: "rgba(255, 75, 60, 0.45)", label: "Lava", cost: 2, icon: "L" },
  ice: { color: "rgba(185, 200, 215, 0.42)", label: "Ice", cost: 1, icon: "I" },
  pit: { color: "rgba(20, 20, 28, 0.65)", label: "Pit", cost: 999, icon: "X" },
  mud: { color: "rgba(120, 80, 40, 0.45)", label: "Mud", cost: 2, icon: "M" },
  vegetation: { color: "rgba(30, 120, 50, 0.40)", label: "Heavy Veg.", cost: 2, icon: "V" },
  rubble: { color: "rgba(140, 130, 115, 0.45)", label: "Rubble", cost: 2, icon: "R" },
  magic: { color: "rgba(160, 80, 240, 0.40)", label: "Magical", cost: 1, icon: "★" },
  fire: { color: "rgba(255, 140, 30, 0.50)", label: "Fire", cost: 2, icon: "F" },
  darkness: { color: "rgba(10, 5, 20, 0.70)", label: "Darkness", cost: 1, icon: "●" },
};

// ── Wall type definitions ──
const WALL_TYPES = {
  solid: { color: "#b574ff", label: "Solid Wall", dash: [], width: 3, blocksVision: true, blocksMovement: true },
  door: { color: "#e8940a", label: "Door", dash: [6, 3], width: 3, blocksVision: true, blocksMovement: false },
  window: { color: "#58aaff", label: "Window", dash: [2, 4], width: 2, blocksVision: false, blocksMovement: true },
  invisible: { color: "rgba(160,80,240,0.6)", label: "Force Wall", dash: [4, 2], width: 2, blocksVision: false, blocksMovement: true },
  low: { color: "rgba(180,180,180,0.7)", label: "Low Wall", dash: [], width: 2, blocksVision: false, blocksMovement: false },
  high: { color: "rgba(139,69,19,0.8)", label: "High Wall", dash: [1, 3], width: 2, blocksVision: false, blocksMovement: false },
};

// ── Phase 4: Multiplayer & Extensibility constants ──
const SYNC_KEY = 'phmurt-battlemap-sync';
const getSyncStorageKey = (campaignId) => SYNC_KEY + ":" + (campaignId || "local");
const TEMPLATE_KEY = 'phmurt-encounter-templates';

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

/** Parse D&D CR for sorting (e.g. "1/4", "1/2", "17") — avoids eval(), which CSP blocks. */
function parseChallengeRating(cr) {
  const s = String(cr ?? "").trim();
  const i = s.indexOf("/");
  if (i > 0 && i < s.length - 1) {
    const num = parseFloat(s.slice(0, i));
    const den = parseFloat(s.slice(i + 1));
    if (!Number.isNaN(num) && !Number.isNaN(den) && den !== 0) return num / den;
  }
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

// ── Line-of-sight helpers (outside component for performance) ──
function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
  const denom = (bx-ax)*(dy-cy) - (by-ay)*(dx-cx);
  if (Math.abs(denom) < 1e-10) return false;
  const t = ((cx-ax)*(dy-cy) - (cy-ay)*(dx-cx)) / denom;
  const u = ((cx-ax)*(by-ay) - (cy-ay)*(bx-ax)) / denom;
  return t > 0.001 && t < 0.999 && u > 0.001 && u < 0.999;
}

function hasLineOfSight(x1, y1, x2, y2, walls) {
  for (let i = 0; i < walls.length; i++) {
    const w = walls[i];
    // Only walls that block vision interrupt line of sight
    const wt = WALL_TYPES[w.type || "solid"] || WALL_TYPES.solid;
    if (!wt.blocksVision) continue;
    if (segmentsIntersect(x1, y1, x2, y2, w.x1, w.y1, w.x2, w.y2)) return false;
  }
  return true;
}

function computeVisibleCells(tokens, walls, gridSize, mapW, mapH) {
  const visible = {};     // "gx,gy" -> "full" | "dim"
  const visionTokens = tokens.filter(t => t.vision > 0);
  if (visionTokens.length === 0) return null; // null = no vision system active
  const maxGX = Math.ceil(mapW / gridSize);
  const maxGY = Math.ceil(mapH / gridSize);
  for (const t of visionTokens) {
    const visionPx = t.vision * gridSize;
    const darkPx = (t.darkvision || 0) * gridSize;
    const maxR = Math.max(visionPx, darkPx);
    const startGX = Math.max(0, Math.floor((t.x - maxR) / gridSize));
    const startGY = Math.max(0, Math.floor((t.y - maxR) / gridSize));
    const endGX = Math.min(maxGX, Math.ceil((t.x + maxR) / gridSize));
    const endGY = Math.min(maxGY, Math.ceil((t.y + maxR) / gridSize));
    for (let gx = startGX; gx < endGX; gx++) {
      for (let gy = startGY; gy < endGY; gy++) {
        const key = gx + "," + gy;
        if (visible[key] === "full") continue;
        const cx = gx * gridSize + gridSize / 2;
        const cy = gy * gridSize + gridSize / 2;
        const dist = Math.hypot(cx - t.x, cy - t.y);
        if (dist > maxR) continue;
        if (!hasLineOfSight(t.x, t.y, cx, cy, walls)) continue;
        if (dist <= visionPx) {
          visible[key] = "full";
        } else if (dist <= darkPx && visible[key] !== "full") {
          visible[key] = "dim";
        }
      }
    }
  }
  return visible;
}

class BattlemapErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null, errorInfo: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("[BattlemapErrorBoundary]", error, info); this.setState({ errorInfo: info }); }
  render() {
    if (this.state.hasError) {
      const stack = this.state.error?.stack || "";
      const componentStack = this.state.errorInfo?.componentStack || "";
      return React.createElement("div", {
        style: { padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "'Spectral', serif" }
      },
        React.createElement("div", { style: { fontSize: 20, marginBottom: 12, color: "var(--crimson)" } }, "Something went wrong"),
        React.createElement("p", { style: { fontSize: 13, marginBottom: 16 } }, String(this.state.error?.message || "An unexpected error occurred in the battle map.")),
        React.createElement("pre", { style: { fontSize: 10, textAlign: "left", maxHeight: 200, overflow: "auto", background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 8, marginBottom: 12, whiteSpace: "pre-wrap", wordBreak: "break-all", color: "#f06858" } }, stack),
        componentStack && React.createElement("pre", { style: { fontSize: 10, textAlign: "left", maxHeight: 120, overflow: "auto", background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8, marginBottom: 12, whiteSpace: "pre-wrap", wordBreak: "break-all", color: "#ffd54f" } }, "Component stack:" + componentStack),
        React.createElement("button", {
          onClick: () => this.setState({ hasError: false, error: null, errorInfo: null }),
          style: { padding: "8px 20px", background: "rgba(212,67,58,0.12)", border: "1px solid rgba(212,67,58,0.3)", borderRadius: 6, color: "var(--crimson)", cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 12 }
        }, "Try Again")
      );
    }
    return this.props.children;
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// D&D 5e SPELL SLOT TABLES & CASTING CONSTANTS (module scope for performance)
// ═══════════════════════════════════════════════════════════════════════════
// ── D&D 5e Spell Slot Tables ──
// Full casters: Wizard, Sorcerer, Bard, Cleric, Druid
const FULL_CASTER_SLOTS = {
  1:{1:2},2:{1:3},3:{1:4,2:2},4:{1:4,2:3},5:{1:4,2:3,3:2},6:{1:4,2:3,3:3},7:{1:4,2:3,3:3,4:1},8:{1:4,2:3,3:3,4:2},
  9:{1:4,2:3,3:3,4:3,5:1},10:{1:4,2:3,3:3,4:3,5:2},11:{1:4,2:3,3:3,4:3,5:2,6:1},12:{1:4,2:3,3:3,4:3,5:2,6:1},
  13:{1:4,2:3,3:3,4:3,5:2,6:1,7:1},14:{1:4,2:3,3:3,4:3,5:2,6:1,7:1},15:{1:4,2:3,3:3,4:3,5:2,6:1,7:1,8:1},
  16:{1:4,2:3,3:3,4:3,5:2,6:1,7:1,8:1},17:{1:4,2:3,3:3,4:3,5:2,6:1,7:1,8:1,9:1},18:{1:4,2:3,3:3,4:3,5:3,6:1,7:1,8:1,9:1},
  19:{1:4,2:3,3:3,4:3,5:3,6:2,7:1,8:1,9:1},20:{1:4,2:3,3:3,4:3,5:3,6:2,7:2,8:1,9:1}
};
// Half casters: Paladin, Ranger (start at level 2)
const HALF_CASTER_SLOTS = {
  1:{},2:{1:2},3:{1:3},4:{1:3},5:{1:4,2:2},6:{1:4,2:2},7:{1:4,2:3},8:{1:4,2:3},9:{1:4,2:3,3:2},10:{1:4,2:3,3:2},
  11:{1:4,2:3,3:3},12:{1:4,2:3,3:3},13:{1:4,2:3,3:3,4:1},14:{1:4,2:3,3:3,4:1},15:{1:4,2:3,3:3,4:2},16:{1:4,2:3,3:3,4:2},
  17:{1:4,2:3,3:3,4:3,5:1},18:{1:4,2:3,3:3,4:3,5:1},19:{1:4,2:3,3:3,4:3,5:2},20:{1:4,2:3,3:3,4:3,5:2}
};
// Warlock: Pact Magic (all slots same level, fewer slots)
const WARLOCK_SLOTS = {
  1:{slots:1,level:1},2:{slots:2,level:1},3:{slots:2,level:2},4:{slots:2,level:2},5:{slots:2,level:3},6:{slots:2,level:3},
  7:{slots:2,level:4},8:{slots:2,level:4},9:{slots:2,level:5},10:{slots:2,level:5},11:{slots:3,level:5},12:{slots:3,level:5},
  13:{slots:3,level:5},14:{slots:3,level:5},15:{slots:3,level:5},16:{slots:3,level:5},17:{slots:4,level:5},18:{slots:4,level:5},
  19:{slots:4,level:5},20:{slots:4,level:5}
};
// Cantrips known by class and level
const CANTRIPS_KNOWN = {
  Wizard:{1:3,4:4,10:5},Sorcerer:{1:4,4:5,10:6},Bard:{1:2,4:3,10:4},Cleric:{1:3,4:4,10:5},Druid:{1:2,4:3,10:4},
  Warlock:{1:2,4:3,10:4},Artificer:{1:2,10:3,14:4}
};
// Spells known (for known-caster classes) by level
const SPELLS_KNOWN = {
  Bard:{1:4,2:5,3:6,4:7,5:8,6:9,7:10,8:11,9:12,10:14,11:15,13:16,14:18,15:19,17:20,18:22},
  Sorcerer:{1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11,11:12,13:13,15:14,17:15},
  Ranger:{2:2,3:3,5:4,7:5,9:6,11:7,13:8,15:9,17:10,19:11},
  Warlock:{1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,11:11,13:12,15:13,17:14,19:15}
};
// Spellcasting ability by class
const SPELLCASTING_ABILITY = {
  Wizard:"INT",Sorcerer:"CHA",Bard:"CHA",Cleric:"WIS",Druid:"WIS",Paladin:"CHA",Ranger:"WIS",Warlock:"CHA",Artificer:"INT"
};
// Prepared-caster classes (prepare from full class list each day)
const PREPARED_CASTERS = ["Cleric","Druid","Paladin","Wizard"];
// Known-caster classes (fixed list of spells known)
const KNOWN_CASTERS = ["Bard","Sorcerer","Ranger","Warlock"];

// Multi-target spell config: spells that target multiple individual creatures
const MULTI_TARGET_SPELLS = {
  "Magic Missile": { targets: 3, perUpcast: 1 }, // 3 darts + 1 per level above 1
  "Scorching Ray": { targets: 3, perUpcast: 1 }, // 3 rays + 1 per level above 2
  "Eldritch Blast": { targets: 1, perCharLevel: {1:1, 5:2, 11:3, 17:4} }, // beams by character level
};

// Upcast damage scaling rules per spell (additional dice per level above base)
const UPCAST_RULES = {
  "Burning Hands": { bonusDice:"1d6",perLevel:true },
  "Cure Wounds": { bonusHeal:"1d8",perLevel:true },
  "Healing Word": { bonusHeal:"1d4",perLevel:true },
  "Thunderwave": { bonusDice:"1d8",perLevel:true },
  "Shatter": { bonusDice:"1d8",perLevel:true },
  "Fireball": { bonusDice:"1d6",perLevel:true },
  "Lightning Bolt": { bonusDice:"1d6",perLevel:true },
  "Cone of Cold": { bonusDice:"1d8",perLevel:true },
  "Ice Storm": { bonusDice:"1d8",perLevel:true },
  "Blight": { bonusDice:"1d8",perLevel:true },
  "Chain Lightning": { bonusDice:"1d8",perLevel:true },
  "Disintegrate": { bonusDice:"3d6",perLevel:true },
  "Finger of Death": { bonusDice:"2d8+10",perLevel:true },
  "Inflict Wounds": { bonusDice:"1d10",perLevel:true },
  "Guiding Bolt": { bonusDice:"1d6",perLevel:true },
  "Chromatic Orb": { bonusDice:"1d8",perLevel:true },
  "Witch Bolt": { bonusDice:"1d12",perLevel:true },
  "Ray of Sickness": { bonusDice:"1d8",perLevel:true },  // per 2 levels but simplified
  "Acid Arrow": { bonusDice:"1d4",perLevel:true },
  "Spiritual Weapon": { bonusDice:"1d8",per2Levels:true },
  "Spirit Guardians": { bonusDice:"1d8",perLevel:true },
  "Vampiric Touch": { bonusDice:"1d6",perLevel:true },
  "Bane": { bonusTargets:1, perLevel:true },
  "Bless": { bonusTargets:1, perLevel:true },
  "Hold Person": { bonusTargets:1, perLevel:true },
  "Magic Missile": { bonusDarts:1, perLevel:true },
  "Scorching Ray": { bonusRays:1, perLevel:true },
};

// ═══════════════════════════════════════════════════════════════════════════
// D&D 5e CLASS FEATURES BY LEVEL (module scope for performance)
// ═══════════════════════════════════════════════════════════════════════════
// ── Complete D&D 5e Class Features by Level ──
const CLASS_FEATURES_BY_LEVEL = {
  Barbarian: {
    1: [{ id:"rage", name:"Rage", type:"bonus", uses:2, recharge:"long_rest", effect:"Enter rage: advantage on STR checks/saves, +2 melee damage, resistance to B/P/S." },{ id:"unarmored_defense_barb", name:"Unarmored Defense", type:"passive", uses:null, recharge:"passive", effect:"AC = 10 + DEX mod + CON mod when unarmored." }],
    2: [{ id:"reckless_attack", name:"Reckless Attack", type:"special", uses:null, recharge:"at_will", effect:"Attack with advantage; attacks against you have advantage until next turn." },{ id:"danger_sense", name:"Danger Sense", type:"passive", uses:null, recharge:"passive", effect:"Advantage on DEX saves against effects you can see." }],
    3: [{ id:"primal_path", name:"Primal Path", type:"passive", uses:null, recharge:"passive", effect:"Choose subclass: Berserker, Totem Warrior, Ancestral Guardian, Storm Herald, Zealot, Beast, Wild Magic." },{ id:"rage_3", name:"Rage", type:"bonus", uses:3, recharge:"long_rest", effect:"Updated: 3 rages per long rest." }],
    5: [{ id:"extra_attack_barb", name:"Extra Attack", type:"passive", uses:null, recharge:"passive", effect:"Attack twice with Attack action." },{ id:"fast_movement", name:"Fast Movement", type:"passive", uses:null, recharge:"passive", effect:"+10 ft speed when not in heavy armor." }],
    6: [{ id:"rage_4", name:"Rage", type:"bonus", uses:4, recharge:"long_rest", effect:"Updated: 4 rages per long rest." }],
    7: [{ id:"feral_instinct", name:"Feral Instinct", type:"passive", uses:null, recharge:"passive", effect:"Advantage on initiative; can act normally on surprise if you rage." }],
    9: [{ id:"brutal_critical_1", name:"Brutal Critical", type:"passive", uses:null, recharge:"passive", effect:"Roll 1 additional weapon damage die on critical hits." }],
    11: [{ id:"relentless_rage", name:"Relentless Rage", type:"passive", uses:null, recharge:"passive", effect:"DC 10 CON save to drop to 1 HP instead of 0 while raging." }],
    12: [{ id:"rage_5", name:"Rage", type:"bonus", uses:5, recharge:"long_rest", effect:"Updated: 5 rages per long rest." }],
    13: [{ id:"brutal_critical_2", name:"Brutal Critical", type:"passive", uses:null, recharge:"passive", effect:"Updated: Roll 2 additional dice on crits." }],
    15: [{ id:"persistent_rage", name:"Persistent Rage", type:"passive", uses:null, recharge:"passive", effect:"Rage only ends if you choose or fall unconscious." }],
    17: [{ id:"brutal_critical_3", name:"Brutal Critical", type:"passive", uses:null, recharge:"passive", effect:"Updated: Roll 3 additional dice on crits." },{ id:"rage_6", name:"Rage", type:"bonus", uses:6, recharge:"long_rest", effect:"Updated: 6 rages per long rest." }],
    18: [{ id:"indomitable_might", name:"Indomitable Might", type:"passive", uses:null, recharge:"passive", effect:"STR check minimum equals your Strength score." }],
    20: [{ id:"primal_champion", name:"Primal Champion", type:"passive", uses:null, recharge:"passive", effect:"STR and CON +4 (max 24). Unlimited rages." },{ id:"rage_unlimited", name:"Rage", type:"bonus", uses:999, recharge:"long_rest", effect:"Updated: Unlimited rages." }],
  },
  Bard: {
    1: [{ id:"bardic_inspiration_d6", name:"Bardic Inspiration", type:"bonus", uses:null, recharge:"long_rest", effect:"Grant ally 1d6 to add to attack/check/save. Uses = CHA mod." }],
    2: [{ id:"jack_of_all_trades", name:"Jack of All Trades", type:"passive", uses:null, recharge:"passive", effect:"Add half proficiency to non-proficient ability checks." },{ id:"song_of_rest_d6", name:"Song of Rest", type:"passive", uses:null, recharge:"passive", effect:"Allies regain extra 1d6 HP during short rest." }],
    3: [{ id:"expertise_bard", name:"Expertise", type:"passive", uses:null, recharge:"passive", effect:"Double proficiency on 2 chosen skills." },{ id:"bard_college", name:"Bard College", type:"passive", uses:null, recharge:"passive", effect:"Choose subclass: Lore, Valor, Glamour, Swords, Whispers, Creation, Eloquence, Spirits." }],
    5: [{ id:"font_of_inspiration", name:"Font of Inspiration", type:"passive", uses:null, recharge:"passive", effect:"Bardic Inspiration recharges on short rest. Die becomes d8." }],
    6: [{ id:"countercharm", name:"Countercharm", type:"action", uses:null, recharge:"at_will", effect:"Allies within 30ft have advantage on saves vs charm/fear." }],
    10: [{ id:"magical_secrets", name:"Magical Secrets", type:"passive", uses:null, recharge:"passive", effect:"Learn 2 spells from any class. Die becomes d10." }],
    14: [{ id:"magical_secrets_2", name:"Magical Secrets", type:"passive", uses:null, recharge:"passive", effect:"Learn 2 more spells from any class." }],
    15: [{ id:"bardic_inspiration_d12", name:"Bardic Inspiration", type:"bonus", uses:null, recharge:"short_rest", effect:"Updated: Die becomes d12." }],
    18: [{ id:"magical_secrets_3", name:"Magical Secrets", type:"passive", uses:null, recharge:"passive", effect:"Learn 2 more spells from any class." }],
    20: [{ id:"superior_inspiration", name:"Superior Inspiration", type:"passive", uses:null, recharge:"passive", effect:"Regain 1 Bardic Inspiration if you have 0 when rolling initiative." }],
  },
  Cleric: {
    1: [{ id:"divine_domain", name:"Divine Domain", type:"passive", uses:null, recharge:"passive", effect:"Choose domain: Knowledge, Life, Light, Nature, Tempest, Trickery, War, Forge, Grave, Order, Peace, Twilight." }],
    2: [{ id:"channel_divinity_1", name:"Channel Divinity", type:"action", uses:1, recharge:"short_rest", effect:"Turn Undead or domain effect. 1 use per short rest." }],
    5: [{ id:"destroy_undead_half", name:"Destroy Undead", type:"passive", uses:null, recharge:"passive", effect:"Undead CR 1/2 or lower destroyed on failed Turn Undead." }],
    6: [{ id:"channel_divinity_2", name:"Channel Divinity", type:"action", uses:2, recharge:"short_rest", effect:"Updated: 2 uses per short rest." }],
    8: [{ id:"destroy_undead_1", name:"Destroy Undead", type:"passive", uses:null, recharge:"passive", effect:"Updated: CR 1 or lower destroyed." },{ id:"potent_spellcasting", name:"Divine Strike/Potent Spellcasting", type:"passive", uses:null, recharge:"passive", effect:"Add WIS mod to cantrip damage OR +1d8 weapon damage (domain-dependent)." }],
    10: [{ id:"divine_intervention", name:"Divine Intervention", type:"action", uses:1, recharge:"long_rest", effect:"Petition deity for aid. % chance = cleric level." }],
    11: [{ id:"destroy_undead_2", name:"Destroy Undead", type:"passive", uses:null, recharge:"passive", effect:"Updated: CR 2 or lower destroyed." }],
    14: [{ id:"destroy_undead_3", name:"Destroy Undead", type:"passive", uses:null, recharge:"passive", effect:"Updated: CR 3 or lower destroyed." },{ id:"divine_strike_2", name:"Divine Strike", type:"passive", uses:null, recharge:"passive", effect:"Updated: +2d8 weapon damage." }],
    17: [{ id:"destroy_undead_4", name:"Destroy Undead", type:"passive", uses:null, recharge:"passive", effect:"Updated: CR 4 or lower destroyed." }],
    18: [{ id:"channel_divinity_3", name:"Channel Divinity", type:"action", uses:3, recharge:"short_rest", effect:"Updated: 3 uses per short rest." }],
    20: [{ id:"divine_intervention_auto", name:"Divine Intervention", type:"action", uses:1, recharge:"long_rest", effect:"Updated: Automatically succeeds." }],
  },
  Druid: {
    1: [{ id:"druidic", name:"Druidic", type:"passive", uses:null, recharge:"passive", effect:"Know the Druidic language." }],
    2: [{ id:"wild_shape", name:"Wild Shape", type:"action", uses:2, recharge:"short_rest", effect:"Transform into beast CR 1/4, no fly/swim. Lasts hours = druid level / 2." },{ id:"druid_circle", name:"Druid Circle", type:"passive", uses:null, recharge:"passive", effect:"Choose: Land, Moon, Shepherd, Dreams, Spores, Stars, Wildfire." }],
    4: [{ id:"wild_shape_half", name:"Wild Shape", type:"action", uses:2, recharge:"short_rest", effect:"Updated: CR 1/2, can swim." }],
    8: [{ id:"wild_shape_1", name:"Wild Shape", type:"action", uses:2, recharge:"short_rest", effect:"Updated: CR 1, can fly." }],
    18: [{ id:"beast_spells", name:"Beast Spells", type:"passive", uses:null, recharge:"passive", effect:"Cast spells while in Wild Shape (no material components)." },{ id:"timeless_body_druid", name:"Timeless Body", type:"passive", uses:null, recharge:"passive", effect:"Age 1 year per 10 years." }],
    20: [{ id:"archdruid", name:"Archdruid", type:"passive", uses:null, recharge:"passive", effect:"Unlimited Wild Shape uses. Ignore V/S/M components." }],
  },
  Fighter: {
    1: [{ id:"fighting_style_fighter", name:"Fighting Style", type:"passive", uses:null, recharge:"passive", effect:"Choose: Archery (+2 ranged), Defense (+1 AC), Dueling (+2 one-hand), GWF (reroll 1-2), Protection, TWF." },{ id:"second_wind", name:"Second Wind", type:"bonus", uses:1, recharge:"short_rest", effect:"Regain 1d10 + fighter level HP." }],
    2: [{ id:"action_surge_1", name:"Action Surge", type:"special", uses:1, recharge:"short_rest", effect:"Take one additional action on your turn." }],
    3: [{ id:"martial_archetype", name:"Martial Archetype", type:"passive", uses:null, recharge:"passive", effect:"Choose: Champion, Battle Master, Eldritch Knight, Samurai, Echo Knight, Rune Knight, Psi Warrior." }],
    5: [{ id:"extra_attack_fighter", name:"Extra Attack", type:"passive", uses:null, recharge:"passive", effect:"Attack twice with Attack action." }],
    9: [{ id:"indomitable_1", name:"Indomitable", type:"special", uses:1, recharge:"long_rest", effect:"Reroll a failed saving throw." }],
    11: [{ id:"extra_attack_2", name:"Extra Attack (2)", type:"passive", uses:null, recharge:"passive", effect:"Updated: Attack 3 times." }],
    13: [{ id:"indomitable_2", name:"Indomitable", type:"special", uses:2, recharge:"long_rest", effect:"Updated: 2 rerolls per long rest." }],
    17: [{ id:"action_surge_2", name:"Action Surge", type:"special", uses:2, recharge:"short_rest", effect:"Updated: 2 uses per short rest." },{ id:"indomitable_3", name:"Indomitable", type:"special", uses:3, recharge:"long_rest", effect:"Updated: 3 rerolls per long rest." }],
    20: [{ id:"extra_attack_3", name:"Extra Attack (3)", type:"passive", uses:null, recharge:"passive", effect:"Updated: Attack 4 times." }],
  },
  Monk: {
    1: [{ id:"unarmored_defense_monk", name:"Unarmored Defense", type:"passive", uses:null, recharge:"passive", effect:"AC = 10 + DEX mod + WIS mod when unarmored." },{ id:"martial_arts_d4", name:"Martial Arts", type:"passive", uses:null, recharge:"passive", effect:"Unarmed strikes use d4; use DEX for monk weapons; bonus action unarmed strike." }],
    2: [{ id:"ki", name:"Ki", type:"resource", uses:2, recharge:"short_rest", effect:"2 ki points. Spend for Flurry of Blows (2 unarmed), Patient Defense (Dodge), Step of the Wind (Disengage/Dash)." },{ id:"unarmored_movement", name:"Unarmored Movement", type:"passive", uses:null, recharge:"passive", effect:"+10 ft speed unarmored." }],
    3: [{ id:"monastic_tradition", name:"Monastic Tradition", type:"passive", uses:null, recharge:"passive", effect:"Choose: Open Hand, Shadow, Four Elements, Kensei, Drunken Master, Sun Soul, Long Death, Mercy, Astral Self." },{ id:"deflect_missiles", name:"Deflect Missiles", type:"reaction", uses:null, recharge:"at_will", effect:"Reduce ranged damage by 1d10 + DEX + level. Can return if reduced to 0." }],
    4: [{ id:"slow_fall", name:"Slow Fall", type:"reaction", uses:null, recharge:"at_will", effect:"Reduce fall damage by 5 × monk level." }],
    5: [{ id:"extra_attack_monk", name:"Extra Attack", type:"passive", uses:null, recharge:"passive", effect:"Attack twice with Attack action." },{ id:"stunning_strike", name:"Stunning Strike", type:"special", uses:null, recharge:"at_will", effect:"Spend 1 ki on hit: target CON save or stunned until your next turn." },{ id:"martial_arts_d6", name:"Martial Arts", type:"passive", uses:null, recharge:"passive", effect:"Updated: Unarmed d6." }],
    6: [{ id:"ki_empowered_strikes", name:"Ki-Empowered Strikes", type:"passive", uses:null, recharge:"passive", effect:"Unarmed strikes count as magical." }],
    7: [{ id:"evasion_monk", name:"Evasion", type:"passive", uses:null, recharge:"passive", effect:"DEX save: no damage on success, half on fail." },{ id:"stillness_of_mind", name:"Stillness of Mind", type:"action", uses:null, recharge:"at_will", effect:"End one charmed or frightened effect on yourself." }],
    10: [{ id:"purity_of_body", name:"Purity of Body", type:"passive", uses:null, recharge:"passive", effect:"Immune to disease and poison." }],
    11: [{ id:"martial_arts_d8", name:"Martial Arts", type:"passive", uses:null, recharge:"passive", effect:"Updated: Unarmed d8." }],
    13: [{ id:"tongue_of_sun_and_moon", name:"Tongue of the Sun and Moon", type:"passive", uses:null, recharge:"passive", effect:"Understand all spoken languages; all creatures understand you." }],
    14: [{ id:"diamond_soul", name:"Diamond Soul", type:"passive", uses:null, recharge:"passive", effect:"Proficient in all saves. Spend 1 ki to reroll failed save." }],
    15: [{ id:"timeless_body_monk", name:"Timeless Body", type:"passive", uses:null, recharge:"passive", effect:"No aging; no need for food/water." }],
    17: [{ id:"martial_arts_d10", name:"Martial Arts", type:"passive", uses:null, recharge:"passive", effect:"Updated: Unarmed d10." }],
    18: [{ id:"empty_body", name:"Empty Body", type:"action", uses:null, recharge:"at_will", effect:"4 ki: invisible + resistance to all except force for 1 min. 8 ki: Astral Projection." }],
    20: [{ id:"perfect_self", name:"Perfect Self", type:"passive", uses:null, recharge:"passive", effect:"Regain 4 ki when rolling initiative with 0 ki." }],
  },
  Paladin: {
    1: [{ id:"divine_sense", name:"Divine Sense", type:"action", uses:null, recharge:"long_rest", effect:"Detect celestials/fiends/undead within 60 ft. Uses = 1 + CHA mod." },{ id:"lay_on_hands", name:"Lay on Hands", type:"action", uses:null, recharge:"long_rest", effect:"Heal from pool of HP = paladin level × 5. Can cure disease/poison for 5 HP." }],
    2: [{ id:"fighting_style_paladin", name:"Fighting Style", type:"passive", uses:null, recharge:"passive", effect:"Choose: Defense, Dueling, GWF, Protection, Blessed Warrior, Blind Fighting." },{ id:"divine_smite", name:"Divine Smite", type:"special", uses:null, recharge:"at_will", effect:"On melee hit, expend spell slot: +2d8 radiant (+1d8 per slot above 1st, +1d8 vs undead/fiend)." }],
    3: [{ id:"sacred_oath", name:"Sacred Oath", type:"passive", uses:null, recharge:"passive", effect:"Choose: Devotion, Vengeance, Ancients, Conquest, Redemption, Glory, Watchers, Oathbreaker." },{ id:"channel_divinity_paladin", name:"Channel Divinity", type:"action", uses:1, recharge:"short_rest", effect:"Oath-specific channel divinity effect." }],
    5: [{ id:"extra_attack_paladin", name:"Extra Attack", type:"passive", uses:null, recharge:"passive", effect:"Attack twice with Attack action." }],
    6: [{ id:"aura_of_protection", name:"Aura of Protection", type:"passive", uses:null, recharge:"passive", effect:"You + allies within 10 ft add CHA mod to saving throws." }],
    10: [{ id:"aura_of_courage", name:"Aura of Courage", type:"passive", uses:null, recharge:"passive", effect:"You + allies within 10 ft immune to frightened." }],
    11: [{ id:"improved_divine_smite", name:"Improved Divine Smite", type:"passive", uses:null, recharge:"passive", effect:"+1d8 radiant on all melee weapon hits automatically." }],
    14: [{ id:"cleansing_touch", name:"Cleansing Touch", type:"action", uses:null, recharge:"long_rest", effect:"End one spell on willing creature by touch. Uses = CHA mod." }],
    18: [{ id:"aura_expansion", name:"Aura Expansion", type:"passive", uses:null, recharge:"passive", effect:"All auras extend to 30 ft instead of 10 ft." }],
  },
  Ranger: {
    1: [{ id:"favored_enemy", name:"Favored Enemy", type:"passive", uses:null, recharge:"passive", effect:"Advantage on Survival to track and Intelligence to recall info about chosen enemy type." },{ id:"natural_explorer", name:"Natural Explorer", type:"passive", uses:null, recharge:"passive", effect:"Expertise in chosen terrain; can't get lost; advantage on initiative." }],
    2: [{ id:"fighting_style_ranger", name:"Fighting Style", type:"passive", uses:null, recharge:"passive", effect:"Choose: Archery, Defense, Dueling, TWF, Druidic Warrior, Blind Fighting." }],
    3: [{ id:"ranger_archetype", name:"Ranger Archetype", type:"passive", uses:null, recharge:"passive", effect:"Choose: Hunter, Beast Master, Gloom Stalker, Horizon Walker, Monster Slayer, Fey Wanderer, Swarmkeeper." },{ id:"primeval_awareness", name:"Primeval Awareness", type:"action", uses:null, recharge:"at_will", effect:"Spend spell slot to sense aberrations/celestials/dragons/elementals/fey/fiends/undead within 1 mile." }],
    5: [{ id:"extra_attack_ranger", name:"Extra Attack", type:"passive", uses:null, recharge:"passive", effect:"Attack twice with Attack action." }],
    8: [{ id:"lands_stride", name:"Land's Stride", type:"passive", uses:null, recharge:"passive", effect:"Move through difficult terrain without extra cost; advantage on saves vs magical plants." }],
    10: [{ id:"hide_in_plain_sight", name:"Hide in Plain Sight", type:"action", uses:null, recharge:"at_will", effect:"+10 to Stealth while pressed against surface. Can't move." }],
    14: [{ id:"vanish", name:"Vanish", type:"bonus", uses:null, recharge:"at_will", effect:"Hide as bonus action. Can't be tracked nonmagically." }],
    18: [{ id:"feral_senses", name:"Feral Senses", type:"passive", uses:null, recharge:"passive", effect:"No disadvantage attacking invisible creatures. Know location of hidden creatures within 30 ft." }],
    20: [{ id:"foe_slayer", name:"Foe Slayer", type:"passive", uses:null, recharge:"at_will", effect:"Once per turn, add WIS mod to attack or damage vs favored enemy." }],
  },
  Rogue: {
    1: [{ id:"expertise_rogue", name:"Expertise", type:"passive", uses:null, recharge:"passive", effect:"Double proficiency on 2 skills." },{ id:"sneak_attack", name:"Sneak Attack", type:"passive", uses:null, recharge:"at_will", effect:"Once per turn +1d6 when you have advantage or ally within 5ft of target. Scales: +1d6 every 2 levels." }],
    2: [{ id:"cunning_action", name:"Cunning Action", type:"bonus", uses:null, recharge:"at_will", effect:"Bonus action: Dash, Disengage, or Hide." }],
    3: [{ id:"roguish_archetype", name:"Roguish Archetype", type:"passive", uses:null, recharge:"passive", effect:"Choose: Thief, Assassin, Arcane Trickster, Swashbuckler, Scout, Phantom, Soulknife, Mastermind." }],
    5: [{ id:"uncanny_dodge", name:"Uncanny Dodge", type:"reaction", uses:null, recharge:"at_will", effect:"Halve damage from an attack you can see." }],
    7: [{ id:"evasion_rogue", name:"Evasion", type:"passive", uses:null, recharge:"passive", effect:"DEX save: no damage on success, half on fail." }],
    11: [{ id:"reliable_talent", name:"Reliable Talent", type:"passive", uses:null, recharge:"passive", effect:"Minimum 10 on proficient ability checks." }],
    14: [{ id:"blindsense", name:"Blindsense", type:"passive", uses:null, recharge:"passive", effect:"Know location of hidden/invisible creatures within 10 ft." }],
    15: [{ id:"slippery_mind", name:"Slippery Mind", type:"passive", uses:null, recharge:"passive", effect:"Proficient in WIS saving throws." }],
    18: [{ id:"elusive", name:"Elusive", type:"passive", uses:null, recharge:"passive", effect:"No attack has advantage against you unless incapacitated." }],
    20: [{ id:"stroke_of_luck", name:"Stroke of Luck", type:"special", uses:1, recharge:"short_rest", effect:"Turn any missed attack into a hit, or treat any failed check as 20." }],
  },
  Sorcerer: {
    1: [{ id:"sorcerous_origin", name:"Sorcerous Origin", type:"passive", uses:null, recharge:"passive", effect:"Choose: Draconic, Wild Magic, Divine Soul, Shadow, Storm, Aberrant Mind, Clockwork Soul." }],
    2: [{ id:"font_of_magic", name:"Font of Magic", type:"special", uses:null, recharge:"long_rest", effect:"Sorcery points = sorcerer level. Convert slots <-> points." }],
    3: [{ id:"metamagic", name:"Metamagic", type:"special", uses:null, recharge:"at_will", effect:"Choose 2: Careful, Distant, Empowered, Extended, Heightened, Quickened, Seeking, Subtle, Transmuted, Twinned." }],
    10: [{ id:"metamagic_3", name:"Metamagic", type:"special", uses:null, recharge:"at_will", effect:"Updated: Choose 3rd metamagic option." }],
    17: [{ id:"metamagic_4", name:"Metamagic", type:"special", uses:null, recharge:"at_will", effect:"Updated: Choose 4th metamagic option." }],
    20: [{ id:"sorcerous_restoration", name:"Sorcerous Restoration", type:"passive", uses:null, recharge:"short_rest", effect:"Regain 4 sorcery points on short rest." }],
  },
  Warlock: {
    1: [{ id:"otherworldly_patron", name:"Otherworldly Patron", type:"passive", uses:null, recharge:"passive", effect:"Choose: Fiend, Archfey, Great Old One, Celestial, Hexblade, Fathomless, Genie, Undead, Undying." }],
    2: [{ id:"eldritch_invocations", name:"Eldritch Invocations", type:"passive", uses:null, recharge:"passive", effect:"Learn 2 invocations (Agonizing Blast, Devil's Sight, etc.). Gain more at higher levels." }],
    3: [{ id:"pact_boon", name:"Pact Boon", type:"passive", uses:null, recharge:"passive", effect:"Choose: Pact of the Blade (weapon), Chain (familiar), Tome (cantrips), Talisman (bonus to checks)." }],
    7: [{ id:"mystic_arcanum_6", name:"Mystic Arcanum (6th)", type:"action", uses:1, recharge:"long_rest", effect:"Cast one 6th-level spell once per long rest." }],
    9: [{ id:"mystic_arcanum_7", name:"Mystic Arcanum (7th)", type:"action", uses:1, recharge:"long_rest", effect:"Cast one 7th-level spell once per long rest." }],
    11: [{ id:"mystic_arcanum_8", name:"Mystic Arcanum (8th)", type:"action", uses:1, recharge:"long_rest", effect:"Cast one 8th-level spell once per long rest." }],
    13: [{ id:"mystic_arcanum_9", name:"Mystic Arcanum (9th)", type:"action", uses:1, recharge:"long_rest", effect:"Cast one 9th-level spell once per long rest." }],
    20: [{ id:"eldritch_master", name:"Eldritch Master", type:"action", uses:1, recharge:"long_rest", effect:"1-minute ritual to regain all Pact Magic slots." }],
  },
  Wizard: {
    1: [{ id:"arcane_recovery", name:"Arcane Recovery", type:"special", uses:1, recharge:"long_rest", effect:"On short rest, recover spell slots with total level up to ceil(wizard level / 2)." }],
    2: [{ id:"arcane_tradition", name:"Arcane Tradition", type:"passive", uses:null, recharge:"passive", effect:"Choose: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, Transmutation, War Magic, Bladesinging, Chronurgy, Graviturgy, Scribes." }],
    18: [{ id:"spell_mastery", name:"Spell Mastery", type:"passive", uses:null, recharge:"at_will", effect:"Cast one 1st-level and one 2nd-level spell at will without slots." }],
    20: [{ id:"signature_spells", name:"Signature Spells", type:"passive", uses:null, recharge:"short_rest", effect:"Two 3rd-level spells always prepared; cast each once per rest without slots." }],
  },
  Artificer: {
    1: [{ id:"magical_tinkering", name:"Magical Tinkering", type:"action", uses:null, recharge:"at_will", effect:"Imbue tiny objects with light, sound, scent, or visual effects." }],
    2: [{ id:"infuse_item", name:"Infuse Item", type:"special", uses:null, recharge:"long_rest", effect:"Create magic items from infusion list. Known: 4 at 2nd, scaling to 12 at 18th." }],
    3: [{ id:"artificer_specialist", name:"Artificer Specialist", type:"passive", uses:null, recharge:"passive", effect:"Choose: Alchemist, Armorer, Artillerist, Battle Smith." }],
    6: [{ id:"tool_expertise", name:"Tool Expertise", type:"passive", uses:null, recharge:"passive", effect:"Double proficiency with tools you're proficient in." }],
    7: [{ id:"flash_of_genius", name:"Flash of Genius", type:"reaction", uses:null, recharge:"long_rest", effect:"Add INT mod to ability check or save within 30 ft. Uses = INT mod." }],
    10: [{ id:"magic_item_adept", name:"Magic Item Adept", type:"passive", uses:null, recharge:"passive", effect:"Attune to 4 items. Craft common/uncommon items in quarter time at half cost." }],
    11: [{ id:"spell_storing_item", name:"Spell-Storing Item", type:"action", uses:1, recharge:"long_rest", effect:"Store 1st/2nd-level spell in item; others use it without slots (2× INT mod charges)." }],
    14: [{ id:"magic_item_savant", name:"Magic Item Savant", type:"passive", uses:null, recharge:"passive", effect:"Attune to 5 items; ignore class/race/spell/level requirements." }],
    18: [{ id:"magic_item_master", name:"Magic Item Master", type:"passive", uses:null, recharge:"passive", effect:"Attune to 6 items." }],
    20: [{ id:"soul_of_artifice", name:"Soul of Artifice", type:"passive", uses:null, recharge:"passive", effect:"+1 to all saves per attuned item. End infusion to drop to 1 HP instead of 0." }],
  },
};

// Helper: get all features for a class up to a given level
const getClassFeaturesUpToLevel = (className, level) => {
  const classData = CLASS_FEATURES_BY_LEVEL[className];
  if (!classData) return [];
  const features = [];
  for (let lv = 1; lv <= Math.min(20, level); lv++) {
    if (classData[lv]) features.push(...classData[lv]);
  }
  return features;
};

// ═══════════════════════════════════════════════════════════════════════════
// D&D 5e SPELLS DATABASE (module scope for performance)
// ═══════════════════════════════════════════════════════════════════════════
const DND_SPELLS = [
  // CANTRIPS (Level 0)
  { name:"Acid Splash", level:0, school:"Evocation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"1d6 acid", damageType:"acid", save:"", effect:"acid", color:"#76ff03", healing:"", concentration:false, ritual:false, conditions:[], description:"A flick of acid at target creature", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Blade Ward", level:0, school:"Abjuration", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"You have resistance to bludgeoning, piercing, slashing", classes:["Bard","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Chill Touch", level:0, school:"Necromancy", castTime:"1 action", range:120, shape:"single", radius:0, damage:"1d8 necrotic", damageType:"necrotic", save:"", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:["Disadvantage"], description:"A ghostly hand chills the target", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Dancing Lights", level:0, school:"Evocation", castTime:"1 action", range:120, shape:"sphere", radius:10, damage:"", damageType:"", save:"", effect:"conjuration", color:"#ffd54f", healing:"", concentration:true, ritual:false, conditions:[], description:"You create up to 4 torch-sized lights", classes:["Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Fire Bolt", level:0, school:"Evocation", castTime:"1 action", range:120, shape:"single", radius:0, damage:"1d10 fire", damageType:"fire", save:"", effect:"explosion", color:"#ff6030", healing:"", concentration:false, ritual:false, conditions:[], description:"You hurl a mote of fire at a target", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Light", level:0, school:"Evocation", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#ffd54f", healing:"", concentration:false, ritual:false, conditions:[], description:"An object sheds bright light in 20ft radius", classes:["Bard","Cleric","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Mage Hand", level:0, school:"Transmutation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:false, ritual:true, conditions:[], description:"You create a spectral hand to move objects", classes:["Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Mending", level:0, school:"Transmutation", castTime:"1 minute", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:false, ritual:true, conditions:[], description:"You mend a single break in nonmagical object", classes:["Bard","Cleric","Druid","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Minor Illusion", level:0, school:"Illusion", castTime:"1 action", range:30, shape:"sphere", radius:5, damage:"", damageType:"", save:"", effect:"enchantment", color:"#e040fb", healing:"", concentration:false, ritual:false, conditions:[], description:"You create a sound or image illusion", classes:["Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Poison Spray", level:0, school:"Evocation", castTime:"1 action", range:10, shape:"single", radius:0, damage:"1d12 poison", damageType:"poison", save:"CON", effect:"poison", color:"#4caf50", healing:"", concentration:false, ritual:false, conditions:[], description:"Poisonous gas clouds erupt from your hand", classes:["Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Prestidigitation", level:0, school:"Transmutation", castTime:"1 action", range:10, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:false, ritual:false, conditions:[], description:"Minor magical tricks to accomplish mundane tasks", classes:["Bard","Cleric","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Ray of Frost", level:0, school:"Evocation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"1d8 cold", damageType:"cold", save:"", effect:"freeze", color:"#b3e5fc", healing:"", concentration:false, ritual:false, conditions:[], description:"A thin icy beam shoots from your finger", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Sacred Flame", level:0, school:"Evocation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"1d8 radiant", damageType:"radiant", save:"DEX", effect:"radiant", color:"#ffd54f", healing:"", concentration:false, ritual:false, conditions:[], description:"Radiant flame descends on a visible creature", classes:["Cleric"], applyEffect:"damage" },
  { name:"Shocking Grasp", level:0, school:"Evocation", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"1d8 lightning", damageType:"lightning", save:"", effect:"bolt", color:"#5edfff", healing:"", concentration:false, ritual:false, conditions:["Disadvantage"], description:"Lightning springs from your hand to touch one creature", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Spare the Dying", level:0, school:"Necromancy", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#5ee09a", healing:"", concentration:false, ritual:false, conditions:[], description:"You stabilize a dying creature", classes:["Cleric","Wizard"], applyEffect:"utility" },
  { name:"Eldritch Blast", level:0, school:"Evocation", castTime:"1 action", range:120, shape:"single", radius:0, damage:"1d10 force", damageType:"force", save:"", effect:"bolt", color:"#b574ff", healing:"", concentration:false, ritual:false, conditions:[], description:"A beam of crackling energy springs from your finger", classes:["Warlock"], applyEffect:"damage" },
  { name:"Vicious Mockery", level:0, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"1d4 psychic", damageType:"psychic", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:false, ritual:false, conditions:[], description:"You hurl insults at a creature you see", classes:["Bard"], applyEffect:"damage" },
  // LEVEL 1
  { name:"Alarm", level:1, school:"Abjuration", castTime:"1 minute", range:30, shape:"sphere", radius:20, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:true, conditions:[], description:"Set an alarm that triggers when entered", classes:["Artificer","Bard","Ranger","Wizard"], applyEffect:"utility" },
  { name:"Armor of Agathys", level:1, school:"Abjuration", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"Ghostly armor grants 5 temp HP per level", classes:["Warlock"], applyEffect:"buff" },
  { name:"Bane", level:1, school:"Enchantment", castTime:"1 action", range:30, shape:"sphere", radius:30, damage:"", damageType:"", save:"CHA", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Cursed"], description:"Up to 3 creatures within range must make CHA saves or subtract d4 from attack rolls and saving throws", classes:["Bard","Cleric"], applyEffect:"debuff" },
  { name:"Bless", level:1, school:"Enchantment", castTime:"1 action", range:30, shape:"sphere", radius:30, damage:"", damageType:"", save:"", effect:"enchantment", color:"#ffd54f", healing:"", concentration:true, ritual:false, conditions:["Blessed"], description:"Up to 3 creatures within range add d4 to attack rolls and saving throws for the duration", classes:["Cleric","Paladin"], applyEffect:"buff" },
  { name:"Burning Hands", level:1, school:"Evocation", castTime:"1 action", range:0, shape:"cone", radius:15, damage:"3d6 fire", damageType:"fire", save:"DEX", effect:"explosion", color:"#ff6030", healing:"", concentration:false, ritual:false, conditions:[], description:"Flames spread from your hands in a cone", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Command", level:1, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:false, ritual:false, conditions:["Charmed"], description:"You speak a 1-word command a creature obeys", classes:["Cleric","Paladin"], applyEffect:"control" },
  { name:"Cure Wounds", level:1, school:"Evocation", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#5ee09a", healing:"1d8+mod", concentration:false, ritual:false, conditions:[], description:"Touch heals 1d8 + mod hit points", classes:["Artificer","Bard","Cleric","Druid","Paladin","Ranger"], applyEffect:"heal" },
  { name:"Detect Magic", level:1, school:"Divination", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#ffd54f", healing:"", concentration:true, ritual:true, conditions:[], description:"Sense magical auras within 30 feet", classes:["Artificer","Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Disguise Self", level:1, school:"Illusion", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"enchantment", color:"#e040fb", healing:"", concentration:false, ritual:false, conditions:[], description:"You appear as a different humanoid", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Faerie Fire", level:1, school:"Evocation", castTime:"1 action", range:60, shape:"sphere", radius:20, damage:"", damageType:"", save:"DEX", effect:"radiant", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:[], description:"Creatures in area are highlighted with light", classes:["Artificer","Bard","Druid"], applyEffect:"buff" },
  { name:"False Life", level:1, school:"Necromancy", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:[], description:"You gain 1d4 + 4 temporary hit points", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Feather Fall", level:1, school:"Transmutation", castTime:"1 reaction", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:false, ritual:false, conditions:[], description:"Up to 5 willing creatures fall slowly", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Grease", level:1, school:"Conjuration", castTime:"1 action", range:60, shape:"cube", radius:10, damage:"", damageType:"", save:"STR", effect:"conjuration", color:"#a4e89c", healing:"", concentration:false, ritual:false, conditions:["Prone"], description:"Slick grease makes an area difficult terrain", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Healing Word", level:1, school:"Evocation", castTime:"1 bonus action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#5ee09a", healing:"1d4+mod", concentration:false, ritual:false, conditions:[], description:"A bonus action heal from range", classes:["Bard","Cleric","Druid"], applyEffect:"heal" },
  { name:"Identify", level:1, school:"Divination", castTime:"1 minute", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#ffd54f", healing:"", concentration:false, ritual:true, conditions:[], description:"Learn magical properties of an object", classes:["Artificer","Bard","Cleric","Wizard"], applyEffect:"utility" },
  { name:"Illusory Script", level:1, school:"Illusion", castTime:"1 minute", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"enchantment", color:"#e040fb", healing:"", concentration:false, ritual:true, conditions:[], description:"Write magical script only you can read", classes:["Bard","Wizard"], applyEffect:"utility" },
  { name:"Mage Armor", level:1, school:"Abjuration", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"Touch gains AC 13 + DEX", classes:["Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Magic Missile", level:1, school:"Evocation", castTime:"1 action", range:120, shape:"single", radius:0, damage:"3x1d4+1 force", damageType:"force", save:"", effect:"bolt", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"Three darts hit targets for 1d4+1 each", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Protection from Evil and Good", level:1, school:"Abjuration", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:true, ritual:false, conditions:[], description:"Protect a creature from specific creature types", classes:["Artificer","Cleric","Paladin","Wizard"], applyEffect:"buff" },
  { name:"Ray of Sickness", level:1, school:"Evocation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"3d8 poison", damageType:"poison", save:"CON", effect:"poison", color:"#4caf50", healing:"", concentration:false, ritual:false, conditions:["Poisoned"], description:"Ray of poisonous magic", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Sanctuary", level:1, school:"Abjuration", castTime:"1 bonus action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"A target can't be attacked without ending spell", classes:["Cleric"], applyEffect:"buff" },
  { name:"Shield", level:1, school:"Abjuration", castTime:"1 reaction", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"+5 AC including against triggering attack", classes:["Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Tasha's Hideous Laughter", level:1, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Incapacitated"], description:"Target falls prone from laughter", classes:["Bard","Wizard"], applyEffect:"control" },
  { name:"Thunderwave", level:1, school:"Evocation", castTime:"1 action", range:0, shape:"sphere", radius:15, damage:"2d8 thunder", damageType:"thunder", save:"CON", effect:"shockwave", color:"#90caf9", healing:"", concentration:false, ritual:false, conditions:["Prone"], description:"Thunder erupts from you in all directions", classes:["Bard","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Unseen Servant", level:1, school:"Conjuration", castTime:"1 minute", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#a4e89c", healing:"", concentration:false, ritual:true, conditions:[], description:"Invisible force obeys your commands", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Witch Bolt", level:1, school:"Evocation", castTime:"1 action", range:120, shape:"single", radius:0, damage:"1d12 lightning", damageType:"lightning", save:"", effect:"bolt", color:"#5edfff", healing:"", concentration:true, ritual:false, conditions:[], description:"Lightning chains to target, can use bonus to damage", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  // LEVEL 2
  { name:"Acid Arrow", level:2, school:"Evocation", castTime:"1 action", range:90, shape:"single", radius:0, damage:"4d4 acid", damageType:"acid", save:"", effect:"acid", color:"#76ff03", healing:"", concentration:false, ritual:false, conditions:[], description:"Arrow deals acid damage on hit and next turn", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Aganazzar's Scorcher", level:2, school:"Evocation", castTime:"1 action", range:30, shape:"line", radius:0, length:30, damage:"3d8 fire", damageType:"fire", save:"DEX", effect:"explosion", color:"#ff6030", healing:"", concentration:false, ritual:false, conditions:[], description:"30-ft line of flame", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Blindness/Deafness", level:2, school:"Necromancy", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"CON", effect:"darkness", color:"#7c3aed", healing:"", concentration:true, ritual:false, conditions:["Blinded","Deafened"], description:"Target goes blind or deaf", classes:["Cleric","Sorcerer","Wizard"], applyEffect:"debuff" },
  { name:"Cloud of Daggers", level:2, school:"Conjuration", castTime:"1 action", range:60, shape:"cube", radius:5, damage:"4d4 slashing", damageType:"slashing", save:"", effect:"force", color:"#a4e89c", healing:"", concentration:true, ritual:false, conditions:[], description:"Daggers fill cube, deal damage", classes:["Bard","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Darkness", level:2, school:"Evocation", castTime:"1 action", range:60, shape:"sphere", radius:15, damage:"", damageType:"", save:"", effect:"darkness", color:"#1a1a2e", healing:"", concentration:true, ritual:false, conditions:["Blinded"], description:"Magical darkness fills 30-ft sphere", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Detect Thoughts", level:2, school:"Divination", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"WIS", effect:"psychic", color:"#ffd54f", healing:"", concentration:true, ritual:false, conditions:[], description:"Read surface thoughts of one creature", classes:["Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Enhance Ability", level:2, school:"Transmutation", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:["Blessed"], description:"Grant advantage on ability checks with one ability", classes:["Artificer","Bard","Cleric","Druid","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Flaming Sphere", level:2, school:"Conjuration", castTime:"1 action", range:60, shape:"sphere", radius:5, damage:"2d6 fire", damageType:"fire", save:"DEX", effect:"explosion", color:"#ff6030", healing:"", concentration:true, ritual:false, conditions:[], description:"Rolling sphere deals fire damage", classes:["Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Gust of Wind", level:2, school:"Evocation", castTime:"1 action", range:0, shape:"line", radius:0, length:60, damage:"", damageType:"", save:"STR", effect:"shockwave", color:"#90caf9", healing:"", concentration:true, ritual:false, conditions:["Prone"], description:"60-ft line of wind pushes creatures and objects", classes:["Druid","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Heat Metal", level:2, school:"Transmutation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"2d8 fire", damageType:"fire", save:"", effect:"bolt", color:"#ff6030", healing:"", concentration:true, ritual:false, conditions:[], description:"Metal worn/carried burns target", classes:["Artificer","Bard","Cleric","Druid"], applyEffect:"damage" },
  { name:"Hold Person", level:2, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Paralyzed"], description:"Humanoid is paralyzed if it fails save", classes:["Bard","Cleric","Druid","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Invisibility", level:2, school:"Illusion", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Invisible"], description:"Target becomes invisible", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Knock", level:2, school:"Transmutation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:false, ritual:false, conditions:[], description:"Open one lock/door within range", classes:["Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Levitate", level:2, school:"Transmutation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"CON", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:[], description:"Target levitates up to 20 ft above ground", classes:["Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Magic Mouth", level:2, school:"Illusion", castTime:"1 minute", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"enchantment", color:"#e040fb", healing:"", concentration:false, ritual:true, conditions:[], description:"Magical mouth delivers a message", classes:["Bard","Wizard"], applyEffect:"utility" },
  { name:"Mirror Image", level:2, school:"Illusion", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:[], description:"3 illusory duplicates distract attackers", classes:["Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Misty Step", level:2, school:"Conjuration", castTime:"1 bonus action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#a4e89c", healing:"", concentration:false, ritual:false, conditions:[], description:"Teleport up to 30 feet to unoccupied space", classes:["Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Pass Without Trace", level:2, school:"Abjuration", castTime:"1 minute", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"darkness", color:"#58aaff", healing:"", concentration:true, ritual:false, conditions:[], description:"10 creatures can't be tracked", classes:["Artificer","Bard","Druid","Ranger"], applyEffect:"utility" },
  { name:"Phantasmal Force", level:2, school:"Illusion", castTime:"1 action", range:60, shape:"single", radius:0, damage:"1d6 psychic", damageType:"psychic", save:"INT", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:[], description:"Creature sees illusion, takes psychic damage", classes:["Wizard"], applyEffect:"damage" },
  { name:"Rope Trick", level:2, school:"Transmutation", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:false, ritual:false, conditions:[], description:"Rope becomes extra-dimensional shelter", classes:["Wizard"], applyEffect:"utility" },
  { name:"Scorching Ray", level:2, school:"Evocation", castTime:"1 action", range:120, shape:"single", radius:0, damage:"2d6 fire", damageType:"fire", save:"", effect:"explosion", color:"#ff6030", healing:"", concentration:false, ritual:false, conditions:[], description:"3 rays of fire, each deals 2d6", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"See Invisibility", level:2, school:"Divination", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#ffd54f", healing:"", concentration:true, ritual:false, conditions:[], description:"See invisible creatures and objects", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Shatter", level:2, school:"Evocation", castTime:"1 action", range:60, shape:"sphere", radius:10, damage:"3d8 thunder", damageType:"thunder", save:"CON", effect:"shockwave", color:"#90caf9", healing:"", concentration:false, ritual:false, conditions:[], description:"Thunder shatters nonmagical objects in sphere", classes:["Bard","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Spider Climb", level:2, school:"Transmutation", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:[], description:"Target can walk on any surface", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Suggestion", level:2, school:"Enchantment", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Charmed"], description:"You suggest a reasonable action", classes:["Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Web", level:2, school:"Conjuration", castTime:"1 action", range:60, shape:"cube", radius:20, damage:"", damageType:"", save:"DEX", effect:"conjuration", color:"#a4e89c", healing:"", concentration:true, ritual:false, conditions:["Restrained"], description:"Sticky webs fill a cube", classes:["Sorcerer","Wizard"], applyEffect:"control" },
  // LEVEL 3
  { name:"Animate Dead", level:3, school:"Necromancy", castTime:"1 minute", range:10, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:[], description:"Animate a corpse as undead servant", classes:["Cleric","Wizard"], applyEffect:"summon" },
  { name:"Bestow Curse", level:3, school:"Necromancy", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"WIS", effect:"necrotic", color:"#7c3aed", healing:"", concentration:true, ritual:false, conditions:["Cursed"], description:"Curse a creature with various effects", classes:["Bard","Cleric","Wizard"], applyEffect:"debuff" },
  { name:"Blink", level:3, school:"Transmutation", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:false, ritual:false, conditions:["Invisible"], description:"You vanish and reappear randomly", classes:["Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Clairvoyance", level:3, school:"Divination", castTime:"10 minutes", range:1, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"psychic", color:"#ffd54f", healing:"", concentration:true, ritual:false, conditions:[], description:"See through one object you know", classes:["Bard","Cleric","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Counterspell", level:3, school:"Abjuration", castTime:"1 reaction", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"Interrupt a spell being cast", classes:["Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Dispel Magic", level:3, school:"Abjuration", castTime:"1 action", range:120, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"End one spell on target", classes:["Artificer","Bard","Cleric","Druid","Paladin","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Fireball", level:3, school:"Evocation", castTime:"1 action", range:150, shape:"sphere", radius:20, damage:"8d6 fire", damageType:"fire", save:"DEX", effect:"explosion", color:"#ff6030", healing:"", concentration:false, ritual:false, conditions:[], description:"Ball of fire fills 20-ft sphere", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Fly", level:3, school:"Transmutation", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:[], description:"Grant flight speed to creature", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Gaseous Form", level:3, school:"Transmutation", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:[], description:"Target becomes cloud of gas", classes:["Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Glyph of Warding", level:3, school:"Abjuration", castTime:"1 hour", range:0, shape:"touch", radius:0, damage:"5d8", damageType:"fire", save:"DEX", effect:"explosion", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"Inscribe protective glyph", classes:["Artificer","Bard","Cleric","Wizard"], applyEffect:"damage" },
  { name:"Haste", level:3, school:"Transmutation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:["Hasted"], description:"Target gains extra action, speed, AC", classes:["Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Hypnotic Pattern", level:3, school:"Illusion", castTime:"1 action", range:120, shape:"cube", radius:30, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Incapacitated"], description:"Creatures see hypnotic pattern, become incapacitated", classes:["Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Intellect Fortress", level:3, school:"Abjuration", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:true, ritual:false, conditions:[], description:"Protect against psychic damage and charm", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Invisibility (Greater)", level:4, school:"Illusion", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Invisible"], description:"Target stays invisible while attacking", classes:["Bard","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Leomund's Tiny Hut", level:3, school:"Evocation", castTime:"1 minute", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:true, conditions:[], description:"Create a magical shelter for 9 creatures", classes:["Bard","Wizard"], applyEffect:"utility" },
  { name:"Lightning Bolt", level:3, school:"Evocation", castTime:"1 action", range:100, shape:"line", radius:5, length:100, damage:"8d6 lightning", damageType:"lightning", save:"DEX", effect:"bolt", color:"#5edfff", healing:"", concentration:false, ritual:false, conditions:[], description:"100-ft line of lightning", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Major Image", level:3, school:"Illusion", castTime:"1 action", range:120, shape:"cube", radius:20, damage:"", damageType:"", save:"INT", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:[], description:"Create an illusion that moves and acts", classes:["Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Phantom Steed", level:3, school:"Illusion", castTime:"1 minute", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#e040fb", healing:"", concentration:false, ritual:true, conditions:[], description:"Create a spectral mount", classes:["Wizard"], applyEffect:"utility" },
  { name:"Sleet Storm", level:3, school:"Evocation", castTime:"1 action", range:150, shape:"sphere", radius:20, damage:"3d8 cold", damageType:"cold", save:"DEX", effect:"freeze", color:"#b3e5fc", healing:"", concentration:true, ritual:false, conditions:["Prone"], description:"Sleet fills sphere, difficult terrain", classes:["Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Slow", level:3, school:"Transmutation", castTime:"1 action", range:120, shape:"sphere", radius:20, damage:"", damageType:"", save:"WIS", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:[], description:"Creatures move slower, have disadvantage", classes:["Sorcerer","Wizard"], applyEffect:"debuff" },
  { name:"Stinking Cloud", level:3, school:"Conjuration", castTime:"1 action", range:90, shape:"sphere", radius:20, damage:"", damageType:"", save:"CON", effect:"poison", color:"#4caf50", healing:"", concentration:true, ritual:false, conditions:["Poisoned"], description:"Noxious cloud nauseates creatures", classes:["Bard","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Summon Lesser Demons", level:3, school:"Conjuration", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#a4e89c", healing:"", concentration:true, ritual:false, conditions:[], description:"Summon demons to fight for you", classes:["Warlock","Wizard"], applyEffect:"summon" },
  { name:"Tidal Wave", level:3, school:"Evocation", castTime:"1 action", range:120, shape:"cube", radius:30, damage:"4d8 bludgeoning", damageType:"bludgeoning", save:"STR", effect:"shockwave", color:"#90caf9", healing:"", concentration:false, ritual:false, conditions:["Prone"], description:"Wave of water knocks creatures around", classes:["Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Vampiric Touch", level:3, school:"Necromancy", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"3d6 necrotic", damageType:"necrotic", save:"", effect:"necrotic", color:"#7c3aed", healing:"3d6", concentration:true, ritual:false, conditions:[], description:"Drain life from target, heal yourself", classes:["Wizard"], applyEffect:"damage" },
  // LEVEL 4
  { name:"Blight", level:4, school:"Necromancy", castTime:"1 action", range:30, shape:"single", radius:0, damage:"8d8 necrotic", damageType:"necrotic", save:"CON", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:[], description:"Wither a creature or plant", classes:["Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Charm Monster", level:4, school:"Enchantment", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Charmed"], description:"Charm a creature", classes:["Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Confusion", level:4, school:"Enchantment", castTime:"1 action", range:90, shape:"sphere", radius:10, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Incapacitated"], description:"Creatures in area become confused", classes:["Bard","Druid","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Dimension Door", level:4, school:"Conjuration", castTime:"1 action", range:500, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#a4e89c", healing:"", concentration:false, ritual:false, conditions:[], description:"Teleport yourself and ally up to 500 ft", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Fire Shield", level:4, school:"Evocation", castTime:"1 action", range:0, shape:"self", radius:0, damage:"2d8 fire", damageType:"fire", save:"", effect:"shield", color:"#ff6030", healing:"", concentration:true, ritual:false, conditions:[], description:"Flaming aura harms those who strike you", classes:["Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Hallucinatory Terrain", level:4, school:"Illusion", castTime:"10 minutes", range:300, shape:"cube", radius:150, damage:"", damageType:"", save:"INT", effect:"enchantment", color:"#e040fb", healing:"", concentration:false, ritual:true, conditions:[], description:"Hide terrain with illusion", classes:["Bard","Druid","Wizard"], applyEffect:"utility" },
  { name:"Ice Storm", level:4, school:"Evocation", castTime:"1 action", range:300, shape:"sphere", radius:20, damage:"2d8+4d6 cold", damageType:"cold", save:"DEX", effect:"freeze", color:"#b3e5fc", healing:"", concentration:false, ritual:false, conditions:["Prone"], description:"Hail and sleet fills 20-ft sphere", classes:["Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Polymorph", level:4, school:"Transmutation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:[], description:"Transform creature into beast", classes:["Bard","Druid","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Sickening Radiance", level:4, school:"Evocation", castTime:"1 action", range:120, shape:"sphere", radius:30, damage:"2d8 radiant", damageType:"radiant", save:"CON", effect:"poison", color:"#ffd54f", healing:"", concentration:true, ritual:false, conditions:["Poisoned"], description:"Radiation sickens creatures in sphere", classes:["Wizard"], applyEffect:"damage" },
  { name:"Stoneskin", level:4, school:"Abjuration", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:true, ritual:false, conditions:[], description:"Target gains resistance to physical damage", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"buff" },
  // LEVEL 5+
  { name:"Animate Objects", level:5, school:"Transmutation", castTime:"1 action", range:120, shape:"sphere", radius:60, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:[], description:"Objects within range spring to life at your command, attacking your enemies with slam attacks", classes:["Bard","Sorcerer","Wizard"], applyEffect:"summon" },
  { name:"Cloudkill", level:5, school:"Conjuration", castTime:"1 action", range:120, shape:"sphere", radius:20, damage:"5d8 poison", damageType:"poison", save:"CON", effect:"poison", color:"#4caf50", healing:"", concentration:true, ritual:false, conditions:["Poisoned"], description:"Poisonous cloud expands and kills", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Cone of Cold", level:5, school:"Evocation", castTime:"1 action", range:0, shape:"cone", radius:60, damage:"8d8 cold", damageType:"cold", save:"CON", effect:"freeze", color:"#b3e5fc", healing:"", concentration:false, ritual:false, conditions:[], description:"60-ft cone of freezing", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Hold Monster", level:5, school:"Enchantment", castTime:"1 action", range:90, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Paralyzed"], description:"Paralyze any creature", classes:["Bard","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Telekinesis", level:5, school:"Transmutation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:[], description:"Move objects or creatures with mind", classes:["Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Wall of Force", level:5, school:"Evocation", castTime:"1 action", range:120, shape:"cube", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:true, ritual:false, conditions:[], description:"Create invisible protective wall", classes:["Wizard"], applyEffect:"buff" },
  { name:"Chain Lightning", level:6, school:"Evocation", castTime:"1 action", range:150, shape:"single", radius:0, damage:"10d6 lightning", damageType:"lightning", save:"DEX", effect:"bolt", color:"#5edfff", healing:"", concentration:false, ritual:false, conditions:[], description:"Lightning arcs to multiple targets", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Circle of Death", level:6, school:"Necromancy", castTime:"1 action", range:150, shape:"sphere", radius:60, damage:"8d6 necrotic", damageType:"necrotic", save:"CON", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:[], description:"Death energy fills sphere", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Disintegrate", level:6, school:"Evocation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"10d6+40 force", damageType:"force", save:"DEX", effect:"force", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"Utterly destroy target", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Tenser's Transformation", level:6, school:"Transmutation", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:["Hasted"], description:"Transform yourself into warrior", classes:["Wizard"], applyEffect:"buff" },
  // LEVEL 7
  { name:"Delayed Blast Fireball", level:7, school:"Evocation", castTime:"1 action", range:150, shape:"sphere", radius:20, damage:"12d6", damageType:"fire", save:"DEX", effect:"explosion", color:"#ff6030", healing:"", concentration:true, ritual:false, conditions:[], description:"Fireball you can delay up to 1 minute, growing stronger", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Etherealness", level:7, school:"Transmutation", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#a4e89c", healing:"", concentration:false, ritual:false, conditions:["Invisible"], description:"Step into the Ethereal Plane", classes:["Bard","Cleric","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Finger of Death", level:7, school:"Necromancy", castTime:"1 action", range:60, shape:"single", radius:0, damage:"7d8+30", damageType:"necrotic", save:"CON", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:[], description:"Slay with a word; corpse rises as zombie", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Fire Storm", level:7, school:"Evocation", castTime:"1 action", range:150, shape:"sphere", radius:20, damage:"7d10", damageType:"fire", save:"DEX", effect:"explosion", color:"#ff6030", healing:"", concentration:false, ritual:false, conditions:[], description:"Fire rains down in multiple areas", classes:["Cleric","Druid","Sorcerer"], applyEffect:"damage" },
  { name:"Forcecage", level:7, school:"Evocation", castTime:"1 action", range:100, shape:"cube", radius:10, damage:"", damageType:"", save:"CHA", effect:"force", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:["Restrained"], description:"Immobile invisible cage traps creatures", classes:["Bard","Warlock","Wizard"], applyEffect:"control" },
  { name:"Mordenkainen's Sword", level:7, school:"Evocation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"3d10", damageType:"force", save:"", effect:"force", color:"#58aaff", healing:"", concentration:true, ritual:false, conditions:[], description:"Floating sword attacks each turn", classes:["Bard","Wizard"], applyEffect:"damage" },
  { name:"Plane Shift", level:7, school:"Conjuration", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"CHA", effect:"conjuration", color:"#a4e89c", healing:"", concentration:false, ritual:false, conditions:[], description:"Transport willing creatures to another plane", classes:["Cleric","Druid","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Prismatic Spray", level:7, school:"Evocation", castTime:"1 action", range:0, shape:"cone", radius:60, damage:"10d6", damageType:"radiant", save:"DEX", effect:"radiant", color:"#e040fb", healing:"", concentration:false, ritual:false, conditions:["Blinded"], description:"Seven multicolored rays with random effects", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Regenerate", level:7, school:"Transmutation", castTime:"1 minute", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#5ee09a", healing:"4d8+15", concentration:false, ritual:false, conditions:[], description:"Target regains 4d8+15 HP and regenerates limbs", classes:["Bard","Cleric","Druid"], applyEffect:"heal" },
  { name:"Resurrection", level:7, school:"Necromancy", castTime:"1 hour", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#5ee09a", healing:"", concentration:false, ritual:false, conditions:[], description:"Bring a creature dead up to 100 years back to life", classes:["Bard","Cleric"], applyEffect:"utility" },
  { name:"Reverse Gravity", level:7, school:"Transmutation", castTime:"1 action", range:100, shape:"cylinder", radius:50, damage:"", damageType:"", save:"DEX", effect:"transmutation", color:"#b574ff", healing:"", concentration:true, ritual:false, conditions:["Prone"], description:"Gravity reverses in a cylinder, creatures fall upward", classes:["Druid","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Symbol", level:7, school:"Abjuration", castTime:"1 minute", range:0, shape:"touch", radius:0, damage:"10d10", damageType:"necrotic", save:"CON", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:[], description:"Inscribe a glyph that triggers various effects", classes:["Bard","Cleric","Wizard"], applyEffect:"damage" },
  { name:"Teleport", level:7, school:"Conjuration", castTime:"1 action", range:10, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#a4e89c", healing:"", concentration:false, ritual:false, conditions:[], description:"Teleport up to 8 willing creatures anywhere on same plane", classes:["Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  // LEVEL 8
  { name:"Abi-Dalzim's Horrid Wilting", level:8, school:"Necromancy", castTime:"1 action", range:150, shape:"sphere", radius:30, damage:"12d8", damageType:"necrotic", save:"CON", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:[], description:"Drain moisture from creatures in 30-ft sphere", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Antimagic Field", level:8, school:"Abjuration", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:true, ritual:false, conditions:[], description:"10-ft sphere suppresses all magic", classes:["Cleric","Wizard"], applyEffect:"utility" },
  { name:"Clone", level:8, school:"Necromancy", castTime:"1 hour", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"necrotic", color:"#7c3aed", healing:"", concentration:false, ritual:false, conditions:[], description:"Create a duplicate body to revive into", classes:["Wizard"], applyEffect:"utility" },
  { name:"Control Weather", level:8, school:"Transmutation", castTime:"10 minutes", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shockwave", color:"#90caf9", healing:"", concentration:true, ritual:false, conditions:[], description:"Control weather in a 5-mile radius", classes:["Cleric","Druid","Wizard"], applyEffect:"utility" },
  { name:"Dominate Monster", level:8, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#e040fb", healing:"", concentration:true, ritual:false, conditions:["Charmed"], description:"Take total control of any creature", classes:["Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Earthquake", level:8, school:"Evocation", castTime:"1 action", range:500, shape:"sphere", radius:100, damage:"", damageType:"bludgeoning", save:"DEX", effect:"shockwave", color:"#90caf9", healing:"", concentration:true, ritual:false, conditions:["Prone"], description:"Earth shakes violently in a 100-ft radius", classes:["Cleric","Druid","Sorcerer"], applyEffect:"control" },
  { name:"Feeblemind", level:8, school:"Enchantment", castTime:"1 action", range:150, shape:"single", radius:0, damage:"4d6", damageType:"psychic", save:"INT", effect:"psychic", color:"#c77dff", healing:"", concentration:false, ritual:false, conditions:["Stunned"], description:"Shatter a creature's intellect and personality", classes:["Bard","Druid","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Holy Aura", level:8, school:"Abjuration", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#ffd54f", healing:"", concentration:true, ritual:false, conditions:["Blessed"], description:"Divine light protects allies within 30 ft", classes:["Cleric"], applyEffect:"buff" },
  { name:"Incendiary Cloud", level:8, school:"Conjuration", castTime:"1 action", range:150, shape:"sphere", radius:20, damage:"10d8", damageType:"fire", save:"DEX", effect:"explosion", color:"#ff6030", healing:"", concentration:true, ritual:false, conditions:[], description:"Cloud of fire damages creatures each turn", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Maze", level:8, school:"Conjuration", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"INT", effect:"conjuration", color:"#a4e89c", healing:"", concentration:true, ritual:false, conditions:["Incapacitated"], description:"Banish creature into extradimensional maze", classes:["Wizard"], applyEffect:"control" },
  { name:"Mind Blank", level:8, school:"Abjuration", castTime:"1 action", range:0, shape:"touch", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#58aaff", healing:"", concentration:false, ritual:false, conditions:[], description:"Target is immune to psychic damage and divination", classes:["Bard","Wizard"], applyEffect:"buff" },
  { name:"Power Word Stun", level:8, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"psychic", color:"#e040fb", healing:"", concentration:false, ritual:false, conditions:["Stunned"], description:"Stun a creature with 150 HP or fewer", classes:["Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Sunburst", level:8, school:"Evocation", castTime:"1 action", range:150, shape:"sphere", radius:60, damage:"12d6", damageType:"radiant", save:"CON", effect:"radiant", color:"#ffd54f", healing:"", concentration:false, ritual:false, conditions:["Blinded"], description:"Brilliant sunlight deals radiant damage and blinds", classes:["Cleric","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Telepathy", level:8, school:"Evocation", castTime:"1 action", range:0, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"psychic", color:"#c77dff", healing:"", concentration:false, ritual:false, conditions:[], description:"Create telepathic link with a creature", classes:["Wizard"], applyEffect:"utility" },
  { name:"Tsunami", level:8, school:"Conjuration", castTime:"1 minute", range:1, shape:"line", radius:10, length:300, damage:"6d10", damageType:"bludgeoning", save:"STR", effect:"shockwave", color:"#90caf9", healing:"", concentration:true, ritual:false, conditions:["Prone"], description:"A massive wall of water 300 ft long crashes forward, dealing bludgeoning damage and knocking creatures prone", classes:["Druid"], applyEffect:"damage" },
  { name:"Meteor Swarm", level:9, school:"Evocation", castTime:"1 action", range:1000, shape:"sphere", radius:40, damage:"40d6 fire", damageType:"fire", save:"DEX", effect:"explosion", color:"#ff6030", healing:"", concentration:false, ritual:false, conditions:[], description:"Meteors rain from sky", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Power Word Kill", level:9, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"necrotic", color:"#e040fb", healing:"", concentration:false, ritual:false, conditions:["Unconscious"], description:"Instantly slay target with 100 or fewer HP", classes:["Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Time Stop", level:9, school:"Transmutation", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#b574ff", healing:"", concentration:false, ritual:false, conditions:[], description:"Stop time for up to 3 rounds", classes:["Wizard"], applyEffect:"utility" },
  { name:"Wish", level:9, school:"Conjuration", castTime:"1 action", range:0, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#a4e89c", healing:"", concentration:false, ritual:false, conditions:[], description:"Alter reality at DM's discretion", classes:["Sorcerer","Wizard"], applyEffect:"utility" },
    // ── Additional Spells (comprehensive SRD expansion) ──
  { name:"Thaumaturgy", level:0, school:"Transmutation", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#8B00FF", healing:"", concentration:false, ritual:false, conditions:[], description:"You manifest a minor wonder, a sign of supernatural power.", classes:["Cleric"], applyEffect:"utility" },
  { name:"Druidcraft", level:0, school:"Transmutation", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#228B22", healing:"", concentration:false, ritual:false, conditions:[], description:"Whispering to the spirits of nature, you create one of the following effects.", classes:["Druid"], applyEffect:"utility" },
  { name:"Guidance", level:0, school:"Divination", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You touch one willing creature within range. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice.", classes:["Artificer","Bard","Cleric","Druid"], applyEffect:"buff" },
  { name:"Produce Flame", level:0, school:"Conjuration", castTime:"1 action", range:30, shape:"single", radius:0, damage:"1d8", damageType:"fire", save:"", effect:"explosion", color:"#FF6347", healing:"", concentration:false, ritual:false, conditions:[], description:"A flickering flame appears in your hand.", classes:["Druid"], applyEffect:"damage" },
  { name:"Toll the Dead", level:0, school:"Necromancy", castTime:"1 action", range:60, shape:"single", radius:0, damage:"1d8", damageType:"necrotic", save:"WIS", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"You point at one creature you can see within range. The creature must succeed on a Wisdom saving throw or take necrotic damage.", classes:["Cleric","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Thorn Whip", level:0, school:"Transmutation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"1d6", damageType:"piercing", save:"Melee", effect:"bolt", color:"#228B22", healing:"", concentration:false, ritual:false, conditions:[], description:"You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range.", classes:["Druid"], applyEffect:"damage" },
  { name:"Green-Flame Blade", level:0, school:"Evocation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"1d8", damageType:"fire", save:"", effect:"explosion", color:"#00FF00", healing:"", concentration:false, ritual:false, conditions:[], description:"As part of the action used to cast this spell, you must make a melee attack with a weapon against one creature within 5 feet of you.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Booming Blade", level:0, school:"Evocation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"1d8", damageType:"thunder", save:"", effect:"thunder", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"As part of the action used to cast this spell, you must make a melee attack with a weapon against one creature within 5 feet of you.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Word of Radiance", level:0, school:"Evocation", castTime:"1 action", range:5, shape:"sphere", radius:5, damage:"1d6", damageType:"radiant", save:"CON", effect:"radiant", color:"#FFFF00", healing:"", concentration:false, ritual:false, conditions:[], description:"You utter a divine word, and creatures of your choice that you can see within range must succeed on a Constitution saving throw or take radiant damage.", classes:["Cleric"], applyEffect:"buff" },
  { name:"Shape Water", level:0, school:"Transmutation", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"You choose an area of water that you can see within range and that fits within a 5-foot cube.", classes:["Artificer","Bard","Druid","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Control Flames", level:0, school:"Transmutation", castTime:"1 action", range:60, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FF4500", healing:"", concentration:true, ritual:false, conditions:[], description:"You choose a nonmagical flame that you can see within range and that fits within a 5-foot cube.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Gust", level:0, school:"Transmutation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"STR", effect:"shockwave", color:"#87CEEB", healing:"", concentration:false, ritual:false, conditions:[], description:"You seize the air and compel it to create a delicate gust directed at a creature or object within range.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Mold Earth", level:0, school:"Transmutation", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#8B7355", healing:"", concentration:true, ritual:false, conditions:[], description:"You choose a portion of dirt or stone that you can see within range and that fits within a 5-foot cube.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Friends", level:0, school:"Enchantment", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"CHA", effect:"enchantment", color:"#FF69B4", healing:"", concentration:true, ritual:false, conditions:[], description:"For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn't hostile toward you.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Message", level:0, school:"Transmutation", castTime:"1 action", range:120, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You point your finger toward a creature within range, and whisper a message. The target hears the message and can reply in a whisper.", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"True Strike", level:0, school:"Divination", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target's defenses.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Shillelagh", level:0, school:"Transmutation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"1d8", damageType:"bludgeoning", save:"", effect:"transmutation", color:"#8B4513", healing:"", concentration:false, ritual:false, conditions:[], description:"The wood of a club or quarterstaff you are holding is imbued with nature's power.", classes:["Druid"], applyEffect:"utility" },
  { name:"Resistance", level:0, school:"Abjuration", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"You touch one willing creature. Once within the next minute, the target can roll a d4 and add the number rolled to one saving throw of its choice.", classes:["Artificer","Cleric","Druid"], applyEffect:"buff" },
  { name:"Infestation", level:0, school:"Conjuration", castTime:"1 action", range:30, shape:"single", radius:0, damage:"1d4", damageType:"poison", save:"CON", effect:"poison", color:"#228B22", healing:"", concentration:false, ritual:false, conditions:[], description:"You cause a cloud of motes of swirling poison to appear in a 5-foot cube centered on a creature that you can see within range.", classes:["Artificer","Druid","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Frostbite", level:0, school:"Evocation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"1d6", damageType:"cold", save:"CON", effect:"freeze", color:"#00BFFF", healing:"", concentration:false, ritual:false, conditions:[], description:"You cause numbing frost to form on one creature that you can see within range. The target must make a Constitution saving throw.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Create Bonfire", level:0, school:"Conjuration", castTime:"1 action", range:60, shape:"self", radius:0, damage:"1d8", damageType:"fire", save:"DEX", effect:"explosion", color:"#FF4500", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a bonfire on ground that you can see within range.", classes:["Artificer","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Magic Stone", level:0, school:"Transmutation", castTime:"1 bonus action", range:30, shape:"self", radius:0, damage:"1d8", damageType:"bludgeoning", save:"", effect:"bolt", color:"#A9A9A9", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch one to three pebbles and imbue them with magic. You or someone else can make a ranged spell attack using one of the pebbles by throwing it or (for a creature that has a hand free) infusing it into a sling.", classes:["Artificer","Druid","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Sword Burst", level:0, school:"Conjuration", castTime:"1 action", range:"Self", shape:"sphere", radius:5, damage:"1d6", damageType:"force", save:"DEX", effect:"force", color:"#C0C0C0", healing:"", concentration:false, ritual:false, conditions:[], description:"You create a momentary circle of spectral blades that sweep around you.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Thunderclap", level:0, school:"Evocation", castTime:"1 action", range:"Self", shape:"sphere", radius:5, damage:"1d6", damageType:"thunder", save:"CON", effect:"thunder", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You create a momentary circle of thunderous sound centered on you.", classes:["Artificer","Bard","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Absorb Elements", level:1, school:"Abjuration", castTime:"1 reaction", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#4169E1", healing:"", concentration:false, ritual:false, conditions:[], description:"The spell captures some of the incoming energy, lessening its effect on you and storing it for your next melee attack.", classes:["Artificer","Bard","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Chromatic Orb", level:1, school:"Evocation", castTime:"1 action", range:90, shape:"single", radius:0, damage:"3d8", damageType:"varies", save:"", effect:"bolt", color:"#FF00FF", healing:"", concentration:false, ritual:false, conditions:[], description:"You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose what type of energy it embodies when you cast the spell.", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Inflict Wounds", level:1, school:"Necromancy", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"3d10", damageType:"necrotic", save:"", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"Make a melee spell attack against a creature you can touch. On a hit, the target takes necrotic damage.", classes:["Cleric"], applyEffect:"damage" },
  { name:"Sleep", level:1, school:"Enchantment", castTime:"1 action", range:90, shape:"sphere", radius:0, damage:"", damageType:"", save:"", effect:"enchantment", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:["sleep"], description:"This spell sends creatures into a magical slumber.", classes:["Bard","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Entangle", level:1, school:"Conjuration", castTime:"1 action", range:90, shape:"sphere", radius:20, damage:"", damageType:"", save:"STR", effect:"conjuration", color:"#228B22", healing:"", concentration:true, ritual:false, conditions:["restrained"], description:"Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range.", classes:["Druid"], applyEffect:"utility" },
  { name:"Goodberry", level:1, school:"Evocation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"1d4", concentration:false, ritual:false, conditions:[], description:"Up to ten berries appear in your hand and are infused with magic for the duration.", classes:["Druid"], applyEffect:"heal" },
  { name:"Longstrider", level:1, school:"Transmutation", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#228B22", healing:"", concentration:false, ritual:true, conditions:[], description:"You touch a creature. The target's speed increases by 10 feet until the spell ends.", classes:["Artificer","Bard","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Jump", level:1, school:"Transmutation", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You touch a creature. The creature's jump distance is tripled until the spell ends.", classes:["Artificer","Bard","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Expeditious Retreat", level:1, school:"Transmutation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#228B22", healing:"", concentration:true, ritual:false, conditions:[], description:"This spell allows you to move at an incredible pace.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Comprehend Languages", level:1, school:"Divination", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:true, ritual:true, conditions:[], description:"You choose one language that you know. For the spell's duration, you understand that language.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Detect Evil and Good", level:1, school:"Divination", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"For the spell's duration, you sense the presence of creatures that are aberrations, celestials, dragons, elementals, fey, fiends, and undead within 30 feet of you.", classes:["Cleric","Paladin"], applyEffect:"utility" },
  { name:"Find Familiar", level:1, school:"Conjuration", castTime:"1 hour", range:10, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#A9A9A9", healing:"", concentration:false, ritual:true, conditions:[], description:"You gain the service of a familiar, a spirit that takes animal form you choose.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Fog Cloud", level:1, school:"Conjuration", castTime:"1 action", range:120, shape:"sphere", radius:20, damage:"", damageType:"", save:"", effect:"darkness", color:"#808080", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a 20-foot-radius sphere of fog centered on a point within range.", classes:["Druid","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Hex", level:1, school:"Enchantment", castTime:"1 bonus action", range:90, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You place a curse on a creature that you can see within range.", classes:["Warlock"], applyEffect:"control" },
  { name:"Hunter's Mark", level:1, school:"Divination", castTime:"1 bonus action", range:90, shape:"single", radius:0, damage:"1d6", damageType:"varies", save:"WIS", effect:"bolt", color:"#FF6347", healing:"", concentration:true, ritual:false, conditions:[], description:"You choose a creature you can see within range and mystically mark it as your quarry.", classes:["Ranger"], applyEffect:"damage" },
  { name:"Shield of Faith", level:1, school:"Abjuration", castTime:"1 bonus action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"A shimmering field appears and surrounds a creature of your choice within range, granting it a bonus to AC.", classes:["Artificer","Cleric","Paladin"], applyEffect:"buff" },
  { name:"Guiding Bolt", level:1, school:"Evocation", castTime:"1 action", range:120, shape:"single", radius:0, damage:"4d6", damageType:"radiant", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"A flash of light springs from your hand. Make a ranged spell attack against a target within range.", classes:["Cleric"], applyEffect:"buff" },
  { name:"Speak with Animals", level:1, school:"Divination", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#228B22", healing:"", concentration:true, ritual:true, conditions:[], description:"You gain the ability to comprehend and verbally communicate with beasts for the duration.", classes:["Artificer","Bard","Druid","Ranger"], applyEffect:"utility" },
  { name:"Animal Friendship", level:1, school:"Enchantment", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:[], description:"This spell lets you convince a beast that you mean it no harm.", classes:["Bard","Druid","Ranger"], applyEffect:"control" },
  { name:"Charm Person", level:1, school:"Enchantment", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#FF69B4", healing:"", concentration:true, ritual:false, conditions:[], description:"You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Color Spray", level:1, school:"Evocation", castTime:"1 action", range:15, shape:"cone", radius:0, damage:"6d6", damageType:"varies", save:"Reflex", effect:"explosion", color:"#FF00FF", healing:"", concentration:false, ritual:false, conditions:[], description:"A spray of searing color springs from your hand.", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Heroism", level:1, school:"Enchantment", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to being frightened and gains temporary hit points.", classes:["Artificer","Bard","Paladin","Sorcerer"], applyEffect:"buff" },
  { name:"Catapult", level:1, school:"Transmutation", castTime:"1 action", range:150, shape:"single", radius:0, damage:"3d8", damageType:"bludgeoning", save:"", effect:"bolt", color:"#A9A9A9", healing:"", concentration:false, ritual:false, conditions:[], description:"Choose one object weighing 1 to 5 pounds within range that isn't being worn or carried.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Earth Tremor", level:1, school:"Evocation", castTime:"1 action", range:10, shape:"sphere", radius:10, damage:"1d6", damageType:"bludgeoning", save:"DEX", effect:"shockwave", color:"#8B7355", healing:"", concentration:false, ritual:false, conditions:[], description:"You cause a tremor in the ground within range.", classes:["Artificer","Bard","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Ice Knife", level:1, school:"Conjuration", castTime:"1 action", range:60, shape:"sphere", radius:5, damage:"1d10", damageType:"cold", save:"DEX", effect:"freeze", color:"#00BFFF", healing:"", concentration:false, ritual:false, conditions:[], description:"You create a shard of ice and fling it at one creature within range.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Zephyr Strike", level:1, school:"Transmutation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#87CEEB", healing:"", concentration:true, ritual:false, conditions:[], description:"You move like the wind. Until the spell ends, your movement doesn't provoke opportunity attacks.", classes:["Artificer","Ranger","Wizard"], applyEffect:"utility" },
  { name:"Wrathful Smite", level:1, school:"Evocation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"1d6", damageType:"psychic", save:"WIS", effect:"psychic", color:"#8B0000", healing:"", concentration:true, ritual:false, conditions:[], description:"The next time you hit a creature with a weapon attack before this spell ends, your weapon flares with spectral energy.", classes:["Paladin"], applyEffect:"damage" },
  { name:"Thunderous Smite", level:1, school:"Evocation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"1d6", damageType:"thunder", save:"STR", effect:"thunder", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"The first time you hit a creature with a weapon attack before this spell ends, the weapon rings with thunder.", classes:["Paladin"], applyEffect:"damage" },
  { name:"Searing Smite", level:1, school:"Evocation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"1d6", damageType:"fire", save:"", effect:"explosion", color:"#FF4500", healing:"", concentration:true, ritual:false, conditions:[], description:"The next time you hit a creature with a weapon attack before this spell ends, the weapon flares with white-hot intensity.", classes:["Paladin"], applyEffect:"damage" },
  { name:"Compelled Duel", level:1, school:"Enchantment", castTime:"1 bonus action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#FF6347", healing:"", concentration:true, ritual:false, conditions:[], description:"You challenge a creature within range that you can see to a contest of will.", classes:["Paladin"], applyEffect:"control" },
  { name:"Ensnaring Strike", level:1, school:"Conjuration", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"STR", effect:"conjuration", color:"#228B22", healing:"", concentration:true, ritual:false, conditions:[], description:"The next time you hit a creature with a weapon attack before this spell ends, a magical snare tightens around the target's legs or the part of its body that it uses to move.", classes:["Ranger"], applyEffect:"utility" },
  { name:"Divine Favor", level:1, school:"Evocation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"1d4", damageType:"radiant", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"Your weapon is blessed for the duration. When you hit a creature with a weapon attack, the creature takes an extra 1d4 radiant damage.", classes:["Cleric","Paladin"], applyEffect:"buff" },
  { name:"Spiritual Weapon", level:2, school:"Evocation", castTime:"1 bonus action", range:60, shape:"single", radius:0, damage:"1d8", damageType:"force", save:"", effect:"force", color:"#C0C0C0", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a floating, spectral weapon within range that lasts for the spell's duration or until you cast this spell again.", classes:["Artificer","Cleric"], applyEffect:"damage" },
  { name:"Lesser Restoration", level:2, school:"Abjuration", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch a creature and can end either one disease or one condition afflicting it.", classes:["Artificer","Bard","Cleric","Druid","Paladin","Ranger"], applyEffect:"heal" },
  { name:"Prayer of Healing", level:2, school:"Evocation", castTime:"10 minutes", range:30, shape:"sphere", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"1d4", concentration:false, ritual:false, conditions:[], description:"Up to six creatures of your choice that you can see within range each regain hit points equal to 1d4 + your spellcasting ability modifier.", classes:["Cleric"], applyEffect:"heal" },
  { name:"Aid", level:2, school:"Abjuration", castTime:"1 action", range:30, shape:"sphere", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"Your spell bolsters your allies with toughness and resolve. For the duration, each target has temporary hit points equal to 5 + your spellcasting ability modifier.", classes:["Artificer","Bard","Cleric","Paladin"], applyEffect:"buff" },
  { name:"Barkskin", level:2, school:"Transmutation", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#228B22", healing:"", concentration:true, ritual:false, conditions:[], description:"You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing.", classes:["Artificer","Druid","Ranger"], applyEffect:"buff" },
  { name:"Calm Emotions", level:2, school:"Enchantment", castTime:"1 action", range:60, shape:"sphere", radius:20, damage:"", damageType:"", save:"CHA", effect:"enchantment", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You attempt to suppress strong emotions in a group of people.", classes:["Bard","Cleric"], applyEffect:"control" },
  { name:"Continual Flame", level:2, school:"Evocation", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"A flame, equivalent in brightness to a torch, springs forth from an object that you touch.", classes:["Artificer","Bard","Cleric","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Earthen Grasp", level:2, school:"Transmutation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"STR", effect:"conjuration", color:"#8B7355", healing:"", concentration:true, ritual:false, conditions:[], description:"You choose a 5-foot-square unoccupied space of ground that you can see within range.", classes:["Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Enlarge/Reduce", level:2, school:"Transmutation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"CON", effect:"transmutation", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You cause a creature or an object you can see within range to grow larger or smaller for the duration.", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Find Steed", level:2, school:"Conjuration", castTime:"10 minutes", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#A9A9A9", healing:"", concentration:false, ritual:false, conditions:[], description:"You summon a spirit that assumes the form of an unusually intelligent, strong, and loyal steed, creating an equine creature in an unoccupied space of your choice within range.", classes:["Artificer","Paladin"], applyEffect:"utility" },
  { name:"Flame Blade", level:2, school:"Evocation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"2d4", damageType:"fire", save:"", effect:"explosion", color:"#FF4500", healing:"", concentration:true, ritual:false, conditions:[], description:"You evoke a fiery blade in your free hand. The sword lasts for the duration.", classes:["Druid"], applyEffect:"damage" },
  { name:"Gentle Repose", level:2, school:"Necromancy", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:true, conditions:[], description:"You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead.", classes:["Artificer","Bard","Cleric","Wizard"], applyEffect:"damage" },
  { name:"Moonbeam", level:2, school:"Evocation", castTime:"1 action", range:120, shape:"cylinder", radius:5, damage:"2d10", damageType:"radiant", save:"CON", effect:"radiant", color:"#E0FFFF", healing:"", concentration:true, ritual:false, conditions:[], description:"A silvery beam of pale moonlight springs from your hand into a 40-foot cylinder of magical light centered on a point within range.", classes:["Druid"], applyEffect:"buff" },
  { name:"Silence", level:2, school:"Illusion", castTime:"1 action", range:120, shape:"sphere", radius:20, damage:"", damageType:"", save:"", effect:"darkness", color:"#808080", healing:"", concentration:true, ritual:false, conditions:[], description:"For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range.", classes:["Artificer","Bard","Cleric"], applyEffect:"control" },
  { name:"Warding Bond", level:2, school:"Abjuration", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#4169E1", healing:"", concentration:false, ritual:false, conditions:[], description:"You link two willing creatures of your choice that you can see within range.", classes:["Artificer","Cleric","Paladin"], applyEffect:"buff" },
  { name:"Zone of Truth", level:2, school:"Enchantment", castTime:"1 action", range:60, shape:"sphere", radius:15, damage:"", damageType:"", save:"CHA", effect:"enchantment", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You know if each creature within a 15-foot-radius sphere centered on a point of your choice within range is lying or telling the truth.", classes:["Artificer","Bard","Cleric"], applyEffect:"control" },
  { name:"Crown of Madness", level:2, school:"Enchantment", castTime:"1 action", range:120, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"psychic", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration.", classes:["Bard","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Dragon's Breath", level:2, school:"Transmutation", castTime:"1 bonus action", range:30, shape:"self", radius:0, damage:"3d6", damageType:"varies", save:"DEX", effect:"explosion", color:"#FF6347", healing:"", concentration:true, ritual:false, conditions:[], description:"You touch one willing creature and imbue it with the power to spew magical energy from its mouth, provided it has one.", classes:["Artificer","Bard","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Shadow Blade", level:2, school:"Illusion", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"2d8", damageType:"psychic", save:"", effect:"psychic", color:"#000000", healing:"", concentration:true, ritual:false, conditions:[], description:"You weave threads of shadow to create a sword of solidified gloom in your hand.", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Blur", level:2, school:"Illusion", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#C0C0C0", healing:"", concentration:true, ritual:false, conditions:[], description:"Your body becomes blurred, shifting and wavering to all who can see you.", classes:["Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Call Lightning", level:3, school:"Evocation", castTime:"1 action", range:120, shape:"cylinder", radius:10, damage:"3d10", damageType:"lightning", save:"DEX", effect:"shockwave", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"A storm cloud appears in the shape of a cylinder that is 10 feet tall with a 60-foot radius, centered on a point you can see within range.", classes:["Druid"], applyEffect:"damage" },
  { name:"Conjure Animals", level:3, school:"Conjuration", castTime:"1 action", range:60, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#A9A9A9", healing:"", concentration:true, ritual:false, conditions:[], description:"You summon fey creatures that appear in unoccupied spaces that you can see within range.", classes:["Artificer","Druid","Ranger"], applyEffect:"utility" },
  { name:"Crusader's Mantle", level:3, school:"Evocation", castTime:"1 action", range:30, shape:"sphere", radius:30, damage:"1d4", damageType:"radiant", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"Holy power radiates from you in an aura with a 30-foot radius, awakening boldness in friendly creatures.", classes:["Paladin"], applyEffect:"buff" },
  { name:"Elemental Weapon", level:3, school:"Transmutation", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"1d4", damageType:"varies", save:"", effect:"transmutation", color:"#FF6347", healing:"", concentration:true, ritual:false, conditions:[], description:"A nonmagical weapon you touch becomes a magic weapon. Choose one of the following damage types: acid, cold, fire, lightning, or thunder.", classes:["Artificer","Druid","Paladin","Ranger","Sorcerer","Warlock"], applyEffect:"utility" },
  { name:"Mass Healing Word", level:3, school:"Evocation", castTime:"1 bonus action", range:60, shape:"sphere", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"1d4", concentration:false, ritual:false, conditions:[], description:"As you call out words of restoration, you can restore hit points to creatures of your choice that you can see within range.", classes:["Artificer","Cleric","Druid"], applyEffect:"heal" },
  { name:"Plant Growth", level:3, school:"Transmutation", castTime:"1 action", range:150, shape:"sphere", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#228B22", healing:"", concentration:false, ritual:false, conditions:[], description:"This spell channels vitality into plants within a specified area. There are two possible uses for the spell, depending on the version chosen.", classes:["Artificer","Bard","Druid","Ranger"], applyEffect:"utility" },
  { name:"Remove Curse", level:3, school:"Abjuration", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"At your touch, all curses affecting one creature or object end.", classes:["Artificer","Bard","Cleric","Paladin","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Sending", level:3, school:"Evocation", castTime:"1 action", range:"Unlimited", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:[], description:"You send a short message of twenty-five words or fewer to a creature with which you are familiar.", classes:["Artificer","Bard","Cleric","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Speak with Dead", level:3, school:"Necromancy", castTime:"10 minutes", range:10, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"You grant the semblance of life and intelligence to a corpse within range, allowing it to answer the questions you pose.", classes:["Artificer","Bard","Cleric","Wizard"], applyEffect:"utility" },
  { name:"Tongues", level:3, school:"Divination", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"This spell grants the creature you touch the ability to understand any spoken language it hears.", classes:["Artificer","Bard","Cleric","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Water Breathing", level:3, school:"Transmutation", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#4169E1", healing:"", concentration:false, ritual:true, conditions:[], description:"This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends.", classes:["Artificer","Bard","Druid","Ranger","Sorceror","Wizard"], applyEffect:"utility" },
  { name:"Water Walk", level:3, school:"Transmutation", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#4169E1", healing:"", concentration:false, ritual:true, conditions:[], description:"This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures can walk, jump, run, and dance), while leaving no marks or sinking into the surface.", classes:["Artificer","Bard","Cleric","Druid","Ranger","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Wind Wall", level:3, school:"Evocation", castTime:"1 action", range:120, shape:"sphere", radius:0, damage:"3d8", damageType:"bludgeoning", save:"STR", effect:"shockwave", color:"#87CEEB", healing:"", concentration:true, ritual:false, conditions:[], description:"A wall of strong wind springs into existence at a point of your choice within range.", classes:["Artificer","Bard","Druid","Ranger","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Aura of Vitality", level:3, school:"Evocation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"2d6", concentration:true, ritual:false, conditions:[], description:"You emanate an aura of health and vitality. When you cast this spell, you can immediately use a bonus action to heal one creature within 5 feet of you.", classes:["Paladin"], applyEffect:"heal" },
  { name:"Blinding Smite", level:3, school:"Evocation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"3d6", damageType:"radiant", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"The next time you hit a creature with a weapon attack before this spell ends, your weapon flares with bright light, and the attack deals an extra 3d6 radiant damage to the target.", classes:["Paladin"], applyEffect:"buff" },
  { name:"Hunger of Hadar", level:3, school:"Conjuration", castTime:"1 action", range:150, shape:"sphere", radius:20, damage:"2d6", damageType:"cold", save:"DEX", effect:"freeze", color:"#00BFFF", healing:"", concentration:true, ritual:false, conditions:[], description:"You open a gateway to the dark between the stars, a region infused with howling void energy.", classes:["Warlock"], applyEffect:"damage" },
  { name:"Thunder Step", level:3, school:"Conjuration", castTime:"1 reaction", range:30, shape:"self", radius:0, damage:"2d6", damageType:"thunder", save:"STR", effect:"thunder", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You teleport yourself to an unoccupied space you can see within range.", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Erupting Earth", level:3, school:"Transmutation", castTime:"1 action", range:120, shape:"sphere", radius:20, damage:"3d12", damageType:"bludgeoning", save:"DEX", effect:"shockwave", color:"#8B7355", healing:"", concentration:false, ritual:false, conditions:[], description:"Choose a point you can see on the ground within range. A fountain of churling earth and stone erupts in a cylinder originating from that point.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Enemies Abound", level:3, school:"Enchantment", castTime:"1 action", range:120, shape:"single", radius:0, damage:"", damageType:"", save:"INT", effect:"psychic", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"For the spell's duration, a creature that you can see within range sees all other creatures as enemies.", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Life Transference", level:3, school:"Necromancy", castTime:"1 action", range:30, shape:"single", radius:0, damage:"4d8", damageType:"necrotic", save:"", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"You sacrifice some of your health to mend another creature's injuries. You take 4d8 necrotic damage, and one creature you can see within range regains a number of hit points equal to twice the number of necrotic damage you took.", classes:["Artificer","Cleric","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Banishment", level:4, school:"Abjuration", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"CHA", effect:"shield", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"You attempt to send one creature that you can see within range to another plane of existence.", classes:["Artificer","Cleric","Paladin","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Death Ward", level:4, school:"Abjuration", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch a creature and grant it a measure of protection against death.", classes:["Artificer","Bard","Cleric","Paladin","Ranger"], applyEffect:"buff" },
  { name:"Dominate Beast", level:4, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You attempt to beguile a beast that you can see within range.", classes:["Artificer","Bard","Druid","Ranger","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Evard's Black Tentacles", level:4, school:"Conjuration", castTime:"1 action", range:90, shape:"sphere", radius:20, damage:"3d6", damageType:"bludgeoning", save:"DEX", effect:"conjuration", color:"#000000", healing:"", concentration:true, ritual:false, conditions:[], description:"Squirming, ebony tentacles fill a 20-foot square on ground that you can see within range.", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Fabricate", level:4, school:"Transmutation", castTime:"10 minutes", range:120, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You convert raw materials into products of the same material.", classes:["Artificer","Wizard"], applyEffect:"utility" },
  { name:"Freedom of Movement", level:4, school:"Abjuration", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#87CEEB", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch a willing creature. For the duration, the creature's movement is unaffected by difficult terrain, and spells and magical effects can't reduce the creature's speed or cause the creature to be paralyzed or restrained.", classes:["Artificer","Bard","Cleric","Druid","Paladin","Ranger"], applyEffect:"buff" },
  { name:"Greater Invisibility", level:4, school:"Illusion", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"darkness", color:"#808080", healing:"", concentration:true, ritual:false, conditions:[], description:"You or a creature you touch becomes invisible until the spell ends.", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Guardian of Faith", level:4, school:"Conjuration", castTime:"1 action", range:30, shape:"self", radius:0, damage:"4d10", damageType:"radiant", save:"DEX", effect:"radiant", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range.", classes:["Artificer","Cleric"], applyEffect:"buff" },
  { name:"Locate Creature", level:4, school:"Divination", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you.", classes:["Artificer","Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Otiluke's Resilient Sphere", level:4, school:"Evocation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"DEX", effect:"shield", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"A sphere of shimmering force encloses a creature of your choice within range.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Phantasmal Killer", level:4, school:"Illusion", castTime:"1 action", range:120, shape:"single", radius:0, damage:"4d10", damageType:"psychic", save:"WIS", effect:"psychic", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You tap into the nightmares of a creature you can see within range and create an illusory manifestation of its deepest fears, visible only to that creature.", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Shadow of Moil", level:4, school:"Necromancy", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"2d8", damageType:"necrotic", save:"", effect:"necrotic", color:"#4B0082", healing:"", concentration:true, ritual:false, conditions:[], description:"Shadows weave around you until the spell ends.", classes:["Warlock","Wizard"], applyEffect:"damage" },
  { name:"Stone Shape", level:4, school:"Transmutation", castTime:"1 action", range:"Touch", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#8B7355", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose.", classes:["Artificer","Cleric","Druid","Wizard"], applyEffect:"utility" },
  { name:"Staggering Smite", level:4, school:"Evocation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"4d6", damageType:"psychic", save:"WIS", effect:"psychic", color:"#8B0000", healing:"", concentration:true, ritual:false, conditions:[], description:"The next time you hit a creature with a weapon attack before this spell ends, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 4d6 psychic damage to the target.", classes:["Paladin"], applyEffect:"damage" },
  { name:"Summon Greater Demon", level:4, school:"Conjuration", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#8B0000", healing:"", concentration:true, ritual:false, conditions:[], description:"You utter foul words of power summoning demons and devils from the chaos of the Abyss.", classes:["Warlock","Wizard"], applyEffect:"utility" },
  { name:"Wall of Fire", level:4, school:"Evocation", castTime:"1 action", range:60, shape:"line", radius:0, damage:"5d8", damageType:"fire", save:"DEX", effect:"explosion", color:"#FF4500", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a wall of fire on a solid surface within range.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Watery Sphere", level:4, school:"Conjuration", castTime:"1 action", range:90, shape:"sphere", radius:10, damage:"2d6", damageType:"bludgeoning", save:"DEX", effect:"shockwave", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"You conjure up a sphere of water with a 10-foot radius on a point you can see within range.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Vitriolic Sphere", level:4, school:"Evocation", castTime:"1 action", range:150, shape:"sphere", radius:20, damage:"10d4", damageType:"acid", save:"DEX", effect:"acid", color:"#00FF00", healing:"", concentration:false, ritual:false, conditions:[], description:"A glowing sphere of ghastly green energy springs from your palm to a point of your choice within range, where it explodes in all directions.", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Circle of Power", level:5, school:"Abjuration", castTime:"1 action", range:"Self", shape:"sphere", radius:30, damage:"", damageType:"", save:"", effect:"shield", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"Strong magic infuses a 30-foot-radius sphere centered on you for the duration.", classes:["Artificer","Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Commune", level:5, school:"Divination", castTime:"10 minutes", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:false, ritual:true, conditions:[], description:"You contact your deity or a messenger of your deity. You can ask up to three questions that can be answered with a yes or no.", classes:["Artificer","Cleric"], applyEffect:"utility" },
  { name:"Conjure Elemental", level:5, school:"Conjuration", castTime:"1 minute", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#A9A9A9", healing:"", concentration:true, ritual:false, conditions:[], description:"You call forth an elemental servant. Choose an area of water, earth, fire, or air that fills a 10-foot cube within range.", classes:["Artificer","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Contact Other Plane", level:5, school:"Divination", castTime:"10 minutes", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:true, ritual:true, conditions:[], description:"You contact a distant plane of existence, possibly seeking information from a powerful entity on that plane.", classes:["Artificer","Bard","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Dawn", level:5, school:"Evocation", castTime:"1 action", range:60, shape:"self", radius:0, damage:"4d6", damageType:"radiant", save:"DEX", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"The dawn breaks over an area you specify within range.", classes:["Artificer","Cleric","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Destructive Wave", level:5, school:"Evocation", castTime:"1 action", range:"Self", shape:"sphere", radius:30, damage:"5d6", damageType:"thunderOrRadiant", save:"", effect:"thunder", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You strike the ground, injuring creatures nearby. All other creatures of your choice within 30 feet of you must each make a Constitution saving throw.", classes:["Paladin"], applyEffect:"damage" },
  { name:"Dispel Evil and Good", level:5, school:"Abjuration", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"Shimmering energy springs from you in a 30-foot radius.", classes:["Artificer","Cleric","Paladin"], applyEffect:"buff" },
  { name:"Flame Strike", level:5, school:"Evocation", castTime:"1 action", range:60, shape:"cylinder", radius:10, damage:"4d6", damageType:"fire", save:"DEX", effect:"explosion", color:"#FF4500", healing:"", concentration:false, ritual:false, conditions:[], description:"A vertical column of divine fire springs from a point of your choice that you can see within range.", classes:["Artificer","Cleric"], applyEffect:"damage" },
  { name:"Geas", level:5, school:"Enchantment", castTime:"10 minutes", range:60, shape:"single", radius:0, damage:"5d10", damageType:"psychic", save:"CHA", effect:"enchantment", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:[], description:"You place a magical command on a creature that you can see within range, requiring it to carry out some service or refrain from some action or course of activity as you decide.", classes:["Artificer","Bard","Cleric","Druid","Paladin","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Greater Restoration", level:5, school:"Abjuration", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"", concentration:false, ritual:false, conditions:[], description:"You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target's exhaustion level by one, or end one of the following effects on the target.", classes:["Artificer","Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Warlock","Wizard"], applyEffect:"heal" },
  { name:"Hallow", level:5, school:"Evocation", castTime:"24 hours", range:"Touch", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch a point and infuse an area around it with holy (or unholy) power.", classes:["Artificer","Cleric"], applyEffect:"buff" },
  { name:"Insect Plague", level:5, school:"Conjuration", castTime:"1 action", range:300, shape:"sphere", radius:20, damage:"4d10", damageType:"piercing", save:"CON", effect:"poison", color:"#228B22", healing:"", concentration:true, ritual:false, conditions:[], description:"Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range.", classes:["Artificer","Druid","Ranger","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Legend Lore", level:5, school:"Divination", castTime:"10 minutes", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:[], description:"Name or describe a person, place, or object. The spell brings to your mind a brief summary of the significant lore about the thing you named.", classes:["Artificer","Bard","Cleric","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Mass Cure Wounds", level:5, school:"Evocation", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"3d8", concentration:false, ritual:false, conditions:[], description:"A wave of healing energy washes out from a point of your choice within range.", classes:["Artificer","Bard","Cleric","Druid","Paladin","Ranger"], applyEffect:"heal" },
  { name:"Modify Memory", level:5, school:"Enchantment", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"psychic", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You attempt to reshape another creature's memories. One creature that you can see must make a Wisdom saving throw.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Raise Dead", level:5, school:"Necromancy", castTime:"1 hour", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"You return a dead creature you touch to life, provided that it has been dead no longer than 10 days.", classes:["Artificer","Bard","Cleric","Druid","Paladin"], applyEffect:"damage" },
  { name:"Scrying", level:5, school:"Divination", castTime:"10 minutes", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"WIS", effect:"transmutation", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You can see and hear a particular creature of your choice that is on the same plane of existence as you.", classes:["Artificer","Bard","Cleric","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Skill Empowerment", level:5, school:"Transmutation", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"Your magic grants a creature you touch proficiency in one skill of your choice.", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Steel Wind Strike", level:5, school:"Conjuration", castTime:"1 action", range:30, shape:"self", radius:0, damage:"6d10", damageType:"slashing", save:"", effect:"bolt", color:"#C0C0C0", healing:"", concentration:false, ritual:false, conditions:[], description:"You move in a whirlwind of steel and return to your point of origin.", classes:["Artificer","Ranger","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Synaptic Static", level:5, school:"Enchantment", castTime:"1 action", range:120, shape:"sphere", radius:20, damage:"5d12", damageType:"psychic", save:"INT", effect:"psychic", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:[], description:"You choose a point within range and cause psychic energy to explode there.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Tree Stride", level:5, school:"Conjuration", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#228B22", healing:"", concentration:true, ritual:false, conditions:[], description:"You gain the ability to enter a tree and move from inside one tree to inside another of the same kind within 500 miles of it.", classes:["Artificer","Druid","Ranger"], applyEffect:"utility" },
  { name:"Wall of Stone", level:5, school:"Evocation", castTime:"1 action", range:120, shape:"line", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#8B7355", healing:"", concentration:true, ritual:false, conditions:[], description:"A nonmagical wall of solid stone springs into existence.", classes:["Artificer","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Banishing Smite", level:5, school:"Abjuration", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"5d6", damageType:"force", save:"", effect:"force", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"The next time you hit a creature with a weapon attack before this spell ends, your weapon flares with pale radiance, and the attack deals an extra 5d6 force damage to the target.", classes:["Paladin"], applyEffect:"damage" },
  { name:"Bigby's Hand", level:5, school:"Evocation", castTime:"1 action", range:120, shape:"self", radius:0, damage:"4d8", damageType:"bludgeoning", save:"STR", effect:"force", color:"#C0C0C0", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a Large hand of shimmering, translucent force in an unoccupied space that you can see within range.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Contagion", level:5, school:"Necromancy", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"CON", effect:"necrotic", color:"#4B0082", healing:"", concentration:true, ritual:false, conditions:[], description:"Your touch inflicts disease. Make a melee spell attack against a creature within your reach.", classes:["Artificer","Cleric","Druid"], applyEffect:"damage" },
  { name:"Creation", level:5, school:"Illusion", castTime:"1 minute", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You pull wisps of shadow material from the Shadowfell to create a nonmagical object of vegetable matter within range.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Dream", level:5, school:"Illusion", castTime:"1 minute", range:"Unlimited", shape:"self", radius:0, damage:"", damageType:"", save:"WIS", effect:"psychic", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"This spell shapes a creature's dreams. Choose a willing creature known to you that is on the same plane of existence as you.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Dominate Person", level:5, school:"Enchantment", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You attempt to beguile a humanoid that you can see within range.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Far Step", level:5, school:"Conjuration", castTime:"1 bonus action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You teleport up to 30 feet to an unoccupied space that you can see.", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Holy Weapon", level:5, school:"Transmutation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"2d8", damageType:"radiant", save:"", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You imbue a weapon you touch with holy power. For the duration, you add your Wisdom modifier to the weapon's attack rolls and damage rolls.", classes:["Artificer","Cleric","Paladin"], applyEffect:"buff" },
  { name:"Infernal Calling", level:5, school:"Conjuration", castTime:"1 minute", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#8B0000", healing:"", concentration:true, ritual:false, conditions:[], description:"You summon a devil from the Nine Hells within range.", classes:["Warlock","Wizard"], applyEffect:"utility" },
  { name:"Maelstrom", level:5, school:"Evocation", castTime:"1 action", range:60, shape:"sphere", radius:30, damage:"6d6", damageType:"bludgeoning", save:"STR", effect:"shockwave", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"A swirling storm of 5 to 8 dust devils rises from the ground in a 30-foot radius centered on a point you can see within range.", classes:["Druid"], applyEffect:"damage" },
  { name:"Negative Energy Flood", level:5, school:"Necromancy", castTime:"1 action", range:60, shape:"single", radius:0, damage:"5d8", damageType:"necrotic", save:"CON", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"You send ribbons of negative energy lashing out from you in a 30-foot cone.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Planar Binding", level:5, school:"Abjuration", castTime:"1 hour", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"CHA", effect:"shield", color:"#4169E1", healing:"", concentration:false, ritual:false, conditions:[], description:"Casting this spell is a ritual that takes 1 hour and binds a celestial, elemental, fey, or fiend to a 30-foot radius.", classes:["Artificer","Bard","Cleric","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Reincarnate", level:5, school:"Transmutation", castTime:"1 hour", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#228B22", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch a dead humanoid or a piece of a dead humanoid. Provided that the creature has been dead no longer than 10 days, the spell forms a new adult body for it and then enters the new body.", classes:["Artificer","Druid"], applyEffect:"utility" },
  { name:"Seeming", level:5, school:"Illusion", castTime:"1 action", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"CHA", effect:"darkness", color:"#C0C0C0", healing:"", concentration:true, ritual:false, conditions:[], description:"This spell allows you to change the appearance of any number of creatures that you can see within range.", classes:["Artificer","Bard","Sorcerer","Wizard"], applyEffect:"control" },
  { name:"Swift Quiver", level:5, school:"Transmutation", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You transmute your quiver so that it produces an endless supply of nonmagical ammunition, which seems to leap into your hand when you reach for it.", classes:["Artificer","Bard","Ranger","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Transmute Rock", level:5, school:"Transmutation", castTime:"1 action", range:120, shape:"sphere", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#8B7355", healing:"", concentration:false, ritual:false, conditions:[], description:"You choose an area of stone or mud that you can see that fits within a 15-foot cube and is within range, and choose one of the following effects.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Wrath of Nature", level:5, school:"Evocation", castTime:"1 action", range:120, shape:"sphere", radius:0, damage:"4d8", damageType:"bludgeoning", save:"DEX", effect:"shockwave", color:"#228B22", healing:"", concentration:true, ritual:false, conditions:[], description:"As a channel for nature's wrath, you choose a point within range and call forth an awe-inspiring wind-storm comprised of swarming insects, dirt, and debris.", classes:["Druid","Ranger"], applyEffect:"damage" },
  { name:"Blade Barrier", level:6, school:"Evocation", castTime:"1 action", range:90, shape:"line", radius:0, damage:"6d10", damageType:"slashing", save:"DEX", effect:"bolt", color:"#C0C0C0", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a vertical wall of whirling, razor-sharp blades made of magical energy.", classes:["Artificer","Cleric"], applyEffect:"damage" },
  { name:"Contingency", level:6, school:"Evocation", castTime:"10 minutes", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"Choose a spell of 5th level or lower that you can cast, that you have a spellcasting focus for, and that can be cast as an action.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Create Undead", level:6, school:"Necromancy", castTime:"10 minutes", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"You can cast this spell only at night. Choose up to three corpses of Medium or Small humanoids within range.", classes:["Artificer","Cleric","Wizard"], applyEffect:"damage" },
  { name:"Eyebite", level:6, school:"Necromancy", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"4d8", damageType:"necrotic", save:"DEX", effect:"necrotic", color:"#4B0082", healing:"", for: true, ritual:false, conditions:[], description:"For the spell's duration, your eyes become an inky void imbued with dread power.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Find the Path", level:6, school:"Divination", castTime:"1 minute", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"The spell enables you to find the shortest route to a specific fixed location that you are familiar with on the same plane of existence.", classes:["Artificer","Bard","Cleric","Druid"], applyEffect:"utility" },
  { name:"Flesh to Stone", level:6, school:"Transmutation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"CON", effect:"transmutation", color:"#8B7355", healing:"", concentration:true, ritual:false, conditions:[], description:"You attempt to turn one creature that you can see within range into stone.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Globe of Invulnerability", level:6, school:"Abjuration", castTime:"1 action", range:"Self", shape:"sphere", radius:10, damage:"", damageType:"", save:"", effect:"shield", color:"#4169E1", healing:"", concentration:true, ritual:false, conditions:[], description:"An immobile, invisible, magical barrier springs into existence in a 10-foot radius around you.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Harm", level:6, school:"Necromancy", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"14d6", damageType:"necrotic", save:"CON", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"You attempt to lay a curse of harm on a creature that you can touch.", classes:["Artificer","Cleric"], applyEffect:"damage" },
  { name:"Heal", level:6, school:"Evocation", castTime:"1 action", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"70", concentration:false, ritual:false, conditions:[], description:"Choose a creature that you can see within range. A surge of positive energy washes through the creature, causing it to regain 70 hit points.", classes:["Artificer","Bard","Cleric","Druid","Paladin"], applyEffect:"heal" },
  { name:"Heroes' Feast", level:6, school:"Conjuration", castTime:"10 minutes", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You bring forth a great feast, including magnificent food and drink. The feast takes 1 minute to consume and disappears at the end of the hour.", classes:["Artificer","Bard","Cleric","Druid"], applyEffect:"utility" },
  { name:"Mass Suggestion", level:6, school:"Enchantment", castTime:"1 action", range:60, shape:"sphere", radius:0, damage:"", damageType:"", save:"WIS", effect:"enchantment", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You suggest a course of activity, phrased in such a way as to make the activity sound reasonable, to each creature you can see within range that can hear and understand you.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"control" },
  { name:"Move Earth", level:6, school:"Transmutation", castTime:"1 action", range:120, shape:"sphere", radius:40, damage:"", damageType:"", save:"", effect:"transmutation", color:"#8B7355", healing:"", concentration:true, ritual:false, conditions:[], description:"Choose an area of terrain no larger than 40 feet on each side, within range.", classes:["Artificer","Druid","Sorcerer","Wizard"], applyEffect:"utility" },
  { name:"Otiluke's Freezing Sphere", level:6, school:"Evocation", castTime:"1 action", range:300, shape:"sphere", radius:60, damage:"6d6", damageType:"cold", save:"CON", effect:"freeze", color:"#00BFFF", healing:"", concentration:false, ritual:false, conditions:[], description:"A sphere of frigid air springs into existence, centered on a point of your choice within range.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Planar Ally", level:6, school:"Conjuration", castTime:"10 minutes", range:60, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#A9A9A9", healing:"", concentration:false, ritual:true, conditions:[], description:"By casting this spell, you attempt to hire an otherworldly servant.", classes:["Artificer","Bard","Cleric"], applyEffect:"utility" },
  { name:"Primordial Ward", level:6, school:"Abjuration", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You have resistance to acid, cold, fire, lightning, and thunder damage for the spell's duration.", classes:["Artificer","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Soul Cage", level:6, school:"Necromancy", castTime:"1 reaction", range:60, shape:"single", radius:0, damage:"", damageType:"", save:"CHA", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"When a humanoid you can see within range is reduced to 0 hit points, you can use your reaction to cast this spell and trap its soul.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Sunbeam", level:6, school:"Evocation", castTime:"1 action", range:120, shape:"line", radius:5, damage:"6d8", damageType:"radiant", save:"CON", effect:"radiant", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"A beam of brilliant light springs from your hand.", classes:["Artificer","Cleric","Druid","Paladin","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Transport via Plants", level:6, school:"Conjuration", castTime:"1 action", range:"10 feet", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#228B22", healing:"", concentration:false, ritual:false, conditions:[], description:"This spell creates a magical link between a Large or larger inanimate plant within range and another plant, at any distance, on the same plane of existence.", classes:["Artificer","Druid"], applyEffect:"utility" },
  { name:"True Seeing", level:6, school:"Divination", castTime:"1 action", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"This spell gives the willing creature you touch the ability to see things as they actually are.", classes:["Artificer","Bard","Cleric","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Wall of Ice", level:6, school:"Evocation", castTime:"1 action", range:120, shape:"line", radius:0, damage:"10d6", damageType:"cold", save:"DEX", effect:"freeze", color:"#00BFFF", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a wall of ice on a solid surface you can see within range.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Wall of Thorns", level:6, school:"Conjuration", castTime:"1 action", range:120, shape:"line", radius:0, damage:"7d8", damageType:"piercing", save:"DEX", effect:"conjuration", color:"#228B22", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a wall of tough, pliable plant material rooted in the ground within range.", classes:["Artificer","Druid"], applyEffect:"utility" },
  { name:"Wind Walk", level:6, school:"Transmutation", castTime:"10 minutes", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#87CEEB", healing:"", concentration:false, ritual:false, conditions:[], description:"You and up to ten willing creatures you can see within range assume a gaseous form for the spell's duration, appearing as wisps of cloud.", classes:["Artificer","Druid"], applyEffect:"utility" },
  { name:"Word of Recall", level:6, school:"Conjuration", castTime:"1 action", range:"5 miles", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:[], description:"You recall the appearance of a specific location that you know on the same plane of existence.", classes:["Artificer","Bard","Cleric"], applyEffect:"utility" },
  { name:"Bones of the Earth", level:6, school:"Transmutation", castTime:"1 action", range:120, shape:"sphere", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#8B7355", healing:"", concentration:true, ritual:false, conditions:[], description:"You waken the spirits of nature around you. You know the location of every elemental within 30 miles of you.", classes:["Artificer","Druid"], applyEffect:"utility" },
  { name:"Investiture of Flame", level:6, school:"Transmutation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"1d10", damageType:"fire", save:"", effect:"explosion", color:"#FF4500", healing:"", concentration:true, ritual:false, conditions:[], description:"Flames wreathe your body for the spell's duration.", classes:["Artificer","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Investiture of Ice", level:6, school:"Transmutation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"1d10", damageType:"cold", save:"", effect:"freeze", color:"#00BFFF", healing:"", concentration:true, ritual:false, conditions:[], description:"Ice covers your body for the spell's duration.", classes:["Artificer","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Investiture of Stone", level:6, school:"Transmutation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#8B7355", healing:"", concentration:true, ritual:false, conditions:[], description:"As a reaction, you can add half this spell's remaining duration to the duration of the spell that ends.", classes:["Artificer","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Investiture of Wind", level:6, school:"Transmutation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"shockwave", color:"#87CEEB", healing:"", concentration:true, ritual:false, conditions:[], description:"Wind whirls around you for the spell's duration.", classes:["Artificer","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Mental Prison", level:6, school:"Illusion", castTime:"1 action", range:60, shape:"single", radius:0, damage:"5d10", damageType:"psychic", save:"INT", effect:"psychic", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"You attempt to trap a creature in an illusory cell only it perceives. One creature you can see within range must make an Intelligence saving throw.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Scatter", level:6, school:"Conjuration", castTime:"1 reaction", range:30, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#A9A9A9", healing:"", concentration:false, ritual:false, conditions:[], description:"The spell teleports you and possibly other creatures of your choice that you can see within range to destinations you choose.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Create Homunculus", level:6, school:"Transmutation", castTime:"1 hour", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#A9A9A9", healing:"", concentration:false, ritual:false, conditions:[], description:"You find a corpse of a humanoid creature and turn it into a dutiful homunculus.", classes:["Artificer","Wizard"], applyEffect:"utility" },
  { name:"Astral Projection", level:9, school:"Necromancy", castTime:"1 hour", range:"10 feet", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:[], description:"You project your astral body into the Astral Plane (creatures at 6th level or higher have advantage on the saving throw).", classes:["Artificer","Bard","Cleric","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Foresight", level:9, school:"Divination", castTime:"1 minute", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch a willing creature and bestow a limited ability to see into the immediate future.", classes:["Artificer","Bard","Cleric","Druid","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Gate", level:9, school:"Conjuration", castTime:"1 action", range:60, shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"conjuration", color:"#A9A9A9", healing:"", concentration:true, ritual:false, conditions:[], description:"You conjure a portal linking an unoccupied space you can see within range to a precise location on a different plane of existence.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Imprisonment", level:9, school:"Abjuration", castTime:"1 minute", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"shield", color:"#4169E1", healing:"", concentration:false, ritual:false, conditions:[], description:"You create a magical restraint to hold a creature that you can see within range.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"buff" },
  { name:"Mass Heal", level:9, school:"Evocation", castTime:"1 action", range:150, shape:"sphere", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"", concentration:false, ritual:false, conditions:[], description:"A flood of healing energy springs from a point of your choice within range.", classes:["Artificer","Cleric"], applyEffect:"heal" },
  { name:"Mass Polymorph", level:9, school:"Transmutation", castTime:"1 action", range:150, shape:"sphere", radius:0, damage:"", damageType:"", save:"WIS", effect:"transmutation", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You transform up to ten creatures of your choice that you can see within range.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Power Word Heal", level:9, school:"Evocation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"heal", color:"#32CD32", healing:"", concentration:false, ritual:false, conditions:[], description:"A wave of healing energy washes over the creature you touch.", classes:["Artificer","Bard","Cleric"], applyEffect:"heal" },
  { name:"Prismatic Wall", level:9, school:"Abjuration", castTime:"1 action", range:60, shape:"line", radius:0, damage:"", damageType:"", save:"", effect:"shield", color:"#FF00FF", healing:"", concentration:true, ritual:false, conditions:[], description:"A shimmering, multicolored plane of light springs from a point you choose within range.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"buff" },
  { name:"Psychic Scream", level:9, school:"Evocation", castTime:"1 action", range:60, shape:"sphere", radius:0, damage:"14d6", damageType:"psychic", save:"INT", effect:"psychic", color:"#9370DB", healing:"", concentration:false, ritual:false, conditions:[], description:"You unleash the power of your mind to blast the intellect of up to ten creatures of your choice that you can see within range.", classes:["Artificer","Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
  { name:"Shapechange", level:9, school:"Transmutation", castTime:"1 action", range:"Self", shape:"self", radius:0, damage:"", damageType:"", save:"", effect:"transmutation", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"You assume the form of a different creature for the duration.", classes:["Artificer","Druid","Warlock","Wizard"], applyEffect:"utility" },
  { name:"Storm of Vengeance", level:9, school:"Evocation", castTime:"1 action", range:1000, shape:"sphere", radius:360, damage:"", damageType:"varies", save:"", effect:"shockwave", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"A churning storm cloud forms, centered on a point you can see and spreading to a radius of 360 feet.", classes:["Artificer","Cleric","Druid","Sorcerer","Warlock"], applyEffect:"damage" },
  { name:"True Polymorph", level:9, school:"Transmutation", castTime:"1 action", range:30, shape:"single", radius:0, damage:"", damageType:"", save:"WIS", effect:"transmutation", color:"#FFD700", healing:"", concentration:true, ritual:false, conditions:[], description:"Choose one creature or nonmagical object that you can see within range.", classes:["Artificer","Bard","Sorcerer","Warlock","Wizard"], applyEffect:"utility" },
  { name:"True Resurrection", level:9, school:"Necromancy", castTime:"1 hour", range:"Touch", shape:"single", radius:0, damage:"", damageType:"", save:"", effect:"necrotic", color:"#4B0082", healing:"", concentration:false, ritual:false, conditions:[], description:"You touch a creature that has been dead for no longer than 200 years and that died for any reason except old age.", classes:["Artificer","Bard","Cleric"], applyEffect:"damage" },
  { name:"Weird", level:9, school:"Illusion", castTime:"1 action", range:120, shape:"sphere", radius:30, damage:"4d12", damageType:"psychic", save:"WIS", effect:"psychic", color:"#9370DB", healing:"", concentration:true, ritual:false, conditions:[], description:"Drawing on the deepest fears of a group of creatures, you create illusory creatures in their minds, visible only to them.", classes:["Artificer","Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Blade of Disaster", level:9, school:"Conjuration", castTime:"1 bonus action", range:"Self", shape:"self", radius:0, damage:"4d12", damageType:"force", save:"", effect:"force", color:"#C0C0C0", healing:"", concentration:true, ritual:false, conditions:[], description:"You create a blade-shaped planar rift about 3 feet long in an unoccupied space you can see within 60 feet of you.", classes:["Sorcerer","Wizard"], applyEffect:"damage" },
  { name:"Ravenous Void", level:9, school:"Evocation", castTime:"1 action", range:1000, shape:"sphere", radius:600, damage:"", damageType:"", save:"", effect:"necrotic", color:"#000000", healing:"", concentration:true, ritual:false, conditions:[], description:"Choose a point within range. A sphere of blackness and bitter cold springs from that point outward in all directions.", classes:["Sorcerer","Warlock","Wizard"], applyEffect:"damage" },
];


function Battlemap({ party = [], npcs = [], viewRole = "dm", setViewRole = null, activeCampaignId = null, onPartyUpdate = null, setData = null, campaignEncounters = [], worldMapCommand = null }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const fileRef = useRef(null);
  const tokenImgRef = useRef(null);
  const tokenImagesCache = useRef({});
  const wheelHandlerRef = useRef(null);
  const touchGestureRef = useRef({ active: false, pointer: null });

  // ── Core map state ──
  const [gridSize, setGridSize] = useState(40);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({x:0,y:0});
  const [bgColor, setBgColor] = useState(() => cssVar("--bg") || "#10101e");
  const [bgImage, setBgImage] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const [fogCells, setFogCells] = useState({});
  const [drawColor, setDrawColor] = useState("#dc143c");
  const [drawWidth, setDrawWidth] = useState(3);

  // ── Walls ──
  const [walls, setWalls] = useState([]);
  const [wallStart, setWallStart] = useState(null);
  const [wallPreview, setWallPreview] = useState(null);

  // ── Terrain system ──
  const [terrainCells, setTerrainCells] = useState({});
  const [selectedTerrain, setSelectedTerrain] = useState("difficult");
  const [selectedWallType, setSelectedWallType] = useState("solid");

  // ── Interaction state ──
  const [dragState, setDragState] = useState(null);
  const [drawPoints, setDrawPoints] = useState([]);
  const [rulerStart, setRulerStart] = useState(null);
  const [rulerEnd, setRulerEnd] = useState(null);

  // ── Mode system ──
  const [mode, setMode] = useState("select"); // "select" | "draw" | "combat"
  const [drawTool, setDrawTool] = useState("draw"); // "draw" | "fog" | "wall" | "terrain" | "ruler" | "eraser"
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [battleFocusPanelCollapsed, setBattleFocusPanelCollapsed] = useState(false);
  const [hoveredTokenId, setHoveredTokenId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  // ── Combat state ──
  const [combatants, setCombatants] = useState([]);
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [combatLive, setCombatLive] = useState(false);
  const [combatTargetByActor, setCombatTargetByActor] = useState({});
  const [turnStateByToken, setTurnStateByToken] = useState({});
  const [playModePresentation, setPlayModePresentation] = useState("simple");
  const [playModeResolution, setPlayModeResolution] = useState(null);
  const [turnAnnouncement, setTurnAnnouncement] = useState(null); // { name, isPC, round, key }
  const [conditions, setConditions] = useState({});
  const [addName, setAddName] = useState("");
  const [addInit, setAddInit] = useState("");
  const [addHp, setAddHp] = useState("");
  const [addAc, setAddAc] = useState("");

  // ── Monster encounter builder ──
  const [monsterSearch, setMonsterSearch] = useState("");
  const [monsterCRFilter, setMonsterCRFilter] = useState("all");
  const [monsterTypeFilter, setMonsterTypeFilter] = useState("all");
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [showCombatLog, setShowCombatLog] = useState(false);
  const [combatLogOpen, setCombatLogOpen] = useState(false);
  const [pendingCombatAction, setPendingCombatAction] = useState(null);
  const [showDiceOverlay, setShowDiceOverlay] = useState(null);
  const [combatTab, setCombatTab] = useState("tracker");
  const [pcWeaponPick, setPcWeaponPick] = useState("Longsword");
  const visibleCombatTab = combatLive ? "tracker" : combatTab;

  const weaponNamesList = React.useMemo(() => {
    if (typeof window.CombatEngine === "undefined" || !window.CombatEngine.WEAPONS) return [];
    return Object.keys(window.CombatEngine.WEAPONS).sort();
  }, []);

  const addCombatLogEntry = (entry) => {
    const enriched = {...entry, id: "log-" + Date.now() + "-" + Math.random().toString(16).slice(2), time: new Date().toLocaleTimeString()};
    setCombatLog(prev => [enriched, ...prev].slice(0, 100));
    return enriched;
  };

  // ── New state for enhanced combat UI ──
  const [combatLogSidebarOpen, setCombatLogSidebarOpen] = useState(false);
  const [expandedLogEntries, setExpandedLogEntries] = useState({});
  const [selectedActionCategory, setSelectedActionCategory] = useState(null);
  const [rollResultCard, setRollResultCard] = useState(null);
  const [actionPanelVisible, setActionPanelVisible] = useState(false);
  const [setupTab, setSetupTab] = useState("bg");

  // ── Token flash/shake on damage ──
  const [tokenFlashes, setTokenFlashes] = useState({}); // { tokenId: { type, time } }
  const flashToken = (tokenId, type) => {
    setTokenFlashes(prev => ({ ...prev, [tokenId]: { type, time: Date.now() } }));
    setTimeout(() => setTokenFlashes(prev => {
      const next = { ...prev };
      delete next[tokenId];
      return next;
    }), 600);
  };

  // ── Inline floating combat text (fallback when CombatFlowUI not loaded) ──
  const [inlineFloats, setInlineFloats] = useState([]); // { id, x, y, text, color, style, time }
  const spawnInlineFloat = useCallback((x, y, text, color, style) => {
    const id = "float-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
    setInlineFloats(prev => [...prev, { id, x, y, text, color, style: style || "damage", time: Date.now() }]);
    setTimeout(() => setInlineFloats(prev => prev.filter(f => f.id !== id)), 2200);
  }, []);

  // ── OA / Reaction prompt system ──
  const [reactionPrompt, setReactionPrompt] = useState(null); // { attackerToken, moverToken, resolve }
  const reactionPromptResolveRef = useRef(null);

  // ── Floating combat text helper — spawns animated damage numbers above tokens ──
  const spawnFloatingTextForToken = useCallback((tokenId, type, opts) => {
    if (typeof window.CombatFlowUI === "undefined") return;
    const CFUI = window.CombatFlowUI;
    const tok = tokens.find(t => t.id === tokenId);
    if (!tok) return;
    const x = tok.x;
    const y = tok.y;

    switch (type) {
      case "damage":
        if (opts.breakdown && opts.breakdown.length > 0) {
          CFUI.spawnDamageText(x, y, {
            miss: false,
            isCrit: !!opts.isCrit,
            damageBreakdown: opts.breakdown.map(b => ({
              type: b.type || "untyped",
              total: b.total || 0,
              applied: b.applied != null ? b.applied : b.total,
              relation: b.relation || "normal",
            })),
            totalDamage: opts.total || 0,
            damageType: opts.damageType || "untyped",
          });
        } else if (opts.total > 0) {
          const cfg = CFUI.getDamageConfig(opts.damageType || "untyped");
          CFUI.spawnFloatingText({
            x, y,
            text: "-" + opts.total,
            style: opts.isCrit ? "crit" : "damage",
            color: cfg.color,
            glow: cfg.glow,
          });
        }
        break;
      case "miss":
        CFUI.spawnFloatingText({ x, y, text: opts.fumble ? "FUMBLE!" : "MISS", style: "miss", color: "#888", glow: "#555" });
        break;
      case "crit":
        CFUI.spawnFloatingText({ x, y: y - 18, text: "CRITICAL!", style: "crit", color: "#ffd54f", glow: "#ffab00" });
        break;
      case "heal":
        CFUI.spawnHealText(x, y, opts.amount || 0);
        break;
      case "save":
        CFUI.spawnSaveText(x, y, opts.success, opts.label);
        break;
      case "condition":
        CFUI.spawnConditionText(x, y, opts.name || "?", opts.applied !== false);
        break;
      case "death":
        CFUI.spawnDeathText(x, y, opts.text);
        break;
      case "info":
        CFUI.spawnInfoText(x, y, opts.text || "", opts.color);
        break;
      default:
        break;
    }
  }, [tokens]);

  const filteredMonsters = React.useMemo(() => {
    if (typeof window.SRD_MONSTERS === 'undefined') return [];
    return window.SRD_MONSTERS.filter(m => {
      if (monsterSearch && !m.name.toLowerCase().includes(monsterSearch.toLowerCase())) return false;
      if (monsterCRFilter !== "all" && String(m.cr) !== monsterCRFilter) return false;
      if (monsterTypeFilter !== "all" && m.type !== monsterTypeFilter) return false;
      return true;
    });
  }, [monsterSearch, monsterCRFilter, monsterTypeFilter]);

  const monsterTypes = React.useMemo(() => {
    if (typeof window.SRD_MONSTERS === 'undefined') return [];
    return [...new Set(window.SRD_MONSTERS.map(m => m.type))].sort();
  }, []);

  const monsterCRs = React.useMemo(() => {
    if (typeof window.SRD_MONSTERS === 'undefined') return [];
    return [...new Set(window.SRD_MONSTERS.map(m => String(m.cr)))].sort((a, b) => parseChallengeRating(a) - parseChallengeRating(b));
  }, []);

  const addMonsterToMap = (monster) => {
    const cx = (-pan.x + (canvasRef.current?.width || 800) / 2 / zoom);
    const cy = (-pan.y + (canvasRef.current?.height || 600) / 2 / zoom);
    const sizeMap = { Tiny: 0.5, Small: 1, Medium: 1, Large: 2, Huge: 3, Gargantuan: 4 };
    const sizeMult = sizeMap[monster.size] || 1;
    const newToken = {
      id: Date.now() + Math.random(),
      name: monster.name,
      x: Math.round(cx / gridSize) * gridSize,
      y: Math.round(cy / gridSize) * gridSize,
      color: "#dc143c",
      size: (monster.size || "medium").toLowerCase(),
      tokenSize: sizeMult,
      hp: monster.hp,
      maxHp: monster.hp,
      ac: monster.ac,
      speed: parseInt(monster.speed) || 30,
      tokenType: "enemy",
      vision: 0,
      hidden: false,
      darkvision: 0,
      label: "",
      notes: `${monster.size} ${monster.type} · CR ${monster.cr}`,
      imageSrc: null,
      monsterData: monster,
    };
    setTokens(prev => [...prev, newToken]);
    addCombatLogEntry({ type: "system", text: `${monster.name} (CR ${monster.cr}) added to the battlefield` });
  };

  const pushTargetHpToCampaign = (targetToken, newHp) => {
    if (!targetToken || newHp == null) return;
    if (targetToken.partyId && onPartyUpdate) onPartyUpdate(targetToken.partyId, { hp: newHp });
    if (targetToken.npcId != null && setData) {
      setData(d => ({
        ...d,
        npcs: (d.npcs || []).map(n => n.id === targetToken.npcId ? { ...n, hp: newHp } : n),
      }));
    }
  };

  const syncCombatantHpRow = (tokenId, newHp, maxHpValue) => {
    setCombatants(prev => prev.map(c => c.mapTokenId === tokenId ? {
      ...c,
      hp: newHp,
      maxHp: maxHpValue != null ? maxHpValue : c.maxHp,
    } : c));
  };

  const syncTokenDefeatConditions = (tokenRef, nextHp, defeatPatch) => {
    if (!tokenRef?.id) return;
    const row = combatants.find((c) => c.mapTokenId === tokenRef.id) || null;
    const syncRowConditions = (updater) => {
      if (!row?.id) return;
      setConditions((prev) => ({
        ...prev,
        [row.id]: updater([...(prev[row.id] || [])]),
      }));
    };
    if (nextHp > 0) {
      removeTokenCondition(tokenRef.id, "Unconscious");
      removeTokenCondition(tokenRef.id, "Dead");
      syncRowConditions((conds) => conds.filter((cond) => cond !== "Unconscious" && cond !== "Dead"));
      return;
    }
    removeTokenCondition(tokenRef.id, "Concentrating");
    syncRowConditions((conds) => conds.filter((cond) => cond !== "Concentrating"));
    if (tokenRef.tokenType === "pc" && !defeatPatch?.deathDead) {
      addTokenCondition(tokenRef.id, "Unconscious");
      removeTokenCondition(tokenRef.id, "Dead");
      syncRowConditions((conds) => [...new Set(conds.filter((cond) => cond !== "Dead").concat("Unconscious"))]);
      return;
    }
    addTokenCondition(tokenRef.id, "Dead");
    removeTokenCondition(tokenRef.id, "Unconscious");
    syncRowConditions((conds) => [...new Set(conds.filter((cond) => cond !== "Unconscious").concat("Dead"))]);
  };

  const applyTokenVitalsUpdate = (tokenRef, nextHp, extraUpdates = {}) => {
    if (!tokenRef?.id) return null;
    const normalizedHp = Math.max(0, Number(nextHp) || 0);
    const defeatPatch = { ...(extraUpdates || {}), hp: normalizedHp };
    if (normalizedHp > 0) {
      defeatPatch.deathSaveSuccesses = 0;
      defeatPatch.deathSaveFailures = 0;
      defeatPatch.deathStable = false;
      defeatPatch.deathDead = false;
    } else if (tokenRef.tokenType === "pc") {
      const alreadyDown = (tokenRef.hp || 0) <= 0;
      defeatPatch.deathSaveSuccesses = Math.max(0, Math.min(3, Number(defeatPatch.deathSaveSuccesses != null ? defeatPatch.deathSaveSuccesses : (alreadyDown ? tokenRef.deathSaveSuccesses : 0)) || 0));
      defeatPatch.deathSaveFailures = Math.max(0, Math.min(3, Number(defeatPatch.deathSaveFailures != null ? defeatPatch.deathSaveFailures : (alreadyDown ? tokenRef.deathSaveFailures : 0)) || 0));
      defeatPatch.deathStable = defeatPatch.deathStable != null ? !!defeatPatch.deathStable : !!(alreadyDown && tokenRef.deathStable);
      defeatPatch.deathDead = defeatPatch.deathDead != null ? !!defeatPatch.deathDead : !!(alreadyDown && tokenRef.deathDead);
    } else {
      defeatPatch.deathSaveSuccesses = 0;
      defeatPatch.deathSaveFailures = 3;
      defeatPatch.deathStable = false;
      defeatPatch.deathDead = true;
    }
    updateToken(tokenRef.id, defeatPatch);
    syncTokenDefeatConditions(tokenRef, normalizedHp, defeatPatch);
    pushTargetHpToCampaign(tokenRef, normalizedHp);
    syncCombatantHpRow(tokenRef.id, normalizedHp, tokenRef.maxHp);

    // ── Auto-end combat when all enemies of one side are defeated ──
    if (combatLive && normalizedHp <= 0) {
      // Use setTimeout so token state has time to propagate
      setTimeout(() => {
        setTokens(currentTokens => {
          // Check if all enemies (non-PC) are at 0 HP
          const livingEnemies = currentTokens.filter(t =>
            t.tokenType !== "pc" && t.color !== "#2e8b57" &&
            (t.hp || 0) > 0 && !t.hidden
          );
          // Only consider tokens that are actually in combat (have combatant entries)
          const combatEnemies = livingEnemies.filter(t =>
            combatants.some(c => c.mapTokenId === t.id)
          );
          if (combatEnemies.length === 0 && combatants.length > 0) {
            // All enemies defeated — announce victory and end combat
            addCombatLogEntry({ type: "system", text: "All enemies have been defeated! Combat ends." });
            spawnInlineFloat(
              currentTokens.find(t => t.tokenType === "pc")?.x || 0,
              currentTokens.find(t => t.tokenType === "pc")?.y || 0,
              "VICTORY!", "#ffd700", "crit"
            );
            // Delay endCombat slightly so the victory float is visible
            setTimeout(() => endCombat(), 1500);
          }
          return currentTokens; // Don't mutate, just read
        });
      }, 100);
    }

    return { hp: normalizedHp, ...defeatPatch };
  };

  // ── Combat attack execution using CombatEngine ──
  const buildEngineCombatTarget = (t, tid) => {
    const md = t.monsterData || {};
    return {
      ...md,
      name: t.name,
      ac: t.ac != null ? t.ac : md.ac,
      hp: t.hp,
      maxHp: t.maxHp,
      id: t.id,
      str: t.str != null ? t.str : md.str,
      dex: t.dex != null ? t.dex : md.dex,
      conditions: (getMergedConditionsForToken(t) || tokenConditions[tid] || []).map(c => String(c).toLowerCase()),
    };
  };

  // ── Get attack advantage/disadvantage based on conditions ──
  const getAttackAdvantage = (attacker, target, isRanged) => {
    if (!attacker || !target) return "normal";

    const attackerConds = new Set(getMergedConditionsForToken(attacker).map(c => c.toLowerCase()));
    const targetConds = new Set(getMergedConditionsForToken(target).map(c => c.toLowerCase()));

    let hasAdvantage = false;
    let hasDisadvantage = false;

    // ── Attacker gets advantage if: ──
    if (!isRanged && targetConds.has("prone")) hasAdvantage = true;
    if (targetConds.has("blinded")) hasAdvantage = true;
    if (targetConds.has("paralyzed")) hasAdvantage = true;
    if (targetConds.has("stunned")) hasAdvantage = true;
    if (targetConds.has("unconscious")) hasAdvantage = true;
    if (targetConds.has("restrained")) hasAdvantage = true;
    if (targetConds.has("invisible") || targetConds.has("hidden")) hasAdvantage = true;

    // ── Attacker has disadvantage if: ──
    if (attackerConds.has("blinded")) hasDisadvantage = true;
    if (attackerConds.has("poisoned")) hasDisadvantage = true;
    if (attackerConds.has("restrained")) hasDisadvantage = true;
    if (isRanged && targetConds.has("prone")) hasDisadvantage = true;
    if (targetConds.has("invisible") || targetConds.has("hidden")) hasDisadvantage = true;

    // ── If both advantage and disadvantage, they cancel out ──
    if (hasAdvantage && hasDisadvantage) return "normal";
    if (hasAdvantage) return "advantage";
    if (hasDisadvantage) return "disadvantage";
    return "normal";
  };

  const buildCombatEngineOptions = (targetToken, attackerToken) => {
    const lane = getLineCoverProfile(attackerToken, targetToken);
    const opts = {
      targetDodging: !!targetToken.combatDodge,
      coverACBonus: lane.coverACBonus,
      dexSaveBonus: lane.dexSaveBonus,
      hasLineOfSight: lane.hasLineOfSight,
      coverLabel: lane.coverLabel,
      magicalWeapon: !!attackerToken.magicalWeapon,
    };

    // ── BG3: Flanking check ──
    if (typeof window.CombatEngine !== "undefined" && combatLive && typeof window.CombatEngine.checkFlanking === "function") {
      const allies = tokens.filter(t =>
        t.id !== attackerToken.id && t.id !== targetToken.id &&
        t.tokenType === attackerToken.tokenType && (t.hp || 0) > 0
      );
      opts.flanking = window.CombatEngine.checkFlanking(attackerToken, targetToken, allies, gridSize);
    }

    // ── BG3: Height advantage ──
    if (typeof window.CombatEngine !== "undefined" && typeof window.CombatEngine.getHeightAdvantage === "function") {
      opts.heightAdvantage = window.CombatEngine.getHeightAdvantage(attackerToken, targetToken);
    }

    return opts;
  };

  // ── Apply damage resistances/vulnerabilities/immunities ──
  const applyDamageResistances = (damage, damageType, targetToken) => {
    if (!targetToken || !damageType) return damage;

    const profile = getPartyProfile(targetToken);
    let resistances = [];
    let vulnerabilities = [];
    let immunities = [];

    // Get resistances from party profile or monster data
    if (profile) {
      resistances = profile.resistances || [];
      vulnerabilities = profile.vulnerabilities || [];
      immunities = profile.immunities || [];
    } else if (targetToken.monsterData) {
      resistances = targetToken.monsterData.resistances || [];
      vulnerabilities = targetToken.monsterData.vulnerabilities || [];
      immunities = targetToken.monsterData.immunities || [];
    }

    // Normalize damage type for comparison
    const normalizedType = damageType.toLowerCase().trim();

    // Check immunity (highest priority)
    if (immunities.some(imm => imm.toLowerCase().includes(normalizedType))) {
      return 0;
    }

    // Check vulnerability (2x damage)
    let finalDamage = damage;
    if (vulnerabilities.some(vuln => vuln.toLowerCase().includes(normalizedType))) {
      finalDamage = damage * 2;
    }

    // Check resistance (half damage, round down)
    if (resistances.some(res => res.toLowerCase().includes(normalizedType))) {
      finalDamage = Math.floor(finalDamage / 2);
    }

    return finalDamage;
  };

  const applyAttackResultToTarget = (targetId, targetRef, totalDamage, damageType) => {
    if (!totalDamage || totalDamage <= 0) return;
    const resolvedTarget = targetRef || tokens.find((t) => t.id === targetId);
    if (!resolvedTarget) return;

    // ── Apply damage resistances/vulnerabilities/immunities ──
    let finalDamage = totalDamage;
    if (damageType) {
      finalDamage = applyDamageResistances(totalDamage, damageType, resolvedTarget);
      if (finalDamage !== totalDamage) {
        const resistanceLog = finalDamage === 0 ? "is immune to" : finalDamage > totalDamage ? "is vulnerable to" : "resists";
        addCombatLogEntry({ type: "system", text: resolvedTarget.name + " " + resistanceLog + " " + damageType + " damage (" + finalDamage + " damage taken)" });
      }
    }

    // ── Temp HP absorption (BG3) ──
    const tempHp = resolvedTarget.tempHp || 0;
    let actualDamage = finalDamage;
    if (tempHp > 0 && typeof window.CombatEngine !== "undefined" && typeof window.CombatEngine.applyDamageWithTempHp === "function") {
      const result = window.CombatEngine.applyDamageWithTempHp(resolvedTarget.hp || 0, tempHp, finalDamage);
      updateToken(resolvedTarget.id, { tempHp: result.newTempHp });
      if (result.tempHpAbsorbed > 0) {
        addCombatLogEntry({ type:"system", text: resolvedTarget.name + " absorbs " + result.tempHpAbsorbed + " damage with temporary HP (" + result.newTempHp + " temp HP remaining)" });
      }
      actualDamage = result.hpLost > 0 ? (resolvedTarget.hp || 0) - result.newHp : 0;
      applyTokenVitalsUpdate(resolvedTarget, result.newHp);
    } else {
      const newHp = Math.max(0, (resolvedTarget.hp || 0) - finalDamage);
      applyTokenVitalsUpdate(resolvedTarget, newHp);
    }

    // ── Concentration save (BG3 / 5e) ──
    if (totalDamage > 0 && typeof window.CombatEngine !== "undefined" && typeof window.CombatEngine.rollConcentrationSave === "function") {
      const conds = getMergedConditionsForToken(resolvedTarget);
      const isConcentrating = conds.includes("Concentrating") || resolvedTarget.activeConcentrationSpell;
      if (isConcentrating) {
        const conScore = resolvedTarget.con || resolvedTarget.stats?.con || 10;
        const save = window.CombatEngine.rollConcentrationSave({ ...resolvedTarget, con: conScore }, totalDamage);
        if (save.concentrationBroken) {
          addCombatLogEntry({ type:"save", text: resolvedTarget.name + " FAILS concentration save (DC " + save.dc + ", rolled " + save.total + ") — " + (resolvedTarget.activeConcentrationSpell || "spell") + " ends!" });
          updateToken(resolvedTarget.id, { activeConcentrationSpell: null });
          removeTokenCondition(resolvedTarget.id, "Concentrating");
        } else {
          addCombatLogEntry({ type:"save", text: resolvedTarget.name + " maintains concentration (DC " + save.dc + ", rolled " + save.total + ")" });
        }
      }
    }
  };

  // FIX 3: Helper function to get extra attack count based on class and level
  const getExtraAttackCount = (cls, level) => {
    if (!cls || !level) return 0;
    const classLower = String(cls).toLowerCase();
    const isMartial = ["fighter", "barbarian", "monk", "paladin", "ranger"].some(c => classLower.includes(c));
    if (!isMartial) return 0;

    if (classLower.includes("fighter")) {
      if (level >= 20) return 3; // 4 total attacks (3 extra)
      if (level >= 11) return 2; // 3 total attacks (2 extra)
      if (level >= 5) return 1;  // 2 total attacks (1 extra)
    } else {
      // All other martial classes
      if (level >= 5) return 1;  // 2 total attacks (1 extra)
    }
    return 0;
  };

  const executePcWeaponAction = (attackerId, targetId, weaponName) => {
    if (typeof window.CombatEngine === "undefined") return;
    const CE = window.CombatEngine;
    const attacker = tokens.find(t => t.id === attackerId);
    const target = tokens.find(t => t.id === targetId);
    if (!attacker || !target || attacker.tokenType !== "pc") return;
    const lockReason = getActionLockReasonForToken(attacker);
    if (lockReason) {
      addCombatLogEntry({ type: "system", text: attacker.name + " cannot attack: " + lockReason });
      setPlayModeResolution({ title: weaponName, lines: ["Cannot use this option right now.", lockReason] });
      return;
    }
    let pcStats = {
      str: attacker.str != null ? attacker.str : 10,
      dex: attacker.dex != null ? attacker.dex : 10,
      lv: attacker.level || 1,
      conditions: (tokenConditions[attackerId] || []).map(c => String(c).toLowerCase()),
    };
    if (attacker.partyId && party && party.length) {
      const m = party.find(p => p.id === attacker.partyId);
      if (m) {
        if (m.str != null) pcStats.str = m.str;
        if (m.dex != null) pcStats.dex = m.dex;
        if (m.lv != null) pcStats.lv = m.lv;
      }
    }
    const tgt = buildEngineCombatTarget(target, targetId);
    const opts = { ...buildCombatEngineOptions(target, attacker), magicalWeapon: !!attacker.magicalWeapon };
    if (!opts.hasLineOfSight) {
      const msg = "No clear line of sight from " + attacker.name + " to " + target.name + ".";
      addCombatLogEntry({ type: "system", text: msg });
      setPlayModeResolution({ title: weaponName, lines: [msg, "Move, open a door, or change focus target before attacking."] });
      return;
    }
    // Add condition-based advantage/disadvantage
    const isRanged = weaponName && (weaponName.toLowerCase().includes("bow") || weaponName.toLowerCase().includes("crossbow") || weaponName.toLowerCase().includes("dart") || weaponName.toLowerCase().includes("dagger") && weaponName.toLowerCase().includes("throw"));
    const conditionAdvantage = getAttackAdvantage(attacker, target, isRanged);
    if (conditionAdvantage !== "normal") {
      opts.conditionAdvantage = conditionAdvantage;
    }
    const result = CE.executePcWeaponAttack(pcStats, tgt, weaponName, opts);
    if (result.error) {
      addCombatLogEntry({ type: "system", text: result.error });
      return;
    }
    const r0 = result.results[0];
    if (r0?.hit) {
      let bonusDamage = 0;
      const bonusLabels = [];

      // ── BG3: Flanking log ──
      if (opts.flanking) {
        bonusLabels.push("flanking advantage");
      }
      // ── BG3: Height advantage log ──
      if (opts.heightAdvantage === "advantage") {
        bonusLabels.push("high ground advantage");
      }

      // ── BG3: Sneak Attack (Rogue) ──
      const attackerClass = (attacker.class || attacker.cls || "").toLowerCase();
      if (attackerClass.includes("rogue") && !attacker._sneakAttackUsedThisTurn) {
        const allies = tokens.filter(t => t.id !== attacker.id && t.id !== target.id && t.tokenType === attacker.tokenType && (t.hp || 0) > 0);
        const sneakCheck = CE.checkSneakAttack(
          { ...pcStats, class: attacker.class || attacker.cls },
          target, r0.attackRoll?.mode === "advantage", allies, weaponName
        );
        if (sneakCheck.eligible) {
          const sneakRoll = CE.rollSneakAttack(pcStats.lv || 1);
          bonusDamage += sneakRoll.total;
          bonusLabels.push("Sneak Attack +" + sneakRoll.total);
          addCombatLogEntry({ type: "system", text: attacker.name + " triggers Sneak Attack for " + sneakRoll.total + " extra damage (" + sneakRoll.expression + ")" });
          updateToken(attacker.id, { _sneakAttackUsedThisTurn: true });
        }
      }

      // ── BG3: Rage damage (Barbarian) ──
      if (attackerClass.includes("barbarian") && getMergedConditionsForToken(attacker).includes("Raging")) {
        const rageDmg = CE.getRageDamage(pcStats.lv || 1);
        bonusDamage += rageDmg;
        bonusLabels.push("Rage +" + rageDmg);
      }

      const totalDmg = result.totalDamage + bonusDamage;
      const logLabel = bonusLabels.length > 0 ? " (" + bonusLabels.join(", ") + ")" : "";
      const dtype = r0.damage?.[0]?.type || "slashing";
      addCombatLogEntry({ type: "attack", attacker: attacker.name, target: target.name, action: weaponName + logLabel, hit: true, damage: totalDmg, isCrit: r0.isCrit, roll: r0.attackRoll });
      applyAttackResultToTarget(targetId, target, totalDmg, dtype);
      // Floating combat text + weapon-specific animation
      spawnFloatingTextForToken(targetId, "damage", { total: totalDmg, damageType: dtype, isCrit: r0.isCrit });
      flashToken(targetId, "damage");
      emitPlayModeVfx(attacker, target, { mode: "attack", actionName: weaponName, weaponName: weaponName, damageType: dtype, amount: totalDmg, isCrit: r0.isCrit, isRanged: !!(CE.isRangedWeapon ? CE.isRangedWeapon(weaponName) : (weaponName||"").toLowerCase().match(/bow|crossbow|dart|sling|javelin|thrown/)) });
      // Special class animations
      const cls = (attacker.class || attacker.cls || "").toLowerCase();
      if (bonusLabels.some(l => l.includes("Sneak"))) triggerActionAnim("sneak_attack", attacker, target, "#6b2fa0");
    } else if (r0) {
      addCombatLogEntry({ type: "miss", attacker: attacker.name, target: target.name, action: weaponName, roll: r0.attackRoll });
      spawnFloatingTextForToken(targetId, "miss", {});
      flashToken(targetId, "miss");
      emitPlayModeVfx(attacker, target, { mode: "miss" });
    }
    if (result.results[1]?.type === "onHitSave" && !result.results[1].save?.success && result.results[1].condition) {
      addTokenCondition(targetId, result.results[1].condition.charAt(0).toUpperCase() + result.results[1].condition.slice(1));
    }

    // FIX 3: Fighter Extra Attack
    const profile = getCombatProfile(attacker);
    const extraAttackCount = getExtraAttackCount(profile.cls, profile.level);
    if (extraAttackCount > 0) {
      for (let i = 0; i < extraAttackCount; i++) {
        const extraResult = CE.executePcWeaponAttack(pcStats, tgt, weaponName, opts);
        if (extraResult.error) continue;
        const extraAttack = extraResult.results[0];
        if (extraAttack?.hit) {
          let extraBonusDamage = 0;
          const extraBonusLabels = [];
          if (opts.flanking) extraBonusLabels.push("flanking");
          if (opts.heightAdvantage === "advantage") extraBonusLabels.push("high ground");
          if (attackerClass.includes("barbarian") && getMergedConditionsForToken(attacker).includes("Raging")) {
            const rageDmg = CE.getRageDamage(pcStats.lv || 1);
            extraBonusDamage += rageDmg;
            extraBonusLabels.push("Rage +" + rageDmg);
          }
          const extraTotalDmg = extraResult.totalDamage + extraBonusDamage;
          const extraLogLabel = extraBonusLabels.length > 0 ? " (" + extraBonusLabels.join(", ") + ")" : "";
          const extraDtype = extraAttack.damage?.[0]?.type || "slashing";
          addCombatLogEntry({ type: "attack", attacker: attacker.name, target: target.name, action: weaponName + " (Extra Attack " + (i + 1) + ")" + extraLogLabel, hit: true, damage: extraTotalDmg, isCrit: extraAttack.isCrit, roll: extraAttack.attackRoll });
          applyAttackResultToTarget(targetId, target, extraTotalDmg, extraDtype);
          spawnFloatingTextForToken(targetId, "damage", { total: extraTotalDmg, damageType: extraDtype, isCrit: extraAttack.isCrit });
          flashToken(targetId, "damage");
          emitPlayModeVfx(attacker, target, { mode: "attack", actionName: weaponName + " (Extra Attack)", weaponName: weaponName, damageType: extraDtype, amount: extraTotalDmg, isCrit: extraAttack.isCrit, isRanged: !!(CE.isRangedWeapon ? CE.isRangedWeapon(weaponName) : (weaponName||"").toLowerCase().match(/bow|crossbow|dart|sling|javelin|thrown/)) });
        } else if (extraAttack) {
          addCombatLogEntry({ type: "miss", attacker: attacker.name, target: target.name, action: weaponName + " (Extra Attack " + (i + 1) + ")", roll: extraAttack.attackRoll });
          spawnFloatingTextForToken(targetId, "miss", {});
          flashToken(targetId, "miss");
          emitPlayModeVfx(attacker, target, { mode: "miss" });
        }
      }
    }
  };

  const getTokenCenterPoint = (token) => ({
    x: (token?.x || 0) + gridSize / 2,
    y: (token?.y || 0) + gridSize / 2,
  });

  // ── Determine weapon-specific animation type from weapon name ──
  const getWeaponAnimType = (weaponName) => {
    if (!weaponName) return "melee_attack";
    const wn = weaponName.toLowerCase();
    if (wn.includes("crossbow")) return "crossbow_bolt";
    if (wn.includes("longbow") || wn.includes("shortbow") || wn.includes("bow")) return "arrow_shot";
    if (wn.includes("javelin") || wn.includes("dart") || wn.includes("sling")) return "thrown_projectile";
    if (wn.includes("greataxe") || wn.includes("battleaxe") || wn.includes("halberd") || wn.includes("glaive")) return "heavy_slash";
    if (wn.includes("greatsword") || wn.includes("longsword") || wn.includes("rapier") || wn.includes("scimitar") || wn.includes("shortsword")) return "sword_slash";
    if (wn.includes("mace") || wn.includes("warhammer") || wn.includes("maul") || wn.includes("flail") || wn.includes("morningstar")) return "blunt_impact";
    if (wn.includes("dagger") || wn.includes("knife")) return "dagger_stab";
    if (wn.includes("spear") || wn.includes("pike") || wn.includes("lance") || wn.includes("trident")) return "spear_thrust";
    if (wn.includes("staff") || wn.includes("quarterstaff")) return "staff_strike";
    // Fallback: check if ranged via CombatEngine
    const CE = window.CombatEngine;
    if (CE && CE.WEAPONS && CE.WEAPONS[weaponName]) {
      return CE.WEAPONS[weaponName].melee ? "melee_attack" : "ranged_attack";
    }
    return "melee_attack";
  };

  const emitPlayModeVfx = (actorToken, targetToken, options = {}) => {
    if (!actorToken) return;
    const opts = options || {};
    const origin = getTokenCenterPoint(actorToken);
    const target = getTokenCenterPoint(targetToken || actorToken);
    const actionName = opts.actionName || actorToken.name || "Action";
    const damageType = opts.damageType || "force";
    const CFUI = typeof window.CombatFlowUI !== "undefined" ? window.CombatFlowUI : null;

    if (opts.mode === "attack") {
      // Determine animation type from weapon name
      const animType = opts.weaponName ? getWeaponAnimType(opts.weaponName) : (opts.isRanged ? "ranged_attack" : "melee_attack");
      if (opts.isCrit) {
        triggerActionAnim("critical_hit", actorToken, targetToken, "#ffd700");
      }
      triggerActionAnim(animType, actorToken, targetToken, opts.isCrit ? "#ffd700" : (opts.color || "#e0d0b0"));
      // Floating combat text — use CFUI if loaded, otherwise inline fallback
      if (CFUI && targetToken) {
        if (opts.isCrit) CFUI.spawnFloatingText({ x: target.x, y: target.y - 20, text: "CRITICAL!", style: "crit", color: "#ffd54f", glow: "#ffab00" });
        if (opts.amount > 0) {
          const cfg = CFUI.getDamageConfig(damageType);
          CFUI.spawnFloatingText({ x: target.x, y: target.y, text: "-" + opts.amount, style: opts.isCrit ? "crit" : "damage", color: cfg.color, glow: cfg.glow, delay: opts.isCrit ? 300 : 0 });
        }
      } else if (targetToken) {
        if (opts.isCrit) spawnInlineFloat(target.x, target.y - 24, "CRITICAL!", "#ffd700", "crit");
        if (opts.amount > 0) spawnInlineFloat(target.x, target.y, "-" + opts.amount, opts.isCrit ? "#ffd700" : "#f06858", opts.isCrit ? "crit" : "damage");
      }
      flashToken(targetToken?.id, opts.amount > 0 ? "damage" : "miss");
      return;
    }

    if (opts.mode === "miss") {
      triggerActionAnim("miss", targetToken || actorToken, null, "#888");
      if (CFUI && targetToken) CFUI.spawnFloatingText({ x: target.x, y: target.y, text: "MISS", style: "miss", color: "#888", glow: "#555" });
      else if (targetToken) spawnInlineFloat(target.x, target.y, "MISS", "#888", "miss");
      flashToken(targetToken?.id, "miss");
      return;
    }

    if (opts.mode === "save") {
      triggerActionAnim(opts.saveSuccess ? "block" : "melee_attack", targetToken || actorToken, null, opts.saveSuccess ? "#58aaff" : "#f06858");
      if (CFUI && targetToken) {
        CFUI.spawnSaveText(target.x, target.y, opts.saveSuccess, opts.saveSuccess ? "SAVED" : "FAILED");
        if (opts.amount > 0) {
          const cfg = CFUI.getDamageConfig(damageType);
          CFUI.spawnFloatingText({ x: target.x, y: target.y, text: "-" + opts.amount, style: "damage", color: cfg.color, glow: cfg.glow, delay: 200 });
        }
      } else if (targetToken) {
        spawnInlineFloat(target.x, target.y - 16, opts.saveSuccess ? "SAVED" : "FAILED", opts.saveSuccess ? "#58aaff" : "#f06858", "save");
        if (opts.amount > 0) spawnInlineFloat(target.x, target.y + 8, "-" + opts.amount, "#f06858", "damage");
      }
      flashToken(targetToken?.id, opts.amount > 0 ? "damage" : "miss");
      return;
    }

    if (opts.mode === "heal") {
      triggerActionAnim("second_wind", targetToken || actorToken, null, "#5ee09a");
      if (CFUI && targetToken) CFUI.spawnHealText(target.x, target.y, opts.amount || 0);
      else if (targetToken) spawnInlineFloat(target.x, target.y, "+" + (opts.amount || 0), "#5ee09a", "heal");
      return;
    }

    if (opts.mode === "condition") {
      triggerActionAnim("grapple", targetToken || actorToken, null, "#ab47bc");
      if (CFUI && targetToken) CFUI.spawnConditionText(target.x, target.y, opts.conditionName || actionName, true);
      else if (targetToken) spawnInlineFloat(target.x, target.y, opts.conditionName || actionName, "#ab47bc", "condition");
      return;
    }

    if (opts.mode === "shockwave") {
      triggerActionAnim("action_surge", targetToken || actorToken, null, opts.color || "#58aaff");
      return;
    }

    // Default: buff/info
    triggerActionAnim("dodge", actorToken, null, opts.color || "#58aaff");
    if (CFUI && targetToken) CFUI.spawnInfoText(target.x, target.y, actionName, opts.color || "#58aaff");
    else if (targetToken) spawnInlineFloat(target.x, target.y, actionName, opts.color || "#58aaff", "info");
  };

  const executeCombatAction = (attackerId, targetId, actionOrIndex) => {
    if (typeof window.CombatEngine === 'undefined') return false;
    const CE = window.CombatEngine;
    const attacker = tokens.find(t => t.id === attackerId);
    const target = tokens.find(t => t.id === targetId);
    if (!attacker || !target) return false;
    const lockReason = getActionLockReasonForToken(attacker);
    if (lockReason) {
      addCombatLogEntry({ type: "system", text: attacker.name + " cannot act: " + lockReason });
      setPlayModeResolution({ title: attacker.name, lines: ["Cannot use this option right now.", lockReason] });
      return false;
    }
    openCombatSidebar("tracker");

    const monster = attacker.monsterData;
    if (!monster) return false;

    let action = typeof actionOrIndex === 'number' ? monster.actions[actionOrIndex] : actionOrIndex;
    if (!action) return false;
    if (action._isLegendary && typeof CE.resolveLegendaryAction === "function") {
      const resolved = CE.resolveLegendaryAction(monster, action);
      if (resolved && resolved.desc) action = resolved;
    }

    const engineTarget = buildEngineCombatTarget(target, targetId);
    const combatOpts = buildCombatEngineOptions(target, attacker);
    const parsedCheck = CE.parseAttackAction(action) || CE.parseSaveAction(action);
    const isMultiattackLine = String(action?.name || "").toLowerCase() === "multiattack";
    if ((parsedCheck || isMultiattackLine) && targetId !== attackerId && !combatOpts.hasLineOfSight) {
      const msg = "No clear line of sight from " + attacker.name + " to " + target.name + " for " + action.name + ".";
      addCombatLogEntry({ type: "system", text: msg });
      setPlayModeResolution({ title: action.name, lines: [msg, "Use movement, a door interaction, or a different focus target."] });
      return false;
    }

    // Check if it's multiattack
    if (action.name.toLowerCase() === "multiattack") {
      const result = CE.executeMultiattack(
        { ...monster, conditions: (tokenConditions[attackerId] || []).map(c => c.toLowerCase()) },
        engineTarget,
        monster,
        combatOpts
      );

      let totalDmg = 0;
      result.attackSequence.forEach(seq => {
        if (seq.type === "attack" && seq.result) {
          if (seq.result.hit) {
            totalDmg += seq.result.totalDamage || 0;
            addCombatLogEntry({ type: "attack", attacker: attacker.name, target: target.name, action: seq.action.name, hit: true, damage: seq.result.totalDamage, isCrit: seq.result.isCrit, roll: seq.result.attackRoll });
            pushCombatRoll(
              attacker.name + " \u2694 " + target.name + (seq.result.isCrit ? " CRITICAL!" : " HIT!"),
              "Attack: " + (seq.result.attackRoll?.details || "d20") + " + " + (seq.result.attackRoll?.modifier ?? "?") + " = " + (seq.result.attackRoll?.total ?? "?") + " vs AC " + (seq.result.attackRoll?.targetAC ?? target.ac ?? 10) + "  |  Damage: " + (seq.result.totalDamage || 0),
              seq.result.isCrit ? "crit" : "hit"
            );
            // Trigger VFX via action animation system
            const dtype = seq.result.damage?.[0]?.type || "slashing";
            spawnFloatingTextForToken(targetId, "damage", { total: seq.result.totalDamage, damageType: dtype, isCrit: seq.result.isCrit });
            flashToken(targetId, "damage");
            { // Monster action VFX lookup
              const monsterAnimKey = (seq.action.name || "").trim();
              const mavfx = typeof MONSTER_ACTION_VFX !== "undefined" && MONSTER_ACTION_VFX[monsterAnimKey];
              if (mavfx) {
                triggerActionAnim(mavfx.type || "melee_attack", attacker, target, mavfx.color || "#e0d0b0");
              } else {
                const animType = getWeaponAnimType(seq.action.name);
                triggerActionAnim(seq.result.isCrit ? "critical_hit" : animType, attacker, target, seq.result.isCrit ? "#ffd700" : "#e0d0b0");
              }
            }
          } else {
            addCombatLogEntry({ type: "miss", attacker: attacker.name, target: target.name, action: seq.action.name, roll: seq.result.attackRoll });
            pushCombatRoll(
              attacker.name + " \u2694 " + target.name + " MISS",
              "Attack: " + (seq.result.attackRoll?.details || "d20") + " + " + (seq.result.attackRoll?.modifier ?? "?") + " = " + (seq.result.attackRoll?.total ?? "?") + " vs AC " + (seq.result.attackRoll?.targetAC ?? target.ac ?? 10),
              "miss"
            );
            spawnFloatingTextForToken(targetId, "miss", {});
            flashToken(targetId, "miss");
            triggerActionAnim("miss", target, null, "#888");
          }
        } else if (seq.type === "save" && seq.result) {
          addCombatLogEntry({ type: "save", attacker: attacker.name, target: target.name, action: seq.action.name, success: seq.result.save?.success, damage: seq.result.damage, conditions: seq.result.conditions });
          if (seq.result.damage) totalDmg += seq.result.damage;
          // Save VFX
          emitPlayModeVfx(attacker, target, { mode: "save", actionName: seq.action.name, saveSuccess: seq.result.save?.success, amount: seq.result.damage || 0, damageType: seq.parsed?.failDamage?.type || "force" });
          if (seq.result.conditions?.length) {
            seq.result.conditions.forEach(c => addTokenCondition(targetId, c.charAt(0).toUpperCase() + c.slice(1)));
          }
        }
      });

      if (totalDmg > 0) applyAttackResultToTarget(targetId, target, totalDmg, "slashing");
      return true;
    }

    // Single attack or save action
    const parsed = CE.parseAttackAction(action);
    if (parsed) {
      const result = CE.executeAttack(
        { ...monster, conditions: (tokenConditions[attackerId] || []).map(c => c.toLowerCase()) },
        engineTarget,
        action,
        combatOpts
      );
      if (result.results[0]?.hit) {
        const dtype = result.results[0].damage?.[0]?.type || "slashing";
        addCombatLogEntry({ type: "attack", attacker: attacker.name, target: target.name, action: action.name, hit: true, damage: result.totalDamage, isCrit: result.results[0].isCrit, roll: result.results[0].attackRoll });
        pushCombatRoll(
          attacker.name + " \u2694 " + target.name + (result.results[0].isCrit ? " CRITICAL!" : " HIT!"),
          "Attack: " + (result.results[0].attackRoll?.details || "d20") + " + " + (result.results[0].attackRoll?.modifier ?? "?") + " = " + (result.results[0].attackRoll?.total ?? "?") + " vs AC " + (result.results[0].attackRoll?.targetAC ?? target.ac ?? 10) + "  |  Damage: " + (result.totalDamage || 0) + " " + dtype,
          result.results[0].isCrit ? "crit" : "hit"
        );
        applyAttackResultToTarget(targetId, target, result.totalDamage, dtype);
        spawnFloatingTextForToken(targetId, "damage", { total: result.totalDamage, damageType: dtype, isCrit: result.results[0].isCrit });
        flashToken(targetId, "damage");
        { // Monster action VFX
          const monsterAnimKey = (action.name || "").trim();
          const mavfx = typeof MONSTER_ACTION_VFX !== "undefined" && MONSTER_ACTION_VFX[monsterAnimKey];
          if (mavfx) {
            triggerActionAnim(mavfx.type || "melee_attack", attacker, target, mavfx.color || "#e0d0b0");
          } else {
            const animType = getWeaponAnimType(action.name);
            triggerActionAnim(result.results[0].isCrit ? "critical_hit" : animType, attacker, target, result.results[0].isCrit ? "#ffd700" : "#e0d0b0");
          }
        }
      } else {
        addCombatLogEntry({ type: "miss", attacker: attacker.name, target: target.name, action: action.name, roll: result.results[0]?.attackRoll });
        pushCombatRoll(
          attacker.name + " \u2694 " + target.name + " MISS",
          "Attack: " + (result.results[0]?.attackRoll?.details || "d20") + " + " + (result.results[0]?.attackRoll?.modifier ?? "?") + " = " + (result.results[0]?.attackRoll?.total ?? "?") + " vs AC " + (result.results[0]?.attackRoll?.targetAC ?? target.ac ?? 10),
          "miss"
        );
        spawnFloatingTextForToken(targetId, "miss", {});
        flashToken(targetId, "miss");
        triggerActionAnim("miss", target, null, "#888");
      }
      if (result.results[1]?.type === "onHitSave" && !result.results[1].save?.success && result.results[1].condition) {
        addTokenCondition(targetId, result.results[1].condition.charAt(0).toUpperCase() + result.results[1].condition.slice(1));
      }
    } else {
      const parsedSave = CE.parseSaveAction(action);
      if (!parsedSave) {
        const utilityText = String(action.desc || "");
        const healMatch = utilityText.match(/regains\s+(\d+)(?:\s*\(([^)]+)\))?\s*hit points/i);
        if (healMatch) {
          const healAmount = healMatch[2]
            ? Math.max(0, CE.rollDice(healMatch[2].replace(/\s+/g, "")).total || 0)
            : Math.max(0, parseInt(healMatch[1], 10) || 0);
          const nextHp = Math.min(attacker.maxHp || attacker.hp || healAmount, (attacker.hp || 0) + healAmount);
          applyTokenVitalsUpdate(attacker, nextHp);
          emitPlayModeVfx(attacker, attacker, { mode: "heal", actionName: action.name, amount: healAmount });
          addCombatLogEntry({
            type: "system",
            text: attacker.name + " uses " + action.name + " and regains " + healAmount + " HP.",
          });
          return true;
        }
        addCombatLogEntry({
          type: "system",
          text: attacker.name + " uses " + action.name + ".\n" + String(action.desc || "Resolve this utility action from the stat block.").slice(0, 280),
        });
        const utilityName = String(action.name || "").toLowerCase();
        if (/heal|regeneration|renew|restore/i.test(utilityName + " " + utilityText)) {
          emitPlayModeVfx(attacker, attacker, { mode: "heal", amount: 0 });
        } else if (/roar|frightful|presence|command|charm|teleport|summon|call/i.test(utilityName + " " + utilityText)) {
          emitPlayModeVfx(attacker, target, { mode: "shockwave", actionName: action.name, damageType: "psychic", radius: 50 });
        } else {
          emitPlayModeVfx(attacker, target, { mode: "buff", actionName: action.name, color: "#ffd54f" });
        }
        return true;
      }
      const saveResult = CE.executeSaveAction(
        { ...monster, conditions: (tokenConditions[attackerId] || []).map(c => c.toLowerCase()) },
        [engineTarget],
        action,
        combatOpts
      );
      if (saveResult.results[0]) {
        const r = saveResult.results[0];
        addCombatLogEntry({ type: "save", attacker: attacker.name, target: target.name, action: action.name, success: r.save?.success, damage: r.damage, conditions: r.conditions, dc: saveResult.parsed?.dc, ability: saveResult.parsed?.ability });
        if (r.damage > 0) applyAttackResultToTarget(targetId, target, r.damage, saveResult.parsed?.failDamage?.type || "force");
        if (r.conditions?.length) {
          r.conditions.forEach(c => addTokenCondition(targetId, c.charAt(0).toUpperCase() + c.slice(1)));
        }
        // Save action VFX
        emitPlayModeVfx(attacker, target, { mode: "save", actionName: action.name, saveSuccess: r.save?.success, amount: r.damage || 0, damageType: saveResult.parsed?.failDamage?.type || "force" });
        { // Monster-specific VFX for save actions
          const mavfx = typeof MONSTER_ACTION_VFX !== "undefined" && MONSTER_ACTION_VFX[(action.name || "").trim()];
          if (mavfx) triggerActionAnim(mavfx.type || "breath_weapon", attacker, target, mavfx.color || "#f06858");
        }
      }
    }
    return true;
  };

  // ── Roll initiative using CombatEngine ──
  const rollMonsterInitiative = (monster) => {
    if (typeof window.CombatEngine === 'undefined') return Math.floor(Math.random() * 20) + 1;
    const dexMod = Math.floor(((monster.dex || 10) - 10) / 2);
    const result = window.CombatEngine.rollInitiative(dexMod);
    return result.total;
  };

  // ── Encounter difficulty ──
  const encounterDifficulty = React.useMemo(() => {
    if (typeof window.CombatEngine === 'undefined') return null;
    const monsterTokens = tokens.filter(t => t.monsterData);
    if (monsterTokens.length === 0) return null;
    const pcTokens = tokens.filter(t => t.tokenType === "pc");
    const partyLevels = pcTokens.length > 0 ? pcTokens.map(t => t.level || 5) : [5, 5, 5, 5]; // Default level 5 party of 4
    const monsterXPs = monsterTokens.map(t => t.monsterData.xp || 0);
    return window.CombatEngine.calculateEncounterDifficulty(partyLevels, monsterXPs);
  }, [tokens]);

  // ── Movement system ──
  const [movementMode, setMovementMode] = useState(false);
  const [movementPath, setMovementPath] = useState([]);
  const [movementOrigin, setMovementOrigin] = useState(null);

  // ── Fog mode ──
  const [fogMode, setFogMode] = useState("manual"); // "manual" | "vision"
  const [fogEnabled, setFogEnabled] = useState(true);

  // ── Token conditions (independent of combat) ──
  const [tokenConditions, setTokenConditions] = useState({}); // { tokenId: ["Blinded", ...] }
  const addTokenCondition = (tokenId, cond) => {
    if (!cond) return;
    setTokenConditions(p => ({...p, [tokenId]: [...(p[tokenId]||[]).filter(c=>c!==cond), cond]}));
    spawnFloatingTextForToken(tokenId, "condition", { name: cond, applied: true });
    if (cond === "Dead") spawnFloatingTextForToken(tokenId, "death", { text: "DEFEATED" });
  };
  const removeTokenCondition = (tokenId, cond) => {
    setTokenConditions(p => ({...p, [tokenId]: (p[tokenId]||[]).filter(c=>c!==cond)}));
    spawnFloatingTextForToken(tokenId, "condition", { name: cond, applied: false });
  };

  // ── Weapon targeting system ──
  const [activeWeapon, setActiveWeapon] = useState(null); // { card, actorToken } — set when weapon card clicked, cleared on target click or cancel
  const weaponTargetRef = useRef(null); // { x, y } world coords for weapon targeting cursor

  // ── Spell system ──
  const [activeSpell, setActiveSpell] = useState(null); // { name, range, shape, radius, color, ... }
  const spellTargetRef = useRef(null); // { x, y } world coords for targeting — ref-only to avoid render storms
  const [spellEffects, setSpellEffects] = useState([]); // [{ id, x, y, spell, startTime }]
  const [actionAnims, setActionAnims] = useState([]); // [{ id, type, x, y, casterX, casterY, targetX, targetY, startTime, duration, color }]
  const triggerActionAnim = (type, token, target, color) => {
    const id = Date.now() + Math.random();
    const durations = { melee_attack:0.55, ranged_attack:0.55, dodge:0.6, dash:0.5, disengage:0.4, shove:0.45, grapple:0.6, hide:0.5, help:0.5,
      death_save_success:0.6, death_save_fail:0.6, critical_hit:0.85, miss:0.3, block:0.4, opportunity_attack:0.45,
      second_wind:0.7, action_surge:0.8, sneak_attack:0.6, divine_smite:0.8, rage:1.0,
      crossbow_bolt:0.5, arrow_shot:0.6, thrown_projectile:0.5, heavy_slash:0.6, sword_slash:0.5,
      blunt_impact:0.55, dagger_stab:0.35, spear_thrust:0.5, staff_strike:0.45 };
    const anim = { id, type, x: token?.x||0, y: token?.y||0, casterX: token?.x||0, casterY: token?.y||0,
      targetX: target?.x||token?.x||0, targetY: target?.y||token?.y||0, startTime: Date.now(), duration: durations[type]||0.5, color: color||"#ffffff" };
    setActionAnims(prev => [...prev, anim]);
    setTimeout(() => setActionAnims(prev => prev.filter(a => a.id !== id)), (durations[type]||0.5) * 1000 + 200);
  };
  const triggerMonsterActionAnim = (actionName, token, target) => {
    const vfx = typeof MONSTER_ACTION_VFX !== "undefined" ? MONSTER_ACTION_VFX[actionName] : null;
    if (vfx) {
      // Use spell effect system for area/cone effects, action anim for single-target
      if (vfx.shape === "cone" || vfx.shape === "line" || vfx.shape === "sphere") {
        const spellLike = { name: actionName, level: 0, shape: vfx.shape, radius: vfx.radius, damage: "", damageType: "", save: "", effect: vfx.effect, color: vfx.color, healing: "", concentration: false };
        const id = Date.now() + Math.random();
        setSpellEffects(prev => [...prev, { id, x: target?.x||token?.x||0, y: target?.y||token?.y||0, spell: spellLike, startTime: Date.now(), casterX: token?.x||0, casterY: token?.y||0 }]);
        setTimeout(() => setSpellEffects(prev => prev.filter(e => e.id !== id)), (vfx.duration||1.5) * 1000 + 500);
      } else {
        triggerActionAnim("melee_attack", token, target, vfx.color);
      }
    } else {
      triggerActionAnim("melee_attack", token, target);
    }
  };
  // ── Combat Roll Display (top banner) ──
  const [combatRollLog, setCombatRollLog] = useState([]); // [{ id, msg, detail, type, time }]
  const pushCombatRoll = (msg, detail, type) => {
    const id = "roll-" + Date.now() + "-" + Math.random();
    setCombatRollLog(prev => [...prev, { id, msg, detail: detail || "", type: type || "attack", time: Date.now() }]);
    setTimeout(() => setCombatRollLog(prev => prev.filter(r => r.id !== id)), 6500);
  };

  const [spellLog, setSpellLog] = useState([]); // [{ id, msg, time }]
  const [spellDC, setSpellDC] = useState(15);
  const [spellLevelFilter, setSpellLevelFilter] = useState(-1); // -1 for all
  const [spellSearchFilter, setSpellSearchFilter] = useState("");
  const [selectedSpellInfo, setSelectedSpellInfo] = useState(null); // spell object for info panel
  const [tokenPanelTab, setTokenPanelTab] = useState("stats"); // "stats" | "spells" | "config"
  const [sidePanelTab, setSidePanelTab] = useState("scenes"); // "scenes" | "tokens" | "settings"
  const [showConditionMenu, setShowConditionMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Multi-target spell system ──
  const [multiTargetSelections, setMultiTargetSelections] = useState([]); // [{tokenId, x, y}, ...]
  const [castLevel, setCastLevel] = useState(null); // Chosen spell slot level for upcasting (null = base level)


  // Get spell slots for a token based on class and level
  const getMaxSpellSlots = (cls, level) => {
    if (!cls || !level || level < 1) return {};
    const lv = Math.min(20, Math.max(1, level));
    if (cls === "Warlock") {
      const w = WARLOCK_SLOTS[lv];
      if (!w) return {};
      const slots = {};
      slots[w.level] = w.slots;
      return slots;
    }
    if (PREPARED_CASTERS.includes(cls) || ["Wizard","Sorcerer","Bard","Cleric","Druid"].includes(cls)) {
      return FULL_CASTER_SLOTS[lv] || {};
    }
    if (cls === "Paladin" || cls === "Ranger") {
      return HALF_CASTER_SLOTS[lv] || {};
    }
    if (cls === "Artificer") {
      return HALF_CASTER_SLOTS[lv] || {};
    }
    return {}; // Non-casters (Fighter, Rogue, etc.) — no slots
  };

  // Get max spell level a class/level can cast
  const getMaxSpellLevel = (cls, level) => {
    const slots = getMaxSpellSlots(cls, level);
    return Math.max(0, ...Object.keys(slots).map(Number));
  };

  // Get number of multi-targets for a spell (including upcast bonus)
  const getMultiTargetCount = (spell, castLv, charLevel) => {
    const mt = MULTI_TARGET_SPELLS[spell.name];
    if (!mt) return 1;
    if (mt.perCharLevel) {
      // Eldritch Blast — based on character level
      const thresholds = Object.keys(mt.perCharLevel).map(Number).sort((a,b) => b-a);
      for (const th of thresholds) { if ((charLevel || 1) >= th) return mt.perCharLevel[th]; }
      return 1;
    }
    const base = mt.targets || 1;
    const upcastLevels = (castLv || spell.level) - spell.level;
    return base + (mt.perUpcast || 0) * upcastLevels;
  };

  // Calculate upcast damage expression
  const getUpcastDamage = (spell, castLv) => {
    const rules = UPCAST_RULES[spell.name];
    if (!rules || !castLv || castLv <= spell.level) return spell.damage;
    const levelsAbove = castLv - spell.level;
    if (rules.bonusDice) {
      // Parse original damage and add bonus dice
      const base = spell.damage;
      const diceMatch = rules.bonusDice.match(/(\d+)d(\d+)/);
      if (diceMatch) {
        const bonusCount = parseInt(diceMatch[1]) * (rules.per2Levels ? Math.floor(levelsAbove / 2) : levelsAbove);
        if (bonusCount > 0) {
          const baseDice = base.match(/(\d+)d(\d+)/);
          if (baseDice) {
            const newCount = parseInt(baseDice[1]) + bonusCount;
            return base.replace(/\d+d\d+/, newCount + "d" + baseDice[2]);
          }
        }
      }
    }
    return spell.damage;
  };
  const getUpcastHealing = (spell, castLv) => {
    const rules = UPCAST_RULES[spell.name];
    if (!rules || !castLv || castLv <= spell.level || !rules.bonusHeal) return spell.healing;
    const levelsAbove = castLv - spell.level;
    const base = spell.healing;
    const diceMatch = rules.bonusHeal.match(/(\d+)d(\d+)/);
    if (diceMatch) {
      const baseDice = base.match(/(\d+)d(\d+)/);
      if (baseDice) {
        const newCount = parseInt(baseDice[1]) + parseInt(diceMatch[1]) * levelsAbove;
        return base.replace(/\d+d\d+/, newCount + "d" + baseDice[2]);
      }
    }
    return spell.healing;
  };




  const CLASS_RULE_MAP = {
    Barbarian: { key: "barbarian", features: [{ id: "rage", name: "Rage", type: "bonus", uses: 2, recharge: "long_rest", effect: "Enter rage for melee damage bonus and B/P/S resistance." }] },
    Bard: { key: "bard", features: [{ id: "bardic_inspiration", name: "Bardic Inspiration", type: "bonus", usesFormula: "cha_mod", recharge: "long_rest", effect: "Grant 1d6 inspiration die to an ally." }] },
    Cleric: { key: "cleric", features: [{ id: "channel_divinity", name: "Channel Divinity", type: "action", uses: 1, recharge: "short_rest", effect: "Invoke domain divinity effect." }] },
    Druid: { key: "druid", features: [{ id: "wild_shape", name: "Wild Shape", type: "action", uses: 2, recharge: "short_rest", effect: "Transform into a beast form." }] },
    Fighter: { key: "fighter", features: [{ id: "second_wind", name: "Second Wind", type: "bonus", uses: 1, recharge: "short_rest", effect: "Regain 1d10 + fighter level HP." }, { id: "action_surge", name: "Action Surge", type: "special", uses: 1, recharge: "short_rest", effect: "Take one additional action this turn." }] },
    Monk: { key: "monk", features: [{ id: "ki_points", name: "Ki Technique", type: "bonus", pool: "ki", usesFormula: "level", recharge: "short_rest", effect: "Spend 1 ki for Flurry, Patient Defense, or Step of the Wind." }] },
    Paladin: { key: "paladin", features: [{ id: "lay_on_hands", name: "Lay on Hands", type: "action", pool: "lay_on_hands", usesFormula: "level*5", recharge: "long_rest", effect: "Restore HP from your Lay on Hands pool." }] },
    Ranger: { key: "ranger", features: [{ id: "hunters_mark_tactic", name: "Hunter's Mark Tactic", type: "bonus", uses: 1, recharge: "long_rest", effect: "Mark target for added weapon damage while active." }] },
    Rogue: { key: "rogue", features: [{ id: "cunning_action_dash", name: "Cunning Action (Dash)", type: "bonus", uses: null, recharge: "at_will", effect: "Dash as a bonus action." }] },
    Sorcerer: { key: "sorcerer", features: [{ id: "metamagic_spark", name: "Metamagic Spark", type: "special", pool: "sorcery_points", usesFormula: "level", recharge: "long_rest", effect: "Spend sorcery points to modify spells." }] },
    Warlock: { key: "warlock", features: [{ id: "eldritch_burst", name: "Eldritch Focus", type: "special", uses: null, recharge: "at_will", effect: "Optimize Eldritch Blast or pact tools this turn." }] },
    Wizard: { key: "wizard", features: [{ id: "arcane_recovery", name: "Arcane Recovery", type: "special", uses: 1, recharge: "long_rest", effect: "Recover spent spell slots on a short rest." }] },
    Artificer: { key: "artificer", features: [{ id: "flash_of_genius", name: "Flash of Genius", type: "reaction", usesFormula: "int_mod", recharge: "long_rest", effect: "Add Intelligence modifier to a save/check." }] },
    "Soup Savant": { key: "soup_savant", features: [{ id: "culinary_edge", name: "Culinary Edge", type: "special", uses: null, recharge: "state", requirement: "validSoupEffectPending", effect: "Add your culinary die to one soup damage/healing roll this turn." }] },
  };

  const toClassKey = (s) => String(s || "").trim().toLowerCase().replace(/[_\s-]+/g, " ");
  const toFeatureType = (t) => {
    const x = String(t || "").toLowerCase();
    if (x.includes("bonus")) return "bonus";
    if (x.includes("reaction")) return "reaction";
    if (x.includes("special")) return "special";
    return "action";
  };
  const deriveClassRule = (className) => {
    const normalized = toClassKey(className);
    const exact = Object.keys(CLASS_RULE_MAP).find((k) => toClassKey(k) === normalized);
    if (exact) return CLASS_RULE_MAP[exact];
    const dnd = (typeof window !== "undefined" && window.DND_DATA) ? window.DND_DATA : null;
    const raw = dnd?.abilityUses?.[String(className || "").toLowerCase().replace(/\s+/g, "")] || null;
    if (!Array.isArray(raw) || !raw.length) return null;
    return {
      key: normalized.replace(/\s+/g, "_"),
      features: raw.map((u, idx) => ({
        id: (u.name || ("feature_" + idx)).toLowerCase().replace(/\W+/g, "_"),
        name: u.name || ("Feature " + (idx + 1)),
        type: toFeatureType(u.type),
        uses: typeof u.uses === "number" ? u.uses : undefined,
        usesFormula: typeof u.uses === "string" ? u.uses : undefined,
        recharge: u.recharge || "rest",
        pool: u.isPool ? ((u.name || "pool").toLowerCase().replace(/\W+/g, "_")) : undefined,
        effect: u.desc || "Class feature.",
      })),
    };
  };

  const rollExprTotal = (expr) => {
    if (!expr || typeof window.CombatEngine === "undefined") return 0;
    try { return window.CombatEngine.rollDice(expr).total || 0; } catch (_) { return 0; }
  };
  const toMod = (score) => Math.floor(((score || 10) - 10) / 2);
  const profFromLevel = (level) => (typeof window.CombatEngine !== "undefined" ? window.CombatEngine.profBonusFromLevel(level || 1) : 2);
  const distBetween = (a, b) => (typeof window.CombatEngine !== "undefined" ? window.CombatEngine.calculateDistance(a.x, a.y, b.x, b.y, gridSize) : 0);
  const hpStateLabel = (hp, maxHp) => {
    if (hp == null || maxHp == null || maxHp <= 0) return "unknown";
    const p = hp / maxHp;
    if (p > 0.9) return "uninjured";
    if (p > 0.5) return "wounded";
    if (p > 0.25) return "bloodied";
    return "near defeat";
  };

  // ── Combat Turn Phase State Machine ──
  // Phases: "start" → "act" → "resolve" → "done"
  // "start" = beginning of turn, show guidance
  // "act" = player is choosing actions
  // "resolve" = action is resolving (dice rolling, animation)
  // "done" = all resources spent, prompt end turn
  const [combatTurnPhase, setCombatTurnPhase] = useState("act");
  const [turnGuidanceMsg, setTurnGuidanceMsg] = useState(null);

  // Compute suggested next action for turn guidance
  const getTurnGuidance = (token) => {
    if (!token || !combatLive) return null;
    const ts = turnStateByToken[token.id] || defaultTurnState(token);
    const moveFt = getEffectiveMovementRemaining(token);
    const hostiles = getHostileTargets(token);
    const nearestHostile = hostiles[0] || null;
    const distToNearest = nearestHostile ? distBetween(token, nearestHostile) : Infinity;
    const reach = getThreatReachFt(token);

    // Phase: everything spent
    if (ts.actionUsed && ts.bonusActionUsed && moveFt <= 0) {
      return { phase: "done", msg: "Turn complete — all resources spent", hint: "End Turn", icon: "check", color: "#5ee09a" };
    }
    // Phase: action spent, still have movement
    if (ts.actionUsed && moveFt > 0 && distToNearest <= reach * 2) {
      return { phase: "act", msg: "Action spent — reposition or end turn", hint: "Move or End Turn", icon: "move", color: "#58aaff" };
    }
    if (ts.actionUsed && !ts.bonusActionUsed) {
      return { phase: "act", msg: "Action spent — bonus action available", hint: "Use Bonus Action or End Turn", icon: "bonus", color: "#ffa726" };
    }
    if (ts.actionUsed) {
      return { phase: "done", msg: "Action spent", hint: "End Turn", icon: "check", color: "#5ee09a" };
    }
    // Phase: has action, no target in range
    if (!ts.actionUsed && nearestHostile && distToNearest > reach) {
      return { phase: "act", msg: nearestHostile.name + " is " + Math.round(distToNearest) + " ft away", hint: "Move Closer or Use Ranged", icon: "move", color: "#58aaff" };
    }
    // Phase: has action, target in range
    if (!ts.actionUsed && nearestHostile && distToNearest <= reach) {
      return { phase: "act", msg: nearestHostile.name + " in reach", hint: "Select an Action", icon: "attack", color: "#f06858" };
    }
    // Default
    if (!ts.actionUsed) {
      return { phase: "act", msg: "Your turn", hint: "Select an Action", icon: "attack", color: "#f06858" };
    }
    return null;
  };

  const defaultTurnState = (token) => ({
    movementRemaining: token?.speed || 30,
    actionUsed: false,
    bonusActionUsed: false,
    reactionSpent: false,
    freeObjectUsed: false,
  });

  const getEffectiveMovementRemaining = (token) => {
    if (!token) return 0;
    if (getActionLockReasonForToken(token)) return 0;
    const baseBudget = combatLive
      ? (turnStateByToken[token.id]?.movementRemaining ?? token.speed ?? 30)
      : (token.speed ?? 30);
    const blocked = new Set((tokenConditions[token.id] || []).map(String));
    if (
      blocked.has("Grappled") ||
      blocked.has("Restrained") ||
      blocked.has("Paralyzed") ||
      blocked.has("Petrified") ||
      blocked.has("Stunned") ||
      blocked.has("Unconscious")
    ) {
      return 0;
    }
    return Math.max(0, Math.floor(Number(baseBudget) || 0));
  };

  const getMovementBudgetCells = (token) => Math.max(0, Math.floor(getEffectiveMovementRemaining(token) / 5));

  const buildMovementPathSegment = (fromCell, toCell) => {
    if (!fromCell || !toCell) return [];
    const segment = [];
    let x = fromCell.x;
    let y = fromCell.y;
    let guard = 0;
    while ((x !== toCell.x || y !== toCell.y) && guard < 512) {
      if (x !== toCell.x) x += Math.sign(toCell.x - x);
      if (y !== toCell.y) y += Math.sign(toCell.y - y);
      segment.push({ x, y });
      guard += 1;
    }
    return segment;
  };

  const isMovementStepBlocked = (fromCell, toCell) => {
    if (!fromCell || !toCell) return false;
    const x1 = fromCell.x * gridSize + gridSize / 2;
    const y1 = fromCell.y * gridSize + gridSize / 2;
    const x2 = toCell.x * gridSize + gridSize / 2;
    const y2 = toCell.y * gridSize + gridSize / 2;
    return (walls || []).some((wall) => {
      const wallType = WALL_TYPES[wall.type || "solid"] || WALL_TYPES.solid;
      return wallType.blocksMovement && segmentsIntersect(x1, y1, x2, y2, wall.x1, wall.y1, wall.x2, wall.y2);
    });
  };

  const getMovementCellCostFt = (cell) => {
    if (!cell) return 5;
    const terrainType = terrainCells?.[cell.x + "," + cell.y];
    const multiplier = TERRAIN_TYPES[terrainType]?.cost || 1;
    return multiplier >= 999 ? 9999 : Math.max(5, multiplier * 5);
  };

  const getMovementPathCostFt = (pathCells) => {
    if (!Array.isArray(pathCells) || !pathCells.length) return 0;
    return pathCells.reduce((sum, cell) => sum + getMovementCellCostFt(cell), 0);
  };

  const clampMovementPathToBudget = (pathCells, budgetFt) => {
    if (!Array.isArray(pathCells) || !pathCells.length) return [];
    const clamped = [];
    let spent = 0;
    for (const cell of pathCells) {
      const stepCost = getMovementCellCostFt(cell);
      if (stepCost >= 9999 || spent + stepCost > budgetFt) break;
      spent += stepCost;
      clamped.push(cell);
    }
    return clamped;
  };

  const getPartyProfile = (token) => {
    if (!token || !token.partyId) return null;
    return (party || []).find((p) => p.id === token.partyId) || null;
  };

  const normalizeOwnerTag = (value) => String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^user_/, "")
    .replace(/[^a-z0-9]+/g, "");

  const getViewerOwnerTags = () => {
    const emailLocal = String(viewerSession?.email || "").split("@")[0] || "";
    const nameParts = [viewerSession?.displayName, viewerSession?.name]
      .map(v => String(v || "").trim())
      .filter(Boolean)
      .flatMap(v => v.split(/\s+/).filter(Boolean));
    return new Set(
      [
        viewerSession?.displayName,
        viewerSession?.name,
        viewerSession?.email,
        emailLocal,
        viewerSession?.userId ? "user_" + viewerSession.userId : "",
        ...nameParts,
      ]
        .map(normalizeOwnerTag)
        .filter(Boolean)
    );
  };

  const canControlTokenForViewer = (token) => {
    if (!token) return false;
    if (viewRole === "player" && token.hidden) return false;
    if (viewRole === "dm") return true;
    if (token.tokenType !== "pc") return false;
    const owner = getPartyProfile(token)?.player || token.player || "";
    const normalizedOwner = normalizeOwnerTag(owner);
    return !!normalizedOwner && getViewerOwnerTags().has(normalizedOwner);
  };

  const builderSnapshotCacheRef = useRef({ raw: null, parsed: null });
  const getBuilderSnapshotForToken = (token, partyMember) => {
    /* 1. Direct snapshot stored on the party member (from import or sync) */
    const direct = partyMember?.snapshot || partyMember?.builderSnapshot || partyMember?.characterSnapshot;
    if (direct) return direct;

    /* 2. If the party member has a sourceCharacterId, try to load from PhmurtCharSync mailbox */
    if (partyMember?.sourceCharacterId && typeof PhmurtCharSync !== "undefined") {
      const pending = PhmurtCharSync.applyPendingUpdates([partyMember]);
      if (pending && pending[0] && pending[0]._lastSyncAt) {
        // Mailbox had data - but we need the full snapshot, not just fields
        // Try async load from PhmurtDB (will be cached after first call)
        const cacheKey = "phmurt_builder_snap_" + partyMember.sourceCharacterId;
        try {
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) return JSON.parse(cached);
        } catch (_) {}
      }
    }

    /* 3. Fallback: match by name against the active builder localStorage */
    try {
      const raw = localStorage.getItem("phmurt_builder_5e");
      if (!raw) return {};
      let parsed = builderSnapshotCacheRef.current.parsed;
      if (!parsed || builderSnapshotCacheRef.current.raw !== raw) {
        parsed = JSON.parse(raw);
        builderSnapshotCacheRef.current = { raw, parsed };
      }
      const builtName = parsed?.details?.name || "";
      if (builtName && token?.name && builtName.toLowerCase() === String(token.name).toLowerCase()) return parsed;
    } catch (_) {}
    return {};
  };

  /* Eagerly load and cache builder snapshots for all linked party members */
  const loadLinkedSnapshots = useCallback(() => {
    if (typeof PhmurtDB === "undefined" || !PhmurtDB.getSession || !PhmurtDB.getSession()) return;
    (party || []).forEach(member => {
      if (!member.sourceCharacterId) return;
      const cacheKey = "phmurt_builder_snap_" + member.sourceCharacterId;
      try { if (sessionStorage.getItem(cacheKey)) return; } catch (_) {}
      PhmurtDB.loadCharacter(member.sourceCharacterId).then(snap => {
        if (!snap) return;
        try { sessionStorage.setItem(cacheKey, JSON.stringify(snap)); } catch (_) {}
        /* Also store weapons/spells on the party member for immediate combat access */
        if (setData) {
          setData(d => ({
            ...d,
            party: (d.party || []).map(p =>
              p.sourceCharacterId === member.sourceCharacterId && !p.builderSnapshot
                ? { ...p, builderSnapshot: snap }
                : p
            ),
          }));
        }
      }).catch(() => {});
    });
  }, [party?.length]);

  useEffect(() => { loadLinkedSnapshots(); }, [loadLinkedSnapshots]);

  /* Extract weapon names from a builder snapshot for combat profile */
  const _extractWeaponsFromSnapshot = (snap) => {
    if (!snap) return [];
    const weaponTable = (window.CombatEngine && window.CombatEngine.WEAPONS) ? window.CombatEngine.WEAPONS : {};
    const knownNames = new Set(Object.keys(weaponTable));
    const weapons = [];
    /* From inventory items */
    if (Array.isArray(snap.inventoryItems)) {
      snap.inventoryItems.forEach(item => {
        if (item && item.name && knownNames.has(item.name) && item.equipped !== false) {
          weapons.push(item.name);
        }
      });
    }
    /* From weapon choices */
    if (snap.weaponChoices) {
      Object.values(snap.weaponChoices).forEach(wn => {
        if (wn && knownNames.has(wn) && !weapons.includes(wn)) weapons.push(wn);
      });
    }
    return weapons;
  };

  const getCombatProfile = (token) => {
    const p = getPartyProfile(token) || {};
    const snap = getBuilderSnapshotForToken(token, p);
    const cls = p.cls || snap.cls || token.cls || "";
    const level = p.lv || snap.level || token.level || 1;
    const spellAbilityKey = (SPELLCASTING_ABILITY[cls] || "").toLowerCase();
    const fallbackSpellMod = spellAbilityKey && (p[spellAbilityKey] != null || token[spellAbilityKey] != null) ? toMod(p[spellAbilityKey] != null ? p[spellAbilityKey] : token[spellAbilityKey]) : 0;
    const profile = {
      name: token.name,
      className: cls,
      subclass: p.subclass || p.subclassName || snap.subclass || "",
      level,
      species: p.race || p.species || snap.race || "",
      background: p.background || snap.background || "",
      abilities: {
        str: p.str != null ? p.str : token.str != null ? token.str : token.monsterData?.str != null ? token.monsterData.str : 10,
        dex: p.dex != null ? p.dex : token.dex != null ? token.dex : token.monsterData?.dex != null ? token.monsterData.dex : 10,
        con: p.con != null ? p.con : token.con != null ? token.con : token.monsterData?.con != null ? token.monsterData.con : 10,
        int: p.int != null ? p.int : token.int != null ? token.int : token.monsterData?.int != null ? token.monsterData.int : 10,
        wis: p.wis != null ? p.wis : token.wis != null ? token.wis : token.monsterData?.wis != null ? token.monsterData.wis : 10,
        cha: p.cha != null ? p.cha : token.cha != null ? token.cha : token.monsterData?.cha != null ? token.monsterData.cha : 10,
      },
      proficiencyBonus: profFromLevel(level),
      ac: token.ac || p.ac || 10,
      hp: token.hp,
      maxHp: token.maxHp,
      speed: token.speed || 30,
      initiativeBonus: toMod(p.dex != null ? p.dex : token.dex != null ? token.dex : token.monsterData?.dex),
      knownSpells: token.knownSpells || p.knownSpells || [...(snap.selectedCantrips || []), ...(snap.selectedSpells || [])],
      preparedSpells: token.preparedSpells || p.preparedSpells || [...(snap.selectedCantrips || []), ...(snap.selectedSpells || [])],
      spellSlots: token.spellSlots || p.spellSlots || getMaxSpellSlots(cls, level),
      usedSlots: token.usedSlots || p.usedSlots || {},
      spellcastingMod: token.spellcastingMod != null ? token.spellcastingMod : (p.spellcastingMod != null ? p.spellcastingMod : fallbackSpellMod),
      resources: token.classResources || p.classResources || {},
      feats: p.feats || snap.feats || [],
      passives: p.passives || snap.passiveEffects || [],
      resistances: p.resistances || snap.resistances || [],
      customFeatures: p.customFeatures || snap.customFeatures || [],
      equipment: p.equipment || snap.equipment || _extractWeaponsFromSnapshot(snap),
      conditions: tokenConditions[token.id] || [],
      concentrationSpell: token.activeConcentrationSpell || p.concentrationSpell || null,
    };
    return profile;
  };

  const getHostileTargets = (actorToken) => {
    if (!actorToken) return [];
    return (tokens || [])
      .filter((t) => {
        if (t.id === actorToken.id || (t.hp || 0) <= 0) return false;
        if (viewRole === "player" && t.hidden) return false;
        return actorToken.tokenType === "pc" ? t.tokenType !== "pc" : t.tokenType === "pc";
      })
      .sort((a, b) => distBetween(actorToken, a) - distBetween(actorToken, b));
  };

  const getNearestHostileTarget = (actorToken) => {
    const hostiles = getHostileTargets(actorToken);
    if (!hostiles.length) return null;
    return hostiles[0];
  };

  const getFocusedCombatTarget = (actorToken) => {
    const hostiles = getHostileTargets(actorToken);
    if (!hostiles.length) return null;
    const preferredId = combatTargetByActor[actorToken.id];
    return hostiles.find((t) => t.id === preferredId) || hostiles[0];
  };

  const setFocusedCombatTarget = (actorId, targetId) => {
    if (!actorId || !targetId) return;
    setCombatTargetByActor((prev) => ({ ...prev, [actorId]: targetId }));
  };

  const ensureClassResources = (token, profile) => {
    if (!token || token.tokenType !== "pc") return;
    const baseRule = deriveClassRule(profile.className) || null;
    if (!baseRule) return;
    const existing = token.classResources || {};
    const next = { ...existing };
    (baseRule.features || []).forEach((f) => {
      if (f.pool && next[f.pool] == null) {
        if (f.usesFormula === "level") next[f.pool] = profile.level;
        else if (f.usesFormula === "level*5") next[f.pool] = profile.level * 5;
        else if (f.usesFormula === "cha_mod") next[f.pool] = Math.max(1, toMod(profile.abilities.cha));
        else if (f.usesFormula === "int_mod") next[f.pool] = Math.max(1, toMod(profile.abilities.int));
      }
      if (f.id && next[f.id] == null && f.usesFormula) {
        if (f.usesFormula === "level") next[f.id] = profile.level;
        else if (f.usesFormula === "level*5") next[f.id] = profile.level * 5;
        else if (f.usesFormula === "cha_mod") next[f.id] = Math.max(1, toMod(profile.abilities.cha));
        else if (f.usesFormula === "int_mod") next[f.id] = Math.max(1, toMod(profile.abilities.int));
      }
      if (f.id && next[f.id] == null && typeof f.uses === "number") next[f.id] = f.uses;
    });
    const keys = new Set([...Object.keys(existing), ...Object.keys(next)]);
    let changed = false;
    keys.forEach((k) => {
      if (changed) return;
      if (existing[k] !== next[k]) changed = true;
    });
    if (changed) updateToken(token.id, { classResources: next });
  };

  const addStructuredCombatLog = (lineA, lineB, lineC) => {
    const row = ["Round " + round + " - " + (combatants[turn]?.name || "Combatant"), lineA || "", lineB || "", lineC || ""].filter(Boolean).join("\n");
    addCombatLogEntry({ type: "system", text: row });
  };

  const actionTypeLabel = (type) => {
    if (type === "bonus") return "Bonus Action";
    if (type === "reaction") return "Reaction";
    if (type === "legendary") return "Legendary";
    if (type === "special") return "Special";
    return "Action";
  };

  const canUseSlot = (profile, level) => {
    if (!level || level <= 0) return true;
    const max = (profile.spellSlots || {})[level] || 0;
    const used = (profile.usedSlots || {})[level] || 0;
    return max > used;
  };

  const getWeaponOptionsForProfile = (profile) => {
    const weaponTable = (window.CombatEngine && window.CombatEngine.WEAPONS) ? window.CombatEngine.WEAPONS : {};
    const knownNames = new Set(Object.keys(weaponTable));
    const fromEquipment = []
      .concat(profile?.equipment || [])
      .concat(profile?.weapons || [])
      .map((w) => (typeof w === "string" ? w : (w?.name || "")))
      .filter(Boolean)
      .map((n) => n.trim());
    const matched = Array.from(new Set(fromEquipment.filter((n) => knownNames.has(n))));
    if (matched.length) return matched;
    return [];
  };

  const getLegalActionCards = (actorToken) => {
    if (!actorToken || actorToken.tokenType !== "pc") return [];
    const actionLockReason = getActionLockReasonForToken(actorToken);
    if (actionLockReason) {
      const deathState = getDeathSaveState(actorToken);
      return [{
        id: "status_locked",
        panel: "Other",
        name: deathState.dead ? "Dead" : (deathState.stable ? "Stable" : "No Actions Available"),
        type: "special",
        range: "Self",
        roll: actorToken.hp <= 0 && actorToken.tokenType === "pc" && !deathState.dead ? "Death save at start of turn" : "none",
        effect: actionLockReason,
        cost: "None",
        outcome: actionLockReason,
        disabledReason: actionLockReason,
        resolver: "other",
        data: { kind: "status locked" },
      }];
    }
    const profile = getCombatProfile(actorToken);
    const ts = turnStateByToken[actorToken.id] || defaultTurnState(actorToken);
    const hostiles = getHostileTargets(actorToken);
    const preferredId = combatTargetByActor[actorToken.id];
    const focusTarget = hostiles.find((t) => t.id === preferredId) || hostiles[0] || null;
    const focusDist = focusTarget ? distBetween(actorToken, focusTarget) : null;
    const focusLane = focusTarget ? getLineCoverProfile(actorToken, focusTarget) : null;
    const cards = [];
    const pb = profile.proficiencyBonus;
    const strMod = toMod(profile.abilities.str);
    const dexMod = toMod(profile.abilities.dex);
    const classRule = deriveClassRule(profile.className) || null;

    const profileWeapons = getWeaponOptionsForProfile(profile);
    const sortedWeapons = [...profileWeapons].sort((a, b) => {
      const aFav = a === pcWeaponPick ? -1 : 0;
      const bFav = b === pcWeaponPick ? -1 : 0;
      if (aFav !== bFav) return aFav - bFav;
      return String(a || "").localeCompare(String(b || ""));
    });
    sortedWeapons.forEach((weaponName) => {
      const w = (window.CombatEngine && window.CombatEngine.WEAPONS && window.CombatEngine.WEAPONS[weaponName]) || null;
      if (!w) return;
      const useMod = w.properties.includes("finesse") ? Math.max(strMod, dexMod) : (w.melee ? strMod : dexMod);
      const toHit = pb + useMod;
      const damageExpr = w.damage + (useMod >= 0 ? "+" + useMod : String(useMod));
      const range = w.melee ? (w.range || 5) : (w.range || 20);
      let disabledReason = "";
      if (ts.actionUsed) disabledReason = "Action already used this turn.";
      else if (!focusTarget) disabledReason = "No hostile target available.";
      else if (focusDist > range) disabledReason = "Target is " + focusDist + " ft away. Range is " + range + " ft.";
      else if (focusLane && !focusLane.hasLineOfSight) disabledReason = "No clear line of sight to " + focusTarget.name + ".";
      cards.push({
        id: "weapon_" + weaponName.replace(/\W+/g, "_").toLowerCase(),
        panel: "Attack",
        name: weaponName + " Attack",
        type: "action",
        range,
        roll: "Attack roll",
        effect: "On hit: " + damageExpr + " " + (w.type || "").toLowerCase() + " damage.",
        cost: "Action",
        outcome: (w.melee ? "Melee weapon attack. " : "Ranged weapon attack. ") + "+" + toHit + " to hit. On hit: " + damageExpr + " " + (w.type || "").toLowerCase() + ".",
        disabledReason,
        resolver: "weapon",
        data: { weaponName, toHit, damageExpr, damageType: (w.type || "slashing").toLowerCase(), range },
      });
    });

    const spellNames = Array.from(new Set([...(profile.preparedSpells || []), ...(profile.knownSpells || [])]));
    spellNames.forEach((name) => {
      const sp = DND_SPELLS.find((s) => s.name === name);
      if (!sp) return;
      const type = String(sp.castTime || "").toLowerCase().includes("bonus") ? "bonus" : String(sp.castTime || "").toLowerCase().includes("reaction") ? "reaction" : "action";
      let disabledReason = "";
      if (type === "action" && ts.actionUsed) disabledReason = "Action already used this turn.";
      if (type === "bonus" && ts.bonusActionUsed) disabledReason = "Bonus Action already used this turn.";
      if (type === "reaction" && ts.reactionSpent) disabledReason = "Reaction already spent.";
      if (!disabledReason && sp.level > 0 && !canUseSlot(profile, sp.level)) disabledReason = "No level " + sp.level + " spell slots remaining.";
      if (!disabledReason && sp.range > 0 && sp.shape !== "self" && sp.shape !== "touch" && (sp.damage || sp.save)) {
        if (!focusTarget) disabledReason = "No hostile target available.";
        else if (focusDist > sp.range) disabledReason = "Target is " + focusDist + " ft away. Range is " + sp.range + " ft.";
        else if (focusLane && !focusLane.hasLineOfSight) disabledReason = "No clear line of sight to " + focusTarget.name + ".";
      }
      const concentrationWarn = sp.concentration && profile.concentrationSpell ? "Starting this spell will end your current concentration on " + profile.concentrationSpell + "." : "";
      cards.push({
        id: "spell_" + sp.name.replace(/\W+/g, "_").toLowerCase(),
        panel: "Spell",
        name: sp.name,
        type,
        range: sp.range > 0 ? (sp.range + " ft, " + (sp.shape === "single" ? "one creature" : sp.shape)) : (sp.shape === "self" ? "Self" : "Touch"),
        roll: sp.save ? (sp.save + " saving throw") : (sp.damage ? "Spell attack roll" : "none"),
        effect: sp.healing ? ("Restore " + sp.healing + " HP.") : (sp.damage ? ("Deal " + sp.damage + " " + sp.damageType + " damage.") : sp.description),
        cost: sp.level > 0 ? ("1 level " + sp.level + " spell slot" + (sp.concentration ? ", concentration" : "")) : (sp.concentration ? "concentration" : "none"),
        outcome: (actionTypeLabel(type) + " spell. " + (sp.range > 0 ? sp.range + " ft." : "Self/Touch.")) + " " + (sp.healing ? ("Restore " + sp.healing + " HP.") : (sp.damage ? ("Deal " + sp.damage + ".") : sp.description)),
        disabledReason,
        concentrationWarn,
        resolver: "spell",
        data: { spell: sp },
      });
    });

    // Merge CLASS_RULE_MAP features + CLASS_FEATURES_BY_LEVEL (level-based) + custom features
    const levelFeatures = typeof getClassFeaturesUpToLevel === "function" ? getClassFeaturesUpToLevel(profile.className || actorToken.class || actorToken.cls, profile.level || actorToken.level || 1) : [];
    const ruleFeatures = classRule?.features || [];
    // Deduplicate: level features override rule features by id
    const levelIds = new Set(levelFeatures.map(f => f.id));
    const mergedBase = [...levelFeatures, ...ruleFeatures.filter(f => !levelIds.has(f.id))];
    // Filter out passive features (not actionable in combat) and only keep usable features
    const actionableFeatures = mergedBase.filter(f => f.type !== "passive" && f.type !== "resource");
    const classFeatures = [...actionableFeatures, ...((profile.customFeatures || []).map((f, idx) => ({
      id: f.id || ("custom_" + idx),
      name: f.name || ("Custom Feature " + (idx + 1)),
      type: f.type || "special",
      uses: f.uses,
      recharge: f.recharge || "rest",
      effect: f.effectText || f.effect || f.desc || "Custom class feature.",
      requirement: f.requirement,
    })))];

    classFeatures.forEach((f) => {
      let disabledReason = "";
      const res = profile.resources || {};
      const useType = f.type === "bonus" ? "bonus" : f.type === "reaction" ? "reaction" : f.type === "special" ? "special" : "action";
      if (useType === "action" && ts.actionUsed) disabledReason = "Action already used this turn.";
      if (useType === "bonus" && ts.bonusActionUsed) disabledReason = "Bonus Action already used this turn.";
      if (useType === "reaction" && ts.reactionSpent) disabledReason = "Reaction already spent.";
      if (!disabledReason && f.requirement === "validSoupEffectPending" && !actorToken.validSoupEffectPending) disabledReason = "Only usable when a valid soup effect is being resolved.";
      if (!disabledReason && f.id && typeof f.uses === "number" && (res[f.id] || 0) <= 0) disabledReason = "No uses remaining. Refresh on " + (f.recharge || "rest").replace("_", " ") + ".";
      if (!disabledReason && f.id && f.usesFormula && (res[f.id] || 0) <= 0) disabledReason = "No uses remaining. Refresh on " + (f.recharge || "rest").replace("_", " ") + ".";
      if (!disabledReason && f.pool && (res[f.pool] || 0) <= 0) disabledReason = "No uses remaining. Refresh on " + (f.recharge || "rest").replace("_", " ") + ".";
      cards.push({
        id: "feature_" + f.id,
        panel: "Class Feature",
        name: f.name,
        type: useType,
        range: "Self",
        roll: f.pool ? "resource roll / spend" : "none",
        effect: f.effect,
        cost: f.pool ? ("Spend from " + f.pool + " pool") : (f.uses != null ? String(f.uses) + " use(s)" : (f.usesFormula ? ("Uses scale with " + f.usesFormula.replace("_", " ")) : "none")),
        outcome: f.effect,
        disabledReason,
        resolver: "feature",
        data: { feature: f },
      });
    });

    const utilityActions = [
      { name: "Dash", type: "action", range: "Self", effect: "Gain extra movement equal to your speed this turn.", cost: "Action", needsFocus: false },
      { name: "Disengage", type: "action", range: "Self", effect: "Movement does not provoke opportunity attacks this turn.", cost: "Action", needsFocus: false },
      { name: "Dodge", type: "action", range: "Self", effect: "Attackers have disadvantage against you until your next turn.", cost: "Action", needsFocus: false },
      { name: "Help", type: "action", range: "5 ft", effect: "Assist a nearby creature and grant advantage on its next check or attack.", cost: "Action", needsFocus: true, rangeLimit: 5 },
      { name: "Hide", type: "action", range: "Self", effect: "Make a Dexterity (Stealth) check and attempt to become hidden.", cost: "Action", needsFocus: false },
      { name: "Ready", type: "action", range: "Self", effect: "Prepare an action to trigger later and reserve your reaction.", cost: "Action + Reaction setup", needsFocus: false },
      { name: "Search", type: "action", range: "Self", effect: "Make a Wisdom (Perception) or Intelligence (Investigation) check.", cost: "Action", needsFocus: false },
      { name: "Use an Object", type: "action", range: "Touch", effect: "Use an object that requires your action, such as a potion or lever.", cost: "Action", needsFocus: false },
      { name: "Grapple", type: "action", range: "5 ft", effect: "Contest Athletics vs Athletics/Acrobatics to grapple a creature.", cost: "Action", needsFocus: true, rangeLimit: 5 },
      { name: "Shove", type: "action", range: "5 ft", effect: "Contest Athletics vs Athletics/Acrobatics to knock prone or push 5 ft.", cost: "Action", needsFocus: true, rangeLimit: 5 },
      { name: "Offhand Attack", type: "bonus", range: "5 ft", effect: "Strike with a light offhand weapon as a bonus action.", cost: "Bonus Action", needsFocus: true, rangeLimit: 5 },
      { name: "Interact with Object", type: "special", range: "Touch", effect: "Use your free object interaction this turn.", cost: "Free Object Interaction", needsFocus: false },
      { name: "Communicate", type: "special", range: "Self", effect: "Speak a short battle command, warning, or signal.", cost: "Free", needsFocus: false },
      { name: "Drop Prone", type: "special", range: "Self", effect: "Drop prone immediately.", cost: "Free", needsFocus: false },
      { name: "Drop Item", type: "special", range: "Self", effect: "Release a held item.", cost: "Free", needsFocus: false },
    ];
    utilityActions.forEach((entry) => {
      let disabledReason = "";
      if (entry.type === "action" && ts.actionUsed) disabledReason = "Action already used this turn.";
      else if (entry.type === "bonus" && ts.bonusActionUsed) disabledReason = "Bonus Action already used this turn.";
      else if (entry.name === "Interact with Object" && ts.freeObjectUsed) disabledReason = "Free object interaction already used this turn.";
      else if (entry.name === "Ready" && ts.reactionSpent) disabledReason = "Reaction already spent, so you cannot ready a trigger this turn.";
      else if (entry.needsFocus && !focusTarget) disabledReason = "No hostile target available.";
      else if (entry.needsFocus && entry.rangeLimit && focusDist != null && focusDist > entry.rangeLimit) disabledReason = "Target is " + focusDist + " ft away. Range is " + entry.rangeLimit + " ft.";
      else if (entry.needsFocus && focusLane && !focusLane.hasLineOfSight) disabledReason = "No clear line of sight to " + focusTarget.name + ".";
      cards.push({
        id: "other_" + entry.name.replace(/\W+/g, "_").toLowerCase(),
        panel: "Other",
        name: entry.name,
        type: entry.type,
        range: entry.range,
        roll: "none",
        effect: entry.effect,
        cost: entry.cost,
        outcome: entry.effect,
        disabledReason,
        resolver: "other",
        data: { kind: entry.name.toLowerCase(), rangeLimit: entry.rangeLimit || null, needsFocus: !!entry.needsFocus },
      });
    });

    // ── BG3: Divine Smite (Paladin) ──
    const cls = (profile.className || "").toLowerCase();
    if (cls.includes("paladin") && profile.spellSlots) {
      for (let slotLvl = 1; slotLvl <= 5; slotLvl++) {
        const maxSlot = (profile.spellSlots || {})[slotLvl] || 0;
        const usedSlot = (profile.usedSlots || {})[slotLvl] || 0;
        if (usedSlot >= maxSlot) continue;
        const smiteDice = Math.min(5, 1 + slotLvl);
        cards.push({
          id: "smite_lv" + slotLvl,
          panel: "Class Feature",
          name: "Divine Smite (Lv" + slotLvl + ")",
          type: "special",
          range: "Melee",
          roll: smiteDice + "d8 radiant",
          effect: "On your next melee hit, deal " + smiteDice + "d8 extra radiant damage (+1d8 vs undead/fiend). Costs 1 level " + slotLvl + " spell slot.",
          cost: "Level " + slotLvl + " slot (" + (maxSlot - usedSlot) + " left)",
          outcome: "Extra " + smiteDice + "d8 radiant damage on melee hit.",
          disabledReason: ts.actionUsed ? "Attack action already used. Smite applies on hit." : (!focusTarget ? "No hostile target available." : ""),
          resolver: "smite",
          data: { slotLevel: slotLvl, smiteDice },
        });
      }
    }

    // ── BG3: Action Surge (Fighter) ──
    if (cls.includes("fighter") && (profile.level || 1) >= 2) {
      const CE = window.CombatEngine;
      const maxCharges = CE ? CE.getActionSurgeCharges(profile.level || 1) : 1;
      const usedSurge = (actorToken.classResources || {}).actionSurge || 0;
      const surgeLeft = maxCharges - usedSurge;
      cards.push({
        id: "feature_action_surge",
        panel: "Class Feature",
        name: "Action Surge",
        type: "special",
        range: "Self",
        roll: "none",
        effect: "Take an additional action this turn. " + surgeLeft + "/" + maxCharges + " charges remaining.",
        cost: "1 charge (recharges on short rest)",
        outcome: "Gain an extra action this turn.",
        disabledReason: surgeLeft <= 0 ? "No Action Surge charges remaining." : "",
        resolver: "actionSurge",
        data: { maxCharges },
      });
    }

    // ── BG3: Rage (Barbarian) ──
    if (cls.includes("barbarian")) {
      const CE = window.CombatEngine;
      const isRaging = getMergedConditionsForToken(actorToken).includes("Raging");
      const rageDmg = CE ? CE.getRageDamage(profile.level || 1) : 2;
      const maxRages = CE ? CE.getRageCharges(profile.level || 1) : 2;
      const usedRages = (actorToken.classResources || {}).rage || 0;
      const ragesLeft = maxRages === Infinity ? "∞" : (maxRages - usedRages);
      cards.push({
        id: "feature_rage",
        panel: "Class Feature",
        name: isRaging ? "End Rage" : "Rage",
        type: "bonus",
        range: "Self",
        roll: "none",
        effect: isRaging
          ? "End your rage."
          : "+" + rageDmg + " melee damage, resist B/P/S, advantage on STR checks/saves. " + ragesLeft + " rages left.",
        cost: isRaging ? "Free" : "Bonus Action + 1 rage charge",
        outcome: isRaging ? "Rage ends." : "Gain Raging condition. +" + rageDmg + " melee damage.",
        disabledReason: !isRaging && ts.bonusActionUsed ? "Bonus Action already used this turn." : (!isRaging && ragesLeft <= 0 ? "No rage charges remaining." : ""),
        resolver: "rage",
        data: { rageDmg, isRaging },
      });
    }

    return cards;
  };

  const openCombatSidebar = (tabId) => {
    setSidebarOpen(true);
    setMode("combat");
    setCombatTab(tabId || "tracker");
  };

  const getCombatEntrySummary = (entry) => {
    const maskHiddenNames = (text) => {
      if (!text || viewRole !== "player") return text || "";
      let masked = String(text);
      (tokens || []).forEach((token) => {
        const tokenName = String(token?.name || "").trim();
        if (!token?.hidden || tokenName.length < 2) return;
        const pattern = new RegExp("\\b" + tokenName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g");
        masked = masked.replace(pattern, "Hidden Creature");
      });
      return masked;
    };
    if (!entry) return "No combat results yet.";
    if (entry.text) return maskHiddenNames(entry.text);
    if (entry.type === "attack") return maskHiddenNames((entry.isCrit ? "Critical hit: " : "Hit: ") + entry.attacker + " -> " + entry.target);
    if (entry.type === "miss") return maskHiddenNames(entry.attacker + " misses " + entry.target);
    if (entry.type === "save") return maskHiddenNames(entry.target + (entry.success ? " saves" : " fails") + " vs " + entry.action);
    return "Combat update.";
  };

  const getCombatEntryDetails = (entry) => {
    if (!entry) return "";
    if (entry.type === "attack" || entry.type === "miss") {
      const rollText = entry.roll ? "Roll " + (entry.roll.chosen ?? "?") + " + " + (entry.roll.modifier ?? 0) + " = " + (entry.roll.total ?? "?") : "";
      const damageText = entry.damage ? String(entry.damage) + " damage" : "";
      return [entry.action, rollText, damageText].filter(Boolean).join(" | ");
    }
    if (entry.type === "save") {
      return [
        entry.action,
        entry.dc ? ("DC " + entry.dc + " " + (entry.ability || "")) : "",
        entry.damage ? (String(entry.damage) + " damage") : "",
        entry.conditions?.length ? ("Conditions: " + entry.conditions.join(", ")) : "",
      ].filter(Boolean).join(" | ");
    }
    return "";
  };

  const getQuickActionScore = (item) => {
    if (!item) return 0;
    const disabled = !!(item.disabledReason || item.disabled);
    if (item.panel === "Attack") return disabled ? 78 : 98;
    if (item.panel === "Spell") {
      if (/heal|restore|cure/i.test(item.effect || "")) return disabled ? 72 : 92;
      return disabled ? 68 : 88;
    }
    if (item.panel === "Class Feature") return disabled ? 60 : 82;
    if (item.panel === "Legendary") return disabled ? 54 : 90;
    if (item.panel === "Multiattack") return disabled ? 66 : 96;
    if (item.panel === "Save / AoE") return disabled ? 62 : 86;
    return disabled ? 40 : 70;
  };

  const getActionPanelMeta = (panelName) => {
    if (panelName === "Attack" || panelName === "Multiattack") return { tone: "#f06858", icon: Swords };
    if (panelName === "Spell" || panelName === "Save / AoE") return { tone: "#b574ff", icon: Wand2 };
    if (panelName === "Class Feature" || panelName === "Legendary") return { tone: "#ffd54f", icon: Star };
    return { tone: "#58aaff", icon: Compass };
  };

  const inferMonsterActionPanel = (action, isLegendary) => {
    if (isLegendary) return "Legendary";
    if (!action) return "Utility";
    if (String(action.name || "").toLowerCase() === "multiattack") return "Multiattack";
    const CE = window.CombatEngine;
    if (CE?.parseAttackAction && CE.parseAttackAction(action)) return "Attack";
    if (CE?.parseSaveAction && CE.parseSaveAction(action)) return "Save / AoE";
    return "Utility";
  };

  const rollTokenIntoInitiative = (token) => {
    if (!token) return;
    const profile = getCombatProfile(token);
    const initBonus = token.monsterData
      ? Math.floor(((token.monsterData.dex || 10) - 10) / 2)
      : (profile?.initiativeBonus ?? toMod(token.dex));
    const initRoll = typeof window.CombatEngine !== "undefined"
      ? window.CombatEngine.rollInitiative(initBonus).total
      : Math.floor(Math.random() * 20) + 1 + initBonus;
    const row = {
      id: "cb-" + token.id,
      mapTokenId: token.id,
      name: token.name,
      init: initRoll,
      hp: token.hp || 0,
      maxHp: token.maxHp || token.hp || 0,
      ac: token.ac || profile?.ac || 10,
      type: token.tokenType === "pc" ? "pc" : (token.tokenType === "npc" ? "npc" : "enemy"),
      color: token.color,
    };
    const currentTokenId = combatLive ? (combatants[turn]?.mapTokenId || token.id) : token.id;
    const initiativePool = combatLive ? [...combatants.filter(c => c.mapTokenId !== token.id), row] : [row];
    const sortedRows = initiativePool
      .sort((a, b) => (b.init || 0) - (a.init || 0) || String(a.name || "").localeCompare(String(b.name || "")));
    const nextTurnIdx = Math.max(0, sortedRows.findIndex(c => c.mapTokenId === currentTokenId));
    setCombatants(sortedRows);
    setTurn(nextTurnIdx);
    if (!combatLive) {
      setRound(1);
      setTurnStateByToken({});
      setCombatTargetByActor({});
      setConditions({});
      setPlayModeResolution(null);
    }
    setCombatLive(true);
    setTurnStateByToken((prev) => ({ ...prev, [token.id]: prev[token.id] || defaultTurnState(token) }));
    setSelectedTokenId(token.id);
    addCombatLogEntry({
      type: "system",
      text: token.name + " rolls initiative " + initRoll + " (" + (initBonus >= 0 ? "+" : "") + initBonus + " DEX)",
    });
    setPlayModeResolution({
      title: "Initiative: " + token.name,
      lines: [
        "Rolled " + initRoll + " total.",
        "Initiative modifier: " + (initBonus >= 0 ? "+" : "") + initBonus + " DEX.",
        "Added to the tracker on the right.",
      ],
    });
    openCombatSidebar("tracker");
  };

  const getPopupQuickActions = (actorToken) => {
    if (!actorToken) return [];
    if (actorToken.tokenType === "pc") {
      return [...getLegalActionCards(actorToken)]
        .sort((a, b) => getQuickActionScore(b) - getQuickActionScore(a))
        .map(card => ({
          id: card.id,
          key: "pc-" + card.id,
          panel: card.panel,
          actionType: card.type,
          label: card.name,
          helper: card.disabledReason || card.outcome || card.effect || actionTypeLabel(card.type),
          effect: card.effect || card.outcome || "",
          cost: card.cost || actionTypeLabel(card.type),
          range: card.range || "Self",
          disabled: !!card.disabledReason,
          data: card.data || null,
          tone: getActionPanelMeta(card.panel).tone,
          icon: getActionPanelMeta(card.panel).icon,
          onClick: () => {
            if (card.resolver === "weapon") {
              // Always enter targeting mode — user clicks a target to resolve
              setActiveWeapon({ card, actorToken });
              weaponTargetRef.current = null;
              dismissTurnPopup(); // Must dismiss popup so canvas receives clicks
              setShowConditionMenu(false);
              return;
            }
            if (card.resolver === "spell" && card.data?.spell && !card.data.spell.healing && card.data.spell.shape !== "self") {
              // Offensive/targeted spells also enter targeting mode
              setActiveWeapon({ card, actorToken });
              weaponTargetRef.current = null;
              dismissTurnPopup(); // Must dismiss popup so canvas receives clicks
              setShowConditionMenu(false);
              return;
            }
            resolvePlayModeCard(card, actorToken);
            openCombatSidebar("tracker");
            if (!combatLive) dismissTurnPopup();
            else setShowConditionMenu(false);
          },
        }));
    }
    const md = actorToken.monsterData;
    const actionLockReason = getActionLockReasonForToken(actorToken);
    const legendaryRemaining = getLegendaryActionRemaining(actorToken);
    const lairAvailable = canUseLairSurgeForToken(actorToken);
    const monsterActions = []
      .concat((md?.actions || []).map((action) => ({ action, isLegendary: false })))
      .concat((md?.legendaryActions || []).map((action) => ({ action: { ...action, _isLegendary: true }, isLegendary: true })))
      .concat((md?.legendaryActions?.length ? [{
        action: {
          name: "Lair Surge",
          desc: "Trigger a once-per-round lair or regional effect from your encounter notes. Best used around initiative 20 or between turns.",
          _isLair: true,
        },
        isLegendary: false,
        isLair: true,
      }] : []));
    const ts = turnStateByToken[actorToken.id] || defaultTurnState(actorToken);
    if (!monsterActions.length) {
      return [{
        key: "roll-d20",
        panel: "Utility",
        actionType: "special",
        label: "Roll d20 Check",
        helper: actionLockReason || "Quick GM roll for this token.",
        effect: "Quick GM roll for this token.",
        cost: "Free",
        range: "Self",
        disabled: !!actionLockReason,
        tone: "#b574ff",
        icon: Dice6,
        onClick: () => {
          rollAttack(actorToken.id);
          addCombatLogEntry({ type: "system", text: actorToken.name + " makes a quick d20 roll." });
          openCombatSidebar(combatLive ? "tracker" : "log");
          if (!combatLive) dismissTurnPopup();
          else setShowConditionMenu(false);
        },
      }];
    }
    return monsterActions
      .map((item, ai) => {
      const action = item.action;
      const focusTarget = getFocusedCombatTarget(actorToken);
      const focusDist = focusTarget ? distBetween(actorToken, focusTarget) : null;
      const focusLane = focusTarget ? getLineCoverProfile(actorToken, focusTarget) : null;
      const CE = window.CombatEngine;
      const parsedAttack = CE?.parseAttackAction ? CE.parseAttackAction(action) : null;
      const parsedSave = !parsedAttack && CE?.parseSaveAction ? CE.parseSaveAction(action) : null;
      const panel = item.isLair ? "Legendary" : inferMonsterActionPanel(action, item.isLegendary);
      const legendaryCost = item.isLegendary ? getLegendaryActionCost(action) : 0;
      const actionText = String(action?.desc || "");
      const needsTarget = !item.isLair && !!(
        parsedAttack ||
        parsedSave ||
        (/one target|target creature|creature it can see|target/i.test(actionText) && !/itself|self|assumes the form|magically polymorphs/i.test(actionText))
      );
      const actionRange = parsedAttack?.reach || parsedAttack?.range?.short || parsedAttack?.range || parsedSave?.radius || parsedSave?.length || null;
      const rangeLabel = parsedAttack?.reach
        ? (parsedAttack.reach + " ft reach")
        : parsedAttack?.range?.short
          ? (parsedAttack.range.short + " ft range")
          : parsedAttack?.range
            ? (parsedAttack.range + " ft range")
            : parsedSave?.radius
              ? (parsedSave.radius + " ft " + parsedSave.shape)
              : parsedSave?.length
                ? (parsedSave.length + " ft " + parsedSave.shape)
                : "Uses stat block text";
      let disabledReason = "";
      if (actionLockReason) {
        disabledReason = actionLockReason;
      } else if (item.isLair && !lairAvailable) {
        disabledReason = Number(actorToken.lairActionRoundUsed || 0) === round
          ? "Lair Surge has already been used this round."
          : "Only the DM can trigger this lair timing hook during combat.";
      } else if (item.isLegendary && combatLive && actorToken.id === activeCombatantId) {
        disabledReason = "Legendary actions happen at the end of another creature's turn.";
      } else if (item.isLegendary && legendaryRemaining < legendaryCost) {
        disabledReason = "Only " + legendaryRemaining + "/" + getLegendaryActionMax(actorToken) + " legendary action point(s) remain.";
      } else if (!item.isLegendary && !item.isLair && combatLive && actorToken.id !== activeCombatantId) {
        disabledReason = "Standard actions only unlock on this monster's own turn.";
      } else if (!item.isLegendary && !item.isLair && ts.actionUsed) {
        disabledReason = "Action already used this turn.";
      } else if (needsTarget && !focusTarget) {
        disabledReason = "No hostile focus target available.";
      } else if (needsTarget && actionRange && focusDist != null && focusDist > actionRange && parsedAttack) {
        disabledReason = "Target is " + focusDist + " ft away. Range is " + actionRange + " ft.";
      } else if (needsTarget && focusLane && !focusLane.hasLineOfSight) {
        disabledReason = "No clear line of sight to " + focusTarget.name + ".";
      }
      const helperText = disabledReason || (
        item.isLair
          ? "Spend the round's lair hook now. DM chooses the terrain/hazard effect."
          : focusTarget
            ? (focusTarget.name + " - " + rangeLabel + (focusDist != null ? " - " + focusDist + " ft away" : "") + (focusLane?.coverACBonus ? " - " + (focusLane.coverLabel || "cover") + " +" + focusLane.coverACBonus + " AC" : ""))
            : rangeLabel
      );
      const summaryText = actionText.trim();
      return {
        key: (item.isLegendary ? "legendary-" : "monster-") + ai,
        panel,
        actionType: item.isLegendary ? "legendary" : item.isLair ? "special" : "action",
        label: item.isLegendary ? (action.name + " (Legendary)") : action.name,
        helper: helperText,
        effect: summaryText || "Resolve from monster stat block.",
        cost: item.isLegendary ? ("Legendary " + legendaryCost + "/" + getLegendaryActionMax(actorToken)) : item.isLair ? "1 / round" : "Action",
        range: rangeLabel,
        disabled: !!disabledReason,
        tone: getActionPanelMeta(panel).tone,
        icon: getActionPanelMeta(panel).icon,
        onClick: () => {
          if (item.isLair) {
            resolveLairSurgeForToken(actorToken);
            openCombatSidebar("tracker");
            setShowConditionMenu(false);
            return;
          }
          if (needsTarget) {
            // Enter targeting mode — DM clicks a target token to resolve
            const monsterCard = {
              id: "monster-" + action.name + "-" + Date.now(),
              name: action.name,
              label: action.name,
              resolver: "monster-action",
              data: { action, isLegendary: item.isLegendary, legendaryCost, summaryText },
            };
            setActiveWeapon({ card: monsterCard, actorToken });
            weaponTargetRef.current = null;
            dismissTurnPopup(); // Must dismiss popup so canvas receives clicks
            setShowConditionMenu(false);
            return;
          }
          // Self-target actions (utility, lair actions without target) resolve immediately
          const didResolve = executeCombatAction(actorToken.id, actorToken.id, action);
          if (!didResolve) {
            openCombatSidebar("tracker");
            setShowConditionMenu(false);
            return;
          }
          triggerMonsterActionAnim(action.name, actorToken, actorToken);
          if (item.isLegendary) {
            updateToken(actorToken.id, {
              legendaryActionMax: getLegendaryActionMax(actorToken),
              legendaryActionChargesRemaining: Math.max(0, getLegendaryActionRemaining(actorToken) - legendaryCost),
            });
          }
          if (!item.isLegendary && !item.isLair) spendEconomy(actorToken.id, "action");
          setPlayModeResolution({
            title: action.name,
            lines: [
              actorToken.name + " uses " + action.name + ".",
              summaryText ? summaryText.slice(0, 220) + (summaryText.length > 220 ? "..." : "") : "Resolved from the monster's stat block.",
              "Result added to the combat feed.",
            ],
          });
          openCombatSidebar("tracker");
          if (!combatLive) dismissTurnPopup();
          else setShowConditionMenu(false);
        },
      };
      })
      .sort((a, b) => getQuickActionScore(b) - getQuickActionScore(a));
  };

  // ── Maps & Scenes system ──
  // A "map" is a top-level world (e.g., Swordcoast) with a bg image. Each map has "scenes" — sub-areas.
  // Each scene stores its own tokens, fog, drawings, walls, terrain, props, bgImage, camera position.
  const [battleMaps, setBattleMaps] = useState([]);   // [{ id, name, bgSrc, scenes:[], regionMarkers:[] }]
  const [activeMapId, setActiveMapId] = useState(null);
  const [activeSceneId, setActiveSceneId] = useState(null);
  const [showScenePanel, setShowScenePanel] = useState(false); // toggle scenes list in sidebar
  const [editingRegionMarker, setEditingRegionMarker] = useState(null); // for placing scene hotspots on the map
  const sceneImgInputRef = useRef(null);
  const mapImgInputRef = useRef(null);

  const getActiveMap = () => battleMaps.find(m => m.id === activeMapId) || null;
  const getActiveScene = () => {
    const map = getActiveMap();
    return map ? (map.scenes || []).find(s => s.id === activeSceneId) : null;
  };

  // Save current canvas state into a scene snapshot
  const captureSceneState = () => ({
    tokens: JSON.parse(JSON.stringify(tokens)),
    drawings: JSON.parse(JSON.stringify(drawings)),
    fogCells: JSON.parse(JSON.stringify(fogCells)),
    walls: JSON.parse(JSON.stringify(walls)),
    terrainCells: JSON.parse(JSON.stringify(terrainCells)),
    props: JSON.parse(JSON.stringify(props)),
    bgColor, gridSize, showGrid, zoom, pan: {...pan},
    conditions: JSON.parse(JSON.stringify(conditions)),
    tokenConditions: JSON.parse(JSON.stringify(tokenConditions)),
    combatants: JSON.parse(JSON.stringify(combatants)),
    turnStateByToken: JSON.parse(JSON.stringify(turnStateByToken)),
    combatTargetByActor: JSON.parse(JSON.stringify(combatTargetByActor)),
    playModeResolution: JSON.parse(JSON.stringify(playModeResolution)),
    combatLog: JSON.parse(JSON.stringify(combatLog)),
    combatLive, turn, round,
  });

  // Load a scene snapshot onto the canvas
  const loadSceneState = (state) => {
    if (!state) return;
    setTokens(state.tokens || []);
    setDrawings(state.drawings || []);
    setFogCells(state.fogCells || {});
    setWalls(state.walls || []);
    setTerrainCells(state.terrainCells || {});
    setProps(state.props || []);
    setBgColor(state.bgColor || cssVar("--bg") || "#10101e");
    if (state.gridSize) setGridSize(state.gridSize);
    if (state.showGrid !== undefined) setShowGrid(state.showGrid);
    if (state.zoom) setZoom(state.zoom);
    if (state.pan) setPan(state.pan);
    setConditions(state.conditions || {});
    setTokenConditions(state.tokenConditions || {});
    if (state.combatants) setCombatants(state.combatants);
    setTurnStateByToken(state.turnStateByToken || {});
    setCombatTargetByActor(state.combatTargetByActor || {});
    setPlayModeResolution(state.playModeResolution || null);
    setCombatLog(state.combatLog || []);
    if (state.combatLive !== undefined) setCombatLive(state.combatLive);
    if (state.turn !== undefined) setTurn(state.turn);
    if (state.round !== undefined) setRound(state.round);
  };

  // Save current state into the active scene, then switch to a new scene
  const saveAndSwitchScene = (mapId, sceneId) => {
    // Save current scene state
    if (activeMapId && activeSceneId) {
      setBattleMaps(prev => prev.map(m => {
        if (m.id !== activeMapId) return m;
        return {...m, scenes: (m.scenes || []).map(s => {
          if (s.id !== activeSceneId) return s;
          return {...s, state: captureSceneState()};
        })};
      }));
    }
    // Load new scene
    const map = battleMaps.find(m => m.id === mapId);
    if (map) {
      const scene = (map.scenes || []).find(s => s.id === sceneId);
      if (scene) {
        // Load scene bg image
        if (scene.bgSrc) {
          const img = new Image();
          img.onload = () => setBgImage(img);
          img.src = scene.bgSrc;
        } else {
          setBgImage(null);
        }
        if (scene.state) loadSceneState(scene.state);
        else {
          // Fresh scene — clear everything
          setTokens([]); setDrawings([]); setFogCells({}); setWalls([]); setTerrainCells({}); setProps([]);
          setCombatants([]); setCombatLive(false); setTurn(0); setRound(1);
          setTurnStateByToken({}); setCombatTargetByActor({}); setPlayModeResolution(null);
          setConditions({}); setTokenConditions({});
          setZoom(1); setPan({x:0,y:0});
        }
      }
    }
    setActiveMapId(mapId);
    setActiveSceneId(sceneId);
  };

  // Switch to map overview (region marker view)
  const switchToMapOverview = (mapId) => {
    // Save current scene first
    if (activeMapId && activeSceneId) {
      setBattleMaps(prev => prev.map(m => {
        if (m.id !== activeMapId) return m;
        return {...m, scenes: (m.scenes || []).map(s => {
          if (s.id !== activeSceneId) return s;
          return {...s, state: captureSceneState()};
        })};
      }));
    }
    const map = battleMaps.find(m => m.id === mapId);
    if (map && map.bgSrc) {
      const img = new Image();
      img.onload = () => setBgImage(img);
      img.src = map.bgSrc;
    } else {
      setBgImage(null);
    }
    setTokens([]); setDrawings([]); setFogCells({}); setWalls([]); setTerrainCells({}); setProps([]);
    setCombatants([]); setCombatLive(false); setTurn(0); setRound(1);
    setTurnStateByToken({}); setCombatTargetByActor({}); setPlayModeResolution(null);
    setConditions({}); setTokenConditions({});
    setZoom(1); setPan({x:0,y:0});
    setActiveMapId(mapId);
    setActiveSceneId(null);
  };

  const createMap = (name) => {
    const id = "map-" + Date.now();
    setBattleMaps(prev => [...prev, { id, name, bgSrc: null, scenes: [], regionMarkers: [] }]);
    return id;
  };

  const createScene = (mapId, name) => {
    const id = "scene-" + Date.now();
    setBattleMaps(prev => prev.map(m => {
      if (m.id !== mapId) return m;
      return {...m, scenes: [...(m.scenes || []), { id, name, bgSrc: null, state: null }]};
    }));
    return id;
  };

  const deleteScene = (mapId, sceneId) => {
    setBattleMaps(prev => prev.map(m => {
      if (m.id !== mapId) return m;
      return {
        ...m,
        scenes: (m.scenes || []).filter(s => s.id !== sceneId),
        regionMarkers: (m.regionMarkers || []).filter(r => r.sceneId !== sceneId),
      };
    }));
    if (activeSceneId === sceneId) { setActiveSceneId(null); }
  };

  const deleteMap = (mapId) => {
    setBattleMaps(prev => prev.filter(m => m.id !== mapId));
    if (activeMapId === mapId) { setActiveMapId(null); setActiveSceneId(null); }
  };

  // Add a region marker (clickable hotspot on the map overview that links to a scene)
  const addRegionMarker = (mapId, sceneId, x, y, label) => {
    setBattleMaps(prev => prev.map(m => {
      if (m.id !== mapId) return m;
      return {...m, regionMarkers: [...(m.regionMarkers || []), { sceneId, x, y, label: label || "Scene" }]};
    }));
  };

  const removeRegionMarker = (mapId, sceneId) => {
    setBattleMaps(prev => prev.map(m => {
      if (m.id !== mapId) return m;
      return {...m, regionMarkers: (m.regionMarkers || []).filter(r => r.sceneId !== sceneId)};
    }));
  };

  // ── Props system (placeable images on the map) ──
  const [props, setProps] = useState([]); // [{ id, src, x, y, width, height, rotation, layer, name, locked }]
  const [selectedPropId, setSelectedPropId] = useState(null);
  const [propDrag, setPropDrag] = useState(null); // { propId, startX, startY, propStartX, propStartY }
  const [propResize, setPropResize] = useState(null); // { propId, corner, startX, startY }
  const propImgInputRef = useRef(null);
  const propImagesCache = useRef({});

  const addProp = (src, name) => {
    const img = new Image();
    img.onload = () => {
      const id = "prop-" + Date.now();
      const cx = (canvasRef.current?.width / 2 - pan.x) / zoom;
      const cy = (canvasRef.current?.height / 2 - pan.y) / zoom;
      const scale = Math.min(gridSize * 4 / img.width, gridSize * 4 / img.height, 1);
      propImagesCache.current[id] = img;
      setProps(prev => [...prev, { id, src, x: cx - (img.width * scale) / 2, y: cy - (img.height * scale) / 2, width: img.width * scale, height: img.height * scale, rotation: 0, layer: "above", name: name || "Prop", locked: false }]);
      setSelectedPropId(id);
    };
    img.src = src;
  };

  const updateProp = (id, updates) => {
    setProps(prev => prev.map(p => p.id === id ? {...p, ...updates} : p));
  };

  const removeProp = (id) => {
    setProps(prev => prev.filter(p => p.id !== id));
    delete propImagesCache.current[id];
    if (selectedPropId === id) setSelectedPropId(null);
  };

  const handlePropUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => addProp(reader.result, file.name.replace(/\.[^.]+$/, ""));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Laser pointer system (DM only — persistent trail that fades) ──
  const [laserMode, setLaserMode] = useState(false);
  const laserPointsRef = useRef([]); // [{ x, y, time }] — use ref to avoid render storms
  const laserActive = useRef(false);
  const spaceHeldRef = useRef(false); // Track spacebar for pan-during-spell-targeting

  // ── Enhanced token context menu (popup style like Owlbear Rodeo) ──
  const [tokenPopup, setTokenPopup] = useState(null); // { tokenId, screenX, screenY }
  const [dismissedTurnPopupKey, setDismissedTurnPopupKey] = useState("");
  const tokenPopupDragRef = useRef(null);
  const [viewerSession, setViewerSession] = useState(() => (
    window.PhmurtDB && typeof window.PhmurtDB.getSession === "function"
      ? window.PhmurtDB.getSession()
      : null
  ));

  useEffect(() => {
    const refreshViewerSession = () => {
      setViewerSession(
        window.PhmurtDB && typeof window.PhmurtDB.getSession === "function"
          ? window.PhmurtDB.getSession()
          : null
      );
    };
    window.addEventListener("phmurt-auth-change", refreshViewerSession);
    return () => window.removeEventListener("phmurt-auth-change", refreshViewerSession);
  }, []);


  const findTokensInArea = (worldX, worldY, spell) => {
    if (spell.shape === "single") {
      // Find closest token within a generous click radius (3 grid cells)
      const maxDist = gridSize * 3;
      const closest = tokens.reduce((c, t) => {
        const d = Math.hypot(t.x - worldX, t.y - worldY);
        return (!c || d < c.dist) && d < maxDist ? { token: t, dist: d } : c;
      }, null);
      return closest ? [closest.token] : [];
    }
    const radiusPx = (spell.radius / 5) * gridSize;
    if (spell.shape === "sphere") {
      // Generous sphere: include tokens whose edge touches the area
      return tokens.filter(t => {
        const tokenR = gridSize * 0.4; // approximate token radius
        return Math.hypot(t.x - worldX, t.y - worldY) <= radiusPx + tokenR;
      });
    } else if (spell.shape === "cone") {
      if (!selectedToken) return [];
      const origin = selectedToken;
      const dx = worldX - origin.x, dy = worldY - origin.y;
      const angle = Math.atan2(dy, dx);
      const spread = Math.PI / 4;
      return tokens.filter(t => {
        const tx = t.x - origin.x, ty = t.y - origin.y;
        const dist = Math.hypot(tx, ty);
        if (dist <= gridSize * 0.3) return true; // tokens at origin always hit
        const tAngle = Math.atan2(ty, tx);
        let angleDiff = Math.abs(tAngle - angle);
        if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
        return dist <= radiusPx && angleDiff <= spread;
      });
    } else if (spell.shape === "line") {
      if (!selectedToken) return [];
      const origin = selectedToken;
      const dx = worldX - origin.x, dy = worldY - origin.y;
      const dist = Math.hypot(dx, dy) || 1;
      const lineLen = (spell.length / 5) * gridSize;
      const nx = dx / dist, ny = dy / dist;
      const widthPx = Math.max((spell.radius / 5) * gridSize, gridSize * 0.5); // minimum half-cell width
      return tokens.filter(t => {
        const tx = t.x - origin.x, ty = t.y - origin.y;
        const proj = tx * nx + ty * ny;
        if (proj < 0 || proj > lineLen) return false;
        const perpDist = Math.abs(tx * ny - ty * nx);
        return perpDist <= widthPx;
      });
    } else if (spell.shape === "cube") {
      const half = radiusPx;
      return tokens.filter(t => Math.abs(t.x - worldX) <= half && Math.abs(t.y - worldY) <= half);
    }
    return [];
  };

  const rollSave = (dc, ability, targetToken) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const nat20 = roll === 20;
    const nat1 = roll === 1;

    // Natural 20 always succeeds, natural 1 always fails
    if (nat20) {
      return { roll, modifier: 0, total: 20, success: true, nat20: true, nat1: false };
    }
    if (nat1) {
      return { roll, modifier: 0, total: 1, success: false, nat20: false, nat1: true };
    }

    // Get ability score and calculate modifier
    let abilityScore = 10;
    let modifier = 0;
    let isProficient = false;

    if (targetToken) {
      // Try to get from target's stats
      const scoreKey = ability.toLowerCase();
      if (targetToken[scoreKey] != null) {
        abilityScore = targetToken[scoreKey];
      } else if (targetToken.monsterData?.[scoreKey] != null) {
        abilityScore = targetToken.monsterData[scoreKey];
      }

      // Check for proficiency in saving throw
      const profile = getPartyProfile(targetToken);
      if (profile?.savingThrows?.includes(ability)) {
        isProficient = true;
      }
    }

    // Calculate ability modifier
    modifier = Math.floor((abilityScore - 10) / 2);

    // Add proficiency bonus if proficient
    let profBonus = 0;
    if (isProficient && targetToken) {
      const level = targetToken.level || targetToken.monsterData?.cr || 1;
      const crOrLevel = Math.max(1, level);
      profBonus = Math.ceil(crOrLevel / 4) + 1;
      modifier += profBonus;
    }

    const total = roll + modifier;
    const success = total >= dc;

    return { roll, modifier, total, success, nat20: false, nat1: false };
  };

  // Cast a spell at world coordinates. Now supports upcasting via castLevel state.
  // For multi-target spells, worldX/worldY is the final target; multiTargetSelections has all previous targets.
  const castSpell = (worldX, worldY, overrideSpell, multiTargets) => {
    const spell = overrideSpell || activeSpell;
    if (!spell) return;
    const caster = selectedToken;
    const id = "spell-" + Date.now();
    const effectiveCastLevel = castLevel || spell.level;
    const upcastDamage = getUpcastDamage(spell, effectiveCastLevel);
    const upcastHealing = getUpcastHealing(spell, effectiveCastLevel);

    // ── Consume spell slot (if not cantrip) ──
    if (spell.level > 0 && caster && caster.spellSlots) {
      const slotLevel = effectiveCastLevel;
      const maxSlot = caster.spellSlots[slotLevel] || 0;
      const usedSlot = (caster.usedSlots || {})[slotLevel] || 0;
      if (usedSlot >= maxSlot) {
        setSpellLog(prev => [...prev, { id:"log-"+Date.now(), msg:"No " + (slotLevel===1?"1st":slotLevel===2?"2nd":slotLevel===3?"3rd":slotLevel+"th") + " level spell slots remaining!", time:Date.now() }]);
        setTimeout(() => setSpellLog(prev => prev.slice(1)), 3000);
        return;
      }
      // Consume the slot
      const newUsed = { ...(caster.usedSlots || {}), [slotLevel]: usedSlot + 1 };
      updateToken(caster.id, { usedSlots: newUsed });
    }

    let hitTokens = [];
    let msgs = [];

    if (spell.shape === "self") {
      hitTokens = caster ? [caster] : [];
    } else if (spell.shape === "touch") {
      // Touch: find closest token to click within 2 grid cells, or fall back to caster
      const closest = tokens.reduce((c, t) => {
        const d = Math.hypot(t.x - worldX, t.y - worldY);
        return (!c || d < c.dist) && d < gridSize * 2.5 ? { token: t, dist: d } : c;
      }, null);
      hitTokens = closest ? [closest.token] : (caster ? [caster] : []);
    } else {
      hitTokens = findTokensInArea(worldX, worldY, spell);
    }

    // Special: Power Word Kill — instant kill if HP <= 100
    if (spell.name === "Power Word Kill" && hitTokens.length > 0) {
      hitTokens.forEach(t => {
        const hp = t.hp || 0;
        if (hp <= 100 && hp > 0) {
          applyTokenVitalsUpdate(t, 0, { deathSaveSuccesses: 0, deathSaveFailures: 3, deathStable: false, deathDead: true });
          msgs.push(t.name + " slain by Power Word Kill!");
        } else {
          msgs.push(t.name + " resists (HP > 100)");
        }
      });
    }
    // Special: Power Word Stun — stun if HP <= 150
    else if (spell.name === "Power Word Stun" && hitTokens.length > 0) {
      hitTokens.forEach(t => {
        if ((t.hp || 0) <= 150) {
          addTokenCondition(t.id, "Stunned");
          msgs.push(t.name + " stunned!");
        } else {
          msgs.push(t.name + " resists (HP > 150)");
        }
      });
    }
    // Normal spell processing
    else if (hitTokens.length > 0 && spell.applyEffect !== "utility" && spell.applyEffect !== "summon") {
      let totalDamageDealt = 0;
      let totalHealing = 0;

      hitTokens.forEach(t => {
        // Roll damage PER TARGET (fresh roll each time) — uses upcast damage
        if ((spell.applyEffect === "damage" || spell.damage) && (upcastDamage || spell.damage)) {
          const damageRoll = parseDiceExpression((upcastDamage || spell.damage).split(" ")[0]);
          let dmg = damageRoll.total;
          let saved = false;

          if (spell.save && spell.save !== "attack" && spell.save !== "") {
            const saveResult = rollSave(spellDC, spell.save, t);
            if (saveResult.success) {
              dmg = Math.floor(dmg / 2);
              saved = true;
            }
          }

          const oldHp = t.hp != null ? t.hp : (t.maxHp || 30);
          const newHp = Math.max(0, oldHp - dmg);
          applyTokenVitalsUpdate(t, newHp);
          totalDamageDealt += dmg;

          // Vampiric Touch: heal caster for damage dealt
          if (spell.name === "Vampiric Touch" && caster && caster.id !== t.id) {
            const healAmt = Math.floor(dmg / 2);
            const casterNewHp = Math.min(caster.maxHp, (caster.hp || 0) + healAmt);
            applyTokenVitalsUpdate(caster, casterNewHp);
          }
        }

        // Healing — uses upcast healing
        if (spell.applyEffect === "heal" && (upcastHealing || spell.healing)) {
          const healExpr = upcastHealing || spell.healing;
          const healRoll = parseDiceExpression(healExpr.split("+")[0]);
          // Add modifier (+mod = spellcasting mod or default 3)
          const modBonus = healExpr.includes("mod") ? (caster?.spellcastingMod || 3) : 0;
          const healTotal = healRoll.total + modBonus;
          const oldHp = t.hp != null ? t.hp : 0;
          const newHp = Math.min(t.maxHp || 30, oldHp + healTotal);
          applyTokenVitalsUpdate(t, newHp);
          totalHealing += healTotal;
        }

        // Apply conditions
        if (spell.conditions && spell.conditions.length > 0) {
          let applyConditions = true;
          // If spell has a save and it's a debuff/control, only apply on failed save
          if (spell.save && spell.save !== "" && (spell.applyEffect === "control" || spell.applyEffect === "debuff")) {
            const saveResult = rollSave(spellDC, spell.save, t);
            if (saveResult.success) {
              applyConditions = false;
            }
          }
          if (applyConditions) {
            spell.conditions.forEach(cond => addTokenCondition(t.id, cond));
          }
        }
      });

      // Build log message
      if (spell.damage && totalDamageDealt > 0) {
        msgs.push(spell.name + " dealt " + totalDamageDealt + " " + (spell.damageType || "") + " to " + hitTokens.length + " target" + (hitTokens.length !== 1 ? "s" : ""));
      }
      if (spell.healing && totalHealing > 0) {
        msgs.push(spell.name + " healed " + totalHealing + " HP");
      }
      if (!spell.damage && !spell.healing && spell.conditions && spell.conditions.length > 0) {
        msgs.push(spell.name + " applied " + spell.conditions.join(", ") + " to " + hitTokens.length + " target" + (hitTokens.length !== 1 ? "s" : ""));
      }
      if (msgs.length === 0 && hitTokens.length > 0) {
        msgs.push(spell.name + " cast on " + hitTokens.length + " target" + (hitTokens.length !== 1 ? "s" : ""));
      }
    }

    if (msgs.length === 0) {
      msgs.push(spell.name + " cast" + (hitTokens.length === 0 && spell.shape !== "self" ? " (no targets hit)" : ""));
    }

    // ── Handle concentration spell logic ──
    if (spell.concentration && caster) {
      const casterConds = getMergedConditionsForToken(caster);
      const wasConcentrating = casterConds.includes("Concentrating") || caster.activeConcentrationSpell;

      if (wasConcentrating) {
        // Break old concentration
        const oldSpellName = caster.activeConcentrationSpell || "spell";
        removeTokenCondition(caster.id, "Concentrating");
        updateToken(caster.id, { activeConcentrationSpell: null });
        msgs.unshift(caster.name + " breaks concentration on " + oldSpellName + " to cast " + spell.name);
      }

      // Apply new concentration
      addTokenCondition(caster.id, "Concentrating");
      updateToken(caster.id, { activeConcentrationSpell: spell.name });
      if (!wasConcentrating) {
        msgs.unshift(caster.name + " concentrates on " + spell.name);
      }
    }

    // Create visual effect
    setSpellEffects(prev => [...prev, { id, x: worldX, y: worldY, spell, startTime: Date.now(), casterX: caster?.x || worldX, casterY: caster?.y || worldY }]);

    // Log all messages
    msgs.forEach((msg, i) => {
      const logId = "log-" + Date.now() + "-" + i;
      setTimeout(() => {
        setSpellLog(prev => [...prev, { id: logId, msg, time: Date.now() }]);
        setTimeout(() => setSpellLog(prev => prev.filter(l => l.id !== logId)), 5000);
      }, i * 200);
    });

    if (!overrideSpell) {
      setActiveSpell(null);
      spellTargetRef.current = null;
      setMultiTargetSelections([]);
      setCastLevel(null);
    }
    setTimeout(() => setSpellEffects(prev => prev.filter(e => e.id !== id)), 4000);
  };

  // ── Dice roll display ──
  const [diceResult, setDiceResult] = useState(null);

  // ── Dice panel state ──
  const [showDicePanel, setShowDicePanel] = useState(false);
  const [diceInput, setDiceInput] = useState("");
  const [rollHistory, setRollHistory] = useState([]);

  // ── Phase 4: Multiplayer & Extensibility ──
  const [pings, setPings] = useState([]);
  const [pingMode, setPingMode] = useState(false);
  const [templates, setTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem(TEMPLATE_KEY) || '[]'); } catch { return []; }
  });
  // Sync templates from Supabase when campaign is active
  useEffect(() => {
    if (!activeCampaignId || activeCampaignId === 'example') return;
    if (typeof PhmurtDB === 'undefined') return;
    PhmurtDB.getEncounterTemplates(activeCampaignId).then(rows => {
      if (rows && rows.length > 0) {
        setTemplates(rows.map(r => ({ ...r.data, id: r.id, _fromCloud: true })));
      }
    }).catch(() => {});
  }, [activeCampaignId]);
  const [templateName, setTemplateName] = useState("");
  const [showTemplateInput, setShowTemplateInput] = useState(false);

  // ── Animation ──
  const animRef = useRef(0);

  const rawSelectedToken = tokens.find(t => t.id === selectedTokenId) || null;
  const selectedToken = (viewRole === "player" && rawSelectedToken?.hidden) ? null : rawSelectedToken;
  const activeCombatantId = combatLive && combatants[turn] ? combatants[turn].mapTokenId : null;
  const rawActiveCombatantToken = activeCombatantId ? (tokens.find((t) => t.id === activeCombatantId) || null) : null;
  const activeCombatantToken = (viewRole === "player" && rawActiveCombatantToken?.hidden) ? null : rawActiveCombatantToken;
  const activeCombatTargetId = activeCombatantToken ? (getFocusedCombatTarget(activeCombatantToken)?.id || null) : null;
  const battleFocusToken = selectedToken || activeCombatantToken || null;
  const battleFocusProfile = battleFocusToken ? getCombatProfile(battleFocusToken) : null;
  const battleFocusCombatant = battleFocusToken ? combatants.find(c => c.mapTokenId === battleFocusToken.id) || null : null;
  const battleFocusTarget = battleFocusToken ? getFocusedCombatTarget(battleFocusToken) : null;
  const battleSceneLabel = (() => {
    const map = getActiveMap();
    const scene = getActiveScene();
    if (map && scene) return map.name + " / " + scene.name;
    if (map) return map.name + " Overview";
    return "Battlefield";
  })();

  useEffect(() => {
    if (selectedTokenId) setBattleFocusPanelCollapsed(false);
  }, [selectedTokenId]);

  useEffect(() => {
    if (activeCombatantId) setBattleFocusPanelCollapsed(false);
  }, [activeCombatantId]);

  const getMergedConditionsForToken = (token) => {
    if (!token) return [];
    const row = combatants.find(c => c.mapTokenId === token.id);
    return [...new Set([
      ...((tokenConditions[token.id] || [])),
      ...(row ? (conditions[row.id] || []) : []),
    ])];
  };

  const getDeathSaveState = (token) => ({
    successes: Math.max(0, Math.min(3, Number(token?.deathSaveSuccesses || 0))),
    failures: Math.max(0, Math.min(3, Number(token?.deathSaveFailures || 0))),
    stable: !!token?.deathStable,
    dead: !!token?.deathDead || getMergedConditionsForToken(token).includes("Dead"),
  });

  const getActionLockReasonForToken = (token) => {
    if (!token) return "No active creature selected.";
    const conds = new Set(getMergedConditionsForToken(token));
    const deathState = getDeathSaveState(token);
    if (deathState.dead || conds.has("Dead")) return "Dead creatures cannot act or react.";
    if ((token.hp || 0) <= 0 && token.tokenType === "pc" && deathState.stable) return "Stable at 0 HP. No combat actions available until healed.";
    if ((token.hp || 0) <= 0 && token.tokenType === "pc") return "At 0 HP and dying. Death saves resolve on this creature's turn.";
    if (conds.has("Unconscious")) return "Unconscious creatures cannot take actions or reactions.";
    if (conds.has("Incapacitated")) return "Incapacitated creatures cannot take actions or reactions.";
    if (conds.has("Paralyzed")) return "Paralyzed creatures are incapacitated and cannot act.";
    if (conds.has("Petrified")) return "Petrified creatures are incapacitated and cannot act.";
    if (conds.has("Stunned")) return "Stunned creatures are incapacitated and cannot act.";
    if ((token.hp || 0) <= 0 && token.tokenType !== "pc") return "Defeated creatures cannot act.";
    return "";
  };

  const canTokenTakeActionNow = (token) => !getActionLockReasonForToken(token);

  const canTokenTakeReactionNow = (token) => {
    if (!token || getActionLockReasonForToken(token)) return false;
    const ts = turnStateByToken[token.id] || defaultTurnState(token);
    return !ts.reactionSpent;
  };

  const getLegendaryActionMax = (token) => {
    if (!token?.monsterData?.legendaryActions?.length) return 0;
    const explicit = Number(token.legendaryActionMax || token.monsterData.legendaryActionCount || 0);
    return explicit > 0 ? explicit : 3;
  };

  const getLegendaryActionRemaining = (token) => {
    const max = getLegendaryActionMax(token);
    if (!max) return 0;
    const raw = token.legendaryActionChargesRemaining;
    return Math.max(0, Math.min(max, raw == null ? max : Number(raw) || 0));
  };

  const getLegendaryActionCost = (action) => {
    const text = String(action?.name || "") + " " + String(action?.desc || "");
    const match = text.match(/Costs?\s*(\d+)\s*Actions?/i);
    return Math.max(1, parseInt(match?.[1] || "1", 10) || 1);
  };

  const canUseLairSurgeForToken = (token) => (
    viewRole === "dm" &&
    combatLive &&
    !!token?.monsterData?.legendaryActions?.length &&
    !getActionLockReasonForToken(token) &&
    Number(token?.lairActionRoundUsed || 0) !== round &&
    (() => {
      if (!combatants.length) return true;
      const lairWindowTurn = combatants.findIndex((row) => !shouldSkipCombatantRow(row) && (row.init || 0) <= 20);
      if (lairWindowTurn >= 0) return turn === lairWindowTurn;
      let lastLiveTurn = -1;
      combatants.forEach((row, idx) => {
        if (!shouldSkipCombatantRow(row)) lastLiveTurn = idx;
      });
      return lastLiveTurn >= 0 ? turn === lastLiveTurn : true;
    })()
  );

  const getLineCoverProfile = (attackerToken, targetToken) => {
    if (!attackerToken || !targetToken) {
      return { hasLineOfSight: true, coverACBonus: 0, dexSaveBonus: 0, coverLabel: "" };
    }
    const from = getTokenCenterPoint(attackerToken);
    const to = getTokenCenterPoint(targetToken);
    let hasSight = true;
    let coverBonus = Math.max(0, Number(targetToken.combatCover || 0) || 0);
    const coverSources = [];
    (walls || []).forEach((w) => {
      if (!segmentsIntersect(from.x, from.y, to.x, to.y, w.x1, w.y1, w.x2, w.y2)) return;
      const wallType = WALL_TYPES[w.type || "solid"] || WALL_TYPES.solid;
      if (wallType.blocksVision) {
        hasSight = false;
        return;
      }
      // FIX 2: Three-Quarters Cover Support
      // High walls provide +5 cover (three-quarters), low walls and windows provide +2 (half)
      if (w.type === "high") {
        coverBonus = Math.max(coverBonus, 5);
        coverSources.push(wallType.label + " cover (+5)");
      } else if (w.type === "low" || w.type === "window") {
        coverBonus = Math.max(coverBonus, 2);
        coverSources.push(wallType.label + " cover (+2)");
      }
    });
    const terrainKey = Math.floor((targetToken.x || 0) / gridSize) + "," + Math.floor((targetToken.y || 0) / gridSize);
    const terrainType = terrainCells?.[terrainKey];
    if (terrainType === "vegetation" || terrainType === "rubble") {
      coverBonus = Math.max(coverBonus, 2);
      coverSources.push((TERRAIN_TYPES[terrainType]?.label || "Terrain") + " cover (+2)");
    }
    if (targetToken.combatCover && coverSources.length === 0) coverSources.push("Manual cover +" + targetToken.combatCover + " AC");
    return {
      hasLineOfSight: hasSight,
      coverACBonus: coverBonus,
      dexSaveBonus: coverBonus >= 2 ? coverBonus : 0,
      coverLabel: coverSources.length ? [...new Set(coverSources)].join(", ") : "",
    };
  };

  const getThreatReachFt = (token) => {
    if (!token || getActionLockReasonForToken(token)) return 0;
    if (token.tokenType === "pc") {
      const profile = getCombatProfile(token);
      const weaponTable = (window.CombatEngine && window.CombatEngine.WEAPONS) ? window.CombatEngine.WEAPONS : {};
      const preferred = getWeaponOptionsForProfile(profile).find((weaponName) => weaponTable[weaponName]?.melee);
      if (preferred && weaponTable[preferred]) return Number(weaponTable[preferred].range || 5) || 5;
      return 5;
    }
    const CE = window.CombatEngine;
    const meleeRanges = (token.monsterData?.actions || [])
      .map((action) => CE?.parseAttackAction ? CE.parseAttackAction(action) : null)
      .filter((parsed) => parsed?.reach)
      .map((parsed) => Number(parsed.reach || 5) || 5);
    return meleeRanges.length ? Math.max(...meleeRanges) : (token.monsterData ? 5 : 0);
  };

  const getDeathSaveLabel = (token) => {
    const state = getDeathSaveState(token);
    if (state.dead) return "Dead";
    if (state.stable) return "Stable: 3/3 death save successes";
    if ((token?.hp || 0) <= 0 && token?.tokenType === "pc") {
      return "Death saves: " + state.successes + " success / " + state.failures + " failure";
    }
    return "";
  };

  const resolveDeathSaveForToken = (token) => {
    if (!token || token.tokenType !== "pc" || (token.hp || 0) > 0) return null;
    const currentState = getDeathSaveState(token);
    if (currentState.dead || currentState.stable) return null;
    const CE = window.CombatEngine;
    if (!CE?.rollDeathSave) return null;
    const roll = CE.rollDeathSave();
    let successes = currentState.successes;
    let failures = currentState.failures;
    let nextHp = 0;
    let deathStable = false;
    let deathDead = false;
    const lines = ["Death save roll: d20 = " + roll.roll + "."];

    if (roll.nat20) {
      nextHp = 1;
      successes = 0;
      failures = 0;
      lines.push("Natural 20: " + token.name + " regains 1 HP and returns to the fight.");
    } else {
      if (roll.nat1) {
        failures = Math.min(3, failures + 2);
        lines.push("Natural 1: counts as 2 failures.");
      } else if (roll.success) {
        successes = Math.min(3, successes + 1);
        lines.push("Success. Total successes: " + successes + "/3.");
      } else {
        failures = Math.min(3, failures + 1);
        lines.push("Failure. Total failures: " + failures + "/3.");
      }
      deathStable = successes >= 3 && failures < 3;
      deathDead = failures >= 3;
      if (deathStable) lines.push(token.name + " is stable but remains unconscious at 0 HP.");
      if (deathDead) lines.push(token.name + " has died after 3 failed death saves.");
    }

    applyTokenVitalsUpdate(token, nextHp, {
      deathSaveSuccesses: successes,
      deathSaveFailures: failures,
      deathStable,
      deathDead,
    });
    if (nextHp > 0) {
      removeTokenCondition(token.id, "Unconscious");
      removeTokenCondition(token.id, "Dead");
      emitPlayModeVfx(token, token, { mode: "heal", actionName: "Death Save", amount: 1 });
    } else if (deathDead) {
      addTokenCondition(token.id, "Dead");
      removeTokenCondition(token.id, "Unconscious");
      emitPlayModeVfx(token, token, { mode: "condition", actionName: "Death Save", conditionName: "Dead" });
    } else {
      addTokenCondition(token.id, "Unconscious");
      emitPlayModeVfx(token, token, { mode: "condition", actionName: "Death Save", conditionName: "Unconscious" });
    }
    setPlayModeResolution({ title: "Death Save: " + token.name, lines });
    addStructuredCombatLog("Death save rolled for " + token.name, lines.slice(1).join(" "), getDeathSaveLabel({ ...token, hp: nextHp, deathSaveSuccesses: successes, deathSaveFailures: failures, deathStable, deathDead }));
    return { nextHp, successes, failures, deathStable, deathDead, roll };
  };

  const resolveLairSurgeForToken = (actorToken) => {
    if (!canUseLairSurgeForToken(actorToken)) return false;
    updateToken(actorToken.id, { lairActionRoundUsed: round });
    const focusTarget = getFocusedCombatTarget(actorToken);
    const affected = focusTarget || actorToken;
    const line = focusTarget
      ? actorToken.name + " triggers a lair surge that pressures " + focusTarget.name + "."
      : actorToken.name + " reshapes the battlefield with a lair surge.";
    emitPlayModeVfx(actorToken, affected, { mode: "shockwave", actionName: "Lair Surge", damageType: "force", radius: 60 });
    addCombatLogEntry({ type: "system", text: "Round " + round + " Lair Surge - " + line + " DM resolves the exact regional effect from encounter notes." });
    setPlayModeResolution({
      title: actorToken.name + " Lair Surge",
      lines: [
        line,
        "Used this round's generic lair timing hook. Apply terrain, hazards, forced movement, or regional effects from your notes.",
        "This round's lair action is now marked as spent for " + actorToken.name + ".",
      ],
    });
    return true;
  };

  const resolveOpportunityAttackFromToken = (attackerToken, moverSnapshot) => {
    if (!attackerToken || !moverSnapshot || !canTokenTakeReactionNow(attackerToken)) return null;
    const CE = window.CombatEngine;
    if (!CE) return null;
    const lane = getLineCoverProfile(attackerToken, moverSnapshot);
    if (!lane.hasLineOfSight) return null;
    let attackName = "Opportunity Attack";
    let attackRoll = null;
    let totalDamage = 0;
    let damageType = "slashing";
    let isCrit = false;

    if (attackerToken.tokenType === "pc") {
      const profile = getCombatProfile(attackerToken);
      const weaponTable = CE.WEAPONS || {};
      const meleeWeapon = getWeaponOptionsForProfile(profile).find((weaponName) => weaponTable[weaponName]?.melee);
      if (!meleeWeapon) return null;
      attackName = meleeWeapon + " (Opportunity)";
      const result = CE.executePcWeaponAttack(
        {
          str: profile.abilities.str,
          dex: profile.abilities.dex,
          level: profile.level,
          conditions: (tokenConditions[attackerToken.id] || []).map(c => String(c).toLowerCase()),
        },
        buildEngineCombatTarget(moverSnapshot, moverSnapshot.id),
        meleeWeapon,
        { ...buildCombatEngineOptions(moverSnapshot, attackerToken), magicalWeapon: !!attackerToken.magicalWeapon }
      );
      const hitResult = result.results?.[0];
      attackRoll = hitResult?.attackRoll || null;
      totalDamage = hitResult?.hit ? (result.totalDamage || hitResult.totalDamage || 0) : 0;
      damageType = hitResult?.damage?.[0]?.type || damageType;
      isCrit = !!hitResult?.isCrit;
    } else {
      const meleeAction = (attackerToken.monsterData?.actions || []).find((action) => CE.parseAttackAction?.(action)?.reach) || null;
      if (!meleeAction) return null;
      attackName = meleeAction.name + " (Opportunity)";
      const result = CE.executeAttack(
        {
          ...attackerToken.monsterData,
          conditions: (tokenConditions[attackerToken.id] || []).map(c => String(c).toLowerCase()),
        },
        buildEngineCombatTarget(moverSnapshot, moverSnapshot.id),
        meleeAction,
        { ...buildCombatEngineOptions(moverSnapshot, attackerToken), magicalWeapon: !!attackerToken.magicalWeapon }
      );
      const hitResult = result.results?.[0];
      attackRoll = hitResult?.attackRoll || null;
      totalDamage = hitResult?.hit ? (result.totalDamage || hitResult.totalDamage || 0) : 0;
      damageType = hitResult?.damage?.[0]?.type || damageType;
      isCrit = !!hitResult?.isCrit;
    }

    spendEconomy(attackerToken.id, "reaction");
    if (totalDamage > 0) {
      applyAttackResultToTarget(moverSnapshot.id, moverSnapshot, totalDamage, damageType);
      emitPlayModeVfx(attackerToken, moverSnapshot, {
        mode: "attack",
        actionName: attackName,
        damageType,
        amount: totalDamage,
        isCrit,
        rollValue: attackRoll?.chosen ?? null,
        color: "#b574ff",
      });
      addCombatLogEntry({ type: "attack", attacker: attackerToken.name, target: moverSnapshot.name, action: attackName, hit: true, damage: totalDamage, isCrit, roll: attackRoll });
      return { hit: true, damage: totalDamage, name: attackName };
    }
    emitPlayModeVfx(attackerToken, moverSnapshot, { mode: "miss", actionName: attackName, rollValue: attackRoll?.chosen ?? null, color: "#b574ff" });
    addCombatLogEntry({ type: "miss", attacker: attackerToken.name, target: moverSnapshot.name, action: attackName, roll: attackRoll });
    return { hit: false, damage: 0, name: attackName };
  };

  const resolveOpportunityAttacksForMovement = (moverToken, originPoint, pathCells) => {
    if (!combatLive || !moverToken || moverToken.combatDisengage || !Array.isArray(pathCells) || pathCells.length === 0) return [];
    if (getMergedConditionsForToken(moverToken).includes("Hidden")) return [];
    const hostileThreats = getHostileTargets(moverToken).filter((hostile) => canTokenTakeReactionNow(hostile) && getThreatReachFt(hostile) > 0);
    if (!hostileThreats.length) return [];
    const route = [
      { x: originPoint?.x ?? moverToken.x, y: originPoint?.y ?? moverToken.y },
      ...pathCells.map((cell) => ({ x: cell.x * gridSize + gridSize / 2, y: cell.y * gridSize + gridSize / 2 })),
    ];
    let moverSnapshot = { ...moverToken };
    const triggered = [];

    // Collect which hostiles would get OAs
    const pendingOAs = [];
    hostileThreats.forEach((hostile) => {
      if ((moverSnapshot.hp || 0) <= 0) return;
      const reachFt = getThreatReachFt(hostile);
      let wasThreatened = distBetween(hostile, route[0]) <= reachFt;
      for (let idx = 1; idx < route.length; idx += 1) {
        const nextPoint = route[idx];
        const nowThreatened = distBetween(hostile, nextPoint) <= reachFt;
        if (wasThreatened && !nowThreatened) {
          const threatPoint = route[idx - 1] || route[0];
          pendingOAs.push({ hostile, moverAtThreat: { ...moverSnapshot, x: threatPoint.x, y: threatPoint.y } });
          break;
        }
        wasThreatened = nowThreatened;
      }
    });

    // Resolve OAs — show prompt for DM-controlled (viewRole === "dm") tokens, auto for monsters
    const resolveAllOAs = async () => {
      for (const { hostile, moverAtThreat } of pendingOAs) {
        if ((moverSnapshot.hp || 0) <= 0) break;
        // Show prompt for DM decision
        let shouldAttack = true;
        if (viewRole === "dm") {
          shouldAttack = await new Promise((resolve) => {
            reactionPromptResolveRef.current = resolve;
            setReactionPrompt({ attackerToken: hostile, moverToken: moverAtThreat });
          });
          setReactionPrompt(null);
          reactionPromptResolveRef.current = null;
        }
        if (shouldAttack) {
          const oaResult = resolveOpportunityAttackFromToken(hostile, moverAtThreat);
          if (oaResult) {
            triggered.push({ attacker: hostile.name, ...oaResult });
            moverSnapshot = { ...moverAtThreat, hp: Math.max(0, (moverAtThreat.hp || 0) - (oaResult.damage || 0)) };
          }
        } else {
          addCombatLogEntry({ type: "system", text: hostile.name + " chose not to take opportunity attack against " + moverToken.name });
        }
      }
      if (triggered.length > 0) {
        const summary = triggered.map((item) => item.attacker + " " + (item.hit ? "hit" : "missed")).join(" | ");
        setPlayModeResolution({
          title: "Opportunity Attacks",
          lines: [
            moverToken.name + " moved out of reach while " + (moverToken.combatDisengage ? "Disengaged." : "not Disengaged."),
            summary,
            "Reaction state was updated for each attacker.",
          ],
        });
      }
    };

    if (pendingOAs.length > 0) {
      resolveAllOAs();
    }
    return triggered;
  };

  const shouldSkipCombatantRow = (combatantRow) => {
    if (!combatantRow) return true;
    const token = tokens.find((t) => t.id === combatantRow.mapTokenId);
    if (!token) return true;
    if ((token.hp || 0) > 0) return false;
    if (token.tokenType === "pc") {
      const deathState = getDeathSaveState(token);
      return deathState.dead || deathState.stable;
    }
    return true;
  };

  const getTokenRulesReminder = (token) => {
    if (!token) return [];
    const reminders = [];
    const conds = getMergedConditionsForToken(token);
    const target = getFocusedCombatTarget(token);
    const ts = turnStateByToken[token.id] || defaultTurnState(token);
    const moveBudget = getEffectiveMovementRemaining(token);
    const lockReason = getActionLockReasonForToken(token);
    const deathState = getDeathSaveState(token);
    const lane = target ? getLineCoverProfile(token, target) : null;
    if (lockReason) {
      const deathText = token.tokenType === "pc" && (token.hp || 0) <= 0 && !deathState.dead
        ? "Death saves: " + deathState.successes + " success / " + deathState.failures + " failure" + (deathState.stable ? " (stable)" : "") + "."
        : lockReason;
      reminders.push({ tone: deathState.dead ? "#f06858" : "#ffd54f", text: deathText });
    }
    if (conds.includes("Concentrating")) {
      reminders.push({ tone:"#e8940a", text:"Concentrating: taking damage can force a CON save." });
    }
    if (conds.includes("Prone")) {
      reminders.push({ tone:"#ffd54f", text:"Prone: melee attackers within 5 ft gain advantage; ranged attacks suffer disadvantage." });
    }
    if (conds.includes("Hidden")) {
      reminders.push({ tone:"#58aaff", text:"Hidden: attacking or casting an offensive spell reveals this creature." });
    }
    if (moveBudget <= 0 && combatLive) {
      reminders.push({ tone:"#f06858", text:"No movement available or movement is locked by a condition." });
    }
    if (combatLive && ts.reactionSpent) {
      reminders.push({ tone:"#b574ff", text:"Reaction spent: opportunity attacks and reaction spells are unavailable." });
    }
    if (target && lane && !lane.hasLineOfSight) {
      reminders.push({ tone:"#f06858", text:"No clear line of sight to " + target.name + " through current walls/doors." });
    } else if (target && lane && lane.coverACBonus > 0) {
      reminders.push({ tone:"#58aaff", text:(lane.coverLabel || "Cover") + ": +" + lane.coverACBonus + " AC / +" + lane.dexSaveBonus + " DEX saves." });
    }
    if (target && (!lane || lane.hasLineOfSight) && distBetween(token, target) <= getThreatReachFt(target) && !token.combatDisengage && canTokenTakeReactionNow(target)) {
      reminders.push({ tone:"#dc143c", text:"Opportunity risk: leaving " + target.name + "'s " + getThreatReachFt(target) + " ft reach can trigger a reaction attack unless you Disengage." });
    }
    if (token.monsterData?.legendaryActions?.length && getLegendaryActionMax(token) > 0) {
      reminders.push({ tone:"#ffd54f", text:"Legendary actions ready: " + getLegendaryActionRemaining(token) + "/" + getLegendaryActionMax(token) + ". Lair Surge " + (Number(token.lairActionRoundUsed || 0) === round ? "used" : "available") + " this round." });
    }
    if (token.cls === "Rogue" && target && distBetween(token, target) <= 80 && (target.hp || 0) > 0 && !ts.actionUsed) {
      reminders.push({ tone:"#ffd54f", text:"Check Sneak Attack eligibility before your first weapon hit this turn." });
    }
    return reminders.slice(0, 4);
  };

  const summarizeCombatEvent = (entry) => {
    if (!entry) return "No combat actions logged yet.";
    if (entry.text) return entry.text;
    if (entry.type === "attack") {
      return entry.attacker + " hit " + entry.target + (entry.damage ? " for " + entry.damage + " damage" : "") + (entry.action ? " with " + entry.action : "") + ".";
    }
    if (entry.type === "miss") return entry.attacker + " missed " + entry.target + (entry.action ? " with " + entry.action : "") + ".";
    if (entry.type === "save") return entry.target + " " + (entry.success ? "saved" : "failed") + " vs " + (entry.action || "effect") + ".";
    return entry.action || "Combat updated.";
  };

  const getCockpitTrayActions = (token) => {
    if (!token) return [];
    const actions = getPopupQuickActions(token);
    const ordered = [
      ...actions.filter(act => !act.disabled),
      ...actions.filter(act => act.disabled),
    ];
    return ordered.slice(0, 14);
  };

  const drawRoundedRectPath = (ctx, x, y, w, h, radius) => {
    const r = Math.max(0, Math.min(radius, w / 2, h / 2));
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const drawTokenStateBadge = (ctx, x, y, label, fillColor, strokeColor) => {
    ctx.beginPath();
    drawRoundedRectPath(ctx, x - 9, y - 8, 18, 16, 6);
    ctx.fillStyle = "rgba(0,0,0,0.78)";
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = fillColor;
    ctx.font = "bold " + Math.max(7, gridSize * 0.16) + "px Cinzel";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 0.5);
  };

  const worldToCanvas = (wx, wy) => ({ x: wx * zoom + pan.x, y: wy * zoom + pan.y });
  const canvasToWorld = (cx, cy) => ({ x: (cx - pan.x) / zoom, y: (cy - pan.y) / zoom });

  const activeTurnPopupKey = combatLive && activeCombatantId
    ? "r" + round + "-t" + turn + "-" + activeCombatantId
    : "";

  const clampTurnPopupPosition = (screenX, screenY) => {
    const canvasW = canvasRef.current?.width || 600;
    const canvasH = canvasRef.current?.height || 400;
    const panelW = 372;
    const panelH = Math.min(640, Math.max(460, canvasH - 24));
    return {
      screenX: Math.max(12, Math.min(screenX, Math.max(12, canvasW - panelW - 12))),
      screenY: Math.max(12, Math.min(screenY, Math.max(12, canvasH - panelH - 12))),
    };
  };

  const getTokenPopupAnchor = (token, fallbackX, fallbackY) => {
    const canvasW = canvasRef.current?.width || 600;
    const point = {
      x: Math.max(12, canvasW - 384),
      y: 14,
    };
    return clampTurnPopupPosition(point.x, point.y);
  };

  const canUseTurnPopupForToken = (token) => {
    if (!token) return false;
    if (!combatLive) return viewRole === "dm" || canControlTokenForViewer(token);
    if (token.id === activeCombatantId) return canControlTokenForViewer(token);
    if (viewRole !== "dm" || token.tokenType === "pc") return false;
    const hasLegendaryHooks = !!token.monsterData?.legendaryActions?.length;
    if (!hasLegendaryHooks || getActionLockReasonForToken(token)) return false;
    return getLegendaryActionRemaining(token) > 0 || canUseLairSurgeForToken(token);
  };
  const battleFocusCanAct = battleFocusToken ? canUseTurnPopupForToken(battleFocusToken) : false;

  const openTurnPopupForToken = (token, preferredX, preferredY) => {
    if (!token || !canUseTurnPopupForToken(token)) return false;
    setSelectedTokenId(token.id);
    setShowConditionMenu(false);
    setDismissedTurnPopupKey("");
    setCombatLogOpen(false);
    setTokenPopup((prev) => {
      const anchor = prev?.screenX != null && prev?.screenY != null
        ? clampTurnPopupPosition(prev.screenX, prev.screenY)
        : getTokenPopupAnchor(token, preferredX, preferredY);
      return {
        tokenId: token.id,
        screenX: anchor.screenX,
        screenY: anchor.screenY,
        turnKey: combatLive ? activeTurnPopupKey : "",
        autoOpened: !!combatLive,
      };
    });
    if (combatLive) openCombatSidebar("tracker");
    return true;
  };

  const dismissTurnPopup = () => {
    setShowConditionMenu(false);
    setTokenPopup(null);
    setPendingCombatAction(null);
    if (combatLive && activeTurnPopupKey) setDismissedTurnPopupKey(activeTurnPopupKey);
  };

  const beginTurnPopupDrag = (e) => {
    if (!tokenPopup) return;
    e.preventDefault();
    e.stopPropagation();
    tokenPopupDragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: tokenPopup.screenX || 12,
      startY: tokenPopup.screenY || 14,
    };
  };

  useEffect(() => {
    const handlePopupDragMove = (e) => {
      const drag = tokenPopupDragRef.current;
      if (!drag) return;
      e.preventDefault();
      const nextPos = clampTurnPopupPosition(
        drag.startX + (e.clientX - drag.startClientX),
        drag.startY + (e.clientY - drag.startClientY)
      );
      setTokenPopup((prev) => prev ? { ...prev, ...nextPos, autoOpened: false } : prev);
    };
    const handlePopupDragEnd = () => {
      tokenPopupDragRef.current = null;
    };
    window.addEventListener("mousemove", handlePopupDragMove);
    window.addEventListener("mouseup", handlePopupDragEnd);
    return () => {
      window.removeEventListener("mousemove", handlePopupDragMove);
      window.removeEventListener("mouseup", handlePopupDragEnd);
    };
  }, []);

  useEffect(() => {
    if (!combatLive || !activeCombatantToken || !activeTurnPopupKey) {
      setDismissedTurnPopupKey("");
      return;
    }
    setSidebarOpen(true);
    setCombatTab("tracker");
    if (dismissedTurnPopupKey === activeTurnPopupKey) return;
    if (!canControlTokenForViewer(activeCombatantToken)) {
      setTokenPopup((prev) => (prev?.autoOpened ? null : prev));
      return;
    }
    const fallbackAnchor = getTokenPopupAnchor(activeCombatantToken);
    setTokenPopup((prev) => {
      const anchor = prev?.screenX != null && prev?.screenY != null
        ? clampTurnPopupPosition(prev.screenX, prev.screenY)
        : fallbackAnchor;
      if (
        prev &&
        prev.tokenId === activeCombatantToken.id &&
        prev.turnKey === activeTurnPopupKey
      ) {
        return { ...prev, ...anchor };
      }
      return {
        tokenId: activeCombatantToken.id,
        screenX: anchor.screenX,
        screenY: anchor.screenY,
        turnKey: activeTurnPopupKey,
        autoOpened: true,
      };
    });
    setSelectedTokenId(activeCombatantToken.id);
    setShowConditionMenu(false);
  }, [
    combatLive,
    activeCombatantId,
    activeCombatantToken?.partyId,
    activeCombatantToken?.tokenType,
    activeTurnPopupKey,
    dismissedTurnPopupKey,
    party,
    round,
    turn,
    viewRole,
    viewerSession?.displayName,
    viewerSession?.email,
    viewerSession?.name,
    viewerSession?.userId,
  ]);

  const activeTool = mode === "draw" ? drawTool : "select";
  const cockpitModeActive = combatLive;
  const launcherToken = tokenPopup?.tokenId ? (tokens.find(t => t.id === tokenPopup.tokenId) || null) : null;
  const launcherCanAct = launcherToken ? canUseTurnPopupForToken(launcherToken) : false;
  const launcherActions = launcherToken && launcherCanAct ? getCockpitTrayActions(launcherToken) : [];
  const focusConds = battleFocusToken ? getMergedConditionsForToken(battleFocusToken) : [];
  const focusTargetConds = battleFocusTarget ? getMergedConditionsForToken(battleFocusTarget) : [];
  const focusTurnState = battleFocusToken ? (turnStateByToken[battleFocusToken.id] || defaultTurnState(battleFocusToken)) : null;
  const focusMoveLabel = battleFocusToken ? (getEffectiveMovementRemaining(battleFocusToken) + " ft") : "0 ft";
  const focusOwner = battleFocusToken
    ? (getPartyProfile(battleFocusToken)?.player || battleFocusToken.player || (battleFocusToken.tokenType === "pc" ? "Player" : "DM"))
    : "";
  const activeOwnerLabel = activeCombatantToken
    ? (getPartyProfile(activeCombatantToken)?.player || activeCombatantToken.player || (activeCombatantToken.tokenType === "pc" ? "Player" : "DM"))
    : focusOwner;
  const focusDistance = (battleFocusToken && battleFocusTarget) ? distBetween(battleFocusToken, battleFocusTarget) : 0;
  const focusLane = (battleFocusToken && battleFocusTarget) ? getLineCoverProfile(battleFocusToken, battleFocusTarget) : null;
  const focusLockReason = battleFocusToken ? getActionLockReasonForToken(battleFocusToken) : "";
  const focusIsCurrent = !!battleFocusToken && battleFocusToken.id === activeCombatantId;
  const focusIsReadOnly = !!battleFocusToken && !battleFocusTarget && (!focusIsCurrent || !canControlTokenForViewer(battleFocusToken));
  const visibleTopCombatants = combatants.filter((c) => {
    if (viewRole !== "player") return true;
    const rowToken = tokens.find(t => t.id === c.mapTokenId);
    return !rowToken?.hidden;
  });
  const visibleTopTurn = combatLive
    ? visibleTopCombatants.findIndex(c => c.mapTokenId === activeCombatantId)
    : 0;
  const hudActiveUnit = (viewRole === "player" && rawActiveCombatantToken?.hidden)
    ? { name: "Hidden Creature" }
    : (activeCombatantToken || battleFocusToken);
  const hudActiveOwner = (viewRole === "player" && rawActiveCombatantToken?.hidden)
    ? "Resolving in DM view"
    : activeOwnerLabel;
  const modeLabel = activeSpell
    ? ("Spell: " + activeSpell.name)
    : movementMode
      ? "Movement"
      : pingMode
        ? "Ping"
        : laserMode
          ? "Laser"
          : showScenePanel
            ? "Scenes"
            : "Tactical";
  const cockpitUiMode = combatLogOpen
    ? "log"
    : movementMode
      ? "move"
      : activeSpell
        ? "ability"
        : pendingCombatAction
          ? (["Spell", "Class Feature", "Save / AoE", "Legendary", "Utility", "Other"].includes(pendingCombatAction.panel) ? "ability" : "attack")
          : (battleFocusTarget || focusIsReadOnly)
            ? "inspect"
            : "idle";

  const startCockpitMovement = (token) => {
    if (!token) return;
    const canMove = getEffectiveMovementRemaining(token) > 0 || (movementMode && selectedTokenId === token.id);
    if (!canMove) return;
    setSelectedTokenId(token.id);
    setPendingCombatAction(null);
    setCombatLogOpen(false);
    if (movementMode && selectedTokenId === token.id) {
      setMovementMode(false);
      setMovementPath([]);
      setMovementOrigin(null);
      return;
    }
    setMovementMode(true);
    setMovementPath([]);
    setMovementOrigin({ x: token.x, y: token.y });
    setSidebarOpen(true);
  };

  const chooseCockpitAction = (action) => {
    if (!action || action.disabled) return;
    setPendingCombatAction(action);
    setCombatLogOpen(false);
    setSidebarOpen(true);
  };

  const cancelCockpitIntent = () => {
    setPendingCombatAction(null);
    setCombatLogOpen(false);
    setActiveWeapon(null);
    weaponTargetRef.current = null;
    setActiveSpell(null);
    spellTargetRef.current = null;
    setMultiTargetSelections([]);
    setCastLevel(null);
    if (movementMode) {
      setMovementMode(false);
      setMovementPath([]);
      setMovementOrigin(null);
    }
  };

  const confirmCockpitAction = () => {
    if (!pendingCombatAction || pendingCombatAction.disabled) return;
    pendingCombatAction.onClick?.();
    if (pendingCombatAction.panel !== "Spell") {
      setPendingCombatAction(null);
    }
  };

  // ── Snap to nearest grid intersection (for walls) ──
  useEffect(() => {
    if (combatLive) setShowScenePanel(false);
  }, [combatLive]);

  const snapToGridIntersection = (wx, wy) => ({
    x: Math.round(wx / gridSize) * gridSize,
    y: Math.round(wy / gridSize) * gridSize,
  });

  const snapToGridCenter = (wx, wy) => {
    if (!snapToGrid) return { x: wx, y: wy };
    return {
      x: Math.floor(wx / gridSize) * gridSize + gridSize / 2,
      y: Math.floor(wy / gridSize) * gridSize + gridSize / 2,
    };
  };

  // ── Canvas rendering ──
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    if (bgImage) ctx.drawImage(bgImage, 0, 0);

    const mapW = bgImage ? bgImage.width : w / zoom;
    const mapH = bgImage ? bgImage.height : h / zoom;

    // Subtle depth gradient on background (very low contrast vignette)
    if (!bgImage) {
      const depthGrad = ctx.createRadialGradient(mapW/2, mapH/2, 0, mapW/2, mapH/2, Math.max(mapW, mapH) * 0.7);
      depthGrad.addColorStop(0, "rgba(30,28,40,0.08)");
      depthGrad.addColorStop(0.6, "rgba(10,10,18,0.0)");
      depthGrad.addColorStop(1, "rgba(4,4,10,0.12)");
      ctx.fillStyle = depthGrad;
      ctx.fillRect(0, 0, mapW, mapH);
    }

    // Grid — recessed, minimal, doesn't compete with gameplay elements
    if (showGrid) {
      const isLight = document.documentElement.classList.contains("light-mode");
      const gridOpacity = isLight ? 0.06 : 0.09;
      ctx.strokeStyle = "rgba(140,130,150," + gridOpacity + ")";
      ctx.lineWidth = 0.4;
      // Calculate visible area in world coordinates
      const visLeft = -pan.x / zoom;
      const visTop = -pan.y / zoom;
      const visRight = (w - pan.x) / zoom;
      const visBottom = (h - pan.y) / zoom;
      const startX = Math.floor(visLeft / gridSize) * gridSize;
      const startY = Math.floor(visTop / gridSize) * gridSize;
      const endX = Math.ceil(visRight / gridSize) * gridSize;
      const endY = Math.ceil(visBottom / gridSize) * gridSize;
      for (let x = startX; x <= endX; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, startY); ctx.lineTo(x, endY); ctx.stroke();
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(endX, y); ctx.stroke();
      }
    }

    // Terrain cells (after grid, before drawings) — enhanced texture with variability
    const drawTerrainTexture = (gx, gy, terrainType, gs) => {
      const x = gx * gs, y = gy * gs;
      const cx = x + gs/2, cy = y + gs/2;
      // Deterministic seed per cell for variability
      const seed = (gx * 7919 + gy * 104729) % 65536;
      const srand = (n) => ((seed * 9301 + n * 49297 + 233280) % 233280) / 233280;

      if (terrainType === "difficult") {
        ctx.strokeStyle = "rgba(180,140,40,0.3)"; ctx.lineWidth = 0.7;
        for (let i = 0; i < 6; i++) {
          const rx = x + srand(i*3) * gs, ry = y + srand(i*3+1) * gs;
          const sz = 2 + srand(i*3+2) * 4;
          ctx.beginPath();
          ctx.moveTo(rx - sz, ry + sz*0.3);
          ctx.lineTo(rx - sz*0.3, ry - sz*0.6);
          ctx.lineTo(rx + sz*0.4, ry - sz*0.5);
          ctx.lineTo(rx + sz, ry + sz*0.2);
          ctx.closePath(); ctx.stroke();
        }
        ctx.fillStyle = "rgba(160,120,30,0.12)";
        for (let i = 0; i < 10; i++) {
          ctx.beginPath(); ctx.arc(x + srand(i*2+20) * gs, y + srand(i*2+21) * gs, 0.5 + srand(i+30), 0, Math.PI*2); ctx.fill();
        }
      } else if (terrainType === "water" || terrainType === "deepwater") {
        const deep = terrainType === "deepwater";
        const baseAlpha = deep ? 0.35 : 0.25;
        ctx.strokeStyle = deep ? "rgba(60,120,220," + baseAlpha + ")" : "rgba(80,170,255," + baseAlpha + ")";
        ctx.lineWidth = deep ? 1.2 : 0.9;
        const phase = srand(0) * Math.PI * 2;
        for (let row = 3; row < gs; row += (deep ? 5 : 6)) {
          ctx.beginPath();
          const amp = 1.5 + srand(row) * 1.5;
          const freq = 0.2 + srand(row + 1) * 0.15;
          for (let col = 0; col <= gs; col += 1.5) {
            ctx.lineTo(x + col, y + row + Math.sin(col * freq + phase + row * 0.4) * amp);
          }
          ctx.stroke();
        }
        if (deep) {
          ctx.fillStyle = "rgba(20,60,160,0.12)";
          for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.arc(x + srand(i*2+40) * gs, y + srand(i*2+41) * gs, 1 + srand(i+50) * 2, 0, Math.PI*2); ctx.fill();
          }
        }
      } else if (terrainType === "lava") {
        for (let i = 0; i < 5; i++) {
          const bx = x + srand(i*3) * gs, by = y + srand(i*3+1) * gs;
          const r = 2 + srand(i*3+2) * 3;
          const grad = ctx.createRadialGradient(bx, by, 0, bx, by, r);
          grad.addColorStop(0, "rgba(255,200,60,0.35)");
          grad.addColorStop(0.5, "rgba(255,100,20,0.25)");
          grad.addColorStop(1, "rgba(180,30,10,0.1)");
          ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI*2); ctx.fill();
        }
        ctx.strokeStyle = "rgba(255,80,20,0.2)"; ctx.lineWidth = 0.6;
        for (let i = 0; i < 3; i++) {
          const sx = x + srand(i+60) * gs, sy = y + srand(i+61) * gs;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(sx + srand(i+62) * 8 - 4, sy - 4 - srand(i+63) * 4, sx + srand(i+64) * 6 - 3, sy - 8 - srand(i+65) * 4);
          ctx.stroke();
        }
      } else if (terrainType === "ice") {
        ctx.strokeStyle = "rgba(200,225,250,0.25)"; ctx.lineWidth = 0.5;
        const numCracks = 3 + Math.floor(srand(0) * 3);
        for (let i = 0; i < numCracks; i++) {
          const sx = x + srand(i*4) * gs, sy = y + srand(i*4+1) * gs;
          ctx.beginPath(); ctx.moveTo(sx, sy);
          let px = sx, py = sy;
          for (let j = 0; j < 3; j++) {
            px += (srand(i*4+j+10) - 0.5) * gs * 0.4;
            py += (srand(i*4+j+20) - 0.5) * gs * 0.4;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(220,240,255,0.08)";
        ctx.fillRect(x, y, gs, gs);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath(); ctx.arc(cx + srand(70) * gs * 0.3, cy + srand(71) * gs * 0.3, gs * 0.1, 0, Math.PI*2); ctx.fill();
      } else if (terrainType === "pit") {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, gs * 0.45);
        grad.addColorStop(0, "rgba(0,0,0,0.3)");
        grad.addColorStop(0.7, "rgba(0,0,0,0.1)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad; ctx.fillRect(x, y, gs, gs);
        ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 0.6;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 3; a += 0.15) {
          const r = gs * 0.05 + a * gs * 0.045;
          ctx.lineTo(cx + Math.cos(a + srand(0)) * r, cy + Math.sin(a + srand(0)) * r);
        }
        ctx.stroke();
      } else if (terrainType === "mud") {
        ctx.fillStyle = "rgba(80,55,25,0.2)";
        for (let i = 0; i < 12; i++) {
          const bx = x + srand(i*2) * gs, by = y + srand(i*2+1) * gs;
          const r = 1 + srand(i+30) * 2.5;
          ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI*2); ctx.fill();
        }
        ctx.strokeStyle = "rgba(100,70,30,0.15)"; ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
          const sx = x + srand(i+40) * gs * 0.8 + gs * 0.1;
          ctx.beginPath();
          ctx.moveTo(sx, y + gs * 0.2 + srand(i+50) * gs * 0.6);
          ctx.quadraticCurveTo(sx + srand(i+51) * 10, y + gs * 0.5, sx + srand(i+52) * 8, y + gs * 0.7 + srand(i+53) * gs * 0.2);
          ctx.stroke();
        }
      } else if (terrainType === "vegetation") {
        const numPlants = 4 + Math.floor(srand(0) * 4);
        for (let i = 0; i < numPlants; i++) {
          const bx = x + srand(i*5) * gs * 0.8 + gs * 0.1;
          const by = y + srand(i*5+1) * gs * 0.8 + gs * 0.1;
          const height = 4 + srand(i*5+2) * 6;
          ctx.strokeStyle = "rgba(30,100,40,0.4)"; ctx.lineWidth = 1 + srand(i*5+4) * 0.5;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - height); ctx.stroke();
          const leaves = 2 + Math.floor(srand(i*5+3) * 3);
          for (let l = 0; l < leaves; l++) {
            const ly = by - height * (0.3 + l * 0.25);
            const dir = (l % 2 === 0) ? 1 : -1;
            const lLen = 2 + srand(i*5+l+10) * 3;
            ctx.strokeStyle = "rgba(40,140,50,0.35)"; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(bx, ly);
            ctx.quadraticCurveTo(bx + dir * lLen, ly - 1, bx + dir * lLen * 1.2, ly + 1);
            ctx.stroke();
          }
        }
      } else if (terrainType === "rubble") {
        for (let i = 0; i < 7; i++) {
          const rx = x + srand(i*4) * gs * 0.85 + gs * 0.075;
          const ry = y + srand(i*4+1) * gs * 0.85 + gs * 0.075;
          const sz = 2 + srand(i*4+2) * 4;
          const angle = srand(i*4+3) * Math.PI;
          ctx.save(); ctx.translate(rx, ry); ctx.rotate(angle);
          ctx.fillStyle = "rgba(130,120,105,0.2)";
          ctx.strokeStyle = "rgba(160,150,130,0.25)"; ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(-sz*0.5, sz*0.3);
          ctx.lineTo(-sz*0.3, -sz*0.4);
          ctx.lineTo(sz*0.4, -sz*0.3);
          ctx.lineTo(sz*0.5, sz*0.2);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.restore();
        }
      } else if (terrainType === "magic") {
        const numStars = 3 + Math.floor(srand(0) * 3);
        for (let i = 0; i < numStars; i++) {
          const sx = x + srand(i*3) * gs * 0.8 + gs * 0.1;
          const sy = y + srand(i*3+1) * gs * 0.8 + gs * 0.1;
          const r = 2 + srand(i*3+2) * 3;
          ctx.strokeStyle = "rgba(180,120,255,0.35)"; ctx.lineWidth = 0.7;
          for (let ray = 0; ray < 4; ray++) {
            const a = ray * Math.PI / 4 + srand(i+30) * 0.5;
            ctx.beginPath(); ctx.moveTo(sx + Math.cos(a) * r * 0.3, sy + Math.sin(a) * r * 0.3);
            ctx.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(160,80,240,0.06)"; ctx.fillRect(x, y, gs, gs);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, gs * 0.4);
        grad.addColorStop(0, "rgba(180,120,255,0.1)"); grad.addColorStop(1, "rgba(180,120,255,0)");
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, gs * 0.4, 0, Math.PI*2); ctx.fill();
      } else if (terrainType === "fire") {
        const numFlames = 3 + Math.floor(srand(0) * 3);
        for (let i = 0; i < numFlames; i++) {
          const fx = x + srand(i*4) * gs * 0.7 + gs * 0.15;
          const fy = y + gs * (0.5 + srand(i*4+1) * 0.4);
          const h = 5 + srand(i*4+2) * 8;
          const w = 2 + srand(i*4+3) * 2;
          ctx.fillStyle = "rgba(255,140,30,0.25)";
          ctx.beginPath();
          ctx.moveTo(fx - w, fy);
          ctx.quadraticCurveTo(fx - w * 0.5, fy - h * 0.6, fx, fy - h);
          ctx.quadraticCurveTo(fx + w * 0.5, fy - h * 0.6, fx + w, fy);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = "rgba(255,220,60,0.15)";
          ctx.beginPath();
          ctx.moveTo(fx - w * 0.5, fy);
          ctx.quadraticCurveTo(fx, fy - h * 0.5, fx + w * 0.5, fy);
          ctx.closePath(); ctx.fill();
        }
      } else if (terrainType === "darkness") {
        const grad = ctx.createRadialGradient(cx + srand(0) * 4 - 2, cy + srand(1) * 4 - 2, gs * 0.05, cx, cy, gs * 0.5);
        grad.addColorStop(0, "rgba(0,0,0,0.2)");
        grad.addColorStop(0.5, "rgba(5,0,15,0.1)");
        grad.addColorStop(1, "rgba(10,5,20,0)");
        ctx.fillStyle = grad; ctx.fillRect(x, y, gs, gs);
        ctx.fillStyle = "rgba(60,20,80,0.08)";
        for (let i = 0; i < 5; i++) {
          ctx.beginPath(); ctx.arc(x + srand(i+10) * gs, y + srand(i+11) * gs, 1 + srand(i+12), 0, Math.PI*2); ctx.fill();
        }
      }
    };

    Object.entries(terrainCells).forEach(([key, terrainType]) => {
      if (!terrainType) return;
      const [gx, gy] = key.split(",").map(Number);
      const terrain = TERRAIN_TYPES[terrainType];
      if (!terrain) return;

      // Base color fill
      ctx.fillStyle = terrain.color;
      ctx.fillRect(gx * gridSize, gy * gridSize, gridSize, gridSize);

      // Texture pattern overlay
      drawTerrainTexture(gx, gy, terrainType, gridSize);
    });

    // Drawings (finalized) — smooth quadratic curves
    drawings.forEach(d => {
      if (d.points.length < 2) return;
      ctx.strokeStyle = d.color;
      ctx.lineWidth = d.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(d.points[0].x, d.points[0].y);
      if (d.points.length === 2) {
        ctx.lineTo(d.points[1].x, d.points[1].y);
      } else {
        for (let i = 1; i < d.points.length - 1; i++) {
          const mx = (d.points[i].x + d.points[i+1].x) / 2;
          const my = (d.points[i].y + d.points[i+1].y) / 2;
          ctx.quadraticCurveTo(d.points[i].x, d.points[i].y, mx, my);
        }
        const last = d.points[d.points.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
    });

    // In-progress drawing preview (real-time) — smooth quadratic curves
    if (drawPoints.length > 1) {
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(drawPoints[0].x, drawPoints[0].y);
      if (drawPoints.length === 2) {
        ctx.lineTo(drawPoints[1].x, drawPoints[1].y);
      } else {
        for (let i = 1; i < drawPoints.length - 1; i++) {
          const mx = (drawPoints[i].x + drawPoints[i+1].x) / 2;
          const my = (drawPoints[i].y + drawPoints[i+1].y) / 2;
          ctx.quadraticCurveTo(drawPoints[i].x, drawPoints[i].y, mx, my);
        }
        const last = drawPoints[drawPoints.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Walls — render with type-specific styles
    ctx.lineCap = "round";
    walls.forEach(wall => {
      const wt = WALL_TYPES[wall.type || "solid"] || WALL_TYPES.solid;
      ctx.strokeStyle = wt.color;
      ctx.lineWidth = wt.width;
      if (wt.dash.length > 0) ctx.setLineDash(wt.dash);
      else ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
      // Draw endpoint dots for doors
      if (wall.type === "door") {
        ctx.setLineDash([]);
        ctx.fillStyle = wt.color;
        ctx.beginPath(); ctx.arc(wall.x1, wall.y1, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(wall.x2, wall.y2, 3, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.setLineDash([]);
    // Wall preview
    if (wallStart && wallPreview) {
      const previewWt = WALL_TYPES[selectedWallType] || WALL_TYPES.solid;
      ctx.strokeStyle = previewWt.color + "88";
      ctx.lineWidth = previewWt.width;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(wallStart.x, wallStart.y);
      ctx.lineTo(wallPreview.x, wallPreview.y);
      ctx.stroke();
      ctx.setLineDash([]);
      // Draw intersection dots
      ctx.fillStyle = previewWt.color;
      ctx.beginPath();
      ctx.arc(wallStart.x, wallStart.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(wallPreview.x, wallPreview.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fog of war — use theme-aware fog color
    const fogDark = "rgba(4,4,10,0.88)";
    const fogDim  = "rgba(4,4,10,0.50)";
    const fogEdge = "rgba(4,4,10,0.25)";

    const drawFogCell = (gx, gy, alpha) => {
      ctx.fillStyle = alpha === "dim" ? fogDim : fogDark;
      ctx.fillRect(gx * gridSize, gy * gridSize, gridSize, gridSize);
    };

    // Helper: check if neighbor cell is also fogged (for edge softening)
    const isFogged = (gx, gy, foggedSet) => foggedSet.has(gx + "," + gy);

    if (fogEnabled && fogMode === "manual") {
      const foggedSet = new Set();
      Object.entries(fogCells).forEach(([key, val]) => { if (val) foggedSet.add(key); });
      foggedSet.forEach(key => {
        const [gx, gy] = key.split(",").map(Number);
        drawFogCell(gx, gy, "full");
      });
      // Soft edges on borders of fogged areas
      foggedSet.forEach(key => {
        const [gx, gy] = key.split(",").map(Number);
        [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy]) => {
          if (!isFogged(gx+dx, gy+dy, foggedSet)) {
            ctx.fillStyle = fogEdge;
            ctx.fillRect((gx+dx) * gridSize, (gy+dy) * gridSize, gridSize, gridSize);
          }
        });
      });
    } else if (fogEnabled && fogMode === "vision") {
      const visibleCells = computeVisibleCells(tokens, walls, gridSize, mapW, mapH);
      if (visibleCells) {
        const maxGX = Math.ceil(mapW / gridSize);
        const maxGY = Math.ceil(mapH / gridSize);
        const fullFogSet = new Set();
        for (let gx = 0; gx < maxGX; gx++) {
          for (let gy = 0; gy < maxGY; gy++) {
            const key = gx + "," + gy;
            if (fogCells[key] === false) continue; // manually revealed
            const vis = visibleCells[key];
            if (vis === "full") continue;
            if (vis === "dim") {
              drawFogCell(gx, gy, "dim");
            } else {
              drawFogCell(gx, gy, "full");
              fullFogSet.add(key);
            }
          }
        }
        // Soft edges around fully visible areas bordering fog
        fullFogSet.forEach(key => {
          const [gx, gy] = key.split(",").map(Number);
          [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy]) => {
            const nk = (gx+dx) + "," + (gy+dy);
            const nVis = visibleCells[nk];
            if (nVis === "full" || fogCells[nk] === false) {
              ctx.fillStyle = fogEdge;
              ctx.fillRect(gx * gridSize, gy * gridSize, gridSize, gridSize);
            }
          });
        });
      }
    }

    // ── Tactical Overlays: Threat Zones ──
    if (combatLive && !fogMode?.startsWith?.("paint")) {
      const activeTk = activeCombatantId ? tokens.find(t => t.id === activeCombatantId) : null;
      tokens.forEach(t => {
        if ((t.hp || 0) <= 0) return;
        if (t.hidden && viewRole === "player") return;
        const reach = getThreatReachFt(t);
        if (reach <= 0) return;
        // Only show threat zones for enemies of the active combatant
        if (activeTk && activeTk.tokenType === t.tokenType) return;
        if (!activeTk && viewRole === "player" && t.tokenType === "pc") return;
        const reachPx = (reach / 5) * gridSize;
        const canReact = canTokenTakeReactionNow(t);
        const alpha = canReact ? 0.08 : 0.03;
        const strokeAlpha = canReact ? 0.25 : 0.08;
        const sizeMult = ({ tiny:0.5, small:1, medium:1, large:2, huge:3, gargantuan:4 })[t.size || "medium"] || 1;
        const tokenR = gridSize * 0.44 * sizeMult;
        // Feathered threat area (danger = muted red)
        ctx.save();
        const zoneR = reachPx + tokenR;
        ctx.beginPath();
        ctx.arc(t.x, t.y, zoneR, 0, Math.PI * 2);
        const tzGrad = ctx.createRadialGradient(t.x, t.y, tokenR, t.x, t.y, zoneR);
        const tzCol = canReact ? "180,55,45" : "160,90,55";
        tzGrad.addColorStop(0, "rgba(" + tzCol + "," + (alpha * 1.5) + ")");
        tzGrad.addColorStop(0.7, "rgba(" + tzCol + "," + alpha + ")");
        tzGrad.addColorStop(1, "rgba(" + tzCol + ",0.0)");
        ctx.fillStyle = tzGrad;
        ctx.fill();
        // Dashed border
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = "rgba(" + tzCol + "," + strokeAlpha + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      });
    }

    // Movement overlay
    if (movementMode && selectedToken) {
      const speedCells = getMovementBudgetCells(selectedToken);
      const usedCells = Math.min(movementPath.length, speedCells);
      const remaining = Math.max(0, speedCells - usedCells);
      const origin = movementOrigin || { x: selectedToken.x, y: selectedToken.y };
      const originGX = Math.floor(origin.x / gridSize);
      const originGY = Math.floor(origin.y / gridSize);

      // Show reachable range (softer fill, consistent green for safe movement)
      for (let dx = -speedCells; dx <= speedCells; dx++) {
        for (let dy = -speedCells; dy <= speedCells; dy++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          if (dist > remaining) continue;
          const gx = originGX + dx;
          const gy = originGY + dy;
          if (gx < 0 || gy < 0) continue;
          const distFade = 1 - (dist / Math.max(1, remaining)) * 0.4;
          ctx.fillStyle = "rgba(70,180,110," + (0.10 * distFade) + ")";
          ctx.fillRect(gx * gridSize, gy * gridSize, gridSize, gridSize);
        }
      }

      // Draw movement path
      if (movementPath.length > 0) {
        ctx.strokeStyle = "rgba(70,200,120,0.55)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        movementPath.forEach(p => {
          ctx.lineTo(p.x * gridSize + gridSize / 2, p.y * gridSize + gridSize / 2);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ── Opportunity Attack Warning Zones ──
      if (combatLive && !selectedToken.combatDisengage) {
        const hostileThreats = getHostileTargets(selectedToken).filter(h => canTokenTakeReactionNow(h) && getThreatReachFt(h) > 0);
        hostileThreats.forEach(hostile => {
          const reachFt = getThreatReachFt(hostile);
          const reachPx = (reachFt / 5) * gridSize;
          const hostSizeMult = ({ tiny:0.5, small:1, medium:1, large:2, huge:3, gargantuan:4 })[hostile.size || "medium"] || 1;
          const hostR = gridSize * 0.44 * hostSizeMult;
          const currentDist = Math.hypot(selectedToken.x - hostile.x, selectedToken.y - hostile.y);
          const inReach = currentDist <= reachPx + hostR + gridSize * 0.5;
          if (inReach) {
            // Draw danger zone with feathered edge
            ctx.save();
            const oaR = reachPx + hostR;
            // Feathered fill
            ctx.beginPath();
            ctx.arc(hostile.x, hostile.y, oaR, 0, Math.PI * 2);
            const oaGrad = ctx.createRadialGradient(hostile.x, hostile.y, oaR * 0.5, hostile.x, hostile.y, oaR);
            oaGrad.addColorStop(0, "rgba(180,50,40,0.04)");
            oaGrad.addColorStop(0.8, "rgba(180,50,40,0.06)");
            oaGrad.addColorStop(1, "rgba(180,50,40,0.0)");
            ctx.fillStyle = oaGrad;
            ctx.fill();
            // Dashed boundary
            ctx.beginPath();
            ctx.arc(hostile.x, hostile.y, oaR, 0, Math.PI * 2);
            ctx.setLineDash([8, 4]);
            ctx.strokeStyle = "rgba(180,50,40,0.35)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
            // Small label
            ctx.font = "bold 9px 'Cinzel', serif";
            ctx.fillStyle = "rgba(200,70,60,0.7)";
            ctx.textAlign = "center";
            ctx.fillText("OA ZONE", hostile.x, hostile.y - oaR - 4);
            ctx.restore();
          }
        });
      }
    }

    // Props (below tokens layer)
    props.filter(p => p.layer === "below").forEach(p => {
      let pImg = propImagesCache.current[p.id];
      if (!pImg && p.src) {
        pImg = new Image();
        pImg.onload = () => { propImagesCache.current[p.id] = pImg; render(); };
        pImg.src = p.src;
        return;
      }
      if (!pImg) return;
      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      ctx.rotate((p.rotation || 0) * Math.PI / 180);
      ctx.globalAlpha = p.locked ? 0.85 : 1;
      ctx.drawImage(pImg, -p.width / 2, -p.height / 2, p.width, p.height);
      // Selection outline
      if (p.id === selectedPropId) {
        ctx.strokeStyle = "#58aaff";
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([6 / zoom, 4 / zoom]);
        ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.setLineDash([]);
        // Resize handles
        const hs = 8 / zoom;
        [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([dx,dy]) => {
          ctx.fillStyle = "#58aaff";
          ctx.fillRect(dx * p.width / 2 - hs / 2, dy * p.height / 2 - hs / 2, hs, hs);
        });
      }
      ctx.restore();
    });

    // Region markers on map overview (when no scene is active)
    if (activeMapId && !activeSceneId) {
      const map = battleMaps.find(m => m.id === activeMapId);
      if (map && map.regionMarkers) {
        map.regionMarkers.forEach(marker => {
          const scene = (map.scenes || []).find(s => s.id === marker.sceneId);
          if (!scene) return;
          ctx.save();
          // Pulsing glow
          const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 600);
          ctx.shadowColor = "rgba(212,67,58,0.7)";
          ctx.shadowBlur = 12 * pulse;
          // Pin circle
          ctx.beginPath();
          ctx.arc(marker.x, marker.y, gridSize * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(212,67,58,0.25)";
          ctx.fill();
          ctx.strokeStyle = "rgba(212,67,58,0.8)";
          ctx.lineWidth = 2 / zoom;
          ctx.stroke();
          ctx.shadowBlur = 0;
          // Icon dot
          ctx.beginPath();
          ctx.arc(marker.x, marker.y, gridSize * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(212,67,58,0.9)";
          ctx.fill();
          // Label
          ctx.font = (12 / zoom) + "px " + "'Cinzel', serif";
          ctx.fillStyle = "#f2e8d6";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(marker.label || scene.name, marker.x, marker.y + gridSize * 1);
          ctx.restore();
        });
      }
    }

    // Tokens
    const now = Date.now();
    tokens.forEach(t => {
      // Skip hidden tokens in player view
      if (t.hidden && viewRole === "player") return;

      const sizeMult = ({ tiny:0.5, small:1, medium:1, large:2, huge:3, gargantuan:4 })[t.size || "medium"] || 1;
      const r = gridSize * 0.44 * sizeMult;
      const isSelected = t.id === selectedTokenId;
      const isHovered = t.id === hoveredTokenId;
      const isActiveCombatant = t.id === activeCombatantId;
      const isActiveTarget = combatLive && t.id === activeCombatTargetId && !isActiveCombatant;
      const isValidTarget = activeWeapon && activeWeapon.actorToken.id !== t.id && (t.hp || 0) > 0 && !(t.hidden && viewRole === "player");
      const isDead = t.hp != null && t.hp <= 0;
      const isPC = t.tokenType === "pc" || t.color === "#2e8b57";

      const linkedCombatant = combatants.find(c => c.mapTokenId === t.id);
      const allConds = getMergedConditionsForToken(t);
      const tokenTurnState = turnStateByToken[t.id] || defaultTurnState(t);
      const moveBudgetFt = getEffectiveMovementRemaining(t);

      // Vision radius indicator (only for selected token in select mode)
      if (isSelected && fogMode === "vision" && t.vision > 0) {
        const vr = t.vision * gridSize;
        ctx.beginPath();
        ctx.arc(t.x, t.y, vr, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(110,160,250,0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        if (t.darkvision && t.darkvision > t.vision) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.darkvision * gridSize, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(165,120,255,0.15)";
          ctx.stroke();
        }
      }

      // Role-based ambient glow (layered under token for elevation effect)
      const roleGlowColor = isPC ? "rgba(70,200,120," : "rgba(200,60,50,";
      if (!isDead) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 8, 0, Math.PI * 2);
        const roleGrad = ctx.createRadialGradient(t.x, t.y, r * 0.8, t.x, t.y, r + 8);
        roleGrad.addColorStop(0, roleGlowColor + "0.12)");
        roleGrad.addColorStop(0.6, roleGlowColor + "0.05)");
        roleGrad.addColorStop(1, roleGlowColor + "0.0)");
        ctx.fillStyle = roleGrad;
        ctx.fill();
      }

      // Drop shadow under token (deeper for elevated feel)
      ctx.beginPath();
      ctx.arc(t.x + 1, t.y + 4, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,6,0.55)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(t.x, t.y + 2, r + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,6,0.3)";
      ctx.fill();

      // Active combatant glow (pulsing gold/amber — "it's your turn" indicator)
      if (isActiveCombatant && combatLive) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 400);
        // Outer soft glow
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 12, 0, Math.PI * 2);
        const activeGrad = ctx.createRadialGradient(t.x, t.y, r, t.x, t.y, r + 12);
        activeGrad.addColorStop(0, "rgba(255,200,50," + (0.10 + 0.08 * pulse) + ")");
        activeGrad.addColorStop(1, "rgba(255,180,30,0.0)");
        ctx.fillStyle = activeGrad;
        ctx.fill();
        // Outer ring
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 10, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,200,50," + (0.2 + 0.25 * pulse) + ")";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Inner ring
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,215,0," + (0.45 + 0.4 * pulse) + ")";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Focus target ring so the current actor's chosen target is obvious on the map
      if (isActiveTarget) {
        const pulse = 0.45 + 0.55 * Math.sin(now / 340);
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 213, 79, " + (0.55 + 0.35 * pulse) + ")";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (combatLive && (isActiveCombatant || isSelected) && !isDead) {
        const threatRadius = r + gridSize * 0.95;
        const threatCol = isPC ? "rgba(70,180,110," : "rgba(180,60,50,";
        // Soft filled threat zone
        ctx.beginPath();
        ctx.arc(t.x, t.y, threatRadius, 0, Math.PI * 2);
        const tGrad = ctx.createRadialGradient(t.x, t.y, r, t.x, t.y, threatRadius);
        tGrad.addColorStop(0, threatCol + "0.06)");
        tGrad.addColorStop(0.8, threatCol + "0.03)");
        tGrad.addColorStop(1, threatCol + "0.0)");
        ctx.fillStyle = tGrad;
        ctx.fill();
        // Dashed border
        ctx.beginPath();
        ctx.arc(t.x, t.y, threatRadius, 0, Math.PI * 2);
        ctx.strokeStyle = threatCol + "0.20)";
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Valid target highlight during ability targeting (green = targetable)
      if (isValidTarget && !isSelected && !isHovered) {
        ctx.save();
        const pulseVal = 0.35 + 0.3 * Math.sin(Date.now() / 400);
        // Soft outer glow
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 9, 0, Math.PI * 2);
        const vtGrad = ctx.createRadialGradient(t.x, t.y, r, t.x, t.y, r + 9);
        vtGrad.addColorStop(0, "rgba(94,224,154," + (pulseVal * 0.15) + ")");
        vtGrad.addColorStop(1, "rgba(94,224,154,0.0)");
        ctx.fillStyle = vtGrad;
        ctx.fill();
        // Ring
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(94,224,154," + pulseVal + ")";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Hover highlight ring (brighter during weapon targeting)
      if (isHovered && !isSelected && !isActiveCombatant) {
        const hoverIntensity = activeWeapon ? 0.55 : 0.25;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = activeWeapon ? "rgba(94,224,154," + hoverIntensity + ")" : "rgba(255,255,255," + hoverIntensity + ")";
        ctx.lineWidth = activeWeapon ? 3 : 2;
        ctx.stroke();
      }

      // Selection ring (gold with soft radial glow — consistent "active focus" semantic)
      if (isSelected) {
        // Soft radial glow behind ring
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 10, 0, Math.PI * 2);
        const selGrad = ctx.createRadialGradient(t.x, t.y, r, t.x, t.y, r + 10);
        selGrad.addColorStop(0, "rgba(255,215,0,0.10)");
        selGrad.addColorStop(1, "rgba(255,200,30,0.0)");
        ctx.fillStyle = selGrad;
        ctx.fill();
        // Crisp gold ring
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,215,0,0.85)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Hidden token opacity for DM view
      if (t.hidden && viewRole === "dm") {
        ctx.globalAlpha = 0.4;
      }

      // Dead/unconscious desaturation
      if (isDead) {
        ctx.globalAlpha = Math.max(ctx.globalAlpha * 0.5, 0.2);
      }

      // Token flash/shake effect
      const flash = tokenFlashes[t.id];
      if (flash) {
        const flashAge = (Date.now() - flash.time) / 600;
        if (flashAge < 1) {
          const shakeAmt = flash.type === "damage" ? 3 * (1 - flashAge) : 1.5 * (1 - flashAge);
          const shakeX = Math.sin(flashAge * Math.PI * 6) * shakeAmt;
          const shakeY = Math.cos(flashAge * Math.PI * 4) * shakeAmt;
          ctx.translate(shakeX, shakeY);
          // Flash overlay
          if (flash.type === "damage" && flashAge < 0.3) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(t.x, t.y, r + 4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,60,40," + (0.4 * (1 - flashAge / 0.3)) + ")";
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // Token circle — image or color fill
      let hasTokenImage = false;
      if (t.imageSrc) {
        let cachedImg = tokenImagesCache.current[t.id];
        if (!cachedImg) {
          cachedImg = new Image();
          cachedImg.src = t.imageSrc;
          tokenImagesCache.current[t.id] = cachedImg;
        }
        if (cachedImg.complete && cachedImg.naturalWidth > 0) {
          hasTokenImage = true;
          ctx.save();
          ctx.beginPath();
          ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(cachedImg, t.x - r, t.y - r, r * 2, r * 2);
          ctx.restore();
        }
      }
      if (!hasTokenImage) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isDead ? "#444" : t.color;
        ctx.fill();
        // Inner highlight (subtle top-light effect)
        if (!isDead) {
          ctx.beginPath();
          ctx.arc(t.x, t.y - r * 0.15, r * 0.75, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fill();
        }
      }
      ctx.beginPath();
      ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
      const defaultBorder = isDead ? "rgba(60,60,60,0.6)" : isPC ? "rgba(70,180,110,0.45)" : "rgba(180,60,50,0.45)";
      ctx.strokeStyle = isSelected ? "rgba(255,220,30,0.9)" : isHovered ? "rgba(255,255,255,0.55)" : defaultBorder;
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 1.8;
      ctx.stroke();

      if (combatLive && (isSelected || isActiveCombatant) && !isDead) {
        const moveMaxFt = Math.max(5, t.speed || 30);
        const moveFrac = Math.max(0, Math.min(1, moveBudgetFt / moveMaxFt));
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (moveFrac || 0.0001));
        ctx.strokeStyle = moveBudgetFt > 0 ? "rgba(88,170,255,0.9)" : "rgba(120,120,140,0.4)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.lineCap = "butt";
      }
      // Thin inner border for definition
      if (!isDead && !hasTokenImage) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, r - 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Label (larger font for readability, custom label support) — skip if token has image
      if (!hasTokenImage) {
        ctx.fillStyle = isDead ? "#999" : "#fff";
        const labelFontSize = Math.max(10, gridSize * 0.24 * sizeMult);
        ctx.font = "bold " + labelFontSize + "px Cinzel";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const displayLabel = t.label || (t.name.length > 3 ? t.name.substring(0,3) : t.name);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillText(displayLabel, t.x + 0.5, t.y + 0.5);
        ctx.fillStyle = isDead ? "#999" : "#fff";
        ctx.fillText(displayLabel, t.x, t.y);
      } else {
        // Name below token image
        if (isSelected || isHovered || isActiveCombatant || isDead) {
          const labelFontSize = Math.max(8, gridSize * 0.18 * sizeMult);
          ctx.font = "bold " + labelFontSize + "px Cinzel";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillText(t.name.length > 8 ? t.name.substring(0,8) : t.name, t.x + 0.5, t.y + r + 3.5);
          ctx.fillStyle = "#fff";
          ctx.fillText(t.name.length > 8 ? t.name.substring(0,8) : t.name, t.x, t.y + r + 3);
        }
      }

      // Dead X overlay
      if (isDead) {
        ctx.strokeStyle = "rgba(255,60,60,0.7)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(t.x - r * 0.5, t.y - r * 0.5);
        ctx.lineTo(t.x + r * 0.5, t.y + r * 0.5);
        ctx.moveTo(t.x + r * 0.5, t.y - r * 0.5);
        ctx.lineTo(t.x - r * 0.5, t.y + r * 0.5);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // HP bar (always visible during combat — thicker, brighter, clear at a glance)
      const hpFrac = t.maxHp ? Math.max(0, (t.hp || 0) / t.maxHp) : 0;
      const showHpBar = t.hp != null && t.maxHp && (combatLive || isSelected || isHovered || isActiveCombatant || isDead || hpFrac < 1);
      if (showHpBar) {
        const barW = gridSize * 0.95 * sizeMult, barH = 7;
        const barR = barH / 2;
        const barX = t.x - barW/2, barY = t.y + r + 5;
        // Backdrop shadow (deeper for separation)
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.beginPath();
        drawRoundedRectPath(ctx, barX - 1, barY - 1, barW + 2, barH + 2, barR + 1);
        ctx.fill();
        // Background track (visible dark track so empty HP is clear)
        ctx.fillStyle = "rgba(40,35,45,0.85)";
        ctx.beginPath();
        drawRoundedRectPath(ctx, barX, barY, barW, barH, barR);
        ctx.fill();
        // Subtle track border for definition
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        drawRoundedRectPath(ctx, barX, barY, barW, barH, barR);
        ctx.stroke();
        // HP fill
        if (hpFrac > 0) {
          ctx.save();
          ctx.beginPath();
          drawRoundedRectPath(ctx, barX, barY, barW, barH, barR);
          ctx.clip();
          const hpCol = getHpColor(t.hp, t.maxHp);
          ctx.fillStyle = hpCol;
          ctx.fillRect(barX, barY, barW * hpFrac, barH);
          // Top shine for gloss effect
          ctx.fillStyle = "rgba(255,255,255,0.22)";
          ctx.fillRect(barX, barY, barW * hpFrac, barH * 0.35);
          // Bottom subtle shadow
          ctx.fillStyle = "rgba(0,0,0,0.15)";
          ctx.fillRect(barX, barY + barH * 0.7, barW * hpFrac, barH * 0.3);
          ctx.restore();
        }
        // HP text (show on hover/selected/active)
        if (isSelected || isHovered || isActiveCombatant) {
          const hpText = (t.hp || 0) + "/" + t.maxHp;
          ctx.font = "bold " + Math.max(8, gridSize * 0.15) + "px Cinzel";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = "rgba(0,0,0,0.65)";
          ctx.fillText(hpText, t.x + 0.5, barY + barH + 1.5);
          ctx.fillStyle = "#fff";
          ctx.fillText(hpText, t.x, barY + barH + 1);
        }
      }

      // Condition indicators (small colored dots around top of token)
      if (allConds.length > 0) {
        const condColorMap = {};
        DND_CONDITIONS.forEach(dc => { condColorMap[dc.name] = dc.color; });
        const maxDots = Math.min(allConds.length, 8);
        for (let ci = 0; ci < maxDots; ci++) {
          const angle = -Math.PI/2 + (ci / maxDots) * Math.PI * 2;
          const dotR = r + 8;
          const dx = t.x + Math.cos(angle) * dotR;
          const dy = t.y + Math.sin(angle) * dotR;
          // Dot with shadow
          ctx.beginPath();
          ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(dx, dy, 3, 0, Math.PI * 2);
          ctx.fillStyle = condColorMap[allConds[ci]] || "#aaa";
          ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.4)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      if (!isDead && allConds.includes("Concentrating")) {
        drawTokenStateBadge(ctx, t.x + r + 10, t.y - r - 8, "C", "#ffd54f", "rgba(232,148,10,0.7)");
      }

      if (combatLive && !isDead && tokenTurnState.reactionSpent) {
        drawTokenStateBadge(ctx, t.x + r + 10, t.y + r + 12, "R", "rgba(181,116,255,0.65)", "rgba(181,116,255,0.35)");
      }

      // Active combatant name label below token
      if (isActiveCombatant && combatLive) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        const nameY = t.y + r + (t.hp != null && t.maxHp ? 22 : 8);
        const nameW = ctx.measureText(t.name).width + 8;
        ctx.fillRect(t.x - nameW/2, nameY - 5, nameW, 12);
        ctx.fillStyle = "#f2e8d6";
        ctx.font = "bold " + Math.max(7, gridSize * 0.16) + "px Cinzel";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(t.name, t.x, nameY + 1);
      }

      // Hidden indicator (DM only)
      if (t.hidden && viewRole === "dm") {
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // ── Inline floating combat text (world space) ──
    if (inlineFloats.length > 0) {
      const now = Date.now();
      inlineFloats.forEach(f => {
        const age = (now - f.time) / 2000; // 2s total lifetime
        if (age >= 1) return;
        const fadeIn = Math.min(1, age * 8); // fast fade in
        const fadeOut = age > 0.6 ? Math.max(0, 1 - (age - 0.6) / 0.4) : 1;
        const alpha = fadeIn * fadeOut;
        const yOffset = -30 * age; // float upward
        const scale = f.style === "crit" ? 1.4 : (f.style === "damage" ? 1.2 : 1.0);
        const fontSize = f.style === "crit" ? 20 : (f.style === "damage" || f.style === "heal" ? 16 : 12);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold " + Math.round(fontSize * scale) + "px 'Cinzel', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Glow
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Outline
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = 3;
        ctx.strokeText(f.text, f.x, f.y + yOffset);

        // Fill
        ctx.fillStyle = f.color;
        ctx.fillText(f.text, f.x, f.y + yOffset);
        ctx.restore();
      });
    }

    // ── Weapon targeting preview (world space) ──
    if (activeWeapon) {
      const aw = activeWeapon;
      const attacker = aw.actorToken;
      const rangeFt = aw.card?.data?.range || 5;
      const rangePx = (rangeFt / 5) * gridSize;
      const isMelee = rangeFt <= 10;
      const wColor = isMelee ? (cssVar("--crimson") || "#f06858") : "#58aaff";
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300); // smooth pulse 0-1
      // Range circle from attacker (feathered edges, softer gradient)
      if (attacker && rangePx > 0) {
        // Feathered fill — gradient fades out at edges
        const rGrad = ctx.createRadialGradient(attacker.x, attacker.y, 0, attacker.x, attacker.y, rangePx);
        rGrad.addColorStop(0, wColor + "08");
        rGrad.addColorStop(0.7, wColor + "05");
        rGrad.addColorStop(0.9, wColor + "03");
        rGrad.addColorStop(1, wColor + "00");
        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.arc(attacker.x, attacker.y, rangePx, 0, Math.PI * 2);
        ctx.fill();
        // Soft dashed border
        ctx.beginPath();
        ctx.arc(attacker.x, attacker.y, rangePx, 0, Math.PI * 2);
        ctx.strokeStyle = wColor + "33";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        // Feathered edge ring (thin gradient ring at boundary)
        ctx.beginPath();
        ctx.arc(attacker.x, attacker.y, rangePx, 0, Math.PI * 2);
        const edgeGrad = ctx.createRadialGradient(attacker.x, attacker.y, rangePx - 6, attacker.x, attacker.y, rangePx + 2);
        edgeGrad.addColorStop(0, wColor + "00");
        edgeGrad.addColorStop(0.5, wColor + "0a");
        edgeGrad.addColorStop(1, wColor + "00");
        ctx.strokeStyle = edgeGrad;
        ctx.lineWidth = 8;
        ctx.stroke();
      }
      const wt = weaponTargetRef.current;
      if (wt && attacker) {
        // ── Dotted line from attacker to cursor (ranged) or short line (melee) ──
        if (!isMelee) {
          // Ranged: dotted trajectory line from attacker to cursor
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(attacker.x, attacker.y);
          ctx.lineTo(wt.x, wt.y);
          ctx.strokeStyle = wColor + "88";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
          // Arrowhead at cursor
          const angle = Math.atan2(wt.y - attacker.y, wt.x - attacker.x);
          const arrLen = gridSize * 0.3;
          ctx.beginPath();
          ctx.moveTo(wt.x, wt.y);
          ctx.lineTo(wt.x - Math.cos(angle - 0.4) * arrLen, wt.y - Math.sin(angle - 0.4) * arrLen);
          ctx.moveTo(wt.x, wt.y);
          ctx.lineTo(wt.x - Math.cos(angle + 0.4) * arrLen, wt.y - Math.sin(angle + 0.4) * arrLen);
          ctx.strokeStyle = wColor + "bb";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();
        } else {
          // Melee: short arc from attacker toward cursor
          const angle = Math.atan2(wt.y - attacker.y, wt.x - attacker.x);
          ctx.save();
          ctx.beginPath();
          ctx.arc(attacker.x, attacker.y, gridSize * 0.6, angle - 0.5, angle + 0.5);
          ctx.strokeStyle = wColor + "66";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        }

        // ── Hovered token targeting tooltip (grouped HP + hit odds + damage) ──
        const hovTk = hoveredTokenId ? tokens.find(t => t.id === hoveredTokenId) : null;
        if (hovTk && hovTk.id !== attacker.id) {
          const distToHov = Math.hypot(hovTk.x - attacker.x, hovTk.y - attacker.y);
          const inRange = distToHov <= rangePx + gridSize * 0.5;
          const glowColor = inRange ? "rgba(94,224,154," : "rgba(180,60,50,";
          const tr = gridSize * 0.48;
          // Target highlight ring with soft glow
          ctx.save();
          // Outer glow
          ctx.beginPath();
          ctx.arc(hovTk.x, hovTk.y, tr + 7, 0, Math.PI * 2);
          const tGlowGrad = ctx.createRadialGradient(hovTk.x, hovTk.y, tr, hovTk.x, hovTk.y, tr + 10);
          tGlowGrad.addColorStop(0, glowColor + "0.15)");
          tGlowGrad.addColorStop(1, glowColor + "0.0)");
          ctx.fillStyle = tGlowGrad;
          ctx.fill();
          // Crisp ring
          ctx.beginPath();
          ctx.arc(hovTk.x, hovTk.y, tr + 4, 0, Math.PI * 2);
          ctx.strokeStyle = glowColor + "0.75)";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();

          // ── Grouped tooltip panel with dark backdrop ──
          const distFt = Math.round(distToHov / gridSize * 5);
          const tAC = hovTk.ac || 10;
          const wData = activeWeapon.card?.data;
          const toHitBonus = wData ? wData.toHit : 0;
          const damageExpr = wData ? wData.damageExpr : "?";
          const damageType = wData ? wData.damageType : "";
          const needed = tAC - toHitBonus;
          const hitChance = Math.min(100, Math.max(5, Math.round((21 - Math.max(2, needed)) / 20 * 100)));
          const hitColor = hitChance >= 70 ? "#5ee09a" : hitChance >= 40 ? "#ffd54f" : "#f06858";

          // Outcome prediction — parse "1d8+3" or "2d6+5" style damage expressions
          const diceMatch = (damageExpr || "").match(/^(\d+)d(\d+)/);
          const modMatch = (damageExpr || "").match(/[+-]\d+/);
          const dmgMod = modMatch ? parseInt(modMatch[0]) : 0;
          const avgDamage = diceMatch ? (parseInt(diceMatch[1]) * (parseInt(diceMatch[2]) + 1) / 2 + dmgMod) : 0;
          const minDamage = diceMatch ? Math.max(1, parseInt(diceMatch[1]) + dmgMod) : 0;
          const maxDamage = diceMatch ? (parseInt(diceMatch[1]) * parseInt(diceMatch[2]) + dmgMod) : 0;
          const expectedDamage = Math.round(avgDamage * hitChance / 100);
          const killChance = hovTk.hp > 0 ? Math.min(100, Math.round(hitChance * Math.min(1, maxDamage / hovTk.hp) * 100) / 100) : 0;

          // Tooltip dimensions
          const pW = gridSize * 2.4;
          const pH = inRange ? (diceMatch ? gridSize * 2.1 : gridSize * 1.5) : gridSize * 0.9;
          const pX = hovTk.x - pW / 2;
          const pY = hovTk.y - tr - pH - 12;
          const pR = 8;
          const fs1 = Math.round(gridSize * 0.24);
          const fs2 = Math.round(gridSize * 0.18);
          const fs3 = Math.round(gridSize * 0.16);

          // Dark panel background
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 2;
          ctx.fillStyle = "rgba(12, 8, 4, 0.92)";
          ctx.beginPath();
          drawRoundedRectPath(ctx, pX, pY, pW, pH, pR);
          ctx.fill();
          ctx.shadowBlur = 0;
          // Border
          ctx.strokeStyle = inRange ? "rgba(94,224,154,0.4)" : "rgba(255,68,68,0.4)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();

          // Pointer arrow
          ctx.fillStyle = "rgba(12, 8, 4, 0.92)";
          ctx.beginPath();
          ctx.moveTo(hovTk.x - 6, pY + pH);
          ctx.lineTo(hovTk.x, pY + pH + 6);
          ctx.lineTo(hovTk.x + 6, pY + pH);
          ctx.closePath();
          ctx.fill();

          const cX = pX + pW / 2; // center x
          let curY = pY + 10;

          // Name row
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = "#f2e8d6";
          ctx.font = "bold " + fs1 + "px Cinzel";
          ctx.fillText(hovTk.name, cX, curY);
          curY += fs1 + 4;

          // HP bar (inside tooltip)
          const hpFrac = hovTk.maxHp ? Math.max(0, (hovTk.hp || 0) / hovTk.maxHp) : 0;
          if (hovTk.maxHp) {
            const bW = pW - 20, bH = 6, bX = pX + 10, bY = curY;
            const hpCol = getHpColor(hovTk.hp || 0, hovTk.maxHp);
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.beginPath();
            drawRoundedRectPath(ctx, bX, bY, bW, bH, 3);
            ctx.fill();
            if (hpFrac > 0) {
              ctx.fillStyle = hpCol;
              ctx.beginPath();
              drawRoundedRectPath(ctx, bX, bY, Math.max(bH, bW * hpFrac), bH, 3);
              ctx.fill();
            }
            // HP text right of bar
            ctx.textAlign = "right";
            ctx.font = fs3 + "px Spectral";
            ctx.fillStyle = hpCol;
            ctx.fillText((hovTk.hp || 0) + "/" + hovTk.maxHp, pX + pW - 10, bY + bH + 2);
            ctx.textAlign = "left";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText("AC " + tAC, pX + 10, bY + bH + 2);
            curY = bY + bH + fs3 + 6;
          }

          if (inRange) {
            // Hit chance row
            const hitBarW = pW - 20, hitBarH = 5, hitBarX = pX + 10, hitBarY = curY;
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.beginPath();
            drawRoundedRectPath(ctx, hitBarX, hitBarY, hitBarW, hitBarH, 2);
            ctx.fill();
            ctx.fillStyle = hitColor;
            ctx.beginPath();
            drawRoundedRectPath(ctx, hitBarX, hitBarY, Math.max(hitBarH, hitBarW * hitChance / 100), hitBarH, 2);
            ctx.fill();
            curY = hitBarY + hitBarH + 4;

            // Hit % and damage on same row
            ctx.textAlign = "left";
            ctx.font = "bold " + fs2 + "px Cinzel";
            ctx.fillStyle = hitColor;
            ctx.fillText(hitChance + "% hit", pX + 10, curY);
            ctx.textAlign = "right";
            ctx.fillStyle = "#e2e8f0";
            ctx.font = fs2 + "px Spectral";
            ctx.fillText(damageExpr + " " + damageType, pX + pW - 10, curY);
            curY += fs2 + 3;

            // Damage range
            if (diceMatch) {
              ctx.fillStyle = "#ccc";
              ctx.font = "bold 10px 'Cinzel', serif";
              ctx.textAlign = "left";
              ctx.fillText("Dmg: " + minDamage + "-" + maxDamage + " (avg " + Math.round(avgDamage) + ")", pX + 10, curY);
              curY += 14;
              // Expected damage & kill chance
              ctx.font = "9px 'Cinzel', serif";
              ctx.fillStyle = killChance >= 50 ? "#5ee09a" : "#ffd54f";
              ctx.fillText("Expected: ~" + expectedDamage + " dmg" + (hovTk.hp <= maxDamage ? "  |  Kill: " + killChance + "%" : ""), pX + 10, curY);
              curY += 14;
            }

            // Distance
            ctx.textAlign = "center";
            ctx.font = fs3 + "px Spectral";
            ctx.fillStyle = "#64748b";
            ctx.fillText(distFt + " ft", cX, curY);
          } else {
            // Out of range
            ctx.textAlign = "center";
            ctx.font = "bold " + fs2 + "px Cinzel";
            ctx.fillStyle = "#f06858";
            ctx.fillText("Out of range", cX, curY);
            curY += fs2 + 3;
            ctx.font = fs3 + "px Spectral";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(distFt + " ft / " + (wData ? wData.range : "?") + " ft max", cX, curY);
          }
          ctx.textAlign = "left";
        }

        // ── Crosshair at cursor (when no token is hovered) ──
        if (!hovTk) {
          const sz = gridSize * 0.4;
          ctx.shadowColor = wColor;
          ctx.shadowBlur = 6;
          ctx.strokeStyle = wColor + "aa";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(wt.x - sz, wt.y); ctx.lineTo(wt.x - sz * 0.3, wt.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wt.x + sz * 0.3, wt.y); ctx.lineTo(wt.x + sz, wt.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wt.x, wt.y - sz); ctx.lineTo(wt.x, wt.y - sz * 0.3); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wt.x, wt.y + sz * 0.3); ctx.lineTo(wt.x, wt.y + sz); ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }

    // ── Spell range preview (world space) ──
    if (activeSpell) {
      const rangeInPx = (activeSpell.range / 5) * gridSize;
      // Range circle — more visible with gradient fill (only shown when a token is selected)
      if (rangeInPx > 0 && selectedToken) {
        ctx.beginPath();
        ctx.arc(selectedToken.x, selectedToken.y, rangeInPx, 0, Math.PI * 2);
        ctx.strokeStyle = activeSpell.color + "66";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        const rangeGrad = ctx.createRadialGradient(selectedToken.x, selectedToken.y, rangeInPx * 0.8, selectedToken.x, selectedToken.y, rangeInPx);
        rangeGrad.addColorStop(0, "transparent");
        rangeGrad.addColorStop(1, activeSpell.color + "12");
        ctx.fillStyle = rangeGrad;
        ctx.fill();
        // Range label
        ctx.font = "bold 11px Cinzel";
        ctx.fillStyle = activeSpell.color + "aa";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(activeSpell.range + " ft", selectedToken.x, selectedToken.y - rangeInPx - 4);
      }
      // Multi-target selection markers (show already-selected targets)
      if (multiTargetSelections.length > 0) {
        multiTargetSelections.forEach((sel, idx) => {
          // Glowing ring around selected target
          ctx.beginPath();
          ctx.arc(sel.x, sel.y, gridSize * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = activeSpell.color + "cc";
          ctx.lineWidth = 3;
          ctx.stroke();
          // Number label
          ctx.fillStyle = activeSpell.color;
          ctx.font = "bold " + Math.round(gridSize * 0.35) + "px Cinzel";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText((idx + 1).toString(), sel.x, sel.y - gridSize * 0.6 - 8);
        });
      }
      // Targeting indicator at mouse position
      const curTarget = spellTargetRef.current;
      if (curTarget) {
        const aoeRadiusPx = (activeSpell.radius / 5) * gridSize;
        const pulseT = (Date.now() % 1500) / 1500;
        const pulseAlpha = 0.15 + Math.sin(pulseT * Math.PI * 2) * 0.1;

        if (activeSpell.shape === "sphere" && aoeRadiusPx > 0) {
          // Filled area with pulsing
          ctx.beginPath();
          ctx.arc(curTarget.x, curTarget.y, aoeRadiusPx, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(curTarget.x, curTarget.y, 0, curTarget.x, curTarget.y, aoeRadiusPx);
          grad.addColorStop(0, activeSpell.color + "33");
          grad.addColorStop(0.7, activeSpell.color + "18");
          grad.addColorStop(1, activeSpell.color + "08");
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = activeSpell.color + "aa";
          ctx.lineWidth = 2;
          ctx.stroke();
          // Inner ring pulse
          ctx.beginPath();
          ctx.arc(curTarget.x, curTarget.y, aoeRadiusPx * (0.3 + pulseT * 0.7), 0, Math.PI * 2);
          ctx.strokeStyle = activeSpell.color + Math.round(pulseAlpha * 255).toString(16).padStart(2, "0");
          ctx.lineWidth = 1;
          ctx.stroke();
          // Center dot
          ctx.beginPath();
          ctx.arc(curTarget.x, curTarget.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = activeSpell.color;
          ctx.fill();
        } else if (activeSpell.shape === "cone") {
          if (!selectedToken) { /* Can't render cone without origin token */ } else {
          const origin = selectedToken;
          const dx = curTarget.x - origin.x, dy = curTarget.y - origin.y;
          const angle = Math.atan2(dy, dx);
          const coneLenPx = (activeSpell.radius / 5) * gridSize;
          const spread = Math.PI / 4;
          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.arc(origin.x, origin.y, coneLenPx, angle - spread, angle + spread);
          ctx.closePath();
          const grad = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, coneLenPx);
          grad.addColorStop(0, activeSpell.color + "33");
          grad.addColorStop(1, activeSpell.color + "11");
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = activeSpell.color + "88";
          ctx.lineWidth = 2;
          ctx.stroke();
          }
        } else if (activeSpell.shape === "line") {
          if (!selectedToken) { /* Can't render line without origin token */ } else {
          const origin = selectedToken;
          const dx = curTarget.x - origin.x, dy = curTarget.y - origin.y;
          const dist = Math.hypot(dx, dy) || 1;
          const lineLenPx = (activeSpell.length / 5) * gridSize;
          const nx = dx/dist, ny = dy/dist;
          const widthPx = Math.max((activeSpell.radius / 5) * gridSize, gridSize * 0.5);
          const ex = origin.x + nx * lineLenPx, ey = origin.y + ny * lineLenPx;
          const px = -ny * widthPx, py = nx * widthPx;
          ctx.beginPath();
          ctx.moveTo(origin.x + px, origin.y + py);
          ctx.lineTo(ex + px, ey + py);
          ctx.lineTo(ex - px, ey - py);
          ctx.lineTo(origin.x - px, origin.y - py);
          ctx.closePath();
          ctx.fillStyle = activeSpell.color + "22";
          ctx.fill();
          ctx.strokeStyle = activeSpell.color + "88";
          ctx.lineWidth = 2;
          ctx.stroke();
          // Direction arrow
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - nx * 8 + px * 0.5, ey - ny * 8 + py * 0.5);
          ctx.lineTo(ex - nx * 8 - px * 0.5, ey - ny * 8 - py * 0.5);
          ctx.closePath();
          ctx.fillStyle = activeSpell.color + "88";
          ctx.fill();
          }
        } else if (activeSpell.shape === "cube") {
          const half = aoeRadiusPx;
          ctx.fillStyle = activeSpell.color + "22";
          ctx.fillRect(curTarget.x - half, curTarget.y - half, half * 2, half * 2);
          ctx.strokeStyle = activeSpell.color + "88";
          ctx.lineWidth = 2;
          ctx.strokeRect(curTarget.x - half, curTarget.y - half, half * 2, half * 2);
          // Center dot
          ctx.beginPath();
          ctx.arc(curTarget.x, curTarget.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = activeSpell.color;
          ctx.fill();
        } else {
          // Single target crosshair — much more visible
          const sz = gridSize * 0.5;
          // Outer glow
          ctx.shadowColor = activeSpell.color;
          ctx.shadowBlur = 10;
          ctx.strokeStyle = activeSpell.color + "cc";
          ctx.lineWidth = 2.5;
          // Crosshair lines
          ctx.beginPath(); ctx.moveTo(curTarget.x - sz, curTarget.y); ctx.lineTo(curTarget.x - sz * 0.3, curTarget.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(curTarget.x + sz * 0.3, curTarget.y); ctx.lineTo(curTarget.x + sz, curTarget.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(curTarget.x, curTarget.y - sz); ctx.lineTo(curTarget.x, curTarget.y - sz * 0.3); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(curTarget.x, curTarget.y + sz * 0.3); ctx.lineTo(curTarget.x, curTarget.y + sz); ctx.stroke();
          // Center circle with pulse
          ctx.beginPath(); ctx.arc(curTarget.x, curTarget.y, sz * 0.25, 0, Math.PI * 2); ctx.stroke();
          // Outer rotating ring
          const rotAngle = (Date.now() % 3000) / 3000 * Math.PI * 2;
          ctx.beginPath(); ctx.arc(curTarget.x, curTarget.y, sz * 0.7, rotAngle, rotAngle + Math.PI * 1.5); ctx.stroke();
          ctx.shadowBlur = 0;
          // Snap-to-token highlight: if near a token, show highlight
          const nearToken = tokens.find(t => Math.hypot(t.x - curTarget.x, t.y - curTarget.y) < gridSize * 1.2);
          if (nearToken) {
            ctx.beginPath();
            ctx.arc(nearToken.x, nearToken.y, gridSize * 0.55, 0, Math.PI * 2);
            ctx.strokeStyle = activeSpell.color + "88";
            ctx.lineWidth = 3;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    }

    // ── Spell cast effects (world space) — ENHANCED ──
    const nowSpell = Date.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const easeIn = t => t * t;
    const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    // Extract RGB from hex for dynamic coloring per-spell
    const hexRgb = (hex) => {
      const h = (hex || "#ffffff").replace("#", "");
      return [parseInt(h.substring(0,2),16)||200, parseInt(h.substring(2,4),16)||200, parseInt(h.substring(4,6),16)||200];
    };

    spellEffects.forEach(se => {
      const age = Math.min(1, (nowSpell - se.startTime) / 3500);
      if (age >= 1) return;
      const alpha = 1 - easeIn(age);
      const s = se.spell;
      const radiusPx = Math.max((s.radius / 5) * gridSize, gridSize * 0.6);
      const [cr, cg, cb] = hexRgb(s.color); // spell's unique color as RGB

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      if (s.effect === "explosion") {
        // FIREBALL / BURNING HANDS — massive multi-layered explosion
        const phase1 = Math.min(1, age * 3); // fast expand 0-0.33
        const phase2 = Math.min(1, Math.max(0, (age - 0.1) * 2)); // glow 0.1-0.6
        const phase3 = Math.min(1, Math.max(0, (age - 0.3) * 1.5)); // fade 0.3-1.0
        const expR = radiusPx * easeOut(phase1);

        // Ground scorch (stays longest) — uses spell color
        ctx.beginPath(); ctx.arc(se.x, se.y, expR * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + Math.floor(cr*0.15) + "," + Math.floor(cg*0.04) + ",0," + (0.3 * (1 - age)) + ")";
        ctx.fill();

        // Core flash (brief white)
        if (age < 0.15) {
          const flashAlpha = (1 - age / 0.15) * 0.6;
          ctx.beginPath(); ctx.arc(se.x, se.y, expR * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,240," + flashAlpha + ")";
          ctx.fill();
        }

        // Main explosion gradient — tinted with spell color
        const grad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, expR);
        grad.addColorStop(0, "rgba(" + Math.min(255,cr+60) + "," + Math.min(255,cg+60) + "," + Math.min(255,cb+60) + "," + (alpha * 0.7 * (1 - phase3 * 0.5)) + ")");
        grad.addColorStop(0.25, "rgba(" + cr + "," + Math.floor(cg*0.7) + "," + Math.floor(cb*0.3) + "," + (alpha * 0.6) + ")");
        grad.addColorStop(0.5, "rgba(" + Math.floor(cr*0.8) + "," + Math.floor(cg*0.3) + "," + Math.floor(cb*0.15) + "," + (alpha * 0.5) + ")");
        grad.addColorStop(0.8, "rgba(" + Math.floor(cr*0.5) + "," + Math.floor(cg*0.1) + ",0," + (alpha * 0.3) + ")");
        grad.addColorStop(1, "rgba(" + Math.floor(cr*0.2) + ",0,0,0)");
        ctx.beginPath(); ctx.arc(se.x, se.y, expR, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();

        // Expanding rings
        for (let ring = 0; ring < 3; ring++) {
          const ringAge = Math.max(0, age - ring * 0.08);
          const ringR = expR * (0.6 + ring * 0.2) * easeOut(Math.min(1, ringAge * 2.5));
          const ringAlpha = alpha * (0.4 - ring * 0.1);
          if (ringAlpha > 0) {
            ctx.beginPath(); ctx.arc(se.x, se.y, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(" + cr + "," + Math.max(0, cg - ring * 40) + "," + Math.floor(cb*0.2) + "," + ringAlpha + ")";
            ctx.lineWidth = 2 - ring * 0.5; ctx.stroke();
          }
        }

        // Spark particles flying outward
        for (let sp = 0; sp < 35; sp++) {
          const spAngle = (sp / 35) * Math.PI * 2 + sp * 0.7;
          const spSpeed = 0.4 + (sp % 7) * 0.12;
          const spDist = expR * spSpeed * easeOut(Math.min(1, age * 2));
          const spLife = 1 - Math.min(1, age * (1.5 + (sp % 3) * 0.3));
          if (spLife <= 0) continue;
          const sx = se.x + Math.cos(spAngle) * spDist + Math.sin(sp * 3.7) * 3;
          const sy = se.y + Math.sin(spAngle) * spDist + Math.cos(sp * 2.3) * 3;
          const spR = (1.5 + (sp % 4) * 0.5) * spLife;
          ctx.beginPath(); ctx.arc(sx, sy, spR, 0, Math.PI * 2);
          ctx.fillStyle = sp % 3 === 0 ? "rgba(" + Math.min(255,cr+40) + "," + Math.min(255,cg+40) + "," + Math.min(255,cb+40) + "," + (spLife * 0.8) + ")" : "rgba(" + cr + "," + Math.floor(cg*0.6) + "," + Math.floor(cb*0.3) + "," + (spLife * 0.7) + ")";
          ctx.fill();
        }

        // Rising embers (after main blast)
        if (age > 0.2) {
          const emberAge = (age - 0.2) / 0.8;
          for (let e = 0; e < 15; e++) {
            const ex = se.x + (((e * 17 + 3) % 40) - 20) * (expR / 40);
            const ey = se.y - emberAge * radiusPx * (0.5 + (e % 5) * 0.2) + Math.sin(e * 2.1 + age * 8) * 3;
            const eAlpha = Math.max(0, 1 - emberAge * 1.3) * 0.7;
            ctx.beginPath(); ctx.arc(ex, ey, 1 + (e % 3) * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + cr + "," + Math.min(255, cg + (e % 4) * 20) + "," + Math.floor(cb*0.3) + "," + eAlpha + ")";
            ctx.fill();
          }
        }

      } else if (s.effect === "bolt") {
        // LIGHTNING BOLT / ELDRITCH BLAST — forked lightning with bright core
        const boltAlpha = alpha;
        const dx = se.x - se.casterX, dy = se.y - se.casterY;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = dx / dist, ny = dy / dist;
        const progress = easeOut(Math.min(1, age * 4));
        const actualDist = dist * progress;

        // Glow behind bolt
        ctx.shadowColor = s.color; ctx.shadowBlur = 15 * boltAlpha;

        // Main bolt (white core)
        const drawBranch = (startX, startY, endX, endY, width, jitter, branchAlpha) => {
          const bdx = endX - startX, bdy = endY - startY;
          const bDist = Math.hypot(bdx, bdy);
          const steps = Math.max(8, Math.floor(bDist / 10));
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const j = (i < steps) ? ((((i * 7919 + Math.floor(se.startTime)) % 100) / 100) - 0.5) * jitter : 0;
            ctx.lineTo(startX + bdx * t + j * (-bdy/bDist), startY + bdy * t + j * (bdx/bDist));
          }
          // White core
          ctx.strokeStyle = "rgba(255,255,255," + (branchAlpha * 0.9) + ")";
          ctx.lineWidth = width; ctx.stroke();
          // Colored glow
          ctx.strokeStyle = s.color + Math.round(branchAlpha * 180).toString(16).padStart(2, "0");
          ctx.lineWidth = width * 3; ctx.stroke();
        };

        const endX = se.casterX + dx * progress;
        const endY = se.casterY + dy * progress;

        // Main bolt
        drawBranch(se.casterX, se.casterY, endX, endY, 2 * boltAlpha, 16, boltAlpha);

        // Side branches
        for (let b = 0; b < 5; b++) {
          const branchT = 0.2 + (b * 0.15);
          if (branchT > progress) continue;
          const bx = se.casterX + dx * branchT;
          const by = se.casterY + dy * branchT;
          const bAngle = ((b % 2 === 0 ? 1 : -1) * (0.3 + (((b * 3571) % 100) / 100) * 0.5));
          const bLen = 15 + (b % 3) * 10;
          const bEndX = bx + Math.cos(Math.atan2(dy, dx) + bAngle) * bLen;
          const bEndY = by + Math.sin(Math.atan2(dy, dx) + bAngle) * bLen;
          drawBranch(bx, by, bEndX, bEndY, 1 * boltAlpha, 8, boltAlpha * 0.5);
        }

        // Impact flash at target
        if (progress >= 0.95) {
          const impactAlpha = (1 - (age - 0.25) * 2) * 0.8;
          if (impactAlpha > 0) {
            const impGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, gridSize * 0.6);
            impGrad.addColorStop(0, "rgba(255,255,255," + impactAlpha * 0.6 + ")");
            impGrad.addColorStop(0.3, s.color + Math.round(impactAlpha * 120).toString(16).padStart(2, "0"));
            impGrad.addColorStop(1, s.color + "00");
            ctx.beginPath(); ctx.arc(se.x, se.y, gridSize * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = impGrad; ctx.fill();

            // Impact sparks
            for (let sp = 0; sp < 12; sp++) {
              const sa = (sp / 12) * Math.PI * 2;
              const sd = gridSize * 0.3 * (age - 0.2) * 3;
              ctx.beginPath(); ctx.arc(se.x + Math.cos(sa) * sd, se.y + Math.sin(sa) * sd, 1.5 * impactAlpha, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255,255,255," + impactAlpha * 0.7 + ")";
              ctx.fill();
            }
          }
        }

        ctx.shadowBlur = 0;

      } else if (s.effect === "heal") {
        // HEALING WORD / CURE WOUNDS — golden/green spiraling particles with plus signs
        const healGlow = easeOut(Math.min(1, age * 2)) * (1 - easeIn(Math.max(0, age - 0.5) * 2));

        // Soft base glow
        const glowR = gridSize * 0.7 * (0.8 + Math.sin(age * 12) * 0.1);
        const glowGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, glowR);
        glowGrad.addColorStop(0, s.color + Math.round(healGlow * 60).toString(16).padStart(2, "0"));
        glowGrad.addColorStop(0.5, s.color + Math.round(healGlow * 25).toString(16).padStart(2, "0"));
        glowGrad.addColorStop(1, s.color + "00");
        ctx.beginPath(); ctx.arc(se.x, se.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad; ctx.fill();

        // Spiraling particles
        for (let p = 0; p < 25; p++) {
          const pAge = (age + p * 0.04) % 1;
          const pAngle = p * 0.8 + pAge * Math.PI * 3;
          const pDist = gridSize * 0.15 + gridSize * 0.4 * (1 - pAge);
          const pRise = pAge * gridSize * 1.5;
          const pAlpha = Math.sin(pAge * Math.PI) * alpha * 0.8;
          if (pAlpha <= 0) continue;
          const px = se.x + Math.cos(pAngle) * pDist;
          const py = se.y - pRise + Math.sin(pAngle * 2) * 3;
          const pSize = (1.5 + (p % 3)) * (1 - pAge * 0.5);
          ctx.beginPath(); ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fillStyle = p % 4 === 0 ? "rgba(255,255,220," + pAlpha + ")" : s.color + Math.round(pAlpha * 200).toString(16).padStart(2, "0");
          ctx.fill();
        }

        // Rising plus signs
        for (let i = 0; i < 5; i++) {
          const plusAge = (age + i * 0.15) % 1;
          const plusAlpha = Math.sin(plusAge * Math.PI) * alpha * 0.5;
          if (plusAlpha <= 0) continue;
          const px = se.x + ((i * 13 - 26) % 30);
          const py = se.y - plusAge * gridSize * 1.2;
          const sz = 3 + i;
          ctx.strokeStyle = s.color + Math.round(plusAlpha * 200).toString(16).padStart(2, "0");
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(px - sz, py); ctx.lineTo(px + sz, py); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px, py - sz); ctx.lineTo(px, py + sz); ctx.stroke();
        }

      } else if (s.effect === "radiant") {
        // SACRED FLAME / GUIDING BOLT — beam from above + starburst
        const beamAlpha = alpha * (age < 0.2 ? age / 0.2 : 1);

        // Beam of light from above
        if (age < 0.6) {
          const beamW = gridSize * 0.3;
          const beamFade = age < 0.1 ? age / 0.1 : (1 - (age - 0.1) / 0.5);
          ctx.fillStyle = "rgba(255,240,180," + (beamFade * 0.3) + ")";
          ctx.beginPath();
          ctx.moveTo(se.x - beamW * 2, se.y - gridSize * 6);
          ctx.lineTo(se.x + beamW * 2, se.y - gridSize * 6);
          ctx.lineTo(se.x + beamW * 0.5, se.y);
          ctx.lineTo(se.x - beamW * 0.5, se.y);
          ctx.closePath(); ctx.fill();
        }

        // Central starburst
        const burstR = gridSize * 0.5 * easeOut(Math.min(1, age * 3));
        ctx.shadowColor = s.color; ctx.shadowBlur = 10 * beamAlpha;
        for (let ray = 0; ray < 12; ray++) {
          const rayAngle = (ray / 12) * Math.PI * 2 + age * 2;
          const rayLen = burstR * (0.6 + ((ray * 17) % 10) / 10 * 0.4);
          const rayW = ray % 2 === 0 ? 1.5 : 0.8;
          ctx.beginPath(); ctx.moveTo(se.x, se.y);
          ctx.lineTo(se.x + Math.cos(rayAngle) * rayLen, se.y + Math.sin(rayAngle) * rayLen);
          ctx.strokeStyle = ray % 3 === 0 ? "rgba(255,255,255," + beamAlpha * 0.8 + ")" : s.color + Math.round(beamAlpha * 180).toString(16).padStart(2, "0");
          ctx.lineWidth = rayW * beamAlpha; ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // Central glow
        const cGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, burstR * 0.5);
        cGrad.addColorStop(0, "rgba(255,255,240," + beamAlpha * 0.7 + ")");
        cGrad.addColorStop(1, s.color + "00");
        ctx.beginPath(); ctx.arc(se.x, se.y, burstR * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = cGrad; ctx.fill();

        // Floating golden motes
        for (let m = 0; m < 15; m++) {
          const mAngle = m * 0.9 + age * 4;
          const mDist = gridSize * (0.2 + 0.4 * ((age + m * 0.07) % 1));
          const mAlpha = alpha * 0.5 * Math.sin(((age + m * 0.1) % 1) * Math.PI);
          ctx.beginPath(); ctx.arc(se.x + Math.cos(mAngle) * mDist, se.y + Math.sin(mAngle) * mDist - age * 10, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,215,80," + mAlpha + ")"; ctx.fill();
        }

      } else if (s.effect === "shockwave") {
        // THUNDERWAVE — multiple expanding rings + debris
        for (let ring = 0; ring < 4; ring++) {
          const ringDelay = ring * 0.06;
          const ringAge = Math.max(0, age - ringDelay);
          const ringR = radiusPx * easeOut(Math.min(1, ringAge * 2.5));
          const ringAlpha = alpha * Math.max(0, 1 - ringAge * 1.8) * (1 - ring * 0.2);
          if (ringAlpha <= 0) continue;
          ctx.beginPath(); ctx.arc(se.x, se.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = ring === 0 ? "rgba(255,255,255," + ringAlpha * 0.6 + ")" : s.color + Math.round(ringAlpha * 150).toString(16).padStart(2, "0");
          ctx.lineWidth = (4 - ring) * ringAlpha; ctx.stroke();
        }

        // Air distortion fill — spell-colored
        const distR = radiusPx * easeOut(Math.min(1, age * 2));
        ctx.beginPath(); ctx.arc(se.x, se.y, distR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + cr + "," + cg + "," + cb + "," + (alpha * 0.08) + ")"; ctx.fill();

        // Debris flying outward
        for (let d = 0; d < 20; d++) {
          const dAngle = (d / 20) * Math.PI * 2 + d * 0.3;
          const dDist = radiusPx * 0.3 * easeOut(Math.min(1, age * 2)) + d * 2;
          const dAlpha = alpha * 0.6 * (1 - (d % 5) * 0.1);
          ctx.beginPath();
          ctx.arc(se.x + Math.cos(dAngle) * dDist, se.y + Math.sin(dAngle) * dDist, 1 + (d % 3), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(" + Math.floor(cr*0.8) + "," + Math.floor(cg*0.85) + "," + Math.floor(cb*0.9) + "," + dAlpha + ")"; ctx.fill();
        }

      } else if (s.effect === "freeze") {
        // CONE OF COLD / ICE STORM — crystalline fractals + frost + ice shards
        const freezeR = radiusPx * easeOut(Math.min(1, age * 2));

        // Frost base — uses spell color
        const fGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, freezeR);
        fGrad.addColorStop(0, "rgba(" + Math.min(255,cr+50) + "," + Math.min(255,cg+30) + "," + Math.min(255,cb+20) + "," + alpha * 0.25 + ")");
        fGrad.addColorStop(0.5, "rgba(" + cr + "," + cg + "," + cb + "," + alpha * 0.15 + ")");
        fGrad.addColorStop(1, "rgba(" + Math.floor(cr*0.6) + "," + Math.floor(cg*0.8) + "," + cb + ",0)");
        ctx.beginPath(); ctx.arc(se.x, se.y, freezeR, 0, Math.PI * 2);
        ctx.fillStyle = fGrad; ctx.fill();

        // Crystal fractal arms
        ctx.shadowColor = s.color; ctx.shadowBlur = 5 * alpha;
        for (let arm = 0; arm < 8; arm++) {
          const armAngle = (arm / 8) * Math.PI * 2 + ((se.startTime % 1000) / 1000) * 0.5;
          const armLen = freezeR * 0.8 * easeOut(Math.min(1, age * 2.5));
          ctx.strokeStyle = "rgba(" + Math.min(255,cr+50) + "," + Math.min(255,cg+30) + "," + Math.min(255,cb+20) + "," + alpha * 0.6 + ")"; ctx.lineWidth = 1.5 * alpha;
          ctx.beginPath(); ctx.moveTo(se.x, se.y);
          ctx.lineTo(se.x + Math.cos(armAngle) * armLen, se.y + Math.sin(armAngle) * armLen);
          ctx.stroke();

          // Branches
          for (let b = 0; b < 3; b++) {
            const bt = 0.3 + b * 0.25;
            const bx = se.x + Math.cos(armAngle) * armLen * bt;
            const by = se.y + Math.sin(armAngle) * armLen * bt;
            const bLen = armLen * 0.25;
            const bDir = (b % 2 === 0 ? 1 : -1) * 0.5;
            ctx.beginPath(); ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(armAngle + bDir) * bLen, by + Math.sin(armAngle + bDir) * bLen);
            ctx.strokeStyle = "rgba(" + Math.min(255,cr+50) + "," + Math.min(255,cg+30) + "," + Math.min(255,cb+20) + "," + alpha * 0.35 + ")"; ctx.lineWidth = 0.8 * alpha;
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;

        // Ice shard particles
        for (let sh = 0; sh < 20; sh++) {
          const shAngle = (sh / 20) * Math.PI * 2 + sh * 1.3;
          const shDist = freezeR * 0.5 * age + sh * 1.5;
          const shAlpha = alpha * 0.5 * (1 - age * 0.7);
          const sx = se.x + Math.cos(shAngle) * shDist;
          const sy = se.y + Math.sin(shAngle) * shDist - age * 5;
          ctx.save(); ctx.translate(sx, sy); ctx.rotate(shAngle);
          ctx.fillStyle = "rgba(" + Math.min(255,cr+30) + "," + Math.min(255,cg+20) + "," + Math.min(255,cb+10) + "," + shAlpha + ")";
          ctx.fillRect(-1, -3, 2, 6);
          ctx.restore();
        }

      } else if (s.effect === "shield") {
        // SHIELD / MAGE ARMOR — hexagonal force field dome
        const shieldR = gridSize * 0.65;
        const pulseR = shieldR * (0.95 + Math.sin(age * 15) * 0.05);

        // Base dome
        ctx.beginPath(); ctx.arc(se.x, se.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = s.color + Math.round(alpha * 200).toString(16).padStart(2, "0");
        ctx.lineWidth = 2.5 * alpha; ctx.stroke();
        ctx.fillStyle = s.color + Math.round(alpha * 20).toString(16).padStart(2, "0");
        ctx.fill();

        // Hexagonal grid pattern
        const hexSize = gridSize * 0.12;
        for (let hx = -3; hx <= 3; hx++) {
          for (let hy = -3; hy <= 3; hy++) {
            const px = se.x + hx * hexSize * 1.5;
            const py = se.y + hy * hexSize * 1.73 + (hx % 2) * hexSize * 0.866;
            if (Math.hypot(px - se.x, py - se.y) > pulseR * 0.85) continue;
            ctx.beginPath();
            for (let v = 0; v < 6; v++) {
              const va = (v / 6) * Math.PI * 2;
              const vx = px + Math.cos(va) * hexSize * 0.45;
              const vy = py + Math.sin(va) * hexSize * 0.45;
              v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
            }
            ctx.closePath();
            ctx.strokeStyle = s.color + Math.round(alpha * 50).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }

        // Orbiting runes
        for (let r = 0; r < 4; r++) {
          const rAngle = (r / 4) * Math.PI * 2 + age * 6;
          const rx = se.x + Math.cos(rAngle) * pulseR * 0.75;
          const ry = se.y + Math.sin(rAngle) * pulseR * 0.75;
          ctx.beginPath(); ctx.arc(rx, ry, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255," + alpha * 0.6 + ")"; ctx.fill();
        }

      } else if (s.effect === "necrotic") {
        // NECROTIC — dark drain using spell color
        const necR = gridSize * 0.7;
        const dGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, necR);
        dGrad.addColorStop(0, "rgba(" + cr + "," + cg + "," + cb + "," + alpha * 0.35 + ")");
        dGrad.addColorStop(0.5, "rgba(" + Math.floor(cr*0.4) + "," + Math.floor(cg*0.6) + "," + Math.floor(cb*0.4) + "," + alpha * 0.15 + ")");
        dGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(se.x, se.y, necR, 0, Math.PI * 2); ctx.fillStyle = dGrad; ctx.fill();

        // Skull shape suggestion
        if (age < 0.5) {
          const skAlpha = alpha * 0.4 * (1 - age * 2);
          ctx.strokeStyle = "rgba(" + Math.min(255,cr+60) + "," + Math.min(255,cg+80) + "," + Math.min(255,cb+60) + "," + skAlpha + ")"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(se.x, se.y - 3, gridSize * 0.15, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(se.x - 3, se.y - 5, 2, 0, Math.PI * 2); ctx.fillStyle = "rgba(0,0,0," + skAlpha + ")"; ctx.fill();
          ctx.beginPath(); ctx.arc(se.x + 3, se.y - 5, 2, 0, Math.PI * 2); ctx.fill();
        }

        // Life drain particles (target to caster)
        if (se.casterX !== se.x || se.casterY !== se.y) {
          for (let p = 0; p < 15; p++) {
            const pt = ((age * 2 + p * 0.07) % 1);
            const px = se.x + (se.casterX - se.x) * pt;
            const py = se.y + (se.casterY - se.y) * pt + Math.sin(pt * 10 + p) * 5;
            const pAlpha = Math.sin(pt * Math.PI) * alpha * 0.6;
            ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = p % 2 === 0 ? "rgba(" + Math.min(255,cr+40) + "," + Math.min(255,cg+60) + "," + Math.min(255,cb+40) + "," + pAlpha + ")" : "rgba(" + cr + "," + cg + "," + cb + "," + pAlpha + ")"; ctx.fill();
          }
        }

      } else if (s.effect === "poison") {
        // POISON — expanding toxic cloud + skull + dripping particles
        const cloudR = gridSize * 0.7 * easeOut(Math.min(1, age * 1.8));

        // Multiple cloud puffs with movement
        for (let c = 0; c < 8; c++) {
          const cAngle = (c / 8) * Math.PI * 2 + Math.sin(age * 2 + c) * 0.5;
          const cDist = cloudR * 0.25 * (1 + Math.sin(age * 3 + c * 2) * 0.3);
          const cx2 = se.x + Math.cos(cAngle) * cDist;
          const cy2 = se.y + Math.sin(cAngle) * cDist;
          const puffR = cloudR * (0.35 + (c % 3) * 0.08);
          const cGrad = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, puffR);
          cGrad.addColorStop(0, "rgba(" + cr + "," + cg + "," + cb + "," + alpha * 0.22 + ")");
          cGrad.addColorStop(0.6, "rgba(" + Math.floor(cr*0.7) + "," + Math.floor(cg*0.8) + "," + Math.floor(cb*0.7) + "," + alpha * 0.12 + ")");
          cGrad.addColorStop(1, "rgba(" + Math.floor(cr*0.5) + "," + Math.floor(cg*0.6) + "," + Math.floor(cb*0.5) + ",0)");
          ctx.beginPath(); ctx.arc(cx2, cy2, puffR, 0, Math.PI * 2); ctx.fillStyle = cGrad; ctx.fill();
        }

        // Skull and crossbones flicker
        if (age > 0.1 && age < 0.6) {
          const skAlpha = alpha * 0.3 * Math.sin((age - 0.1) / 0.5 * Math.PI);
          ctx.strokeStyle = "rgba(200,255,200," + skAlpha + ")"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(se.x, se.y - 4, gridSize * 0.12, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(se.x - 3, se.y - 6, 1.5, 0, Math.PI * 2); ctx.fillStyle = "rgba(0,50,0," + skAlpha + ")"; ctx.fill();
          ctx.beginPath(); ctx.arc(se.x + 3, se.y - 6, 1.5, 0, Math.PI * 2); ctx.fill();
          // Crossbones
          ctx.beginPath(); ctx.moveTo(se.x - 6, se.y + 2); ctx.lineTo(se.x + 6, se.y + 8); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(se.x + 6, se.y + 2); ctx.lineTo(se.x - 6, se.y + 8); ctx.stroke();
        }

        // Dripping toxic particles
        for (let d = 0; d < 15; d++) {
          const dAge = (age * 1.5 + d * 0.07) % 1;
          const dx = se.x + ((d * 13 - 40) % 50) * 0.7;
          const dy = se.y + dAge * gridSize * 0.6 - gridSize * 0.1;
          const dAlpha = Math.sin(dAge * Math.PI) * alpha * 0.5;
          const dR = 1 + (d % 3);
          ctx.beginPath(); ctx.arc(dx, dy, dR, 0, Math.PI * 2);
          ctx.fillStyle = d % 3 === 0 ? "rgba(" + Math.min(255,cr+60) + "," + Math.min(255,cg+60) + "," + Math.min(255,cb+60) + "," + dAlpha + ")" : "rgba(" + cr + "," + cg + "," + cb + "," + dAlpha + ")";
          ctx.fill();
        }

      } else if (s.effect === "acid") {
        // ACID — bubbling corrosive drops + sizzling ground + vapor
        // Ground sizzle pool
        const poolR = gridSize * 0.45 * easeOut(Math.min(1, age * 2));
        const poolGrad = ctx.createRadialGradient(se.x, se.y + gridSize * 0.1, 0, se.x, se.y + gridSize * 0.1, poolR);
        poolGrad.addColorStop(0, "rgba(" + cr + "," + cg + "," + cb + "," + alpha * 0.25 + ")");
        poolGrad.addColorStop(0.7, "rgba(" + Math.floor(cr*0.7) + "," + Math.floor(cg*0.8) + "," + Math.floor(cb*0.3) + "," + alpha * 0.12 + ")");
        poolGrad.addColorStop(1, "rgba(" + Math.floor(cr*0.5) + "," + Math.floor(cg*0.6) + ",0,0)");
        ctx.beginPath(); ctx.ellipse(se.x, se.y + gridSize * 0.15, poolR, poolR * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = poolGrad; ctx.fill();

        // Bubbling drops
        for (let d = 0; d < 30; d++) {
          const dAge = (age * 2 + d * 0.033) % 1;
          const dAngle = d * 0.9 + Math.sin(d * 2.3) * 2;
          const dDist = gridSize * 0.1 + dAge * gridSize * 0.2;
          const dx = se.x + Math.cos(dAngle) * dDist + ((d * 19 - 50) % 30) * 0.5;
          const dy = se.y + Math.sin(dAge * Math.PI * 2) * 3 + dAge * gridSize * 0.4 - gridSize * 0.2;
          const dAlpha = Math.sin(dAge * Math.PI) * alpha * 0.7;
          const dR = 1 + (d % 5) * 0.8;

          // Droplet
          ctx.beginPath(); ctx.arc(dx, dy, dR, 0, Math.PI * 2);
          ctx.fillStyle = d % 4 === 0 ? "rgba(" + Math.min(255,cr+80) + "," + Math.min(255,cg+40) + "," + cb + "," + dAlpha + ")" : "rgba(" + cr + "," + cg + "," + cb + "," + dAlpha + ")";
          ctx.fill();

          // Highlight
          ctx.beginPath(); ctx.arc(dx - dR * 0.3, dy - dR * 0.3, dR * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(220,255,180," + dAlpha * 0.5 + ")"; ctx.fill();
        }

        // Rising vapor wisps
        for (let v = 0; v < 8; v++) {
          const vAge = (age + v * 0.12) % 1;
          const vAlpha = Math.sin(vAge * Math.PI) * alpha * 0.2;
          const vx = se.x + ((v * 9 - 30) % 25);
          const vy = se.y - vAge * gridSize * 0.6;
          ctx.beginPath();
          ctx.moveTo(vx, vy + 5);
          ctx.quadraticCurveTo(vx + Math.sin(vAge * 8) * 4, vy, vx + Math.sin(vAge * 12) * 3, vy - 5);
          ctx.strokeStyle = "rgba(150,255,100," + vAlpha + ")";
          ctx.lineWidth = 1; ctx.stroke();
        }

      } else if (s.effect === "darkness") {
        // DARKNESS — consuming void with tendrils, tinted by spell color
        const darkR = radiusPx * easeOut(Math.min(1, age * 2));

        // Dark void with spell color tint
        const dGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, darkR);
        dGrad.addColorStop(0, "rgba(" + Math.floor(cr*0.05) + "," + Math.floor(cg*0.05) + "," + Math.floor(cb*0.05) + "," + alpha * 0.85 + ")");
        dGrad.addColorStop(0.6, "rgba(" + Math.floor(cr*0.1) + "," + Math.floor(cg*0.05) + "," + Math.floor(cb*0.15) + "," + alpha * 0.5 + ")");
        dGrad.addColorStop(1, "rgba(" + Math.floor(cr*0.08) + "," + Math.floor(cg*0.04) + "," + Math.floor(cb*0.1) + ",0)");
        ctx.beginPath(); ctx.arc(se.x, se.y, darkR, 0, Math.PI * 2);
        ctx.fillStyle = dGrad; ctx.fill();

        // Tendrils tinted with spell color
        for (let t = 0; t < 8; t++) {
          const tAngle = (t / 8) * Math.PI * 2 + age * 1.5;
          const tLen = darkR * (0.8 + Math.sin(age * 4 + t * 2) * 0.3);
          ctx.beginPath(); ctx.moveTo(se.x, se.y);
          const cp1x = se.x + Math.cos(tAngle + 0.3) * tLen * 0.5;
          const cp1y = se.y + Math.sin(tAngle + 0.3) * tLen * 0.5;
          const endx = se.x + Math.cos(tAngle) * tLen;
          const endy = se.y + Math.sin(tAngle) * tLen;
          ctx.quadraticCurveTo(cp1x, cp1y, endx, endy);
          ctx.strokeStyle = "rgba(" + Math.floor(cr*0.15) + "," + Math.floor(cg*0.05) + "," + Math.floor(cb*0.2) + "," + alpha * 0.4 + ")";
          ctx.lineWidth = 3 * alpha; ctx.stroke();
        }

        // Swallowed light particles moving inward, tinted
        for (let p = 0; p < 12; p++) {
          const pAngle = (p / 12) * Math.PI * 2;
          const pDist = darkR * (1.2 - age * 0.8 + Math.sin(p * 2 + age * 5) * 0.1);
          ctx.beginPath(); ctx.arc(se.x + Math.cos(pAngle) * pDist, se.y + Math.sin(pAngle) * pDist, 1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(" + Math.min(255,cr+100) + "," + Math.min(255,cg+100) + "," + Math.min(255,cb+100) + "," + alpha * 0.3 + ")"; ctx.fill();
        }

      } else if (s.effect === "conjuration") {
        // CONJURATION — swirling portal with inner vortex
        const portalR = gridSize * 0.55 * easeOut(Math.min(1, age * 2.5));

        // Outer glow
        const pGrad = ctx.createRadialGradient(se.x, se.y, portalR * 0.5, se.x, se.y, portalR * 1.2);
        pGrad.addColorStop(0, "rgba(100,220,120," + alpha * 0.15 + ")");
        pGrad.addColorStop(1, "rgba(60,180,80,0)");
        ctx.beginPath(); ctx.arc(se.x, se.y, portalR * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = pGrad; ctx.fill();

        // Rotating rings with dashes
        for (let ring = 0; ring < 4; ring++) {
          const rR = portalR * (0.35 + ring * 0.18);
          const rotSpeed = (ring % 2 === 0 ? 1 : -1) * (4 + ring);
          ctx.save();
          ctx.translate(se.x, se.y);
          ctx.rotate(age * rotSpeed);
          ctx.beginPath(); ctx.arc(0, 0, rR, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(100,220,120," + alpha * (0.5 - ring * 0.1) + ")";
          ctx.lineWidth = 1.5 - ring * 0.2;
          ctx.setLineDash([4 + ring * 2, 3 + ring]); ctx.stroke(); ctx.setLineDash([]);
          ctx.restore();
        }

        // Inner vortex particles
        for (let p = 0; p < 30; p++) {
          const pAge = (age * 3 + p * 0.033) % 1;
          const pa = pAge * Math.PI * 4 + p * 0.5;
          const pd = portalR * (1 - pAge) * 0.8;
          const pAlpha = Math.sin(pAge * Math.PI) * alpha * 0.6;
          if (pAlpha <= 0) continue;
          ctx.beginPath(); ctx.arc(
            se.x + Math.cos(pa) * pd,
            se.y + Math.sin(pa) * pd,
            1 + (1 - pAge) * 2, 0, Math.PI * 2
          );
          ctx.fillStyle = p % 4 === 0 ? "rgba(" + Math.min(255,cr+80) + "," + Math.min(255,cg+40) + "," + Math.min(255,cb+80) + "," + pAlpha + ")" : "rgba(" + cr + "," + cg + "," + cb + "," + pAlpha + ")";
          ctx.fill();
        }

        // Center bright point
        const cAlpha = alpha * (0.5 + Math.sin(age * 10) * 0.3);
        ctx.beginPath(); ctx.arc(se.x, se.y, 3 * alpha, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + cAlpha + ")"; ctx.fill();

      } else if (s.effect === "transmutation") {
        // TRANSMUTATION — golden metamorphosis swirl + morphing shimmer
        // Golden base glow
        const tmGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, gridSize * 0.5);
        tmGrad.addColorStop(0, "rgba(255,215,60," + alpha * 0.25 + ")");
        tmGrad.addColorStop(0.5, "rgba(220,180,40," + alpha * 0.1 + ")");
        tmGrad.addColorStop(1, "rgba(180,140,20,0)");
        ctx.beginPath(); ctx.arc(se.x, se.y, gridSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = tmGrad; ctx.fill();

        // Double helix spiral
        for (let strand = 0; strand < 2; strand++) {
          ctx.beginPath();
          const offset = strand * Math.PI;
          for (let t = 0; t < 30; t++) {
            const tt = t / 30;
            const angle = tt * Math.PI * 4 + age * 8 + offset;
            const radius = gridSize * 0.15 + gridSize * 0.3 * tt;
            const px = se.x + Math.cos(angle) * radius;
            const py = se.y - tt * gridSize * 1.2 + gridSize * 0.3;
            t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.strokeStyle = strand === 0 ? "rgba(" + cr + "," + cg + "," + Math.floor(cb*0.5) + "," + alpha * 0.6 + ")" : "rgba(" + Math.floor(cr*0.8) + "," + Math.floor(cg*0.7) + "," + Math.floor(cb*0.3) + "," + alpha * 0.4 + ")";
          ctx.lineWidth = 1.5 * alpha; ctx.stroke();
        }

        // Particle dust along helix
        for (let p = 0; p < 20; p++) {
          const pAge = (age + p * 0.05) % 1;
          const pa = pAge * Math.PI * 4 + p * 1.2 + age * 6;
          const pd = gridSize * 0.1 + gridSize * 0.25 * pAge;
          const pAlpha = Math.sin(pAge * Math.PI) * alpha * 0.6;
          ctx.beginPath(); ctx.arc(
            se.x + Math.cos(pa) * pd,
            se.y - pAge * gridSize * 0.8 + gridSize * 0.2 + Math.sin(pa) * pd * 0.3,
            1 + (p % 3) * 0.5, 0, Math.PI * 2
          );
          ctx.fillStyle = p % 3 === 0 ? "rgba(" + Math.min(255,cr+40) + "," + Math.min(255,cg+40) + "," + Math.min(255,cb+40) + "," + pAlpha + ")" : "rgba(" + cr + "," + cg + "," + cb + "," + pAlpha + ")";
          ctx.fill();
        }

      } else if (s.effect === "enchantment") {
        // ENCHANTMENT — charm sparkles + spiraling hearts + swirl eyes
        // Pink/purple glow base
        const eGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, gridSize * 0.6);
        eGrad.addColorStop(0, "rgba(255,105,180," + alpha * 0.15 + ")");
        eGrad.addColorStop(0.5, "rgba(180,80,200," + alpha * 0.08 + ")");
        eGrad.addColorStop(1, "rgba(140,50,160,0)");
        ctx.beginPath(); ctx.arc(se.x, se.y, gridSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = eGrad; ctx.fill();

        // Spiraling star sparkles
        for (let sp = 0; sp < 25; sp++) {
          const spAge = (age + sp * 0.04) % 1;
          const sa = sp * 0.7 + spAge * Math.PI * 3;
          const sd = gridSize * (0.1 + 0.5 * spAge);
          const sAlpha = Math.sin(spAge * Math.PI) * alpha * 0.7;
          if (sAlpha <= 0) continue;
          const sx = se.x + Math.cos(sa) * sd;
          const sy = se.y + Math.sin(sa) * sd - spAge * gridSize * 0.4;

          // Draw 4-pointed star
          const starR = 1.5 + (sp % 3);
          ctx.fillStyle = sp % 4 === 0 ? "rgba(" + Math.min(255,cr+40) + "," + Math.min(255,cg+40) + "," + Math.min(255,cb+40) + "," + sAlpha + ")" : "rgba(" + cr + "," + cg + "," + cb + "," + sAlpha + ")";
          ctx.beginPath();
          for (let v = 0; v < 8; v++) {
            const va = (v / 8) * Math.PI * 2 + age * 3;
            const vr = v % 2 === 0 ? starR : starR * 0.35;
            v === 0 ? ctx.moveTo(sx + Math.cos(va) * vr, sy + Math.sin(va) * vr) : ctx.lineTo(sx + Math.cos(va) * vr, sy + Math.sin(va) * vr);
          }
          ctx.closePath(); ctx.fill();
        }

        // Rising hearts (small)
        for (let h = 0; h < 6; h++) {
          const hAge = (age + h * 0.15) % 1;
          const hAlpha = Math.sin(hAge * Math.PI) * alpha * 0.5;
          if (hAlpha <= 0) continue;
          const hx = se.x + ((h * 11 - 30) % 25);
          const hy = se.y - hAge * gridSize;
          const hs = 2 + h % 2;
          // Simple heart shape
          ctx.fillStyle = "rgba(" + cr + "," + Math.floor(cg*0.5) + "," + Math.floor(cb*0.8) + "," + hAlpha + ")";
          ctx.beginPath();
          ctx.moveTo(hx, hy + hs * 0.3);
          ctx.bezierCurveTo(hx - hs, hy - hs * 0.5, hx - hs * 0.5, hy - hs, hx, hy - hs * 0.4);
          ctx.bezierCurveTo(hx + hs * 0.5, hy - hs, hx + hs, hy - hs * 0.5, hx, hy + hs * 0.3);
          ctx.fill();
        }

      } else if (s.effect === "psychic") {
        // PSYCHIC — mind ripples + purple brain pulse + target vibration
        const pulsePhase = Math.sin(age * 20) * 0.5 + 0.5;

        // Expanding mind ripples
        for (let ring = 0; ring < 6; ring++) {
          const rAge = Math.max(0, age - ring * 0.06);
          const rR = gridSize * 0.6 * easeOut(Math.min(1, rAge * 2.5));
          const rAlpha = alpha * Math.max(0, 1 - rAge * 1.8) * 0.5;
          if (rAlpha <= 0) continue;
          ctx.beginPath(); ctx.arc(se.x, se.y, rR, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(180,100,255," + rAlpha + ")";
          ctx.lineWidth = (3 - ring * 0.4) * alpha; ctx.stroke();
        }

        // Central brain pulse glow
        const brainR = gridSize * 0.3 * (0.8 + pulsePhase * 0.4);
        const brainGrad = ctx.createRadialGradient(se.x, se.y, 0, se.x, se.y, brainR);
        brainGrad.addColorStop(0, "rgba(200,130,255," + alpha * 0.5 + ")");
        brainGrad.addColorStop(0.6, "rgba(150,60,220," + alpha * 0.2 + ")");
        brainGrad.addColorStop(1, "rgba(100,30,180,0)");
        ctx.beginPath(); ctx.arc(se.x, se.y, brainR, 0, Math.PI * 2);
        ctx.fillStyle = brainGrad; ctx.fill();

        // Psychic energy tendrils
        ctx.shadowColor = "#c77dff"; ctx.shadowBlur = 8 * alpha;
        for (let l = 0; l < 10; l++) {
          const la = (l / 10) * Math.PI * 2 + age * 4;
          const lLen = gridSize * 0.4 * easeOut(Math.min(1, age * 2));
          const wobble = Math.sin(age * 12 + l * 3) * 5;
          ctx.beginPath(); ctx.moveTo(se.x, se.y);
          ctx.quadraticCurveTo(
            se.x + Math.cos(la + 0.3) * lLen * 0.6 + wobble,
            se.y + Math.sin(la + 0.3) * lLen * 0.6 + wobble,
            se.x + Math.cos(la) * lLen,
            se.y + Math.sin(la) * lLen
          );
          ctx.strokeStyle = "rgba(200,150,255," + alpha * 0.4 + ")";
          ctx.lineWidth = 1.5 * alpha; ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // Floating psychic motes
        for (let m = 0; m < 15; m++) {
          const mAge = (age + m * 0.07) % 1;
          const mAngle = m * 1.2 + age * 6;
          const mDist = gridSize * 0.15 + gridSize * 0.35 * mAge;
          const mAlpha = Math.sin(mAge * Math.PI) * alpha * 0.6;
          ctx.beginPath(); ctx.arc(
            se.x + Math.cos(mAngle) * mDist + Math.sin(mAngle * 3) * 3,
            se.y + Math.sin(mAngle) * mDist - mAge * 15,
            1.5 + Math.sin(mAge * Math.PI) * 1, 0, Math.PI * 2
          );
          ctx.fillStyle = m % 3 === 0 ? "rgba(" + Math.min(255,cr+60) + "," + Math.min(255,cg+50) + "," + Math.min(255,cb+60) + "," + mAlpha + ")" : "rgba(" + cr + "," + cg + "," + cb + "," + mAlpha + ")";
          ctx.fill();
        }

      } else if (s.effect === "thunder") {
        // THUNDER — visible sound waves
        for (let w = 0; w < 6; w++) {
          const wAge = Math.max(0, age - w * 0.04);
          const wR = radiusPx * easeOut(Math.min(1, wAge * 3));
          const wAlpha = alpha * Math.max(0, 1 - wAge * 2) * 0.4;
          ctx.beginPath(); ctx.arc(se.x, se.y, wR, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(200,210,230," + wAlpha + ")"; ctx.lineWidth = 3 - w * 0.4; ctx.stroke();
        }
        // Crack effect
        ctx.strokeStyle = "rgba(255,255,255," + alpha * 0.3 + ")"; ctx.lineWidth = 0.8;
        for (let c = 0; c < 4; c++) {
          ctx.beginPath(); ctx.moveTo(se.x, se.y);
          let px = se.x, py = se.y;
          for (let s2 = 0; s2 < 5; s2++) {
            px += ((((c * 31 + s2 * 17) % 20) - 10)); py += ((((c * 23 + s2 * 13) % 20) - 10));
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

      } else if (s.effect === "force") {
        // FORCE — geometric impact + reality cracks
        const forceR = gridSize * 0.5 * easeOut(Math.min(1, age * 3));

        // Geometric shapes
        for (let g = 0; g < 3; g++) {
          const sides = 3 + g;
          const gR = forceR * (0.5 + g * 0.2);
          const gAngle = age * (3 + g) + g;
          ctx.beginPath();
          for (let v = 0; v <= sides; v++) {
            const va = (v / sides) * Math.PI * 2 + gAngle;
            const vx = se.x + Math.cos(va) * gR;
            const vy = se.y + Math.sin(va) * gR;
            v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
          }
          ctx.strokeStyle = "rgba(100,170,255," + alpha * (0.5 - g * 0.1) + ")";
          ctx.lineWidth = 1.5 * alpha; ctx.stroke();
        }

        // Impact flash
        if (age < 0.2) {
          ctx.beginPath(); ctx.arc(se.x, se.y, forceR * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255," + (1 - age / 0.2) * 0.5 + ")"; ctx.fill();
        }
      }

      ctx.restore();
    });

    // ── Action animations (melee, ranged, dodge, etc.) ──
    actionAnims.forEach(anim => {
      if (typeof renderActionAnimation === "function") {
        renderActionAnimation(ctx, anim, gridSize, Date.now());
      }
    });

    // Props (above tokens layer)
    props.filter(p => p.layer === "above").forEach(p => {
      let pImg = propImagesCache.current[p.id];
      if (!pImg && p.src) {
        pImg = new Image();
        pImg.onload = () => { propImagesCache.current[p.id] = pImg; render(); };
        pImg.src = p.src;
        return;
      }
      if (!pImg) return;
      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      ctx.rotate((p.rotation || 0) * Math.PI / 180);
      ctx.globalAlpha = p.locked ? 0.85 : 1;
      ctx.drawImage(pImg, -p.width / 2, -p.height / 2, p.width, p.height);
      if (p.id === selectedPropId) {
        ctx.strokeStyle = "#58aaff";
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([6 / zoom, 4 / zoom]);
        ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.setLineDash([]);
        const hs = 8 / zoom;
        [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([dx,dy]) => {
          ctx.fillStyle = "#58aaff";
          ctx.fillRect(dx * p.width / 2 - hs / 2, dy * p.height / 2 - hs / 2, hs, hs);
        });
      }
      ctx.restore();
    });

    // Laser pointer trail (DM tool) — reads from ref to avoid render storms
    const laserPts = laserPointsRef.current;
    if (laserPts && laserPts.length > 1) {
      ctx.save();
      const lnow = Date.now();
      // Clean up old points
      while (laserPts.length > 0 && lnow - laserPts[0].time > 2000) laserPts.shift();
      for (let i = 1; i < laserPts.length; i++) {
        const age = lnow - laserPts[i].time;
        const lAlpha = Math.max(0, 1 - age / 2000);
        if (lAlpha <= 0) continue;
        ctx.beginPath();
        ctx.moveTo(laserPts[i-1].x, laserPts[i-1].y);
        ctx.lineTo(laserPts[i].x, laserPts[i].y);
        ctx.strokeStyle = "rgba(255,40,40," + lAlpha + ")";
        ctx.lineWidth = 3 / zoom;
        ctx.shadowColor = "rgba(255,40,40," + (lAlpha * 0.8) + ")";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      // Laser dot at last point
      if (laserPts.length > 0) {
        const last = laserPts[laserPts.length - 1];
        const dotAge = lnow - last.time;
        if (dotAge < 2000) {
          const dotAlpha = Math.max(0, 1 - dotAge / 2000);
          ctx.beginPath();
          ctx.arc(last.x, last.y, 5 / zoom, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,60,60," + dotAlpha + ")";
          ctx.shadowColor = "rgba(255,40,40," + (dotAlpha * 0.9) + ")";
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.restore();
    }

    // ══ FLOATING COMBAT TEXT — render in world space above tokens ══
    if (typeof window.CombatFlowUI !== "undefined" && window.CombatFlowUI.hasActiveTexts()) {
      window.CombatFlowUI.renderFloatingTexts(ctx, zoom, performance.now());
    }

    // ══ END WORLD SPACE — restore the pan/zoom transform ══
    ctx.restore();

    // ══ SCREEN SPACE overlays below — no pan/zoom applied ══

    // Pings (screen space)
    const nowPing = Date.now();
    const activePings = pings.filter(p => nowPing - p.time < 3000);
    if (activePings.length !== pings.length) {
      setTimeout(() => setPings(prev => prev.filter(p => Date.now() - p.time < 3000)), 0);
    }
    activePings.forEach(p => {
      const sp = worldToCanvas(p.x, p.y);
      const pingAge = (nowPing - p.time) / 3000;
      const pingAlpha = 1 - pingAge;
      for (let ring = 0; ring < 3; ring++) {
        const r = 8 + ring * 12 + pingAge * 20;
        const ringAlpha = pingAlpha * (1 - ring * 0.3);
        if (ringAlpha <= 0) continue;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, r, 0, Math.PI * 2);
        if (p.color.startsWith("#")) {
          const hex = p.color;
          const r2 = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
          ctx.strokeStyle = "rgba(" + r2 + "," + g + "," + b + "," + ringAlpha + ")";
        } else {
          ctx.strokeStyle = p.color.replace(")", "," + ringAlpha + ")").replace("rgb(", "rgba(");
        }
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = pingAlpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Ruler overlay (screen space)
    if (activeTool === "ruler" && rulerStart && rulerEnd) {
      const rulerColor = cssVar("--crimson");
      ctx.strokeStyle = rulerColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      const s = worldToCanvas(rulerStart.x, rulerStart.y);
      const e = worldToCanvas(rulerEnd.x, rulerEnd.y);
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(e.x, e.y);
      ctx.stroke();
      ctx.setLineDash([]);
      const dist = Math.sqrt((rulerEnd.x - rulerStart.x)**2 + (rulerEnd.y - rulerStart.y)**2);
      const ft = Math.round(dist / gridSize * 5);
      ctx.fillStyle = rulerColor;
      ctx.font = "bold 12px Cinzel";
      ctx.fillText(ft + " ft", (s.x + e.x)/2, (s.y + e.y)/2 - 8);
    }

    // Movement mode HUD (screen space)
    if (movementMode && selectedToken) {
      const speedCells = getMovementBudgetCells(selectedToken);
      const used = Math.min(movementPath.length, speedCells);
      const remaining = Math.max(0, speedCells - used);
      ctx.fillStyle = (cssVar("--bg").includes("244") || cssVar("--bg").includes("f4f")) ? "rgba(255,255,255,0.85)" : "rgba(0,0,6,0.70)";
      ctx.fillRect(w/2 - 80, 8, 160, 28);
      ctx.strokeStyle = "rgba(46,139,87,0.6)";
      ctx.lineWidth = 1;
      ctx.strokeRect(w/2 - 80, 8, 160, 28);
      ctx.fillStyle = remaining > 0 ? "#5ee09a" : (cssVar("--crimson") || "#f06858");
      ctx.font = "bold 11px Cinzel";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Move: " + (used * 5) + "/" + (speedCells * 5) + " ft  (" + (remaining * 5) + " left)", w/2, 22);
    }

    // Spell log HUD (screen space)
    if (spellLog.length > 0) {
      const now = Date.now();
      let yOffset = 50;
      spellLog.forEach(log => {
        const age = (now - log.time) / 4000;
        if (age > 1) return;
        const alpha = Math.max(0, 1 - age * age);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = (cssVar("--bg").includes("244") || cssVar("--bg").includes("f4f")) ? "rgba(255,255,255,0.85)" : "rgba(0,0,6,0.7)";
        const msgW = ctx.measureText(log.msg).width + 16;
        ctx.fillRect(12, yOffset, msgW, 24);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(181,116,255,0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(12, yOffset, msgW, 24);
        ctx.fillStyle = (cssVar("--bg").includes("244") || cssVar("--bg").includes("f4f")) ? "#7c3aed" : "#b574ff";
        ctx.font = "11px Cinzel";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = alpha;
        ctx.fillText(log.msg, 20, yOffset + 12);
        ctx.globalAlpha = 1;
        yOffset += 28;
      });
    }

    // ── Combat Roll Display (canvas fallback — only when initiative bar JSX isn't showing) ──
    if (combatRollLog.length > 0 && !combatLive) {
      const now = Date.now();
      const isLight = cssVar("--bg").trim() === "#f4f0e6" || cssVar("--bg").includes("244");
      const rollBg = isLight ? "rgba(255,255,255,0.92)" : "rgba(0,0,6,0.88)";
      const rollBorder = isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.12)";
      const rollTextColor = isLight ? "#1a1a2e" : "#f2e8d6";
      let rollY = 46;
      combatRollLog.forEach(roll => {
        const age = (now - roll.time) / 5000;
        if (age > 1) return;
        const alpha = age < 0.8 ? 1 : Math.max(0, 1 - (age - 0.8) * 5);
        const typeColor = roll.type === "crit" ? "#ffd700" : roll.type === "hit" ? "#5ee09a" : roll.type === "miss" ? "#f06858" : "#b574ff";
        ctx.globalAlpha = alpha;
        ctx.font = "bold 12px Cinzel";
        const msgW = Math.max(ctx.measureText(roll.msg).width, ctx.measureText(roll.detail).width * 0.85) + 28;
        const boxW = Math.min(msgW, w - 40);
        const boxX = (w - boxW) / 2;
        const boxH = roll.detail ? 42 : 26;
        // Background
        ctx.fillStyle = rollBg;
        ctx.beginPath();
        ctx.roundRect(boxX, rollY, boxW, boxH, 6);
        ctx.fill();
        // Border
        ctx.strokeStyle = typeColor + "88";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX, rollY, boxW, boxH, 6);
        ctx.stroke();
        // Left accent bar
        ctx.fillStyle = typeColor;
        ctx.fillRect(boxX, rollY + 4, 3, boxH - 8);
        // Main text
        ctx.fillStyle = typeColor;
        ctx.font = "bold 12px Cinzel";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(roll.msg, w / 2, rollY + 5);
        // Detail text
        if (roll.detail) {
          ctx.fillStyle = rollTextColor;
          ctx.font = "10px Cinzel";
          ctx.fillText(roll.detail, w / 2, rollY + 23);
        }
        ctx.globalAlpha = 1;
        rollY += boxH + 4;
      });
    }

    // ── VFX rendering (legacy system removed — using triggerActionAnim canvas overlay) ──
  }, [bgColor, bgImage, showGrid, gridSize, zoom, pan, drawings, drawPoints, drawColor, drawWidth, fogCells, fogEnabled, tokens, walls, wallStart, wallPreview, selectedWallType, activeTool, rulerStart, rulerEnd, selectedTokenId, hoveredTokenId, activeCombatantId, activeCombatTargetId, combatLive, combatants, conditions, tokenConditions, activeSpell, spellEffects, spellLog, combatRollLog, spellDC, fogMode, movementMode, movementPath, movementOrigin, turnStateByToken, terrainCells, pings, viewRole, props, selectedPropId, battleMaps, activeMapId, activeSceneId, multiTargetSelections, castLevel]);

  // Keep a ref to the latest render function so the animation loop doesn't restart on every dep change
  const renderRef = useRef(render);
  useEffect(() => { renderRef.current = render; }, [render]);

  // Animation loop for combat glow, pings, spell effects, spell log, and spell targeting
  // Uses renderRef so the loop itself doesn't restart when render deps change (avoids jitter during zoom/pan)
  const animActiveRef = useRef(false);
  useEffect(() => {
    const hasFloatingText = typeof window.CombatFlowUI !== "undefined" && window.CombatFlowUI.hasActiveTexts();
    const needsAnim = combatLive || pings.length > 0 || spellEffects.length > 0 || actionAnims.length > 0 || spellLog.length > 0 || combatRollLog.length > 0 || !!activeSpell || !!activeWeapon || laserMode || (activeMapId && !activeSceneId) || hasFloatingText;
    if (!needsAnim) {
      animActiveRef.current = false;
      return;
    }
    // If animation is already running, don't restart — renderRef updates automatically
    if (animActiveRef.current) return;
    animActiveRef.current = true;
    let running = true;
    const animate = () => {
      if (!running || !animActiveRef.current) return;
      renderRef.current();
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; animActiveRef.current = false; cancelAnimationFrame(animRef.current); };
  }, [combatLive, pings.length, spellEffects.length, actionAnims.length, spellLog.length, combatRollLog.length, activeSpell, activeWeapon, laserMode, activeMapId, activeSceneId]);

  useEffect(() => { if (!combatLive && pings.length === 0 && spellLog.length === 0) render(); }, [render, combatLive, pings, spellLog]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      render();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [render]);

  // ── Auto-add party member tokens if not already on map ──
  useEffect(() => {
    if (!party || party.length === 0) return;
    setTokens(prev => {
      const existingPartyIds = new Set(
        prev
          .filter(t => t.tokenType === "pc" && t.partyId != null)
          .map(t => String(t.partyId))
      );
      const newTokens = [];
      party.forEach((p, idx) => {
        if (!existingPartyIds.has(String(p.id))) {
          const offsetX = (idx % 5) * gridSize;
          const offsetY = Math.floor(idx / 5) * gridSize;
          const cx = gridSize * 2 + offsetX + gridSize / 2;
          const cy = gridSize * 2 + offsetY + gridSize / 2;
          newTokens.push({
            id: "tk-auto-" + p.id + "-" + Date.now(),
            name: p.name, color: "#2e8b57", hp: p.hp, maxHp: p.maxHp,
            x: cx, y: cy, vision: 0, darkvision: 0, speed: 30,
            hidden: false, size: "medium", label: "", ac: p.ac,
            notes: p.cls + " Lv" + p.lv + (p.race ? " · " + p.race : ""),
            imageSrc: null, tokenType: "pc", partyId: p.id,
            cls: p.cls, level: p.lv, race: p.race || "",
            spellSlots: getMaxSpellSlots(p.cls, p.lv),
            usedSlots: p.usedSlots || {},
            knownSpells: p.knownSpells || [],
            preparedSpells: p.preparedSpells || [],
            spellcastingMod: p.spellcastingMod || 0,
            classResources: p.classResources || {},
          });
        }
      });
      if (newTokens.length === 0) return prev;
      return [...prev, ...newTokens];
    });
  }, [party, gridSize]);

  // ── DM: Broadcast state changes via PhmurtRealtime ──
  const syncTimerRef = useRef(null);
  const suppressRealtimeBroadcastRef = useRef(false);
  useEffect(() => {
    if (viewRole !== "dm") return;
    if (suppressRealtimeBroadcastRef.current) {
      suppressRealtimeBroadcastRef.current = false;
      return;
    }
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      const state = {
        tokens, drawings, fogCells, walls, terrainCells, bgColor, gridSize, showGrid,
        combatLive, combatants, turn, round, conditions, tokenConditions, turnStateByToken, combatTargetByActor,
        playModeResolution, combatLog, fogMode, pings, props,
      };
      // Broadcast via PhmurtRealtime (Supabase channel or localStorage fallback)
      if (typeof PhmurtRealtime !== 'undefined' && activeCampaignId && activeCampaignId !== 'example') {
        PhmurtRealtime.broadcastState(activeCampaignId, state);
      } else {
        // Fallback: localStorage only (same-device or no campaign)
        try { localStorage.setItem(getSyncStorageKey(activeCampaignId), JSON.stringify(state)); } catch {}
      }
    }, 150);
    return () => clearTimeout(syncTimerRef.current);
  }, [tokens, drawings, fogCells, walls, terrainCells, bgColor, gridSize, showGrid, combatLive, combatants, turn, round, conditions, tokenConditions, turnStateByToken, combatTargetByActor, playModeResolution, combatLog, fogMode, pings, props, viewRole, activeCampaignId]);

  // ── Player: Subscribe to DM state via PhmurtRealtime ──
  const realtimeHandleRef = useRef(null);
  const syncFallbackLastRawRef = useRef(null);
  useEffect(() => {
    if (viewRole === "dm") return;
    const applyState = (state) => {
      if (!state) return;
      suppressRealtimeBroadcastRef.current = true;
      if (state.tokens)    setTokens(state.tokens);
      if (state.drawings)  setDrawings(state.drawings);
      if (state.fogCells)  setFogCells(state.fogCells);
      if (state.walls)     setWalls(state.walls);
      if (state.terrainCells) setTerrainCells(state.terrainCells);
      if (state.bgColor)   setBgColor(state.bgColor);
      if (state.gridSize)  setGridSize(state.gridSize);
      if (state.showGrid !== undefined) setShowGrid(state.showGrid);
      if (state.combatLive !== undefined) setCombatLive(state.combatLive);
      if (state.combatants) setCombatants(state.combatants);
      if (state.turn !== undefined) setTurn(state.turn);
      if (state.round !== undefined) setRound(state.round);
      setConditions(state.conditions || {});
      setTokenConditions(state.tokenConditions || {});
      setTurnStateByToken(state.turnStateByToken || {});
      setCombatTargetByActor(state.combatTargetByActor || {});
      setPlayModeResolution(state.playModeResolution || null);
      setCombatLog(state.combatLog || []);
      if (state.fogMode)   setFogMode(state.fogMode);
      if (state.pings)     setPings(state.pings.filter(p => Date.now() - p.time < 3000));
      if (state.props)     setProps(state.props);
    };

    if (typeof PhmurtRealtime !== 'undefined' && activeCampaignId && activeCampaignId !== 'example') {
      // Load current snapshot first (so player sees state immediately on join)
      PhmurtRealtime.loadSnapshot(activeCampaignId).then(applyState);
      // Then subscribe to live updates
      realtimeHandleRef.current = PhmurtRealtime.joinBattleMap(activeCampaignId, viewRole, applyState);
    } else {
      // Fallback: poll localStorage (same device only)
      const interval = setInterval(() => {
        try {
          const fallbackKey = getSyncStorageKey(activeCampaignId);
          const raw = localStorage.getItem(fallbackKey) || localStorage.getItem(SYNC_KEY);
          if (!raw || raw === syncFallbackLastRawRef.current) return;
          syncFallbackLastRawRef.current = raw;
          applyState(JSON.parse(raw));
        } catch {}
      }, 250);
      realtimeHandleRef.current = { leave: () => clearInterval(interval) };
    }

    return () => {
      if (realtimeHandleRef.current) {
        realtimeHandleRef.current.leave();
        realtimeHandleRef.current = null;
      }
    };
  }, [viewRole, activeCampaignId]);

  // ── Native wheel listener with passive: false ──
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e) => { e.preventDefault(); if (wheelHandlerRef.current) wheelHandlerRef.current(e); };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // ── Keyboard handler ──
  useEffect(() => {
    const handleKey = (e) => {
      // Don't trigger shortcuts when typing in input fields
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      // Hotbar number keys 1-9: when action hotbar is visible, pick action by slot
      const hotbarActive = combatLive && tokenPopup && launcherToken && canUseTurnPopupForToken(launcherToken) && !combatLogOpen;
      if (hotbarActive && e.key >= "1" && e.key <= "9") {
        const slotIdx = parseInt(e.key, 10) - 1;
        const slotActions = getCockpitTrayActions(launcherToken || battleFocusToken);
        if (slotIdx < slotActions.length && !slotActions[slotIdx].disabled) {
          e.preventDefault();
          chooseCockpitAction(slotActions[slotIdx]);
          return;
        }
      }
      // L key: toggle combat log
      if (e.key === "l" || e.key === "L") {
        if (combatLive) {
          e.preventDefault();
          setCombatLogOpen(prev => !prev);
          setPendingCombatAction(null);
          return;
        }
        if (viewRole === "dm") { setLaserMode(prev => !prev); return; }
      }
      // Mode switching: 1=Select, 2=Draw (DM only), 3=Combat (only when hotbar not active)
      if (!hotbarActive && e.key === "1") { setMode("select"); }
      if (!hotbarActive && e.key === "2" && viewRole === "dm") { setMode("draw"); }
      if (!hotbarActive && e.key === "3") { setMode("combat"); setSidebarOpen(true); }
      if (e.key === "Tab") {
        if (battleFocusToken && combatLive) {
          e.preventDefault();
          const options = getHostileTargets(battleFocusToken);
          if (options.length > 0) {
            const currentFocusId = getFocusedCombatTarget(battleFocusToken)?.id || options[0].id;
            const currentIndex = Math.max(0, options.findIndex(t => t.id === currentFocusId));
            const nextTarget = options[(currentIndex + 1) % options.length];
            setFocusedCombatTarget(battleFocusToken.id, nextTarget.id);
          }
        }
      }

      if (e.key === "p" || e.key === "P") {
        setPingMode(prev => !prev);
      }
      // Laser mode (L key) handled above in combat log toggle block
      if (e.key === "m" || e.key === "M") {
        if (selectedToken) {
          startCockpitMovement(selectedToken);
        }
      }
      if (e.key === "a" || e.key === "A") {
        const srcToken = launcherToken || battleFocusToken;
        if (srcToken && canUseTurnPopupForToken(srcToken)) {
          if (!tokenPopup || tokenPopup.tokenId !== srcToken.id) openTurnPopupForToken(srcToken);
          const attackPick = getCockpitTrayActions(srcToken).find((act) => ["Attack", "Multiattack"].includes(act.panel) && !act.disabled);
          if (attackPick) chooseCockpitAction(attackPick);
        }
      }
      if (e.key === "b" || e.key === "B") {
        const srcToken = launcherToken || battleFocusToken;
        if (srcToken && canUseTurnPopupForToken(srcToken)) {
          if (!tokenPopup || tokenPopup.tokenId !== srcToken.id) openTurnPopupForToken(srcToken);
          const abilityPick = getCockpitTrayActions(srcToken).find((act) => ["Spell", "Class Feature", "Save / AoE", "Legendary", "Utility", "Other"].includes(act.panel) && !act.disabled);
          if (abilityPick) chooseCockpitAction(abilityPick);
        }
      }
      if (e.key === "Enter" && pendingCombatAction && !pendingCombatAction.disabled) {
        e.preventDefault();
        confirmCockpitAction();
      }
      if (e.key === "Escape") {
        setPingMode(false);
        setLaserMode(false);
        laserPointsRef.current = [];
        setContextMenu(null);
        if (combatLive) dismissTurnPopup();
        else setTokenPopup(null);
        setSelectedPropId(null);
        setEditingRegionMarker(null);
        setWallStart(null);
        setWallPreview(null);
        setActiveWeapon(null);
        weaponTargetRef.current = null;
        setActiveSpell(null);
        spellTargetRef.current = null;
        setMultiTargetSelections([]);
        setCastLevel(null);
        if (movementMode && selectedToken && movementOrigin) {
          // Cancel movement — return token to origin
          setTokens(p => p.map(t => t.id === selectedTokenId ? {...t, x: movementOrigin.x, y: movementOrigin.y} : t));
        }
        setMovementMode(false);
        setMovementPath([]);
        setMovementOrigin(null);
        setPendingCombatAction(null);
        setCombatLogOpen(false);
      }
      // Spacebar: open/close action hotbar for active token, or end turn when hotbar closed
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (activeSpell) {
          spaceHeldRef.current = true;
          return;
        }
        const srcToken = launcherToken || battleFocusToken;
        if (srcToken && canUseTurnPopupForToken(srcToken)) {
          if (tokenPopup?.tokenId === srcToken.id) dismissTurnPopup();
          else openTurnPopupForToken(srcToken);
        }
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === " " || e.code === "Space") {
        spaceHeldRef.current = false;
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);
    return () => { window.removeEventListener("keydown", handleKey); window.removeEventListener("keyup", handleKeyUp); };
  }, [selectedToken, battleFocusToken, launcherToken, tokenPopup, movementMode, movementOrigin, selectedTokenId, activeSpell, pendingCombatAction, combatLive]);

  const getPointerPoint = (e) => {
    const p = e?.touches?.[0] || e?.changedTouches?.[0] || e || { clientX: 0, clientY: 0 };
    return { clientX: p.clientX || 0, clientY: p.clientY || 0 };
  };

  const getTouchGestureMetrics = (e) => {
    if (!canvasRef.current || !e?.touches || e.touches.length < 2) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const a = e.touches[0];
    const b = e.touches[1];
    const centerX = ((a.clientX + b.clientX) / 2) - rect.left;
    const centerY = ((a.clientY + b.clientY) / 2) - rect.top;
    const distance = Math.max(1, Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY));
    return {
      centerX,
      centerY,
      distance,
      worldX: (centerX - pan.x) / zoom,
      worldY: (centerY - pan.y) / zoom,
    };
  };

  const toCanvasPointerEvent = (e, button = 0) => {
    const p = getPointerPoint(e);
    return { button, clientX: p.clientX, clientY: p.clientY, preventDefault: () => {}, stopPropagation: () => {} };
  };

  const getMouseWorld = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const p = getPointerPoint(e);
    const cx = p.clientX - rect.left, cy = p.clientY - rect.top;
    return canvasToWorld(cx, cy);
  };

  // ── Mouse handlers ──
  const handleMouseDown = (e) => {
    // Right-click handled by contextMenu handler, not here
    if (e.button === 2) {
      // If weapon targeting is active, right-click cancels it
      if (activeWeapon) {
        setActiveWeapon(null);
        weaponTargetRef.current = null;
        setHoveredTokenId(null);
        e.preventDefault();
        return;
      }
      // If spell targeting is active, right-click cancels it
      if (activeSpell) {
        setActiveSpell(null);
        spellTargetRef.current = null;
        setMultiTargetSelections([]);
        setCastLevel(null);
      }
      return;
    }
    // Middle mouse button always initiates pan (even during targeting)
    if (e.button === 1) {
      setDragState({ type: "pan", startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y });
      return;
    }
    setContextMenu(null);
    if (!combatLive) setTokenPopup(null);
    setShowConditionMenu(false);
    const w = getMouseWorld(e);

    // Space+click during targeting = pan (don't attack/cast, don't deselect)
    if ((activeWeapon || activeSpell) && spaceHeldRef.current) {
      setDragState({ type: "pan", startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y });
      return;
    }

    // ── Ability targeting — LEFT CLICK on token to attack/cast ──
    if (activeWeapon) {
      const { card, actorToken: attacker } = activeWeapon;
      const isSpellCard = card.resolver === "spell";
      const isMonsterCard = card.resolver === "monster-action";
      let cardRange;
      if (isSpellCard) {
        cardRange = card.data?.spell?.range || card.data?.range || 60;
      } else if (isMonsterCard) {
        // Parse range from monster action desc (e.g. "reach 10 ft." or "range 30/120 ft.")
        const desc = card.data?.action?.desc || "";
        const rangeMatch = desc.match(/(?:reach|range)\s+(\d+)/i);
        cardRange = rangeMatch ? parseInt(rangeMatch[1]) : 10;
      } else {
        cardRange = card.data?.range || 5;
      }
      const cardName = isSpellCard ? (card.data?.spell?.name || card.label || "Spell") : (card.label || card.name || "Attack");
      // Find closest token to click within 1.5 grid cells (generous for usability)
      const clickedToken = tokens.reduce((c, t) => {
        if (t.id === attacker.id) return c; // Can't target self
        if (t.hidden && viewRole === "player") return c;
        const d = Math.hypot(t.x - w.x, t.y - w.y);
        return (!c || d < c.dist) && d < gridSize * 1.5 ? { token: t, dist: d } : c;
      }, null);
      if (clickedToken) {
        // Check range: range in feet, grid = 5ft per cell (+ half-cell tolerance)
        const rangePx = (cardRange / 5) * gridSize + gridSize * 0.5;
        const distToTarget = Math.hypot(clickedToken.token.x - attacker.x, clickedToken.token.y - attacker.y);
        if (distToTarget > rangePx) {
          setSpellLog(prev => [...prev, { id: "log-" + Date.now(), msg: clickedToken.token.name + " is out of range (" + Math.round(distToTarget / gridSize * 5) + "ft / " + cardRange + "ft)", time: Date.now() }]);
          setTimeout(() => setSpellLog(prev => prev.slice(1)), 3000);
          return;
        }
        // Set focus to the clicked target and resolve
        setFocusedCombatTarget(attacker.id, clickedToken.token.id);
        setSelectedTokenId(attacker.id);
        setActiveWeapon(null);
        weaponTargetRef.current = null;
        setHoveredTokenId(null);

        if (card.resolver === "monster-action") {
          // Monster actions use executeCombatAction (resolvePlayModeCard is PC-only)
          const mAction = card.data?.action;
          if (!mAction) { openCombatSidebar("tracker"); return; }
          const didResolve = executeCombatAction(attacker.id, clickedToken.token.id, mAction);
          if (didResolve) {
            triggerMonsterActionAnim(mAction.name, attacker, clickedToken.token);
            if (card.data?.isLegendary) {
              updateToken(attacker.id, {
                legendaryActionMax: getLegendaryActionMax(attacker),
                legendaryActionChargesRemaining: Math.max(0, getLegendaryActionRemaining(attacker) - (card.data.legendaryCost || 1)),
              });
            }
            if (!card.data?.isLegendary) spendEconomy(attacker.id, "action");
            setPlayModeResolution({
              title: mAction.name,
              lines: [
                attacker.name + " uses " + mAction.name + " on " + clickedToken.token.name + ".",
                card.data.summaryText ? card.data.summaryText.slice(0, 220) + (card.data.summaryText.length > 220 ? "..." : "") : "Resolved from the monster's stat block.",
                "Result added to the combat feed.",
              ],
            });
          }
          openCombatSidebar("tracker");
        } else {
          resolvePlayModeCard(card, attacker, clickedToken.token);
          openCombatSidebar("tracker");
        }
      } else {
        setSpellLog(prev => [...prev, { id: "log-" + Date.now(), msg: "Click on a target to use " + cardName, time: Date.now() }]);
        setTimeout(() => setSpellLog(prev => prev.slice(1)), 2000);
      }
      return;
    }

    // Spell targeting — LEFT CLICK to cast (or add multi-target)
    if (activeSpell) {
      if (activeSpell.shape === "self") {
        if (selectedToken) {
          castSpell(selectedToken.x, selectedToken.y);
        } else {
          castSpell(w.x, w.y);
        }
      } else if (activeSpell.shape === "cone" || activeSpell.shape === "line") {
        if (!selectedToken) {
          setSpellLog(prev => [...prev, { id: "log-" + Date.now(), msg: "Select a token first to aim " + activeSpell.name, time: Date.now() }]);
          setTimeout(() => setSpellLog(prev => prev.slice(1)), 3000);
          return;
        }
        castSpell(w.x, w.y);
      } else {
        // Check if this is a multi-target spell
        const mtCount = getMultiTargetCount(activeSpell, castLevel, selectedToken?.level || 1);
        if (mtCount > 1 && activeSpell.shape === "single") {
          // Multi-target mode: click to add targets one by one
          const clickedToken = tokens.reduce((c, t) => {
            const d = Math.hypot(t.x - w.x, t.y - w.y);
            return (!c || d < c.dist) && d < gridSize * 3 ? { token: t, dist: d } : c;
          }, null);
          if (clickedToken) {
            const newSelections = [...multiTargetSelections, { tokenId: clickedToken.token.id, x: clickedToken.token.x, y: clickedToken.token.y }];
            setMultiTargetSelections(newSelections);
            if (newSelections.length >= mtCount) {
              // All targets selected — cast on each
              newSelections.forEach((sel, idx) => {
                setTimeout(() => {
                  // Cast individual hits as separate effects
                  const id2 = "spell-" + Date.now() + "-" + idx;
                  const upcastDmg = getUpcastDamage(activeSpell, castLevel);
                  // For multi-target, each hit gets its own damage roll
                  const singleHitSpell = { ...activeSpell, damage: activeSpell.name === "Magic Missile" ? "1d4+1 force" : upcastDmg };
                  const target = tokens.find(t => t.id === sel.tokenId);
                  if (target) {
                    // Roll damage for this single hit
                    const damageRoll = parseDiceExpression(singleHitSpell.damage.split(" ")[0]);
                    let dmg = damageRoll.total;
                    if (singleHitSpell.save && singleHitSpell.save !== "" && singleHitSpell.save !== "attack") {
                      const saveResult = rollSave(spellDC, singleHitSpell.save, target);
                      if (saveResult.success) dmg = Math.floor(dmg / 2);
                    }
                    const oldHp = target.hp != null ? target.hp : (target.maxHp || 30);
                    const newHp = Math.max(0, oldHp - dmg);
                    applyTokenVitalsUpdate(target, newHp);
                    const logId = "log-" + Date.now() + "-mt-" + idx;
                    setSpellLog(prev => [...prev, { id: logId, msg: activeSpell.name + " hit " + target.name + " for " + dmg + " " + (activeSpell.damageType || ""), time: Date.now() }]);
                    setTimeout(() => setSpellLog(prev => prev.filter(l => l.id !== logId)), 5000);
                  }
                  // Visual effect per hit
                  setSpellEffects(prev => [...prev, { id: id2, x: sel.x, y: sel.y, spell: activeSpell, startTime: Date.now() + idx * 150, casterX: selectedToken?.x || sel.x, casterY: selectedToken?.y || sel.y }]);
                  setTimeout(() => setSpellEffects(prev => prev.filter(e => e.id !== id2)), 4000);
                }, idx * 150);
              });
              // Consume spell slot
              if (activeSpell.level > 0 && selectedToken && selectedToken.spellSlots) {
                const slotLv = castLevel || activeSpell.level;
                const usedSlot = (selectedToken.usedSlots || {})[slotLv] || 0;
                const newUsed = { ...(selectedToken.usedSlots || {}), [slotLv]: usedSlot + 1 };
                updateToken(selectedToken.id, { usedSlots: newUsed });
              }
              setActiveSpell(null);
              spellTargetRef.current = null;
              setMultiTargetSelections([]);
              setCastLevel(null);
            }
          } else {
            setSpellLog(prev => [...prev, { id:"log-"+Date.now(), msg:"Click on a target token (" + (multiTargetSelections.length + 1) + "/" + mtCount + ")", time:Date.now() }]);
            setTimeout(() => setSpellLog(prev => prev.slice(1)), 2000);
          }
        } else {
          // Standard single-target or AoE cast
          castSpell(w.x, w.y);
        }
      }
      return;
    }

    // Pings work for both DM and player
    if (pingMode) {
      const id = "ping-" + Date.now();
      const newPing = { id, x: w.x, y: w.y, color: viewRole === "dm" ? "#d4433a" : "#58aaff", time: Date.now(), source: viewRole };
      setPings(prev => [...prev, newPing]);
      setPingMode(false);
      return;
    }

    // Laser pointer mode (DM only)
    if (laserMode && viewRole === "dm") {
      laserActive.current = true;
      laserPointsRef.current = [{ x: w.x, y: w.y, time: Date.now() }];
      return;
    }

    // Region marker placement mode
    if (editingRegionMarker && activeMapId && !activeSceneId) {
      addRegionMarker(activeMapId, editingRegionMarker.sceneId, w.x, w.y, editingRegionMarker.label);
      setEditingRegionMarker(null);
      return;
    }

    // Click on region markers (map overview — navigate to scene)
    if (activeMapId && !activeSceneId) {
      const map = battleMaps.find(m => m.id === activeMapId);
      if (map && map.regionMarkers) {
        const hitMarker = map.regionMarkers.find(r => Math.hypot(r.x - w.x, r.y - w.y) < gridSize * 1.2);
        if (hitMarker) {
          saveAndSwitchScene(activeMapId, hitMarker.sceneId);
          return;
        }
      }
    }

    // Props interaction (select mode only)
    if (activeTool === "select" && viewRole === "dm") {
      // Check props hit (reverse order = top first)
      const hitProp = [...props].reverse().find(p => {
        if (p.locked) return false;
        // Simple AABB check (ignore rotation for click detection)
        return w.x >= p.x && w.x <= p.x + p.width && w.y >= p.y && w.y <= p.y + p.height;
      });
      if (hitProp) {
        setSelectedPropId(hitProp.id);
        setSelectedTokenId(null);
        // Check if clicking on a resize handle
        const hs = 10 / zoom;
        const corners = [
          { dx: 0, dy: 0, corner: "tl" }, { dx: hitProp.width, dy: 0, corner: "tr" },
          { dx: hitProp.width, dy: hitProp.height, corner: "br" }, { dx: 0, dy: hitProp.height, corner: "bl" },
        ];
        const hitCorner = corners.find(c => Math.hypot((hitProp.x + c.dx) - w.x, (hitProp.y + c.dy) - w.y) < hs);
        if (hitCorner) {
          setPropResize({ propId: hitProp.id, corner: hitCorner.corner, startX: w.x, startY: w.y, origX: hitProp.x, origY: hitProp.y, origW: hitProp.width, origH: hitProp.height });
        } else {
          setPropDrag({ propId: hitProp.id, startX: w.x, startY: w.y, propStartX: hitProp.x, propStartY: hitProp.y });
        }
        return;
      }
      // Clicking on empty space deselects prop
      if (selectedPropId) {
        setSelectedPropId(null);
      }
    }

    if (activeTool === "wall") {
      const snap = snapToGridIntersection(w.x, w.y);
      if (!wallStart) {
        setWallStart(snap);
      } else {
        if (snap.x !== wallStart.x || snap.y !== wallStart.y) {
          setWalls(p => [...p, { x1:wallStart.x, y1:wallStart.y, x2:snap.x, y2:snap.y, type: selectedWallType }]);
        }
        setWallStart(null);
        setWallPreview(null);
      }
      return;
    }

    if (activeTool === "terrain") {
      const gx = Math.floor(w.x/gridSize), gy = Math.floor(w.y/gridSize);
      const key = gx + "," + gy;
      setTerrainCells(p => ({...p, [key]: selectedTerrain}));
      setDragState({ type:"terrain", adding: selectedTerrain });
      return;
    }

    if (activeTool === "select") {
      const hit = [...tokens].reverse().find(t => {
        if (t.hidden && viewRole === "player") return false;
        return Math.hypot(t.x - w.x, t.y - w.y) < gridSize * 0.44 * (({tiny:0.5,small:1,medium:1,large:2,huge:3,gargantuan:4})[t.size||"medium"]||1);
      });
      if (hit) {
        if (combatLive) {
          const actorForTargetPick = (battleFocusToken && canUseTurnPopupForToken(battleFocusToken))
            ? battleFocusToken
            : activeCombatantToken;
          if (actorForTargetPick && actorForTargetPick.id !== hit.id && getHostileTargets(actorForTargetPick).some(t => t.id === hit.id)) {
            setSelectedTokenId(actorForTargetPick.id);
            setFocusedCombatTarget(actorForTargetPick.id, hit.id);
            setSidebarOpen(true);
            setMovementMode(false);
            setMovementPath([]);
            setDragState(null);
            return;
          }
          if (!movementMode && canUseTurnPopupForToken(hit)) {
            setSelectedTokenId(hit.id);
            openTurnPopupForToken(hit);
            setSidebarOpen(true);
            setDragState(null);
            return;
          }
        }
        setSelectedTokenId(hit.id);
        if (combatLive) {
          setPendingCombatAction(null);
          setTokenPopup(null);
          setCombatLogOpen(false);
          if (movementMode && hit.id === selectedTokenId && canUseTurnPopupForToken(hit)) {
            setDragState({ type:"token-move", id:hit.id, offsetX:w.x-hit.x, offsetY:w.y-hit.y });
          } else {
            setMovementMode(false);
            setMovementPath([]);
            setDragState(null);
          }
          return;
        }
        if (viewRole === "player" && !canControlTokenForViewer(hit)) {
          setMovementMode(false);
          setMovementPath([]);
          setDragState(null);
          return;
        }
        if (movementMode && hit.id === selectedTokenId) {
          // In movement mode, clicking the selected token starts a move drag
          setDragState({ type:"token-move", id:hit.id, offsetX:w.x-hit.x, offsetY:w.y-hit.y });
        } else {
          setMovementMode(false);
          setMovementPath([]);
          setDragState({ type:"token", id:hit.id, offsetX:w.x-hit.x, offsetY:w.y-hit.y });
        }
      } else {
        // Click-to-move: if in movement mode and selectedToken exists, move token to clicked cell
        if (movementMode && selectedToken && combatLive) {
          const clickedGX = Math.floor(w.x / gridSize);
          const clickedGY = Math.floor(w.y / gridSize);
          const tokenGX = Math.floor(selectedToken.x / gridSize);
          const tokenGY = Math.floor(selectedToken.y / gridSize);

          if (clickedGX !== tokenGX || clickedGY !== tokenGY) {
            // Build path from token to clicked cell
            const fromCell = { x: tokenGX, y: tokenGY };
            const toCell = { x: clickedGX, y: clickedGY };
            const newPath = buildMovementPathSegment(fromCell, toCell);

            // Clamp path to movement budget
            const moveBudgetFt = getEffectiveMovementRemaining(selectedToken);
            const legalPath = clampMovementPathToBudget(newPath, moveBudgetFt);

            if (legalPath.length > 0) {
              // Move token to the final cell
              const finalCell = legalPath[legalPath.length - 1];
              const finalX = finalCell.x * gridSize + gridSize / 2;
              const finalY = finalCell.y * gridSize + gridSize / 2;
              const spent = getMovementPathCostFt(legalPath);

              setTokens(p => p.map(t => t.id === selectedToken.id ? { ...t, x: finalX, y: finalY } : t));
              setTurnStateByToken((prev) => {
                const current = prev[selectedToken.id] || defaultTurnState(selectedToken);
                return {
                  ...prev,
                  [selectedToken.id]: {
                    ...current,
                    movementRemaining: Math.max(0, (current.movementRemaining ?? 0) - spent),
                  },
                };
              });

              if (spent > 0) {
                addStructuredCombatLog("Moved " + spent + " ft", "Movement remaining updated", "");
                resolveOpportunityAttacksForMovement(selectedToken, { x: selectedToken.x, y: selectedToken.y }, legalPath);
              }

              setMovementOrigin({ x: finalX, y: finalY });
              setMovementPath([]);
              return;
            }
          }
        }

        setSelectedTokenId(null);
        setPendingCombatAction(null);
        setCombatLogOpen(false);
        if (combatLive) setTokenPopup(null);
        setMovementMode(false);
        setMovementPath([]);
        setDragState({ type:"pan", startX:e.clientX, startY:e.clientY, panX:pan.x, panY:pan.y });
      }
    } else if (activeTool === "draw") {
      setDrawPoints([{ x:w.x, y:w.y }]);
    } else if (activeTool === "fog") {
      const gx = Math.floor(w.x/gridSize), gy = Math.floor(w.y/gridSize);
      const key = gx + "," + gy;
      if (fogMode === "vision") {
        // In vision mode, fog tool manually reveals/hides
        setFogCells(p => ({...p, [key]: p[key] === false ? undefined : false}));
      } else {
        setFogCells(p => ({...p, [key]: !p[key]}));
      }
      setDragState({ type:"fog", adding: fogMode === "vision" ? false : !fogCells[gx + "," + gy] });
    } else if (activeTool === "ruler") {
      setRulerStart(w);
      setRulerEnd(w);
    } else if (activeTool === "eraser") {
      // Eraser: delete tokens, walls, terrain, or drawings near click
      const hitToken = [...tokens].reverse().find(t => Math.hypot(t.x - w.x, t.y - w.y) < gridSize * 0.44 * (({tiny:0.5,small:1,medium:1,large:2,huge:3,gargantuan:4})[t.size||"medium"]||1));
      if (hitToken) {
        setTokens(p => p.filter(t => t.id !== hitToken.id));
        return;
      }
      // Check walls
      const hitWall = walls.findIndex(wall => {
        const dist = distToSegment(w.x, w.y, wall.x1, wall.y1, wall.x2, wall.y2);
        return dist < 8;
      });
      if (hitWall >= 0) {
        setWalls(p => p.filter((_, i) => i !== hitWall));
        return;
      }
      // Check terrain
      const tgx = Math.floor(w.x / gridSize), tgy = Math.floor(w.y / gridSize);
      const terrainKey = tgx + "," + tgy;
      if (terrainCells[terrainKey]) {
        setTerrainCells(p => { const n = {...p}; delete n[terrainKey]; return n; });
        return;
      }
      // Check drawings (find nearest drawing within threshold)
      const hitDrawing = drawings.findIndex(d => {
        return d.points.some(pt => Math.hypot(pt.x - w.x, pt.y - w.y) < 12);
      });
      if (hitDrawing >= 0) {
        setDrawings(p => p.filter((_, i) => i !== hitDrawing));
      }
    }
  };

  const handleMouseMove = (e) => {
    if (tokenPopupDragRef.current) return;
    const w = getMouseWorld(e);

    // Laser pointer drag
    if (laserActive.current && laserMode) {
      laserPointsRef.current.push({ x: w.x, y: w.y, time: Date.now() });
      return;
    }

    // Prop drag
    if (propDrag) {
      const dx = w.x - propDrag.startX;
      const dy = w.y - propDrag.startY;
      updateProp(propDrag.propId, { x: propDrag.propStartX + dx, y: propDrag.propStartY + dy });
      return;
    }

    // Prop resize
    if (propResize) {
      const dx = w.x - propResize.startX;
      const dy = w.y - propResize.startY;
      const aspect = propResize.origW / propResize.origH;
      let newW = propResize.origW, newH = propResize.origH, newX = propResize.origX, newY = propResize.origY;
      if (propResize.corner === "br") { newW = Math.max(20, propResize.origW + dx); newH = newW / aspect; }
      else if (propResize.corner === "bl") { newW = Math.max(20, propResize.origW - dx); newH = newW / aspect; newX = propResize.origX + propResize.origW - newW; }
      else if (propResize.corner === "tr") { newW = Math.max(20, propResize.origW + dx); newH = newW / aspect; newY = propResize.origY + propResize.origH - newH; }
      else if (propResize.corner === "tl") { newW = Math.max(20, propResize.origW - dx); newH = newW / aspect; newX = propResize.origX + propResize.origW - newW; newY = propResize.origY + propResize.origH - newH; }
      updateProp(propResize.propId, { x: newX, y: newY, width: newW, height: newH });
      return;
    }

    // Weapon targeting preview — update ref AND run hover detection for glow
    if (activeWeapon) {
      weaponTargetRef.current = { x: w.x, y: w.y };
      // Run hover detection during weapon targeting so tokens glow when you hover
      const hitHover = [...tokens].reverse().find(t => {
        if (t.id === activeWeapon.actorToken?.id) return false; // skip self
        if (t.hidden && viewRole === "player") return false;
        return Math.hypot(t.x - w.x, t.y - w.y) < gridSize * 0.7;
      });
      const newHover = hitHover ? hitHover.id : null;
      if (newHover !== hoveredTokenId) setHoveredTokenId(newHover);
      if (dragState?.type !== "pan") return;
    }

    // Spell targeting preview — use ref to avoid re-creating render callback
    // Don't return early if we're panning (space+drag or middle-click+drag)
    if (activeSpell && !dragState) {
      spellTargetRef.current = { x: w.x, y: w.y };
      // Skip hover detection during spell targeting to reduce re-renders
      return;
    }
    if (activeSpell && dragState?.type === "pan") {
      // Update spell target AND continue to pan handler below (skip hover detection)
      spellTargetRef.current = { x: w.x, y: w.y };
    } else if (!activeWeapon && !activeSpell) {
      // Token hover detection (only when NOT spell targeting to avoid re-render storms)
      const hitHover = [...tokens].reverse().find(t => {
        if (t.hidden && viewRole === "player") return false;
        return Math.hypot(t.x - w.x, t.y - w.y) < gridSize * 0.45;
      });
      if ((hitHover ? hitHover.id : null) !== hoveredTokenId) {
        setHoveredTokenId(hitHover ? hitHover.id : null);
      }
    }

    // Wall preview
    if (activeTool === "wall" && wallStart) {
      setWallPreview(snapToGridIntersection(w.x, w.y));
      return;
    }

    if (!dragState && activeTool !== "draw" && activeTool !== "ruler" && activeTool !== "terrain") return;

    if (dragState?.type === "token" || dragState?.type === "token-move") {
      const newX = w.x - dragState.offsetX;
      const newY = w.y - dragState.offsetY;
      setTokens(p => p.map(t => t.id === dragState.id ? {...t, x:newX, y:newY} : t));

      // Track movement path in grid cells
      if (movementMode && dragState.type === "token-move") {
        const movingToken = tokens.find(t => t.id === dragState.id) || selectedToken;
        const moveBudgetFt = getEffectiveMovementRemaining(movingToken);
        const origin = movementOrigin || movingToken || { x: newX, y: newY };
        const originGX = Math.floor(origin.x / gridSize);
        const originGY = Math.floor(origin.y / gridSize);
        const gx = Math.floor(newX / gridSize);
        const gy = Math.floor(newY / gridSize);
        setMovementPath(prev => {
          const last = prev[prev.length - 1] || { x: originGX, y: originGY };
          if (last.x === gx && last.y === gy) return prev;

          let nextPath = [...prev];
          let nextPathCost = getMovementPathCostFt(nextPath);
          let cursorCell = last;
          let clampedCell = null;
          const segment = buildMovementPathSegment(last, { x: gx, y: gy });
          for (const cell of segment) {
            if (cell.x === originGX && cell.y === originGY) {
              nextPath = [];
              nextPathCost = 0;
              cursorCell = { x: originGX, y: originGY };
              continue;
            }
            const revisitIndex = nextPath.findIndex(pathCell => pathCell.x === cell.x && pathCell.y === cell.y);
            if (revisitIndex >= 0) {
              nextPath = nextPath.slice(0, revisitIndex + 1);
              nextPathCost = getMovementPathCostFt(nextPath);
              cursorCell = nextPath[nextPath.length - 1] || { x: originGX, y: originGY };
              continue;
            }
            if (isMovementStepBlocked(cursorCell, cell)) {
              clampedCell = cursorCell;
              break;
            }
            const stepCost = getMovementCellCostFt(cell);
            if (stepCost >= 9999 || nextPathCost + stepCost > moveBudgetFt) {
              clampedCell = nextPath[nextPath.length - 1] || { x: originGX, y: originGY };
              break;
            }
            nextPath.push(cell);
            nextPathCost += stepCost;
            cursorCell = cell;
          }

          if (clampedCell) {
            setTokens(curr => curr.map(t => t.id === dragState.id ? {
              ...t,
              x: clampedCell.x * gridSize + gridSize / 2,
              y: clampedCell.y * gridSize + gridSize / 2,
            } : t));
          }

          return nextPath;
        });
      }
    } else if (dragState?.type === "pan") {
      setPan({ x:dragState.panX + (e.clientX - dragState.startX), y:dragState.panY + (e.clientY - dragState.startY) });
    } else if (activeTool === "draw" && drawPoints.length > 0) {
      setDrawPoints(p => [...p, { x:w.x, y:w.y }]);
    } else if (dragState?.type === "fog") {
      const gx = Math.floor(w.x/gridSize), gy = Math.floor(w.y/gridSize);
      setFogCells(p => ({...p, [gx + "," + gy]: dragState.adding}));
    } else if (dragState?.type === "terrain") {
      const gx = Math.floor(w.x/gridSize), gy = Math.floor(w.y/gridSize);
      const key = gx + "," + gy;
      setTerrainCells(p => ({...p, [key]: dragState.adding}));
    } else if (activeTool === "ruler" && rulerStart) {
      setRulerEnd(w);
    }
  };

  const handleMouseUp = () => {
    // Laser pointer release
    if (laserActive.current) {
      laserActive.current = false;
      // Clean up old points after 2s
      setTimeout(() => { laserPointsRef.current = []; }, 2000);
    }
    // Prop drag/resize release
    if (propDrag) setPropDrag(null);
    if (propResize) setPropResize(null);

    if (activeTool === "draw" && drawPoints.length > 1) {
      setDrawings(p => [...p, { points:drawPoints, color:drawColor, width:drawWidth }]);
    }
    if (dragState?.type === "token" || dragState?.type === "token-move") {
      if (dragState.type === "token-move" && movementMode && combatLive) {
        const activeTokenId = combatants[turn]?.mapTokenId;
        if (activeTokenId === dragState.id && movementPath.length > 0) {
          const movingToken = tokens.find((t) => t.id === dragState.id) || selectedToken;
          const moveBudgetFt = getEffectiveMovementRemaining(movingToken);
          const legalPath = clampMovementPathToBudget(movementPath, moveBudgetFt);
          const anchor = movementOrigin || movingToken || { x: 0, y: 0 };
          const finalCell = legalPath[legalPath.length - 1] || {
            x: Math.floor(anchor.x / gridSize),
            y: Math.floor(anchor.y / gridSize),
          };
          const finalX = finalCell.x * gridSize + gridSize / 2;
          const finalY = finalCell.y * gridSize + gridSize / 2;
          const spent = getMovementPathCostFt(legalPath);
          setTokens(p => p.map(t => t.id === dragState.id ? { ...t, x: finalX, y: finalY } : t));
          setTurnStateByToken((prev) => {
            const current = prev[dragState.id] || defaultTurnState(movingToken || {});
            return {
              ...prev,
              [dragState.id]: {
                ...current,
                movementRemaining: Math.max(0, (current.movementRemaining ?? 0) - spent),
              },
            };
          });
          const movedFt = spent;
          if (movedFt > 0) addStructuredCombatLog("Moved " + movedFt + " ft", "Movement remaining updated", "");
          if (movedFt > 0) resolveOpportunityAttacksForMovement(movingToken, anchor, legalPath);
          setMovementOrigin({ x: finalX, y: finalY });
          setMovementPath([]);
        } else {
          setTokens(p => p.map(t => {
            if (t.id !== dragState.id) return t;
            return { ...t, x: Math.floor(t.x / gridSize) * gridSize + gridSize / 2, y: Math.floor(t.y / gridSize) * gridSize + gridSize / 2 };
          }));
        }
      } else {
        setTokens(p => p.map(t => {
          if (t.id !== dragState.id) return t;
          if (!snapToGrid) return t;
          return { ...t, x: Math.floor(t.x / gridSize) * gridSize + gridSize / 2, y: Math.floor(t.y / gridSize) * gridSize + gridSize / 2 };
        }));
      }
    }
    setDrawPoints([]);
    setDragState(null);
    if (activeTool === "ruler") { setRulerStart(null); setRulerEnd(null); }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches && e.touches.length >= 2) {
      const pinch = getTouchGestureMetrics(e);
      if (!pinch) return;
      touchGestureRef.current = {
        active: true,
        mode: "pinch",
        distance: pinch.distance,
        zoom,
        worldX: pinch.worldX,
        worldY: pinch.worldY,
      };
      setDragState(null);
      return;
    }
    if (!e.touches || e.touches.length !== 1) return;
    touchGestureRef.current = { active: true, mode: "drag", pointer: e.touches[0].identifier };
    handleMouseDown(toCanvasPointerEvent(e, 0));
  };

  const handleTouchMove = (e) => {
    if (!touchGestureRef.current.active) return;
    e.preventDefault();
    if (touchGestureRef.current.mode === "pinch" && e.touches && e.touches.length >= 2) {
      const pinch = getTouchGestureMetrics(e);
      if (!pinch) return;
      const baseDistance = touchGestureRef.current.distance || pinch.distance;
      const baseZoom = touchGestureRef.current.zoom || zoom;
      const nextZoom = Math.max(0.25, Math.min(4, baseZoom * (pinch.distance / baseDistance)));
      setZoom(nextZoom);
      setPan({
        x: pinch.centerX - (touchGestureRef.current.worldX || pinch.worldX) * nextZoom,
        y: pinch.centerY - (touchGestureRef.current.worldY || pinch.worldY) * nextZoom,
      });
      return;
    }
    if (!e.touches || e.touches.length !== 1) return;
    handleMouseMove(toCanvasPointerEvent(e, 0));
  };

  const handleTouchEnd = (e) => {
    if (!touchGestureRef.current.active) return;
    e.preventDefault();
    const touchMode = touchGestureRef.current.mode;
    touchGestureRef.current = { active: false, pointer: null };
    if (touchMode === "pinch") {
      setDragState(null);
      return;
    }
    handleMouseUp();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    // During weapon/spell targeting, right-click cancels (handled in mouseDown), don't show context menu
    if (activeWeapon || activeSpell) return;
    const w = getMouseWorld(e);
    // Check props first
    if (viewRole === "dm") {
      const hitProp = [...props].reverse().find(p => w.x >= p.x && w.x <= p.x + p.width && w.y >= p.y && w.y <= p.y + p.height);
      if (hitProp) {
        const rect = canvasRef.current.getBoundingClientRect();
        setContextMenu({ x: e.clientX - rect.left, y: e.clientY - rect.top, propId: hitProp.id });
        setSelectedPropId(hitProp.id);
        return;
      }
    }
    const hit = [...tokens].reverse().find(t => {
      if (t.hidden && viewRole === "player") return false;
      return Math.hypot(t.x - w.x, t.y - w.y) < gridSize * 0.44 * (({tiny:0.5,small:1,medium:1,large:2,huge:3,gargantuan:4})[t.size||"medium"]||1);
    });
    if (hit) {
      const rect = canvasRef.current.getBoundingClientRect();
      setSelectedTokenId(hit.id);
      setShowConditionMenu(false);
      if (combatLive) {
        if (canUseTurnPopupForToken(hit)) {
          openTurnPopupForToken(hit, e.clientX - rect.left, e.clientY - rect.top);
        } else {
          dismissTurnPopup();
          openCombatSidebar("tracker");
        }
        return;
      }
      openTurnPopupForToken(hit, e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleWheel = (e) => {
    // HP scroll: only when NOT in spell targeting mode
    if (!activeSpell && selectedToken && selectedToken.hp != null && (mode === "select" || mode === "combat") && canUseTurnPopupForToken(selectedToken)) {
      const w = getMouseWorld(e);
      const isOverToken = Math.hypot(selectedToken.x - w.x, selectedToken.y - w.y) < gridSize * 0.4;
      if (isOverToken) {
        const delta = e.deltaY < 0 ? 1 : -1;
        adjustTokenHp(selectedTokenId, delta);
        return;
      }
    }
    // Zoom toward mouse position for better UX
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => {
      const oldZoom = z;
      const newZoom = Math.max(0.25, Math.min(4, z + zoomDelta));
      // Adjust pan so the point under the mouse stays fixed
      const scale = newZoom / oldZoom;
      setPan(p => ({
        x: mx - scale * (mx - p.x),
        y: my - scale * (my - p.y)
      }));
      return newZoom;
    });
  };
  wheelHandlerRef.current = handleWheel;

  const handleMapUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setBgImage(img);
      img.onerror = () => console.warn("Failed to load map image");
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  // D&D token sizes: how many grid cells the token occupies
  const TOKEN_SIZES = { tiny:0.5, small:1, medium:1, large:2, huge:3, gargantuan:4 };

  const addToken = (name, color, hp, maxHp, extra) => {
    const cx = (canvasRef.current?.width / 2 - pan.x) / zoom;
    const cy = (canvasRef.current?.height / 2 - pan.y) / zoom;
    const snap = snapToGridCenter(cx, cy);
    const id = "tk-" + Date.now() + "-" + Math.random();
    setTokens(p => [...p, { id, name, color, hp, maxHp, x:snap.x, y:snap.y, vision:0, darkvision:0, speed:30, hidden:false, size:"medium", label:"", ac:null, notes:"", imageSrc:null, tokenType:"enemy", ...extra }]);
    setSelectedTokenId(id);
  };

  // Token image upload handler
  const handleTokenImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTokenId) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        tokenImagesCache.current[selectedTokenId] = img;
        updateToken(selectedTokenId, { imageSrc: dataUrl });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Drag & Drop from sidebar or files ──
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; };
  const handleDrop = (e) => {
    e.preventDefault();
    // Check for dropped image files (map background)
    if (e.dataTransfer.files?.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => setBgImage(img);
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
        return;
      }
    }
    // Check for token data from sidebar
    const data = e.dataTransfer.getData("application/token");
    if (!data) return;
    const parsed = JSON.parse(data);
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const w = canvasToWorld(cx, cy);
    const snap = snapToGridCenter(w.x, w.y);
    const id = "tk-" + Date.now() + "-" + Math.random();
    const dropExtra = {};
    if (parsed.cls) { dropExtra.cls = parsed.cls; dropExtra.level = parsed.level || 1; dropExtra.spellSlots = getMaxSpellSlots(parsed.cls, parsed.level || 1); dropExtra.usedSlots = {}; dropExtra.spellcastingMod = parsed.spellcastingMod || 3; }
    if (parsed.partyId) dropExtra.partyId = parsed.partyId;
    if (parsed.npcId != null) dropExtra.npcId = parsed.npcId;
    if (parsed.ac) dropExtra.ac = parsed.ac;
    if (parsed.tokenType) dropExtra.tokenType = parsed.tokenType;
    if (parsed.notes) dropExtra.notes = parsed.notes;
    setTokens(p => [...p, { id, name:parsed.name, color:parsed.color, hp:parsed.hp, maxHp:parsed.maxHp, x:snap.x, y:snap.y, vision:0, darkvision:0, speed:30, hidden:false, size:"medium", label:"", notes:"", imageSrc:null, tokenType:"enemy", ...dropExtra }]);
    setSelectedTokenId(id);
  };

  // ── Token actions ──
  const adjustTokenHp = (id, delta) => {
    const t = tokens.find(x => x.id === id);
    if (!t) return;
    const maxHpValue = t.maxHp != null ? t.maxHp : Math.max(0, (t.hp ?? 0) + delta);
    const hp = Math.max(0, Math.min(maxHpValue, (t.hp ?? 0) + delta));
    applyTokenVitalsUpdate(t, hp);
    // Floating combat text for manual HP adjustments
    if (delta < 0) spawnFloatingTextForToken(id, "damage", { total: Math.abs(delta), damageType: "untyped" });
    else if (delta > 0) spawnFloatingTextForToken(id, "heal", { amount: delta });
  };
  const removeToken = (id) => {
    const removedIndex = combatants.findIndex(c => c.mapTokenId === id);
    setTokens(p => p.filter(t => t.id !== id));
    setCombatants(p => p.filter(c => c.mapTokenId !== id));
    setCombatTargetByActor(p => {
      const next = {};
      Object.keys(p || {}).forEach((k) => {
        if (k !== id && p[k] !== id) next[k] = p[k];
      });
      return next;
    });
    setTokenConditions(p => {
      const next = { ...(p || {}) };
      delete next[id];
      return next;
    });
    if (selectedTokenId === id) setSelectedTokenId(null);
    if (tokenPopup?.tokenId === id) setTokenPopup(null);
    if (removedIndex >= 0 && combatants.length > 0) {
      setTurn(t => Math.max(0, removedIndex < t || t >= combatants.length - 1 ? t - 1 : t));
    }
  };
  const updateToken = (id, updates) => {
    setTokens(p => {
      const t = p.find(x => x.id === id);
      if (!t) return p;
      const merged = { ...t, ...updates };
      queueMicrotask(() => flushTokenCampaignSync(merged, updates));
      return p.map(x => x.id === id ? merged : x);
    });
  };

  // ── Bidirectional sync: token <-> party / NPC campaign records ──
  const flushTokenCampaignSync = (mergedToken, updates) => {
    if (!mergedToken || !updates) return;
    if (mergedToken.partyId && onPartyUpdate) {
      const partyUpdates = {};
      if (Object.prototype.hasOwnProperty.call(updates, "hp")) partyUpdates.hp = mergedToken.hp;
      if (Object.prototype.hasOwnProperty.call(updates, "maxHp")) partyUpdates.maxHp = mergedToken.maxHp;
      if (Object.prototype.hasOwnProperty.call(updates, "ac")) partyUpdates.ac = mergedToken.ac;
      if (Object.prototype.hasOwnProperty.call(updates, "usedSlots")) partyUpdates.usedSlots = mergedToken.usedSlots;
      if (Object.prototype.hasOwnProperty.call(updates, "knownSpells")) partyUpdates.knownSpells = mergedToken.knownSpells;
      if (Object.prototype.hasOwnProperty.call(updates, "preparedSpells")) partyUpdates.preparedSpells = mergedToken.preparedSpells;
      if (Object.prototype.hasOwnProperty.call(updates, "spellcastingMod")) partyUpdates.spellcastingMod = mergedToken.spellcastingMod;
      if (Object.prototype.hasOwnProperty.call(updates, "classResources")) partyUpdates.classResources = mergedToken.classResources;
      if (Object.prototype.hasOwnProperty.call(updates, "activeConcentrationSpell")) partyUpdates.concentrationSpell = mergedToken.activeConcentrationSpell;
      if (Object.keys(partyUpdates).length > 0) onPartyUpdate(mergedToken.partyId, partyUpdates);
    }
    if (mergedToken.npcId != null && setData) {
      const npcUpdates = {};
      if (Object.prototype.hasOwnProperty.call(updates, "hp")) npcUpdates.hp = mergedToken.hp;
      if (Object.prototype.hasOwnProperty.call(updates, "maxHp")) npcUpdates.maxHp = mergedToken.maxHp;
      if (Object.prototype.hasOwnProperty.call(updates, "ac")) npcUpdates.ac = mergedToken.ac;
      if (Object.keys(npcUpdates).length > 0) {
        setData(d => ({
          ...d,
          npcs: (d.npcs || []).map(n => n.id === mergedToken.npcId ? { ...n, ...npcUpdates } : n),
        }));
      }
    }
  };

  // Sync party -> tokens: when party data changes externally, update linked tokens
  useEffect(() => {
    if (!party || party.length === 0) return;
    setTokens(prev => prev.map(t => {
      if (!t.partyId) return t;
      const member = party.find(p => p.id === t.partyId);
      if (!member) return t;
      // Sync HP and other fields from party -> token (party is source of truth for character data)
      const updates = {};
      if (member.hp !== undefined && member.hp !== t.hp) updates.hp = member.hp;
      if (member.maxHp !== undefined && member.maxHp !== t.maxHp) updates.maxHp = member.maxHp;
      if (member.ac !== undefined && member.ac !== t.ac) updates.ac = member.ac;
      if (member.lv !== undefined && member.lv !== t.level) {
        updates.level = member.lv;
        updates.spellSlots = getMaxSpellSlots(t.cls, member.lv);
      }
      if (member.cls !== undefined && member.cls !== t.cls) updates.cls = member.cls;
      if (member.race !== undefined && member.race !== t.race) updates.race = member.race;
      if (member.subclass !== undefined && member.subclass !== t.subclass) updates.subclass = member.subclass;
      if (member.str !== undefined && member.str !== t.str) updates.str = member.str;
      if (member.dex !== undefined && member.dex !== t.dex) updates.dex = member.dex;
      if (member.con !== undefined && member.con !== t.con) updates.con = member.con;
      if (member.int !== undefined && member.int !== t.int) updates.int = member.int;
      if (member.wis !== undefined && member.wis !== t.wis) updates.wis = member.wis;
      if (member.cha !== undefined && member.cha !== t.cha) updates.cha = member.cha;
      if (member.knownSpells !== undefined) updates.knownSpells = member.knownSpells || [];
      if (member.preparedSpells !== undefined) updates.preparedSpells = member.preparedSpells || [];
      if (member.usedSlots !== undefined) updates.usedSlots = member.usedSlots || {};
      if (member.classResources !== undefined) updates.classResources = member.classResources || {};
      if (Object.keys(updates).length > 0) return { ...t, ...updates };
      return t;
    }));
  }, [party]);

  useEffect(() => {
    if (!npcs || npcs.length === 0) return;
    setTokens(prev => prev.map(t => {
      if (!t.npcId) return t;
      const n = npcs.find(x => x.id === t.npcId);
      if (!n) return t;
      const updates = {};
      if (n.hp !== undefined && n.hp !== t.hp) updates.hp = n.hp;
      if (n.maxHp !== undefined && n.maxHp !== t.maxHp) updates.maxHp = n.maxHp;
      if (n.ac !== undefined && n.ac !== t.ac) updates.ac = n.ac;
      if (Object.keys(updates).length > 0) return { ...t, ...updates };
      return t;
    }));
  }, [npcs]);

  // ── Dice rolling ──
  const rollD20 = () => {
    const result = Math.floor(Math.random() * 20) + 1;
    setDiceResult({ value: result, type: "d20", time: Date.now() });
    setRollHistory(h => [{ expr: "1d20", result, rolls: [result], modifier: 0, time: Date.now() }, ...h.slice(0, 19)]);
    setTimeout(() => setDiceResult(null), 3000);
    return result;
  };

  const rollAttack = (tokenId) => {
    const result = Math.floor(Math.random() * 20) + 1;
    const tk = tokens.find(t => t.id === tokenId);
    const name = tk?.name || "Token";
    setDiceResult({ value: result, type: "attack", name, time: Date.now(), crit: result === 20, fumble: result === 1 });
    setRollHistory(h => [{ expr: "1d20 (attack)", result, rolls: [result], modifier: 0, who: name, time: Date.now() }, ...h.slice(0, 19)]);
    setTimeout(() => setDiceResult(null), 4000);
  };

  const rollDiceExpression = (expr) => {
    if (!expr.trim()) return;
    const parsed = parseDiceExpression(expr);
    setRollHistory(h => [{ expr: parsed.expression, result: parsed.total, rolls: parsed.rolls, modifier: parsed.modifier, time: Date.now() }, ...h.slice(0, 19)]);
    setDiceInput("");
  };

  // ── Combat functions ──
  const conditionsList = DND_CONDITIONS.map(c => c.name);

  useEffect(() => {
    if (!combatLive) return;
    const current = combatants[turn];
    if (!current) return;
    const tk = tokens.find((t) => t.id === current.mapTokenId);
    if (!tk) return;
    const profile = getCombatProfile(tk);
    ensureClassResources(tk, profile);
    setTurnStateByToken((prev) => {
      const existing = prev[tk.id];
      if (existing) return prev;
      return { ...prev, [tk.id]: defaultTurnState(tk) };
    });
  }, [combatLive, combatants, turn, tokens]);

  const spendEconomy = (tokenId, actionType) => {
    setTurnStateByToken((prev) => {
      const cur = prev[tokenId] || defaultTurnState(tokens.find((t) => t.id === tokenId));
      const next = { ...cur };
      if (actionType === "action") next.actionUsed = true;
      if (actionType === "bonus") next.bonusActionUsed = true;
      if (actionType === "reaction") next.reactionSpent = true;
      return { ...prev, [tokenId]: next };
    });
  };

  const resolvePlayModeCard = (card, actorToken, overrideTarget) => {
    if (!card || !actorToken || actorToken.tokenType !== "pc") return;
    openCombatSidebar("tracker");
    const lockReason = getActionLockReasonForToken(actorToken);
    if (lockReason) {
      setPlayModeResolution({ title: card.name, lines: ["Cannot use this option right now.", lockReason] });
      return;
    }
    if (card.disabledReason) {
      setPlayModeResolution({ title: card.name, lines: ["Cannot use this option right now.", card.disabledReason] });
      return;
    }
    const profile = getCombatProfile(actorToken);
    const target = overrideTarget || getFocusedCombatTarget(actorToken);
    const spellCard = card.resolver === "spell" ? card.data?.spell : null;
    const canResolveWithoutHostile = card.resolver === "feature" || card.resolver === "other" || !!(spellCard && (spellCard.healing || spellCard.shape === "self"));
    if (!target && !canResolveWithoutHostile) {
      setPlayModeResolution({ title: card.name, lines: ["No valid hostile target found."] });
      return;
    }
    const CE = window.CombatEngine;
    if (!CE) {
      setPlayModeResolution({ title: card.name, lines: ["Combat engine not loaded.", "Check that combat-engine.js is in the same folder as campaigns.html and refresh."] });
      return;
    }
    const breaksHidden =
      card.resolver === "weapon" ||
      (card.resolver === "spell" && !!spellCard && !!(spellCard.damage || spellCard.save || spellCard.conditions?.length)) ||
      (card.resolver === "other" && ["grapple", "shove", "offhand attack"].includes(card.data?.kind || ""));
    if (breaksHidden && (tokenConditions[actorToken.id] || []).includes("Hidden")) {
      removeTokenCondition(actorToken.id, "Hidden");
    }

    if (card.resolver === "weapon") {
      const d = card.data;
      const combatOpts = { ...buildCombatEngineOptions(target, actorToken), magicalWeapon: !!actorToken.magicalWeapon };
      if (!combatOpts.hasLineOfSight) {
        setPlayModeResolution({ title: card.name, lines: ["No clear line of sight to " + target.name + ".", "Move, open a door, or change focus target before attacking."] });
        return;
      }
      const steps = [
        "Selected: " + card.name,
        "Choose target: " + target.name,
      ];
      const pcStats = {
        str: profile.abilities.str,
        dex: profile.abilities.dex,
        level: profile.level,
        conditions: (tokenConditions[actorToken.id] || []).map(c => String(c).toLowerCase()),
      };
      const engineTarget = buildEngineCombatTarget(target, target.id);
      const result = CE.executePcWeaponAttack(pcStats, engineTarget, d.weaponName, combatOpts);
      const attackResult = result.results?.[0];
      if (result.error) {
        setPlayModeResolution({ title: card.name, lines: ["Cannot use this option right now.", result.error] });
        return;
      }
      if (attackResult) {
        const modeLabel = attackResult.attackRoll?.mode === "advantage" ? "advantage" : attackResult.attackRoll?.mode === "disadvantage" ? "disadvantage" : "normal";
        steps.push("Confirm advantage/disadvantage: " + modeLabel + (target.combatDodge ? " (target is Dodging)" : "") + (combatOpts.coverACBonus ? ", " + (combatOpts.coverLabel || "cover") + " +" + combatOpts.coverACBonus + " AC" : ""));
        steps.push("Roll attack: " + (attackResult.attackRoll?.details || attackResult.attackRoll?.chosen || "?") + " + " + (attackResult.attackRoll?.modifier ?? d.toHit) + " = " + (attackResult.attackRoll?.total ?? "?"));
        steps.push("Compare to AC " + (attackResult.attackRoll?.targetAC ?? target.ac ?? 10));
      }
      if (attackResult?.hit) {
        const rawDamage = (attackResult.damage || []).reduce((sum, part) => sum + (part.totalBeforeReduction || part.total || 0), 0);
        applyAttackResultToTarget(target.id, target, attackResult.totalDamage || 0, d.damageType);
        emitPlayModeVfx(actorToken, target, {
          mode: "attack",
          actionName: card.name,
          weaponName: d.weaponName,
          damageType: d.damageType,
          amount: attackResult.totalDamage || 0,
          isCrit: !!attackResult.isCrit,
          rollValue: attackResult.attackRoll?.chosen ?? null,
          color: attackResult.isCrit ? "#ffd700" : "#f06858",
        });
        steps.push("If hit, roll damage: " + d.damageExpr + " = " + rawDamage);
        steps.push("Apply modifiers/resistances: " + (attackResult.totalDamage || 0) + " final");
        const remaining = Math.max(0, (target.hp || 0) - (attackResult.totalDamage || 0));
        steps.push("Result: Hit. " + attackResult.attackRoll.total + " vs AC " + attackResult.attackRoll.targetAC + ". " + (attackResult.totalDamage || 0) + " " + d.damageType + " damage dealt. " + target.name + " has " + remaining + " HP remaining.");
        pushCombatRoll(
          actorToken.name + " \u2694 " + target.name + (attackResult.isCrit ? " CRITICAL!" : " HIT!"),
          "Attack: " + (attackResult.attackRoll?.details || "d20") + " + " + (attackResult.attackRoll?.modifier ?? d.toHit) + " = " + (attackResult.attackRoll?.total ?? "?") + " vs AC " + (attackResult.attackRoll?.targetAC ?? target.ac ?? 10) + "  |  Damage: " + d.damageExpr + " = " + (attackResult.totalDamage || 0) + " " + d.damageType,
          attackResult.isCrit ? "crit" : "hit"
        );
        addStructuredCombatLog("Attacked " + target.name + " with " + card.name, "Hit for " + (attackResult.totalDamage || 0) + " " + d.damageType + " damage", "Action used");
        addCombatLogEntry({ type: "attack", attacker: actorToken.name, target: target.name, action: card.name, hit: true, damage: attackResult.totalDamage || 0, isCrit: !!attackResult.isCrit, roll: attackResult.attackRoll });
      } else if (attackResult) {
        emitPlayModeVfx(actorToken, target, {
          mode: "miss",
          actionName: card.name,
          rollValue: attackResult.attackRoll?.chosen ?? null,
          color: "#999",
        });
        steps.push("Result: Miss. " + attackResult.attackRoll.total + " vs AC " + attackResult.attackRoll.targetAC + ".");
        pushCombatRoll(
          actorToken.name + " \u2694 " + target.name + " MISS",
          "Attack: " + (attackResult.attackRoll?.details || "d20") + " + " + (attackResult.attackRoll?.modifier ?? d.toHit) + " = " + (attackResult.attackRoll?.total ?? "?") + " vs AC " + (attackResult.attackRoll?.targetAC ?? target.ac ?? 10),
          "miss"
        );
        addStructuredCombatLog("Attacked " + target.name + " with " + card.name, "Missed", "Action used");
        addCombatLogEntry({ type: "miss", attacker: actorToken.name, target: target.name, action: card.name, roll: attackResult.attackRoll });
      }
      spendEconomy(actorToken.id, card.type);
      setPlayModeResolution({ title: card.name, lines: steps });
      return;
    }

    if (card.resolver === "spell") {
      const sp = card.data.spell;
      const steps = ["Selected: " + sp.name, "Choose target: " + (sp.shape === "self" ? "Self" : (target ? target.name : "Target"))];
      const spellTarget = target || actorToken;
      const combatOpts = spellTarget ? buildCombatEngineOptions(spellTarget, actorToken) : buildCombatEngineOptions(actorToken, actorToken);
      const needsSight = sp.shape !== "self" && sp.shape !== "touch" && !!(sp.damage || sp.save || sp.conditions?.length);
      if (needsSight && spellTarget && spellTarget.id !== actorToken.id && !combatOpts.hasLineOfSight) {
        setPlayModeResolution({ title: sp.name, lines: ["No clear line of sight to " + spellTarget.name + ".", "Move, open a door, or switch targets before casting."] });
        return;
      }
      const slotLv = sp.level;
      if (slotLv > 0) {
        const used = (actorToken.usedSlots || {})[slotLv] || 0;
        updateToken(actorToken.id, { usedSlots: { ...(actorToken.usedSlots || {}), [slotLv]: used + 1 } });
      }
      if (sp.concentration) {
        addTokenCondition(actorToken.id, "Concentrating");
        updateToken(actorToken.id, { activeConcentrationSpell: sp.name });
      }
      if (sp.healing) {
        const healExpr = String(sp.healing).replace("mod", String(profile.spellcastingMod || 0));
        const heal = rollExprTotal(healExpr);
        const newHp = Math.min(actorToken.maxHp || actorToken.hp || heal, (actorToken.hp || 0) + heal);
        applyTokenVitalsUpdate(actorToken, newHp);
        emitPlayModeVfx(actorToken, actorToken, { mode: "heal", actionName: sp.name, amount: heal });
        steps.push("Roll healing: " + healExpr + " = " + heal);
        steps.push("Result: " + actorToken.name + " regains " + heal + " HP. Current HP: " + newHp + "/" + (actorToken.maxHp || newHp) + ".");
        addStructuredCombatLog("Cast " + sp.name, "Healed " + heal + " HP", actionTypeLabel(card.type) + " used");
      } else if (sp.save) {
        const tgt = spellTarget;
        const saveAb = { STR: "Strength", DEX: "Dexterity", CON: "Constitution", INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma" }[sp.save] || "Dexterity";
        const dc = 8 + profile.proficiencyBonus + (profile.spellcastingMod || 0);
        const saveMod = CE.getSaveModifier(tgt, saveAb) + (saveAb === "Dexterity" ? (combatOpts.dexSaveBonus || 0) : 0);
        const s = CE.makeSavingThrow(dc, saveMod, "normal");
        if (saveAb === "Dexterity" && combatOpts.dexSaveBonus) steps.push("Cover bonus: " + (combatOpts.coverLabel || "cover") + " grants +" + combatOpts.dexSaveBonus + " to this DEX save.");
        const dmg = sp.damage ? rollExprTotal(sp.damage.split(" ").shift()) : 0;
        const finalDmg = s.success ? Math.floor(dmg / 2) : dmg;
        if (finalDmg > 0) applyAttackResultToTarget(tgt.id, tgt, finalDmg, sp.damageType || "force");
        emitPlayModeVfx(actorToken, tgt, {
          mode: "save",
          actionName: sp.name,
          damageType: sp.damageType || "force",
          amount: finalDmg,
          saveSuccess: s.success,
          parsed: { shape: sp.shape || "sphere", radius: sp.radius || sp.range || 30, length: sp.length || sp.range || 30, breathType: sp.damageType || "force" },
        });
        if (sp.conditions?.length && !s.success) {
          sp.conditions.forEach((condName) => {
            addTokenCondition(tgt.id, condName);
            emitPlayModeVfx(actorToken, tgt, { mode: "condition", actionName: sp.name, conditionName: condName });
          });
        }
        steps.push(tgt.name + (s.success ? " succeeded" : " failed") + " " + saveAb + " save, " + s.total + " vs DC " + dc + ".");
        if (finalDmg > 0) steps.push((s.success ? "Takes half: " : "Takes ") + finalDmg + " " + (sp.damageType || "force") + " damage.");
        addStructuredCombatLog("Cast " + sp.name + " on " + tgt.name, (s.success ? "Save succeeded" : "Save failed"), finalDmg > 0 ? ("Damage: " + finalDmg) : (actionTypeLabel(card.type) + " used"));
      } else if (sp.damage) {
        const tgt = spellTarget;
        const atkBonus = profile.proficiencyBonus + (profile.spellcastingMod || 0);
        const atk = CE.makeAttackRoll(atkBonus, tgt.ac || 10, "normal", { coverACBonus: combatOpts.coverACBonus || 0, targetDodging: !!tgt.combatDodge });
        steps.push("Roll spell attack: d20 + " + atkBonus + " = " + atk.total);
        if (combatOpts.coverACBonus) steps.push("Cover check: " + (combatOpts.coverLabel || "cover") + " grants +" + combatOpts.coverACBonus + " AC.");
        if (atk.hit) {
          const dmg = rollExprTotal(sp.damage.split(" ").shift());
          applyAttackResultToTarget(tgt.id, tgt, dmg, sp.damageType || "force");
          emitPlayModeVfx(actorToken, tgt, {
            mode: "attack",
            actionName: sp.name,
            damageType: sp.damageType || "force",
            amount: dmg,
            isCrit: !!atk.isCrit,
            rollValue: atk.chosen ?? null,
            color: sp.color || "#b574ff",
          });
          steps.push("Result: Hit. " + atk.total + " vs AC " + (tgt.ac || 10) + ". " + dmg + " " + (sp.damageType || "force") + " damage dealt.");
          addStructuredCombatLog("Cast " + sp.name + " on " + tgt.name, "Hit for " + dmg + " " + (sp.damageType || "force"), actionTypeLabel(card.type) + " used");
        } else {
          emitPlayModeVfx(actorToken, tgt, { mode: "miss", actionName: sp.name, rollValue: atk.chosen ?? null, color: sp.color || "#b574ff" });
          steps.push("Result: Miss.");
          addStructuredCombatLog("Cast " + sp.name + " on " + tgt.name, "Missed", actionTypeLabel(card.type) + " used");
        }
      } else {
        emitPlayModeVfx(actorToken, target || actorToken, { mode: sp.applyEffect === "control" ? "shockwave" : "buff", actionName: sp.name, color: sp.color || "#58aaff", radius: sp.radius || 40 });
        if (sp.conditions?.length && target) {
          sp.conditions.forEach((condName) => {
            addTokenCondition(target.id, condName);
            emitPlayModeVfx(actorToken, target, { mode: "condition", actionName: sp.name, conditionName: condName });
          });
        }
        steps.push("Result: " + sp.description);
        addStructuredCombatLog("Used " + sp.name, sp.description, actionTypeLabel(card.type) + " used");
      }
      spendEconomy(actorToken.id, card.type);
      setPlayModeResolution({ title: card.name, lines: steps });
      return;
    }

    if (card.resolver === "feature") {
      const f = card.data.feature;
      const steps = ["Selected: " + f.name, "Type: " + actionTypeLabel(card.type)];
      if (f.id === "second_wind") {
        const heal = rollExprTotal("1d10+" + profile.level);
        const newHp = Math.min(actorToken.maxHp || actorToken.hp || heal, (actorToken.hp || 0) + heal);
        applyTokenVitalsUpdate(actorToken, newHp, { classResources: { ...(actorToken.classResources || {}), [f.id]: Math.max(0, ((actorToken.classResources || {})[f.id] || 1) - 1) } });
        emitPlayModeVfx(actorToken, actorToken, { mode: "heal", actionName: f.name, amount: heal });
        steps.push("Regain " + heal + " HP. Current HP: " + newHp + "/" + (actorToken.maxHp || newHp) + ".");
        addStructuredCombatLog("Used Second Wind", "Healed " + heal + " HP", "Bonus Action used");
      } else if (f.id === "action_surge") {
        setTurnStateByToken((prev) => ({ ...prev, [actorToken.id]: { ...(prev[actorToken.id] || defaultTurnState(actorToken)), actionUsed: false } }));
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: f.name, color: "#ffd54f" });
        steps.push("You gain one additional action this turn.");
        addStructuredCombatLog("Used Action Surge", "Action refreshed", "Special feature used");
      } else {
        const featureTarget = target || actorToken;
        emitPlayModeVfx(actorToken, featureTarget, { mode: /heal|restore/i.test(f.effect || "") ? "heal" : "buff", actionName: f.name, color: "#5ee09a" });
        steps.push("Effect: " + f.effect);
        addStructuredCombatLog("Used " + f.name, f.effect, actionTypeLabel(card.type) + " used");
      }
      if (f.pool) {
        updateToken(actorToken.id, { classResources: { ...(actorToken.classResources || {}), [f.pool]: Math.max(0, ((actorToken.classResources || {})[f.pool] || 0) - 1) } });
      } else if (f.id && (typeof f.uses === "number" || f.usesFormula) && f.id !== "second_wind") {
        updateToken(actorToken.id, { classResources: { ...(actorToken.classResources || {}), [f.id]: Math.max(0, ((actorToken.classResources || {})[f.id] || (typeof f.uses === "number" ? f.uses : 0)) - 1) } });
      }
      spendEconomy(actorToken.id, card.type);
      setPlayModeResolution({ title: card.name, lines: steps });
      return;
    }

    if (card.resolver === "other") {
      const kind = card.data.kind;
      if (kind === "dash") {
        setTurnStateByToken((prev) => ({ ...prev, [actorToken.id]: { ...(prev[actorToken.id] || defaultTurnState(actorToken)), actionUsed: true, movementRemaining: ((prev[actorToken.id]?.movementRemaining ?? (actorToken.speed || 30)) + (actorToken.speed || 30)) } }));
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#58aaff" });
        triggerActionAnim("dash", actorToken, actorToken, "#58aaff");
      } else if (kind === "interact with object") {
        setTurnStateByToken((prev) => ({ ...prev, [actorToken.id]: { ...(prev[actorToken.id] || defaultTurnState(actorToken)), freeObjectUsed: true } }));
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#58aaff" });
      } else if (kind === "dodge") {
        updateToken(actorToken.id, { combatDodge: true });
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#58aaff" });
        triggerActionAnim("dodge", actorToken, null, "#6494ed");
      } else if (kind === "disengage") {
        updateToken(actorToken.id, { combatDisengage: true });
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#58aaff" });
        triggerActionAnim("disengage", actorToken, null, "#888888");
      } else if (kind === "help") {
        const tgt = target || actorToken;
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, tgt, { mode: "buff", actionName: card.name, color: "#ffd54f" });
        triggerActionAnim("help", actorToken, tgt, "#ffd54f");
      } else if (kind === "hide") {
        const stealth = CE.rollD20(toMod(profile.abilities.dex), "normal");
        const observeTarget = target || getFocusedCombatTarget(actorToken);
        const observerProfile = observeTarget ? getCombatProfile(observeTarget) : null;
        const observerPassive = 10 + toMod(observerProfile?.abilities?.wis || observeTarget?.wis || 10);
        if (stealth.total >= observerPassive) addTokenCondition(actorToken.id, "Hidden");
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, actorToken, { mode: stealth.total >= observerPassive ? "condition" : "buff", actionName: card.name, conditionName: stealth.total >= observerPassive ? "Hidden" : "", color: "#aaccff" });
        triggerActionAnim("hide", actorToken, null, "#334");
        setPlayModeResolution({
          title: card.name,
          lines: [
            "Roll Stealth: " + stealth.details + " + " + stealth.modifier + " = " + stealth.total + ".",
            "Compare to passive Perception " + observerPassive + (observeTarget ? (" from " + observeTarget.name) : "") + ".",
            stealth.total >= observerPassive ? "Success: you are hidden until revealed by combat state." : "Failure: you are not hidden.",
          ],
        });
        addStructuredCombatLog("Used " + card.name, stealth.total >= observerPassive ? "Hidden from current focus target" : "Failed Stealth check", "Action used");
        return;
      } else if (kind === "ready") {
        updateToken(actorToken.id, { combatReadiedAction: true });
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#ffd54f" });
      } else if (kind === "search") {
        const searchMod = Math.max(toMod(profile.abilities.wis), toMod(profile.abilities.int));
        const searchRoll = CE.rollD20(searchMod, "normal");
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#58aaff", rollValue: searchRoll.chosen });
        setPlayModeResolution({
          title: card.name,
          lines: [
            "Roll Perception/Investigation: " + searchRoll.details + " + " + searchRoll.modifier + " = " + searchRoll.total + ".",
            "DM adjudicates what you discover based on line of sight and scene context.",
          ],
        });
        addStructuredCombatLog("Used " + card.name, "Search result " + searchRoll.total, "Action used");
        return;
      } else if (kind === "use an object") {
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#58aaff" });
      } else if (kind === "grapple" || kind === "shove") {
        if (!target) {
          setPlayModeResolution({ title: card.name, lines: ["No valid hostile target found."] });
          return;
        }
        const actorAthletics = CE.rollD20(toMod(profile.abilities.str) + profile.proficiencyBonus, "normal");
        const targetProfile = getCombatProfile(target);
        const targetContestMod = Math.max(toMod(targetProfile.abilities.str), toMod(targetProfile.abilities.dex));
        const targetContest = CE.rollD20(targetContestMod, "normal");
        const success = actorAthletics.total >= targetContest.total;
        if (success) addTokenCondition(target.id, kind === "grapple" ? "Grappled" : "Prone");
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, target, success ? { mode: "condition", actionName: card.name, conditionName: kind === "grapple" ? "Grappled" : "Prone" } : { mode: "miss", actionName: card.name });
        setPlayModeResolution({
          title: card.name,
          lines: [
            "Your Athletics: " + actorAthletics.details + " + " + actorAthletics.modifier + " = " + actorAthletics.total + ".",
            target.name + " contests: " + targetContest.details + " + " + targetContest.modifier + " = " + targetContest.total + ".",
            success
              ? ("Success: " + target.name + " is " + (kind === "grapple" ? "Grappled" : "Prone") + ".")
              : "Contest failed.",
          ],
        });
        addStructuredCombatLog("Used " + card.name + " on " + target.name, success ? "Contest succeeded" : "Contest failed", "Action used");
        return;
      } else if (kind === "offhand attack") {
        if (!target) {
          setPlayModeResolution({ title: card.name, lines: ["No valid hostile target found."] });
          return;
        }
        const offhandCombatOpts = { ...buildCombatEngineOptions(target, actorToken), magicalWeapon: !!actorToken.magicalWeapon };
        if (!offhandCombatOpts.hasLineOfSight) {
          setPlayModeResolution({ title: card.name, lines: ["No clear line of sight to " + target.name + ".", "Move or change focus target before using your offhand strike."] });
          return;
        }
        const weapons = getWeaponOptionsForProfile(profile);
        const weaponTable = (window.CombatEngine && window.CombatEngine.WEAPONS) ? window.CombatEngine.WEAPONS : {};
        const offhandWeapon = weapons.find((wName) => (weaponTable[wName]?.properties || []).includes("light")) || weapons[0] || "Dagger";
        const w = weaponTable[offhandWeapon];
        if (!w) {
          setPlayModeResolution({ title: card.name, lines: ["No valid offhand weapon found."] });
          return;
        }
        const offhandMod = (w.properties || []).includes("finesse") ? Math.max(toMod(profile.abilities.str), toMod(profile.abilities.dex)) : (w.melee ? toMod(profile.abilities.str) : toMod(profile.abilities.dex));
        const offhandToHit = profile.proficiencyBonus + offhandMod;
        const offhandDamageExpr = w.damage + (offhandMod < 0 ? String(offhandMod) : "");
        const offhandResult = CE.executeAttack(
          {
            str: profile.abilities.str,
            dex: profile.abilities.dex,
            level: profile.level,
            conditions: (tokenConditions[actorToken.id] || []).map(c => String(c).toLowerCase()),
          },
          buildEngineCombatTarget(target, target.id),
          {
            name: offhandWeapon + " (Offhand)",
            desc: (w.melee ? "Melee" : "Ranged") + " Weapon Attack: +" + offhandToHit + " to hit, " + (w.melee ? "reach " : "range ") + (w.range || 5) + " ft., one target. Hit: " + offhandDamageExpr + " " + (w.type || "slashing") + " damage.",
          },
          offhandCombatOpts
        );
        const offhandAttack = offhandResult.results?.[0];
        if (offhandAttack?.hit) {
          const finalDamage = offhandResult.totalDamage || offhandAttack.totalDamage || 0;
          applyAttackResultToTarget(target.id, target, finalDamage, w.type || "slashing");
          emitPlayModeVfx(actorToken, target, { mode: "attack", actionName: offhandWeapon, weaponName: offhandWeapon, damageType: w.type || "slashing", amount: finalDamage, isCrit: !!offhandAttack.isCrit, rollValue: offhandAttack.attackRoll?.chosen ?? null, color: "#ffd54f" });
          addCombatLogEntry({ type: "attack", attacker: actorToken.name, target: target.name, action: offhandWeapon + " (Offhand)", hit: true, damage: finalDamage, isCrit: !!offhandAttack.isCrit, roll: offhandAttack.attackRoll });
          setPlayModeResolution({ title: card.name, lines: ["Attack with " + offhandWeapon + ".", "Hit for " + finalDamage + " " + (w.type || "slashing") + " damage.", "Bonus Action used."] });
        } else if (offhandAttack) {
          emitPlayModeVfx(actorToken, target, { mode: "miss", actionName: offhandWeapon, rollValue: offhandAttack.attackRoll?.chosen ?? null, color: "#ffd54f" });
          addCombatLogEntry({ type: "miss", attacker: actorToken.name, target: target.name, action: offhandWeapon + " (Offhand)", roll: offhandAttack.attackRoll });
          setPlayModeResolution({ title: card.name, lines: ["Attack with " + offhandWeapon + ".", "Missed.", "Bonus Action used."] });
        }
        spendEconomy(actorToken.id, "bonus");
        return;
      } else if (kind === "communicate") {
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#5ee09a" });
      } else if (kind === "drop prone") {
        addTokenCondition(actorToken.id, "Prone");
        emitPlayModeVfx(actorToken, actorToken, { mode: "condition", actionName: card.name, conditionName: "Prone" });
      } else if (kind === "drop item") {
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: card.name, color: "#999" });
      } else {
        spendEconomy(actorToken.id, "action");
        emitPlayModeVfx(actorToken, target || actorToken, { mode: "buff", actionName: card.name, color: "#58aaff" });
      }
      setPlayModeResolution({ title: card.name, lines: ["Selected: " + card.name, card.effect, "Resolved."] });
      addStructuredCombatLog("Used " + card.name, card.effect, "Action used");
      return;
    }

    // ── Divine Smite resolver ──
    if (card.resolver === "smite") {
      if (!target) {
        setPlayModeResolution({ title: card.name, lines: ["No valid hostile target found."] });
        return;
      }
      const slotLvl = card.data.slotLevel;
      const smiteDice = card.data.smiteDice;
      const steps = ["Selected: " + card.name, "Target: " + target.name];
      // Consume spell slot
      const usedSlots = { ...(actorToken.usedSlots || {}) };
      usedSlots[slotLvl] = (usedSlots[slotLvl] || 0) + 1;
      updateToken(actorToken.id, { usedSlots });
      // Roll smite damage
      const isUndead = /undead|fiend/i.test(target.creatureType || target.type || "");
      const totalDice = smiteDice + (isUndead ? 1 : 0);
      let smiteDmg = 0;
      const rolls = [];
      for (let i = 0; i < totalDice; i++) {
        const r = Math.floor(Math.random() * 8) + 1;
        rolls.push(r);
        smiteDmg += r;
      }
      steps.push("Roll " + totalDice + "d8 radiant: [" + rolls.join(", ") + "] = " + smiteDmg + (isUndead ? " (includes +1d8 vs undead/fiend)" : ""));
      // Apply damage
      applyAttackResultToTarget(target.id, target, smiteDmg, "radiant");
      emitPlayModeVfx(actorToken, target, {
        mode: "attack",
        actionName: card.name,
        damageType: "radiant",
        amount: smiteDmg,
        isCrit: false,
        color: "#ffd700",
      });
      const remaining = Math.max(0, (target.hp || 0) - smiteDmg);
      steps.push("Result: " + smiteDmg + " radiant damage dealt. " + target.name + " has " + remaining + " HP remaining.");
      addStructuredCombatLog("Used " + card.name + " on " + target.name, "Dealt " + smiteDmg + " radiant damage", "Level " + slotLvl + " slot consumed");
      addCombatLogEntry({ type: "smite", attacker: actorToken.name, target: target.name, action: card.name, damage: smiteDmg });
      spendEconomy(actorToken.id, card.type);
      setPlayModeResolution({ title: card.name, lines: steps });
      return;
    }

    // ── Action Surge resolver ──
    if (card.resolver === "actionSurge") {
      const steps = ["Selected: Action Surge"];
      // Consume charge
      const usedSurge = (actorToken.classResources || {}).actionSurge || 0;
      updateToken(actorToken.id, { classResources: { ...(actorToken.classResources || {}), actionSurge: usedSurge + 1 } });
      // Reset action economy — give back the action
      setTurnStateByToken((prev) => ({
        ...prev,
        [actorToken.id]: {
          ...(prev[actorToken.id] || defaultTurnState(actorToken)),
          actionUsed: false,
        },
      }));
      emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: "Action Surge", color: "#ffd54f" });
      steps.push("You gain one additional action this turn.");
      steps.push("Action economy refreshed — you may take another action.");
      addStructuredCombatLog("Used Action Surge", "Action refreshed", "1 charge consumed");
      addCombatLogEntry({ type: "feature", actor: actorToken.name, action: "Action Surge", effect: "Additional action granted" });
      setPlayModeResolution({ title: card.name, lines: steps });
      return;
    }

    // ── Rage resolver ──
    if (card.resolver === "rage") {
      const isRaging = card.data.isRaging;
      const steps = ["Selected: " + card.name];
      if (isRaging) {
        // End rage
        removeTokenCondition(actorToken.id, "Raging");
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: "End Rage", color: "#ff6b6b" });
        steps.push("Rage ends. Damage bonus and resistances removed.");
        addStructuredCombatLog("Ended Rage", "Raging condition removed", "Free action");
        addCombatLogEntry({ type: "feature", actor: actorToken.name, action: "End Rage", effect: "Rage ended" });
      } else {
        // Enter rage — consume charge
        const usedRages = (actorToken.classResources || {}).rage || 0;
        updateToken(actorToken.id, { classResources: { ...(actorToken.classResources || {}), rage: usedRages + 1 } });
        addTokenCondition(actorToken.id, "Raging");
        emitPlayModeVfx(actorToken, actorToken, { mode: "buff", actionName: "Rage", color: "#ff4444", radius: 60 });
        steps.push("You enter a rage!");
        steps.push("+" + card.data.rageDmg + " to melee weapon damage rolls.");
        steps.push("Resistance to bludgeoning, piercing, and slashing damage.");
        steps.push("Advantage on Strength checks and saves.");
        addStructuredCombatLog("Entered Rage", "+" + card.data.rageDmg + " melee damage, B/P/S resistance", "Bonus Action + 1 rage charge");
        addCombatLogEntry({ type: "feature", actor: actorToken.name, action: "Rage", effect: "Entered rage" });
        spendEconomy(actorToken.id, "bonus");
      }
      setPlayModeResolution({ title: card.name, lines: steps });
      return;
    }
  };

  const startCombat = () => {
    setMode("combat");
    const preparedTokens = tokens.map((t) => {
      const alive = (t.hp || 0) > 0;
      const legendMax = getLegendaryActionMax(t);
      return {
        ...t,
        combatDodge: false,
        combatDisengage: false,
        combatReadiedAction: false,
        deathSaveSuccesses: alive ? 0 : Math.max(0, Math.min(3, Number(t.deathSaveSuccesses || 0))),
        deathSaveFailures: alive ? 0 : Math.max(0, Math.min(3, Number(t.deathSaveFailures || (t.tokenType === "pc" ? 0 : 3)))),
        deathStable: alive ? false : !!t.deathStable,
        deathDead: alive ? false : (t.tokenType !== "pc" ? true : !!t.deathDead),
        legendaryActionMax: legendMax,
        legendaryActionChargesRemaining: legendMax,
        lairActionRoundUsed: 0,
      };
    });
    setTokens(preparedTokens);
    setTokenConditions((prev) => {
      const next = { ...(prev || {}) };
      preparedTokens.forEach((tk) => {
        const conds = new Set(next[tk.id] || []);
        if ((tk.hp || 0) > 0) {
          conds.delete("Dead");
          conds.delete("Unconscious");
        } else if (tk.tokenType === "pc" && !tk.deathDead) {
          conds.add("Unconscious");
          conds.delete("Dead");
        } else {
          conds.add("Dead");
          conds.delete("Unconscious");
        }
        next[tk.id] = Array.from(conds);
      });
      return next;
    });
    const combs = preparedTokens.map(t => {
      let init, initRoll, initMod;
      if (t.monsterData && typeof window.CombatEngine !== 'undefined') {
        const dexMod = Math.floor(((t.monsterData.dex || 10) - 10) / 2);
        const result = window.CombatEngine.rollInitiative(dexMod);
        init = result.total;
        initRoll = result.roll != null ? result.roll : (result.total - dexMod);
        initMod = dexMod;
      } else {
        const profile = getCombatProfile(t);
        const dexMod = profile?.initiativeBonus ?? toMod(t.dex);
        if (typeof window.CombatEngine !== "undefined") {
          const result = window.CombatEngine.rollInitiative(dexMod);
          init = result.total;
          initRoll = result.roll != null ? result.roll : (result.total - dexMod);
        } else {
          initRoll = Math.floor(Math.random() * 20) + 1;
          init = initRoll + dexMod;
        }
        initMod = dexMod;
      }
      return {
        id: "cb-" + t.id,
        mapTokenId: t.id,
        name: t.name,
        init: init,
        initRoll: initRoll,
        initMod: initMod,
        hp: t.hp || 30,
        maxHp: t.maxHp || 30,
        ac: t.ac || 12,
        type: t.tokenType === "pc" ? "pc" : (t.tokenType === "npc" ? "npc" : "enemy"),
        color: t.color,
      };
    }).sort((a, b) => b.init - a.init);
    setCombatants(combs);
    setTurn(0);
    setRound(1);
    setCombatLive(true);
    setTurnStateByToken({});
    setCombatTargetByActor({});
    setPlayModeResolution(null);
    setPendingCombatAction(null);
    setCombatLogOpen(false);
    setConditions({});
    setDismissedTurnPopupKey("");
    setCombatTab("tracker");
    setSidebarOpen(true);
    if (combs.length > 0) {
      addCombatLogEntry({
        type: "system",
        text: "Encounter started. " + combs.map(c => c.name + " " + c.init).join(" | "),
      });
    }
    if (combs.length > 0) {
      const firstToken = preparedTokens.find(t => t.id === combs[0].mapTokenId);
      setSelectedTokenId(combs[0].mapTokenId);
      if (firstToken) {
        primeTokenForTurnStart(firstToken);
        // BG3-style first turn announcement
        setTurnAnnouncement({
          name: firstToken.name || "Unknown",
          isPC: !firstToken.monsterData,
          round: 1,
          roundStart: true,
          key: Date.now() + "-combat-start",
        });
      }
    }
  };

  const endCombat = () => {
    if (combatLive && typeof window.PhmurtCampaignCombat !== "undefined" && setData) {
      const lines = window.PhmurtCampaignCombat.summarizeTokensForLedger(tokens);
      window.PhmurtCampaignCombat.appendLedger(setData, {
        type: "combat_end",
        title: "Combat ended",
        summary: "Round " + round + " — " + (lines.length ? lines.join("; ") : "No defeats logged"),
        round: round,
        detailLines: lines,
      });
      window.PhmurtCampaignCombat.appendTimelineCombatEvent(setData, {
        headline: "Combat: " + round + " round(s)",
        text: lines.length ? lines.join(". ") : "Session combat concluded.",
        outcome: "See combat ledger",
        dmOnly: false,
      });
    }
    setCombatLive(false);
    setCombatants([]);
    setTurnStateByToken({});
    setCombatTargetByActor({});
    setPlayModeResolution(null);
    setPendingCombatAction(null);
    setCombatLogOpen(false);
    setCombatLogSidebarOpen(false);
    setSelectedActionCategory(null);
    setRollResultCard(null);
    setConditions({});
    setDismissedTurnPopupKey("");
    setTokenPopup(null);
    setShowConditionMenu(false);
    setMode("select");
    // Clear floating combat text
    if (typeof window.CombatFlowUI !== "undefined") window.CombatFlowUI.clearFloatingTexts();
  };

  // ── BG3: End-of-turn effects for the OUTGOING creature ──
  const resolveEndOfTurnEffects = (token) => {
    if (!token || !combatLive) return;
    const CE = typeof window.CombatEngine !== "undefined" ? window.CombatEngine : null;
    if (!CE) return;

    // End-of-turn condition saves (frightened, charmed, stunned, etc.)
    const conds = getMergedConditionsForToken(token);
    for (const cond of conds) {
      const condLower = cond.toLowerCase();
      if (CE.CONDITIONS_WITH_REPEAT_SAVE && CE.CONDITIONS_WITH_REPEAT_SAVE[condLower]) {
        const saveDC = token._conditionSaveDC?.[condLower] || 13;
        const result = CE.rollEndOfTurnSave(
          buildEngineCombatTarget(token, token.id),
          condLower, saveDC
        );
        if (result && result.removed) {
          removeTokenCondition(token.id, cond);
          addCombatLogEntry({ type: "save", text: token.name + " shakes off " + cond + " (DC " + result.dc + ", rolled " + result.total + ")" });
        } else if (result) {
          addCombatLogEntry({ type: "save", text: token.name + " fails to shake off " + cond + " (DC " + result.dc + ", rolled " + result.total + ")" });
        }
      }
    }

    // Terrain damage for standing in hazardous terrain
    const cellX = Math.floor(token.x / gridSize);
    const cellY = Math.floor(token.y / gridSize);
    const terrainKey = cellX + "," + cellY;
    const terrainCell = terrainCells?.[terrainKey];
    if (terrainCell && CE.TERRAIN_COMBAT_EFFECTS && CE.TERRAIN_COMBAT_EFFECTS[terrainCell]) {
      const effect = CE.resolveTerrainEffect(
        buildEngineCombatTarget(token, token.id),
        terrainCell
      );
      if (effect && effect.damageTotal > 0) {
        addCombatLogEntry({ type: "system", text: token.name + " takes " + effect.damageTotal + " " + (effect.type || "") + " damage from " + terrainCell + " terrain" });
        applyAttackResultToTarget(token.id, token, effect.damageTotal, effect.type || "fire");
        // Terrain damage VFX
        spawnFloatingTextForToken(token.id, "damage", { total: effect.damageTotal, damageType: effect.type || "fire", isCrit: false });
        triggerActionAnim("fire_bolt", null, token, effect.type === "cold" ? "#58aaff" : "#f06858");
      }
      if (effect && effect.conditionApplied) {
        addTokenCondition(token.id, effect.conditionApplied.charAt(0).toUpperCase() + effect.conditionApplied.slice(1));
        addCombatLogEntry({ type: "system", text: token.name + " is " + effect.conditionApplied + " by " + terrainCell + " terrain" });
      }
    }

    // Reset per-turn flags
    if (token._sneakAttackUsedThisTurn) {
      updateToken(token.id, { _sneakAttackUsedThisTurn: false });
    }
  };

  const primeTokenForTurnStart = (token) => {
    if (!token) return;
    const tokenPatch = {
      combatDodge: false,
      combatDisengage: false,
      combatReadiedAction: false,
      reactionSpent: false,
      freeObjectUsed: false,
      _sneakAttackUsedThisTurn: false,
    };
    if (token.monsterData?.legendaryActions?.length) {
      tokenPatch.legendaryActionMax = getLegendaryActionMax(token);
      tokenPatch.legendaryActionChargesRemaining = getLegendaryActionMax(token);
    }
    updateToken(token.id, tokenPatch);

    let nextTurnState = defaultTurnState(token);

    // FIX 1: Auto-trigger Death Saves at Turn Start
    const deathState = getDeathSaveState(token);
    if ((token.hp || 0) <= 0 && token.tokenType === "pc" && !deathState.dead && !deathState.stable) {
      const deathResult = resolveDeathSaveForToken(token);
      addCombatLogEntry({
        type: "system",
        text: token.name + " makes an automatic death save at the start of the turn."
      });
      if (!deathResult || deathResult.nextHp <= 0) {
        nextTurnState = {
          movementRemaining: 0,
          actionUsed: true,
          bonusActionUsed: true,
          reactionSpent: true,
          freeObjectUsed: true,
        };
      }
    } else if (getActionLockReasonForToken(token)) {
      nextTurnState = {
        movementRemaining: 0,
        actionUsed: true,
        bonusActionUsed: true,
        reactionSpent: true,
        freeObjectUsed: true,
      };
    }
    setTurnStateByToken(prev => ({ ...prev, [token.id]: nextTurnState }));
  };

  const deployEncounter = (enc) => {
    if (typeof window.PhmurtCampaignCombat === "undefined" || viewRole !== "dm") return;
    const specs = window.PhmurtCampaignCombat.planEncounterDeployment(enc, party, npcs);
    if (!specs.length) return;
    const cx = (canvasRef.current?.width / 2 - pan.x) / zoom;
    const cy = (canvasRef.current?.height / 2 - pan.y) / zoom;
    const newToks = [];
    let idx = 0;
    specs.forEach(spec => {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      const wx = cx + (col - 2) * gridSize * 2;
      const wy = cy + row * gridSize * 2;
      const snap = snapToGridCenter(wx, wy);
      idx++;
      if (spec.kind === "pc") {
        const p = spec.member;
        const id = "tk-" + Date.now() + "-" + Math.random() + "-" + idx;
        const slots = getMaxSpellSlots(p.cls, p.lv);
        newToks.push({
          id, name: p.name, color: "#2e8b57", hp: p.hp, maxHp: p.maxHp, x: snap.x, y: snap.y,
          vision: 0, darkvision: 0, speed: 30, hidden: false, size: "medium", label: "", ac: p.ac,
          notes: (p.cls || "") + " Lv" + (p.lv || 1) + (p.race ? " · " + p.race : ""),
          imageSrc: null, tokenType: "pc", partyId: p.id,
          cls: p.cls, level: p.lv, spellSlots: slots, usedSlots: p.usedSlots || {},
          knownSpells: p.knownSpells || [], preparedSpells: p.preparedSpells || [], spellcastingMod: p.spellcastingMod || 3,
        });
      } else if (spec.kind === "npc") {
        const n = spec.npc;
        const id = "tk-" + Date.now() + "-" + Math.random() + "-" + idx;
        newToks.push({
          id, name: n.name, color: "#58aaff", hp: n.hp ?? null, maxHp: n.maxHp ?? null, x: snap.x, y: snap.y,
          vision: 0, darkvision: 0, speed: 30, hidden: false, size: "medium", label: "", ac: n.ac ?? null,
          notes: (n.role || "") + (n.faction ? " · " + n.faction : "") + (n.loc ? " · " + n.loc : ""),
          imageSrc: null, tokenType: "npc", npcId: n.id,
        });
      } else if (spec.kind === "monster") {
        const m = spec.monster;
        const id = "tk-" + Date.now() + "-" + Math.random() + "-" + idx;
        const sizeMap = { Tiny: 0.5, Small: 1, Medium: 1, Large: 2, Huge: 3, Gargantuan: 4 };
        const sizeMult = sizeMap[m.size] || 1;
        newToks.push({
          id, name: m.name, x: snap.x, y: snap.y, color: "#dc143c",
          size: (m.size || "medium").toLowerCase(), tokenSize: sizeMult,
          hp: m.hp, maxHp: m.hp, ac: m.ac, speed: (() => { const sm = String(m.speed || "").match(/\d+/); return sm ? parseInt(sm[0], 10) : 30; })(),
          tokenType: "enemy", vision: 0, darkvision: 0, hidden: false, label: "",
          notes: `${m.size} ${m.type} · CR ${m.cr}`,
          imageSrc: null, monsterData: m,
        });
      }
    });
    setTokens(prev => [...prev, ...newToks]);
    if (setData && window.PhmurtCampaignCombat) {
      window.PhmurtCampaignCombat.appendLedger(setData, {
        type: "encounter_deploy",
        title: "Encounter deployed",
        summary: enc.name + " — " + specs.length + " token(s) placed",
      });
    }
  };

  useEffect(() => {
    if (!worldMapCommand?.launchId || worldMapCommand.type !== "encounter") return;
    const encounter = (campaignEncounters || []).find((enc) => String(enc.id) === String(worldMapCommand.encounterId));
    if (encounter && viewRole === "dm") deployEncounter(encounter);
    if (setData) {
      setData((d) => ({
        ...d,
        worldMap: {
          ...normalizeWorldMapState(d.worldMap),
          pendingLaunch: null,
          lastFocusedRegionId: worldMapCommand.regionId || normalizeWorldMapState(d.worldMap).lastFocusedRegionId,
        },
      }));
    }
  }, [worldMapCommand?.launchId, viewRole]);

  const nextTurn = () => {
    cancelCockpitIntent();

    // ── BG3: Resolve end-of-turn effects for the outgoing creature ──
    if (combatLive && combatants[turn]) {
      const outgoingToken = tokens.find(t => t.id === combatants[turn].mapTokenId);
      if (outgoingToken && (outgoingToken.hp || 0) > 0) {
        resolveEndOfTurnEffects(outgoingToken);
      }
    }

    let nextIdx = turn + 1;
    let first = -1; // hoisted so turn announcement can access it
    while (nextIdx < combatants.length && shouldSkipCombatantRow(combatants[nextIdx])) nextIdx++;
    if (nextIdx >= combatants.length) {
      const lairReady = tokens.filter((t) => t.monsterData?.legendaryActions?.length && !getActionLockReasonForToken(t) && Number(t.lairActionRoundUsed || 0) !== (round + 1));
      setRound(r => r + 1);
      first = 0;
      while (first < combatants.length && shouldSkipCombatantRow(combatants[first])) first++;
      if (first >= combatants.length) {
        setTurn(0);
        setSelectedTokenId(null);
        setPlayModeResolution({ title: "No active combatants", lines: ["Everyone remaining is defeated or stable at 0 HP.", "End the encounter when you are ready."] });
        setDismissedTurnPopupKey("");
        return;
      }
      setTurn(first);
      if (combatants[first]) setSelectedTokenId(combatants[first].mapTokenId);
      if (combatants[first]) {
        const nextToken = tokens.find(t => t.id === combatants[first].mapTokenId);
        if (nextToken) primeTokenForTurnStart(nextToken);
      }
      if (lairReady.length > 0) {
        addCombatLogEntry({
          type: "system",
          text: "Round " + (round + 1) + " begins. Lair Surge available: " + lairReady.map((t) => t.name).join(", ") + ".",
        });
      }
    } else {
      setTurn(nextIdx);
      if (combatants[nextIdx]) setSelectedTokenId(combatants[nextIdx].mapTokenId);
      if (combatants[nextIdx]) {
        const nextToken = tokens.find(t => t.id === combatants[nextIdx].mapTokenId);
        if (nextToken) primeTokenForTurnStart(nextToken);
      }
    }
    setPlayModeResolution(null);
    setDismissedTurnPopupKey("");

    // BG3-style turn announcement
    const announceFinalIdx = (nextIdx < combatants.length) ? nextIdx : (first >= 0 ? first : 0);
    const announceCombatant = combatants[announceFinalIdx] || null;
    if (announceCombatant) {
      const announceToken = tokens.find(t => t.id === announceCombatant.mapTokenId);
      if (announceToken) {
        setTurnAnnouncement({
          name: announceToken.name || "Unknown",
          isPC: !announceToken.monsterData,
          round: (nextIdx >= combatants.length) ? round + 1 : round,
          roundStart: nextIdx >= combatants.length,
          key: Date.now() + "-" + announceCombatant.mapTokenId,
        });
      }
    }
  };

  const prevTurn = () => {
    if (turn === 0 && round === 1) return;
    cancelCockpitIntent();
    let prevIdx = turn - 1;
    if (prevIdx < 0) { setRound(r => Math.max(1, r - 1)); prevIdx = combatants.length - 1; }
    while (prevIdx >= 0 && shouldSkipCombatantRow(combatants[prevIdx])) prevIdx--;
    if (prevIdx >= 0) {
      setTurn(prevIdx);
      if (combatants[prevIdx]) setSelectedTokenId(combatants[prevIdx].mapTokenId);
      if (combatants[prevIdx]) {
        const prevToken = tokens.find(t => t.id === combatants[prevIdx].mapTokenId);
        if (prevToken) primeTokenForTurnStart(prevToken);
      }
    }
    setPlayModeResolution(null);
    setDismissedTurnPopupKey("");
  };

  const adjCombatantHp = (id, d) => {
    const combatant = combatants.find(c => c.id === id);
    if (combatant) {
      const tok = tokens.find(t => t.id === combatant.mapTokenId);
      if (tok) {
        const newHp = Math.max(0, Math.min(tok.maxHp, (tok.hp ?? 0) + d));
        applyTokenVitalsUpdate(tok, newHp);
      }
    }
  };

  const addCondition = (id, cond) => {
    if (!cond) return;
    setConditions(p => ({ ...p, [id]: [...new Set([...(p[id] || []), cond])] }));
    const combatant = combatants.find(c => c.id === id);
    if (combatant?.mapTokenId) addTokenCondition(combatant.mapTokenId, cond);
  };
  const removeCondition = (id, idx) => {
    const combatant = combatants.find(c => c.id === id);
    const mergedConds = [...new Set([...(conditions[id] || []), ...(combatant?.mapTokenId ? (tokenConditions[combatant.mapTokenId] || []) : [])])];
    const condName = mergedConds[idx];
    setConditions(p => ({ ...p, [id]: (p[id] || []).filter((cond) => cond !== condName) }));
    if (combatant?.mapTokenId && condName) removeTokenCondition(combatant.mapTokenId, condName);
  };
  const removeCombatant = (id) => {
    setCombatants(p => p.filter(c => c.id !== id));
    if (turn >= combatants.length - 1) setTurn(t => Math.max(0, t - 1));
  };

  const addCombatantToEncounter = () => {
    if (!addName.trim() || !addInit) return;
    const tokenId = "tk-" + Date.now() + "-" + Math.random();
    const cx = (canvasRef.current?.width / 2 - pan.x) / zoom;
    const cy = (canvasRef.current?.height / 2 - pan.y) / zoom;
    const snap = snapToGridCenter(cx, cy);
    const hpNum = parseInt(addHp) || 30;
    setTokens(p => [...p, { id: tokenId, name: addName, color: cssVar("--crimson"), hp: hpNum, maxHp: hpNum, x: snap.x, y: snap.y, vision:0, darkvision:0, speed:30, hidden:false }]);
    const newC = { id: "cb-" + Date.now(), mapTokenId: tokenId, name: addName, init: parseInt(addInit), hp: hpNum, maxHp: hpNum, ac: parseInt(addAc) || 12, type: "enemy" };
    setCombatants(p => [...p, newC].sort((a, b) => b.init - a.init));
    setCombatLive(true);
    openCombatSidebar("tracker");
    setAddName(""); setAddInit(""); setAddHp(""); setAddAc("");
  };

  // ── Export/Import battle state ──
  const exportBattleState = () => {
    const state = {
      tokens, drawings, walls, terrainCells, fogCells, bgColor, gridSize, showGrid, fogMode,
      combatLive, combatants, turn, round, conditions, tokenConditions, turnStateByToken,
      combatTargetByActor, playModeResolution, combatLog,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "battlemap-" + new Date().toISOString().slice(0,10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBattleState = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const state = JSON.parse(ev.target.result);
        if (state.tokens) setTokens(state.tokens);
        if (state.drawings) setDrawings(state.drawings);
        if (state.walls) setWalls(state.walls);
        if (state.terrainCells) setTerrainCells(state.terrainCells);
        if (state.fogCells) setFogCells(state.fogCells);
        if (state.bgColor) setBgColor(state.bgColor);
        if (state.gridSize) setGridSize(state.gridSize);
        if (state.showGrid !== undefined) setShowGrid(state.showGrid);
        if (state.fogMode) setFogMode(state.fogMode);
        if (state.combatLive !== undefined) setCombatLive(state.combatLive);
        if (state.combatants) setCombatants(state.combatants);
        if (state.turn !== undefined) setTurn(state.turn);
        if (state.round !== undefined) setRound(state.round);
        setConditions(state.conditions || {});
        setTokenConditions(state.tokenConditions || {});
        setTurnStateByToken(state.turnStateByToken || {});
        setCombatTargetByActor(state.combatTargetByActor || {});
        setPlayModeResolution(state.playModeResolution || null);
        setCombatLog(state.combatLog || []);
      } catch (err) { console.error("Import failed:", err); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── Encounter templates ──
  const saveEncounterTemplate = () => {
    if (!templateName.trim()) return;
    const tpl = {
      id: "tpl-" + Date.now(),
      name: templateName,
      combatants: combatants.map(c => ({...c})),
      combatTargetByActor: { ...combatTargetByActor },
      tokens: tokens.map(t => ({...t})),
      turnStateByToken: JSON.parse(JSON.stringify(turnStateByToken)),
      playModeResolution: playModeResolution ? JSON.parse(JSON.stringify(playModeResolution)) : null,
      combatLog: JSON.parse(JSON.stringify(combatLog)),
      conditions: {...conditions},
      tokenConditions: {...tokenConditions},
    };
    const updated = [...templates, tpl];
    setTemplates(updated);
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(updated));
    // Also save to Supabase cloud
    if (typeof PhmurtDB !== 'undefined' && activeCampaignId && activeCampaignId !== 'example') {
      PhmurtDB.saveEncounterTemplate(activeCampaignId, tpl).catch(() => {});
    }
    setTemplateName("");
    setShowTemplateInput(false);
  };

  const loadEncounterTemplate = (id) => {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    setTokens(tpl.tokens.map(t => ({...t})));
    setCombatants(tpl.combatants.map(c => ({...c})));
    setCombatTargetByActor({ ...(tpl.combatTargetByActor || {}) });
    setConditions({ ...(tpl.conditions || {}) });
    setTokenConditions({ ...(tpl.tokenConditions || {}) });
    setCombatLive(tpl.combatants.length > 0);
    if (tpl.combatants.length > 0) { setTurn(0); setRound(1); setMode("combat"); }
  };

  const deleteTemplate = (id) => {
    const tpl = templates.find(t => t.id === id);
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(updated));
    // Also delete from Supabase cloud
    if (typeof PhmurtDB !== 'undefined' && tpl && tpl._fromCloud) {
      PhmurtDB.deleteEncounterTemplate(id).catch(() => {});
    }
  };

  // ── Quick macros ──
  const macroRollInitiative = () => {
    if (!selectedToken) return;
    const result = parseDiceExpression("1d20");
    setDiceResult({ value: result.total, type: "initiative", name: selectedToken.name, time: Date.now() });
    setRollHistory(prev => [{ expr: "1d20", rolls: result.rolls, mod: 0, total: result.total, who: selectedToken.name + " initiative", time: Date.now() }, ...prev].slice(0, 20));
    setTimeout(() => setDiceResult(null), 3000);
    // Update combatant init if in combat
    const cb = combatants.find(c => c.mapTokenId === selectedTokenId);
    if (cb) {
      setCombatants(prev => prev.map(c => c.id === cb.id ? {...c, init: result.total} : c).sort((a,b) => b.init - a.init));
    }
  };

  const macroSavingThrow = () => {
    const dc = prompt("DC for saving throw:");
    if (!dc) return;
    const result = parseDiceExpression("1d20");
    const pass = result.total >= parseInt(dc);
    setDiceResult({ value: result.total, type: "save", name: (selectedToken?.name || "Save") + (pass ? " PASS" : " FAIL"), time: Date.now(), crit: result.total === 20, fumble: result.total === 1 });
    setRollHistory(prev => [{ expr: "1d20 vs DC" + dc, rolls: result.rolls, mod: 0, total: result.total, who: (selectedToken?.name || "?") + " save " + (pass ? "PASS" : "FAIL"), time: Date.now() }, ...prev].slice(0, 20));
    setTimeout(() => setDiceResult(null), 3500);
  };

  const macroShortRest = () => {
    setTokens(prev => prev.map(t => {
      if (!t.maxHp) return t;
      const updated = { ...t, hp: Math.min(t.maxHp, t.hp + Math.floor(t.maxHp / 2)) };
      // Warlocks recover Pact Magic slots on short rest
      if (t.cls === "Warlock" && t.spellSlots) {
        updated.usedSlots = {};
      }
      return updated;
    }));
    setCombatants(prev => prev.map(c => ({...c, hp: Math.min(c.maxHp, c.hp + Math.floor(c.maxHp / 2))})));
    setRollHistory(prev => [{ expr: "Short Rest", rolls: [], mod: 0, total: 0, who: "Party healed (Warlock slots restored)", time: Date.now() }, ...prev].slice(0, 20));
  };

  const macroLongRest = () => {
    setTokens(prev => prev.map(t => {
      if (!t.maxHp) return t;
      const updated = { ...t, hp: t.maxHp }; // Full HP restore
      // All casters recover all spell slots on long rest
      if (t.spellSlots) {
        updated.usedSlots = {};
      }
      return updated;
    }));
    setCombatants(prev => prev.map(c => ({...c, hp: c.maxHp})));
    setRollHistory(prev => [{ expr: "Long Rest", rolls: [], mod: 0, total: 0, who: "Party fully restored (all slots recovered)", time: Date.now() }, ...prev].slice(0, 20));
  };

  const macroPerception = () => {
    const mod = prompt("WIS modifier:");
    const result = parseDiceExpression("1d20+" + (parseInt(mod) || 0));
    setDiceResult({ value: result.total, type: "perception", name: (selectedToken?.name || "Perception"), time: Date.now(), crit: result.rolls[0] === 20, fumble: result.rolls[0] === 1 });
    setRollHistory(prev => [{ expr: "1d20+" + (parseInt(mod) || 0), rolls: result.rolls, mod: result.modifier, total: result.total, who: (selectedToken?.name || "?") + " perception", time: Date.now() }, ...prev].slice(0, 20));
    setTimeout(() => setDiceResult(null), 3000);
  };

  // ── Point-to-segment distance (for eraser hitting walls) ──
  function distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  // ── Presets & definitions ──
  const isLightMode = document.documentElement.classList.contains("light-mode");
  /* Light/dark color helper: lm(darkValue, lightValue) returns the right one */
  const lm = (dark, light) => isLightMode ? light : dark;
  /* Common theme-aware inline colors */
  const panelBg = lm("rgba(10,10,16,0.95)", "rgba(255,255,255,0.97)");
  const panelBgSolid = lm("rgba(8,8,12,0.92)", "rgba(248,244,232,0.96)");
  const subtleBg = lm("rgba(0,0,0,0.12)", "rgba(0,0,0,0.04)");
  const subtleBg2 = lm("rgba(0,0,0,0.15)", "rgba(0,0,0,0.06)");
  const subtleBorder = lm("rgba(255,255,255,0.08)", "rgba(0,0,0,0.1)");
  const subtleBorderFaint = lm("rgba(255,255,255,0.04)", "rgba(0,0,0,0.06)");
  const hoverBg = lm("rgba(255,255,255,0.06)", "rgba(0,0,0,0.06)");
  const panelShadow = lm("0 20px 58px rgba(0,0,8,0.78)", "0 20px 58px rgba(0,0,0,0.18)");
  const bgPresets = isLightMode ? [
    { c:"#f5ede0", l:"Parchment" }, { c:"#e8dcc8", l:"Tan" }, { c:"#d5cbb5", l:"Stone" },
    { c:"#c5d5c5", l:"Forest" }, { c:"#d5dde5", l:"Water" },
  ] : [
    { c:"#10101e", l:"Dark" }, { c:"#1e3e22", l:"Forest" }, { c:"#30281a", l:"Cave" },
    { c:"#143040", l:"Water" }, { c:"#4a3e30", l:"Sand" },
  ];

  const bmModes = viewRole === "player"
    ? [{ id:"select", icon:Target, label:"Select" }, { id:"combat", icon:Swords, label:"Combat" }]
    : [{ id:"select", icon:Target, label:"Select" }, { id:"draw", icon:Edit3, label:"Draw" }, { id:"combat", icon:Swords, label:"Combat" }];

  const drawToolDefs = [
    { id:"draw", label:"Draw", icon:Edit3 },
    { id:"fog", label:"Fog", icon:Eye },
    { id:"wall", label:"Wall", icon:Lock },
    { id:"terrain", label:"Terrain", icon:Mountain },
    { id:"ruler", label:"Ruler", icon:Compass },
    { id:"eraser", label:"Eraser", icon:Trash2 },
  ];

  const getCursor = () => {
    if (activeWeapon) return "crosshair";
    if (activeSpell) return "crosshair";
    if (pingMode) return "crosshair";
    if (laserMode) return "none";
    if (editingRegionMarker) return "crosshair";
    if (movementMode) return "move";
    if (dragState?.type === "pan") return "grabbing";
    if (dragState?.type === "token" || dragState?.type === "token-move") return "grabbing";
    if (mode === "draw") {
      if (drawTool === "eraser") return "pointer";
      return "crosshair";
    }
    if (hoveredTokenId) return "pointer";
    if (mode === "select") return "grab";
    return "default";
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minHeight:0 }}>
      {/* Top-level hidden file inputs for reliable label association */}
      <input type="file" ref={fileRef} id="battlemap-file-upload" style={{display:"none"}} accept="image/*" onChange={handleMapUpload} />


      <div style={{ display:"flex", flex:1, minHeight:0, position:"relative" }}>

        {/* ── CENTER: Canvas ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <div ref={wrapRef} style={{ flex:1, position:"relative", overflow:"hidden", background:bgColor, boxShadow: "inset 0 0 40px rgba(0,0,6,0.7), inset 0 3px 20px rgba(0,0,6,0.5), inset 0 0 6px rgba(0,0,6,0.4)", cursor:getCursor(), transition:"box-shadow 0.3s ease" }}
            onDragOver={handleDragOver} onDrop={handleDrop}>
            <canvas ref={canvasRef} style={{ display:"block", width:"100%", height:"100%", position:"absolute", top:0, left:0, touchAction:"none", WebkitUserSelect:"none", userSelect:"none" }}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd} onContextMenu={handleContextMenu} />
            {/* Map file input moved to top-level for reliable label association */}

            {/* Canvas edge overlays — subtle borders that integrate panels with map */}
            <div style={{ position:"absolute", top:0, left:0, bottom:0, width:2, background:"linear-gradient(180deg, var(--crimson-border) 0%, transparent 30%, transparent 70%, var(--crimson-border) 100%)", pointerEvents:"none", zIndex:5, opacity:cockpitModeActive ? 0.14 : 0.5 }} />
            <div style={{ position:"absolute", top:0, right:0, bottom:0, width:2, background:"linear-gradient(180deg, var(--crimson-border) 0%, transparent 30%, transparent 70%, var(--crimson-border) 100%)", pointerEvents:"none", zIndex:5, opacity: cockpitModeActive ? 0.14 : (sidebarOpen ? 0.5 : 0) }} />
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg, var(--crimson-border) 0%, transparent 20%, transparent 80%, var(--crimson-border) 100%)", pointerEvents:"none", zIndex:5, opacity:cockpitModeActive ? 0.14 : 0.4 }} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"linear-gradient(90deg, var(--crimson-border) 0%, transparent 20%, transparent 80%, var(--crimson-border) 100%)", pointerEvents:"none", zIndex:5, opacity:cockpitModeActive ? 0.14 : 0.4 }} />

            {/* Corner accents — small L-shaped decorations in corners */}
            <div style={{ position:"absolute", top:0, left:0, width:16, height:16, borderTop:"2px solid var(--crimson-border)", borderLeft:"2px solid var(--crimson-border)", pointerEvents:"none", zIndex:6, opacity:cockpitModeActive ? 0 : 0.6 }} />
            <div style={{ position:"absolute", top:0, right:0, width:16, height:16, borderTop:"2px solid var(--crimson-border)", borderRight:"2px solid var(--crimson-border)", pointerEvents:"none", zIndex:6, opacity:cockpitModeActive ? 0 : (sidebarOpen?0.6:0.3) }} />
            <div style={{ position:"absolute", bottom:0, left:0, width:16, height:16, borderBottom:"2px solid var(--crimson-border)", borderLeft:"2px solid var(--crimson-border)", pointerEvents:"none", zIndex:6, opacity:cockpitModeActive ? 0 : 0.6 }} />
            <div style={{ position:"absolute", bottom:0, right:0, width:16, height:16, borderBottom:"2px solid var(--crimson-border)", borderRight:"2px solid var(--crimson-border)", pointerEvents:"none", zIndex:6, opacity:cockpitModeActive ? 0 : (sidebarOpen?0.6:0.3) }} />

            {/* ── DM/Player View Indicator ── */}
            {combatLive && setViewRole && (
              <ViewModeIndicator
                viewRole={viewRole}
                onToggle={() => setViewRole(prev => prev === "dm" ? "player" : "dm")}
              />
            )}

            {/* ── BG3-style Initiative Bar (top of battlemap) ── */}
            {combatLive && combatants.length > 0 && (
              <InitiativeBar
                combatants={combatants}
                tokens={tokens}
                turn={turn}
                round={round}
                activeCombatantId={activeCombatantToken?.id || null}
                selectedTokenId={selectedTokenId}
                onSelectToken={setSelectedTokenId}
                onNextTurn={() => { nextTurn(); dismissTurnPopup(); }}
                onPrevTurn={prevTurn}
                turnState={turnStateByToken}
                getHpColor={getHpColor}
                getMergedConditions={getMergedConditionsForToken}
                getDeathState={getDeathSaveState}
                onToggleLog={() => { setCombatLogSidebarOpen(prev => !prev); setCombatLogOpen(prev => !prev); setPendingCombatAction(null); }}
                onEndCombat={viewRole === "dm" ? endCombat : undefined}
                logOpen={combatLogSidebarOpen || combatLogOpen}
                combatRollLog={combatRollLog}
              />
            )}

            {/* ── BG3-style Turn Announcement Banner ── */}
            {combatLive && turnAnnouncement && (
              <TurnBanner announcement={turnAnnouncement} />
            )}

            {/* ── Floating Roll Display (separate from init bar so it doesn't cover content) ── */}
            {combatLive && combatRollLog.length > 0 && (
              <CombatRollDisplay combatRollLog={combatRollLog} />
            )}

            {/* Turn guidance banner */}
            {combatLive && activeCombatantToken && !activeWeapon && !activeSpell && !movementMode && (() => {
              const guidance = getTurnGuidance(activeCombatantToken);
              if (!guidance) return null;
              const isDone = guidance.phase === "done";
              return (
                <div style={{
                  position:"absolute", bottom: 190, left:"50%", transform:"translateX(-50%)",
                  zIndex:30, pointerEvents:"none",
                  display:"flex", alignItems:"center", gap:10,
                  padding:"8px 20px", borderRadius:10,
                  background: isDone ? "rgba(94,224,154,0.12)" : "rgba(10,10,18,0.75)",
                  backdropFilter:"blur(8px)",
                  border:"1px solid " + guidance.color + "44",
                  boxShadow:"0 4px 16px rgba(0,0,0,0.3)",
                }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background: guidance.color, boxShadow:"0 0 8px " + guidance.color + "88" }} />
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:11, color: guidance.color, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>
                    {guidance.hint}
                  </div>
                  <div style={{ fontFamily:"'Spectral', serif", fontSize:10, color:"var(--text-muted, #999)", fontWeight:500 }}>
                    {guidance.msg}
                  </div>
                </div>
              );
            })()}

            {/* ── Targeting Mode Banner — shows during activeWeapon/activeSpell targeting ── */}
            {combatLive && (activeWeapon || activeSpell) && (() => {
              const aw = activeWeapon || {};
              const cardLabel = aw.card?.label || aw.card?.name || (activeSpell?.name) || "Ability";
              const rangeFt = aw.card?.data?.range || (activeSpell?.range) || 5;
              const isMelee = rangeFt <= 10;
              const accentColor = isMelee ? "#f06858" : "#58aaff";
              return (
                <div style={{
                  position:"absolute", top: 60, left:"50%", transform:"translateX(-50%)",
                  zIndex:55, pointerEvents:"none",
                  display:"flex", alignItems:"center", gap:12,
                  padding:"10px 24px", borderRadius:12,
                  background:"rgba(10,10,18,0.88)", backdropFilter:"blur(12px)",
                  border:"2px solid " + accentColor + "55",
                  boxShadow:"0 4px 24px rgba(0,0,0,0.5), 0 0 40px " + accentColor + "15",
                  animation:"pulse 1.5s ease-in-out infinite",
                }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:accentColor, boxShadow:"0 0 12px " + accentColor + "aa", animation:"pulse 1s ease-in-out infinite" }} />
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:14, fontWeight:800, color:accentColor, letterSpacing:"2px", textTransform:"uppercase" }}>
                    {cardLabel}
                  </div>
                  <div style={{ width:1, height:20, background:"rgba(255,255,255,0.12)" }} />
                  <div style={{ fontFamily:"'Spectral', serif", fontSize:12, color:"#ccc", fontWeight:500 }}>
                    Click a target ({rangeFt}ft range)
                  </div>
                  <div style={{ fontFamily:"'Spectral', serif", fontSize:10, color:"rgba(255,255,255,0.4)" }}>
                    Right-click or ESC to cancel
                  </div>
                </div>
              );
            })()}

            {/* ── OA / Reaction Prompt Overlay ── */}
            {reactionPrompt && (() => {
              const { attackerToken: rpAtk, moverToken: rpMov } = reactionPrompt;
              return (
                <div style={{
                  position:"absolute", top:"50%", left:"50%", transform:"translate(-50%, -50%)",
                  zIndex:200, pointerEvents:"auto",
                  padding:"20px 28px", borderRadius:16,
                  background:"rgba(10,10,18,0.95)", backdropFilter:"blur(16px)",
                  border:"2px solid rgba(181,116,255,0.45)",
                  boxShadow:"0 8px 48px rgba(0,0,0,0.7), 0 0 60px rgba(181,116,255,0.15)",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:12,
                  maxWidth:360, textAlign:"center",
                }}>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:14, fontWeight:800, color:"#b574ff", letterSpacing:"2px", textTransform:"uppercase" }}>
                    Opportunity Attack!
                  </div>
                  <div style={{ fontFamily:"'Spectral', serif", fontSize:13, color:"#ddd", lineHeight:1.5 }}>
                    {rpMov.name} is leaving {rpAtk.name}'s reach.
                  </div>
                  <div style={{ fontFamily:"'Spectral', serif", fontSize:11, color:"rgba(255,255,255,0.5)" }}>
                    Use {rpAtk.name}'s reaction for an opportunity attack?
                  </div>
                  <div style={{ display:"flex", gap:12, marginTop:4 }}>
                    <button type="button" onClick={() => { if (reactionPromptResolveRef.current) reactionPromptResolveRef.current(true); setReactionPrompt(null); }}
                      style={{ padding:"8px 20px", borderRadius:8, background:"rgba(181,116,255,0.2)", border:"1px solid rgba(181,116,255,0.5)", color:"#b574ff", fontFamily:"'Cinzel', serif", fontSize:12, fontWeight:700, letterSpacing:"1px", cursor:"pointer" }}>
                      ATTACK
                    </button>
                    <button type="button" onClick={() => { if (reactionPromptResolveRef.current) reactionPromptResolveRef.current(false); setReactionPrompt(null); }}
                      style={{ padding:"8px 20px", borderRadius:8, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"#888", fontFamily:"'Cinzel', serif", fontSize:12, fontWeight:700, letterSpacing:"1px", cursor:"pointer" }}>
                      PASS
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ── BG3-style Token Action Ring (around active token) ── */}
            {(() => {
              const ringToken = activeCombatantToken;
              const ringVisible = combatLive && !!ringToken && !movementMode && !combatLogOpen;
              if (!ringVisible || !ringToken) return null;
              const sx = ringToken.x * zoom + pan.x;
              const sy = ringToken.y * zoom + pan.y;
              const tokenScreenRadius = (gridSize / 2) * zoom;
              const ringActions = getCockpitTrayActions(ringToken);
              const moveFt = getEffectiveMovementRemaining(ringToken) + " ft";
              return (
                <TokenActionRing
                  visible={true}
                  token={ringToken}
                  actions={ringActions}
                  screenX={sx}
                  screenY={sy}
                  tokenRadius={tokenScreenRadius}
                  onAction={(action) => {
                    if (action.onClick) { action.onClick(); }
                    else { chooseCockpitAction(action); }
                  }}
                  onMove={() => startCockpitMovement(ringToken)}
                  moveLabel={moveFt}
                  onEndTurn={() => { nextTurn(); dismissTurnPopup(); }}
                  onDismiss={() => setPlayModeResolution(null)}
                  resolution={playModeResolution}
                />
              );
            })()}

            {cockpitModeActive && (
              <div className="cm-combat-shell">
                {/* ── TOP: Initiative Rail (replaced by new InitiativeBar above) ── */}
                {/* CombatTopBar hidden — InitiativeBar + TokenActionRing now handle BG3-style combat UI */}

                {/* ── BOTTOM-LEFT: Focus Strip (active unit summary) ── */}
                <FocusStrip
                  token={battleFocusToken}
                  combatant={battleFocusCombatant}
                  conditions={focusConds}
                  moveLabel={focusMoveLabel}
                  actionReady={focusTurnState ? !focusTurnState.actionUsed : false}
                  bonusReady={focusTurnState ? !focusTurnState.bonusActionUsed : false}
                  reactionReady={focusTurnState ? !focusTurnState.reactionSpent : false}
                  canAdjustHp={!!battleFocusToken && viewRole === "dm"}
                  onAdjustHp={(delta) => battleFocusToken && adjustTokenHp(battleFocusToken.id, delta)}
                  onToggleCondition={(cond) => {
                    if (!battleFocusToken || !cond) return;
                    if (getMergedConditionsForToken(battleFocusToken).includes(cond)) removeTokenCondition(battleFocusToken.id, cond);
                    else addTokenCondition(battleFocusToken.id, cond);
                  }}
                />

                {/* ── RIGHT: Confirm Flyout (only for attack/spell/move confirmation) ── */}
                <ConfirmFlyout
                  open={cockpitUiMode === "attack" || cockpitUiMode === "ability" || cockpitUiMode === "move"}
                  uiMode={cockpitUiMode}
                  token={battleFocusToken}
                  pendingAction={pendingCombatAction}
                  activeSpell={activeSpell}
                  focusTarget={battleFocusTarget}
                  focusDistance={focusDistance}
                  focusLane={focusLane}
                  moveLabel={focusMoveLabel}
                  movementPath={movementPath}
                  movementOrigin={movementOrigin}
                  onConfirm={confirmCockpitAction}
                  onCancel={() => { cancelCockpitIntent(); dismissTurnPopup(); }}
                />

                {/* ── RIGHT: Enhanced Combat Log Sidebar ── */}
                <EnhancedCombatLogSidebar
                  open={combatLogSidebarOpen}
                  entries={combatLog}
                  round={round}
                  viewRole={viewRole}
                  onClose={() => { setCombatLogSidebarOpen(false); setCombatLogOpen(false); }}
                  onClear={() => { setCombatLog([]); setPlayModeResolution(null); }}
                  getTokenById={(id) => tokens.find(t => t.id === id)}
                />

                {/* ── BOTTOM-RIGHT: Legacy Combat Log Overlay (fallback when sidebar closed) ── */}
                {!combatLogSidebarOpen && (
                  <CombatLogOverlay
                    open={combatLogOpen}
                    entries={combatLog}
                    latestResolution={playModeResolution}
                    onClear={() => { setCombatLog([]); setPlayModeResolution(null); }}
                  />
                )}

                {/* ── BOTTOM: Action Hotbar (hidden when TokenActionRing is active) ── */}
                <ActionHotbar
                  visible={!!tokenPopup && !!launcherToken && launcherCanAct && !combatLogOpen && movementMode}
                  token={launcherToken}
                  moveLabel={launcherToken ? (getEffectiveMovementRemaining(launcherToken) + " ft") : "0 ft"}
                  actions={launcherActions}
                  selectedActionKey={pendingCombatAction?.key || ""}
                  onChooseMove={() => launcherToken && startCockpitMovement(launcherToken)}
                  onChooseAction={chooseCockpitAction}
                  onClose={dismissTurnPopup}
                />
              </div>
            )}


            {/* ── BOTTOM: Enhanced Action Panel (position:fixed, renders above everything) ── */}
            {combatLive && activeCombatantToken && !movementMode && !combatLogSidebarOpen && (
              <EnhancedActionPanel
                visible={true}
                token={activeCombatantToken}
                turnState={turnStateByToken[activeCombatantToken?.id]}
                viewRole={viewRole}
                selectedCategory={selectedActionCategory}
                actionCards={activeCombatantToken ? getPopupQuickActions(activeCombatantToken) : []}
                onSelectCategory={setSelectedActionCategory}
                onSelectAction={(action) => {
                  if (action.onClick) action.onClick();
                  else chooseCockpitAction(action);
                }}
                onEndTurn={() => { nextTurn(); dismissTurnPopup(); }}
                onMove={() => activeCombatantToken && startCockpitMovement(activeCombatantToken)}
                moveLabel={activeCombatantToken ? (getEffectiveMovementRemaining(activeCombatantToken) + " ft") : "0 ft"}
              />
            )}

            {false && (() => {
              /* ── DEAD CODE: Legacy top HUD bar ── */
              const activeRow = null;
              const latestSummary = summarizeCombatEvent(combatLog[0] || null);
              const modeLabel = activeSpell
                ? ("Spell: " + activeSpell.name)
                : movementMode
                  ? "Movement Planning"
                  : pingMode
                    ? "Ping Mode"
                    : laserMode
                      ? "Laser Pointer"
                      : fogEnabled
                        ? ("Fog: " + fogMode)
                        : (showGrid ? "Grid On" : "Grid Off");
              const hudChips = activeCombatantToken && combatLive && activeEconomy ? [
                { label:"Move", value:activeMoveFt + " ft", color:"#58aaff", active:activeMoveFt > 0, icon:Compass },
                { label:"Action", value:activeEconomy.actionUsed ? "Spent" : "Ready", color:"#dc143c", active:!activeEconomy.actionUsed, icon:Swords },
                { label:"Bonus", value:activeEconomy.bonusActionUsed ? "Spent" : "Ready", color:"#ffd54f", active:!activeEconomy.bonusActionUsed, icon:Star },
                { label:"Reaction", value:activeEconomy.reactionSpent ? "Spent" : "Ready", color:"#b574ff", active:!activeEconomy.reactionSpent, icon:RefreshCw },
              ] : [];
              return (
                <div style={{ position:"absolute", top:12, left:72, right: sidebarOpen ? 392 : 16, zIndex:26, background:"linear-gradient(135deg, rgba(10,10,16,0.92), rgba(10,10,18,0.78))", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"10px 12px", boxShadow:"0 18px 48px rgba(0,0,8,0.55)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                    <div style={{ minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <span style={{ fontFamily:T.ui, fontSize:11, letterSpacing:"1.8px", color:"#f2e8d6", textTransform:"uppercase", fontWeight:600 }}>{battleSceneLabel}</span>
                        <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:"#58aaff", textTransform:"uppercase", border:"1px solid rgba(88,170,255,0.25)", borderRadius:"999px", padding:"2px 8px", background:"rgba(88,170,255,0.08)" }}>{modeLabel}</span>
                        <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:viewRole === "dm" ? "#ffd54f" : "#58aaff", textTransform:"uppercase", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"999px", padding:"2px 8px", background:"rgba(255,255,255,0.03)" }}>{viewRole === "dm" ? "DM View" : "Player View"}</span>
                      </div>
                      <div style={{ marginTop:7, display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
                        <div style={{ fontFamily:T.ui, fontSize:10, color:"#ffd54f", letterSpacing:"1px", textTransform:"uppercase" }}>
                          {combatLive ? ("Round " + round + " · Turn " + (turn + 1) + "/" + Math.max(1, combatants.length)) : "Setup Phase"}
                        </div>
                        <div style={{ fontFamily:T.body, fontSize:13, color:T.text, fontWeight:500 }}>
                          {activeCombatantToken ? ("Acting: " + activeCombatantToken.name + " · " + activeOwner + (activeRow ? " · Init " + activeRow.init : "")) : "Start an encounter to enter initiative."}
                        </div>
                        {activeConds.includes("Concentrating") && (
                          <span style={{ fontFamily:T.ui, fontSize:8, color:"#ffd54f", letterSpacing:"0.9px", textTransform:"uppercase", padding:"2px 7px", borderRadius:"999px", border:"1px solid rgba(232,148,10,0.3)", background:"rgba(232,148,10,0.08)" }}>Concentrating</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                      {combatLive && viewRole === "dm" && (
                        <React.Fragment>
                          <button onClick={prevTurn} title="Undo turn / previous combatant"
                            style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"8px 10px", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, background:"rgba(255,255,255,0.03)", color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer" }}>
                            <RefreshCw size={12} /> Undo
                          </button>
                          <button onClick={nextTurn}
                            style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"8px 12px", border:"1px solid rgba(212,67,58,0.25)", borderRadius:10, background:"rgba(212,67,58,0.1)", color:"var(--crimson)", fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer" }}>
                            <SkipForward size={12} /> Next Turn
                          </button>
                        </React.Fragment>
                      )}
                      {viewRole === "dm" && (
                        <button onClick={() => setSidebarOpen(prev => !prev)} title="Toggle initiative rail"
                          style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"8px 10px", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, background:"rgba(255,255,255,0.03)", color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer" }}>
                          <Activity size={12} /> Tracker
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap", alignItems:"center" }}>
                    {hudChips.map((chip) => {
                      const ChipIcon = chip.icon || Circle;
                      return (
                        <div key={"hud-chip-"+chip.label} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 9px", borderRadius:12, background:chip.active ? lm("rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)") : subtleBg2, border:"1px solid " + (chip.active ? chip.color + "44" : subtleBorder), color:chip.active ? chip.color : T.textMuted }}>
                          <ChipIcon size={12} />
                          <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"0.9px", textTransform:"uppercase" }}>{chip.label}</span>
                          <span style={{ fontFamily:T.ui, fontSize:9 }}>{chip.value}</span>
                        </div>
                      );
                    })}
                    <div style={{ flex:"1 1 260px", minWidth:220, padding:"6px 10px", borderRadius:12, background:lm("rgba(0,0,0,0.18)", "rgba(0,0,0,0.06)"), border:"1px solid " + subtleBorder, fontFamily:T.body, fontSize:11, color:T.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      Last: <span style={{ color:T.text }}>{latestSummary}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {false && cockpitModeActive && battleFocusToken && !showScenePanel && !battleFocusPanelCollapsed && (() => {
              const condList = getMergedConditionsForToken(battleFocusToken);
              const hints = getTokenRulesReminder(battleFocusToken);
              const hpPct = battleFocusToken.maxHp ? Math.max(0, Math.min(100, Math.round((battleFocusToken.hp || 0) / battleFocusToken.maxHp * 100))) : 0;
              const hpCol = battleFocusToken.maxHp ? getHpColor(battleFocusToken.hp || 0, battleFocusToken.maxHp) : T.textMuted;
              const leftPanelTurnState = turnStateByToken[battleFocusToken.id] || defaultTurnState(battleFocusToken);
              const leftPanelMoveFt = getEffectiveMovementRemaining(battleFocusToken);
              const controllerLabel = getPartyProfile(battleFocusToken)?.player || battleFocusToken.player || (battleFocusToken.tokenType === "pc" ? "Player" : "DM");
              return (
                <div style={{ position:"absolute", left:80, top:108, width:320, maxHeight:"calc(100% - 224px)", zIndex:24, background:"rgba(10,10,16,0.92)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, boxShadow:"0 18px 44px rgba(0,0,8,0.55)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
                  <div style={{ padding:"12px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:48, height:48, borderRadius:"50%", background:battleFocusToken.color, border:"2px solid " + (battleFocusToken.id === activeCombatantId ? "#ffd54f" : "rgba(255,255,255,0.12)"), overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:T.ui, fontSize:14, fontWeight:700, boxShadow:battleFocusToken.id === activeCombatantId ? "0 0 18px rgba(255,213,79,0.3)" : "none", flexShrink:0 }}>
                        {battleFocusToken.imageSrc ? <img src={battleFocusToken.imageSrc} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : (battleFocusToken.label || battleFocusToken.name.substring(0,2)).toUpperCase()}
                      </div>
                      <div style={{ minWidth:0, flex:1 }}>
                        <div style={{ fontFamily:T.ui, fontSize:14, color:T.text, fontWeight:600, lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{battleFocusToken.name}</div>
                        <div style={{ marginTop:4, fontFamily:T.ui, fontSize:9, color:T.textFaint, letterSpacing:"0.9px", textTransform:"uppercase" }}>
                          {(battleFocusToken.tokenType || "creature").toUpperCase()} · {controllerLabel} · {(battleFocusToken.size || "medium").toUpperCase()}{battleFocusCombatant ? " · Init " + battleFocusCombatant.init : ""}
                        </div>
                      </div>
                      <button onClick={() => { setSelectedTokenId(null); setBattleFocusPanelCollapsed(true); }} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:T.textFaint, cursor:"pointer", padding:6 }}><X size={14} /></button>
                    </div>
                    {battleFocusToken.hp != null && battleFocusToken.maxHp && (
                      <div style={{ marginTop:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
                          <span style={{ fontFamily:T.body, fontSize:22, color:hpCol }}>{battleFocusToken.hp}/{battleFocusToken.maxHp}</span>
                          <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase" }}>AC {battleFocusToken.ac || "—"} · SPD {battleFocusToken.speed || 30}</span>
                        </div>
                        <div style={{ height:7, background:"rgba(255,255,255,0.05)", borderRadius:999, overflow:"hidden" }}>
                          <div style={{ width:hpPct + "%", height:"100%", background:"linear-gradient(90deg," + hpCol + "," + hpCol + "cc)", borderRadius:999, boxShadow:"0 0 10px " + hpCol + "55" }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:"12px 14px", overflowY:"auto" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0,1fr))", gap:6 }}>
                      {[
                        { label:"Move", value:leftPanelMoveFt + " ft", color:"#58aaff", active:leftPanelMoveFt > 0 },
                        { label:"Action", value:leftPanelTurnState.actionUsed ? "Spent" : "Ready", color:"#dc143c", active:!leftPanelTurnState.actionUsed },
                        { label:"Bonus", value:leftPanelTurnState.bonusActionUsed ? "Spent" : "Ready", color:"#ffd54f", active:!leftPanelTurnState.bonusActionUsed },
                        { label:"React", value:leftPanelTurnState.reactionSpent ? "Spent" : "Ready", color:"#b574ff", active:!leftPanelTurnState.reactionSpent },
                      ].map((chip) => (
                        <div key={"left-chip-"+chip.label} style={{ padding:"8px 7px", borderRadius:12, background:chip.active ? lm("rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)") : subtleBg2, border:"1px solid " + (chip.active ? chip.color + "44" : subtleBorder) }}>
                          <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"0.8px", color:T.textFaint, textTransform:"uppercase" }}>{chip.label}</div>
                          <div style={{ fontFamily:T.ui, fontSize:10, color:chip.active ? chip.color : T.textMuted, marginTop:3 }}>{chip.value}</div>
                        </div>
                      ))}
                    </div>

                    {battleFocusTarget && (
                      <div style={{ marginTop:10, padding:"9px 10px", borderRadius:12, background:"rgba(255,213,79,0.04)", border:"1px solid rgba(255,213,79,0.16)" }}>
                        <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:"#ffd54f", textTransform:"uppercase", marginBottom:4 }}>Focus Target</div>
                        <div style={{ fontFamily:T.body, fontSize:12, color:T.text }}>{battleFocusTarget.name} · {distBetween(battleFocusToken, battleFocusTarget)} ft · {hpStateLabel(battleFocusTarget.hp, battleFocusTarget.maxHp)}</div>
                      </div>
                    )}

                    {condList.length > 0 && (
                      <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:6 }}>
                        {condList.slice(0, 8).map((cond) => {
                          const meta = DND_CONDITIONS.find(dc => dc.name === cond);
                          return (
                            <span key={"left-cond-"+cond} title={CONDITION_HELP[cond] || cond}
                              style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 8px", borderRadius:"999px", background:(meta?.color || "#aaa") + "12", border:"1px solid " + ((meta?.color || "#aaa") + "55"), color:meta?.color || T.text, fontFamily:T.ui, fontSize:8, letterSpacing:"0.7px", textTransform:"uppercase" }}>
                              <span style={{ width:6, height:6, borderRadius:"50%", background:meta?.color || "#aaa" }} />
                              {cond}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div style={{ marginTop:12, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase" }}>Rules Now</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
                      {(hints.length ? hints : [{ tone:T.textMuted, text: battleFocusCanAct ? "No blocking conditions detected. Choose an action below or open the full panel." : "Inspecting this unit. Actions unlock on its turn or for owned characters." }]).map((hint, ix) => (
                        <div key={"battle-hint-"+ix} style={{ padding:"8px 9px", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", background:"rgba(0,0,0,0.14)", fontFamily:T.body, fontSize:11, color:T.textMuted, lineHeight:1.35 }}>
                          <span style={{ color:hint.tone || T.text, fontFamily:T.ui, fontSize:8, letterSpacing:"0.9px", textTransform:"uppercase", marginRight:6 }}>Rule</span>
                          {hint.text}
                        </div>
                      ))}
                    </div>

                    {battleFocusCanAct && (
                      <button onClick={() => openTurnPopupForToken(battleFocusToken)} style={{ marginTop:12, width:"100%", padding:"10px 12px", border:"1px solid rgba(212,67,58,0.24)", borderRadius:12, background:"rgba(212,67,58,0.08)", color:"var(--crimson)", cursor:"pointer", fontFamily:T.ui, fontSize:9, letterSpacing:"1px", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                        <Swords size={13} /> Open Full Action Panel
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {false && cockpitModeActive && (() => {
              const trayToken = combatLive ? activeCombatantToken : battleFocusToken;
              const trayCanAct = trayToken ? canUseTurnPopupForToken(trayToken) : false;
              const trayActions = trayCanAct ? getCockpitTrayActions(trayToken) : [];
              const trayMoveFt = trayToken ? getEffectiveMovementRemaining(trayToken) : 0;
              const trayTarget = trayToken ? getFocusedCombatTarget(trayToken) : null;
              return (
                <div style={{ position:"absolute", left:72, right: sidebarOpen ? 392 : 16, bottom:16, zIndex:24, background:"rgba(10,10,16,0.92)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, boxShadow:"0 18px 44px rgba(0,0,8,0.55)", padding:"10px 12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ fontFamily:T.ui, fontSize:9, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase" }}>
                      {trayToken ? (trayToken.name + " · " + (trayCanAct ? "Actions Ready" : "Waiting For Turn")) : "Select a combatant"}
                      {trayTarget ? " · Target: " + trayTarget.name + " (" + distBetween(trayToken, trayTarget) + " ft)" : ""}
                    </div>
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      {trayToken && (
                        <button onClick={() => {
                          if (!trayCanAct) return;
                          if (movementMode && selectedTokenId === trayToken.id) {
                            setMovementMode(false); setMovementPath([]); setMovementOrigin(null);
                          } else if (trayMoveFt > 0) {
                            setSelectedTokenId(trayToken.id); setMovementMode(true); setMovementPath([]); setMovementOrigin({ x:trayToken.x, y:trayToken.y });
                          }
                        }}
                          disabled={!trayCanAct || (trayMoveFt <= 0 && !(movementMode && selectedTokenId === trayToken.id))}
                          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 10px", border:"1px solid rgba(88,170,255,0.2)", borderRadius:12, background:(trayCanAct && (trayMoveFt > 0 || (movementMode && selectedTokenId === trayToken.id))) ? "rgba(88,170,255,0.08)" : "rgba(0,0,0,0.14)", color:(trayCanAct && (trayMoveFt > 0 || (movementMode && selectedTokenId === trayToken.id))) ? "#58aaff" : T.textFaint, cursor:(trayCanAct && (trayMoveFt > 0 || (movementMode && selectedTokenId === trayToken.id))) ? "pointer" : "not-allowed", fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase" }}>
                          <Compass size={12} /> {movementMode && selectedTokenId === trayToken.id ? "Finish Move" : ("Move " + trayMoveFt + " ft")}
                        </button>
                      )}
                      {trayToken && trayCanAct && (
                        <button onClick={() => openTurnPopupForToken(trayToken)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 10px", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, background:"rgba(255,255,255,0.03)", color:T.text, cursor:"pointer", fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase" }}>
                          <MoreVertical size={12} /> Side Panel
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
                    {trayCanAct && trayActions.length > 0 ? trayActions.map((act) => {
                      const ActIcon = act.icon || Swords;
                      return (
                        <button key={"tray-"+act.key} onClick={() => { if (!act.disabled) act.onClick(); }}
                          disabled={!!act.disabled}
                          title={act.disabledReason || act.effect || act.name}
                          style={{ minWidth:148, maxWidth:220, display:"flex", alignItems:"flex-start", gap:8, padding:"10px 11px", borderRadius:14, background:act.disabled ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.04)", border:"1px solid " + (act.disabled ? "rgba(255,255,255,0.06)" : (act.tone || "#fff") + "33"), cursor:act.disabled ? "not-allowed" : "pointer", color:act.disabled ? T.textFaint : T.text, textAlign:"left", opacity:act.disabled ? 0.6 : 1, flex:"0 0 auto" }}>
                          <ActIcon size={14} style={{ marginTop:2, color:act.disabled ? T.textFaint : (act.tone || T.text) }} />
                          <div style={{ minWidth:0, flex:1 }}>
                            <div style={{ fontFamily:T.ui, fontSize:11, fontWeight:600, letterSpacing:"0.4px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{act.name}</div>
                            <div style={{ marginTop:4, fontFamily:T.ui, fontSize:7, letterSpacing:"0.8px", color:act.disabled ? T.textFaint : (act.tone || T.textMuted), textTransform:"uppercase" }}>{actionTypeLabel(act.actionType)} · {act.cost || "—"} · {act.range || "—"}</div>
                            <div style={{ marginTop:4, fontFamily:T.body, fontSize:10, color:T.textMuted, lineHeight:1.3, maxHeight:26, overflow:"hidden" }}>{act.disabledReason || act.effect || "Resolve this action."}</div>
                          </div>
                        </button>
                      );
                    }) : (
                      <div style={{ fontFamily:T.body, fontSize:11, color:T.textMuted, padding:"10px 0" }}>
                        {trayToken ? "Actions appear here when this creature can act." : "Right-click a token or start combat to surface contextual actions."}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Zoom indicator */}
            <div style={{ position:"absolute", bottom:12, left: cockpitModeActive ? 18 : 80, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)", padding:"5px 12px", borderRadius:"6px", fontFamily:T.ui, fontSize:9, color:"rgba(255,255,255,0.7)", letterSpacing:"1.5px", pointerEvents:"none", border:"1px solid rgba(255,255,255,0.08)", zIndex:8 }}>
              {Math.round(zoom*100)}%
            </div>

            {/* Mode indicators (stacked top-left) */}
            {!cockpitModeActive && pingMode && (
              <div style={{ position:"absolute", top:14, left:80, background:"rgba(88,170,255,0.85)", backdropFilter:"blur(4px)", padding:"6px 14px", borderRadius:"6px", fontFamily:T.ui, fontSize:9, color:"#f2e8d6", letterSpacing:"1.5px", pointerEvents:"none", zIndex:10, border:"1px solid rgba(88,170,255,0.4)", boxShadow:"0 2px 10px rgba(88,170,255,0.25)" }}>
                PING MODE (click to ping, Esc to cancel)
              </div>
            )}
            {!cockpitModeActive && movementMode && !pingMode && !activeSpell && (
              <div style={{ position:"absolute", top:14, left:80, background:"rgba(46,139,87,0.85)", backdropFilter:"blur(4px)", padding:"6px 14px", borderRadius:"6px", fontFamily:T.ui, fontSize:9, color:"#fff", letterSpacing:"1.5px", pointerEvents:"none", zIndex:10, border:"1px solid rgba(46,139,87,0.4)", boxShadow:"0 2px 10px rgba(46,139,87,0.25)" }}>
                MOVEMENT MODE (M to toggle, Esc to cancel)
              </div>
            )}
            {!cockpitModeActive && activeWeapon && (() => {
              const isSpell = activeWeapon.card?.resolver === "spell";
              const isMelee = !isSpell && (activeWeapon.card?.data?.range || 5) <= 10;
              const bannerColor = isSpell ? "rgba(167,139,250,0.92)" : isMelee ? "rgba(240,104,88,0.92)" : "rgba(88,170,255,0.92)";
              const borderColor = isSpell ? "rgba(167,139,250,0.7)" : isMelee ? "rgba(240,104,88,0.7)" : "rgba(88,170,255,0.7)";
              const glowColor = isSpell ? "rgba(167,139,250,0.5)" : isMelee ? "rgba(240,104,88,0.5)" : "rgba(88,170,255,0.5)";
              const icon = isSpell ? "\u2728 " : isMelee ? "\u2694 " : "\uD83C\uDFF9 ";
              const label = activeWeapon.card?.label || activeWeapon.card?.name || "Ability";
              return (
                <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%, -50%)", background:bannerColor, backdropFilter:"blur(8px)", padding:"14px 32px", borderRadius:"12px", fontFamily:T.ui, fontSize:14, fontWeight:700, color:"#fff", letterSpacing:"2px", pointerEvents:"none", zIndex:55, border:"2px solid " + borderColor, boxShadow:"0 8px 40px " + glowColor + ", 0 0 80px " + glowColor.replace("0.5","0.15"), display:"flex", alignItems:"center", gap:12, textTransform:"uppercase", textShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:"#fff", boxShadow:"0 0 12px " + glowColor }} />
                  {icon + label} — Click Target
                  <span style={{ fontSize:10, fontWeight:400, opacity:0.7, letterSpacing:"1px" }}>Esc to cancel</span>
                </div>
              );
            })()}
            {!cockpitModeActive && activeSpell && (
              <div style={{ position:"absolute", top:14, left:80, background:"rgba(181,116,255,0.88)", backdropFilter:"blur(4px)", padding:"6px 14px", borderRadius:"6px", fontFamily:T.ui, fontSize:9, color:"#fff", letterSpacing:"1.5px", pointerEvents:"none", zIndex:10, border:"1px solid rgba(181,116,255,0.5)", boxShadow:"0 2px 10px rgba(181,116,255,0.3)", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:activeSpell.color, boxShadow:"0 0 6px " + activeSpell.color }} />
                SPELL: {activeSpell.name.toUpperCase()}{castLevel && castLevel > activeSpell.level ? " (LV" + castLevel + ")" : ""}{MULTI_TARGET_SPELLS[activeSpell.name] ? " — " + multiTargetSelections.length + "/" + getMultiTargetCount(activeSpell, castLevel, selectedToken?.level||1) + " targets" : ""} — click to {MULTI_TARGET_SPELLS[activeSpell.name] ? "select targets" : "cast"} · right-click/Esc to cancel · Space+drag or scroll to pan/zoom
              </div>
            )}

            {/* Player view badge */}
            {!cockpitModeActive && viewRole === "player" && (
              <div style={{ position:"absolute", top:10, right:10, background:"rgba(88,170,255,0.85)", backdropFilter:"blur(4px)", padding:"6px 14px", borderRadius:"6px", fontFamily:T.ui, fontSize:9, color:"#fff", letterSpacing:"1.5px", pointerEvents:"none", border:"1px solid rgba(88,170,255,0.4)", boxShadow:"0 2px 10px rgba(88,170,255,0.25)" }}>
                PLAYER VIEW
              </div>
            )}

            {/* Dice result popup */}
            {diceResult && (
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background: diceResult.crit ? "rgba(46,139,87,0.95)" : diceResult.fumble ? "rgba(212,67,58,0.95)" : panelBg, padding:"16px 28px", borderRadius:"8px", zIndex:200, textAlign:"center", border: diceResult.crit ? "2px solid #5ee09a" : diceResult.fumble ? "2px solid #e8605a" : "1px solid " + subtleBorder, pointerEvents:"none", boxShadow:"0 4px 20px rgba(0,0,6,0.50)" }}>
                <div style={{ fontSize:10, fontFamily:T.ui, color:"rgba(255,255,255,0.6)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:4 }}>{diceResult.name ? diceResult.name + (diceResult.type === "attack" ? " attacks" : diceResult.type === "initiative" ? " initiative" : diceResult.type === "save" ? "" : diceResult.type === "perception" ? " perception" : "") : "d20"}</div>
                <div style={{ fontSize:36, fontFamily:T.ui, color:"#f2e8d6", fontWeight:700 }}>{diceResult.value}</div>
                {diceResult.crit && <div style={{ fontSize:10, fontFamily:T.ui, color:"#5ee09a", letterSpacing:"2px", marginTop:2 }}>NAT 20!</div>}
                {diceResult.fumble && <div style={{ fontSize:10, fontFamily:T.ui, color:"#f06858", letterSpacing:"2px", marginTop:2 }}>NAT 1!</div>}
              </div>
            )}

            {/* Dice panel */}
            {showDicePanel && (
              <div style={{ position:"absolute", bottom:16, right:16, width:240, maxHeight:300, background:T.bgCard, border:"1px solid " + T.crimsonBorder, borderRadius:"4px", boxShadow:"0 4px 16px rgba(0,0,6,0.45)", display:"flex", flexDirection:"column", zIndex:100, overflow:"hidden" }}>
                <div style={{ padding:"10px 12px", borderBottom:"1px solid " + T.border, display:"flex", alignItems:"center", gap:8 }}>
                  <input type="text" value={diceInput} onChange={e=>setDiceInput(e.target.value)} placeholder="2d6+3, 1d20, etc" onKeyDown={e=>{ if(e.key==="Enter") rollDiceExpression(diceInput); }}
                    style={{ flex:1, padding:"4px 6px", fontSize:10, fontFamily:T.body, background:T.bgInput, border:"1px solid " + T.border, color:T.text, borderRadius:"2px", outline:"none" }} />
                  <button onClick={() => rollDiceExpression(diceInput)} style={{ background:cssVar("--crimson"), border:"none", color:"#f2e8d6", padding:"4px 8px", borderRadius:"2px", cursor:"pointer", fontSize:9, fontFamily:T.ui, fontWeight:500 }}>Roll</button>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:"8px" }}>
                  {rollHistory.length === 0 ? (
                    <div style={{ fontSize:9, color:T.textFaint, textAlign:"center", padding:"12px 8px", fontStyle:"italic" }}>No rolls yet</div>
                  ) : (
                    rollHistory.map((roll, i) => (
                      <div key={i} style={{ padding:"6px 8px", marginBottom:"4px", background:T.bgInput, borderRadius:"2px", fontSize:8, color:T.text, borderLeft:"2px solid " + (roll.result > 15 ? "#5ee09a" : roll.result <= 5 ? "#f06858" : "transparent") }}>
                        <div style={{ fontFamily:T.ui, letterSpacing:"0.5px", fontWeight:500, marginBottom:2 }}>{roll.expr}</div>
                        <div style={{ color:T.textMuted, marginBottom:1 }}>Rolls: {roll.rolls.join(", ")}</div>
                        <div style={{ color:T.text, fontWeight:600 }}>Total: {roll.result}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Prop context menu */}
            {contextMenu && contextMenu.propId && (() => {
              const pk = props.find(p => p.id === contextMenu.propId);
              if (!pk) return null;
              const menuBtnStyle = { display:"block", width:"100%", padding:"8px 14px", background:"none", border:"none", textAlign:"left", cursor:"pointer", fontSize:12, fontFamily:T.ui, letterSpacing:"0.3px", transition:"background 0.1s" };
              return (
                <div style={{ position:"absolute", left:contextMenu.x, top:contextMenu.y, background:panelBg, backdropFilter:"blur(12px)", border:"1px solid " + T.crimsonBorder, borderRadius:"8px", boxShadow:"0 8px 32px rgba(0,0,6,0.6)", zIndex:100, minWidth:180, padding:"6px 0", overflow:"hidden" }}
                  onMouseLeave={() => setContextMenu(null)}>
                  <div style={{ padding:"8px 14px", fontSize:12, color:T.text, fontWeight:600, borderBottom:"1px solid " + T.border, fontFamily:T.ui, letterSpacing:"0.3px" }}>{pk.name}</div>
                  <button onClick={() => { updateProp(pk.id, { layer: pk.layer === "above" ? "below" : "above" }); setContextMenu(null); }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"} onMouseLeave={e => e.currentTarget.style.background="none"}
                    style={{...menuBtnStyle, color:T.textMuted}}>
                    {pk.layer === "above" ? "Move Below Tokens" : "Move Above Tokens"}
                  </button>
                  <button onClick={() => { updateProp(pk.id, { locked: !pk.locked }); setContextMenu(null); }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"} onMouseLeave={e => e.currentTarget.style.background="none"}
                    style={{...menuBtnStyle, color:T.textMuted}}>
                    {pk.locked ? "Unlock" : "Lock Position"}
                  </button>
                  <button onClick={() => { updateProp(pk.id, { rotation: (pk.rotation || 0) + 45 }); setContextMenu(null); }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"} onMouseLeave={e => e.currentTarget.style.background="none"}
                    style={{...menuBtnStyle, color:T.textMuted}}>
                    Rotate 45°
                  </button>
                  <div style={{ height:1, background:T.border, margin:"2px 0" }} />
                  <button onClick={() => { removeProp(pk.id); setContextMenu(null); }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(212,67,58,0.08)"} onMouseLeave={e => e.currentTarget.style.background="none"}
                    style={{...menuBtnStyle, color:"#f06858"}}>
                    Remove Prop
                  </button>
                </div>
              );
            })()}

            {/* Token command popup — hidden during ability targeting so canvas gets clicks */}
            {!cockpitModeActive && tokenPopup && !activeWeapon && (() => {
              const tk = tokens.find(t => t.id === tokenPopup.tokenId);
              if (!tk) return null;
              if (!canUseTurnPopupForToken(tk)) return null;
              const hpPct = tk.maxHp ? Math.round(tk.hp / tk.maxHp * 100) : 0;
              const hpCol = tk.maxHp ? getHpColor(tk.hp, tk.maxHp) : "#888";
              const currentRow = combatants.find(c => c.mapTokenId === tk.id);
              const isCurrentActor = combatLive && combatants[turn]?.mapTokenId === tk.id;
              const hostileTargets = getHostileTargets(tk);
              const focusTarget = getFocusedCombatTarget(tk);
              const quickActions = getPopupQuickActions(tk);
              const latestEntry = combatLog[0] || null;
              const isMovingThisToken = movementMode && selectedTokenId === tk.id;
              const turnState = turnStateByToken[tk.id] || defaultTurnState(tk);
              const moveBudgetFt = getEffectiveMovementRemaining(tk);
              const actorOwner = getPartyProfile(tk)?.player || tk.player || (tk.tokenType === "pc" ? "Player" : "DM");
              const clampedPopup = clampTurnPopupPosition(tokenPopup.screenX || 12, tokenPopup.screenY || 14);
              const popupX = clampedPopup.screenX;
              const popupY = clampedPopup.screenY;
              const popupDeathState = getDeathSaveState(tk);
              const popupDeathLabel = getDeathSaveLabel(tk);
              const popupActionLockReason = getActionLockReasonForToken(tk);
              const popupLegendaryMax = getLegendaryActionMax(tk);
              const popupLegendaryRemaining = getLegendaryActionRemaining(tk);
              const popupLairState = popupLegendaryMax > 0
                ? (Number(tk.lairActionRoundUsed || 0) === round ? "Lair spent" : (canUseLairSurgeForToken(tk) ? "Lair ready" : "Lair window closed"))
                : "";
              const actionOrder = tk.tokenType === "pc"
                ? ["Attack", "Spell", "Class Feature", "Other"]
                : ["Multiattack", "Attack", "Save / AoE", "Legendary", "Utility"];
              const actionSections = actionOrder
                .map((panelName) => ({
                  name: panelName,
                  items: quickActions.filter((act) => act.panel === panelName),
                  meta: getActionPanelMeta(panelName),
                }))
                .filter((section) => section.items.length > 0);
              const popupBtnStyle = { display:"flex", alignItems:"flex-start", gap:10, width:"100%", padding:"9px 10px", background:"none", border:"none", textAlign:"left", cursor:"pointer", fontSize:12, fontFamily:T.ui, letterSpacing:"0.3px", transition:"background 0.12s, transform 0.12s, border-color 0.12s", borderRadius:"10px" };
              return (
                <div style={{ position:"absolute", left: popupX, top: popupY, background:panelBg, backdropFilter:"blur(18px)", border:"1px solid " + T.crimsonBorder, borderRadius:"16px", boxShadow:panelShadow + ", 0 0 0 1px " + lm("rgba(255,255,255,0.04)", "rgba(0,0,0,0.02)") + " inset", zIndex:100, width:372, maxHeight:"calc(100% - 24px)", overflow:"hidden", display:"flex", flexDirection:"column" }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => e.stopPropagation()}>

                  {/* Header */}
                  <div onMouseDown={beginTurnPopupDrag} style={{ padding:"12px 14px 10px", borderBottom:"1px solid " + T.border, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, cursor:"grab", background:"linear-gradient(90deg, rgba(212,67,58,0.08), " + lm("rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)") + ")" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:tk.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontFamily:T.ui, color:"#fff", fontWeight:700, border:"2px solid rgba(255,220,30,0.4)" }}>
                        {(tk.label || tk.name.substring(0,2)).toUpperCase()}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:14, fontFamily:T.ui, fontWeight:600, color:T.text, lineHeight:1.2 }}>{tk.name}</div>
                        <div style={{ fontSize:10, fontFamily:T.ui, color:T.textFaint, display:"flex", flexWrap:"wrap", gap:6, marginTop:2 }}>
                          <span style={{ textTransform:"capitalize" }}>{tk.size || "medium"}</span>
                          <span>{tk.speed || 30} ft</span>
                          <span>{currentRow ? ("Init " + currentRow.init) : "Not in initiative"}</span>
                          {combatLive && <span style={{ color:isCurrentActor ? "#ffd54f" : T.textFaint }}>{isCurrentActor ? "Current Turn" : "Out of Turn"}</span>}
                          <span>Owner: {viewRole === "dm" ? actorOwner : "You"}</span>
                          {tk.ac && <span>· AC {tk.ac}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 3px)", gap:3, opacity:0.55, padding:"4px 0" }}>
                        {[0,1,2,3,4,5].map((dot) => (
                          <span key={"drag-dot-"+dot} style={{ width:3, height:3, borderRadius:"50%", background:T.textFaint }} />
                        ))}
                      </div>
                      <button onMouseDown={e => e.stopPropagation()} onClick={dismissTurnPopup} style={{ background:lm("rgba(255,255,255,0.03)", "rgba(0,0,0,0.03)"), border:"1px solid " + subtleBorder, borderRadius:"8px", cursor:"pointer", color:T.textFaint, padding:5 }}><X size={14}/></button>
                    </div>
                  </div>

                  {/* HP Bar */}
                  {tk.hp != null && tk.maxHp && (
                    <div style={{ padding:"8px 14px", borderBottom:"1px solid " + T.border }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:4 }}>
                        <span style={{ fontSize:20, fontFamily:T.body, fontWeight:400, color:hpCol, lineHeight:1 }}>{tk.hp}</span>
                        <span style={{ fontSize:12, color:T.textFaint }}>/ {tk.maxHp} HP</span>
                      </div>
                      <div style={{ height:4, background:lm("rgba(255,255,255,0.04)", "rgba(0,0,0,0.08)"), borderRadius:"2px", overflow:"hidden", marginBottom:8 }}>
                        <div style={{ width:hpPct+"%", height:"100%", background:hpCol, borderRadius:"2px", transition:"width 0.2s" }} />
                      </div>
                      <div style={{ display:"flex", gap:3 }}>
                        {[-10,-5,-1,1,5,10].map(d => (
                          <button key={d} onClick={() => adjustTokenHp(tk.id, d)}
                            onMouseEnter={e => e.currentTarget.style.filter="brightness(1.3)"} onMouseLeave={e => e.currentTarget.style.filter="none"}
                            style={{ flex:1, padding:"4px 0", background:d<0?"rgba(212,67,58,0.08)":"rgba(46,139,87,0.08)", border:"1px solid "+(d<0?"rgba(212,67,58,0.2)":"rgba(46,139,87,0.2)"), borderRadius:"4px", color:d<0?"#f06858":"#5ee09a", fontFamily:T.ui, fontSize:10, fontWeight:600, cursor:"pointer", transition:"all 0.12s" }}>
                            {d>0?"+":""}{d}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(popupDeathLabel || popupLegendaryMax > 0 || popupActionLockReason) && (
                    <div style={{ padding:"8px 14px", borderBottom:"1px solid " + T.border, background:lm("rgba(255,255,255,0.015)", "rgba(0,0,0,0.02)"), display:"flex", flexDirection:"column", gap:6 }}>
                      {popupDeathLabel && (
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:"8px", background: popupDeathState.dead ? "rgba(212,67,58,0.08)" : "rgba(255,213,79,0.06)", border:"1px solid " + (popupDeathState.dead ? "rgba(212,67,58,0.2)" : "rgba(255,213,79,0.18)") }}>
                          <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color: popupDeathState.dead ? "#f06858" : "#ffd54f", textTransform:"uppercase" }}>{popupDeathState.dead ? "Death State" : "Death Saves"}</span>
                          <span style={{ fontFamily:T.body, fontSize:10, color:T.text }}>{popupDeathLabel}</span>
                        </div>
                      )}
                      {popupLegendaryMax > 0 && viewRole === "dm" && (
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                          <div style={{ padding:"6px 8px", borderRadius:"8px", background:"rgba(255,213,79,0.06)", border:"1px solid rgba(255,213,79,0.18)" }}>
                            <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"0.8px", color:T.textFaint, textTransform:"uppercase" }}>Legendary</div>
                            <div style={{ fontFamily:T.ui, fontSize:10, color:"#ffd54f", marginTop:2 }}>{popupLegendaryRemaining}/{popupLegendaryMax} ready</div>
                          </div>
                          <div style={{ padding:"6px 8px", borderRadius:"8px", background:"rgba(181,116,255,0.06)", border:"1px solid rgba(181,116,255,0.18)" }}>
                            <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"0.8px", color:T.textFaint, textTransform:"uppercase" }}>Lair Timing</div>
                            <div style={{ fontFamily:T.ui, fontSize:10, color:"#b574ff", marginTop:2 }}>{popupLairState || "None"}</div>
                          </div>
                        </div>
                      )}
                      {popupActionLockReason && !popupDeathLabel && (
                        <div style={{ fontFamily:T.body, fontSize:10, color:"#ffd54f", lineHeight:1.45, padding:"6px 8px", borderRadius:"8px", background:"rgba(255,213,79,0.05)", border:"1px solid rgba(255,213,79,0.14)" }}>
                          {popupActionLockReason}
                        </div>
                      )}
                    </div>
                  )}

                  {combatLive && isCurrentActor && turnState && (
                    <div style={{ padding:"8px 14px", borderBottom:"1px solid " + T.border, background:lm("rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)") }}>
                      <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:"#5ee09a", textTransform:"uppercase", marginBottom:6 }}>Action Economy</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                        {[
                          { label:"Move", value:moveBudgetFt + " ft", active:moveBudgetFt > 0, color:"#58aaff" },
                          { label:"Action", value:turnState.actionUsed ? "Used" : "Ready", active:!turnState.actionUsed, color:"#5ee09a" },
                          { label:"Bonus", value:turnState.bonusActionUsed ? "Used" : "Ready", active:!turnState.bonusActionUsed, color:"#ffd54f" },
                          { label:"Reaction", value:turnState.reactionSpent ? "Spent" : "Ready", active:!turnState.reactionSpent, color:"#b574ff" },
                        ].map((chip) => (
                          <div key={chip.label} style={{ padding:"5px 7px", borderRadius:"6px", background:chip.active ? lm("rgba(255,255,255,0.05)", "rgba(0,0,0,0.04)") : subtleBg2, border:"1px solid " + (chip.active ? chip.color + "44" : subtleBorder) }}>
                            <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"0.8px", color:T.textFaint, textTransform:"uppercase" }}>{chip.label}</div>
                            <div style={{ fontFamily:T.ui, fontSize:10, color:chip.active ? chip.color : T.textMuted, marginTop:2 }}>{chip.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hostileTargets.length > 0 && (
                    <div style={{ padding:"8px 14px", borderBottom:"1px solid " + T.border, background:"rgba(255,213,79,0.04)" }}>
                      <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:"#ffd54f", textTransform:"uppercase", marginBottom:5 }}>Focus Target</div>
                      <select value={focusTarget?.id || ""} onChange={(e) => { setFocusedCombatTarget(tk.id, e.target.value); openCombatSidebar("tracker"); }} onClick={(e) => e.stopPropagation()}
                        style={{ width:"100%", padding:"6px 8px", fontSize:10, background:"rgba(0,0,0,0.14)", border:"1px solid rgba(255,213,79,0.25)", color:T.text, borderRadius:"6px", outline:"none" }}>
                        {hostileTargets.map((targetToken) => (
                          <option key={"popup-target-" + tk.id + "-" + targetToken.id} value={targetToken.id}>
                            {targetToken.name} - {hpStateLabel(targetToken.hp, targetToken.maxHp)} - {distBetween(tk, targetToken)} ft
                          </option>
                        ))}
                      </select>
                      {focusTarget && (() => {
                        const focusLane = getLineCoverProfile(tk, focusTarget);
                        return (
                          <div style={{ marginTop:5, fontFamily:T.ui, fontSize:8, letterSpacing:"0.7px", textTransform:"uppercase", color: focusLane.hasLineOfSight ? "#58aaff" : "#f06858" }}>
                            {focusLane.hasLineOfSight ? "Line of sight clear" : "Line of sight blocked"}
                            {focusLane.coverACBonus > 0 ? " | " + (focusLane.coverLabel || "Cover") + " +" + focusLane.coverACBonus : ""}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ padding:"10px", overflowY:"auto", display:"flex", flexDirection:"column", gap:10, flex:"1 1 auto", minHeight:0 }}>
                    {!combatLive && viewRole === "dm" && (
                      <button onClick={() => { rollTokenIntoInitiative(tk); dismissTurnPopup(); }}
                        onMouseEnter={e => { e.currentTarget.style.background="rgba(255,213,79,0.08)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.transform="none"; }}
                        style={{...popupBtnStyle, color:"#ffd54f", border:"1px solid rgba(255,213,79,0.2)", background:"rgba(255,213,79,0.04)"}}>
                        <Star size={14} style={{ marginTop:1, flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:600 }}>{currentRow ? "Reroll Initiative" : "Roll Initiative"}</div>
                          <div style={{ fontSize:9, color:T.textFaint, marginTop:2 }}>{currentRow ? "Update this token's place in the turn order." : "Add this token to the tracker on the right."}</div>
                        </div>
                      </button>
                    )}

                    <div style={{ border:"1px solid rgba(88,170,255,0.18)", borderRadius:"14px", background:"rgba(88,170,255,0.04)", padding:8 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:"#58aaff", textTransform:"uppercase" }}>Movement</div>
                        <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"0.8px", color:T.textFaint }}>{moveBudgetFt} ft left</div>
                      </div>
                      <button onClick={() => {
                        if (combatLive && !isMovingThisToken && moveBudgetFt <= 0) return;
                        setSelectedTokenId(tk.id);
                        setMovementMode(!isMovingThisToken);
                        if (!isMovingThisToken) {
                          setMovementPath([]);
                          setMovementOrigin({x:tk.x,y:tk.y});
                        } else {
                          setMovementPath([]);
                          setMovementOrigin(null);
                        }
                        openCombatSidebar("tracker");
                        setShowConditionMenu(false);
                      }}
                        disabled={combatLive && !isMovingThisToken && moveBudgetFt <= 0}
                        onMouseEnter={e => { e.currentTarget.style.background="rgba(88,170,255,0.08)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.transform="none"; }}
                        style={{...popupBtnStyle, color:(combatLive && !isMovingThisToken && moveBudgetFt <= 0) ? T.textFaint : "#58aaff", border:"1px solid rgba(88,170,255,0.2)", background:(combatLive && !isMovingThisToken && moveBudgetFt <= 0) ? subtleBg2 : lm("rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)"), opacity:(combatLive && !isMovingThisToken && moveBudgetFt <= 0) ? 0.6 : 1, cursor:(combatLive && !isMovingThisToken && moveBudgetFt <= 0) ? "not-allowed" : "pointer" }}>
                        <Compass size={14} style={{ marginTop:1, flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{isMovingThisToken ? "Finish Move" : "Move Token"}</div>
                          <div style={{ fontSize:9, color:T.textFaint, marginTop:2 }}>{isMovingThisToken ? "Movement mode is active. Click again to stop dragging this combatant." : (combatLive && moveBudgetFt <= 0 ? "No movement left this turn, or a condition is pinning this creature in place." : (combatLive ? "Keep this panel open while dragging the active combatant on the map." : "Drag the token and snap it to the grid."))}</div>
                        </div>
                      </button>
                    </div>

                    {actionSections.map((section) => {
                      const SectionIcon = section.meta.icon || Swords;
                      return (
                        <div key={"action-section-"+section.name} style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", background:"rgba(255,255,255,0.02)", padding:8 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:7, color:section.meta.tone, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase" }}>
                              <SectionIcon size={12} />
                              {section.name}
                            </div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"0.8px" }}>{section.items.length}</div>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            {section.items.map((act) => {
                              const Icon = act.icon || SectionIcon;
                              return (
                                <button key={act.key} onClick={() => { if (!act.disabled) act.onClick(); }}
                                  disabled={!!act.disabled}
                                  onMouseEnter={e => {
                                    if (act.disabled) return;
                                    e.currentTarget.style.background="rgba(255,255,255,0.05)";
                                    e.currentTarget.style.borderColor=act.tone + "66";
                                    e.currentTarget.style.transform="translateY(-1px)";
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.background=subtleBg2;
                                    e.currentTarget.style.borderColor=subtleBorder;
                                    e.currentTarget.style.transform="none";
                                  }}
                                  style={{ ...popupBtnStyle, color: act.disabled ? "rgba(255,200,200,0.6)" : act.tone, opacity: act.disabled ? 0.62 : 1, cursor: act.disabled ? "not-allowed" : "pointer", background:subtleBg2, border:"1px solid " + subtleBorder }}>
                                  <Icon size={14} style={{ marginTop:1, flexShrink:0 }}/>
                                  <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                                      <div style={{ fontSize:12, fontWeight:600, color: act.disabled ? "rgba(255,200,200,0.8)" : T.text, lineHeight:1.25 }}>{act.label}</div>
                                      <span style={{ flexShrink:0, fontSize:7, fontFamily:T.ui, color:act.disabled ? "#ff9e9e" : act.tone, letterSpacing:"0.8px", textTransform:"uppercase", border:"1px solid " + (act.disabled ? "rgba(255,158,158,0.25)" : act.tone + "33"), borderRadius:"999px", padding:"2px 6px", background:"rgba(255,255,255,0.03)" }}>
                                        {actionTypeLabel(act.actionType || "action")}
                                      </span>
                                    </div>
                                    <div style={{ fontSize:9, color: act.disabled ? "#ff9e9e" : T.textFaint, marginTop:4, lineHeight:1.45 }}>{act.helper}</div>
                                    {!act.disabled && (
                                      <div style={{ display:"flex", justifyContent:"space-between", gap:8, fontSize:8, color:T.textMuted, marginTop:6, fontFamily:T.ui, letterSpacing:"0.4px", textTransform:"uppercase" }}>
                                        <span>{act.cost || "Action"}</span>
                                        <span>{act.range || "Self"}</span>
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    <div style={{ border:"1px solid rgba(232,148,10,0.18)", borderRadius:"14px", background:"rgba(232,148,10,0.04)", padding:8 }}>
                      <button onClick={() => setShowConditionMenu(!showConditionMenu)}
                        onMouseEnter={e => { e.currentTarget.style.background="rgba(232,148,10,0.08)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.transform="none"; }}
                        style={{...popupBtnStyle, color:"#e8940a", justifyContent:"space-between", border:"1px solid rgba(232,148,10,0.18)", background:"rgba(255,255,255,0.02)"}}>
                        <span style={{ display:"flex", alignItems:"center", gap:8 }}><AlertTriangle size={14}/> <span style={{ fontSize:12, fontWeight:600 }}>Conditions</span></span>
                        <ChevronRight size={11} style={{ transform: showConditionMenu ? "rotate(90deg)" : "none", transition:"transform 0.15s" }}/>
                      </button>
                      {showConditionMenu && (
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginTop:8, maxHeight:220, overflowY:"auto" }}>
                          {DND_CONDITIONS.map(dc => {
                            const hasCond = (tokenConditions[tk.id] || []).includes(dc.name);
                            return (
                              <button key={dc.name} onClick={() => {
                                if (hasCond) removeTokenCondition(tk.id, dc.name);
                                else addTokenCondition(tk.id, dc.name);
                                openCombatSidebar("tracker");
                              }}
                                onMouseEnter={e => e.currentTarget.style.background = hasCond ? dc.color + "22" : lm("rgba(255,255,255,0.05)", "rgba(0,0,0,0.04)")}
                                onMouseLeave={e => e.currentTarget.style.background = hasCond ? dc.color + "12" : subtleBg2}
                                style={{ display:"flex", alignItems:"center", gap:6, width:"100%", padding:"7px 8px", background: hasCond ? dc.color + "12" : subtleBg2, border:"1px solid " + (hasCond ? dc.color + "55" : subtleBorder), borderRadius:"10px", textAlign:"left", cursor:"pointer", fontSize:10, color: hasCond ? dc.color : T.textMuted, fontFamily:T.ui, transition:"background 0.12s, border-color 0.12s" }}>
                                <span style={{ width:7, height:7, borderRadius:"50%", background:dc.color, opacity: hasCond ? 1 : 0.4, flexShrink:0 }} />
                                <span style={{ flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{dc.name}</span>
                                {hasCond && <Check size={10} style={{ flexShrink:0 }}/>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {isCurrentActor && (
                      <button onClick={() => { nextTurn(); dismissTurnPopup(); openCombatSidebar("tracker"); }}
                        onMouseEnter={e => { e.currentTarget.style.background="rgba(94,224,154,0.08)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="rgba(94,224,154,0.04)"; e.currentTarget.style.transform="none"; }}
                        style={{...popupBtnStyle, color:"#5ee09a", border:"1px solid rgba(94,224,154,0.24)", background:"rgba(94,224,154,0.04)"}}>
                        <SkipForward size={14} style={{ marginTop:1, flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:T.text }}>End Turn</div>
                          <div style={{ fontSize:9, color:T.textFaint, marginTop:2 }}>Advance to the next combatant in initiative.</div>
                        </div>
                      </button>
                    )}

                    {viewRole === "dm" && (
                      <React.Fragment>
                        <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", background:"rgba(255,255,255,0.02)", padding:8 }}>
                        <button onClick={() => { updateToken(tk.id, { hidden: !tk.hidden }); dismissTurnPopup(); }}
                          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background="none"}
                          style={{...popupBtnStyle, color:T.textMuted}}>
                          {tk.hidden ? <Eye size={13} style={{ marginTop:1 }}/> : <EyeOff size={13} style={{ marginTop:1 }}/>}
                          <span style={{ fontSize:12, fontWeight:600 }}>{tk.hidden ? "Show Token" : "Hide Token"}</span>
                        </button>
                        <button onClick={() => { const n = prompt("Rename token:", tk.name); if (n) updateToken(tk.id, { name: n }); dismissTurnPopup(); }}
                          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background="none"}
                          style={{...popupBtnStyle, color:T.textMuted}}>
                          <Edit3 size={13} style={{ marginTop:1 }}/>
                          <span style={{ fontSize:12, fontWeight:600 }}>Rename</span>
                        </button>
                        <button onClick={() => { removeToken(tk.id); dismissTurnPopup(); }}
                          onMouseEnter={e => e.currentTarget.style.background="rgba(212,67,58,0.06)"} onMouseLeave={e => e.currentTarget.style.background="none"}
                          style={{...popupBtnStyle, color:"#f06858"}}>
                          <Trash2 size={13} style={{ marginTop:1 }}/>
                          <span style={{ fontSize:12, fontWeight:600 }}>Remove</span>
                        </button>
                        </div>
                      </React.Fragment>
                    )}
                  </div>

                  {(latestEntry || playModeResolution) && (
                    <div style={{ flex:"0 0 auto", padding:"11px 14px 12px", borderTop:"1px solid " + T.border, background:"rgba(0,0,0,0.18)" }}>
                      <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", marginBottom:5 }}>Latest Result</div>
                      <div style={{ fontSize:10, fontFamily:T.body, color:T.text, whiteSpace:"pre-line", lineHeight:1.45 }}>
                        {playModeResolution?.title ? (playModeResolution.title + "\n") : ""}
                        {playModeResolution?.lines?.length ? playModeResolution.lines.slice(0, 4).join("\n") : getCombatEntrySummary(latestEntry)}
                      </div>
                      {!playModeResolution?.lines?.length && getCombatEntryDetails(latestEntry) && (
                        <div style={{ fontSize:9, fontFamily:T.body, color:T.textMuted, marginTop:4 }}>{getCombatEntryDetails(latestEntry)}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Laser pointer dot (follows cursor when active) */}
            {laserMode && (
              <div style={{ position:"absolute", left:0, top:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:90 }}>
                <div style={{ position:"fixed", left:"50%", top:"50%", width:12, height:12, borderRadius:"50%", background:"#ff2020", boxShadow:"0 0 15px #ff2020, 0 0 30px rgba(255,32,32,0.4)", transform:"translate(-50%,-50%)", pointerEvents:"none", mixBlendMode:"screen" }} />
              </div>
            )}

            {/* Scene Panel floating overlay */}
            {!cockpitModeActive && showScenePanel && viewRole === "dm" && (
              <div style={{ position:"absolute", left:70, top:12, zIndex:25, width:280, maxHeight:"calc(100% - 24px)", background:panelBgSolid, backdropFilter:"blur(16px)", border:"1px solid var(--crimson-border)", borderRadius:"12px", boxShadow:"0 8px 32px rgba(0,0,6,0.6)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
                <div style={{ padding:"12px 14px", borderBottom:"1px solid " + T.border, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:T.ui, fontSize:11, letterSpacing:"2px", color:"#5ee09a", textTransform:"uppercase", fontWeight:600 }}>Maps & Scenes</span>
                  <button onClick={() => setShowScenePanel(false)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint, padding:2 }}><X size={14}/></button>
                </div>

                <div style={{ flex:1, overflowY:"auto", padding:"8px 10px" }}>
                  {/* Create new map button */}
                  <button onClick={() => {
                    const name = prompt("Map name (e.g., Sword Coast, Dungeon Level 1):");
                    if (name) createMap(name);
                  }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(46,139,87,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,0.1)"}
                    style={{ width:"100%", padding:"10px 12px", background:"rgba(0,0,0,0.1)", border:"1px dashed rgba(46,139,87,0.3)", borderRadius:"8px", color:"#5ee09a", fontFamily:T.ui, fontSize:11, letterSpacing:"0.5px", cursor:"pointer", marginBottom:8, transition:"all 0.15s", display:"flex", alignItems:"center", gap:6, justifyContent:"center" }}>
                    <Plus size={12}/> New Map
                  </button>

                  {/* Map list */}
                  {battleMaps.map(map => (
                    <div key={map.id} style={{ marginBottom:8, background: activeMapId === map.id ? "rgba(46,139,87,0.06)" : "rgba(0,0,0,0.06)", border:"1px solid " + (activeMapId === map.id ? "rgba(46,139,87,0.25)" : T.border), borderRadius:"8px", overflow:"hidden" }}>
                      <div style={{ padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}
                        onClick={() => switchToMapOverview(map.id)}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <Globe size={14} color={activeMapId === map.id ? "#5ee09a" : T.textMuted} />
                          <span style={{ fontFamily:T.ui, fontSize:12, color: activeMapId === map.id ? "#5ee09a" : T.text, fontWeight:500, letterSpacing:"0.3px" }}>{map.name}</span>
                        </div>
                        <div style={{ display:"flex", gap:4 }}>
                          <button onClick={e => { e.stopPropagation(); mapImgInputRef.current?.click(); mapImgInputRef.current.dataset.mapId = map.id; }}
                            style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint, padding:2 }} title="Upload map image"><Image size={12}/></button>
                          <button onClick={e => { e.stopPropagation(); if (confirm("Delete map '" + map.name + "'?")) deleteMap(map.id); }}
                            style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint, padding:2 }} title="Delete map"><Trash2 size={12}/></button>
                        </div>
                      </div>
                      {map.bgSrc && <div style={{ height:2, background:"linear-gradient(90deg, rgba(46,139,87,0.3), transparent)" }} />}

                      {/* Scenes within this map */}
                      <div style={{ padding:"4px 8px 8px" }}>
                        {(map.scenes || []).map(scene => (
                          <div key={scene.id}
                            onClick={() => saveAndSwitchScene(map.id, scene.id)}
                            onMouseEnter={e => e.currentTarget.style.background="rgba(46,139,87,0.08)"} onMouseLeave={e => e.currentTarget.style.background= activeSceneId === scene.id ? "rgba(46,139,87,0.12)" : "transparent"}
                            style={{ padding:"7px 10px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", borderRadius:"6px", background: activeSceneId === scene.id ? "rgba(46,139,87,0.12)" : "transparent", transition:"all 0.12s", marginBottom:2 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <MapPin size={11} color={activeSceneId === scene.id ? "#5ee09a" : T.textFaint} />
                              <span style={{ fontFamily:T.body, fontSize:12, color: activeSceneId === scene.id ? "#5ee09a" : T.textDim }}>{scene.name}</span>
                            </div>
                            <div style={{ display:"flex", gap:3 }}>
                              <button onClick={e => { e.stopPropagation(); sceneImgInputRef.current?.click(); sceneImgInputRef.current.dataset.mapId = map.id; sceneImgInputRef.current.dataset.sceneId = scene.id; }}
                                style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint, padding:2 }} title="Upload scene bg"><Image size={10}/></button>
                              {activeMapId === map.id && !activeSceneId && (
                                <button onClick={e => { e.stopPropagation(); setEditingRegionMarker({ sceneId: scene.id, label: scene.name }); setShowScenePanel(false); }}
                                  style={{ background:"none", border:"none", cursor:"pointer", color:"#58aaff", padding:2 }} title="Place marker on map"><MapPin size={10}/></button>
                              )}
                              <button onClick={e => { e.stopPropagation(); if (confirm("Delete scene '" + scene.name + "'?")) deleteScene(map.id, scene.id); }}
                                style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint, padding:2 }} title="Delete scene"><X size={10}/></button>
                            </div>
                          </div>
                        ))}
                        <button onClick={e => { e.stopPropagation(); const name = prompt("Scene name (e.g., Waterdeep, Dragon's Lair):"); if (name) createScene(map.id, name); }}
                          onMouseEnter={e => e.currentTarget.style.color="#5ee09a"} onMouseLeave={e => e.currentTarget.style.color=T.textFaint}
                          style={{ width:"100%", padding:"6px 0", background:"none", border:"none", cursor:"pointer", fontFamily:T.ui, fontSize:10, letterSpacing:"0.5px", color:T.textFaint, display:"flex", alignItems:"center", justifyContent:"center", gap:4, transition:"color 0.12s" }}>
                          <Plus size={10}/> Add Scene
                        </button>
                      </div>
                    </div>
                  ))}

                  {battleMaps.length === 0 && (
                    <div style={{ padding:"20px 10px", textAlign:"center" }}>
                      <Globe size={28} color={T.textFaint} style={{ margin:"0 auto 8px", display:"block", opacity:0.4 }}/>
                      <p style={{ fontFamily:T.body, fontSize:12, color:T.textFaint, margin:0 }}>No maps yet. Create a map to start organizing your world into scenes.</p>
                    </div>
                  )}

                  {/* Props section */}
                  <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid " + T.border }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", color:T.textFaint, textTransform:"uppercase", fontWeight:500 }}>Props</span>
                      <span style={{ fontFamily:T.ui, fontSize:9, color:T.textFaint }}>{props.length} placed</span>
                    </div>
                    <button onClick={() => propImgInputRef.current?.click()}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(88,170,255,0.08)"} onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,0.1)"}
                      style={{ width:"100%", padding:"8px 12px", background:"rgba(0,0,0,0.1)", border:"1px dashed rgba(88,170,255,0.3)", borderRadius:"6px", color:"#58aaff", fontFamily:T.ui, fontSize:10, letterSpacing:"0.5px", cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:6, justifyContent:"center" }}>
                      <Upload size={11}/> Upload Prop Image
                    </button>
                    {props.length > 0 && (
                      <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:2 }}>
                        {props.map(p => (
                          <div key={p.id}
                            onClick={() => setSelectedPropId(p.id === selectedPropId ? null : p.id)}
                            onMouseEnter={e => e.currentTarget.style.background="rgba(88,170,255,0.06)"} onMouseLeave={e => e.currentTarget.style.background= selectedPropId === p.id ? "rgba(88,170,255,0.08)" : "transparent"}
                            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"5px 8px", borderRadius:"4px", cursor:"pointer", background: selectedPropId === p.id ? "rgba(88,170,255,0.08)" : "transparent", transition:"all 0.12s" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <Image size={10} color={selectedPropId === p.id ? "#58aaff" : T.textFaint} />
                              <span style={{ fontSize:11, fontFamily:T.body, color: selectedPropId === p.id ? "#58aaff" : T.textDim }}>{p.name}</span>
                            </div>
                            <div style={{ display:"flex", gap:3 }}>
                              <button onClick={e => { e.stopPropagation(); updateProp(p.id, { locked: !p.locked }); }}
                                style={{ background:"none", border:"none", cursor:"pointer", color: p.locked ? "#ffd54f" : T.textFaint, padding:2 }}>{p.locked ? <Lock size={10}/> : <Unlock size={10}/>}</button>
                              <button onClick={e => { e.stopPropagation(); removeProp(p.id); }}
                                style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint, padding:2 }}><Trash2 size={10}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Active Scene Indicator */}
                  {activeMapId && activeSceneId && (() => {
                    const am = battleMaps.find(m => m.id === activeMapId);
                    const as2 = am ? (am.scenes || []).find(s => s.id === activeSceneId) : null;
                    return as2 ? (
                      <div style={{ marginTop:12, padding:"8px 12px", background:"rgba(46,139,87,0.08)", border:"1px solid rgba(46,139,87,0.2)", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div>
                          <div style={{ fontSize:9, fontFamily:T.ui, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase" }}>Active Scene</div>
                          <div style={{ fontSize:12, fontFamily:T.ui, color:"#5ee09a", fontWeight:500 }}>{as2.name}</div>
                        </div>
                        <button onClick={() => switchToMapOverview(activeMapId)}
                          onMouseEnter={e => e.currentTarget.style.background="rgba(46,139,87,0.15)"} onMouseLeave={e => e.currentTarget.style.background="rgba(46,139,87,0.06)"}
                          style={{ padding:"5px 10px", background:"rgba(46,139,87,0.06)", border:"1px solid rgba(46,139,87,0.2)", borderRadius:"4px", color:"#5ee09a", fontFamily:T.ui, fontSize:9, cursor:"pointer", transition:"all 0.12s" }}>
                          Back to Map
                        </button>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}

            {/* Hidden file inputs for maps/scenes/props */}
            <input type="file" ref={mapImgInputRef} style={{display:"none"}} accept="image/*" onChange={e => {
              const file = e.target.files?.[0];
              const mid = e.target.dataset.mapId;
              if (!file || !mid) return;
              const reader = new FileReader();
              reader.onload = () => {
                setBattleMaps(prev => prev.map(m => m.id === mid ? {...m, bgSrc: reader.result} : m));
                if (activeMapId === mid && !activeSceneId) {
                  const img = new Image();
                  img.onload = () => setBgImage(img);
                  img.src = reader.result;
                }
              };
              reader.readAsDataURL(file);
              e.target.value = "";
            }} />
            <input type="file" ref={sceneImgInputRef} style={{display:"none"}} accept="image/*" onChange={e => {
              const file = e.target.files?.[0];
              const mid = e.target.dataset.mapId;
              const sid = e.target.dataset.sceneId;
              if (!file || !mid || !sid) return;
              const reader = new FileReader();
              reader.onload = () => {
                setBattleMaps(prev => prev.map(m => {
                  if (m.id !== mid) return m;
                  return {...m, scenes: (m.scenes || []).map(s => s.id === sid ? {...s, bgSrc: reader.result} : s)};
                }));
                if (activeSceneId === sid) {
                  const img = new Image();
                  img.onload = () => setBgImage(img);
                  img.src = reader.result;
                }
              };
              reader.readAsDataURL(file);
              e.target.value = "";
            }} />
            <input type="file" ref={propImgInputRef} style={{display:"none"}} accept="image/*" onChange={handlePropUpload} />

            {/* Region marker placement indicator */}
            {editingRegionMarker && (
              <div style={{ position:"absolute", top:12, left:"50%", transform:"translateX(-50%)", zIndex:60, padding:"10px 20px", background:"rgba(88,170,255,0.15)", border:"1px solid rgba(88,170,255,0.4)", borderRadius:"8px", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 16px rgba(0,0,6,0.4)" }}>
                <MapPin size={14} color="#58aaff" />
                <span style={{ fontFamily:T.ui, fontSize:12, color:"#58aaff", letterSpacing:"0.3px" }}>Click on the map to place marker for "{editingRegionMarker.label}"</span>
                <button onClick={() => setEditingRegionMarker(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint, marginLeft:8 }}><X size={14}/></button>
              </div>
            )}

            {/* ── LEFT: Floating Toolbar (Interaction-Focused) ── */}
            {(() => {
              const tbActive = "#c9a84c";
              const tbActiveGlow = "rgba(201,168,76,0.2)";
              const tbActiveBorder = "rgba(201,168,76,0.35)";
              const tbActiveBg = "rgba(201,168,76,0.1)";
              const tbGreenActive = "#5ee09a";
              const tbGreenGlow = "rgba(94,224,154,0.2)";
              const tbGreenBorder = "rgba(94,224,154,0.35)";
              const tbGreenBg = "rgba(94,224,154,0.1)";
              const tbBtnSize = 40;
              const tbIconSize = 18;
              const tbHover = (e, active) => { if (!active) { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.boxShadow="0 0 8px rgba(201,168,76,0.08)"; }};
              const tbLeave = (e, active) => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.boxShadow="none"; }};
              const tbBtnStyle = (active, color) => ({
                width:tbBtnSize, height:tbBtnSize, display:"flex", alignItems:"center", justifyContent:"center",
                background: active ? (color === "green" ? tbGreenBg : tbActiveBg) : "transparent",
                border:"none", borderRadius:10, cursor:"pointer", transition:"all 0.18s ease", position:"relative",
                boxShadow: active ? ("0 0 12px " + (color === "green" ? tbGreenGlow : tbActiveGlow)) : "none",
              });
              const tbIconColor = (active, color) => active ? (color === "green" ? tbGreenActive : tbActive) : "rgba(242,232,214,0.4)";
              return (
              <div style={{
                position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", zIndex:20,
                display: cockpitModeActive ? "none" : "flex", flexDirection:"column", alignItems:"center", gap:0,
                background:"rgba(10,10,16,0.72)", backdropFilter:"blur(20px) saturate(1.2)",
                borderRadius:14, border:"1px solid rgba(255,255,255,0.06)",
                boxShadow:"0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.02) inset",
                padding:"8px 5px",
              }}>

              {/* ── Group 1: Map Interaction Modes ── */}
              {bmModes.map((m, idx) => (
                <button key={m.id} onClick={() => { if (m.id === "draw" && viewRole === "player") return; setMode(m.id); if (m.id === "combat") { setSidebarOpen(true); setCombatTab(combatLive ? "tracker" : combatTab); } }}
                  title={m.label + " (" + (idx+1) + ")"}
                  onMouseEnter={e => tbHover(e, mode === m.id)}
                  onMouseLeave={e => tbLeave(e, mode === m.id)}
                  style={tbBtnStyle(mode === m.id, m.id === "combat" ? "green" : "gold")}>
                  <m.icon size={tbIconSize} color={tbIconColor(mode === m.id, m.id === "combat" ? "green" : "gold")} strokeWidth={mode === m.id ? 2.2 : 1.6} />
                </button>
              ))}

              {/* ── Spacer ── */}
              <div style={{ width:24, height:1, background:"rgba(255,255,255,0.06)", margin:"6px 0" }} />

              {/* ── Group 2: Draw Sub-tools (contextual) ── */}
              {mode === "draw" && drawToolDefs.map(dt => (
                <button key={dt.id} onClick={() => { setDrawTool(dt.id); setWallStart(null); setWallPreview(null); }} title={dt.label}
                  onMouseEnter={e => tbHover(e, drawTool === dt.id)}
                  onMouseLeave={e => tbLeave(e, drawTool === dt.id)}
                  style={tbBtnStyle(drawTool === dt.id, "gold")}>
                  <dt.icon size={16} color={tbIconColor(drawTool === dt.id, "gold")} strokeWidth={drawTool === dt.id ? 2.2 : 1.6} />
                </button>
              ))}

              {mode === "draw" && drawTool === "terrain" && (
                <React.Fragment>
                  <div style={{ width:24, height:1, background:"rgba(255,255,255,0.06)", margin:"4px 0" }} />
                  <div style={{ maxHeight:240, overflowY:"auto", display:"flex", flexDirection:"column", gap:2, scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.08) transparent" }}>
                    {Object.entries(TERRAIN_TYPES).map(([key, terrain]) => (
                      <button key={key} onClick={() => setSelectedTerrain(key)} title={terrain.label + " (cost: " + terrain.cost + ")"}
                        onMouseEnter={e => { if (selectedTerrain !== key) e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}
                        onMouseLeave={e => { if (selectedTerrain !== key) e.currentTarget.style.background="transparent"; }}
                        style={{
                          width:tbBtnSize, height:32, display:"flex", alignItems:"center", justifyContent:"center",
                          background: selectedTerrain === key ? terrain.color : "transparent",
                          border:"none", borderRadius:8, cursor:"pointer", transition:"all 0.15s",
                          fontSize:13, fontFamily:T.ui, color:T.text, fontWeight:600,
                        }}>
                        <span>{terrain.icon || terrain.label.substring(0,1)}</span>
                      </button>
                    ))}
                  </div>
                </React.Fragment>
              )}

              {mode === "draw" && drawTool === "wall" && (
                <React.Fragment>
                  <div style={{ width:24, height:1, background:"rgba(255,255,255,0.06)", margin:"4px 0" }} />
                  {Object.entries(WALL_TYPES).map(([key, wt]) => (
                    <button key={key} onClick={() => setSelectedWallType(key)} title={wt.label}
                      onMouseEnter={e => { if (selectedWallType !== key) e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                      onMouseLeave={e => { if (selectedWallType !== key) e.currentTarget.style.background="transparent"; }}
                      style={{
                        width:tbBtnSize, height:32, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2,
                        background: selectedWallType === key ? "rgba(181,116,255,0.1)" : "transparent",
                        border:"none", borderRadius:8, cursor:"pointer", transition:"all 0.15s",
                        boxShadow: selectedWallType === key ? "0 0 10px rgba(181,116,255,0.15)" : "none",
                      }}>
                      <div style={{ width:22, height:3, background:wt.color, borderRadius:2, borderBottom: wt.dash.length > 0 ? "1px dashed " + wt.color : "none" }} />
                    </button>
                  ))}
                </React.Fragment>
              )}

              {mode === "draw" && drawTool === "draw" && (
                <React.Fragment>
                  <div style={{ width:24, height:1, background:"rgba(255,255,255,0.06)", margin:"4px 0" }} />
                  <input type="color" value={drawColor} onChange={e=>setDrawColor(e.target.value)}
                    style={{ width:28, height:28, border:"1px solid rgba(255,255,255,0.08)", background:"none", padding:0, cursor:"pointer", borderRadius:6 }} />
                  <select value={drawWidth} onChange={e=>setDrawWidth(parseInt(e.target.value))} title="Brush width"
                    style={{ width:tbBtnSize, padding:"3px 2px", fontSize:9, fontFamily:T.ui, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(242,232,214,0.5)", borderRadius:6, textAlign:"center", marginTop:2 }}>
                    <option value="2">S</option><option value="3">M</option><option value="6">L</option><option value="10">XL</option>
                  </select>
                </React.Fragment>
              )}

              {/* ── Draw mode spacer before utilities ── */}
              {mode === "draw" && <div style={{ width:24, height:1, background:"rgba(255,255,255,0.06)", margin:"6px 0" }} />}

              {/* ── Spacer (non-draw) ── */}
              {mode !== "draw" && <div style={{ width:24, height:1, background:"rgba(255,255,255,0.06)", margin:"6px 0" }} />}

              {/* ── Group 3: Quick Utilities ── */}
              <button onClick={() => setPingMode(!pingMode)} title="Ping (P)"
                onMouseEnter={e => tbHover(e, pingMode)}
                onMouseLeave={e => tbLeave(e, pingMode)}
                style={tbBtnStyle(pingMode, "gold")}>
                <MapPin size={tbIconSize} color={tbIconColor(pingMode, "gold")} strokeWidth={pingMode ? 2.2 : 1.6} />
              </button>

              {viewRole === "dm" && (
                <button onClick={() => setLaserMode(!laserMode)} title="Laser Pointer (L)"
                  onMouseEnter={e => tbHover(e, laserMode)}
                  onMouseLeave={e => tbLeave(e, laserMode)}
                  style={tbBtnStyle(laserMode, "gold")}>
                  <Target size={tbIconSize} color={tbIconColor(laserMode, "gold")} strokeWidth={laserMode ? 2.2 : 1.6} />
                </button>
              )}

              <button onClick={() => setShowDicePanel(!showDicePanel)} title="Dice Roller"
                onMouseEnter={e => tbHover(e, showDicePanel)}
                onMouseLeave={e => tbLeave(e, showDicePanel)}
                style={tbBtnStyle(showDicePanel, "gold")}>
                <Dice6 size={tbIconSize} color={tbIconColor(showDicePanel, "gold")} strokeWidth={showDicePanel ? 2.2 : 1.6} />
              </button>

              {/* ── Spacer ── */}
              <div style={{ width:24, height:1, background:"rgba(255,255,255,0.06)", margin:"6px 0" }} />

              {/* ── Group 4: View Controls ── */}
              <button onClick={() => setShowGrid(!showGrid)} title="Toggle Grid (G)"
                onMouseEnter={e => tbHover(e, showGrid)}
                onMouseLeave={e => tbLeave(e, showGrid)}
                style={tbBtnStyle(showGrid, "gold")}>
                <Layers size={tbIconSize} color={tbIconColor(showGrid, "gold")} strokeWidth={showGrid ? 2.2 : 1.6} />
              </button>

              <button onClick={() => { setZoom(1); setPan({x:0,y:0}); }} title="Reset View"
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}
                style={{ width:tbBtnSize, height:tbBtnSize, display:"flex", alignItems:"center", justifyContent:"center", background:"transparent", border:"none", borderRadius:10, cursor:"pointer", transition:"all 0.18s ease" }}>
                <RefreshCw size={16} color="rgba(242,232,214,0.35)" strokeWidth={1.6} />
              </button>

              {/* ── Combat Round Indicator (bottom) ── */}
              {combatLive && (
                <React.Fragment>
                  <div style={{ width:24, height:1, background:"rgba(255,255,255,0.06)", margin:"4px 0" }} />
                  <div style={{ width:tbBtnSize, padding:"5px 0", background:"rgba(94,224,154,0.06)", borderRadius:8, textAlign:"center" }}>
                    <span style={{ fontSize:8, fontFamily:T.ui, letterSpacing:"1px", color:tbGreenActive, display:"block", fontWeight:700 }}>R{round}</span>
                    <span style={{ fontSize:7, fontFamily:T.ui, color:"rgba(242,232,214,0.4)" }}>{turn+1}/{Math.max(1, combatants.filter(c => !shouldSkipCombatantRow(c)).length)}</span>
                  </div>
                </React.Fragment>
              )}

              </div>
              );
            })()}
          </div>

          {/* ── BOTTOM: Combat Bar ── */}
          {false && combatLive && (() => {
            const activeRow = combatants[turn] || null;
            const activeTokenRef = activeRow ? tokens.find(t => t.id === activeRow.mapTokenId) : null;
            const hiddenToPlayer = viewRole === "player" && !!activeTokenRef?.hidden;
            const turnLabel = hiddenToPlayer ? "Hidden Creature" : (activeRow?.name || "\u2014");
            const hpLabel = !activeRow || activeRow.hp == null
              ? ""
              : hiddenToPlayer
                ? "Hidden"
                : (viewRole === "player" && activeRow.type !== "pc" && playModePresentation === "simple")
                  ? hpStateLabel(activeRow.hp, activeRow.maxHp)
                  : (activeRow.hp + "/" + activeRow.maxHp);
            const hpPct = activeRow?.maxHp ? Math.round(activeRow.hp / activeRow.maxHp * 100) : 0;
            const pulseColor = activeRow?.type === "pc" ? "#5ee09a" : hiddenToPlayer ? T.textFaint : cssVar("--crimson");
            const visibleLiveRows = combatants.filter((c) => {
              if (shouldSkipCombatantRow(c)) return false;
              if (viewRole !== "player") return true;
              const rowToken = tokens.find(t => t.id === c.mapTokenId);
              return !rowToken?.hidden;
            });
            const visibleTurnNumber = hiddenToPlayer
              ? "?"
              : String(Math.max(1, visibleLiveRows.findIndex(c => c.mapTokenId === activeRow?.mapTokenId) + 1 || 1));
            return (
              <div style={{ height:64, background:T.bgCard, borderTop:"2px solid " + T.crimsonBorder, display:"flex", alignItems:"center", padding:"0 16px", gap:16, flexShrink:0, boxShadow:"0 -4px 16px rgba(0,0,6,0.3)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(212,67,58,0.15)", padding:"6px 12px", borderRadius:"4px", border:"1px solid rgba(212,67,58,0.3)" }}>
                  <Swords size={12} color={cssVar("--crimson")} />
                  <span style={{ fontFamily:T.ui, fontSize:11, color:cssVar("--crimson"), fontWeight:600, letterSpacing:"1px" }}>R{round}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:pulseColor, boxShadow:"0 0 6px " + pulseColor + "88" }} />
                  <span style={{ fontFamily:T.body, fontSize:16, color:T.text, fontWeight:500 }}>{turnLabel}</span>
                  {activeRow && activeRow.hp != null && !hiddenToPlayer && (
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <div style={{ width:60, height:6, background:"rgba(0,0,0,0.4)", borderRadius:"3px", overflow:"hidden" }}>
                        <div style={{ width: hpPct + "%", height:"100%", background:getHpColor(activeRow.hp, activeRow.maxHp), transition:"width 0.2s", borderRadius:"3px" }} />
                      </div>
                      <span style={{ fontFamily:T.ui, fontSize:9, color:T.textMuted }}>{hpLabel}</span>
                    </div>
                  )}
                  {hiddenToPlayer && <span style={{ fontFamily:T.ui, fontSize:9, color:T.textFaint, letterSpacing:"0.8px", textTransform:"uppercase" }}>Resolving in DM view</span>}
                  <span style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1px", background:"var(--bg-input)", padding:"2px 6px", borderRadius:"2px" }}>
                    {visibleTurnNumber}/{Math.max(1, visibleLiveRows.length)}
                  </span>
                </div>
                <div style={{ flex:1 }} />
                {viewRole === "dm" && (
                  <React.Fragment>
                    <CrimsonBtn onClick={prevTurn} secondary small><ChevronUp size={11}/></CrimsonBtn>
                    <CrimsonBtn onClick={nextTurn} small><SkipForward size={11}/> Next Turn</CrimsonBtn>
                    <CrimsonBtn onClick={endCombat} secondary small><X size={11}/> End</CrimsonBtn>
                  </React.Fragment>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── RIGHT: Sidebar Toggle Tab ── */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} title={(sidebarOpen ? "Hide" : "Show") + " Sidebar (Tab)"}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(14,14,22,0.98)"; e.currentTarget.style.borderColor="rgba(201,168,76,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="rgba(10,10,16,0.92)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; }}
          style={{
            display: cockpitModeActive ? "none" : "flex",
            position:"absolute", right: sidebarOpen ? 380 : 0, top:"50%", transform:"translateY(-50%)",
            zIndex:50, width:20, height:56, alignItems:"center", justifyContent:"center",
            background:"rgba(10,10,16,0.92)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(255,255,255,0.06)",
            borderRight: sidebarOpen ? "none" : undefined,
            borderRadius:"8px 0 0 8px",
            cursor:"pointer", transition:"right 0.25s ease, background 0.15s ease, border-color 0.15s ease",
            boxShadow:"-4px 0 16px rgba(0,0,0,0.3)",
          }}>
          {sidebarOpen ? <ChevronRight size={12} color="rgba(242,232,214,0.4)" /> : <ChevronLeft size={12} color="rgba(242,232,214,0.4)" />}
        </button>

        {/* ── RIGHT: Context Panel (Information Hub) ── */}
        <div style={{
          width: (!cockpitModeActive && sidebarOpen) ? 380 : 0, minWidth: (!cockpitModeActive && sidebarOpen) ? 380 : 0,
          background:"rgba(10,10,16,0.94)", backdropFilter:"blur(20px) saturate(1.1)",
          overflowY: sidebarOpen ? "auto" : "hidden", overflowX:"hidden",
          display: cockpitModeActive ? "none" : "flex", flexDirection:"column",
          borderLeft: (!cockpitModeActive && sidebarOpen) ? "1px solid rgba(255,255,255,0.06)" : "none",
          boxShadow: (!cockpitModeActive && sidebarOpen) ? "-8px 0 32px rgba(0,0,0,0.4)" : "none",
          transition:"width 0.25s ease, min-width 0.25s ease, opacity 0.2s ease",
          opacity: (!cockpitModeActive && sidebarOpen) ? 1 : 0,
          scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.06) transparent",
        }}>

          {(combatLive || mode === "combat") ? (
  <div style={{ padding:0, display:"flex", flexDirection:"column", height:"100%" }}>
    {/* ── Combat Header ── */}
    <div style={{ padding:"16px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.04)", background:"linear-gradient(180deg, rgba(94,224,154,0.03) 0%, transparent 100%)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:T.ui, fontSize:12, letterSpacing:"2px", color: combatLive ? "#5ee09a" : "rgba(242,232,214,0.5)", textTransform:"uppercase", fontWeight:700 }}>
            {combatLive ? "Round " + round : "Encounter"}
          </span>
          {combatLive && (
            <span style={{ padding:"2px 8px", borderRadius:999, fontSize:9, fontFamily:T.ui, background:"rgba(94,224,154,0.08)", border:"1px solid rgba(94,224,154,0.2)", color:"#5ee09a", fontWeight:500 }}>Turn {turn+1}/{Math.max(1, combatants.filter(c => !shouldSkipCombatantRow(c)).length)}</span>
          )}
        </div>
        {combatLive && (
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={prevTurn} title="Previous Turn"
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
              style={{ padding:"5px 8px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, cursor:"pointer", color:"rgba(242,232,214,0.4)", display:"flex", alignItems:"center", transition:"background 0.12s" }}><ChevronUp size={11}/></button>
            <button onClick={nextTurn} title="Next Turn"
              onMouseEnter={e => e.currentTarget.style.background="rgba(94,224,154,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(94,224,154,0.08)"}
              style={{ padding:"5px 12px", background:"rgba(94,224,154,0.08)", border:"1px solid rgba(94,224,154,0.2)", borderRadius:6, cursor:"pointer", color:"#5ee09a", fontFamily:T.ui, fontSize:9, letterSpacing:"0.8px", fontWeight:600, display:"flex", alignItems:"center", gap:4, transition:"background 0.12s" }}><SkipForward size={10}/> Next</button>
            <button onClick={endCombat} title="End Combat"
              onMouseEnter={e => e.currentTarget.style.background="rgba(239,68,68,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
              style={{ padding:"5px 7px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, cursor:"pointer", color:"rgba(239,68,68,0.6)", display:"flex", alignItems:"center", transition:"background 0.12s" }}><X size={11}/></button>
          </div>
        )}
      </div>
      {encounterDifficulty && (
        <div style={{ marginTop:10, padding:"7px 12px", borderRadius:8, background: encounterDifficulty.difficulty === "deadly" ? "rgba(239,68,68,0.06)" : encounterDifficulty.difficulty === "hard" ? "rgba(245,158,11,0.06)" : encounterDifficulty.difficulty === "medium" ? "rgba(88,170,255,0.06)" : "rgba(94,224,154,0.06)", border: "1px solid " + (encounterDifficulty.difficulty === "deadly" ? "rgba(239,68,68,0.15)" : encounterDifficulty.difficulty === "hard" ? "rgba(245,158,11,0.15)" : encounterDifficulty.difficulty === "medium" ? "rgba(88,170,255,0.15)" : "rgba(94,224,154,0.15)"), display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:T.ui, fontSize:9, letterSpacing:"1px", textTransform:"uppercase", fontWeight:600, color: encounterDifficulty.difficulty === "deadly" ? "#ef4444" : encounterDifficulty.difficulty === "hard" ? "#f59e0b" : encounterDifficulty.difficulty === "medium" ? "#58aaff" : "#5ee09a" }}>{encounterDifficulty.difficulty}</span>
          <span style={{ fontFamily:T.ui, fontSize:8, color:"rgba(242,232,214,0.35)" }}>{encounterDifficulty.adjustedXP} XP</span>
        </div>
      )}
    </div>

    {/* ── Combat Tabs ── */}
    {!combatLive && (
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.04)", padding:"0 8px" }}>
        {[{id:"monsters",label:"Roster"},{id:"tracker",label:"Initiative"},{id:"log",label:"Results"}].map(tab => (
          <button key={tab.id} onClick={() => setCombatTab(tab.id)}
            onMouseEnter={e => { if (combatTab !== tab.id) e.currentTarget.style.color="rgba(242,232,214,0.6)"; }}
            onMouseLeave={e => { if (combatTab !== tab.id) e.currentTarget.style.color="rgba(242,232,214,0.3)"; }}
            style={{ flex:1, padding:"10px 4px", background:"transparent", border:"none", borderBottom: combatTab === tab.id ? "2px solid #c9a84c" : "2px solid transparent", cursor:"pointer", fontFamily:T.ui, fontSize:9, letterSpacing:"1.2px", textTransform:"uppercase", color: combatTab === tab.id ? "#c9a84c" : "rgba(242,232,214,0.3)", transition:"all 0.12s", fontWeight: combatTab === tab.id ? 600 : 400 }}>{tab.label}
            {tab.id === "log" && combatLog.length > 0 && <span style={{ marginLeft:4, padding:"1px 5px", borderRadius:999, background:"rgba(201,168,76,0.1)", fontSize:7, color:"#c9a84c" }}>{combatLog.length}</span>}
          </button>
        ))}
      </div>
    )}

    <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.06) transparent" }}>
      {/* MONSTERS TAB */}
      {visibleCombatTab === "monsters" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <input value={monsterSearch} onChange={e => setMonsterSearch(e.target.value)} placeholder="Search monsters..."
            style={{ padding:"8px 12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, color:"rgba(242,232,214,0.85)", fontFamily:T.body, fontSize:11, outline:"none", transition:"border-color 0.12s" }}
            onFocus={e => e.currentTarget.style.borderColor="rgba(201,168,76,0.3)"}
            onBlur={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"} />
          <div style={{ display:"flex", gap:4 }}>
            <select value={monsterCRFilter} onChange={e => setMonsterCRFilter(e.target.value)}
              style={{ flex:1, padding:"5px 8px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, color:"rgba(242,232,214,0.7)", fontFamily:T.ui, fontSize:9 }}>
              <option value="all">All CRs</option>
              {monsterCRs.map(cr => <option key={cr} value={cr}>CR {cr}</option>)}
            </select>
            <select value={monsterTypeFilter} onChange={e => setMonsterTypeFilter(e.target.value)}
              style={{ flex:1, padding:"5px 8px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, color:"rgba(242,232,214,0.7)", fontFamily:T.ui, fontSize:9 }}>
              <option value="all">All Types</option>
              {monsterTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ fontSize:8, fontFamily:T.ui, color:"rgba(242,232,214,0.25)", letterSpacing:"0.5px" }}>{filteredMonsters.length} monsters found</div>
          <div style={{ display:"flex", flexDirection:"column", gap:2, maxHeight:500, overflowY:"auto", scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.06) transparent" }}>
            {filteredMonsters.slice(0, 30).map(m => (
              <div key={m.name} onClick={() => setSelectedMonster(selectedMonster?.name === m.name ? null : m)}
                style={{ padding:"8px 10px", background: selectedMonster?.name === m.name ? "rgba(201,168,76,0.06)" : "transparent", border: "1px solid " + (selectedMonster?.name === m.name ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.02)"), borderRadius:6, cursor:"pointer", transition:"all 0.12s" }}
                onMouseEnter={e => { if (selectedMonster?.name !== m.name) e.currentTarget.style.background="rgba(255,255,255,0.025)"; }}
                onMouseLeave={e => { if (selectedMonster?.name !== m.name) e.currentTarget.style.background="transparent"; }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:T.body, fontSize:11, color:"rgba(242,232,214,0.8)", fontWeight:400 }}>{m.name}</span>
                  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                    <span style={{ fontFamily:T.ui, fontSize:7, padding:"2px 6px", borderRadius:4, background:"rgba(255,255,255,0.03)", color:"rgba(242,232,214,0.35)", letterSpacing:"0.3px" }}>CR {m.cr}</span>
                    <button onClick={e => { e.stopPropagation(); addMonsterToMap(m); }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(94,224,154,0.12)"}
                      onMouseLeave={e => e.currentTarget.style.background="rgba(94,224,154,0.06)"}
                      style={{ padding:"3px 8px", background:"rgba(94,224,154,0.06)", border:"1px solid rgba(94,224,154,0.15)", borderRadius:4, cursor:"pointer", color:"#5ee09a", fontFamily:T.ui, fontSize:7, letterSpacing:"0.5px", transition:"background 0.12s" }}>+ Add</button>
                  </div>
                </div>
                <div style={{ fontSize:9, fontFamily:T.ui, color:"rgba(242,232,214,0.25)", marginTop:3, display:"flex", gap:6 }}>
                  <span style={{ textTransform:"capitalize" }}>{m.size} {m.type}</span>
                  <span>AC {m.ac}</span>
                  <span>HP {m.hp}</span>
                </div>
                {/* Expanded monster details */}
                {selectedMonster?.name === m.name && (
                  <div style={{ marginTop:8, padding:"8px", background:subtleBg2, borderRadius:"4px", fontSize:9, fontFamily:T.body, color:T.textMuted }}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:2, marginBottom:6, textAlign:"center" }}>
                      {["STR","DEX","CON","INT","WIS","CHA"].map(ab => (
                        <div key={ab}>
                          <div style={{ fontFamily:T.ui, fontSize:6, color:T.textFaint, letterSpacing:"0.5px" }}>{ab}</div>
                          <div style={{ fontSize:11, fontWeight:600, color:T.text }}>{m[ab.toLowerCase()]}</div>
                          <div style={{ fontSize:7, color:T.textFaint }}>({Math.floor((m[ab.toLowerCase()]-10)/2) >= 0 ? "+" : ""}{Math.floor((m[ab.toLowerCase()]-10)/2)})</div>
                        </div>
                      ))}
                    </div>
                    {m.speed && <div style={{ marginBottom:3 }}><strong>Speed:</strong> {m.speed}</div>}
                    {m.senses && <div style={{ marginBottom:3 }}><strong>Senses:</strong> {m.senses}</div>}
                    {m.damageResistances && <div style={{ marginBottom:3 }}><strong>Resistances:</strong> {m.damageResistances}</div>}
                    {m.damageImmunities && <div style={{ marginBottom:3 }}><strong>Immunities:</strong> {m.damageImmunities}</div>}
                    {m.conditionImmunities && <div style={{ marginBottom:3 }}><strong>Cond. Immun.:</strong> {m.conditionImmunities}</div>}
                    {m.traits && m.traits.length > 0 && (
                      <div style={{ marginTop:4, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:4 }}>
                        <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", marginBottom:3 }}>Traits</div>
                        {m.traits.map((tr,i) => <div key={i} style={{ marginBottom:2 }}><strong>{tr.name}:</strong> {tr.desc.slice(0, 120)}{tr.desc.length > 120 ? "..." : ""}</div>)}
                      </div>
                    )}
                    {m.actions && m.actions.length > 0 && (
                      <div style={{ marginTop:4, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:4 }}>
                        <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", marginBottom:3 }}>Actions</div>
                        {m.actions.map((a,i) => <div key={i} style={{ marginBottom:2 }}><strong>{a.name}:</strong> {a.desc.slice(0, 100)}{a.desc.length > 100 ? "..." : ""}</div>)}
                      </div>
                    )}
                    {m.legendaryActions && m.legendaryActions.length > 0 && (
                      <div style={{ marginTop:4, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:4 }}>
                        <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"1px", color:"#ffd54f", textTransform:"uppercase", marginBottom:3 }}>Legendary Actions</div>
                        {m.legendaryActions.map((a,i) => <div key={i} style={{ marginBottom:2 }}><strong>{a.name}:</strong> {a.desc.slice(0, 100)}{a.desc.length > 100 ? "..." : ""}</div>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRACKER TAB */}
      {visibleCombatTab === "tracker" && (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {!combatLive ? (
            <div style={{ textAlign:"center", padding:"28px 0" }}>
              <Swords size={28} color={cssVar("--text-faint")} style={{ marginBottom:10 }} />
              <p style={{ fontFamily:T.body, fontSize:13, color:T.textMuted, fontStyle:"italic", fontWeight:300, marginBottom:12 }}>
                {tokens.length === 0 ? "Place tokens on the map first" : tokens.length + " token" + (tokens.length!==1?"s":"") + " ready"}
              </p>
              {tokens.length > 0 && (
                <div style={{ fontFamily:T.body, fontSize:10, color:T.textFaint, marginBottom:12 }}>
                  Right-click a token to roll initiative and launch its actions, or start all placed tokens together.
                </div>
              )}
              <CrimsonBtn onClick={startCombat} disabled={tokens.length === 0}><Swords size={13}/> Start Encounter</CrimsonBtn>
            </div>
          ) : (
            <React.Fragment>
              {(combatLog[0] || playModeResolution) && (
                <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, background:"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))", padding:"10px 11px", marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <span style={{ fontFamily:T.ui, fontSize:8, color:"#58aaff", letterSpacing:"1px", textTransform:"uppercase" }}>Latest Event</span>
                    <span style={{ fontFamily:T.ui, fontSize:7, color:T.textFaint, letterSpacing:"0.8px", textTransform:"uppercase" }}>
                      Round {round}
                    </span>
                  </div>
                  <div style={{ marginTop:6, fontFamily:T.body, fontSize:11, color:T.text, lineHeight:1.4 }}>
                    {summarizeCombatEvent(combatLog[0] || null)}
                  </div>
                  {(playModeResolution?.lines?.length || getCombatEntryDetails(combatLog[0])) && (
                    <div style={{ marginTop:5, fontFamily:T.body, fontSize:9, color:T.textMuted, lineHeight:1.45 }}>
                      {playModeResolution?.lines?.length
                        ? playModeResolution.lines.slice(0, 2).join(" | ")
                        : getCombatEntryDetails(combatLog[0])}
                    </div>
                  )}
                  {activeCombatantToken && getMergedConditionsForToken(activeCombatantToken).length > 0 && (
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:8 }}>
                      {getMergedConditionsForToken(activeCombatantToken).slice(0, 5).map((cond, ci) => (
                        <span key={"rail-cond-" + cond + "-" + ci}
                          style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"0.8px", textTransform:"uppercase", padding:"2px 6px", borderRadius:"999px", background:"rgba(232,148,10,0.08)", border:"1px solid rgba(232,148,10,0.18)", color:"#ffd54f" }}>
                          {cond}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {combatants
                  .filter((c) => {
                    if (viewRole !== "player") return true;
                    const rowToken = tokens.find(t => t.id === c.mapTokenId);
                    return !rowToken?.hidden;
                  })
                  .map((c) => {
                  const isCurrent = c.mapTokenId === activeCombatantId;
                  const linkedToken = tokens.find(t => t.id === c.mapTokenId);
                  const deathState = linkedToken ? getDeathSaveState(linkedToken) : { successes:0, failures:0, stable:false, dead:c.hp <= 0 };
                  const isDefeated = deathState.dead || ((c.hp || 0) <= 0 && (!linkedToken || linkedToken.tokenType !== "pc"));
                  const isStableDown = linkedToken?.tokenType === "pc" && (linkedToken.hp || 0) <= 0 && deathState.stable && !deathState.dead;
                  const isDying = linkedToken?.tokenType === "pc" && (linkedToken.hp || 0) <= 0 && !deathState.dead && !deathState.stable;
                  const hpPct = c.maxHp ? Math.round(c.hp / c.maxHp * 100) : 0;
                  const conds = [...new Set([...(conditions[c.id] || []), ...(linkedToken ? (tokenConditions[linkedToken.id] || []) : [])])];
                  const monsterData = linkedToken?.monsterData;
                  const hostileTargets = linkedToken ? getHostileTargets(linkedToken) : [];
                  const focusTarget = linkedToken ? getFocusedCombatTarget(linkedToken) : null;
                  const focusDist = (linkedToken && focusTarget) ? distBetween(linkedToken, focusTarget) : null;
                  const rowOwner = linkedToken
                    ? (getPartyProfile(linkedToken)?.player || linkedToken.player || (linkedToken.tokenType === "pc" ? "Player" : "DM"))
                    : "DM";
                  const rowController = linkedToken ? canControlTokenForViewer(linkedToken) : false;
                  const rowStatus = isDefeated
                    ? "Defeated"
                    : isStableDown
                      ? "Stable at 0 HP"
                      : isDying
                        ? ("Death Saves " + deathState.successes + "S/" + deathState.failures + "F")
                        : isCurrent
                      ? (rowController ? "Click row or right-click token to act" : "Waiting for " + rowOwner)
                      : (monsterData?.legendaryActions?.length && viewRole === "dm"
                        ? "Legendary " + getLegendaryActionRemaining(linkedToken) + "/" + getLegendaryActionMax(linkedToken) + " | Lair " + (Number(linkedToken?.lairActionRoundUsed || 0) === round ? "spent" : (canUseLairSurgeForToken(linkedToken) ? "ready" : "closed"))
                        : "Queued");
                  return (
                    <div key={c.id}
                      onClick={() => {
                        setSelectedTokenId(c.mapTokenId);
                        if (linkedToken && canUseTurnPopupForToken(linkedToken)) openTurnPopupForToken(linkedToken);
                      }}
                      style={{
                        padding: isCurrent ? "10px 10px 8px" : "7px 10px",
                        background: isCurrent ? "var(--crimson-soft)" : isDefeated ? "rgba(0,0,0,0.1)" : "transparent",
                        borderRadius:"6px",
                        borderLeft: isCurrent ? "3px solid var(--crimson)" : "3px solid transparent",
                        opacity: isDefeated ? 0.35 : 1, transition:"all 0.15s", cursor:"pointer",
                      }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ fontSize:10, fontFamily:T.ui, fontWeight:600, color: isCurrent ? cssVar("--crimson") : T.textFaint, minWidth:18, textAlign:"center" }}>{c.init}</span>
                        <span style={{ width:6, height:6, borderRadius:"50%", flexShrink:0, background: c.type==="pc" ? "#5ee09a" : c.type==="npc" ? "#58aaff" : cssVar("--crimson") }} />
                        <span style={{ flex:1, fontSize: isCurrent ? 12 : 11, fontFamily:T.body, fontWeight: isCurrent ? 500 : 400, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</span>
                        <span style={{ fontFamily:T.ui, fontSize:7, color:T.textFaint, letterSpacing:"0.5px", padding:"1px 4px", borderRadius:"2px", background:"var(--bg-input)" }}>AC{c.ac}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:5, paddingLeft:24 }}>
                        <div style={{ flex:1, height:6, background:"var(--bg-input)", borderRadius:"999px", overflow:"hidden" }}>
                          <div style={{ width: hpPct + "%", height:"100%", background:getHpColor(c.hp, c.maxHp), transition:"width 0.2s", borderRadius:"3px" }} />
                        </div>
                        <span style={{ fontSize:8, fontFamily:T.body, minWidth:52, textAlign:"right", color: isCurrent ? T.text : T.textMuted }}>
                          {viewRole === "player" && c.type !== "pc" && playModePresentation === "simple" ? hpStateLabel(c.hp, c.maxHp) : (c.hp + "/" + c.maxHp)}
                        </span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginTop:5, paddingLeft:24, alignItems:"center" }}>
                        <span style={{ fontFamily:T.ui, fontSize:7, color:isCurrent ? "#ffd54f" : T.textFaint, letterSpacing:"0.8px", textTransform:"uppercase" }}>{rowStatus}</span>
                        <span style={{ fontFamily:T.ui, fontSize:7, color:T.textFaint, letterSpacing:"0.8px", textTransform:"uppercase" }}>{c.type === "pc" ? rowOwner : c.type}</span>
                      </div>
                      <div style={{ display:"flex", gap:2, flexWrap:"wrap", marginTop:5, paddingLeft:24, alignItems:"center" }}>
                        {isDying && (
                          <span style={{ display:"inline-flex", alignItems:"center", gap:1, background:"rgba(255,213,79,0.08)", border:"1px solid rgba(255,213,79,0.18)", padding:"1px 5px", borderRadius:"999px", fontSize:6, fontFamily:T.ui, letterSpacing:"0.3px", color:"#ffd54f", textTransform:"uppercase" }}>
                            {deathState.successes}S / {deathState.failures}F
                          </span>
                        )}
                        {monsterData?.legendaryActions?.length > 0 && viewRole === "dm" && !isDefeated && (
                          <span style={{ display:"inline-flex", alignItems:"center", gap:1, background:"rgba(255,213,79,0.05)", border:"1px solid rgba(255,213,79,0.18)", padding:"1px 5px", borderRadius:"999px", fontSize:6, fontFamily:T.ui, letterSpacing:"0.3px", color:"#ffd54f", textTransform:"uppercase" }}>
                            LA {getLegendaryActionRemaining(linkedToken)}/{getLegendaryActionMax(linkedToken)}{Number(linkedToken?.lairActionRoundUsed || 0) === round ? " | Lair spent" : (canUseLairSurgeForToken(linkedToken) ? " | Lair ready" : " | Lair closed")}
                          </span>
                        )}
                        {conds.slice(0, 4).map((cond,ci) => (
                          <span key={ci}
                            style={{ display:"inline-flex", alignItems:"center", gap:1, background:"var(--crimson-soft)", border:"1px solid var(--crimson-border)", padding:"1px 5px", borderRadius:"999px", fontSize:6, fontFamily:T.ui, letterSpacing:"0.3px", color:cssVar("--crimson"), textTransform:"uppercase" }}>
                            {cond}
                          </span>
                        ))}
                        {conds.length > 4 && (
                          <span style={{ fontFamily:T.ui, fontSize:7, color:T.textFaint, letterSpacing:"0.6px" }}>+{conds.length - 4}</span>
                        )}
                      </div>
                      {/* Monster Actions — show for current combatant with monsterData */}
                      {isCurrent && monsterData && monsterData.actions && (
                        <div style={{ marginTop:6, paddingLeft:24 }}>
                          {hostileTargets.length > 0 && (
                            <div style={{ marginBottom:6, padding:"6px 7px", border:"1px solid rgba(255,213,79,0.22)", borderRadius:"4px", background:"rgba(255,213,79,0.05)" }}>
                              <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"1px", color:"#ffd54f", textTransform:"uppercase", marginBottom:4 }}>Focus Target</div>
                              <select value={focusTarget?.id || ""} onChange={e => { e.stopPropagation(); setFocusedCombatTarget(c.mapTokenId, e.target.value); }} onClick={e => e.stopPropagation()}
                                style={{ width:"100%", padding:"4px 6px", fontSize:8, background:subtleBg2, border:"1px solid " + subtleBorder, color:T.text, borderRadius:"4px" }}>
                                {hostileTargets.map((targetToken) => (
                                  <option key={"m-target-" + c.id + "-" + targetToken.id} value={targetToken.id}>
                                    {targetToken.name} - {hpStateLabel(targetToken.hp, targetToken.maxHp)} - {distBetween(linkedToken, targetToken)} ft
                                  </option>
                                ))}
                              </select>
                              {focusTarget && <div style={{ fontSize:8, color:T.textMuted, marginTop:4 }}>Selected: <span style={{ color:T.text }}>{focusTarget.name}</span>{focusDist != null ? " - " + focusDist + " ft" : ""}</div>}
                            </div>
                          )}
                          <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", marginBottom:3 }}>Actions</div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                            {monsterData.actions.map((action, ai) => (
                              <button key={ai}
                                onClick={e => {
                                  e.stopPropagation();
                                  const targetToken = focusTarget || (linkedToken ? getFocusedCombatTarget(linkedToken) : null);
                                  if (targetToken) {
                                    executeCombatAction(c.mapTokenId, targetToken.id, ai);
                                  } else {
                                    addCombatLogEntry({ type: "system", text: "No valid focus target found for " + action.name });
                                  }
                                }}
                                onMouseEnter={e => e.currentTarget.style.background="rgba(212,67,58,0.15)"}
                                onMouseLeave={e => e.currentTarget.style.background="rgba(212,67,58,0.06)"}
                                style={{ padding:"3px 8px", background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.2)", borderRadius:"3px", cursor:"pointer", color:T.text, fontFamily:T.ui, fontSize:8, letterSpacing:"0.3px", transition:"all 0.12s" }}>
                                {action.name}
                              </button>
                            ))}
                          </div>
                          {monsterData.legendaryActions && monsterData.legendaryActions.length > 0 && (
                            <React.Fragment>
                              <div style={{ fontFamily:T.ui, fontSize:7, letterSpacing:"1px", color:"#ffd54f", textTransform:"uppercase", marginBottom:3, marginTop:5 }}>Legendary</div>
                              <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                                {monsterData.legendaryActions.map((action, ai) => (
                                  <button key={ai}
                                    onClick={e => {
                                      e.stopPropagation();
                                      const targetToken = focusTarget || (linkedToken ? getFocusedCombatTarget(linkedToken) : null);
                                      if (targetToken) {
                                        executeCombatAction(c.mapTokenId, targetToken.id, { ...action, _isLegendary: true });
                                      } else {
                                        addCombatLogEntry({ type: "system", text: "No valid focus target found for " + action.name });
                                      }
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,213,79,0.12)"}
                                    onMouseLeave={e => e.currentTarget.style.background="rgba(255,213,79,0.04)"}
                                    style={{ padding:"3px 8px", background:"rgba(255,213,79,0.04)", border:"1px solid rgba(255,213,79,0.2)", borderRadius:"3px", cursor:"pointer", color:"#ffd54f", fontFamily:T.ui, fontSize:8, letterSpacing:"0.3px", transition:"all 0.12s" }}>
                                    {action.name}
                                  </button>
                                ))}
                              </div>
                            </React.Fragment>
                          )}
                        </div>
                      )}
                      {false && isCurrent && linkedToken?.tokenType === "pc" && (() => {
                        const tk = linkedToken;
                        const ts = turnStateByToken[tk.id] || defaultTurnState(tk);
                        const profile = getCombatProfile(tk);
                        const cards = getLegalActionCards(tk);
                        const legalCards = cards.filter(x => !x.disabledReason);
                        const suggested = [...legalCards].sort((a, b) => {
                          const score = (card) => {
                            if (card.panel === "Attack") return 90;
                            if (card.panel === "Spell" && /heal|restore/i.test(card.effect)) return 80;
                            if (card.panel === "Spell") return 75;
                            if (card.panel === "Class Feature") return 65;
                            return 40;
                          };
                          return score(b) - score(a);
                        }).slice(0, 4);
                        const byPanel = {
                          Attack: cards.filter(x => x.panel === "Attack"),
                          Spell: cards.filter(x => x.panel === "Spell"),
                          "Class Feature": cards.filter(x => x.panel === "Class Feature"),
                          Other: cards.filter(x => x.panel === "Other"),
                        };
                        const condList = tokenConditions[tk.id] || [];
                        const nearest = focusTarget;
                        const profileWeapons = getWeaponOptionsForProfile(profile);
                        const selectedWeapon = profileWeapons.includes(pcWeaponPick) ? pcWeaponPick : (profileWeapons[0] || pcWeaponPick);
                        return (
                          <div style={{ marginTop:8, paddingLeft:24, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:8 }}>
                            <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:"#5ee09a", textTransform:"uppercase", marginBottom:6 }}>Your Turn</div>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:8 }}>
                              <div style={{ fontSize:9, color:T.textMuted }}>Movement: <span style={{ color:T.text }}>{ts.movementRemaining} ft remaining</span></div>
                              <div style={{ fontSize:9, color:T.textMuted }}>Action: <span style={{ color:T.text }}>{ts.actionUsed ? "used" : "not used"}</span></div>
                              <div style={{ fontSize:9, color:T.textMuted }}>Bonus Action: <span style={{ color:T.text }}>{ts.bonusActionUsed ? "used" : "not used"}</span></div>
                              <div style={{ fontSize:9, color:T.textMuted }}>Reaction: <span style={{ color:T.text }}>{ts.reactionSpent ? "spent" : "available"}</span></div>
                              <div style={{ fontSize:9, color:T.textMuted }}>Free Object: <span style={{ color:T.text }}>{ts.freeObjectUsed ? "used" : "available"}</span></div>
                              <div style={{ fontSize:9, color:T.textMuted }}>Concentration: <span style={{ color:T.text }}>{profile.concentrationSpell || (condList.includes("Concentrating") ? "active" : "none")}</span></div>
                            </div>

                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                              <div style={{ fontSize:8, fontFamily:T.ui, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase" }}>Presentation</div>
                              <div style={{ display:"flex", gap:4 }}>
                                <button onClick={(e) => { e.stopPropagation(); setPlayModePresentation("simple"); }} style={{ padding:"2px 7px", borderRadius:"3px", border:"1px solid " + (playModePresentation==="simple" ? "rgba(212,67,58,0.35)" : T.border), background: playModePresentation==="simple" ? "rgba(212,67,58,0.12)" : "transparent", color: playModePresentation==="simple" ? "var(--crimson)" : T.textMuted, fontSize:8, fontFamily:T.ui, cursor:"pointer" }}>Simple</button>
                                <button onClick={(e) => { e.stopPropagation(); setPlayModePresentation("advanced"); }} style={{ padding:"2px 7px", borderRadius:"3px", border:"1px solid " + (playModePresentation==="advanced" ? "rgba(212,67,58,0.35)" : T.border), background: playModePresentation==="advanced" ? "rgba(212,67,58,0.12)" : "transparent", color: playModePresentation==="advanced" ? "var(--crimson)" : T.textMuted, fontSize:8, fontFamily:T.ui, cursor:"pointer" }}>Advanced</button>
                              </div>
                            </div>

                            {hostileTargets.length > 0 && (
                              <div style={{ marginBottom:8 }}>
                                <div style={{ fontSize:8, fontFamily:T.ui, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>Focus Target</div>
                                <select value={focusTarget?.id || ""} onChange={(e) => { e.stopPropagation(); setFocusedCombatTarget(tk.id, e.target.value); }} onClick={(e) => e.stopPropagation()}
                                  style={{ width:"100%", padding:"5px 7px", fontSize:9, background:"var(--bg-input)", border:"1px solid rgba(255,213,79,0.25)", color:T.text, borderRadius:"4px" }}>
                                  {hostileTargets.map((targetToken) => (
                                    <option key={"pc-target-" + tk.id + "-" + targetToken.id} value={targetToken.id}>
                                      {targetToken.name} - {hpStateLabel(targetToken.hp, targetToken.maxHp)} - {distBetween(tk, targetToken)} ft
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {nearest && (
                              <div style={{ marginBottom:8, padding:"5px 7px", border:"1px solid " + subtleBorder, borderRadius:"4px", background:subtleBg, fontSize:9, color:T.textMuted }}>
                                {(() => {
                                  const d = distBetween(tk, nearest);
                                  const threat = d <= 5 ? "High" : d <= 20 ? "Medium" : "Low";
                                  const concentrating = nearest.activeConcentrationSpell || ((tokenConditions[nearest.id] || []).includes("Concentrating") ? "Concentrating" : null);
                                  return (
                                    <span>
                                      Target focus: <span style={{ color:T.text }}>{nearest.name}</span> · {hpStateLabel(nearest.hp, nearest.maxHp)} · {d} ft · {(nearest.size || "medium")} · Threat: {threat}{concentrating ? (" · " + concentrating) : ""}
                                    </span>
                                  );
                                })()}
                              </div>
                            )}
                            <div style={{ marginBottom:8 }}>
                              <select value={selectedWeapon} onChange={(e) => { e.stopPropagation(); setPcWeaponPick(e.target.value); }} onClick={(e) => e.stopPropagation()}
                                style={{ width:"100%", padding:"5px 7px", fontSize:9, background:"var(--bg-input)", border:"1px solid var(--border)", color:T.text, borderRadius:"4px" }}>
                                {profileWeapons.map(w => <option key={"pmw-"+w} value={w}>{w}</option>)}
                              </select>
                            </div>

                            <div style={{ display:"grid", gap:6 }}>
                              {Object.keys(byPanel).map((panelName) => (
                                <div key={panelName} style={{ border:"1px solid var(--border-mid)", borderRadius:"6px", padding:"6px", background:"var(--bg-hover-subtle)" }}>
                                  <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", marginBottom:5 }}>{panelName}</div>
                                  {byPanel[panelName].length === 0 && <div style={{ fontSize:9, color:T.textFaint, fontStyle:"italic" }}>No options</div>}
                                  {byPanel[panelName].map((card) => (
                                    <button key={card.id}
                                      onClick={(e) => { e.stopPropagation(); if (card.resolver === "weapon") { setActiveWeapon({ card, actorToken: tk }); weaponTargetRef.current = null; } else { resolvePlayModeCard(card, tk); } }}
                                      disabled={!!card.disabledReason}
                                      style={{ width:"100%", textAlign:"left", marginBottom:4, padding:"7px", borderRadius:"5px", border:"1px solid " + (card.disabledReason ? "rgba(255,80,80,0.2)" : "var(--border)"), background: card.disabledReason ? "rgba(120,40,40,0.10)" : "var(--action-card-bg)", color: card.disabledReason ? "rgba(255,200,200,0.7)" : T.text, cursor: card.disabledReason ? "not-allowed" : "pointer" }}>
                                      <div style={{ fontSize:11, fontFamily:T.ui, color: card.disabledReason ? "rgba(255,200,200,0.8)" : T.text }}>{card.name}</div>
                                      {playModePresentation === "simple" ? (
                                        <div style={{ fontSize:9, color:T.textMuted, marginTop:2 }}>{card.outcome}</div>
                                      ) : (
                                        <div style={{ fontSize:8, color:T.textMuted, marginTop:2, lineHeight:1.45 }}>
                                          <div>Type: {actionTypeLabel(card.type)}</div>
                                          <div>Range/Target: {card.range}</div>
                                          <div>Roll: {card.roll}</div>
                                          <div>Effect: {card.effect}</div>
                                          <div>Cost: {card.cost}</div>
                                        </div>
                                      )}
                                      {card.disabledReason && <div style={{ fontSize:8, color:"#ff9e9e", marginTop:3 }}>{card.disabledReason}</div>}
                                      {!card.disabledReason && card.concentrationWarn && <div style={{ fontSize:8, color:"#ffd27a", marginTop:3 }}>{card.concentrationWarn}</div>}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>

                            {suggested.length > 0 && (
                              <div style={{ marginTop:8, border:"1px solid rgba(88,170,255,0.25)", borderRadius:"6px", padding:"7px", background:"rgba(88,170,255,0.08)" }}>
                                <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:"#58aaff", textTransform:"uppercase", marginBottom:4 }}>Suggested Options</div>
                                {suggested.map((s) => (
                                  <div key={"s-" + s.id} style={{ fontSize:9, color:T.text, marginBottom:2 }}>{s.panel === "Spell" && /heal|restore/i.test(s.effect) ? "Best support: " : s.panel === "Attack" ? "Best damage: " : "Class combo: "}{s.name}{nearest ? (" on " + nearest.name) : ""}</div>
                                ))}
                                {nearest && <div style={{ fontSize:9, color:T.textMuted, marginTop:4 }}>Good positioning: Move to stay outside opportunity range if you are below half HP.</div>}
                              </div>
                            )}

                            {condList.length > 0 && (
                              <div style={{ marginTop:8, border:"1px solid " + subtleBorder, borderRadius:"6px", padding:"6px", background:subtleBg }}>
                                <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", marginBottom:4 }}>Conditions</div>
                                {condList.map((cn) => (
                                  <div key={"cond-help-"+cn} style={{ fontSize:9, color:T.textMuted, marginBottom:2 }}>
                                    <span style={{ color:T.text }}>{cn}</span>: {CONDITION_HELP[cn] || "See full rules for exact modifiers."}
                                  </div>
                                ))}
                              </div>
                            )}

                            {playModeResolution && (
                              <div style={{ marginTop:8, border:"1px solid rgba(94,224,154,0.2)", borderRadius:"6px", padding:"8px", background:"rgba(46,139,87,0.08)" }}>
                                <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:"#5ee09a", textTransform:"uppercase", marginBottom:4 }}>Resolution: {playModeResolution.title}</div>
                                {playModeResolution.lines.map((ln, ix) => <div key={"res-"+ix} style={{ fontSize:9, color:T.textMuted, marginBottom:2 }}>{ln}</div>)}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          )}
        </div>
      )}

      {/* LOG TAB */}
      {visibleCombatTab === "log" && (
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {combatLog.length === 0 ? (
            <div style={{ textAlign:"center", padding:"28px 0", color:T.textFaint, fontFamily:T.body, fontStyle:"italic", fontSize:11 }}>No combat actions yet</div>
          ) : (
            <React.Fragment>
              <button onClick={() => setCombatLog([])}
                style={{ alignSelf:"flex-end", padding:"3px 8px", background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.15)", borderRadius:"3px", cursor:"pointer", color:T.textFaint, fontFamily:T.ui, fontSize:7, letterSpacing:"0.5px", marginBottom:4 }}>Clear Log</button>
              {combatLog.map(entry => (
                <div key={entry.id} onClick={() => {
                  const attackerTk = entry.attacker ? tokens.find(t => t.name === entry.attacker) : null;
                  const targetTk = entry.target ? tokens.find(t => t.name === entry.target) : null;
                  if (targetTk) { setSelectedTokenId(targetTk.id); setHoveredTokenId(targetTk.id); setTimeout(() => setHoveredTokenId(null), 1500); }
                  else if (attackerTk) { setSelectedTokenId(attackerTk.id); }
                }} style={{ padding:"6px 8px", borderRadius:"4px", background: entry.type === "attack" ? "rgba(212,67,58,0.04)" : entry.type === "miss" ? "rgba(136,136,136,0.04)" : entry.type === "save" ? "rgba(88,170,255,0.04)" : "rgba(255,255,255,0.02)", borderLeft: "2px solid " + (entry.type === "attack" ? (entry.isCrit ? "#ffd700" : "var(--crimson)") : entry.type === "miss" ? "#666" : entry.type === "save" ? (entry.success ? "#5ee09a" : "#58aaff") : T.textFaint), fontSize:9, fontFamily:T.body, color:T.textMuted, cursor: (entry.attacker || entry.target) ? "pointer" : "default", transition: "all 0.15s ease" }}
                  onMouseEnter={e => { if (entry.attacker || entry.target) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = entry.type === "attack" ? "rgba(212,67,58,0.04)" : entry.type === "miss" ? "rgba(136,136,136,0.04)" : entry.type === "save" ? "rgba(88,170,255,0.04)" : "rgba(255,255,255,0.02)"; }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontWeight:500, color:T.text, whiteSpace: entry.type === "system" ? "pre-line" : "normal" }}>
                      {entry.type === "attack" && (entry.isCrit ? "💥 CRITICAL! " : "⚔️ ")}
                      {entry.type === "miss" && "💨 "}
                      {entry.type === "save" && "🛡️ "}
                      {entry.type === "system" && "📋 "}
                      {entry.text || (entry.type === "attack" ? `${entry.attacker} → ${entry.target}` : entry.type === "miss" ? `${entry.attacker} misses ${entry.target}` : entry.type === "save" ? `${entry.target} ${entry.success ? "saves" : "fails"} vs ${entry.action}` : "")}
                    </span>
                    <span style={{ fontSize:7, color:T.textFaint }}>{entry.time}</span>
                  </div>
                  {entry.action && <div style={{ fontSize:8, color:T.textFaint, marginTop:1 }}>{entry.action}{entry.damage ? ` — ${entry.damage} dmg` : ""}{entry.roll ? ` (${entry.roll.chosen}+${entry.roll.modifier}=${entry.roll.total} vs AC)` : ""}</div>}
                  {entry.dc && <div style={{ fontSize:8, color:T.textFaint, marginTop:1 }}>DC {entry.dc} {entry.ability} save{entry.damage ? ` — ${entry.damage} dmg` : ""}</div>}
                  {entry.conditions && entry.conditions.length > 0 && <div style={{ fontSize:8, color:"#e040fb", marginTop:1 }}>Conditions: {entry.conditions.join(", ")}</div>}
                </div>
              ))}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  </div>
          ) : selectedToken ? (
            <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
              {/* Token Header — always visible */}
              <div style={{ padding:"16px 18px", borderBottom:"1px solid " + T.border, flexShrink:0, background:"linear-gradient(180deg, rgba(212,67,58,0.03) 0%, transparent 100%)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    {selectedToken.imageSrc ? (
                      <div style={{ position:"relative", width:56, height:56, borderRadius:"50%", overflow:"hidden", border:"3px solid rgba(255,220,30,0.6)", flexShrink:0, cursor:"pointer", boxShadow:"0 0 14px rgba(255,220,30,0.18), inset 0 0 20px rgba(0,0,0,0.15)" }}
                        onClick={() => tokenImgRef.current?.click()}>
                        <img src={selectedToken.imageSrc} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      </div>
                    ) : (
                      <input type="color" value={selectedToken.color} onChange={e => updateToken(selectedToken.id, { color: e.target.value })}
                        style={{ width:48, height:48, borderRadius:"50%", border:"3px solid rgba(255,220,30,0.6)", padding:0, cursor:"pointer", background:"none", flexShrink:0 }} />
                    )}
                    <div>
                      <div style={{ fontSize:20, fontFamily:T.ui, color:T.text, fontWeight:600, lineHeight:"1.2", letterSpacing:"0.3px" }}>{selectedToken.name}</div>
                      <div style={{ fontSize:11, fontFamily:T.ui, color:T.textFaint, marginTop:4, display:"flex", gap:6, alignItems:"center" }}>
                        <span style={{ textTransform:"capitalize" }}>{selectedToken.size || "medium"}</span>
                        <span style={{ width:3, height:3, borderRadius:"50%", background:T.textFaint, opacity:0.5 }} />
                        {selectedToken.ac && <React.Fragment><span>AC {selectedToken.ac}</span><span style={{ width:3, height:3, borderRadius:"50%", background:T.textFaint, opacity:0.5 }} /></React.Fragment>}
                        <span>{selectedToken.speed || 30}ft</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTokenId(null)}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}
                    style={{ background:"transparent", border:"none", cursor:"pointer", color:T.textFaint, padding:6, borderRadius:"6px", transition:"all 0.15s", marginTop:2 }}><X size={16}/></button>
                </div>

                {/* HP bar — always visible if token has HP */}
                {selectedToken.hp != null && selectedToken.maxHp && (() => {
                  const hpPct = Math.round(selectedToken.hp / selectedToken.maxHp * 100);
                  const hpCol = getHpColor(selectedToken.hp, selectedToken.maxHp);
                  return (
                  <div style={{ background:subtleBg, borderRadius:"10px", padding:"12px 14px", border:"1px solid " + T.border }}>
                    <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                        <span style={{ fontSize:30, fontFamily:T.body, fontWeight:400, color:hpCol, textShadow:"0 0 20px " + hpCol + "33", lineHeight:1 }}>{selectedToken.hp}</span>
                        <span style={{ fontSize:14, color:T.textFaint, fontFamily:T.body }}>/ {selectedToken.maxHp}</span>
                      </div>
                      <span style={{ fontSize:10, fontFamily:T.ui, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase" }}>HP</span>
                    </div>
                    <div style={{ height:6, background:lm("rgba(255,255,255,0.04)", "rgba(0,0,0,0.08)"), borderRadius:"3px", overflow:"hidden", marginBottom:10, boxShadow:"inset 0 1px 2px rgba(0,0,0,0.2)" }}>
                      <div style={{ width:`${hpPct}%`, height:"100%", background:`linear-gradient(90deg, ${hpCol} 0%, ${hpCol}bb 100%)`, transition:"width 0.3s ease", boxShadow:"0 0 8px " + hpCol + "44", borderRadius:"3px" }} />
                    </div>
                    <div style={{ display:"flex", gap:3 }}>
                      {[{d:-10,c:"rgba(212,67,58,0.12)",bc:"rgba(212,67,58,0.25)",tc:"#f06858"},{d:-5,c:"rgba(212,67,58,0.08)",bc:"rgba(212,67,58,0.18)",tc:"#f06858"},{d:-1,c:"rgba(212,67,58,0.05)",bc:"rgba(212,67,58,0.12)",tc:"#f06858"},{d:1,c:"rgba(46,139,87,0.05)",bc:"rgba(46,139,87,0.12)",tc:"#5ee09a"},{d:5,c:"rgba(46,139,87,0.08)",bc:"rgba(46,139,87,0.18)",tc:"#5ee09a"},{d:10,c:"rgba(46,139,87,0.12)",bc:"rgba(46,139,87,0.25)",tc:"#5ee09a"}].map(btn => (
                        <button key={btn.d} onClick={() => adjustTokenHp(selectedToken.id, btn.d)}
                          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,6,0.35)"; e.currentTarget.style.filter="brightness(1.2)"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.filter="none"; }}
                          style={{ flex:1, padding:"5px 0", background:btn.c, border:"1px solid " + btn.bc, borderRadius:"5px", color:btn.tc, fontFamily:T.ui, fontSize:11, fontWeight:600, cursor:"pointer", transition:"all 0.15s ease" }}>
                          {btn.d > 0 ? "+" : ""}{btn.d}
                        </button>
                      ))}
                    </div>
                  </div>
                  );
                })()}

                {/* Quick Actions row */}
                <div style={{ display:"flex", gap:4, marginTop:12 }}>
                  {[
                    { label: movementMode ? "End Move" : "Move", icon: Compass, onClick: () => { if (selectedToken) { setMovementMode(!movementMode); if (!movementMode) { setMovementPath([]); setMovementOrigin({x:selectedToken.x,y:selectedToken.y}); } } }, active: movementMode },
                    { label: "Roll d20", icon: Dice6, onClick: () => rollAttack(selectedToken.id) },
                    { label: selectedToken.hidden ? "Show" : "Hide", icon: selectedToken.hidden ? Eye : EyeOff, onClick: () => updateToken(selectedToken.id, { hidden: !selectedToken.hidden }) },
                    { label: null, icon: Trash2, onClick: () => removeToken(selectedToken.id), danger: true },
                  ].map((act, i) => {
                    const Icon = act.icon;
                    return (
                      <button key={i} onClick={act.onClick}
                        onMouseEnter={e => { e.currentTarget.style.background = act.danger ? "rgba(212,67,58,0.12)" : act.active ? "rgba(212,67,58,0.18)" : "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = act.danger ? "rgba(212,67,58,0.35)" : "rgba(255,255,255,0.12)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = act.active ? "rgba(212,67,58,0.1)" : "rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = act.active ? "rgba(212,67,58,0.3)" : T.border; }}
                        style={{ flex: act.label ? 1 : "0 0 36px", padding:"7px 4px", background: act.active ? "rgba(212,67,58,0.1)" : "rgba(0,0,0,0.1)", border:"1px solid " + (act.active ? "rgba(212,67,58,0.3)" : T.border), borderRadius:"6px", color: act.danger ? "rgba(212,67,58,0.7)" : act.active ? "var(--crimson)" : T.textMuted, fontFamily:T.ui, fontSize:10, fontWeight:500, cursor:"pointer", transition:"all 0.15s ease", display:"flex", alignItems:"center", justifyContent:"center", gap:4, letterSpacing:"0.3px" }}>
                        <Icon size={12} /> {act.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Bar */}
              <div style={{ display:"flex", borderBottom:"1px solid " + T.border, flexShrink:0, background:"rgba(0,0,0,0.08)" }}>
                {[
                  { id:"stats", label:"Stats", icon: Shield },
                  { id:"spells", label:"Spells", icon: Wand2 },
                  { id:"config", label:"Config", icon: Settings },
                ].map(tab => {
                  const isActive = tokenPanelTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setTokenPanelTab(tab.id)}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background="transparent"; }}
                      style={{
                        flex:1, padding:"11px 0 9px", display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                        background: isActive ? "rgba(212,67,58,0.06)" : "transparent",
                        border:"none", borderBottom: isActive ? "2px solid var(--crimson)" : "2px solid transparent",
                        cursor:"pointer", transition:"all 0.2s",
                        fontFamily:T.ui, fontSize:10, letterSpacing:"1.2px", textTransform:"uppercase", fontWeight: isActive ? 600 : 400,
                        color: isActive ? "var(--crimson)" : T.textFaint,
                      }}>
                      <Icon size={12} strokeWidth={isActive ? 2.5 : 1.5} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div style={{ flex:1, overflowY:"auto", padding:16 }}>

                {/* STATS TAB — D&D Character Sheet */}
                {tokenPanelTab === "stats" && (() => {
                  const profile = getCombatProfile(selectedToken);
                  const toModVal = (score) => Math.floor(((score || 10) - 10) / 2);
                  const modString = (val) => val >= 0 ? "+" + val : val.toString();
                  const abilityMods = {
                    str: toModVal(profile.abilities.str),
                    dex: toModVal(profile.abilities.dex),
                    con: toModVal(profile.abilities.con),
                    int: toModVal(profile.abilities.int),
                    wis: toModVal(profile.abilities.wis),
                    cha: toModVal(profile.abilities.cha),
                  };
                  return (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    {/* Ability Scores Grid — 6 columns */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:6 }}>
                      {[
                        { key:"str", label:"STR", val:profile.abilities.str },
                        { key:"dex", label:"DEX", val:profile.abilities.dex },
                        { key:"con", label:"CON", val:profile.abilities.con },
                        { key:"int", label:"INT", val:profile.abilities.int },
                        { key:"wis", label:"WIS", val:profile.abilities.wis },
                        { key:"cha", label:"CHA", val:profile.abilities.cha },
                      ].map(ab => (
                        <div key={ab.key} style={{ background:"rgba(0,0,0,0.2)", border:"1px solid " + T.border, borderRadius:"6px", padding:"8px 6px", textAlign:"center" }}>
                          <div style={{ fontSize:20, fontFamily:T.body, color:T.text, fontWeight:600, lineHeight:1 }}>{ab.val}</div>
                          <div style={{ fontSize:8, fontFamily:T.ui, color:T.textFaint, letterSpacing:"0.6px", textTransform:"uppercase", marginTop:3, marginBottom:2, fontWeight:500 }}>{ab.label}</div>
                          <div style={{ fontSize:11, fontFamily:T.ui, color:"#ffd54f", fontWeight:600 }}>{modString(abilityMods[ab.key])}</div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Stats Row — PB, Init, PP, Save DC */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:6, padding:"8px", background:subtleBg2, borderRadius:"6px", border:"1px solid " + T.border }}>
                      {[
                        { label:"Prof", val:profile.proficiencyBonus, color:"#a78bfa" },
                        { label:"Init", val:modString(abilityMods.dex), color:"#5ee09a" },
                        { label:"PP", val:10 + abilityMods.wis + (profile.proficiencyBonus || 0), color:"#ffa726" },
                        { label:"Save DC", val:8 + profile.proficiencyBonus + (abilityMods.wis || 0), color:"#58aaff" },
                      ].map((stat, i) => (
                        <div key={i} style={{ textAlign:"center" }}>
                          <div style={{ fontSize:10, fontFamily:T.ui, color:T.textFaint, letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:2, fontWeight:500 }}>{stat.label}</div>
                          <div style={{ fontSize:13, fontFamily:T.body, color:stat.color, fontWeight:600 }}>{stat.val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Saving Throws */}
                    {profile.savingThrows && profile.savingThrows.length > 0 && (
                      <div>
                        <div style={{ fontSize:9, fontFamily:T.ui, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Proficient Saves</div>
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                          {["str","dex","con","int","wis","cha"].map(ab => {
                            const isProficient = profile.savingThrows.includes(ab);
                            return (
                              <span key={ab} style={{ padding:"4px 8px", background:isProficient ? "rgba(94,224,154,0.15)" : "rgba(0,0,0,0.2)", border:"1px solid " + (isProficient ? "rgba(94,224,154,0.3)" : T.border), borderRadius:"4px", fontSize:10, fontFamily:T.ui, color:isProficient ? "#5ee09a" : T.textFaint, fontWeight:isProficient ? 600 : 400, letterSpacing:"0.3px", textTransform:"uppercase" }}>
                                {ab.toUpperCase()}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Resistances & Immunities */}
                    {(profile.resistances && profile.resistances.length > 0) && (
                      <div>
                        <div style={{ fontSize:9, fontFamily:T.ui, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Resistances</div>
                        <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                          {profile.resistances.map((r, i) => (
                            <span key={i} style={{ padding:"3px 8px", background:"rgba(153,102,255,0.1)", border:"1px solid rgba(153,102,255,0.2)", borderRadius:"3px", fontSize:9, fontFamily:T.body, color:"#b19cd9", letterSpacing:"0.2px", textTransform:"capitalize" }}>{r}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Equipment/Weapons */}
                    {profile.equipment && profile.equipment.length > 0 && (
                      <div>
                        <div style={{ fontSize:9, fontFamily:T.ui, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Equipment</div>
                        <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                          {profile.equipment.slice(0, 6).map((w, i) => {
                            const name = typeof w === "string" ? w : (w?.name || "Unknown");
                            return (
                              <span key={i} style={{ padding:"4px 8px", background:"rgba(255,165,0,0.1)", border:"1px solid rgba(255,165,0,0.2)", borderRadius:"4px", fontSize:9, fontFamily:T.body, color:"#ffb84d", letterSpacing:"0.2px", textTransform:"capitalize" }}>{name}</span>
                            );
                          })}
                          {profile.equipment.length > 6 && <span style={{ fontSize:9, fontFamily:T.ui, color:T.textFaint }}>+{profile.equipment.length - 6} more</span>}
                        </div>
                      </div>
                    )}

                    {/* Conditions */}
                    <div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontFamily:T.ui, fontSize:9, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", fontWeight:500 }}>Active Conditions</span>
                        <span style={{ fontSize:8, fontFamily:T.ui, color:T.textFaint }}>{(tokenConditions[selectedToken.id] || []).length > 0 ? (tokenConditions[selectedToken.id] || []).length : "None"}</span>
                      </div>
                      <div style={{ display:"flex", gap:3, flexWrap:"wrap", minHeight:24 }}>
                        {(tokenConditions[selectedToken.id] || []).length === 0 && (
                          <span style={{ fontSize:10, fontFamily:T.body, color:T.textFaint, fontStyle:"italic" }}>No active conditions</span>
                        )}
                        {(tokenConditions[selectedToken.id] || []).map(cond => {
                          const dc = DND_CONDITIONS.find(d => d.name === cond);
                          return (
                            <span key={cond} onClick={() => removeTokenCondition(selectedToken.id, cond)}
                              onMouseEnter={e => { e.currentTarget.style.filter="brightness(1.2)"; e.currentTarget.style.transform="scale(1.02)"; }}
                              onMouseLeave={e => { e.currentTarget.style.filter="none"; e.currentTarget.style.transform="none"; }}
                              style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(0,0,0,0.2)", border:"1px solid " + (dc ? dc.color + "44" : T.border), padding:"3px 8px", borderRadius:"10px", fontSize:9, fontFamily:T.ui, letterSpacing:"0.2px", color: dc ? dc.color : T.textMuted, cursor:"pointer", transition:"all 0.15s" }}>
                              <span style={{ width:5, height:5, borderRadius:"50%", background: dc ? dc.color : "#aaa" }} />
                              {cond}
                            </span>
                          );
                        })}
                      </div>
                      <select onChange={e => { addTokenCondition(selectedToken.id, e.target.value); e.target.value = ""; }} value="" style={{ width:"100%", padding:"5px 8px", fontSize:10, fontFamily:T.ui, background:"rgba(0,0,0,0.2)", border:"1px solid " + T.border, color:T.textMuted, borderRadius:"4px", cursor:"pointer", marginTop:6 }}>
                        <option value="">+ Add Condition</option>
                        {DND_CONDITIONS.filter(dc => !(tokenConditions[selectedToken.id] || []).includes(dc.name)).map(dc => (
                          <option key={dc.name} value={dc.name}>{dc.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Spell Slots (if caster) */}
                    {Object.keys(profile.spellSlots || {}).length > 0 && (
                      <div>
                        <div style={{ fontSize:9, fontFamily:T.ui, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Spell Slots</div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(50px, 1fr))", gap:4 }}>
                          {Object.keys(profile.spellSlots).sort((a,b) => parseInt(a) - parseInt(b)).map(lv => {
                            const max = profile.spellSlots[lv];
                            const used = (profile.usedSlots || {})[lv] || 0;
                            const remaining = max - used;
                            return (
                              <div key={lv} style={{ padding:"4px 6px", background:"rgba(0,0,0,0.2)", border:"1px solid " + T.border, borderRadius:"4px", textAlign:"center" }}>
                                <div style={{ fontSize:8, fontFamily:T.ui, color:T.textFaint, letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:2 }}>{lv === 0 ? "Can" : "Lv " + lv}</div>
                                <div style={{ fontSize:12, fontFamily:T.body, color:remaining > 0 ? "#5ee09a" : "#f06858", fontWeight:600 }}>{remaining}</div>
                                <div style={{ fontSize:7, fontFamily:T.ui, color:T.textFaint }}>/{max}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* DM-Only Combat Settings */}
                    {viewRole === "dm" && (
                      <div style={{ padding:"8px", borderTop:"1px solid " + T.border, borderBottom:"1px solid " + T.border, background:"rgba(212,67,58,0.03)" }}>
                        <span style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1px", color:T.textMuted, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:500 }}>DM Combat Settings</span>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:T.textDim, cursor:"pointer" }}>
                            <input type="checkbox" checked={!!selectedToken.combatDodge} onChange={e => updateToken(selectedToken.id, { combatDodge: e.target.checked })} />
                            Dodge
                          </label>
                          <div>
                            <div style={{ fontSize:8, fontFamily:T.ui, color:T.textFaint, marginBottom:2 }}>Cover</div>
                            <select value={String(selectedToken.combatCover || 0)} onChange={e => updateToken(selectedToken.id, { combatCover: parseInt(e.target.value, 10) || 0 })}
                              style={{ width:"100%", padding:"4px 6px", fontSize:9, background:"rgba(0,0,0,0.2)", border:"1px solid " + T.border, color:T.text, borderRadius:"3px" }}>
                              <option value="0">None</option>
                              <option value="2">Half (+2)</option>
                              <option value="5">3/4 (+5)</option>
                            </select>
                          </div>
                        </div>
                        <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:T.textDim, cursor:"pointer", marginTop:6 }}>
                          <input type="checkbox" checked={!!selectedToken.magicalWeapon} onChange={e => updateToken(selectedToken.id, { magicalWeapon: e.target.checked })} />
                          Magical Weapon
                        </label>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <span style={{ fontFamily:T.ui, fontSize:9, letterSpacing:"1px", color:T.textFaint, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:500 }}>Notes</span>
                      <textarea value={selectedToken.notes || ""} onChange={e => updateToken(selectedToken.id, { notes: e.target.value })}
                        placeholder="Add notes about this token..."
                        rows={2}
                        style={{ width:"100%", padding:"8px 10px", fontSize:11, fontFamily:T.body, background:"rgba(0,0,0,0.2)", border:"1px solid " + T.border, color:T.text, borderRadius:"4px", outline:"none", resize:"vertical", lineHeight:"1.4", boxSizing:"border-box" }} />
                    </div>
                  </div>
                  );
                })()}

                {/* SPELLS TAB */}
                {tokenPanelTab === "spells" && (() => {
                  const tk = selectedToken;
                  const tkClass = tk?.cls || "";
                  const tkLevel = tk?.level || 1;
                  const isCaster = !!SPELLCASTING_ABILITY[tkClass];
                  const maxSlots = tk?.spellSlots || getMaxSpellSlots(tkClass, tkLevel);
                  const usedSlots = tk?.usedSlots || {};
                  const maxSpellLv = getMaxSpellLevel(tkClass, tkLevel);
                  // Filter spells by class
                  const classSpells = DND_SPELLS.filter(s => {
                    if (!tkClass) return true; // No class = show all (DM mode)
                    if (!s.classes.includes(tkClass)) return false;
                    if (s.level > 0 && s.level > maxSpellLv) return false;
                    return true;
                  });
                  return (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {/* Spell DC + Spellcasting Mod */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", background:"var(--bg-input)", borderRadius:"6px", border:"1px solid " + T.border }}>
                      <span style={{ fontFamily:T.ui, fontSize:11, color:T.textMuted, letterSpacing:"0.5px", textTransform:"uppercase", fontWeight:500 }}>Save DC</span>
                      <input type="number" min="8" max="30" value={spellDC} onChange={e => setSpellDC(parseInt(e.target.value) || 15)}
                        style={{ width:44, padding:"4px 6px", fontFamily:T.ui, fontSize:13, background:T.bgCard, border:"1px solid " + T.border, color:T.text, borderRadius:"4px", textAlign:"center", fontWeight:600 }} />
                      {isCaster && <span style={{ fontFamily:T.ui, fontSize:10, color:T.textFaint }}>({SPELLCASTING_ABILITY[tkClass]})</span>}
                      <span style={{ fontFamily:T.ui, fontSize:11, color:T.textMuted, letterSpacing:"0.5px", textTransform:"uppercase", fontWeight:500, marginLeft:"auto" }}>Mod</span>
                      <input type="number" min="-5" max="10" value={tk?.spellcastingMod || 3} onChange={e => updateToken(tk.id, { spellcastingMod: parseInt(e.target.value) || 0 })}
                        style={{ width:40, padding:"4px 6px", fontFamily:T.ui, fontSize:13, background:T.bgCard, border:"1px solid " + T.border, color:T.text, borderRadius:"4px", textAlign:"center", fontWeight:600 }} />
                    </div>

                    {/* Spell Slots Display with +/- buttons */}
                    {isCaster && Object.keys(maxSlots).length > 0 && (
                      <div style={{ padding:"8px 10px", background:"var(--bg-input)", borderRadius:"6px", border:"1px solid " + T.border }}>
                        <div style={{ fontFamily:T.ui, fontSize:10, letterSpacing:"1.2px", color:T.textFaint, textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Spell Slots</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {Object.keys(maxSlots).sort((a,b) => a-b).map(lv => {
                            const max = maxSlots[lv];
                            const used = usedSlots[lv] || 0;
                            const remaining = max - used;
                            return (
                              <div key={"slot-"+lv} style={{ display:"flex", alignItems:"center", gap:3, padding:"3px 6px", background:"rgba(0,0,0,0.1)", borderRadius:"4px", border:"1px solid " + T.border }}>
                                <span style={{ fontFamily:T.ui, fontSize:10, color:T.textMuted, fontWeight:600, minWidth:14 }}>{lv===1?"1st":lv===2?"2nd":lv===3?"3rd":lv+"th"}</span>
                                <span onClick={() => { if (tk) { const newUsed = {...usedSlots, [lv]: Math.min(max, used+1)}; updateToken(tk.id, {usedSlots:newUsed}); } }}
                                  style={{ cursor:"pointer", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"3px", background:"rgba(212,67,58,0.15)", color:"#f06858", fontSize:11, fontWeight:700, fontFamily:T.ui }}>-</span>
                                <span style={{ fontFamily:T.ui, fontSize:12, fontWeight:600, color:remaining > 0 ? "#5ee09a" : "#f06858", minWidth:16, textAlign:"center" }}>{remaining}</span>
                                <span style={{ fontFamily:T.ui, fontSize:10, color:T.textFaint }}>/{max}</span>
                                <span onClick={() => { if (tk) { const newUsed = {...usedSlots, [lv]: Math.max(0, used-1)}; updateToken(tk.id, {usedSlots:newUsed}); } }}
                                  style={{ cursor:"pointer", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"3px", background:"rgba(46,139,87,0.15)", color:"#5ee09a", fontSize:11, fontWeight:700, fontFamily:T.ui }}>+</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Multi-target status */}
                    {activeSpell && multiTargetSelections.length > 0 && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"rgba(88,170,255,0.1)", border:"1px solid rgba(88,170,255,0.3)", borderRadius:"8px" }}>
                        <Target size={14} color="#58aaff" />
                        <span style={{ flex:1, fontFamily:T.ui, fontSize:12, color:"#58aaff", fontWeight:500 }}>
                          Targets: {multiTargetSelections.length}/{getMultiTargetCount(activeSpell, castLevel, tk?.level || 1)} selected
                        </span>
                        <span onClick={() => setMultiTargetSelections(prev => prev.slice(0, -1))} style={{ cursor:"pointer", fontSize:10, color:T.textFaint, fontFamily:T.ui }}>Undo</span>
                      </div>
                    )}

                    {activeSpell && !multiTargetSelections.length && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"rgba(181,116,255,0.1)", border:"1px solid rgba(181,116,255,0.3)", borderRadius:"8px" }}>
                        <span style={{ width:10, height:10, borderRadius:"50%", background:activeSpell.color, boxShadow:"0 0 8px " + activeSpell.color }} />
                        <span style={{ flex:1, fontFamily:T.ui, fontSize:12, color:"#b574ff", letterSpacing:"0.5px", fontWeight:500 }}>Targeting: {activeSpell.name}{castLevel && castLevel > activeSpell.level ? " (Lv"+castLevel+")" : ""}</span>
                        <span onClick={() => { setActiveSpell(null); spellTargetRef.current = null; setMultiTargetSelections([]); setCastLevel(null); }} style={{ cursor:"pointer", color:T.textFaint, padding:4, display:"flex" }}><X size={14}/></span>
                      </div>
                    )}

                    <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                      {[0,1,2,3,4,5,6,7,8,9].filter(lvl => lvl === 0 || lvl <= Math.max(9, maxSpellLv)).map(lvl => {
                        const hasSlots = lvl === 0 || (maxSlots[lvl] && (maxSlots[lvl] - (usedSlots[lvl]||0)) > 0);
                        return (
                        <button key={"lvl-" + lvl} onClick={() => setSpellLevelFilter(spellLevelFilter === lvl ? -1 : lvl)}
                          style={{ padding:"5px 10px", fontSize:11, fontFamily:T.ui, letterSpacing:"0.5px", textTransform:"uppercase", background:spellLevelFilter === lvl ? "rgba(181,116,255,0.2)" : "transparent", border:"1px solid " + (spellLevelFilter === lvl ? "rgba(181,116,255,0.5)" : T.border), color:spellLevelFilter === lvl ? "#b574ff" : hasSlots ? T.textMuted : "rgba(255,80,80,0.5)", borderRadius:"4px", cursor:"pointer", transition:"all 0.15s", fontWeight:spellLevelFilter === lvl ? 600 : 400, opacity: !hasSlots && lvl > 0 ? 0.5 : 1 }}>
                          {lvl === 0 ? "C" : lvl}
                        </button>
                      );})}
                    </div>

                    <input type="text" placeholder={"Search " + (tkClass ? tkClass + " spells..." : "spells...")}
                      onChange={e => setSpellSearchFilter(e.target.value.toLowerCase())}
                      style={{ width:"100%", padding:"8px 10px", fontSize:13, fontFamily:T.body, background:T.bgInput, border:"1px solid " + T.border, color:T.text, borderRadius:"6px", outline:"none", boxSizing:"border-box" }} />

                    {selectedSpellInfo ? (
                      <div style={{ background:T.bgCard, border:"1px solid " + T.border, borderRadius:"8px", padding:16, boxShadow:"0 2px 12px rgba(0,0,6,0.2)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:12 }}>
                          <div>
                            <div style={{ fontSize:18, fontFamily:T.ui, fontWeight:600, color:selectedSpellInfo.color, marginBottom:6, textShadow:"0 0 20px " + selectedSpellInfo.color + "33" }}>{selectedSpellInfo.name}</div>
                            <div style={{ fontSize:11, fontFamily:T.ui, color:T.textMuted, letterSpacing:"0.5px", display:"flex", gap:8, flexWrap:"wrap" }}>
                              <span>{selectedSpellInfo.school}</span>
                              <span>·</span>
                              <span>{selectedSpellInfo.level === 0 ? "Cantrip" : "Level " + selectedSpellInfo.level}</span>
                              {selectedSpellInfo.ritual && <span style={{ color:"#58aaff" }}>· Ritual</span>}
                              {selectedSpellInfo.concentration && <span style={{ color:"#ffd54f" }}>· Concentration</span>}
                            </div>
                          </div>
                          <button onClick={() => setSelectedSpellInfo(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint, padding:4 }}><X size={14}/></button>
                        </div>
                        <div style={{ fontSize:12, fontFamily:T.body, color:T.textMuted, lineHeight:1.6, marginBottom:10 }}>{selectedSpellInfo.desc || "No description available."}</div>
                        <div style={{ display:"flex", gap:12, flexWrap:"wrap", fontSize:10, fontFamily:T.ui, color:T.textFaint }}>
                          {selectedSpellInfo.castingTime && <span>Cast: {selectedSpellInfo.castingTime}</span>}
                          {selectedSpellInfo.range && <span>Range: {selectedSpellInfo.range}</span>}
                          {selectedSpellInfo.duration && <span>Duration: {selectedSpellInfo.duration}</span>}
                          {selectedSpellInfo.components && <span>Components: {selectedSpellInfo.components}</span>}
                        </div>
                        {/* Cast button */}
                        {selectedSpellInfo.level > 0 && (
                          <button onClick={() => {
                            const sp = selectedSpellInfo;
                            setActiveSpell(sp);
                            setCastLevel(sp.level);
                            setSelectedSpellInfo(null);
                          }}
                          style={{ marginTop:12, width:"100%", padding:"10px", background:"rgba(181,116,255,0.12)", border:"1px solid rgba(181,116,255,0.4)", borderRadius:"8px", color:"#b574ff", fontFamily:T.ui, fontSize:11, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(181,116,255,0.2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(181,116,255,0.12)"}>
                            CAST {selectedSpellInfo.name.toUpperCase()}
                          </button>
                        )}
                        {selectedSpellInfo.level === 0 && (
                          <button onClick={() => {
                            const sp = selectedSpellInfo;
                            setActiveSpell(sp);
                            setCastLevel(0);
                            setSelectedSpellInfo(null);
                          }}
                          style={{ marginTop:12, width:"100%", padding:"10px", background:"rgba(94,224,154,0.1)", border:"1px solid rgba(94,224,154,0.35)", borderRadius:"8px", color:"#5ee09a", fontFamily:T.ui, fontSize:11, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(94,224,154,0.18)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(94,224,154,0.1)"}>
                            CAST CANTRIP
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Spell Grid */
                      <div style={{ display:"flex", flexDirection:"column", gap:3, maxHeight:400, overflowY:"auto" }}>
                        {classSpells
                          .filter(s => spellLevelFilter < 0 || s.level === spellLevelFilter)
                          .filter(s => !spellSearchFilter || s.name.toLowerCase().includes(spellSearchFilter))
                          .map(s => {
                            const slotOk = s.level === 0 || (maxSlots[s.level] && (maxSlots[s.level] - (usedSlots[s.level]||0)) > 0);
                            return (
                              <div key={s.name} onClick={() => setSelectedSpellInfo(s)}
                                style={{
                                  display:"flex", alignItems:"center", gap:8, padding:"8px 10px",
                                  background: "rgba(0,0,0,0.08)", border:"1px solid " + T.border,
                                  borderRadius:"6px", cursor:"pointer", transition:"all 0.12s", opacity: !slotOk && s.level > 0 ? 0.4 : 1,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.08)"}>
                                <div style={{ width:8, height:8, borderRadius:"50%", background:s.color, boxShadow:"0 0 6px " + s.color, flexShrink:0 }} />
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ fontSize:12, fontFamily:T.ui, color:T.text, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                                  <div style={{ fontSize:9, fontFamily:T.ui, color:T.textFaint }}>
                                    {s.level === 0 ? "Cantrip" : "Lv " + s.level} · {s.school}{s.concentration ? " · Conc" : ""}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  );
                })()}

                {/* CONFIG TAB */}
                {tokenPanelTab === "config" && selectedToken && (
                  <div style={{ display:"flex", flexDirection:"column", gap:8, padding:4 }}>
                    <div style={{ fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", color:T.textFaint, textTransform:"uppercase", marginBottom:4 }}>Token Configuration</div>
                    <div style={{ fontSize:11, fontFamily:T.body, color:T.textMuted }}>
                      Name: {selectedToken.name}<br/>
                      Type: {selectedToken.tokenType || "creature"}<br/>
                      Size: {selectedToken.size || "medium"}<br/>
                      Speed: {selectedToken.speed || 30} ft<br/>
                      Vision: {selectedToken.vision || 60} ft
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            /* Non-combat sidebar — character sheet + map setup */
            <div style={{ padding: 0, display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.06) transparent" }}>
              {(() => {
                const _pm = selectedToken ? getPartyProfile(selectedToken) : null;
                const _cp = selectedToken ? getCombatProfile(selectedToken) : null;
                const abilities = _cp?.abilities || {};
                const _toMod = (v) => { const m = Math.floor((v - 10) / 2); return m >= 0 ? "+" + m : String(m); };
                const hpPct = selectedToken?.maxHp ? Math.max(0, Math.min(100, Math.round((selectedToken.hp || 0) / selectedToken.maxHp * 100))) : 0;
                const hpCol = hpPct > 60 ? "#5ee09a" : hpPct > 30 ? "#f59e0b" : "#ef4444";
                const equipment = _cp?.equipment || _pm?.equipment || [];
                const knownSpells = _cp?.knownSpells || _pm?.knownSpells || [];
                const feats = _cp?.feats || [];
                const conditions = _cp?.conditions || [];
                const resistances = _cp?.resistances || [];
                const passives = _cp?.passives || [];
                const customFeatures = _cp?.customFeatures || [];
                const profBonus = _cp?.proficiencyBonus || 0;
                const savingThrows = ["str","dex","con","int","wis","cha"].map(ab => {
                  const val = abilities[ab] != null ? abilities[ab] : (selectedToken?.[ab] != null ? selectedToken[ab] : 10);
                  return { ab, val, mod: Math.floor((val - 10) / 2) };
                });

                return (
                  <React.Fragment>
                    {/* ── Character Section ── */}
                    {selectedToken ? (
                      <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        {/* Portrait */}
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                          <div style={{ width: 52, height: 52, borderRadius: 12, background: selectedToken.color || "#555", border: "2px solid " + (selectedToken.tokenType === "pc" ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"), overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: T.ui, fontSize: 15, fontWeight: 700, flexShrink: 0, boxShadow: selectedToken.tokenType === "pc" ? "0 0 12px rgba(201,168,76,0.1)" : "none" }}>
                            {selectedToken.imageSrc ? <img src={selectedToken.imageSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (selectedToken.label || selectedToken.name?.substring(0,2) || "??").toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontFamily: T.ui, fontSize: 15, fontWeight: 700, color: "rgba(242,232,214,0.9)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing:"0.3px" }}>{selectedToken.name}</div>
                            <div style={{ fontFamily: T.body, fontSize: 11, color: "rgba(242,232,214,0.4)", marginTop: 3, lineHeight:1.3 }}>
                              {[_pm?.race || _cp?.species, _pm?.cls || _cp?.className, _cp?.level ? "Lv " + _cp.level : null, _pm?.subclass || _cp?.subclass].filter(Boolean).join(" · ") || selectedToken.tokenType || "Creature"}
                            </div>
                            {_pm?.player && <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(242,232,214,0.3)", marginTop: 2 }}>Player: {_pm.player}</div>}
                            {_pm?.background && <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(242,232,214,0.3)" }}>Background: {_pm.background}</div>}
                          </div>
                          <button onClick={() => setSelectedTokenId(null)}
                            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, color: "rgba(242,232,214,0.3)", cursor: "pointer", padding: "4px 7px", fontSize: 11, flexShrink: 0, transition:"background 0.12s" }}>✕</button>
                        </div>

                        {/* HP / AC / Speed */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
                          <div style={{ padding: "10px 6px", borderRadius: 10, textAlign: "center", background: "rgba(255,255,255,0.015)", border: "1px solid " + hpCol + "22" }}>
                            <div style={{ fontFamily: T.ui, fontSize: 7, letterSpacing: "1.2px", textTransform: "uppercase", color: hpCol, fontWeight:600 }}>HP</div>
                            <div style={{ fontFamily: T.body, fontSize: 22, fontWeight: 700, color: hpCol, lineHeight: 1.1 }}>{selectedToken.hp != null ? selectedToken.hp : "?"}</div>
                            <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(242,232,214,0.25)" }}>/ {selectedToken.maxHp || "?"}</div>
                          </div>
                          <div style={{ padding: "10px 6px", borderRadius: 10, textAlign: "center", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ fontFamily: T.ui, fontSize: 7, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", fontWeight:600 }}>AC</div>
                            <div style={{ fontFamily: T.body, fontSize: 22, fontWeight: 700, color: "rgba(242,232,214,0.85)", lineHeight: 1.1 }}>{selectedToken.ac || _cp?.ac || "?"}</div>
                            <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(242,232,214,0.25)" }}>armor</div>
                          </div>
                          <div style={{ padding: "10px 6px", borderRadius: 10, textAlign: "center", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ fontFamily: T.ui, fontSize: 7, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", fontWeight:600 }}>Speed</div>
                            <div style={{ fontFamily: T.body, fontSize: 22, fontWeight: 700, color: "rgba(242,232,214,0.85)", lineHeight: 1.1 }}>{selectedToken.speed || _cp?.speed || 30}</div>
                            <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(242,232,214,0.25)" }}>ft</div>
                          </div>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.03)", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
                          <div style={{ width: hpPct + "%", height: "100%", background: "linear-gradient(90deg," + hpCol + "," + hpCol + "aa)", borderRadius: 999, boxShadow: "0 0 8px " + hpCol + "33", transition: "width 0.3s ease" }} />
                        </div>

                        {/* Ability Scores */}
                        <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Ability Scores</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, marginBottom: 16 }}>
                          {savingThrows.map(st => (
                            <div key={st.ab} style={{ padding: "7px 2px", borderRadius: 8, textAlign: "center", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                              <div style={{ fontFamily: T.ui, fontSize: 7, letterSpacing: "0.8px", textTransform: "uppercase", color: "rgba(242,232,214,0.3)" }}>{st.ab}</div>
                              <div style={{ fontFamily: T.body, fontSize: 18, fontWeight: 700, color: "rgba(242,232,214,0.85)", lineHeight: 1.2 }}>{st.val}</div>
                              <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(242,232,214,0.4)" }}>{_toMod(st.val)}</div>
                            </div>
                          ))}
                        </div>

                        {/* Quick chips */}
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                          {profBonus > 0 && <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(41,182,246,0.08)", border: "1px solid rgba(41,182,246,0.2)", color: "#29b6f6" }}>Prof +{profBonus}</span>}
                          {_cp?.initiativeBonus != null && <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(255,255,255,0.03)", border: "1px solid " + T.border, color: T.textMuted }}>Init {_cp.initiativeBonus >= 0 ? "+" : ""}{_cp.initiativeBonus}</span>}
                          {_cp?.spellcastingMod != null && _cp.spellcastingMod !== 0 && <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}>DC {8 + profBonus + _cp.spellcastingMod}</span>}
                          <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(255,255,255,0.03)", border: "1px solid " + T.border, color: T.textMuted }}>PP {10 + Math.floor(((abilities.wis || 10) - 10) / 2)}</span>
                        </div>

                        {/* Saving Throws */}
                        <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Saving Throws</div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                          {savingThrows.map(st => (
                            <span key={"sv-"+st.ab} style={{ padding: "3px 7px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(0,0,0,0.1)", border: "1px solid " + T.border, color: T.textMuted }}>{st.ab.toUpperCase()} {st.mod >= 0 ? "+" : ""}{st.mod}</span>
                          ))}
                        </div>

                        {/* Conditions */}
                        {conditions.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Conditions</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {conditions.map(c => <span key={c} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>{c}</span>)}
                            </div>
                          </div>
                        )}

                        {/* Resistances */}
                        {resistances.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Resistances</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {resistances.map((r, i) => <span key={i} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>{typeof r === "string" ? r : (r.name || r.type || "Resist")}</span>)}
                            </div>
                          </div>
                        )}

                        {/* Equipment */}
                        {equipment.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Weapons & Equipment</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {equipment.map((w, i) => <span key={i} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }}>{typeof w === "string" ? w : (w.name || "Item")}</span>)}
                            </div>
                          </div>
                        )}

                        {/* Spell Slots */}
                        {_cp?.spellSlots && Object.keys(_cp.spellSlots).some(k => _cp.spellSlots[k] > 0) && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Spell Slots</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {Object.keys(_cp.spellSlots).sort((a, b) => a - b).filter(k => _cp.spellSlots[k] > 0).map(lv => {
                                const used = (_cp.usedSlots || {})[lv] || 0;
                                const max = _cp.spellSlots[lv];
                                const rem = max - used;
                                return (
                                  <div key={lv} style={{ padding: "5px 8px", borderRadius: 8, textAlign: "center", background: subtleBg, border: "1px solid " + (rem > 0 ? "rgba(167,139,250,0.2)" : T.border), minWidth: 42 }}>
                                    <div style={{ fontFamily: T.ui, fontSize: 7, letterSpacing: "0.8px", color: T.textFaint }}>Lv {lv}</div>
                                    <div style={{ fontFamily: T.body, fontSize: 16, fontWeight: 700, color: rem > 0 ? "#a78bfa" : T.textFaint }}>{rem}</div>
                                    <div style={{ fontFamily: T.body, fontSize: 9, color: T.textFaint }}>/ {max}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Known Spells */}
                        {knownSpells.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Spells ({knownSpells.length})</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {knownSpells.slice(0, 30).map((sp, i) => <span key={i} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", color: "#a78bfa" }}>{typeof sp === "string" ? sp : (sp.name || "Spell")}</span>)}
                              {knownSpells.length > 30 && <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, color: T.textFaint, fontStyle: "italic" }}>+{knownSpells.length - 30} more</span>}
                            </div>
                          </div>
                        )}

                        {/* Feats & Features */}
                        {(feats.length > 0 || customFeatures.length > 0 || passives.length > 0) && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Features & Feats</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {feats.map((f, i) => <span key={"ft-"+i} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", color: "#f59e0b" }}>{typeof f === "string" ? f : (f.name || "Feat")}</span>)}
                              {customFeatures.map((f, i) => <span key={"cf-"+i} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(255,255,255,0.03)", border: "1px solid " + T.border, color: T.textMuted }}>{typeof f === "string" ? f : (f.name || "Feature")}</span>)}
                              {passives.map((p, i) => <span key={"ps-"+i} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontFamily: T.ui, background: "rgba(255,255,255,0.03)", border: "1px solid " + T.border, color: T.textMuted }}>{typeof p === "string" ? p : (p.name || "Passive")}</span>)}
                            </div>
                          </div>
                        )}

                        {/* Bio */}
                        {(_pm?.bio || selectedToken.notes) && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8, fontWeight:600 }}>Notes</div>
                            <div style={{ fontSize: 11, fontFamily: T.body, color: T.textMuted, lineHeight: 1.5, whiteSpace: "pre-wrap", maxHeight: 120, overflowY: "auto" }}>{_pm?.bio || selectedToken.notes}</div>
                          </div>
                        )}

                        {/* Open Builder */}
                        {_pm?.sheetUrl && (
                          <button onClick={() => window.open(_pm.sheetUrl, "_blank")}
                            style={{ width: "100%", padding: "10px", background: "rgba(41,182,246,0.08)", border: "1px solid rgba(41,182,246,0.25)", borderRadius: 8, color: "#29b6f6", fontFamily: T.ui, fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", cursor: "pointer", textTransform: "uppercase", marginBottom: 12 }}>
                            Open in Character Builder
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{ padding: "24px 20px", textAlign:"center" }}>
                        <div style={{ width:48, height:48, borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                          <Target size={20} color="rgba(242,232,214,0.15)" />
                        </div>
                        <div style={{ fontFamily: T.ui, fontSize: 10, letterSpacing: "1px", color: "rgba(242,232,214,0.25)", textTransform: "uppercase" }}>Select a token to inspect</div>
                      </div>
                    )}

                    {/* ── Map Setup Section (always visible for DM) ── */}
                    {viewRole === "dm" && (
                      <div style={{ padding: "0 20px 18px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>

                        {/* Section: Encounter Controls */}
                        {!combatLive && (
                          <div style={{ padding:"16px 0 12px" }}>
                            <button onClick={() => { setMode("combat"); setSidebarOpen(true); }}
                              onMouseEnter={e => { e.currentTarget.style.background="rgba(94,224,154,0.12)"; e.currentTarget.style.boxShadow="0 0 16px rgba(94,224,154,0.1)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background="rgba(94,224,154,0.06)"; e.currentTarget.style.boxShadow="none"; }}
                              style={{ width:"100%", padding: "10px 14px", background: "rgba(94,224,154,0.06)", border: "1px solid rgba(94,224,154,0.2)", borderRadius: 10, color: "#5ee09a", fontFamily: T.ui, fontSize: 10, fontWeight: 600, cursor: "pointer", letterSpacing: "1px", textTransform:"uppercase", transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                              <Swords size={13} /> Start Encounter
                            </button>
                          </div>
                        )}

                        {/* Section Header: Map Settings */}
                        <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: 14, marginTop: combatLive ? 16 : 4, fontWeight:600 }}>Map Settings</div>

                        {/* Subsection: Background */}
                        <div style={{ marginBottom: 16, padding:"12px", background:"rgba(255,255,255,0.015)", borderRadius:10, border:"1px solid rgba(255,255,255,0.03)" }}>
                          <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "0.8px", color: "rgba(242,232,214,0.35)", marginBottom: 8, textTransform: "uppercase", fontWeight:500 }}>Background</div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                            {bgPresets.map(p => (
                              <button key={p.c} onClick={() => setBgColor(p.c)} title={p.l}
                                style={{ width: 24, height: 24, borderRadius: 6, background: p.c, border: bgColor === p.c ? "2px solid #c9a84c" : "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition:"border-color 0.12s", boxShadow: bgColor === p.c ? "0 0 8px rgba(201,168,76,0.2)" : "none" }} />
                            ))}
                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                              style={{ width: 24, height: 24, border: "1px solid rgba(255,255,255,0.08)", background: "none", padding: 0, cursor: "pointer", borderRadius: 6 }} />
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => mapImgInputRef.current?.click()}
                              onMouseEnter={e => e.currentTarget.style.background="rgba(201,168,76,0.12)"}
                              onMouseLeave={e => e.currentTarget.style.background="rgba(201,168,76,0.06)"}
                              style={{ padding: "5px 10px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 6, color: "#c9a84c", fontFamily: T.ui, fontSize: 9, cursor: "pointer", transition:"background 0.12s" }}>{bgImage ? "Replace Map" : "Upload Map"}</button>
                            {bgImage && <button onClick={() => setBgImage(null)}
                              onMouseEnter={e => e.currentTarget.style.background="rgba(239,68,68,0.12)"}
                              onMouseLeave={e => e.currentTarget.style.background="rgba(239,68,68,0.05)"}
                              style={{ padding: "5px 10px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 6, color: "#ef4444", fontFamily: T.ui, fontSize: 9, cursor: "pointer", transition:"background 0.12s" }}>Clear</button>}
                          </div>
                        </div>

                        {/* Subsection: Grid & Snap */}
                        <div style={{ marginBottom: 16, padding:"12px", background:"rgba(255,255,255,0.015)", borderRadius:10, border:"1px solid rgba(255,255,255,0.03)" }}>
                          <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "0.8px", color: "rgba(242,232,214,0.35)", marginBottom: 8, textTransform: "uppercase", fontWeight:500 }}>Grid & Snap <span style={{ textTransform: "none", opacity: 0.6, fontWeight:400 }}>(1 sq = 5 ft)</span></div>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                            {[20, 30, 40, 50, 60, 80].map(s => (
                              <button key={s} onClick={() => setGridSize(s)}
                                style={{ padding: "4px 8px", background: gridSize === s ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.02)", border: "1px solid " + (gridSize === s ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.06)"), borderRadius: 6, color: gridSize === s ? "#c9a84c" : "rgba(242,232,214,0.4)", fontFamily: T.ui, fontSize: 9, cursor: "pointer", transition:"all 0.12s" }}>{s}px</button>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => setShowGrid(!showGrid)} style={{ padding: "5px 10px", background: showGrid ? "rgba(94,224,154,0.08)" : "rgba(255,255,255,0.02)", border: "1px solid " + (showGrid ? "rgba(94,224,154,0.2)" : "rgba(255,255,255,0.06)"), borderRadius: 6, color: showGrid ? "#5ee09a" : "rgba(242,232,214,0.4)", fontFamily: T.ui, fontSize: 9, cursor: "pointer", transition:"all 0.12s" }}>{showGrid ? "Grid On" : "Grid Off"}</button>
                            <button onClick={() => setSnapToGrid(!snapToGrid)} style={{ padding: "5px 10px", background: snapToGrid ? "rgba(94,224,154,0.08)" : "rgba(255,255,255,0.02)", border: "1px solid " + (snapToGrid ? "rgba(94,224,154,0.2)" : "rgba(255,255,255,0.06)"), borderRadius: 6, color: snapToGrid ? "#5ee09a" : "rgba(242,232,214,0.4)", fontFamily: T.ui, fontSize: 9, cursor: "pointer", transition:"all 0.12s" }}>{snapToGrid ? "Snap On" : "Snap Off"}</button>
                          </div>
                        </div>

                        {/* Subsection: Tokens & Monsters */}
                        <div style={{ marginBottom: 16, padding:"12px", background:"rgba(255,255,255,0.015)", borderRadius:10, border:"1px solid rgba(255,255,255,0.03)" }}>
                          <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "0.8px", color: "rgba(242,232,214,0.35)", marginBottom: 8, textTransform: "uppercase", fontWeight:500 }}>Tokens & Monsters</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                            {(party || []).filter(p => !tokens.some(t => t.partyId === p.id)).map(p => (
                              <button key={p.id} onClick={() => {
                                const t = { id: "tok-" + Date.now() + "-" + Math.random().toString(36).slice(2,6), name: p.name || "PC", label: (p.name || "PC").substring(0,3), x: 200 + Math.random()*300, y: 200 + Math.random()*300, hp: p.hp || 20, maxHp: p.maxHp || 20, ac: p.ac || 10, tokenType: "pc", partyId: p.id, player: p.player || "", str: p.str, dex: p.dex, con: p.con, int: p.int, wis: p.wis, cha: p.cha, speed: p.speed || 30, cls: p.cls || "", level: p.lv || 1 };
                                setTokens(prev => [...prev, t]);
                              }}
                              onMouseEnter={e => e.currentTarget.style.background="rgba(201,168,76,0.08)"}
                              onMouseLeave={e => e.currentTarget.style.background="rgba(201,168,76,0.03)"}
                              style={{ padding: "6px 10px", background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 6, color: "#c9a84c", fontFamily: T.ui, fontSize: 9, cursor: "pointer", textAlign: "left", transition:"background 0.12s" }}>+ {p.name || "PC"}</button>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            <button onClick={() => tokenImgRef.current?.click()}
                              onMouseEnter={e => e.currentTarget.style.background="rgba(167,139,250,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background="rgba(167,139,250,0.05)"}
                              style={{ padding: "5px 10px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: 6, color: "#a78bfa", fontFamily: T.ui, fontSize: 9, cursor: "pointer", transition:"background 0.12s" }}>Upload Token</button>
                            <button onClick={() => { setMode("combat"); setSidebarOpen(true); setCombatTab("monsters"); }}
                              onMouseEnter={e => e.currentTarget.style.background="rgba(239,68,68,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background="rgba(239,68,68,0.05)"}
                              style={{ padding: "5px 10px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 6, color: "#ef4444", fontFamily: T.ui, fontSize: 9, cursor: "pointer", transition:"background 0.12s" }}>Monsters</button>
                          </div>
                        </div>

                        {/* Subsection: Scene Management */}
                        <div style={{ marginBottom: 12, padding:"12px", background:"rgba(255,255,255,0.015)", borderRadius:10, border:"1px solid rgba(255,255,255,0.03)" }}>
                          <div style={{ fontFamily: T.ui, fontSize: 8, letterSpacing: "0.8px", color: "rgba(242,232,214,0.35)", marginBottom: 8, textTransform: "uppercase", fontWeight:500 }}>Scene Management</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                            <button onClick={() => setShowScenePanel(true)}
                              onMouseEnter={e => e.currentTarget.style.background="rgba(94,224,154,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background="rgba(94,224,154,0.05)"}
                              style={{ padding: "5px 10px", background: "rgba(94,224,154,0.05)", border: "1px solid rgba(94,224,154,0.12)", borderRadius: 6, color: "#5ee09a", fontFamily: T.ui, fontSize: 9, cursor: "pointer", transition:"background 0.12s" }}>Scene Manager</button>
                            <span style={{ fontFamily: T.body, fontSize: 10, color: "rgba(242,232,214,0.3)" }}>{battleMaps.length} map{battleMaps.length !== 1 ? "s" : ""}</span>
                          </div>
                          {battleMaps.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              {battleMaps.map(map => (
                                <button key={map.id} onClick={() => switchToMapOverview(map.id)}
                                  onMouseEnter={e => { if (activeMapId !== map.id) e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                                  onMouseLeave={e => { if (activeMapId !== map.id) e.currentTarget.style.background="rgba(255,255,255,0.01)"; }}
                                  style={{ padding: "6px 10px", background: activeMapId === map.id ? "rgba(94,224,154,0.08)" : "rgba(255,255,255,0.01)", border: "1px solid " + (activeMapId === map.id ? "rgba(94,224,154,0.2)" : "rgba(255,255,255,0.04)"), borderRadius: 6, color: activeMapId === map.id ? "#5ee09a" : "rgba(242,232,214,0.4)", fontFamily: T.ui, fontSize: 9, cursor: "pointer", textAlign: "left", transition:"all 0.12s" }}>{map.name} ({(map.scenes || []).length})</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Register for lazy-loader
window.CampaignBattlemap = Battlemap;
window.CampaignBattlemapErrorBoundary = BattlemapErrorBoundary;
