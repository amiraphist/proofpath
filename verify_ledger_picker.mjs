const previewOrigin = "https://3000-i6wqfxvul3u5oug6kfw86-e78b1efe.us1.manus.computer";
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
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await evaluate("sessionStorage.setItem('proofpath-intro-seen', '1')");
await send("Page.navigate", { url: `${previewOrigin}/?ledger-picker-regression=1` });
await wait(850);

await evaluate(`document.querySelector('.mobile-pencil-trigger')?.click()`);
await wait(160);
await evaluate(`(() => {
  const wallet = Array.from(document.querySelectorAll('.mobile-picker-list .palette-card')).find((item) => item.textContent?.includes('Ledger Nano'));
  if (!wallet) throw new Error('Ledger palette card was not found');
  wallet.click();
})()`);
await wait(160);
await evaluate(`document.querySelector('.mobile-pencil-trigger')?.click()`);
await wait(160);

const before = await evaluate(`(() => ({
  walletPosition: Array.from(document.querySelectorAll('.mobile-picker-list .palette-item')).findIndex((item) => item.textContent?.includes('Ledger Nano')) + 1,
  pickerOpen: Boolean(document.querySelector('.mobile-picker-overlay')),
  swatches: document.querySelectorAll('.mobile-picker-list .ledger-color-dropdown button').length,
  ledgerNodes: Array.from(document.querySelectorAll('.graph-node')).map((node) => ({ text: node.textContent?.replace(/\\s+/g, ' ').trim(), selected: node.classList.contains('is-selected') })),
  ledgerPalette: Array.from(document.querySelectorAll('.mobile-picker-list .palette-item')).map((item) => item.textContent?.replace(/\\s+/g, ' ').trim()),
}))()`);

await evaluate(`(() => {
  const swatch = document.querySelector('[aria-label="Select Cherry Red Ledger color"]');
  if (!swatch) throw new Error('Cherry Red swatch was not found');
  swatch.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'touch', pointerId: 31 }));
  swatch.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerType: 'touch', pointerId: 31 }));
  swatch.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
})()`);
await wait(160);

const after = await evaluate(`(() => ({
  pickerOpen: Boolean(document.querySelector('.mobile-picker-overlay')),
  swatches: document.querySelectorAll('.mobile-picker-list .ledger-color-dropdown button').length,
  selectedCherry: document.querySelector('.mobile-picker-list [aria-label="Select Cherry Red Ledger color"]')?.getAttribute('aria-pressed'),
  deviceSource: document.querySelector('.graph-node--ledger-cherry-red img.ledger-vector')?.getAttribute('src') ?? null,
}))()`);

await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: `${previewOrigin}/?ledger-picker-desktop-regression=1` });
await wait(850);
await evaluate(`(() => {
  const wallet = Array.from(document.querySelectorAll('.tools-panel .palette-card')).find((item) => item.textContent?.includes('Ledger Nano'));
  if (!wallet) throw new Error('Desktop Ledger palette card was not found');
  wallet.click();
})()`);
await wait(160);
const desktopBefore = await evaluate(`(() => ({
  swatches: document.querySelectorAll('.tools-panel .ledger-color-dropdown button').length,
  dropdownVisible: Boolean(document.querySelector('.tools-panel .ledger-color-dropdown')),
}))()`);
await evaluate(`(() => {
  const swatch = document.querySelector('.tools-panel [aria-label="Select Matcha Green Ledger color"]');
  if (!swatch) throw new Error('Matcha Green desktop swatch was not found');
  swatch.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'mouse', pointerId: 41 }));
  swatch.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerType: 'mouse', pointerId: 41 }));
  swatch.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
})()`);
await wait(160);
const desktopAfter = await evaluate(`(() => ({
  swatches: document.querySelectorAll('.tools-panel .ledger-color-dropdown button').length,
  selectedMatcha: document.querySelector('.tools-panel [aria-label="Select Matcha Green Ledger color"]')?.getAttribute('aria-pressed'),
  deviceSource: document.querySelector('.graph-node--ledger-matcha-green img.ledger-vector')?.getAttribute('src') ?? null,
}))()`);

if (before.walletPosition !== 3 || !before.pickerOpen || before.swatches !== 4 || !after.pickerOpen || after.swatches !== 4 || after.selectedCherry !== "true" || !after.deviceSource?.includes("ledger_cherry_red") || !desktopBefore.dropdownVisible || desktopBefore.swatches !== 4 || desktopAfter.swatches !== 4 || desktopAfter.selectedMatcha !== "true" || !desktopAfter.deviceSource?.includes("ledger_matcha_green")) {
  throw new Error(`Ledger picker regression failed: ${JSON.stringify({ before, after, desktopBefore, desktopAfter })}`);
}

console.log(JSON.stringify({ before, after, desktopBefore, desktopAfter }, null, 2));
ws.close();
