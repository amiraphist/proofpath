const targets = await fetch("http://127.0.0.1:9222/json/list").then((response) => response.json());
const target = targets.find((item) => item.type === "page" && item.url.includes("3000-i6wqfxvul3u5oug6kfw86-e78b1efe"));

if (!target) throw new Error("ProofPath browser target was not found");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
ws.addEventListener("message", async (event) => {
  const raw = typeof event.data === "string" ? event.data : await event.data.text();
  const message = JSON.parse(raw);
  const resolve = pending.get(message.id);
  if (!resolve) return;
  pending.delete(message.id);
  if (message.error) resolve(Promise.reject(new Error(message.error.message)));
  else resolve(message.result);
});

const send = (method, params = {}) => new Promise((resolve) => {
  const id = nextId++;
  pending.set(id, resolve);
  ws.send(JSON.stringify({ id, method, params }));
});
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
};
const mouse = (type, x, y, button = "left", clickCount = 1) => send("Input.dispatchMouseEvent", { type, x, y, button, clickCount });
const click = async ({ x, y }) => {
  await mouse("mousePressed", x, y);
  await mouse("mouseReleased", x, y);
};
const key = async (keyName, code, keyCode) => {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, text: keyName.toLowerCase() });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
};

await send("Emulation.clearDeviceMetricsOverride");
await evaluate(`sessionStorage.removeItem('proofpath-intro-seen')`);
await send("Page.navigate", { url: target.url });
for (let attempt = 0; attempt < 16; attempt += 1) {
  await wait(180);
  const visible = await evaluate(`Boolean(document.querySelector('.intro-start'))`);
  if (visible) break;
}

const introReady = await evaluate(`(() => ({
  visible: Boolean(document.querySelector('.intro-overlay')),
  startLabel: document.querySelector('.intro-start')?.textContent?.trim() ?? null,
}))()`);
const introStartPoint = await evaluate(`(() => {
  const rect = document.querySelector('.intro-start')?.getBoundingClientRect();
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
})()`);
if (!introStartPoint) throw new Error("Intro start button could not be located");
await click(introStartPoint);
await wait(340);
const introDismissed = await evaluate(`!document.querySelector('.intro-overlay')`);

await evaluate(`(() => {
  const select = document.querySelector('select[aria-label="Select stage"]');
  select.value = '2';
  select.dispatchEvent(new Event('change', { bubbles: true }));
})()`);
await wait(180);

for (const label of ["AI Agent", "Verify recipient", "Ledger Nano™ Gen5", "Send payment"]) {
  await evaluate(`(() => Array.from(document.querySelectorAll('.palette-card')).find((card) => card.textContent.includes(${JSON.stringify(label)}))?.click())()`);
  await wait(90);
}

const portCenter = (label, side) => evaluate(`(() => {
  const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes(${JSON.stringify(label)}));
  const port = node?.querySelector(${JSON.stringify(side === "out" ? ".node-port--right" : ".node-port--left")});
  const rect = port?.getBoundingClientRect();
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height } : null;
})()`);

const agentOut = await portCenter("AI Agent", "out");
const verifyIn = await portCenter("Verify recipient", "in");
if (!agentOut || !verifyIn) throw new Error("Stage 03 ports could not be located");

await mouse("mousePressed", agentOut.x, agentOut.y);
await mouse("mouseMoved", verifyIn.x, verifyIn.y);
await mouse("mouseReleased", verifyIn.x, verifyIn.y);
await wait(120);
const afterDrag = await evaluate(`document.querySelectorAll('.edge').length`);

await click(agentOut);
await wait(60);
await click(verifyIn);
await wait(120);
const afterClick = await evaluate(`document.querySelectorAll('.edge').length`);
const clickNotice = await evaluate(`document.querySelector('.notice-strip')?.textContent ?? null`);
const edgePoint = await evaluate(`(() => {
  const path = document.querySelector('.edge--removable .edge-hit-target');
  if (!path) return null;
  const point = path.getPointAtLength(path.getTotalLength() / 2);
  const svg = path.ownerSVGElement.getBoundingClientRect();
  return { x: svg.left + (point.x / 100) * svg.width, y: svg.top + (point.y / 100) * svg.height };
})()`);
if (edgePoint) await click(edgePoint);
await wait(120);
const afterEdgeRemoval = await evaluate(`document.querySelectorAll('.edge').length`);

await evaluate(`Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes('AI Agent'))?.focus()`);
await key("c", "KeyC", 67);
await evaluate(`Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes('Verify recipient'))?.focus()`);
await key("v", "KeyV", 86);
await wait(120);
const afterKeyboard = await evaluate(`document.querySelectorAll('.edge').length`);
const keyboardNotice = await evaluate(`document.querySelector('.notice-strip')?.textContent ?? null`);

await click(agentOut);
await wait(100);
const rejectedNotice = await evaluate(`(() => {
  const toast = document.querySelector('.notice-strip[role="alert"]');
  return toast ? toast.textContent : null;
})()`);

const outputState = await evaluate(`(() => {
  const node = Array.from(document.querySelectorAll('.graph-node')).find((item) => item.textContent.includes('AI Agent'));
  const port = node?.querySelector('.node-port--right');
  return { occupied: port?.classList.contains('is-occupied'), label: port?.getAttribute('aria-label') };
})()`);

const verifyOut = await portCenter("Verify recipient", "out");
const ledgerIn = await portCenter("Ledger Nano™ Gen5", "in");
const ledgerOut = await portCenter("Ledger Nano™ Gen5", "out");
const paymentIn = await portCenter("Send payment", "in");
if (!verifyOut || !ledgerIn || !ledgerOut || !paymentIn) throw new Error("Stage 03 completion ports could not be located");
await click(verifyOut); await click(ledgerIn);
await click(ledgerOut); await click(paymentIn);
await wait(120);
await evaluate(`document.querySelector('.run-btn')?.click()`);
await wait(160);
const successCelebration = await evaluate(`(() => ({
  stamp: document.querySelector('.success-stamp')?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
  nextMission: document.querySelector('.result-banner button')?.textContent?.trim() ?? null,
}))()`);
const accessibility = await evaluate(`(() => ({
  nodeKeyboard: document.querySelector('.graph-node')?.getAttribute('aria-keyshortcuts'),
  nodeLabel: document.querySelector('.graph-node')?.getAttribute('aria-label'),
  paletteLabels: Array.from(document.querySelectorAll('.palette-card')).map((card) => card.getAttribute('aria-label')),
  removeEdgeControl: Boolean(document.querySelector('[aria-label^="Remove blue pen line"]')),
}))()`);

await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await wait(120);
const mobilePort = await portCenter("AI Agent", "out");
await send("Emulation.clearDeviceMetricsOverride");

console.log(JSON.stringify({
  dragCreatedEdge: afterDrag > 0,
  introReady,
  introDismissed,
  clickCreatedEdge: afterClick === 1,
  clickNotice,
  edgeRemoved: afterEdgeRemoval === 0,
  keyboardCreatedEdge: afterKeyboard === 1,
  keyboardNotice,
  rejectedNotice,
  desktopPort: { width: agentOut.width, height: agentOut.height },
  mobilePort: { width: mobilePort?.width, height: mobilePort?.height },
  outputState,
  accessibility,
  guidance: await evaluate(`document.querySelector('.graph-caption__hint')?.textContent`),
  successCelebration,
}, null, 2));

ws.close();
