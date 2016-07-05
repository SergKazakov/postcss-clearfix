import postcss from 'postcss';

export default postcss.plugin('postcss-clearfix', () => css => {

    const selectors = [];

    css.walkDecls('clear', decl => {

        const { value, parent } = decl;
        const { nodes }         = parent;

        if (value !== 'fix') return;

        selectors.push(parent.selectors);

        if (nodes.length === 1) {
            parent.remove();
            return;
        }

        decl.remove();

    });

    let selector = selectors.map(sel =>
      `${sel}::before,${sel}::after`
    ).join(',');

    const commonRule = postcss.rule({ selector }).append(
        {
            prop: 'content',
            value: '\'\''
        },
        {
            prop: 'display',
            value: 'table'
        }
    );

    selector = selectors.map(sel =>
      `${sel}::after`
    ).join(',');

    const afterRule = postcss.rule({ selector }).append(
        {
            prop: 'clear',
            value: 'both'
        }
    );

    css.prepend(commonRule, afterRule);
});
