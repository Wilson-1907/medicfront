/**
 * API workflow checks (no browser). Uses first patient in production DB.
 * Usage: node smoke/mock-api.mjs [apiBaseUrl]
 */
const API = (process.argv[2] || process.env.SMOKE_API || 'https://medicback.onrender.com').replace(/\/$/, '');

async function apiPost(path, body) {
    const res = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
    });
    return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function apiGet(path) {
    const res = await fetch(`${API}${path}`);
    return { status: res.status, data: await res.json() };
}

async function run() {
    const list = await apiGet('/api/patients.php');
    const items = list.data?.items || [];
    if (!items.length) {
        console.error('FAIL: no patients in database');
        process.exit(1);
    }
    const patientId = items[0].id;
    const results = [];

    const get0 = await apiGet(`/api/patients.php?id=${patientId}`);
    const p0 = get0.data.patient;
    results.push(['GET patient', get0.status === 200 && p0?.hpv_workflow_enabled !== undefined, `workflow=${p0?.hpv_workflow_enabled}`]);

    const setNeg = await apiPost('/api/hpv_result.php', { action: 'set_result', patient_id: patientId, result: 'negative' });
    results.push(['HPV set_result API', setNeg.status === 200 && setNeg.data.ok, JSON.stringify(setNeg.data)]);

    const get1 = await apiGet(`/api/patients.php?id=${patientId}`);
    const p1 = get1.data.patient;
    results.push(['Confirm button state', p1?.hpv_screening_result === 'negative' && !p1?.hpv_result_confirmed_at, `result=${p1?.hpv_screening_result}`]);

    const get2 = await apiGet(`/api/patients.php?id=${patientId}`);
    const escalations = get2.data.patient?.escalations || [];
    results.push(['Escalations list', Array.isArray(escalations), `total=${escalations.length}`]);

    console.log(`\nMock API test (patient #${patientId})\n`);
    let fail = 0;
    for (const [name, ok, detail] of results) {
        console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} — ${detail}`);
        if (!ok) fail++;
    }
    process.exit(fail > 0 ? 1 : 0);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
