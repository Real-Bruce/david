/** Keep WenKai's Unicode subsets, but prevent late font swaps while reading. */
export default function fontDisplay() {
  return {
    postcssPlugin: 'wenkai-font-display',
    AtRule: {
      'font-face': (rule) => {
        const isWenKai = rule.nodes.some((node) =>
          node.prop === 'font-family' &&
          node.value.replace(/^(['"])(.*)\1$/, '$2') === 'LXGW WenKai'
        );
        if (!isWenKai) return;
        rule.walkDecls('font-display', (decl) => {
          decl.value = 'optional';
        });
      }
    }
  };
}
