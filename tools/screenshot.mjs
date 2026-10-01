import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os"; import { join } from "node:path";
const [url, out, wait = "15000"] = process.argv.slice(2);
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",
  ["--headless=new", "--remote-debugging-port=9333", "--window-size=1920,1080", "--hide-scrollbars",
   "--user-data-dir=" + mkdtempSync(join(tmpdir(), "cdp")), "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let targets; for (let i = 0; i < 40; i++) { try { targets = await (await fetch("http://127.0.0.1:9333/json")).json(); break; } catch { await sleep(250); } }
const page = targets.find(t => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (pending[m.id]) { pending[m.id](m.result); delete pending[m.id]; } };
const send = (method, params = {}) => new Promise(r => { pending[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url });
await sleep(+wait);
const st = await send("Runtime.evaluate", { expression: "document.images.length + ' imgs, stage=' + document.getElementById('stage').className", returnByValue: true });
console.log(st.result.value);
const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 85 });
writeFileSync(out, Buffer.from(shot.data, "base64")); console.log("saved", out);
ws.close(); chrome.kill();
