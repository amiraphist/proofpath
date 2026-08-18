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

await send("Page.navigate", { url: pageUrl });
await wait(900);
const result = await evaluate(`(() => {
  const store = window.__MANUS_DEBUG_COLLECTOR__?.store;
  if (!store) return { ready: false };
  store.consoleLogs.length = 0;
  window.dispatchEvent(new ErrorEvent('error', { message: 'extension test', filename: 'moz-extension://test/inpage.js' }));
  const extensionRecorded = store.consoleLogs.some((entry) => entry.args?.[0]?.filename?.startsWith('moz-extension://'));
  window.dispatchEvent(new ErrorEvent('error', { message: 'first-party test', filename: 'https://proofpath.example/app.js' }));
  const firstPartyRecorded = store.consoleLogs.some((entry) => entry.args?.[0]?.filename === 'https://proofpath.example/app.js');
  return { ready: true, extensionRecorded, firstPartyRecorded };
})()`);

if (!result.ready || result.extensionRecorded || !result.firstPartyRecorded) throw new Error(`Extension error filter check failed: ${JSON.stringify(result)}`);
console.log(JSON.stringify(result, null, 2));
ws.close();
