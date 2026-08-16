// GraphOps style reminder: Paper Playground, black ink action cards, blue pen lines, English-only friendly learning voice.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Activity, ArrowRight, Check, ChevronDown, CircleHelp, Cpu, GitBranch, LockKeyhole, Play, RotateCcw, ScanLine, ShieldCheck, Sparkles, Volume2, VolumeX, Wrench, X } from "lucide-react";
import { useGameSession } from "@/game/useGameSession";
import { useSoundEffects } from "@/game/useSoundEffects";
import { nodeMeta, type GameMode, type NodeType } from "@/game/stages";
import type { GraphNode } from "@/game/types";

const iconFor = (type: NodeType) => {
  const Icon = type === "condition" ? ShieldCheck : type === "approval" ? LockKeyhole : type === "tool" ? Wrench : type === "agent" ? Cpu : type === "retry" ? RotateCcw : type === "stop" ? X : type === "end" ? Check : Activity;
  return <Icon size={14} strokeWidth={2.2} />;
};

function NodeCard({ node, selected, source, onSelect, onRemove, onStartDrag, onPort }: { node: GraphNode; selected: boolean; source: boolean; onSelect: () => void; onRemove: () => void; onStartDrag: (event: ReactPointerEvent<HTMLDivElement>) => void; onPort: (direction: "in" | "out") => void }) {
  const meta = nodeMeta[node.type];
  return (
    <div data-node-id={node.id} className={`graph-node graph-node--${meta.color} ${selected ? "is-selected" : ""} ${source ? "is-source" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={onSelect} onPointerDown={onStartDrag} role="button" tabIndex={0} aria-label={`${meta.label}. ${meta.help}`}>
      <button className="node-port node-port--left" aria-label={`Connect into ${meta.label}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onPort("in"); }} />
      <span className="node-head"><span className="node-icon">{iconFor(node.type)}</span><span className="node-type">{meta.short}</span><button className="node-close" aria-label={`Remove ${meta.label}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onRemove(); }}><X size={12} /></button></span>
      <span className="node-title">{meta.label}</span>
      <span className="node-id">{node.id.replace("-", " · ")}</span>
      <button className="node-port node-port--right" aria-label={`Connect from ${meta.label}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onPort("out"); }} />
    </div>
  );
}

function GraphBoard({ nodes, edges, selectedNodeId, onSelect, onRemove, onMove, onConnect, onSound }: { nodes: GraphNode[]; edges: { id: string; from: string; to: string; state: string }[]; selectedNodeId: string | null; onSelect: (id: string) => void; onRemove: (id: string) => void; onMove: (id: string, x: number, y: number) => void; onConnect: (from: string, to: string) => void; onSound: (name: "tap" | "connect-start" | "connect-done" | "error" | "delete") => void }) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [connectionSource, setConnectionSource] = useState<string | null>(null);
  const [portPoints, setPortPoints] = useState<Record<string, { input: [number, number]; output: [number, number] }>>({});

  useLayoutEffect(() => {
    const measure = () => {
      const board = boardRef.current;
      if (!board) return;
      const boardRect = board.getBoundingClientRect();
      const next: Record<string, { input: [number, number]; output: [number, number] }> = {};
      nodes.forEach((node) => {
        const element = board.querySelector<HTMLElement>(`[data-node-id="${node.id}"]`);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const y = ((rect.top + rect.height / 2 - boardRect.top) / boardRect.height) * 100;
        const inputX = ((rect.left - boardRect.left) / boardRect.width) * 100;
        const outputX = ((rect.right - boardRect.left) / boardRect.width) * 100;
        next[node.id] = { input: [inputX, y], output: [outputX, y] };
      });
      setPortPoints(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (boardRef.current) observer.observe(boardRef.current);
    return () => observer.disconnect();
  }, [nodes]);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>, node: GraphNode) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest(".node-port, .node-close")) return;
    const rect = boardRef.current?.getBoundingClientRect(); if (!rect) return;
    const pointX = ((event.clientX - rect.left) / rect.width) * 100;
    const pointY = ((event.clientY - rect.top) / rect.height) * 100;
    dragRef.current = { id: node.id, offsetX: pointX - node.x, offsetY: pointY - node.y };
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    onSelect(node.id);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.min(92, Math.max(4, ((event.clientX - rect.left) / rect.width) * 100 - dragRef.current.offsetX));
    const y = Math.min(88, Math.max(12, ((event.clientY - rect.top) / rect.height) * 100 - dragRef.current.offsetY));
    onMove(dragRef.current.id, x, y);
  };
  const stopDrag = () => { dragRef.current = null; };
  const handlePort = (nodeId: string, direction: "in" | "out") => {
    if (direction === "out") { setConnectionSource(nodeId); onSound("connect-start"); }
    else if (connectionSource) { onConnect(connectionSource, nodeId); setConnectionSource(null); onSound("connect-done"); }
    else onSound("error");
  };
  return (
    <div className={`graph-board ${connectionSource ? "is-connecting" : ""}`} ref={boardRef} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
      <div className="graph-grid" />
      <div className="graph-caption"><span><ScanLine size={13} /> PAPER PATH</span><span className="graph-caption__hint">{connectionSource ? "Now click the next blue dot" : "Drag cards · connect blue pen dots"}</span></div>
      <svg className="graph-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="cyan-glow"><feGaussianBlur stdDeviation="0.8" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="route-cyan" x1="0" x2="1"><stop offset="0" stopColor="#38e8ff" stopOpacity=".25" /><stop offset=".5" stopColor="#38e8ff" /><stop offset="1" stopColor="#9a7cff" /></linearGradient>
        </defs>
        {edges.map((edge, index) => {
          const from = nodeById.get(edge.from); const to = nodeById.get(edge.to); if (!from || !to) return null;
          const start = portPoints[edge.from]?.output; const finish = portPoints[edge.to]?.input; if (!start || !finish) return null;
          const [x1, y1] = start; const [x2, y2] = finish; const bend = Math.max(5, Math.abs(x2 - x1) * .34);
          return <g key={edge.id} className={`edge edge--${edge.state}`}><path d={`M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`} /><circle cx={x1 + (x2 - x1) * .48} cy={y1 + (y2 - y1) * .48} r=".7" className="edge-pulse" style={{ animationDelay: `${index * 180}ms` }} /></g>;
        })}
      </svg>
      <div className="graph-entry"><span className="entry-arrow">→</span><span><strong>Message enters</strong><small>your story starts here</small></span></div>
      <div className="graph-target"><span><strong>Safe result</strong><small>your idea ends here</small></span><span className="entry-arrow">→</span></div>
      {nodes.map((node) => <NodeCard key={node.id} node={node} selected={selectedNodeId === node.id} source={connectionSource === node.id} onSelect={() => { onSelect(node.id); onSound("tap"); }} onRemove={() => { onRemove(node.id); onSound("delete"); }} onStartDrag={(event) => startDrag(event, node)} onPort={(direction) => handlePort(node.id, direction)} />)}
      {nodes.length === 0 && <div className="graph-empty"><Sparkles size={16} /> Pick a card from the pencil case</div>}
    </div>
  );
}

function ModeSwitch({ mode }: { mode: GameMode }) {
  return <div className="mode-switch" role="group" aria-label="Stage mode"><button className={mode === "build" ? "is-active" : ""} disabled={mode !== "build"}><GitBranch size={15} /> Build</button><button className={mode === "fix" ? "is-active" : ""} disabled={mode !== "fix"}><Wrench size={15} /> Fix</button></div>;
}

export default function GameCanvas() {
  const ambientRef = useRef<HTMLCanvasElement>(null);
  const { mode, stage, stageIndex, session, stages, totalCompleted, selectStage, selectNode, moveNode, connectNodes, addNode, removeNode, repair, run, reset, nextStage } = useGameSession();
  const { muted, setMuted, play } = useSoundEffects();

  useEffect(() => {
    if (session.result) play(session.result.ok ? "success" : "error");
  }, [session.result, play]);

  useEffect(() => {
    const telegramApp = (window as any).Telegram?.WebApp;
    telegramApp?.ready?.();
    telegramApp?.expand?.();
    telegramApp?.setHeaderColor?.("#fffefb");
    telegramApp?.setBackgroundColor?.("#fffefb");
    const canvas = ambientRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0; let width = 0; let height = 0;
    const dots = Array.from({ length: 34 }, (_, i) => ({ x: (i * 71) % 1000, y: (i * 43) % 700, r: i % 3 === 0 ? 1.4 : .7, a: .12 + (i % 4) * .04 }));
    const resize = () => { width = canvas.width = window.innerWidth * devicePixelRatio; height = canvas.height = window.innerHeight * devicePixelRatio; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
    const draw = (time: number) => { const w = window.innerWidth; const h = window.innerHeight; ctx.clearRect(0, 0, w, h); dots.forEach((dot, i) => { const x = (dot.x + time * .004 * (i % 2 ? 1 : -.5)) % (w + 80) - 40; const y = (dot.y % h); ctx.fillStyle = `rgba(56,232,255,${dot.a})`; ctx.beginPath(); ctx.arc(x, y, dot.r, 0, Math.PI * 2); ctx.fill(); }); raf = requestAnimationFrame(draw); };
    resize(); window.addEventListener("resize", resize); raf = requestAnimationFrame(draw); return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <main className="game-shell">
    <canvas className="ambient-canvas" ref={ambientRef} aria-hidden="true" />
    <header className="topbar"><div className="brand"><div className="brand-mark"><span /><span /></div><div><strong>GRAPH<span>OPS</span></strong><small>agent systems lab</small></div></div><div className="topbar-status"><span className="status-dot" /> SIMULATION ONLINE <span className="topbar-divider" /> <span>v0.1.0</span></div><div className="topbar-tools"><button className="sound-toggle" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Turn sounds on" : "Mute sounds"}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button><button className="help-button" aria-label="How to play"><CircleHelp size={18} /></button></div></header>
    <div className="game-layout">
      <aside className="mission-panel glass-panel"><div className="eyebrow"><span className="eyebrow-line" /> MISSION CONTROL</div><div className="stage-select"><div><span className="muted-label">CURRENT STAGE</span><strong>{String(stage.id).padStart(2, "0")} <span>/ 16</span></strong></div><select value={stageIndex} onChange={(event) => selectStage(Number(event.target.value))} aria-label="Select stage">{stages.map((item, index) => <option key={item.id} value={index}>{String(item.id).padStart(2, "0")} — {item.title}</option>)}</select><ChevronDown size={15} /></div><div className={`severity severity--${stage.severity}`}><span /> {stage.severity.toUpperCase()} RISK</div><h1>{stage.title}</h1><p className="client-line">CASE FILE <span>·</span> {stage.client}</p><p className="story">{stage.story}</p><p className="brand-voice">“The agent did exactly what you allowed. That is the bug.”</p><div className="objective"><span className="objective-icon"><ScanLine size={17} /></span><div><span className="muted-label">OBJECTIVE</span><p>{stage.objective}</p></div></div><div className="lesson"><span className="muted-label">TAKEAWAY</span><p>{stage.lesson}</p></div><div className="progress-wrap"><div className="progress-label"><span>PROGRESS</span><strong>{totalCompleted} / 16</strong></div><div className="progress-bar"><span style={{ width: `${Math.max(4, (totalCompleted / 16) * 100)}%` }} /></div></div></aside>
      <section className="play-area"><div className="play-toolbar"><div className="play-brief"><span className="play-brief__signal" /> <span>DRAW THE IDEA. THEN SEE WHAT IT DOES.</span></div><div className="play-toolbar__right"><ModeSwitch mode={mode} /><div className="toolbar-actions"><button className="ghost-btn" onClick={() => reset()}><RotateCcw size={14} /> Reset</button><button className="run-btn" onClick={run}><Play size={14} fill="currentColor" /> Test my idea <ArrowRight size={14} /></button></div></div></div><GraphBoard nodes={session.nodes} edges={session.edges} selectedNodeId={session.selectedNodeId} onSelect={(id) => selectNode(id)} onRemove={removeNode} onMove={moveNode} onConnect={connectNodes} onSound={play} /><div className="board-foot"><span><span className="legend-dot legend-dot--cyan" /> Blue pen line</span><span><span className="legend-dot legend-dot--red" /> Needs fixing</span><span><span className="legend-dot legend-dot--amber" /> Human choice</span><span className="board-foot__shortcut">Tap a card to read it · × removes it</span></div></section>
      <aside className="tools-panel glass-panel"><div className="tools-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> PENCIL CASE</div><h2>Pick your cards</h2></div><span className="tool-count">{session.nodes.length} nodes</span></div><p className="tools-copy">{mode === "fix" ? "Find the wobbly blue pen line, fix the missing idea, or use the gentle repair hint." : "Pick only the cards this little story needs. Keep it simple."}</p><div className="interaction-guide"><span className="guide-step"><b>1</b> Pick a card</span><span className="guide-arrow">→</span><span className="guide-step"><b>2</b> Join blue dots</span><span className="guide-arrow">→</span><span className="guide-step"><b>3</b> Test it</span></div><div className="palette-heading"><span>AVAILABLE NODES</span><small>Tap + to add</small></div><div className="palette">{stage.available.map((type) => <button key={type} className={`palette-card palette-card--${nodeMeta[type].color}`} onClick={() => { addNode(type); play("tap"); }}><span className="palette-icon">{iconFor(type)}</span><span><strong>{nodeMeta[type].label}</strong><small>{nodeMeta[type].help}</small></span><span className="palette-plus">+</span></button>)}</div>{mode === "fix" && <button className="repair-btn" onClick={repair}><Wrench size={14} /> Apply safe repair</button>}<div className="trace-panel"><div className="trace-heading"><span><Activity size={14} /> INCIDENT TAPE</span><span className="trace-live">LIVE</span></div><div className="trace-list">{session.result?.trace.map((event) => <div key={`${event.time}-${event.label}`} className={`trace-event trace-event--${event.tone}`}><time>{event.time}</time><span><strong>{event.label}</strong>{event.detail}</span></div>) ?? <div className="trace-empty"><span className="trace-cursor" /> Awaiting simulation input...</div>}</div></div></aside>
    </div>
    {session.result && <div className={`result-banner ${session.result.ok ? "result-banner--success" : "result-banner--danger"}`}><div className="result-symbol">{session.result.ok ? <Check size={20} /> : <X size={20} />}</div><div><strong>{session.result.ok ? "SYSTEM VERIFIED" : "RUN BLOCKED"}</strong><span>{session.result.summary}</span></div><div className="result-score"><small>SCORE</small><strong>{session.result.score}</strong></div>{session.result.ok && stageIndex < stages.length - 1 && <button onClick={nextStage}>Next stage <ArrowRight size={14} /></button>}</div>}
    <footer className="footer-bar"><span>GRAPHOPS / TRAINING ENVIRONMENT</span><span>NO REAL PAYMENTS · SIMULATION ONLY</span><span>ENGLISH MODE <span className="footer-dot" /></span></footer>
  </main>;
}
