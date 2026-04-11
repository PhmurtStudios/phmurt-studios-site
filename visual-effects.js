/* ═══════════════════════════════════════════════════════════════════════════
   PHMURT STUDIOS — VISUAL EFFECTS ENGINE
   Canvas-based animations for D&D 5e combat: melee attacks, ranged attacks,
   breath weapons, spell effects, AoE, healing, buffs, conditions
   ═══════════════════════════════════════════════════════════════════════════ */

window.VFX = (() => {
  "use strict";

  // Active effects list — rendered each frame
  let activeEffects = [];
  let animFrameId = null;
  let canvasRef = null;
  let ctxRef = null;
  let panRef = { x: 0, y: 0 };
  let zoomRef = 1;
  let gridSizeRef = 40;
  const PARTICLE_DT = 0.016; // ~60fps deltaTime in seconds

  // ─── COLOR PALETTES ────────────────────────────────────────────────────────

  const DAMAGE_COLORS = {
    fire:        { primary: "#ff4500", secondary: "#ff8c00", glow: "rgba(255,69,0,0.4)", particles: ["#ff4500","#ff6347","#ff8c00","#ffd700","#fff"] },
    cold:        { primary: "#00bfff", secondary: "#87ceeb", glow: "rgba(0,191,255,0.4)", particles: ["#00bfff","#87ceeb","#e0f7fa","#b3e5fc","#fff"] },
    lightning:   { primary: "#00e5ff", secondary: "#e0f7fa", glow: "rgba(0,229,255,0.5)", particles: ["#00e5ff","#e0f7fa","#fff","#b2ff59","#76ff03"] },
    acid:        { primary: "#76ff03", secondary: "#c6ff00", glow: "rgba(118,255,3,0.4)", particles: ["#76ff03","#c6ff00","#69f0ae","#b9f6ca","#fff"] },
    poison:      { primary: "#4caf50", secondary: "#81c784", glow: "rgba(76,175,80,0.4)", particles: ["#4caf50","#81c784","#a5d6a7","#c8e6c9","#e8f5e9"] },
    necrotic:    { primary: "#7c3aed", secondary: "#9c27b0", glow: "rgba(124,58,237,0.4)", particles: ["#7c3aed","#9c27b0","#ce93d8","#e1bee7","#4a0072"] },
    radiant:     { primary: "#ffd54f", secondary: "#fff9c4", glow: "rgba(255,213,79,0.5)", particles: ["#ffd54f","#fff9c4","#fff","#ffecb3","#ffe082"] },
    force:       { primary: "#b574ff", secondary: "#e1bee7", glow: "rgba(181,116,255,0.4)", particles: ["#b574ff","#e1bee7","#ce93d8","#f3e5f5","#fff"] },
    psychic:     { primary: "#e040fb", secondary: "#f48fb1", glow: "rgba(224,64,251,0.4)", particles: ["#e040fb","#f48fb1","#ce93d8","#f3e5f5","#fff"] },
    thunder:     { primary: "#90caf9", secondary: "#bbdefb", glow: "rgba(144,202,249,0.5)", particles: ["#90caf9","#bbdefb","#e3f2fd","#fff","#64b5f6"] },
    bludgeoning: { primary: "#8d6e63", secondary: "#bcaaa4", glow: "rgba(141,110,99,0.3)", particles: ["#8d6e63","#bcaaa4","#d7ccc8","#efebe9","#795548"] },
    piercing:    { primary: "#b0bec5", secondary: "#cfd8dc", glow: "rgba(176,190,197,0.3)", particles: ["#b0bec5","#cfd8dc","#eceff1","#fff","#90a4ae"] },
    slashing:    { primary: "#ef5350", secondary: "#ef9a9a", glow: "rgba(239,83,80,0.3)", particles: ["#ef5350","#ef9a9a","#ffcdd2","#fff","#e53935"] },
    healing:     { primary: "#5ee09a", secondary: "#a5d6a7", glow: "rgba(94,224,154,0.4)", particles: ["#5ee09a","#a5d6a7","#c8e6c9","#e8f5e9","#fff"] },
  };

  const getColors = (type) => DAMAGE_COLORS[type] || DAMAGE_COLORS.force;

  // Utility: pick random color from array
  const getRandomColor = (colorArray) => colorArray[Math.floor(Math.random() * colorArray.length)];


  // ─── PARTICLE SYSTEM ───────────────────────────────────────────────────────

  class Particle {
    constructor(x, y, vx, vy, color, size, life, gravity = 0, friction = 0.98) {
      this.x = x; this.y = y; this.vx = vx; this.vy = vy;
      this.color = color; this.size = size; this.life = life; this.maxLife = life;
      this.gravity = gravity; this.friction = friction;
      this.alpha = 1;
    }
    update(dt) {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.life -= dt;
      this.alpha = Math.max(0, this.life / this.maxLife);
      this.size *= 0.995;
    }
    draw(ctx) {
      if (!ctx || this.alpha <= 0) return; // Skip if invisible
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color || "#fff"; // Default to white if color invalid
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    isDead() { return this.life <= 0 || this.size < 0.3; }
  }


  // ─── EFFECT TYPES ──────────────────────────────────────────────────────────

  /** Slash effect — arc of color from attacker to target */
  const createSlashEffect = (fromX, fromY, toX, toY, damageType = "slashing") => {
    const colors = getColors(damageType);
    const duration = 600;
    const startTime = performance.now();
    const particles = [];
    const angle = Math.atan2(toY - fromY, toX - fromX);

    return {
      type: "slash",
      fromX, fromY, toX, toY,
      startTime, duration,
      colors, damageType, angle,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        if (t < 0.3) {
          // Spawn slash arc particles
          for (let i = 0; i < 3; i++) {
            const progress = t / 0.3;
            const arcAngle = angle - 0.6 + progress * 1.2;
            const dist = 15 + progress * 25;
            const px = toX + Math.cos(arcAngle) * dist;
            const py = toY + Math.sin(arcAngle) * dist;
            particles.push(new Particle(
              px, py,
              (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40,
              getRandomColor(colors.particles),
              2 + Math.random() * 3, 0.4 + Math.random() * 0.3
            ));
          }
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        const alpha = t < 0.5 ? 1 : 1 - (t - 0.5) / 0.5;
        ctx.save();
        ctx.globalAlpha = alpha;
        // Draw slash arc
        if (t < 0.5) {
          const progress = Math.min(1, t / 0.3);
          ctx.strokeStyle = colors.primary;
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(toX, toY, 20, angle - 0.6, angle - 0.6 + progress * 1.2);
          ctx.stroke();
          // Second thinner arc
          ctx.lineWidth = 2;
          ctx.strokeStyle = colors.secondary;
          ctx.beginPath();
          ctx.arc(toX, toY, 28, angle - 0.4, angle - 0.4 + progress * 0.8);
          ctx.stroke();
        }
        // Draw impact flash
        if (t < 0.2) {
          const flashAlpha = 1 - t / 0.2;
          ctx.globalAlpha = flashAlpha * 0.6;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(toX, toY, 12 + t * 80, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };

  /** Bite/Claw effect — jaws closing or claws raking */
  const createBiteEffect = (fromX, fromY, toX, toY, attackName = "Bite") => {
    const isClaw = /claw|talon|scratch/i.test(attackName);
    const colors = getColors(isClaw ? "slashing" : "piercing");
    const duration = 700;
    const startTime = performance.now();
    const particles = [];

    return {
      type: "bite",
      fromX, fromY, toX, toY,
      startTime, duration, colors,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        if (t < 0.3) {
          for (let i = 0; i < 2; i++) {
            particles.push(new Particle(
              toX + (Math.random() - 0.5) * 20, toY + (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60,
              getRandomColor(colors.particles),
              1.5 + Math.random() * 2.5, 0.3 + Math.random() * 0.3
            ));
          }
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        const alpha = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
        ctx.save();
        ctx.globalAlpha = alpha;

        if (isClaw) {
          // Draw 3 claw marks
          const angle = Math.atan2(toY - fromY, toX - fromX);
          const progress = Math.min(1, t / 0.25);
          for (let i = -1; i <= 1; i++) {
            const offsetAngle = angle + Math.PI / 2;
            const ox = i * 8 * Math.cos(offsetAngle);
            const oy = i * 8 * Math.sin(offsetAngle);
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 2.5;
            ctx.lineCap = "round";
            ctx.shadowColor = colors.glow;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            const startX = toX + ox - Math.cos(angle) * 18;
            const startY = toY + oy - Math.sin(angle) * 18;
            const endX = toX + ox + Math.cos(angle) * 18 * progress;
            const endY = toY + oy + Math.sin(angle) * 18 * progress;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          }
        } else {
          // Bite — draw jaws closing
          const angle = Math.atan2(toY - fromY, toX - fromX);
          const jawProgress = t < 0.2 ? t / 0.2 : (t < 0.3 ? 1 : 1 - (t - 0.3) / 0.3);
          const jawAngle = 0.5 * (1 - jawProgress);

          ctx.strokeStyle = colors.primary;
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 12;
          // Upper jaw
          ctx.beginPath();
          ctx.arc(toX, toY, 16, angle - Math.PI + jawAngle, angle - jawAngle);
          ctx.stroke();
          // Lower jaw
          ctx.beginPath();
          ctx.arc(toX, toY, 16, angle + jawAngle, angle + Math.PI - jawAngle);
          ctx.stroke();
          // Fangs
          if (jawProgress > 0.5) {
            ctx.fillStyle = "#fff";
            for (let side = -1; side <= 1; side += 2) {
              const fangAngle = angle + side * 0.3;
              ctx.beginPath();
              ctx.moveTo(toX + Math.cos(fangAngle) * 14, toY + Math.sin(fangAngle) * 14);
              ctx.lineTo(toX + Math.cos(fangAngle) * 8, toY + Math.sin(fangAngle + side * 0.15) * 8);
              ctx.lineTo(toX + Math.cos(fangAngle) * 8, toY + Math.sin(fangAngle - side * 0.15) * 8);
              ctx.fill();
            }
          }
        }

        // Impact flash
        if (t > 0.15 && t < 0.35) {
          const flashT = (t - 0.15) / 0.2;
          ctx.globalAlpha = (1 - flashT) * 0.5;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(toX, toY, 8 + flashT * 20, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };

  /** Projectile effect — arrow, bolt, ray, etc. */
  const createProjectileEffect = (fromX, fromY, toX, toY, damageType = "piercing", projectileType = "arrow") => {
    const colors = getColors(damageType);
    const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
    const duration = Math.max(300, Math.min(800, distance * 2));
    const startTime = performance.now();
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const particles = [];

    const isBeam = /ray|beam|bolt|blast/i.test(projectileType);

    return {
      type: "projectile",
      fromX, fromY, toX, toY,
      startTime, duration, colors, angle,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        // Trail particles
        if (t < 0.8) {
          const progress = t / 0.8;
          const cx = fromX + (toX - fromX) * progress;
          const cy = fromY + (toY - fromY) * progress;
          particles.push(new Particle(
            cx + (Math.random() - 0.5) * 6, cy + (Math.random() - 0.5) * 6,
            -Math.cos(angle) * 20 + (Math.random() - 0.5) * 15,
            -Math.sin(angle) * 20 + (Math.random() - 0.5) * 15,
            colors.particles[Math.floor(Math.random() * colors.particles.length)],
            1 + Math.random() * 2, 0.2 + Math.random() * 0.2
          ));
        }
        // Impact burst
        if (t > 0.78 && t < 0.82) {
          for (let i = 0; i < 8; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 30 + Math.random() * 60;
            particles.push(new Particle(
              toX, toY,
              Math.cos(a) * spd, Math.sin(a) * spd,
              getRandomColor(colors.particles),
              2 + Math.random() * 3, 0.3 + Math.random() * 0.3,
              0, 0.95
            ));
          }
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        ctx.save();

        if (t < 0.8) {
          const progress = t / 0.8;
          const cx = fromX + (toX - fromX) * progress;
          const cy = fromY + (toY - fromY) * progress;

          if (isBeam) {
            // Beam/ray — glowing line
            const tailProgress = Math.max(0, progress - 0.3);
            const tailX = fromX + (toX - fromX) * tailProgress;
            const tailY = fromY + (toY - fromY) * tailProgress;
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.shadowColor = colors.glow;
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(cx, cy);
            ctx.stroke();
            // Inner glow line
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(cx, cy);
            ctx.stroke();
          } else {
            // Arrow/dart — solid projectile
            ctx.fillStyle = colors.primary;
            ctx.shadowColor = colors.glow;
            ctx.shadowBlur = 10;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            // Arrow body
            ctx.beginPath();
            ctx.moveTo(8, 0);
            ctx.lineTo(-6, -3);
            ctx.lineTo(-4, 0);
            ctx.lineTo(-6, 3);
            ctx.closePath();
            ctx.fill();
            // Arrowhead
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(5, -2);
            ctx.lineTo(5, 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
        }

        // Impact glow
        if (t > 0.75 && t < 1) {
          const impactT = (t - 0.75) / 0.25;
          ctx.globalAlpha = 1 - impactT;
          ctx.fillStyle = colors.primary;
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 25;
          ctx.beginPath();
          ctx.arc(toX, toY, 5 + impactT * 15, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };

  /** Breath weapon effect — cone or line of elemental damage */
  const createBreathEffect = (originX, originY, targetX, targetY, shape, radius, breathType = "fire") => {
    const colors = getColors(breathType);
    const duration = 1200;
    const startTime = performance.now();
    const angle = Math.atan2(targetY - originY, targetX - originX);
    const particles = [];

    return {
      type: "breath",
      originX, originY, targetX, targetY,
      startTime, duration, colors, angle, shape, radius, breathType,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        if (t < 0.6) {
          const count = shape === "cone" ? 6 : 3;
          for (let i = 0; i < count; i++) {
            const progress = t / 0.6;
            let px, py, pvx, pvy;
            if (shape === "cone") {
              const spread = (Math.random() - 0.5) * 1.2; // Cone spread angle
              const dist = progress * radius * 0.7;
              const pAngle = angle + spread * progress;
              px = originX + Math.cos(pAngle) * dist;
              py = originY + Math.sin(pAngle) * dist;
              pvx = Math.cos(pAngle) * (40 + Math.random() * 40);
              pvy = Math.sin(pAngle) * (40 + Math.random() * 40);
            } else {
              // Line
              const dist = progress * radius;
              const perpOffset = (Math.random() - 0.5) * 8;
              px = originX + Math.cos(angle) * dist + Math.cos(angle + Math.PI / 2) * perpOffset;
              py = originY + Math.sin(angle) * dist + Math.sin(angle + Math.PI / 2) * perpOffset;
              pvx = Math.cos(angle) * 30 + (Math.random() - 0.5) * 20;
              pvy = Math.sin(angle) * 30 + (Math.random() - 0.5) * 20;
            }
            particles.push(new Particle(px, py, pvx, pvy,
              getRandomColor(colors.particles),
              3 + Math.random() * 5, 0.4 + Math.random() * 0.4,
              breathType === "fire" ? -20 : 0, 0.96
            ));
          }
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        ctx.save();
        const alpha = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
        ctx.globalAlpha = alpha;

        if (shape === "cone") {
          const progress = Math.min(1, t / 0.5);
          const coneLength = radius * progress;
          const coneAngle = 0.55; // ~60 degree cone
          ctx.fillStyle = colors.glow;
          ctx.shadowColor = colors.primary;
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(
            originX + Math.cos(angle - coneAngle) * coneLength,
            originY + Math.sin(angle - coneAngle) * coneLength
          );
          ctx.arc(originX, originY, coneLength, angle - coneAngle, angle + coneAngle);
          ctx.closePath();
          ctx.fill();
          // Inner brighter core
          ctx.globalAlpha = alpha * 0.5;
          ctx.fillStyle = colors.primary;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(
            originX + Math.cos(angle - coneAngle * 0.5) * coneLength * 0.7,
            originY + Math.sin(angle - coneAngle * 0.5) * coneLength * 0.7
          );
          ctx.arc(originX, originY, coneLength * 0.7, angle - coneAngle * 0.5, angle + coneAngle * 0.5);
          ctx.closePath();
          ctx.fill();
        } else if (shape === "line") {
          const progress = Math.min(1, t / 0.4);
          const lineLength = radius * progress;
          const halfWidth = 4;
          ctx.strokeStyle = colors.primary;
          ctx.lineWidth = halfWidth * 2;
          ctx.lineCap = "round";
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 25;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX + Math.cos(angle) * lineLength, originY + Math.sin(angle) * lineLength);
          ctx.stroke();
          // Inner line
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.globalAlpha = alpha * 0.7;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX + Math.cos(angle) * lineLength, originY + Math.sin(angle) * lineLength);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };

  /** Explosion/AoE effect — expanding circle with particles */
  const createExplosionEffect = (x, y, radius, damageType = "fire") => {
    const colors = getColors(damageType);
    const duration = 900;
    const startTime = performance.now();
    const particles = [];

    return {
      type: "explosion",
      x, y, radius,
      startTime, duration, colors,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        if (t < 0.3) {
          for (let i = 0; i < 8; i++) {
            const a = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius * 0.6;
            const spd = 20 + Math.random() * 50;
            particles.push(new Particle(
              x + Math.cos(a) * dist, y + Math.sin(a) * dist,
              Math.cos(a) * spd, Math.sin(a) * spd,
              getRandomColor(colors.particles),
              2 + Math.random() * 4, 0.5 + Math.random() * 0.4,
              damageType === "fire" ? -30 : 0, 0.95
            ));
          }
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        ctx.save();

        // Expanding ring
        const ringProgress = Math.min(1, t / 0.3);
        const ringRadius = radius * ringProgress;
        const ringAlpha = t < 0.5 ? 0.4 : 0.4 * (1 - (t - 0.5) / 0.5);

        ctx.globalAlpha = ringAlpha;
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.fill();

        // Ring border
        ctx.globalAlpha = ringAlpha * 2;
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Center flash
        if (t < 0.15) {
          ctx.globalAlpha = 1 - t / 0.15;
          ctx.fillStyle = "#fff";
          ctx.shadowColor = "#fff";
          ctx.shadowBlur = 40;
          ctx.beginPath();
          ctx.arc(x, y, 10 + t * 60, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };

  /** Healing effect — green/golden rising sparkles */
  const createHealEffect = (x, y, amount) => {
    const colors = getColors("healing");
    const duration = 1100;
    const startTime = performance.now();
    const particles = [];
    // Sanitize amount: ensure it's a number, default to 0
    const safeAmount = amount ? Math.max(0, Math.floor(Number(amount) || 0)) : null;

    return {
      type: "heal",
      x, y,
      startTime, duration, colors,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        if (t < 0.6) {
          for (let i = 0; i < 3; i++) {
            const ox = (Math.random() - 0.5) * 24;
            particles.push(new Particle(
              x + ox, y + 10,
              (Math.random() - 0.5) * 8, -20 - Math.random() * 30,
              getRandomColor(colors.particles),
              1.5 + Math.random() * 2.5, 0.6 + Math.random() * 0.4,
              -5, 0.99
            ));
          }
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        ctx.save();
        // Glowing aura
        const auraAlpha = t < 0.3 ? t / 0.3 * 0.3 : (t < 0.7 ? 0.3 : 0.3 * (1 - (t - 0.7) / 0.3));
        ctx.globalAlpha = auraAlpha;
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();

        // Healing number
        if (safeAmount !== null) {
          const numAlpha = t < 0.2 ? t / 0.2 : (t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3);
          const numY = y - 20 - t * 25;
          ctx.globalAlpha = numAlpha;
          ctx.font = "bold 16px 'Cinzel', serif";
          ctx.textAlign = "center";
          ctx.fillStyle = colors.primary;
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 8;
          ctx.fillText(`+${safeAmount}`, x, numY);
        }

        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };

  /** Buff/Shield effect — swirling protective aura */
  const createBuffEffect = (x, y, color = "#58aaff") => {
    const duration = 1000;
    const startTime = performance.now();
    const particles = [];

    return {
      type: "buff",
      x, y,
      startTime, duration,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        if (t < 0.5) {
          const a = t * Math.PI * 6 + Math.random();
          particles.push(new Particle(
            x + Math.cos(a) * 20, y + Math.sin(a) * 20,
            -Math.cos(a) * 10, -Math.sin(a) * 10 - 15,
            color, 2 + Math.random() * 2, 0.5 + Math.random() * 0.3
          ));
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        ctx.save();
        const alpha = t < 0.3 ? t / 0.3 : (t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3);
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        // Rotating shield arcs
        const rotAngle = t * Math.PI * 4;
        for (let i = 0; i < 3; i++) {
          const baseAngle = rotAngle + (i * Math.PI * 2 / 3);
          ctx.beginPath();
          ctx.arc(x, y, 18, baseAngle, baseAngle + 1);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };

  /** Damage number floating up from target */
  const createDamageNumber = (x, y, amount, damageType = "untyped", isCrit = false) => {
    const colors = getColors(damageType);
    const duration = 1400;
    const startTime = performance.now();
    // Sanitize amount: ensure it's a number, default to 0
    const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));

    return {
      type: "damageNumber",
      x, y,
      startTime, duration,
      update(now) {
        return (now - startTime) / duration < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        const alpha = t < 0.1 ? t / 0.1 : (t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4);
        const floatY = y - 15 - t * 35;
        const scale = isCrit ? 1.4 : 1;
        const shake = isCrit && t < 0.15 ? Math.sin(t * 80) * 3 : 0;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${Math.round(14 * scale)}px 'Cinzel', serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Shadow/outline
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillText(`-${safeAmount}`, x + 1 + shake, floatY + 1);

        // Main text
        ctx.fillStyle = isCrit ? "#ff4444" : colors.primary;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = isCrit ? 15 : 8;
        ctx.fillText(`-${safeAmount}`, x + shake, floatY);

        if (isCrit) {
          ctx.font = "bold 9px 'Cinzel', serif";
          ctx.fillStyle = "#ffd700";
          ctx.fillText("CRIT!", x, floatY - 14);
        }

        ctx.restore();
      },
    };
  };

  /** Miss indicator */
  const createMissEffect = (x, y) => {
    const duration = 1000;
    const startTime = performance.now();

    return {
      type: "miss",
      x, y,
      startTime, duration,
      update(now) { return (now - startTime) / duration < 1; },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        const alpha = t < 0.1 ? t / 0.1 : (t < 0.5 ? 1 : 1 - (t - 0.5) / 0.5);
        const floatY = y - 15 - t * 25;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold 12px 'Cinzel', serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillText("MISS", x + 1, floatY + 1);
        ctx.fillStyle = "#aaa";
        ctx.fillText("MISS", x, floatY);
        ctx.restore();
      },
    };
  };

  /** Condition applied indicator */
  const createConditionEffect = (x, y, conditionName) => {
    const duration = 1200;
    const startTime = performance.now();
    // Sanitize input: ensure it's a string and truncate to prevent overflow
    const safeName = String(conditionName || "").slice(0, 20).toUpperCase();

    return {
      type: "condition",
      x, y,
      startTime, duration,
      update(now) { return (now - startTime) / duration < 1; },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        const alpha = t < 0.1 ? t / 0.1 : (t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4);
        const floatY = y - 30 - t * 20;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold 10px 'Cinzel', serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#e040fb";
        ctx.shadowColor = "rgba(224,64,251,0.5)";
        ctx.shadowBlur = 8;
        ctx.fillText(safeName, x, floatY);
        ctx.restore();
      },
    };
  };

  /** Shockwave / Thunder effect — expanding ring */
  const createShockwaveEffect = (x, y, radius) => {
    const colors = getColors("thunder");
    const duration = 700;
    const startTime = performance.now();
    const particles = [];

    return {
      type: "shockwave",
      x, y, radius,
      startTime, duration, colors,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        if (t < 0.2) {
          for (let i = 0; i < 5; i++) {
            const a = Math.random() * Math.PI * 2;
            particles.push(new Particle(x, y,
              Math.cos(a) * (50 + Math.random() * 80),
              Math.sin(a) * (50 + Math.random() * 80),
              getRandomColor(colors.particles),
              2 + Math.random() * 3, 0.3 + Math.random() * 0.3, 0, 0.93
            ));
          }
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        ctx.save();
        const ringAlpha = Math.max(0, 1 - t * 1.5);
        const ringR = radius * Math.min(1, t / 0.3);
        ctx.globalAlpha = ringAlpha * 0.5;
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 4 * (1 - t);
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(x, y, ringR, 0, Math.PI * 2);
        ctx.stroke();
        // Second ring
        ctx.globalAlpha = ringAlpha * 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, ringR * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };

  /** Tail whip effect */
  const createTailEffect = (fromX, fromY, toX, toY) => {
    const colors = getColors("bludgeoning");
    const duration = 600;
    const startTime = performance.now();
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const particles = [];

    return {
      type: "tail",
      fromX, fromY, toX, toY,
      startTime, duration, colors, angle,
      particles,
      update(now) {
        const t = (now - startTime) / duration;
        if (t > 0.15 && t < 0.35) {
          for (let i = 0; i < 3; i++) {
            particles.push(new Particle(
              toX + (Math.random() - 0.5) * 10, toY + (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50,
              getRandomColor(colors.particles),
              2 + Math.random() * 3, 0.3 + Math.random() * 0.2
            ));
          }
        }
        particles.forEach(p => p.update(PARTICLE_DT));
        return t < 1;
      },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;
        ctx.save();
        const alpha = t < 0.5 ? 1 : 1 - (t - 0.5) / 0.5;
        ctx.globalAlpha = alpha;
        // Wide sweeping arc
        const progress = Math.min(1, t / 0.25);
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 10;
        const sweepAngle = Math.PI * 0.8;
        ctx.beginPath();
        ctx.arc(fromX, fromY, Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2) * 0.8,
          angle - sweepAngle / 2, angle - sweepAngle / 2 + sweepAngle * progress);
        ctx.stroke();
        ctx.globalAlpha = 1;
        particles.forEach(p => p.draw(ctx));
        ctx.restore();
      },
    };
  };


  // ─── SMART EFFECT PICKER ───────────────────────────────────────────────────
  // Choose the right visual effect based on action name and type

  const createAttackEffect = (fromX, fromY, toX, toY, attackName, damageType) => {
    const name = (attackName || "").toLowerCase();
    const dtype = (damageType || "").toLowerCase();

    // Bite attacks
    if (/bite|maw|jaw|fang/.test(name)) return createBiteEffect(fromX, fromY, toX, toY, attackName);

    // Claw / talon / scratch attacks
    if (/claw|talon|scratch|rake|rend/.test(name)) return createBiteEffect(fromX, fromY, toX, toY, "Claw");

    // Tail attacks
    if (/tail|slam|wing/.test(name)) return createTailEffect(fromX, fromY, toX, toY);

    // Ranged weapon attacks
    if (/longbow|shortbow|crossbow|bow/.test(name)) return createProjectileEffect(fromX, fromY, toX, toY, "piercing", "arrow");
    if (/dart|javelin|spear|throw/.test(name)) return createProjectileEffect(fromX, fromY, toX, toY, dtype || "piercing", "arrow");

    // Magical attacks
    if (/ray|beam|bolt|blast/.test(name)) return createProjectileEffect(fromX, fromY, toX, toY, dtype || "force", "beam");

    // Default melee
    if (dtype === "bludgeoning") return createTailEffect(fromX, fromY, toX, toY);
    if (dtype === "piercing") return createBiteEffect(fromX, fromY, toX, toY, "Stab");

    // Default slash
    return createSlashEffect(fromX, fromY, toX, toY, dtype || "slashing");
  };

  const createSaveEffect = (originX, originY, targetX, targetY, actionName, parsed) => {
    const name = (actionName || "").toLowerCase();
    const breathType = parsed?.breathType;
    const shape = parsed?.shape || "sphere";
    const radius = parsed?.radius || 30;

    // Breath weapons
    if (/breath/.test(name) || breathType) {
      return createBreathEffect(originX, originY, targetX, targetY, shape, radius, breathType || "fire");
    }

    // Frightful Presence / psychic effects
    if (/frightful|fear|gaze/.test(name)) {
      return createShockwaveEffect(originX, originY, radius);
    }

    // AoE saves
    if (shape === "cone") return createBreathEffect(originX, originY, targetX, targetY, "cone", radius, breathType || "fire");
    if (shape === "line") return createBreathEffect(originX, originY, targetX, targetY, "line", radius, breathType || "fire");

    return createExplosionEffect(originX, originY, radius, breathType || "force");
  };


  // ─── DICE ROLLING ANIMATION ────────────────────────────────────────────────

  const createDiceAnimation = (x, y, dieType, result, color = "#ffd54f") => {
    const duration = 1800;
    const startTime = performance.now();
    const bounceCount = 3;
    // Validate inputs
    const safeDieType = Math.max(1, Math.floor(Number(dieType) || 20));
    const safeResult = Math.max(1, Math.min(safeDieType, Math.floor(Number(result) || 1)));

    return {
      type: "diceRoll",
      x, y,
      startTime, duration,
      update(now) { return (now - startTime) / duration < 1; },
      draw(ctx) {
        const t = (performance.now() - startTime) / duration;

        // Bouncing die
        const bounceT = t < 0.4 ? t / 0.4 : 0;
        const bounceY = bounceT > 0 ? Math.abs(Math.sin(bounceT * Math.PI * bounceCount)) * 15 * (1 - bounceT) : 0;
        const shakeX = t < 0.3 ? Math.sin(t * 60) * 3 * (1 - t / 0.3) : 0;
        const rotation = t < 0.3 ? t * 12 : 3.6;

        const dieX = x + shakeX;
        const dieY = y - 25 - bounceY;
        const alpha = t < 0.1 ? t / 0.1 : (t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3);
        const size = 18;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(dieX, dieY);
        ctx.rotate(rotation);

        // Die body
        ctx.fillStyle = "rgba(20,20,32,0.9)";
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;

        if (safeDieType === 20) {
          // d20 — draw as rounded hexagon
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const method = i === 0 ? "moveTo" : "lineTo";
            ctx[method](Math.cos(a) * size * 0.55, Math.sin(a) * size * 0.55);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          // Generic — rounded square
          const halfSize = size * 0.45;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(-halfSize, -halfSize, halfSize * 2, halfSize * 2, 3);
          } else {
            // Fallback for browsers without roundRect support
            ctx.rect(-halfSize, -halfSize, halfSize * 2, halfSize * 2);
          }
          ctx.fill();
          ctx.stroke();
        }

        // Result number
        if (t > 0.25) {
          ctx.rotate(-rotation); // Unrotate for text
          ctx.font = `bold ${safeResult >= 10 ? 10 : 12}px 'Cinzel', serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = safeResult === safeDieType ? "#ffd700" : safeResult === 1 ? "#ef5350" : "#fff";
          ctx.shadowBlur = safeResult === safeDieType ? 15 : 0;
          ctx.fillText(String(safeResult), 0, 1);
        }

        ctx.restore();

        // Die type label
        if (t > 0.3) {
          ctx.save();
          ctx.globalAlpha = alpha * 0.6;
          ctx.font = "8px 'Cinzel', serif";
          ctx.textAlign = "center";
          ctx.fillStyle = "#aaa";
          ctx.fillText(`d${safeDieType}`, dieX, dieY + size * 0.55 + 10);
          ctx.restore();
        }
      },
    };
  };


  // ─── EFFECT MANAGER ────────────────────────────────────────────────────────

  const addEffect = (effect) => {
    if (effect) activeEffects.push(effect);
  };

  const updateAndDrawEffects = (ctx) => {
    if (!ctx) return; // Guard against missing context
    const now = performance.now();
    activeEffects = activeEffects.filter(e => {
      if (!e) return false; // Guard against null effects
      const alive = e.update(now);
      if (alive) e.draw(ctx);
      return alive;
    });
  };

  const clearAllEffects = () => { activeEffects = []; };
  const getActiveEffectCount = () => activeEffects.length;


  // ─── PUBLIC API ────────────────────────────────────────────────────────────

  return {
    // Effect creators
    createSlashEffect,
    createBiteEffect,
    createProjectileEffect,
    createBreathEffect,
    createExplosionEffect,
    createHealEffect,
    createBuffEffect,
    createDamageNumber,
    createMissEffect,
    createConditionEffect,
    createShockwaveEffect,
    createTailEffect,
    createDiceAnimation,

    // Smart pickers
    createAttackEffect,
    createSaveEffect,

    // Manager
    addEffect,
    updateAndDrawEffects,
    clearAllEffects,
    getActiveEffectCount,

    // Data
    DAMAGE_COLORS,
    getColors,
  };
})();
