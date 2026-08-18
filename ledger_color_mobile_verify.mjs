const targets = await fetch("http://127.0.0.1:9222/json/list").then((response) => response.json());
const pageUrl = process.env.PROOFPATH_URL ?? "https://3000-i6wqfxvul3u5oug6kfw86-e78b1efe.us1.manus.computer";
const target = targets.find((item) => item.type === "page" && item.url.startsWith(pageUrl));

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
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
const touch = (type, points) => send("Input.dispatchTouchEvent", { type, touchPoints: points.map(([x, y, id]) => ({ x, y, id, radiusX: 1, radiusY: 1, force: 1 })) });

await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await send("Page.navigate", { url: pageUrl });
await wait(950);
await evaluate("sessionStorage.setItem('proofpath-intro-seen', '1'); location.reload()");
await wait(650);

const ledgerCard = await evaluate(`(() => { const card = [...document.querySelectorAll('.mobile-picker-list .palette-card')].find((item) => item.textContent.includes('Ledger Nano')); if (!card) return null; const rect = card.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
if (ledgerCard) throw new Error("The mobile picker should be closed before opening Nodes");

const orb = await evaluate(`(() => { const button = document.querySelector('.mobile-pencil-trigger'); const rect = button.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
await touch("touchStart", [[orb.x, orb.y, 1]]);
await touch("touchEnd", []);
await wait(220);

const paletteLedger = await evaluate(`(() => { const card = [...document.querySelectorAll('.mobile-picker-list .palette-card')].find((item) => item.textContent.includes('Ledger Nano')); if (!card) return null; const rect = card.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
if (!paletteLedger) throw new Error("Ledger card was not visible in the mobile Nodes picker");
await touch("touchStart", [[paletteLedger.x, paletteLedger.y, 1]]);
await touch("touchEnd", []);
await wait(260);

const selectedLedger = await evaluate(`(() => { const device = document.querySelector('.graph-node--green'); if (device && !device.classList.contains('is-selected')) device.click(); const rect = device?.getBoundingClientRect(); return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null; })()`);
if (!selectedLedger) throw new Error("Ledger node was not added to the mobile board");
await wait(120);

await touch("touchStart", [[orb.x, orb.y, 1]]);
await touch("touchEnd", []);
await wait(220);

const picker = await evaluate(`(() => { const button = document.querySelector('.mobile-picker-list [aria-label="Select Glacier White Ledger color"]'); const rect = button?.getBoundingClientRect(); return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null; })()`);
if (!picker) throw new Error("Mobile Ledger color picker did not open");
await touch("touchStart", [[picker.x, picker.y, 1]]);
await touch("touchEnd", []);
await wait(200);

const result = await evaluate(`(() => ({ pickerVisible: Boolean(document.querySelector('.mobile-picker-list .ledger-color-dropdown')), pickerInsideList: Boolean(document.querySelector('.mobile-picker-list .ledger-color-dropdown')), pickerOnNode: Boolean(document.querySelector('.graph-node .ledger-color-dropdown')), source: document.querySelector('.ledger-vector')?.getAttribute('src') ?? '', ports: document.querySelectorAll('.graph-node--green .node-port').length, notice: document.querySelector('.notice-strip')?.textContent ?? '' }))()`);
if (!result.source.includes('ledger_glacier_white')) throw new Error(`Expected the Glacier White SVG source, received: ${result.source}`);
if (!result.pickerInsideList || result.pickerOnNode) throw new Error("Mobile color dropdown was not placed exclusively in the Nodes list");
console.log(JSON.stringify(result, null, 2));
ws.close();
