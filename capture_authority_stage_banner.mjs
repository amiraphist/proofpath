import fs from "node:fs/promises";

const previewOrigin = "https://3000-i6wqfxvul3u5oug6kfw86-e78b1efe.us1.manus.computer";
const outputPath = "/home/ubuntu/webdev-static-assets/proofpath-build06-authority-banner.png";
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
const click = async (point) => { await mouse("mousePressed", point.x, point.y); await mouse("mouseReleased", point.x, point.y); };
const key = async (keyName, code, keyCode) => {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, text: keyName });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
};

await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
await evaluate(`sessionStorage.setItem('proofpath-intro-seen', '1')`);
await send("Page.navigate", { url: `${previewOrigin}/?build06-banner=1` });
await wait(900);

await evaluate(`(() => {
  const select = document.querySelector('select[aria-label="Select stage"]');
  if (!select) throw new Error('Stage selector not found');
  select.value = '5';
  select.dispatchEvent(new Event('change', { bubbles: true }));
})()`);
await wait(180);

for (const label of ["AI Agent", "Policy guard", "Verify recipient", "Check payment", "Spending limit", "Owner approval", "Ledger Nano™ Gen5", "Send payment"]) {
  await evaluate(`(() => Array.from(document.querySelectorAll('.palette-card')).find((card) => card.textContent.includes(${JSON.stringify(label)}))?.click())()`);
  await wait(110);
}

const nodeCenter = (label, selector = ".node-head") => evaluate(`(() => {
  const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(${JSON.stringify(label)}));
  const element = node?.querySelector(${JSON.stringify(selector)}) ?? node;
  const rect = element?.getBoundingClientRect();
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
})()`);
const portCenter = (label, side) => evaluate(`(() => {
  const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(${JSON.stringify(label)}));
  const port = node?.querySelector(${JSON.stringify(side === 'out' ? '.node-port--right' : '.node-port--left')});
  const rect = port?.getBoundingClientRect();
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
})()`);
const dragTo = async (label, destination) => {
  const start = await nodeCenter(label);
  if (!start) throw new Error(`${label} node could not be found`);
  await mouse("mousePressed", start.x, start.y);
  await mouse("mouseMoved", destination.x, destination.y);
  await mouse("mouseReleased", destination.x, destination.y);
  await wait(130);
};

await dragTo("AI Agent", { x: 410, y: 330 });
await dragTo("Policy guard", { x: 560, y: 330 });
await dragTo("Verify recipient", { x: 710, y: 330 });
await dragTo("Check payment", { x: 860, y: 330 });
await dragTo("Spending limit", { x: 990, y: 500 });
await dragTo("Owner approval", { x: 825, y: 500 });
await dragTo("Ledger Nano™ Gen5", { x: 640, y: 485 });
await dragTo("Send payment", { x: 445, y: 500 });

for (const [from, to] of [["AI Agent", "Policy guard"], ["Policy guard", "Verify recipient"], ["Verify recipient", "Check payment"], ["Check payment", "Spending limit"], ["Spending limit", "Owner approval"], ["Owner approval", "Ledger Nano™ Gen5"], ["Ledger Nano™ Gen5", "Send payment"]]) {
  const sourceFocused = await evaluate(`(() => { const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(${JSON.stringify(from)})); node?.focus(); return Boolean(node); })()`);
  if (!sourceFocused) throw new Error(`Source node missing for ${from}`);
  await key("c", "KeyC", 67);
  await wait(80);
  const destinationFocused = await evaluate(`(() => { const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(${JSON.stringify(to)})); node?.focus(); return Boolean(node); })()`);
  if (!destinationFocused) throw new Error(`Destination node missing for ${to}`);
  await key("v", "KeyV", 86);
  await wait(90);
}

await evaluate(`document.querySelector('.run-btn')?.click()`);
await wait(260);
const state = await evaluate(`(() => ({
  title: document.querySelector('.stage-title')?.textContent?.trim(),
  nodes: Array.from(document.querySelectorAll('.graph-node')).map((node) => node.textContent?.replace(/\\s+/g, ' ').trim()),
  edges: document.querySelectorAll('.edge').length,
  verified: document.querySelector('.success-stamp')?.textContent?.replace(/\\s+/g, ' ').trim(),
  result: document.querySelector('.result-banner')?.textContent?.replace(/\\s+/g, ' ').trim(),
}))()`);
if (state.edges !== 7 || !state.verified || !state.result?.includes("HARDENED")) throw new Error(`Build 06 was not hardened: ${JSON.stringify(state)}`);

await evaluate(`(() => {
  const stylesheet = document.createElement('style');
  stylesheet.id = 'authority-banner-crop';
  stylesheet.textContent = '\n'
    + '.app-shell { max-width: 1450px !important; padding: 14px 22px 22px !important; }\n'
    + '.app-header { margin-bottom: 10px !important; }\n'
    + '.pencil-case, .stage-select-wrap, .sound-toggle, .mode-switch, .controls-row, .stage-progress { display: none !important; }\n'
    + '.game-layout { grid-template-columns: minmax(0, 1fr) !important; }\n'
    + '.game-main { width: 100% !important; }\n'
    + '.game-sidebar { display: none !important; }\n'
    + '.graph-board { flex-basis: 540px !important; }\n'
    + '.mission-card { margin-bottom: 10px !important; }\n'
    + '.stage-story, .mission-card .help-toggle { display: none !important; }\n'
    + '.result-banner { position: relative !important; margin-top: 10px !important; }\n';
  document.head.appendChild(stylesheet);
})()`);
await wait(220);

const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, clip: { x: 0, y: 0, width: 1600, height: 830, scale: 1 } });
await fs.writeFile(outputPath, Buffer.from(screenshot.data, "base64"));
console.log(JSON.stringify({ outputPath, ...state }, null, 2));
ws.close();
