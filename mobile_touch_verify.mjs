const targets = await fetch("http://127.0.0.1:9222/json/list").then((response) => response.json());
const target = targets.find((item) => item.type === "page" && item.url.includes("3000-i6wqfxvul3u5oug6kfw86-e78b1efe"));

if (!target) throw new Error("GraphOps browser target was not found");

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
await send("Page.navigate", { url: target.url });
await wait(900);

await evaluate(`(() => { const select = document.querySelector('select[aria-label="Select stage"]'); select.value = '13'; select.dispatchEvent(new Event('change', { bubbles: true })); })()`);
await wait(250);

const initial = await evaluate(`(() => { const board = document.querySelector('.graph-board').getBoundingClientRect(); const scene = document.querySelector('.graph-scene'); return { board: { left: board.left, top: board.top, width: board.width, height: board.height }, transform: scene.style.transform, className: scene.className }; })()`);
const blankX = initial.board.left + initial.board.width * 0.5;
const blankY = initial.board.top + initial.board.height * 0.22;

await touch("touchStart", [[blankX, blankY, 1]]);
await touch("touchMove", [[blankX + 58, blankY + 42, 1]]);
await touch("touchEnd", []);
await wait(160);
const panned = await evaluate(`document.querySelector('.graph-scene').style.transform`);

await touch("touchStart", [[blankX - 45, blankY, 1]]);
await touch("touchStart", [[blankX - 45, blankY, 1], [blankX + 45, blankY, 2]]);
await touch("touchMove", [[blankX - 58, blankY - 10, 1], [blankX + 86, blankY + 18, 2]]);
await touch("touchEnd", []);
await wait(160);
const pinched = await evaluate(`({ transform: document.querySelector('.graph-scene').style.transform, zoom: document.querySelector('.mobile-viewport-readout').textContent })`);

const nodeStart = await evaluate(`(() => { const node = document.querySelector('.graph-node'); const rect = node.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, left: node.style.left, top: node.style.top }; })()`);
await touch("touchStart", [[nodeStart.x, nodeStart.y, 1]]);
await touch("touchMove", [[nodeStart.x + 64, nodeStart.y + 52, 1]]);
await touch("touchEnd", []);
await wait(160);
const nodeMoved = await evaluate(`(() => { const node = document.querySelector('.graph-node'); return { left: node.style.left, top: node.style.top }; })()`);

console.log(JSON.stringify({ initial, panned, pinched, nodeStart, nodeMoved }, null, 2));
ws.close();
