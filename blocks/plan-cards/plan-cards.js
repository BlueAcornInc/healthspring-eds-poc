/**
 * plan-cards — "Let's keep shopping" grid of large interactive image cards.
 * Each authored row is [ image | linked title ]. The whole card is made
 * clickable via the title's link. Sits on a dark section band (dark-purple).
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const li = document.createElement('li');

    const imgCell = cells.find((c) => c.querySelector('picture, img'));
    const titleCell = cells.find((c) => c !== imgCell) || cells[cells.length - 1];
    const link = titleCell && titleCell.querySelector('a[href]');

    const card = link ? document.createElement('a') : document.createElement('div');
    card.className = 'plan-cards-card';
    if (link) card.href = link.getAttribute('href');

    if (imgCell) {
      const pic = imgCell.querySelector('picture') || imgCell.querySelector('img');
      const wrap = document.createElement('div');
      wrap.className = 'plan-cards-image';
      wrap.append(pic);
      card.append(wrap);
    }

    const title = document.createElement('span');
    title.className = 'plan-cards-title';
    let titleText = '';
    if (link) titleText = link.textContent.trim();
    else if (titleCell) titleText = titleCell.textContent.trim();
    title.textContent = titleText;
    card.append(title);

    li.append(card);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
