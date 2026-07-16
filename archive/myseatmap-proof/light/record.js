const PWDIR = '/primary/home/n/.npm/_npx/e41f203b7505f1fb/node_modules';
const { chromium } = require(PWDIR + '/playwright');
const path = require('path');
const fs = require('fs');

const OUT = '/tmp/claude-1005/-primary-dev-seatmap-frontend/c64af2b5-64a7-4e15-b425-f8efd7ae25e7/scratchpad/proof-recording';
const SHOTS = path.join(OUT, 'screenshots');
const VIDEO = path.join(OUT, 'video');
fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(VIDEO, { recursive: true });

const BASE = 'https://dev.myseatmap.com';
const FLIGHT = { from: 'LIM', to: 'SCL', date: '2026-07-27', airline: 'LA', flightNo: '2371' };
const VW = 1440, VH = 900;

let step = 0;
const log = (m) => console.log(`[${new Date().toISOString().slice(11,19)}] ${m}`);
const pause = (ms) => new Promise(r => setTimeout(r, ms));
const easeInOut = (t) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;

// ---- injected visible cursor + smooth scrolling (re-runs on every navigation) ----
const INIT = () => {
  if (window.__cur) return; window.__cur = true;
  const style = document.createElement('style');
  style.textContent = 'html{scroll-behavior:smooth}';
  const addStyle = () => (document.head || document.documentElement).appendChild(style);
  const c = document.createElement('div');
  c.id = '__pwcur';
  c.style.cssText = [
    'position:fixed','top:-100px','left:-100px','width:24px','height:24px','border-radius:50%',
    'background:rgba(13,148,136,0.35)','border:2px solid #0d9488','box-shadow:0 1px 6px rgba(0,0,0,.4)',
    'z-index:2147483647','pointer-events:none','transform:translate(-50%,-50%)',
    'transition:width .09s ease,height .09s ease,background .09s ease'
  ].join(';');
  const mount = () => { if (document.body && !document.getElementById('__pwcur')) { document.body.appendChild(c); addStyle(); } };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
  addEventListener('mousedown', () => { c.style.width='14px'; c.style.height='14px'; c.style.background='rgba(13,148,136,0.6)'; }, true);
  addEventListener('mouseup', () => { c.style.width='24px'; c.style.height='24px'; c.style.background='rgba(13,148,136,0.35)'; }, true);
};

async function shot(page, name) {
  step++;
  const file = path.join(SHOTS, `${String(step).padStart(2,'0')}-${name}.png`);
  await page.screenshot({ path: file });
  log(`  screenshot -> ${path.basename(file)}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    recordVideo: { dir: VIDEO, size: { width: VW, height: VH } },
    deviceScaleFactor: 1,
  });
  await context.addInitScript(INIT);
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  // ---- smooth pointer helpers ----
  let cx = VW/2, cy = VH/2;
  async function glide(x, y, dur = 650) {
    const steps = Math.max(18, Math.round(dur/16));
    const sx = cx, sy = cy;
    for (let i = 1; i <= steps; i++) {
      const t = easeInOut(i/steps);
      await page.mouse.move(sx + (x-sx)*t, sy + (y-sy)*t);
      await pause(dur/steps);
    }
    cx = x; cy = y;
  }
  async function glideTo(loc, dur) {
    await loc.scrollIntoViewIfNeeded().catch(()=>{});
    await pause(250);
    const b = await loc.boundingBox();
    if (!b) return false;
    let tx = b.x + b.width/2, ty = b.y + b.height/2;
    tx = Math.max(4, Math.min(VW-4, tx)); ty = Math.max(4, Math.min(VH-4, ty));
    await glide(tx, ty, dur);
    return true;
  }
  async function click(loc, dur) {
    await glideTo(loc, dur);
    await pause(280);
    await loc.click();
    await pause(550);
  }
  async function smoothScroll(toY, settle = 1200) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'smooth' }), toY);
    await pause(settle);
  }
  async function settleNav(dur = 1600) {
    await page.waitForLoadState('networkidle').catch(()=>{});
    // re-center pointer after each navigation so the next glide reads clearly
    cx = VW/2; cy = 220; await page.mouse.move(cx, cy);
    await pause(dur);
  }

  async function pickFromSelector(placeholder, typeText, code) {
    const input = page.getByPlaceholder(placeholder, { exact: true }).first();
    await click(input, 500);
    await input.fill('');
    await input.type(typeText, { delay: 110 });
    await pause(700);
    const option = page.locator('li', { hasText: code }).first();
    await option.waitFor({ state: 'visible', timeout: 8000 });
    await click(option, 450);
  }

  try {
    // 1) INDEX
    log('STEP 1: index / homepage');
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.mouse.move(cx, cy);
    await pause(2000);
    await shot(page, 'index-home');
    await smoothScroll(650, 1600); await shot(page, 'index-scrolled');
    await smoothScroll(0, 1400);

    // 2) PRICING / PLANS
    log('STEP 2: pricing / plans');
    await click(page.getByRole('link', { name: /pricing/i }).first(), 700);
    await page.waitForURL('**/pricing**', { timeout: 20000 });
    await settleNav();
    await shot(page, 'pricing-plans');
    await smoothScroll(700, 1700); await shot(page, 'pricing-scrolled');
    await smoothScroll(0, 1400);

    // 3) DASHBOARD / BOOKMARKS EXAMPLE
    log('STEP 3: dashboard / bookmarks example');
    await click(page.getByRole('link', { name: /dashboard/i }).first(), 700);
    await page.waitForURL('**/dashboard**', { timeout: 20000 });
    await settleNav(2000);
    await shot(page, 'dashboard-bookmarks-example');
    await smoothScroll(600, 1700); await shot(page, 'dashboard-scrolled');
    await smoothScroll(0, 1400);

    // 4) SEARCH
    log('STEP 4: search page');
    await click(page.getByRole('link', { name: /search flights/i }).first(), 700);
    await page.waitForURL('**/search**', { timeout: 20000 });
    await settleNav();
    await shot(page, 'search-empty-form');

    log('  filling form: LIM -> SCL, LA 2371, 2026-07-27');
    await pickFromSelector('From', 'LIM', 'LIM');
    await shot(page, 'search-from-lim');
    await pickFromSelector('To', 'SCL', 'SCL');
    await shot(page, 'search-to-scl');

    const dateInput = page.locator('input[type="date"]').first();
    await glideTo(dateInput, 500);
    await dateInput.fill(FLIGHT.date);
    await pause(700);

    await pickFromSelector('Airline', 'LATAM', 'LA');
    await pause(500);

    const flightNoInput = page.getByPlaceholder('Flight Number', { exact: true }).first();
    await click(flightNoInput, 500);
    await flightNoInput.type(FLIGHT.flightNo, { delay: 130 });
    await pause(700);
    await shot(page, 'search-form-filled');

    log('  submitting search');
    await click(page.getByRole('button', { name: /search flights/i }).first(), 600);

    await page.waitForURL('**/search?**', { timeout: 20000 }).catch(()=>{});
    await page.waitForLoadState('networkidle').catch(()=>{});
    log('  waiting for results...');
    const viewBtns = page.getByRole('button', { name: /view seat map/i });
    await viewBtns.first().waitFor({ state: 'visible', timeout: 45000 });
    const loadingMore = page.locator('text=/loading more/i');
    try { await loadingMore.first().waitFor({ state: 'hidden', timeout: 25000 }); log('  results finished loading'); }
    catch { log('  loading-more still present; proceeding'); }
    await pause(1600);
    await shot(page, 'search-results');

    const directOnly = page.locator('#directOnlyFilter');
    if (await directOnly.count()) {
      const checked = await directOnly.isChecked().catch(()=>false);
      log(`  direct-only filter checked = ${checked} (leaving unchecked)`);
    }

    // choose seat map: prefer connection/layover card, else LA 2371
    const count = await viewBtns.count();
    log(`  ${count} result card(s) with a View Seat Map button`);
    let targetBtn, picked = 'LA 2371 (single non-stop)';
    const connectionCard = page.locator('*', { hasText: /\d+\s*stop/i })
      .filter({ has: page.getByRole('button', { name: /view seat map/i }) }).first();
    if (await connectionCard.count()) {
      log('  found a connection/layover card; using it');
      targetBtn = connectionCard.getByRole('button', { name: /view seat map/i }).first();
      picked = 'connection/layover flight';
    } else {
      log('  no connection/layover card; using LA 2371');
      const c2371 = page.locator('*', { hasText: /2371/ })
        .filter({ has: page.getByRole('button', { name: /view seat map/i }) }).first();
      targetBtn = (await c2371.count()) ? c2371.getByRole('button', { name: /view seat map/i }).first() : viewBtns.first();
    }
    log(`  selecting seat map for: ${picked}`);
    await click(targetBtn, 650);

    // 6) SEAT MAP
    log('STEP 6: seat map render');
    await pause(3500);
    await page.waitForLoadState('networkidle').catch(()=>{});
    await smoothScroll(0, 800);
    await shot(page, 'seatmap-view');
    await smoothScroll(500, 1700); await shot(page, 'seatmap-scrolled');
    await smoothScroll(1000, 1700); await shot(page, 'seatmap-scrolled2');
    await smoothScroll(400, 1200);

    log('DONE: journey complete');
  } catch (err) {
    log('ERROR: ' + err.message);
    try { await shot(page, 'ERROR-state'); } catch {}
    try { fs.writeFileSync(path.join(OUT, 'error-page-text.txt'), (await page.locator('body').innerText()).slice(0,1500)); } catch {}
    process.exitCode = 2;
  } finally {
    await context.tracing.stop({ path: path.join(OUT, 'trace.zip') });
    await context.close();
    await browser.close();
    try {
      const vids = fs.readdirSync(VIDEO).filter(f => f.endsWith('.webm'));
      if (vids.length) { fs.copyFileSync(path.join(VIDEO, vids[0]), path.join(OUT, 'journey.webm')); log('video -> journey.webm'); }
    } catch (e) { log('video copy failed: ' + e.message); }
    log('artifacts in: ' + OUT);
  }
})();
