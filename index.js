var postcss = require('postcss');

module.exports = postcss.plugin('postcss-clearfix', function() {
  return function(css, result) {

    var selectors = [],
        commonSelectors,
        afterSelectors,
        commonRule,
        afterRule;
    
    css.walkDecls('clear', function(decl) {

      if (decl.value !== 'fix') return;

      selectors.push(decl.parent.selectors);

      if (decl.parent.nodes.length === 1) return decl.parent.remove();

      decl.remove();

    });
    
    commonSelectors = selectors.map(function(selector) {
        return selector + '::before,\n' + selector + '::after';
    }).join(',\n');

    afterSelectors = selectors.map(function(selector) {
        return selector + '::after';
    }).join(',\n');

    commonRule = postcss.rule({ selector: commonSelectors }).append(
      {
        prop: 'content',
        value: '\'\''
      },
      {
        prop: 'display',
        value: 'table'
      }
    );

    afterRule = postcss.rule({ selector: afterSelectors }).append(
      {
        prop: 'clear',
        value: 'both'
      }
    );
    
    result.root.prepend(commonRule, afterRule);
  };
});
