import { NodePangu } from 'pangu';

const pangu = new NodePangu();

// 这些标签内的文本不做自动空格（代码、原始文本等）
const SKIP_TAGS = new Set(['pre', 'code', 'script', 'style', 'textarea']);

/**
 * Rehype 插件：为正文文本节点自动插入中西文/数字之间的盘古空格。
 * 跳过代码块、行内代码与原始文本元素。
 */
export default function rehypePangu() {
  return (tree) => {
    walk(tree, false);
  };
}

function walk(node, skip) {
  if (!node || typeof node !== 'object') return;

  if (node.type === 'text' && !skip && typeof node.value === 'string') {
    node.value = pangu.spaceText(node.value);
    return;
  }

  const children = node.children;
  if (!Array.isArray(children)) return;

  const skipChildren = skip || (node.type === 'element' && SKIP_TAGS.has(node.tagName));
  for (const child of children) {
    walk(child, skipChildren);
  }
}
