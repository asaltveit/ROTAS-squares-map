import AxeBuilder from '@axe-core/playwright';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const FAILING_IMPACTS = new Set(['critical', 'serious']);

// Observable Plot renders SVG map internals that produce false-positive axe violations.
const DEFAULT_EXCLUDES = ['.map-container'];

export async function scanPage(page, { include, exclude = DEFAULT_EXCLUDES } = {}) {
  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);

  if (include) {
    builder = builder.include(include);
  }

  for (const selector of exclude) {
    builder = builder.exclude(selector);
  }

  return builder.analyze();
}

export function assertNoSeriousViolations(results) {
  const failingViolations = results.violations.filter((violation) =>
    FAILING_IMPACTS.has(violation.impact),
  );

  const moderateViolations = results.violations.filter(
    (violation) => !FAILING_IMPACTS.has(violation.impact),
  );

  if (moderateViolations.length > 0) {
    console.warn(
      'Accessibility warnings (moderate/minor):',
      moderateViolations.map(formatViolation),
    );
  }

  if (failingViolations.length > 0) {
    throw new Error(
      `Accessibility violations found:\n${failingViolations.map(formatViolation).join('\n')}`,
    );
  }
}

function formatViolation(violation) {
  const nodes = violation.nodes
    .map((node) => `  - ${node.html}`)
    .join('\n');
  return `[${violation.impact}] ${violation.id}: ${violation.description}\n${nodes}`;
}
