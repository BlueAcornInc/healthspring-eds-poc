/**
 * plan-select — "Explore Our Plans" 4-up plan navigator grid.
 * Each authored row is [ image | linked title ]. The whole card is made
 * clickable via the title's link. Light theme (white section); the plan title
 * is a purple link below a rounded photo.
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
    card.className = 'plan-select-card';
    if (link) card.href = link.getAttribute('href');

    if (imgCell) {
      const pic = imgCell.querySelector('picture') || imgCell.querySelector('img');
      const wrap = document.createElement('div');
      wrap.className = 'plan-select-image';
      wrap.append(pic);
      card.append(wrap);
    }

    const title = document.createElement('span');
    title.className = 'plan-select-title';
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
