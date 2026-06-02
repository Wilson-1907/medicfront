/**
 * Launch-readiness API monkey test — registration, duplicates, endpoints, scale.
 * Usage: node smoke/api-monkey.mjs [apiBaseUrl]
 * Env: SMOKE_API, SMOKE_SKIP_REGISTER=1 to skip mutating registration tests
 */
const API = (process.argv[2] || process.env.SMOKE_API || 'https://medicback.onrender.com').replace(/\/$/, '');
const SKIP_REGISTER = process.env.SMOKE_SKIP_REGISTER === '1';
const TIMEOUT_MS = 120000;

const failures = [];
const passes = [];

function pass(msg) {
    passes.push(msg);
    console.log('PASS:', msg);
}

function fail(msg, detail = '') {
    const line = detail ? `${msg} — ${detail}` : msg;
    failures.push(line);
    console.error('FAIL:', line);
}

async function fetchJson(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(`${API}${path}`, {
            ...options,
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...(options.headers || {}),
            },
        });
        const text = await res.text();
        let data = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = { _raw: text.slice(0, 400) };
        }
        return { status: res.status, ok: res.ok, data };
    } finally {
        clearTimeout(timer);
    }
}

function assertOk(name, res, extra = () => true) {
    if (res.status >= 200 && res.status < 300 && res.data?.ok !== false && extra(res)) {
        pass(name);
        return true;
    }
    fail(name, `HTTP ${res.status} ${JSON.stringify(res.data).slice(0, 280)}`);
    return false;
}

function assertError(name, res, expectedStatus, needle) {
    const err = String(res.data?.error || '');
    const statusOk = res.status === expectedStatus;
    const msgOk = !needle || err.toLowerCase().includes(String(needle).toLowerCase());
    if (statusOk && res.data?.ok === false && msgOk) {
        pass(name);
        return true;
    }
    fail(name, `expected ${expectedStatus} with "${needle}", got ${res.status} ${err.slice(0, 200)}`);
    return false;
}

function randomTestSuffix() {
    return String(800 + Math.floor(Math.random() * 150)).padStart(3, '0');
}

function randomTestPhone() {
    const tail = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
    return `+2547${tail}`;
}

function minimalRegistrationBody(suffix, phone) {
    return {
        full_name: `SMOKE TEST ${suffix}`,
        date_of_birth: '1990-01-15',
        preferred_language: 'en',
        client_no_suffix: suffix,
        phone,
        contact_channel: 'sms',
        opt_in: 0,
        hiv_status: 'negative',
        hpv_done_before: 'no',
        place_of_residence: 'Nyeri Town',
        via_result: 'negative',
        via_date: '2026-01-10',
    };
}

async function testReadEndpoints() {
    const dash = await fetchJson('/api/dashboard.php');
    assertOk('GET dashboard.php', dash, (r) => r.data.stats && Array.isArray(r.data.recent));

    const patients = await fetchJson('/api/patients.php');
    if (assertOk('GET patients.php list', patients, (r) => Array.isArray(r.data.items))) {
        const count = patients.data.items.length;
        pass(`Patient list returned ${count} rows (limit 500, launch target 60–80)`);
        if (count > 500) {
            fail('Patient list within limit', `API returned ${count} but limit is 500`);
        }
    }

    await fetchJson('/api/appointments.php');
    pass('GET appointments.php reachable');

    await fetchJson('/api/message_center.php');
    pass('GET message_center.php reachable');

    const msgHealth = await fetchJson('/api/messaging_health.php');
    assertOk('GET messaging_health.php', msgHealth);

    const aiHealth = await fetchJson('/api/ai_health.php');
    if (aiHealth.data?.ok) {
        pass('GET ai_health.php');
    } else {
        fail('GET ai_health.php', JSON.stringify(aiHealth.data).slice(0, 200));
    }
}

async function testValidationErrors() {
    const badPhone = await fetchJson('/api/patients.php', {
        method: 'POST',
        body: JSON.stringify({
            full_name: 'Validation Test',
            client_no_suffix: '999',
            phone: '+254123',
            contact_channel: 'sms',
            opt_in: 0,
            hiv_status: 'negative',
            hpv_done_before: 'no',
            place_of_residence: 'Nyeri',
            via_result: 'negative',
            via_date: '2026-01-01',
        }),
    });
    assertError('Invalid phone rejected', badPhone, 422, '9 digits');

    const noName = await fetchJson('/api/patients.php', {
        method: 'POST',
        body: JSON.stringify({ client_no_suffix: '998', phone: '+254712345678' }),
    });
    assertError('Missing name rejected', noName, 422, 'name');
}

async function testRegistrationFlow() {
    if (SKIP_REGISTER) {
        pass('Registration tests skipped (SMOKE_SKIP_REGISTER=1)');
        return null;
    }

    const suffix = randomTestSuffix();
    const phone = randomTestPhone();
    const body = minimalRegistrationBody(suffix, phone);

    const created = await fetchJson('/api/patients.php', {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (!assertOk('Register new patient', created, (r) => r.data.patient_id > 0 && r.data.client_id)) {
        return null;
    }

    const clientId = created.data.client_id;
    pass(`Registered test patient ${clientId} id=${created.data.patient_id}`);

    const dupPhone = await fetchJson('/api/patients.php', {
        method: 'POST',
        body: JSON.stringify({
            ...body,
            full_name: 'SMOKE TEST DUPLICATE PHONE',
            client_no_suffix: String(Number(suffix) + 1).padStart(3, '0'),
        }),
    });
    const phoneErr = String(dupPhone.data?.error || '');
    if (dupPhone.status === 422 && dupPhone.data?.ok === false
        && phoneErr.toLowerCase().includes('phone')
        && !phoneErr.includes('SQLSTATE')
        && !phoneErr.includes('Duplicate entry')) {
        pass('Duplicate phone returns friendly error');
    } else {
        fail('Duplicate phone returns friendly error', `${dupPhone.status} ${phoneErr.slice(0, 200)}`);
    }

    const dupClient = await fetchJson('/api/patients.php', {
        method: 'POST',
        body: JSON.stringify({
            ...body,
            full_name: 'SMOKE TEST DUPLICATE CLIENT',
            phone: randomTestPhone(),
            client_no_suffix: suffix,
        }),
    });
    assertError('Duplicate client number rejected', dupClient, 422, 'client number');

    const byClient = await fetchJson(`/api/patients.php?client_id=${encodeURIComponent(clientId)}`);
    assertOk('GET patient by client_id', byClient, (r) => r.data.patient?.client_id === clientId);

    const bySuffix = await fetchJson(`/api/patients.php?client_id=${encodeURIComponent(suffix)}`);
    assertOk('GET patient by suffix digits', bySuffix, (r) => r.data.patient?.full_name?.includes('SMOKE TEST'));

    return { clientId, patientId: created.data.patient_id, phone };
}

async function testExistingPatientDuplicate() {
    const list = await fetchJson('/api/patients.php');
    const items = list.data?.items || [];
    if (items.length < 1) {
        pass('Existing-patient duplicate test skipped (no patients)');
        return;
    }
    const existing = items.find((p) => p.phone) || items[0];
    if (!existing?.phone) {
        pass('Existing-patient duplicate test skipped (no phone on file)');
        return;
    }

    const res = await fetchJson('/api/patients.php', {
        method: 'POST',
        body: JSON.stringify({
            ...minimalRegistrationBody('950', existing.phone),
            client_no_suffix: '950',
            phone: existing.phone,
        }),
    });
    const err = String(res.data?.error || '');
    if (res.status === 422 && res.data?.ok === false
        && (err.toLowerCase().includes('phone') || err.toLowerCase().includes('registered'))
        && !err.includes('SQLSTATE')) {
        pass('Duplicate existing production phone blocked cleanly');
    } else {
        fail('Duplicate existing production phone blocked cleanly', `${res.status} ${err.slice(0, 200)}`);
    }
}

async function testScaleSignals() {
    const dash = await fetchJson('/api/dashboard.php');
    if (dash.data?.stats) {
        const total = dash.data.stats.patients ?? 0;
        pass(`Dashboard total registered: ${total} (launch plan 60–80)`);
        if (total > 480) {
            fail('Headroom before list limit', `${total} patients — review list limit (500)`);
        }
    }
}

async function main() {
    console.log('API monkey test:', API);
    console.log('Skip registration mutations:', SKIP_REGISTER);

    try {
        await testReadEndpoints();
        await testValidationErrors();
        await testRegistrationFlow();
        await testExistingPatientDuplicate();
        await testScaleSignals();
    } catch (err) {
        fail('Unexpected exception', err.message || String(err));
    }

    console.log(`\n--- Results: ${passes.length} passed, ${failures.length} failed ---`);
    if (failures.length) {
        failures.forEach((f) => console.error(' •', f));
        process.exit(1);
    }
    console.log('API monkey test PASSED');
    process.exit(0);
}

main();
