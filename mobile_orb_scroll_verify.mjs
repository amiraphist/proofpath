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
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
};
const touch = (type, points) => send("Input.dispatchTouchEvent", { type, touchPoints: points.map(([x, y, id]) => ({ x, y, id, radiusX: 1, radiusY: 1, force: 1 })) });

await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await send("Page.navigate", { url: pageUrl });
await wait(850);

const board = await evaluate(`(() => { const rect = document.querySelector('.graph-board').getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + 170 }; })()`);
await touch("touchStart", [[board.x, board.y, 1]]);
await touch("touchMove", [[board.x, board.y - 125, 1]]);
await touch("touchEnd", []);
await wait(180);
const nativeScroll = await evaluate(`window.scrollY`);

await evaluate(`window.scrollTo(0, 0)`);
await wait(100);
const orb = await evaluate(`(() => { const rect = document.querySelector('.mobile-pencil-trigger').getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, before: document.querySelector('.mobile-pencil-trigger').getAttribute('aria-expanded') }; })()`);
await touch("touchStart", [[orb.x, orb.y, 1]]);
await touch("touchEnd", []);
await wait(220);
const afterTap = await evaluate(`({ expanded: document.querySelector('.mobile-pencil-trigger').getAttribute('aria-expanded'), picker: Boolean(document.querySelector('.mobile-picker-sheet')), pickerVisible: document.querySelector('.mobile-picker-sheet')?.getBoundingClientRect().height ?? 0 })`);

const firstCard = await evaluate(`(() => { const card = document.querySelector('.mobile-picker-list .palette-card'); if (!card) return null; const rect = card.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
if (!firstCard) throw new Error("Nodes picker did not expose a selectable card after tap");
await touch("touchStart", [[firstCard.x, firstCard.y, 1]]);
await touch("touchEnd", []);
await wait(240);
const afterPick = await evaluate(`({ pickerOpen: Boolean(document.querySelector('.mobile-picker-sheet')), nodeCount: document.querySelectorAll('.graph-node').length, notice: document.querySelector('.notice-strip')?.textContent ?? null })`);

await evaluate(`(() => { const select = document.querySelector('.stage-select select'); select.value = '8'; select.dispatchEvent(new Event('change', { bubbles: true })); })()`);
await wait(180);
const fixOrb = await evaluate(`(() => { const rect = document.querySelector('.mobile-pencil-trigger').getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
await touch("touchStart", [[fixOrb.x, fixOrb.y, 1]]);
await touch("touchEnd", []);
await wait(140);
const fixPicker = await evaluate(`({ stage: document.querySelector('.client-line')?.textContent ?? null, pickerOpen: Boolean(document.querySelector('.mobile-picker-sheet')), cards: document.querySelectorAll('.mobile-picker-list .palette-card').length })`);
await evaluate(`document.querySelector('.mobile-picker-close')?.click()`);
await wait(120);

const beforeDrag = await evaluate(`(() => { const orb = document.querySelector('.mobile-orb-wrap'); const button = document.querySelector('.mobile-pencil-trigger'); return { left: orb.style.left, top: orb.style.top, expanded: button.getAttribute('aria-expanded') }; })()`);
const dragOrb = await evaluate(`(() => { const rect = document.querySelector('.mobile-pencil-trigger').getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
await touch("touchStart", [[dragOrb.x, dragOrb.y, 1]]);
await wait(360);
await touch("touchMove", [[dragOrb.x - 58, dragOrb.y - 34, 1]]);
await touch("touchEnd", []);
await wait(160);
const afterDrag = await evaluate(`(() => { const orb = document.querySelector('.mobile-orb-wrap'); const button = document.querySelector('.mobile-pencil-trigger'); return { left: orb.style.left, top: orb.style.top, expanded: button.getAttribute('aria-expanded') }; })()`);

const movedOrb = beforeDrag.left !== afterDrag.left || beforeDrag.top !== afterDrag.top;

console.log(JSON.stringify({ nativeScroll, tapOpenedPicker: afterTap.expanded === "true" && afterTap.pickerVisible > 0, afterTap, afterPick, fixPicker, beforeDrag, afterDrag, movedOrb, longPressMs: 360 }, null, 2));
ws.close();
