/**
 * Environment guard for analytics — run with `npm run test:host`.
 *
 * Imports the shipped isMeasurableHost from app/lib/tracking.ts (Node strips
 * the types). This is what stops a local or preview test submission from
 * reporting a conversion into the live GA4 property and Meta pixel.
 */
import { isMeasurableHost } from "../app/lib/tracking.ts";

const cases = [
  // Real site — measurement must run.
  ["danielabalter.co.il", true],
  ["www.danielabalter.co.il", true],
  // Local development — must never reach the live property.
  ["localhost", false],
  ["LOCALHOST", false],
  ["app.localhost", false],
  ["127.0.0.1", false],
  ["::1", false],
  ["0.0.0.0", false],
  // Vercel preview deployments — same reasoning.
  ["1-cq0qfs41e-noyzehavis-designs-projects.vercel.app", false],
  ["1-git-main-noyzehavis-designs-projects.vercel.app", false],
  // Defensive.
  ["", false],
  ["   ", false],
];

let failures = 0;
for (const [host, expected] of cases) {
  const actual = isMeasurableHost(host);
  const passed = actual === expected;
  if (!passed) failures++;
  console.log(
    `${passed ? "PASS" : "FAIL"}  ${JSON.stringify(host).padEnd(52)} → ${actual}` +
      (passed ? "" : `  (expected ${expected})`)
  );
}

console.log(failures === 0 ? "\nAnalytics runs on the live site only." : `\n${failures} failing case(s).`);
process.exit(failures === 0 ? 0 : 1);
