/** Render single-column Markdown tables with a caption and image rows as figures. */
export default function rehypeImageFigures() {
  return (tree) => {
    walk(tree);
  };
}

function walk(node) {
  if (!node.children) return;

  for (const [index, child] of node.children.entries()) {
    const figure = toFigure(child);
    if (figure) {
      node.children[index] = figure;
    } else {
      walk(child);
    }
  }
}

function toFigure(table) {
  if (!isElement(table, 'table')) return;
  const [head, body, ...rest] = content(table);
  if (rest.length || !isElement(head, 'thead') || !isElement(body, 'tbody')) return;

  const [headerRow, ...otherHeaders] = content(head);
  const caption = singleCell(headerRow, 'th');
  if (otherHeaders.length || !caption || !content(caption).some(hasText)) return;

  const rows = content(body);
  const images = rows.map((row) => {
    const cell = singleCell(row, 'td');
    return cell ? content(cell) : [];
  });
  if (!images.length || !images.every((row) => row.length && row.every(isImage))) return;

  return element('figure', [
    element('figcaption', caption.children),
    element('div', images.flat(), ['image-figure-media'])
  ], ['image-figure']);
}

function singleCell(row, tagName) {
  if (!isElement(row, 'tr')) return;
  const [cell, ...rest] = content(row);
  if (!rest.length && isElement(cell, tagName)) return cell;
}

function isImage(node) {
  if (isElement(node, 'img')) return true;
  if (!isElement(node, 'a')) return false;
  const [image, ...rest] = content(node);
  return !rest.length && isElement(image, 'img');
}

function hasText(node) {
  return node.type === 'text' ? Boolean(node.value.trim()) : node.children?.some(hasText);
}

function content(node) {
  return node.children.filter((child) => child.type !== 'text' || child.value.trim());
}

function isElement(node, tagName) {
  return node?.type === 'element' && node.tagName === tagName;
}

function element(tagName, children, className) {
  return { type: 'element', tagName, properties: className ? { className } : {}, children };
}
