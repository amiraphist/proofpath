const targets = await fetch("http://127.0.0.1:9222/json/list").then((response) => response.json());
const pageUrl = process.env.PROOFPATH_URL ?? "https://3000-i6wqfxvul3u5oug6kfw86-e78b1efe.us1.manus.computer";
const target = targets.find((item) => item.type === "page" && item.url.startsWith(pageUrl));
if (!target) throw new Error("ProofPath browser target was not found");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener("open", resolve, { once: true }); ws.addEventListener("error", reject, { once: true }); });
let nextId = 1;
const pending = new Map();
ws.addEventListener("message", async (event) => { const raw = typeof event.data === "string" ? event.data : await event.data.text(); const message = JSON.parse(raw); const resolve = pending.get(message.id); if (!resolve) return; pending.delete(message.id); message.error ? resolve(Promise.reject(new Error(message.error.message))) : resolve(message.result); });
const send = (method, params = {}) => new Promise((resolve) => { const id = nextId++; pending.set(id, resolve); ws.send(JSON.stringify({ id, method, params })); });
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
const mouse = (type, x, y, buttons = 1) => send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons });

await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: pageUrl });
await wait(800);
await evaluate("sessionStorage.setItem('proofpath-intro-seen', '1'); location.reload()");
await wait(600);

const addLedger = await evaluate(`(() => { const card = [...document.querySelectorAll('.palette-card')].find((item) => item.textContent.includes('Ledger Nano')); card?.click(); return Boolean(card); })()`);
if (!addLedger) throw new Error("Desktop Ledger palette card was not found");
await wait(160);

const start = await evaluate(`(() => { const node = document.querySelector('.graph-node--green'); const rect = node?.getBoundingClientRect(); return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, left: rect.left, top: rect.top } : null; })()`);
if (!start) throw new Error("Desktop Ledger node was not added");
await mouse("mousePressed", start.x, start.y);
await mouse("mouseMoved", start.x + 70, start.y + 38);
await mouse("mouseReleased", start.x + 70, start.y + 38, 0);
await wait(220);
await mouse("mousePressed", start.x + 70, start.y + 38);
await mouse("mouseReleased", start.x + 70, start.y + 38, 0);
await wait(140);

const result = await evaluate(`(() => { const node = document.querySelector('.graph-node--green'); const nodeRect = node?.getBoundingClientRect(); const dropdown = document.querySelector('.tools-panel .ledger-color-dropdown'); const dropdownRect = dropdown?.getBoundingClientRect(); return { nodeMoved: Boolean(nodeRect && (Math.abs(nodeRect.left - ${start.left}) > 20 || Math.abs(nodeRect.top - ${start.top}) > 20)), dropdownInTools: Boolean(dropdown), dropdownOnNode: Boolean(document.querySelector('.graph-node .ledger-color-dropdown')), dropdownWidth: dropdownRect?.width ?? 0, pickerButtons: dropdown?.querySelectorAll('button').length ?? 0 }; })()`);
if (!result.nodeMoved || !result.dropdownInTools || result.dropdownOnNode || result.pickerButtons !== 4 || result.dropdownWidth < 90) throw new Error(`Desktop picker placement check failed: ${JSON.stringify(result)}`);
console.log(JSON.stringify(result, null, 2));
ws.close();
