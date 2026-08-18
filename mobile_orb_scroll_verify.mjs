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
const afterTap = await evaluate(`({ expanded: document.querySelector('.mobile-pencil-trigger').getAttribute('aria-expanded'), drawer: Boolean(document.querySelector('.mobile-pencil-drawer')), drawerVisible: document.querySelector('.mobile-pencil-drawer')?.getBoundingClientRect().height ?? 0 })`);

await evaluate(`document.querySelector('.mobile-pencil-close')?.click()`);
await wait(520);
const fixedOrb = await evaluate(`(() => { const button = document.querySelector('.mobile-pencil-trigger'); const rect = button.getBoundingClientRect(); return { expanded: button.getAttribute('aria-expanded'), touchAction: getComputedStyle(button).touchAction, rightGap: Math.round(window.innerWidth - rect.right), bottomGap: Math.round(window.innerHeight - rect.bottom) }; })()`);

console.log(JSON.stringify({ nativeScroll, tapOpenedDrawer: afterTap.expanded === "true" && afterTap.drawerVisible > 0, afterTap, fixedOrb }, null, 2));
ws.close();
