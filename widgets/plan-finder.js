/**
 * Plan Finder widget — static snapshot of the HealthSpring homepage plan finder.
 * Validates a 5-digit ZIP code and forwards the shopper to the shop site.
 * @param {Element} widget The widget block element
 */
export default async function decorate(widget) {
  const form = widget.querySelector('.plan-finder-zip-form');
  const input = widget.querySelector('.plan-finder-input');
  const error = widget.querySelector('.plan-finder-error');
  if (!form || !input) return;

  const SHOP_BASE = 'https://shop.healthspringmedicare.com/';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const zip = input.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      if (error) error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    if (error) error.hidden = true;
    input.removeAttribute('aria-invalid');
    const target = new URL(SHOP_BASE);
    target.searchParams.set('zip', zip);
    window.open(target.href, '_blank', 'noopener');
  });

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 5);
    if (error && !error.hidden && /^\d{5}$/.test(input.value)) error.hidden = true;
  });
}
