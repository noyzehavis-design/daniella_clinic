/**
 * Facebook Pixel snippet handling — run with `npm run test:pixel`.
 *
 * Imports the real extractPixelJs from app/lib/pixel.ts (Node strips the
 * types), so this tests the shipped code rather than a copy of it.
 *
 * Every case also asserts that the result actually parses as JavaScript,
 * which is the failure that took the live pixel down: the stored value was
 * Meta's full HTML block and the browser threw "Unexpected token '<'".
 */
import { extractPixelJs } from "../app/lib/pixel.ts";

const parsesAsJs = (code) => {
  if (code === "") return true; // nothing is injected at all
  try {
    new Function(code);
    return true;
  } catch {
    return false;
  }
};

// The exact value that was live in the database when the pixel broke.
const FULL_META_SNIPPET = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1643957256644269');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1643957256644269&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`;

const PLAIN_JS = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1643957256644269');fbq('track','PageView');`;

const cases = [
  {
    name: "plain JavaScript is passed through untouched",
    input: PLAIN_JS,
    check: (out) => out === PLAIN_JS,
    expected: "identical to input",
  },
  {
    name: "full Meta snippet → only the JavaScript inside <script>",
    input: FULL_META_SNIPPET,
    check: (out) =>
      out.startsWith("!function") &&
      out.includes("fbq('init', '1643957256644269')") &&
      out.includes("fbq('track', 'PageView')") &&
      !/[<>]/.test(out),
    expected: "pixel JS kept, all markup removed",
  },
  {
    name: "HTML comments alone are ignored",
    input: `<!-- Meta Pixel Code -->\n${PLAIN_JS}\n<!-- End Meta Pixel Code -->`,
    check: (out) => out.includes("fbq('init'") && !out.includes("<!--"),
    expected: "comments stripped, JS kept",
  },
  {
    name: "<noscript> block alone is refused",
    input: `<noscript><img height="1" width="1" src="https://www.facebook.com/tr?id=1" /></noscript>`,
    check: (out) => out === "",
    expected: '""',
  },
  {
    name: "malformed markup with no usable <script> is refused",
    input: `<script>fbq('init','123');`,
    check: (out) => out === "",
    expected: '"" (unclosed tag — nothing safe to run)',
  },
  {
    name: "empty <script></script> is refused",
    input: `<script></script>`,
    check: (out) => out === "",
    expected: '""',
  },
  { name: "empty string", input: "", check: (out) => out === "", expected: '""' },
  { name: "whitespace only", input: "   \n  ", check: (out) => out === "", expected: '""' },
  { name: "undefined", input: undefined, check: (out) => out === "", expected: '""' },
  { name: "null", input: null, check: (out) => out === "", expected: '""' },
];

let failures = 0;

for (const testCase of cases) {
  const out = extractPixelJs(testCase.input);
  const logicOk = testCase.check(out);
  const jsOk = parsesAsJs(out);
  const passed = logicOk && jsOk;
  if (!passed) failures++;

  console.log(`${passed ? "PASS" : "FAIL"}  ${testCase.name}`);
  if (!passed) {
    console.log(`      expected: ${testCase.expected}`);
    console.log(`      got:      ${JSON.stringify(out.slice(0, 80))}`);
    if (!jsOk) console.log(`      result does not parse as JavaScript`);
  }
}

// Regression guard: the exact production value must never again reach the browser as-is.
const brokenIfUnfixed = !parsesAsJs(FULL_META_SNIPPET);
console.log(
  `${brokenIfUnfixed ? "PASS" : "FAIL"}  raw Meta snippet would throw if injected unprocessed (proves the bug)`
);
if (!brokenIfUnfixed) failures++;

console.log(failures === 0 ? "\nAll pixel snippet cases behave as specified." : `\n${failures} failing case(s).`);
process.exit(failures === 0 ? 0 : 1);
