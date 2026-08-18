/**
 * Meta hands you the pixel as a full HTML block — an `<!-- ... -->` comment,
 * a `<script>` tag and a `<noscript><img></noscript>` fallback — and that is
 * what usually gets pasted into the admin panel.
 *
 * PixelScript renders this value as the body of a script element, i.e. as raw
 * JavaScript, so any markup left in it makes the browser throw
 * "Unexpected token '<'" and the pixel never initialises.
 *
 * Returns the JavaScript to run, or "" when there is nothing safe to run.
 * The `<noscript>` fallback is dropped on purpose: layout.tsx renders one.
 */
export function extractPixelJs(raw?: string | null): string {
  const trimmed = raw?.trim();
  if (!trimmed) return "";

  // A full Meta snippet: take only what is inside <script>…</script>.
  const scriptBlock = trimmed.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (scriptBlock) {
    const js = scriptBlock[1].trim();
    return js.length > 0 ? js : "";
  }

  // Otherwise it should already be plain JavaScript. Strip HTML comments so a
  // commented-but-otherwise-clean paste still works.
  const withoutComments = trimmed.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!withoutComments) return "";

  // Markup with no usable <script> (an unclosed tag, a bare <noscript>, …).
  // Refuse rather than inject something that throws at parse time.
  if (/<[a-z!/]/i.test(withoutComments)) return "";

  return withoutComments;
}
