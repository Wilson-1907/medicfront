/**
 * Smoke test: navigation links, patient click → detail, dashboard cards.
 * Usage: node smoke/patient-click.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || process.env.SMOKE_URL || 'https://medicfront-neon.vercel.app';
const API = process.env.SMOKE_API || 'https://medicback.onrender.com';

const failures = [];

function fail(msg) {
    failures.push(msg);
    console.error('FAIL:', msg);
}

async function waitForAppSettled(page) {
    await page.waitForTimeout(600);
}

async function expectPatientDetail(page, label) {
    const back = page.locator('a.patient-back-link, button[data-action="switch-tab"][data-tab="patients"]');
    try {
        await back.first().waitFor({ state: 'visible', timeout: 60000 });
        console.log('OK:', label);
        return true;
    } catch {
        const appHtml = await page.locator('#app').innerHTML().catch(() => '');
        fail(
            `${label} — detail did not open. snippet: ${appHtml.slice(0, 240)}`
        );
        return false;
    }
}

async function main() {
    console.log('Smoke test:', BASE);
    let browser;
    try {
        browser = await chromium.launch({ headless: true, channel: 'msedge' });
    } catch {
        browser = await chromium.launch({ headless: true });
    }
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', (e) => fail(`pageerror: ${e.message}`));

    try {
        await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120000 });
        await page.waitForSelector('a.nav-item[data-tab="patients"]', { timeout: 120000 });

        for (const tab of ['dashboard', 'patients', 'register', 'appointments', 'messages']) {
            await page.click(`a.nav-item[data-tab="${tab}"]`);
            await waitForAppSettled(page);
            const hash = await page.evaluate(() => window.location.hash);
            if (!hash.includes(tab)) {
                fail(`Nav tab ${tab}: hash is "${hash}"`);
            } else {
                console.log('OK: nav tab', tab);
            }
        }

        await page.click('a.nav-item[data-tab="patients"]');
        await page.waitForSelector('#patientsTableBody .patient-row', { timeout: 120000 });
        await waitForAppSettled(page);

        const rowCount = await page.locator('#patientsTableBody .patient-row').count();
        if (rowCount < 1) {
            const apiRes = await fetch(`${API}/api/patients.php`);
            const apiJson = await apiRes.json().catch(() => ({}));
            if ((apiJson.items || []).length < 1) {
                console.log('SKIP: no patients in database');
            } else {
                fail(`UI shows 0 rows but API has ${(apiJson.items || []).length} patients`);
            }
        } else {
            const link = page.locator('#patientsTableBody a.patient-link').first();
            const firstRef = await link.getAttribute('data-patient-ref');
            if (!firstRef) {
                fail('Patient link missing data-patient-ref (client serial required)');
            }
            console.log('Clicking patient link ref=', firstRef);
            await link.click({ timeout: 20000 });
            await expectPatientDetail(page, 'Patient name link opens detail');

            await page.click('a.patient-back-link, a[data-action="switch-tab"][data-tab="patients"]');
            await page.waitForSelector('#patientsTableBody .patient-row', { timeout: 60000 });
            await waitForAppSettled(page);

            const rowRef = await page.locator('#patientsTableBody .patient-row[data-patient-ref]').first().getAttribute('data-patient-ref');
            if (!rowRef) {
                fail('No patient row with client serial');
            }
            await page.locator('#patientsTableBody .patient-row[data-patient-ref]').first().click({ timeout: 20000 });
            await expectPatientDetail(page, 'Patient table row opens detail');

            await page.click('a.patient-back-link');
            await page.waitForSelector('button[data-action="view-patient"]', { timeout: 60000 });
            await page.locator('button[data-action="view-patient"]').first().click({ timeout: 20000 });
            await expectPatientDetail(page, 'View Record button opens detail');
        }

        await page.click('a.nav-item[data-tab="dashboard"]');
        await page.waitForSelector('.patient-card.clickable', { timeout: 60000 });
        await waitForAppSettled(page);
        const dashCard = page.locator('.patient-card.clickable[data-patient-ref]').first();
        if (await dashCard.count()) {
            await dashCard.click({ timeout: 20000 });
            await expectPatientDetail(page, 'Dashboard patient card opens detail');
        } else {
            console.log('SKIP: dashboard cards without client serial');
        }

        await page.click('a.nav-item[data-tab="dashboard"]');
        await waitForAppSettled(page);
        const wipeBtn = page.locator('button[data-action="wipe-open"]');
        if (await wipeBtn.count()) {
            await wipeBtn.click({ timeout: 10000 });
            await page.waitForSelector('#wipeDataModal:not(.hidden), #wipeDataModal[style*="flex"]', {
                timeout: 15000,
            }).catch(() => fail('Erase modal did not open'));
            if (!failures.some((f) => f.includes('Erase'))) {
                console.log('OK: Erase modal opens');
            }
            await page.locator('[data-action="wipe-close"]').first().click({ timeout: 5000 }).catch(() => {});
        }
    } catch (err) {
        fail(err.message || String(err));
    } finally {
        await browser.close();
    }

    if (failures.length) {
        console.error('\nSmoke test FAILED (' + failures.length + '):');
        failures.forEach((f) => console.error(' -', f));
        process.exit(1);
    }
    console.log('\nSmoke test PASSED');
    process.exit(0);
}

main();
