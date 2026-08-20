import fs from "node:fs/promises";

const previewOrigin = "https://3000-i6wqfxvul3u5oug6kfw86-e78b1efe.us1.manus.computer";
const outputPath = "/home/ubuntu/webdev-static-assets/proofpath-build07-verified-banner.png";
const targets = await fetch("http://127.0.0.1:9222/json/list").then((response) => response.json());
const target = targets.find((item) => item.type === "page" && item.url.startsWith(previewOrigin));
if (!target) throw new Error("ProofPath preview browser target was not found");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener("open", resolve, { once: true }); ws.addEventListener("error", reject, { once: true }); });
let nextId = 1;
const pending = new Map();
ws.addEventListener("message", async (event) => {
  const raw = typeof event.data === "string" ? event.data : await event.data.text();
  const message = JSON.parse(raw);
  const resolve = pending.get(message.id);
  if (!resolve) return;
  pending.delete(message.id);
  message.error ? resolve(Promise.reject(new Error(message.error.message))) : resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve) => { const id = nextId++; pending.set(id, resolve); ws.send(JSON.stringify({ id, method, params })); });
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
const mouse = (type, x, y, button = "left") => send("Input.dispatchMouseEvent", { type, x, y, button });
const key = async (keyName, code, keyCode) => {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, text: keyName });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
};

await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
await evaluate(`sessionStorage.setItem('proofpath-intro-seen', '1')`);
await send("Page.navigate", { url: `${previewOrigin}/?build07-banner=1` });
await wait(900);

await evaluate(`(() => {
  const select = document.querySelector('select[aria-label="Select stage"]');
  if (!select) throw new Error('Stage selector not found');
  select.value = '6';
  select.dispatchEvent(new Event('change', { bubbles: true }));
})()`);
await wait(180);

for (const label of ["AI Agent", "Check payment", "Multisig quorum", "Ledger Nano™ Gen5", "Send payment"]) {
  await evaluate(`(() => Array.from(document.querySelectorAll('.palette-card')).find((card) => card.textContent.includes(${JSON.stringify(label)}))?.click())()`);
  await wait(100);
}

await evaluate(`(() => {
  const stylesheet = document.createElement('style');
  stylesheet.id = 'build07-social-capture';
  stylesheet.textContent = '\n'
    + '.game-shell { min-height: 900px !important; padding: 22px 46px 0 !important; }\n'
    + '.topbar { min-height: 52px !important; border-bottom: 2px solid var(--ink) !important; }\n'
    + '.brand strong { font-size: 26px !important; letter-spacing: .05em !important; }\n'
    + '.brand small { font-size: 10px !important; }\n'
    + '.game-layout { display: block !important; margin-top: 14px !important; }\n'
    + '.mission-panel { position: absolute !important; top: 35px !important; left: 295px !important; z-index: 4 !important; width: auto !important; min-width: 0 !important; padding: 0 !important; border: 0 !important; box-shadow: none !important; background: transparent !important; }\n'
    + '.mission-panel .eyebrow, .mission-panel .stage-select, .mission-panel .story, .mission-panel .brand-voice, .mission-panel .objective, .mission-panel .lesson, .mission-panel .hardening-challenge, .mission-panel .progress-wrap { display: none !important; }\n'
    + '.mission-panel .severity { display: inline-flex !important; margin: 0 10px 0 0 !important; font-size: 10px !important; }\n'
    + '.mission-panel h1 { display: inline-block !important; margin: 0 !important; font-size: 21px !important; letter-spacing: -.025em !important; }\n'
    + '.mission-panel .client-line { display: inline-block !important; margin: 0 0 0 10px !important; font-size: 10px !important; }\n'
    + '.tools-panel, .play-toolbar, .board-foot, .footer-bar, .topbar-status, .topbar-tools { display: none !important; }\n'
    + '.play-area { width: 100% !important; padding-top: 30px !important; }\n'
    + '.graph-board { flex: none !important; height: 570px !important; border-width: 2px !important; }\n'
    + '.graph-caption { justify-content: center !important; font-size: 12px !important; }\n'
    + '.graph-caption > span:first-child, .graph-caption__keys, .graph-caption__touch-hint { display: none !important; }\n'
    + '.result-banner { width: min(890px, 92%) !important; margin: 14px auto 0 !important; min-height: 86px !important; }\n';
  document.head.appendChild(stylesheet);
})()`);
await wait(260);

const nodeCenter = (label, selector = ".node-head") => evaluate(`(() => {
  const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(${JSON.stringify(label)}));
  const element = node?.querySelector(${JSON.stringify(selector)}) ?? node;
  const rect = element?.getBoundingClientRect();
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
})()`);
const dragTo = async (label, destination) => {
  const start = await nodeCenter(label);
  if (!start) throw new Error(`${label} node could not be found`);
  await mouse("mousePressed", start.x, start.y);
  await mouse("mouseMoved", destination.x, destination.y);
  await mouse("mouseReleased", destination.x, destination.y);
  await wait(120);
};

await dragTo("AI Agent", { x: 400, y: 370 });
await dragTo("Check payment", { x: 580, y: 370 });
await dragTo("Multisig quorum", { x: 760, y: 370 });
await dragTo("Ledger Nano™ Gen5", { x: 940, y: 361 });
await dragTo("Send payment", { x: 1120, y: 370 });

for (const [from, to] of [["AI Agent", "Check payment"], ["Check payment", "Multisig quorum"], ["Multisig quorum", "Ledger Nano™ Gen5"], ["Ledger Nano™ Gen5", "Send payment"]]) {
  const sourceFocused = await evaluate(`(() => { const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(${JSON.stringify(from)})); node?.focus(); return Boolean(node); })()`);
  if (!sourceFocused) throw new Error(`Source node missing for ${from}`);
  await key("c", "KeyC", 67);
  await wait(70);
  const destinationFocused = await evaluate(`(() => { const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(${JSON.stringify(to)})); node?.focus(); return Boolean(node); })()`);
  if (!destinationFocused) throw new Error(`Destination node missing for ${to}`);
  await key("v", "KeyV", 86);
  await wait(80);
}

await evaluate(`document.querySelector('.run-btn')?.click()`);
await wait(260);
const state = await evaluate(`(() => ({
  nodes: Array.from(document.querySelectorAll('.graph-node')).map((node) => node.textContent?.replace(/\\s+/g, ' ').trim()),
  edges: document.querySelectorAll('.edge').length,
  verified: document.querySelector('.success-stamp')?.textContent?.replace(/\\s+/g, ' ').trim(),
  result: document.querySelector('.result-banner')?.textContent?.replace(/\\s+/g, ' ').trim(),
}))()`);
if (state.edges !== 4 || !state.verified || !state.result?.includes("VERIFIED")) throw new Error(`Build 07 was not verified: ${JSON.stringify(state)}`);

await evaluate(`(() => {
  const set = (selector, property, value) => document.querySelectorAll(selector).forEach((element) => element.style.setProperty(property, value, 'important'));
  set('.mission-panel, .tools-panel, .play-toolbar, .board-foot, .footer-bar, .topbar-status, .topbar-tools', 'display', 'none');
  set('.game-layout', 'display', 'block');
  set('.game-layout', 'margin-top', '10px');
  set('.play-area', 'width', '100%');
  set('.play-area', 'padding-top', '0');
  set('.graph-board', 'height', '510px');
  set('.game-shell', 'position', 'relative');
  set('.result-banner', 'width', 'min(860px, 92%)');
  set('.result-banner', 'position', 'fixed');
  set('.result-banner', 'bottom', 'auto');
  set('.result-banner', 'top', '625px');
  set('.result-banner', 'left', '50%');
  set('.result-banner', 'transform', 'translateX(-50%)');
  set('.result-banner', 'transform-origin', 'top center');
  set('.result-banner', 'margin', '0');
  set('.mobile-orb-wrap', 'display', 'block');
  set('.mobile-orb-wrap', 'position', 'fixed');
  set('.mobile-orb-wrap', 'left', '88%');
  set('.mobile-orb-wrap', 'top', '65%');
  set('.mobile-orb-wrap', 'z-index', '50');
  set('.mobile-pencil-trigger', 'display', 'flex');
  set('.mobile-pencil-trigger', 'visibility', 'visible');
  set('.mobile-pencil-trigger', 'opacity', '1');
  set('.mobile-pencil-trigger', 'position', 'absolute');
  set('.mobile-pencil-trigger', 'width', '64px');
  set('.mobile-pencil-trigger', 'height', '64px');
  set('.mobile-pencil-trigger', 'min-width', '64px');
  set('.mobile-pencil-trigger', 'padding', '5px');
  set('.mobile-pencil-trigger', 'flex-direction', 'column');
  set('.mobile-pencil-trigger', 'justify-content', 'center');
  set('.mobile-pencil-trigger', 'gap', '1px');
  set('.mobile-pencil-trigger', 'color', '#153d75');
  set('.mobile-pencil-trigger', 'background', 'rgba(234, 244, 255, .72)');
  set('.mobile-pencil-trigger', 'border', '1.5px solid rgba(255,255,255,.9)');
  set('.mobile-pencil-trigger', 'border-radius', '50%');
  set('.mobile-pencil-trigger', 'box-shadow', '0 8px 21px rgba(27, 61, 106, .24), inset 0 1px 0 rgba(255,255,255,.92)');
  set('.mobile-pencil-trigger', 'backdrop-filter', 'blur(14px) saturate(1.3)');
  document.activeElement?.blur();
  return { layout: getComputedStyle(document.querySelector('.game-layout')).display, tools: getComputedStyle(document.querySelector('.tools-panel')).display };
})()`);
await wait(240);

const captureLayout = await evaluate(`(() => Object.fromEntries(["AI Agent", "Check payment", "Multisig quorum", "Ledger Nano™ Gen5", "Send payment"].map((label) => {
  const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(label));
  const rect = node?.getBoundingClientRect();
  return [label, rect ? { left: Math.round(rect.left), top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) } : null];
})))()`);
const resultLayout = await evaluate(`(() => {
  const element = document.querySelector('.result-banner');
  const rect = element?.getBoundingClientRect();
  const computed = element && getComputedStyle(element);
  return rect && computed ? { left: Math.round(rect.left), top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height), display: computed.display, position: computed.position, visibility: computed.visibility, opacity: computed.opacity, zIndex: computed.zIndex } : null;
})()`);

const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, clip: { x: 0, y: 0, width: 1600, height: 830, scale: 1 } });
await fs.writeFile(outputPath, Buffer.from(screenshot.data, "base64"));
console.log(JSON.stringify({ outputPath, ...state, captureLayout, resultLayout }, null, 2));
ws.close();
