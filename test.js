import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = {}) {
    return postcss([plugin(opts)]).process(input)
        .then(result => {
            console.log(result.css)
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('sets clear: fix correctly', t => {
    return run(
        t,
`.a {
    color: #000;
}
.b {
    color: red;
    clear: fix;
}
.foo {
    clear: fix;
    clear: both;
}
.bar {
    clear: fix;
}
.f {
    clear: both;
}`,
`.b::before,
.b::after,
.foo::before,
.foo::after,
.bar::before,
.bar::after {
    content: '';
    display: table;
}
.b::after,
.foo::after,
.bar::after {
    clear: both;
}
.a {
    color: #000;
}
.b {
    color: red;
}
.foo {
    clear: both;
}
.f {
    clear: both;
}`
    );
});
