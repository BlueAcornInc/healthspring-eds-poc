/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: HealthSpring site-wide cleanup.
 *
 * Removes non-authorable site chrome and third-party widgets so the import
 * contains only page-level authorable content under <main id="content">.
 *
 * All selectors verified against migration-work/cleaned.html:
 *   - leaf-skiplink                                    (lines 2-4)   accessibility skip links
 *   - leaf-header                                      (lines 5-506) global header + megamenu dropdowns
 *   - footer.leaf-c-footer                             (lines 715-838) global footer
 *   - leaf-back-to-top                                 (line 839)    back-to-top control
 *   - #onetrust-consent-sdk                            (line 845+)   OneTrust cookie consent banner/pref center
 *   - .onetrust-pc-dark-filter                         (line 846)    OneTrust modal overlay
 *   - #destination_publishing_iframe_healthspringgrowthandservices_0 (line 842) Adobe ID-syncing (demdex) tracking iframe
 *   - iframe.aamIframeLoaded                           (line 842)    same tracking iframe (class fallback)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / cookie consent / tracking that can block parsing or add noise.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
      '#destination_publishing_iframe_healthspringgrowthandservices_0',
      'iframe.aamIframeLoaded',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (header, footer, skiplinks, back-to-top).
    // Breadcrumbs and modals are page chrome / interactive overlays; astro
    // hydration <script>/<style> tags and hidden <leaf-modal> dialogs would
    // otherwise leak into the imported content as empty sections.
    WebImporter.DOMUtils.remove(element, [
      'leaf-skiplink',
      'leaf-header',
      'footer.leaf-c-footer',
      'leaf-back-to-top',
      'leaf-breadcrumbs',
      'leaf-modal',
      '#content script',
      '#content style',
    ]);
  }
}
