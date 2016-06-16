import postcss from 'postcss';

export default postcss.plugin('postcss-clearfix', () => (css, result) => {

    let selectors = [];

    css.walkDecls('clear', decl => {

        let { value }  = decl,
            { parent } = decl,
            { nodes }  = parent;

        if (value !== 'fix') return;

        selectors.push(parent.selectors);

        if (nodes.length === 1) {
            parent.remove();
            return;
        }

        decl.remove();

    });

    let selector = selectors.map(sel => {
        return `${sel}::before,\n${sel}::after`;
    }).join(',\n');

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

    selector = selectors.map(sel => `${sel}::after`).join(',\n');

    const afterRule = postcss.rule({ selector }).append(
        {
            prop: 'clear',
            value: 'both'
        }
    );

    result.root.prepend(commonRule, afterRule);
});
