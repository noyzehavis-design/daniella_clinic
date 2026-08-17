/**
 * Lead-delivery outcome check — run with `npm run test:delivery`.
 *
 * This is a MOCK: it mirrors the decision made in app/api/contact/route.ts
 * (the `if (!webhookOk && !emailOk)` branch) plus the client's `if (!res.ok)
 * throw` in ServiceFormSection/FooterForm. It does not import the route, so
 * if that branch is ever changed, update this file to match.
 *
 * It exists so the three delivery outcomes can be re-verified without ever
 * sending a fake lead to the live Make webhook.
 */

/** Mirrors app/api/contact/route.ts — a lead needs at least one live channel. */
function routeResponse({ webhookOk, emailOk }) {
  if (!webhookOk && !emailOk) {
    return { status: 502, body: { ok: false, error: "delivery_failed" } };
  }
  return { status: 200, body: { ok: true } };
}

/** Mirrors the forms: thank-you + one generate_lead only on a 2xx response. */
function clientOutcome(response) {
  const succeeded = response.status < 400;
  return { showsThanks: succeeded, generateLeadEvents: succeeded ? 1 : 0 };
}

const cases = [
  {
    name: "Make succeeded, email failed",
    channels: { webhookOk: true, emailOk: false },
    expect: { status: 200, showsThanks: true, generateLeadEvents: 1 },
  },
  {
    name: "Make failed, email succeeded",
    channels: { webhookOk: false, emailOk: true },
    expect: { status: 200, showsThanks: true, generateLeadEvents: 1 },
  },
  {
    name: "Both channels failed",
    channels: { webhookOk: false, emailOk: false },
    expect: { status: 502, showsThanks: false, generateLeadEvents: 0 },
  },
];

let failures = 0;

for (const testCase of cases) {
  const response = routeResponse(testCase.channels);
  const outcome = clientOutcome(response);
  const actual = {
    status: response.status,
    showsThanks: outcome.showsThanks,
    generateLeadEvents: outcome.generateLeadEvents,
  };

  const passed = Object.entries(testCase.expect).every(([key, want]) => actual[key] === want);
  if (!passed) failures++;

  console.log(
    `${passed ? "PASS" : "FAIL"}  ${testCase.name}\n` +
      `      status=${actual.status}  thank-you=${actual.showsThanks}  generate_lead=${actual.generateLeadEvents}` +
      (passed ? "" : `\n      expected ${JSON.stringify(testCase.expect)}`)
  );
}

console.log(failures === 0 ? "\nAll 3 delivery outcomes behave as specified." : `\n${failures} failing case(s).`);
process.exit(failures === 0 ? 0 : 1);
