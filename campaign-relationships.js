// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN RELATIONSHIP WEB – Interactive D&D Force-Directed Graph
// Self-contained React component for NPC, faction, city & party relationships
// ═══════════════════════════════════════════════════════════════════════════

window.RelationshipWebView = function RelationshipWebView({ data, setData, viewRole }) {
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  const [physics, setPhysics] = React.useState({});
  const [hoveredNode, setHoveredNode] = React.useState(null);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [draggingNode, setDraggingNode] = React.useState(null);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [filters, setFilters] = React.useState({
    factions: true,
    npcs: true,
    cities: true,
    party: true,
    deities: true
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const svgRef = React.useRef(null);
  const physicsRef = React.useRef({});
  const animationRef = React.useRef(null);

  // ─────────────────────────────────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────────────────────────────────
  const T = {
    bg: "#0c0804", bgNav: "#100c08", bgCard: "rgba(18,14,10,0.97)",
    text: "#e8dcc8", textMuted: "#a89878", textFaint: "#6a6050",
    crimson: "#d4433a", crimsonBorder: "rgba(212,67,58,0.15)",
    gold: "#c9a85c", border: "rgba(212,67,58,0.08)",
    heading: "'Cinzel', serif", body: "'Spectral', serif", ui: "'Cinzel', serif"
  };

  const RELATIONSHIP_TYPES = {
    alliance: { label: "Alliance", color: "#2ecc71", style: "solid", weight: 2 },
    rivalry: { label: "Rivalry/War", color: "#e74c3c", style: "dashed", weight: 3 },
    trade: { label: "Trade", color: "#3498db", style: "dotted", weight: 1 },
    membership: { label: "Membership", color: "#95a5a6", style: "solid", weight: 1 },
    location: { label: "Location", color: "#9b59b6", style: "dotted", weight: 0.5 },
    worship: { label: "Worship", color: "#8e44ad", style: "wavy", weight: 2 },
    love: { label: "Love/Marriage", color: "#ff69b4", style: "solid", weight: 2 },
    feud: { label: "Feud", color: "#f39c12", style: "jagged", weight: 2 }
  };

  // ─────────────────────────────────────────────────────────────────────
  // BUILD GRAPH DATA FROM CAMPAIGN
  // ─────────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const newNodes = [];
    const newEdges = [];
    const nodeMap = new Map();

    const SVG_WIDTH = 1200;
    const SVG_HEIGHT = 700;

    // Add faction nodes
    (data.factions || []).forEach(faction => {
      const id = `faction_${faction.id}`;
      nodeMap.set(id, true);
      newNodes.push({
        id,
        type: "faction",
        label: faction.name,
        data: faction,
        x: SVG_WIDTH / 2 + (Math.random() - 0.5) * 200,
        y: SVG_HEIGHT / 2 + (Math.random() - 0.5) * 200,
        vx: 0,
        vy: 0,
        color: faction.color || T.gold,
        radius: 28
      });

      // Faction relationships (allies, rivals)
      if (faction.allies && Array.isArray(faction.allies)) {
        faction.allies.forEach(allyId => {
          const targetId = `faction_${allyId}`;
          newEdges.push({
            source: id,
            target: targetId,
            type: "alliance",
            label: "Allied"
          });
        });
      }
      if (faction.rivals && Array.isArray(faction.rivals)) {
        faction.rivals.forEach(rivalId => {
          const targetId = `faction_${rivalId}`;
          newEdges.push({
            source: id,
            target: targetId,
            type: "rivalry",
            label: "Rivals"
          });
        });
      }
    });

    // Add NPC nodes
    (data.npcs || []).forEach(npc => {
      const id = `npc_${npc.id}`;
      nodeMap.set(id, true);
      const factionColor = (data.factions || []).find(f => f.id === npc.faction)?.color || T.text;

      newNodes.push({
        id,
        type: "npc",
        label: npc.name,
        data: npc,
        x: SVG_WIDTH / 2 + (Math.random() - 0.5) * 300,
        y: SVG_HEIGHT / 2 + (Math.random() - 0.5) * 300,
        vx: 0,
        vy: 0,
        color: factionColor,
        radius: 16
      });

      // NPC to faction membership
      if (npc.faction) {
        newEdges.push({
          source: id,
          target: `faction_${npc.faction}`,
          type: "membership",
          label: "Member of"
        });
      }

      // NPC to location (city)
      if (npc.loc) {
        const cityId = `city_${npc.loc}`;
        if (!nodeMap.has(cityId)) {
          nodeMap.set(cityId, true);
          newNodes.push({
            id: cityId,
            type: "city",
            label: npc.loc,
            data: { name: npc.loc },
            x: SVG_WIDTH / 2 + (Math.random() - 0.5) * 400,
            y: SVG_HEIGHT / 2 + (Math.random() - 0.5) * 400,
            vx: 0,
            vy: 0,
            color: "#d4a574",
            radius: 20
          });
        }
        newEdges.push({
          source: id,
          target: cityId,
          type: "location",
          label: "Located in"
        });
      }
    });

    // Add explicit city nodes from cities list
    (data.cities || []).forEach(city => {
      const cityId = `city_${city.name}`;
      if (!nodeMap.has(cityId)) {
        nodeMap.set(cityId, true);
        newNodes.push({
          id: cityId,
          type: "city",
          label: city.name,
          data: city,
          x: SVG_WIDTH / 2 + (Math.random() - 0.5) * 400,
          y: SVG_HEIGHT / 2 + (Math.random() - 0.5) * 400,
          vx: 0,
          vy: 0,
          color: city.type === "capital" ? "#f1c40f" : "#d4a574",
          radius: city.type === "capital" ? 24 : city.type === "city" ? 20 : 14
        });
      }
    });

    // Add party member nodes (stars)
    (data.party || []).forEach((member, idx) => {
      const id = `party_${idx}`;
      nodeMap.set(id, true);
      newNodes.push({
        id,
        type: "party",
        label: member.name,
        data: member,
        x: 100 + idx * 100,
        y: SVG_HEIGHT - 80,
        vx: 0,
        vy: 0,
        color: "#f1c40f",
        radius: 18
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
    physicsRef.current = Object.fromEntries(newNodes.map(n => [n.id, { x: n.x, y: n.y, vx: n.vx, vy: n.vy }]));
  }, [data]);

  // ─────────────────────────────────────────────────────────────────────
  // PHYSICS SIMULATION – Force-Directed Layout
  // ─────────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (nodes.length === 0) return;

    const SVG_WIDTH = 1200;
    const SVG_HEIGHT = 700;
    const CENTER_X = SVG_WIDTH / 2;
    const CENTER_Y = SVG_HEIGHT / 2;

    const simulate = () => {
      const physics = physicsRef.current;
      const REPULSION = 400;
      const ATTRACTION = 0.05;
      const GRAVITY = 0.08;
      const DAMPING = 0.85;
      const MAX_VEL = 4;

      // Reset forces
      nodes.forEach(node => {
        const p = physics[node.id];
        p.fx = 0;
        p.fy = 0;
      });

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const p1 = physics[n1.id];
          const p2 = physics[n2.id];

          const dx = p2.x - p1.x || 0.001;
          const dy = p2.y - p1.y || 0.001;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = n1.radius + n2.radius + 60;

          if (dist > 0) {
            const force = REPULSION / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            p1.fx -= fx;
            p1.fy -= fy;
            p2.fx += fx;
            p2.fy += fy;
          }
        }
      }

      // Attraction along edges
      edges.forEach(edge => {
        const n1 = nodes.find(n => n.id === edge.source);
        const n2 = nodes.find(n => n.id === edge.target);
        if (!n1 || !n2) return;

        const p1 = physics[n1.id];
        const p2 = physics[n2.id];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
          const force = ATTRACTION * dist;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          p1.fx += fx;
          p1.fy += fy;
          p2.fx -= fx;
          p2.fy -= fy;
        }
      });

      // Gravity toward center
      nodes.forEach(node => {
        const p = physics[node.id];
        const dx = CENTER_X - p.x;
        const dy = CENTER_Y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          p.fx += (dx / dist) * GRAVITY;
          p.fy += (dy / dist) * GRAVITY;
        }
      });

      // Update velocities and positions
      nodes.forEach(node => {
        const p = physics[node.id];
        p.vx = (p.vx + p.fx) * DAMPING;
        p.vy = (p.vy + p.fy) * DAMPING;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_VEL) {
          p.vx = (p.vx / speed) * MAX_VEL;
          p.vy = (p.vy / speed) * MAX_VEL;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounds
        p.x = Math.max(node.radius, Math.min(SVG_WIDTH - node.radius, p.x));
        p.y = Math.max(node.radius, Math.min(SVG_HEIGHT - node.radius, p.y));

        node.x = p.x;
        node.y = p.y;
      });

      setNodes([...nodes]);
    };

    let iterCount = 0;
    const timer = setInterval(() => {
      simulate();
      iterCount++;
      if (iterCount > 150) {
        clearInterval(timer);
      }
    }, 32);

    return () => clearInterval(timer);
  }, [nodes, edges]);

  // ─────────────────────────────────────────────────────────────────────
  // INTERACTION HANDLERS
  // ─────────────────────────────────────────────────────────────────────
  const handleNodeMouseEnter = (nodeId) => setHoveredNode(nodeId);
  const handleNodeMouseLeave = () => setHoveredNode(null);

  const handleNodeClick = (nodeId) => setSelectedNode(selectedNode === nodeId ? null : nodeId);

  const handleNodeMouseDown = (nodeId) => {
    setDraggingNode(nodeId);
  };

  const handleSVGMouseMove = (e) => {
    if (!draggingNode || !svgRef.current) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const physics = physicsRef.current[draggingNode];
    if (physics) {
      physics.x = x;
      physics.y = y;
      physics.vx = 0;
      physics.vy = 0;

      const node = nodes.find(n => n.id === draggingNode);
      if (node) {
        node.x = x;
        node.y = y;
        setNodes([...nodes]);
      }
    }
  };

  const handleSVGMouseUp = () => setDraggingNode(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom * delta));
    setZoom(newZoom);
  };

  const handleSVGContextMenu = (e) => {
    e.preventDefault();
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // ─────────────────────────────────────────────────────────────────────
  // FILTERING & SEARCH
  // ─────────────────────────────────────────────────────────────────────
  const visibleNodes = nodes.filter(n => {
    if (filters[n.type] === false) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return n.label.toLowerCase().includes(term) || (n.data.name && n.data.name.toLowerCase().includes(term));
    }
    return true;
  });

  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
  const visibleEdges = edges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));

  // ─────────────────────────────────────────────────────────────────────
  // RENDER DETAIL PANEL
  // ─────────────────────────────────────────────────────────────────────
  const renderDetailPanel = () => {
    if (!selectedNode) return null;
    const node = nodes.find(n => n.id === selectedNode);
    if (!node) return null;

    const connectedEdges = visibleEdges.filter(e => e.source === node.id || e.target === node.id);
    const connections = connectedEdges.map(e => {
      const other = nodes.find(n => n.id === (e.source === node.id ? e.target : e.source));
      return { edge: e, node: other };
    });

    return (
      <div style={{
        position: "absolute",
        right: 20,
        top: 80,
        width: 320,
        maxHeight: "calc(100% - 100px)",
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "6px",
        padding: "16px",
        overflow: "auto",
        zIndex: 100,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
      }}>
        <div style={{
          fontSize: 18,
          color: T.text,
          fontFamily: T.heading,
          fontWeight: 600,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <div style={{
            width: 16,
            height: 16,
            borderRadius: node.type === "city" ? "2px" : "50%",
            background: node.color,
            opacity: 0.8
          }} />
          {node.label}
        </div>

        <div style={{ fontSize: 11, color: T.textFaint, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
          {node.type.toUpperCase()}
        </div>

        {node.type === "faction" && node.data && (
          <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: T.gold, fontWeight: 600 }}>Power:</span> {node.data.power || "N/A"}
            </div>
            {node.data.hierarchy && node.data.hierarchy.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ color: T.gold, fontWeight: 600, marginBottom: 4 }}>Hierarchy:</div>
                {node.data.hierarchy.map((h, i) => (
                  <div key={i} style={{ paddingLeft: 12, fontSize: 11 }}>
                    {h.name} ({h.role})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {node.type === "npc" && node.data && (
          <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: T.gold, fontWeight: 600 }}>Faction:</span> {node.data.faction || "Independent"}
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: T.gold, fontWeight: 600 }}>Location:</span> {node.data.loc || "Unknown"}
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: T.gold, fontWeight: 600 }}>Role:</span> {node.data.role || "N/A"}
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: T.gold, fontWeight: 600 }}>Attitude:</span> {node.data.attitude || "Neutral"}
            </div>
            {node.data.alive === false && (
              <div style={{ color: T.crimson }}>Deceased</div>
            )}
          </div>
        )}

        {node.type === "party" && node.data && (
          <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: T.gold, fontWeight: 600 }}>Class:</span> {node.data.class || "N/A"}
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: T.gold, fontWeight: 600 }}>Level:</span> {node.data.level || "N/A"}
            </div>
          </div>
        )}

        {connections.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>
              Connections ({connections.length})
            </div>
            {connections.map((conn, i) => {
              const relType = RELATIONSHIP_TYPES[conn.edge.type];
              return (
                <div key={i} style={{
                  fontSize: 11,
                  color: T.textMuted,
                  marginBottom: 6,
                  paddingBottom: 6,
                  borderBottom: i < connections.length - 1 ? `1px solid ${T.border}` : "none"
                }}>
                  <div style={{ color: relType.color, fontWeight: 500, marginBottom: 2 }}>
                    {relType.label}
                  </div>
                  <div style={{ color: T.textFaint }}>
                    {conn.node?.label || "Unknown"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // RENDER SVG GRAPH
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      padding: "20px 40px 36px",
      maxWidth: "100%",
      margin: "0 auto",
      width: "100%"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
          <div style={{
            fontSize: 22,
            color: T.text,
            fontWeight: 400,
            fontFamily: T.body,
            letterSpacing: "0.02em",
            lineHeight: 1.2
          }}>Relationship Web</div>
          <div style={{ fontSize: 12, color: T.textMuted, fontWeight: 300, marginTop: 2 }}>
            {visibleNodes.length} of {nodes.length} entities
          </div>
        </div>

        {/* Search */}
        <div style={{
          flex: "1 1 200px",
          minWidth: 120,
          position: "relative"
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entities…"
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: 13,
              background: T.bgNav,
              border: `1px solid ${T.border}`,
              borderRadius: "3px",
              color: T.text,
              fontFamily: T.body
            }}
          />
        </div>

        {/* Filter Toggles */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginLeft: "auto"
        }}>
          {["factions", "npcs", "cities", "party"].map(type => (
            <button
              key={type}
              onClick={() => setFilters(f => ({ ...f, [type]: !f[type] }))}
              style={{
                padding: "6px 10px",
                fontSize: 11,
                fontFamily: T.ui,
                border: `1px solid ${filters[type] ? T.gold : T.border}`,
                background: filters[type] ? "rgba(201,168,92,0.15)" : "transparent",
                color: filters[type] ? T.gold : T.textFaint,
                borderRadius: "3px",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{
        position: "relative",
        width: "100%",
        height: 700,
        background: "rgba(12, 8, 4, 0.4)",
        border: `1px solid ${T.border}`,
        borderRadius: "6px",
        overflow: "hidden",
        cursor: draggingNode ? "grabbing" : "grab"
      }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            cursor: "inherit"
          }}
          onMouseMove={handleSVGMouseMove}
          onMouseUp={handleSVGMouseUp}
          onMouseLeave={handleSVGMouseUp}
          onWheel={handleWheel}
          onContextMenu={handleSVGContextMenu}
        >
          {/* Define line styles */}
          <defs>
            <style>{`
              .edge-alliance { stroke: #2ecc71; stroke-width: 2; fill: none; }
              .edge-rivalry { stroke: #e74c3c; stroke-width: 3; stroke-dasharray: 5,5; fill: none; }
              .edge-trade { stroke: #3498db; stroke-width: 1; stroke-dasharray: 2,4; fill: none; }
              .edge-membership { stroke: #95a5a6; stroke-width: 1; fill: none; }
              .edge-location { stroke: #9b59b6; stroke-width: 0.5; stroke-dasharray: 2,4; fill: none; opacity: 0.6; }
              .edge-worship { stroke: #8e44ad; stroke-width: 2; fill: none; }
              .edge-love { stroke: #ff69b4; stroke-width: 2; fill: none; }
              .edge-feud { stroke: #f39c12; stroke-width: 2; fill: none; }
            `}</style>
          </defs>

          {/* Edges */}
          {visibleEdges.map((edge, i) => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;

            const relType = RELATIONSHIP_TYPES[edge.type] || RELATIONSHIP_TYPES.trade;
            const highlighted = hoveredNode === edge.source || hoveredNode === edge.target;

            return (
              <line
                key={`edge_${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`edge-${edge.type}`}
                opacity={highlighted ? 1 : 0.6}
                style={{
                  pointerEvents: "none",
                  transition: "opacity 0.2s ease"
                }}
              />
            );
          })}

          {/* Nodes */}
          {visibleNodes.map(node => {
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode === node.id;

            let nodeShape;
            if (node.type === "city") {
              // Diamond for cities
              const s = node.radius;
              nodeShape = (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                  <polygon
                    points={`0,-${s} ${s},0 0,${s} -${s},0`}
                    fill={node.color}
                    stroke={T.gold}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={isHovered || isSelected ? 1 : 0.85}
                    style={{
                      cursor: "pointer",
                      filter: isSelected ? `drop-shadow(0 0 8px ${T.gold}90)` : isHovered ? `drop-shadow(0 0 6px ${T.gold}60)` : "none",
                      transition: "filter 0.2s ease"
                    }}
                    onMouseEnter={() => handleNodeMouseEnter(node.id)}
                    onMouseLeave={handleNodeMouseLeave}
                    onClick={() => handleNodeClick(node.id)}
                    onMouseDown={() => handleNodeMouseDown(node.id)}
                  />
                  <text
                    dy="0.3em"
                    textAnchor="middle"
                    fontSize={10}
                    fill={T.text}
                    fontFamily={T.heading}
                    fontWeight={500}
                    pointerEvents="none"
                  >
                    {node.label.substring(0, 6)}
                  </text>
                </g>
              );
            } else if (node.type === "party") {
              // Star for party members
              const s = node.radius;
              const points = [];
              for (let i = 0; i < 10; i++) {
                const angle = (i * Math.PI) / 5 - Math.PI / 2;
                const r = i % 2 === 0 ? s : s * 0.4;
                points.push([r * Math.cos(angle), r * Math.sin(angle)]);
              }
              nodeShape = (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                  <polygon
                    points={points.map(p => p.join(",")).join(" ")}
                    fill={node.color}
                    stroke={T.gold}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={isHovered || isSelected ? 1 : 0.85}
                    style={{
                      cursor: "pointer",
                      filter: isSelected ? `drop-shadow(0 0 8px ${T.gold}90)` : isHovered ? `drop-shadow(0 0 6px ${T.gold}60)` : "none",
                      transition: "filter 0.2s ease"
                    }}
                    onMouseEnter={() => handleNodeMouseEnter(node.id)}
                    onMouseLeave={handleNodeMouseLeave}
                    onClick={() => handleNodeClick(node.id)}
                    onMouseDown={() => handleNodeMouseDown(node.id)}
                  />
                  <text
                    dy="0.25em"
                    textAnchor="middle"
                    fontSize={9}
                    fill={T.bg}
                    fontFamily={T.heading}
                    fontWeight={600}
                    pointerEvents="none"
                  >
                    {node.label.substring(0, 1)}
                  </text>
                </g>
              );
            } else {
              // Circle for factions & NPCs
              nodeShape = (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                  <circle
                    r={node.radius}
                    fill={node.color}
                    stroke={T.gold}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={isHovered || isSelected ? 1 : 0.85}
                    style={{
                      cursor: "pointer",
                      filter: isSelected ? `drop-shadow(0 0 8px ${T.gold}90)` : isHovered ? `drop-shadow(0 0 6px ${T.gold}60)` : "none",
                      transition: "filter 0.2s ease"
                    }}
                    onMouseEnter={() => handleNodeMouseEnter(node.id)}
                    onMouseLeave={handleNodeMouseLeave}
                    onClick={() => handleNodeClick(node.id)}
                    onMouseDown={() => handleNodeMouseDown(node.id)}
                  />
                  <text
                    dy="0.3em"
                    textAnchor="middle"
                    fontSize={node.type === "faction" ? 12 : 10}
                    fill={T.bg}
                    fontFamily={T.heading}
                    fontWeight={600}
                    pointerEvents="none"
                  >
                    {node.label.substring(0, node.type === "faction" ? 4 : 3)}
                  </text>
                </g>
              );
            }

            return nodeShape;
          })}
        </svg>

        {/* Instructions Overlay */}
        <div style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          fontSize: 10,
          color: T.textFaint,
          fontFamily: T.body,
          opacity: 0.6,
          pointerEvents: "none"
        }}>
          Hover: highlight | Click: details | Drag: move | Scroll: zoom | Right-click: reset
        </div>

        {/* Detail Panel */}
        {renderDetailPanel()}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: 20,
        padding: 16,
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "6px"
      }}>
        <div style={{
          fontSize: 12,
          color: T.gold,
          fontFamily: T.ui,
          fontWeight: 600,
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>Relationship Types</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12
        }}>
          {Object.entries(RELATIONSHIP_TYPES).map(([key, rel]) => (
            <div key={key} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              color: T.textMuted
            }}>
              <svg width="40" height="2" style={{ flexShrink: 0 }}>
                <line
                  x1="0"
                  y1="1"
                  x2="40"
                  y2="1"
                  stroke={rel.color}
                  strokeWidth={rel.weight}
                  strokeDasharray={rel.style === "dashed" ? "5,5" : rel.style === "dotted" ? "2,4" : "none"}
                />
              </svg>
              <span>{rel.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
