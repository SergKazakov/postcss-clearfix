import postcss from 'postcss';
import test    from 'ava';
import plugin  from './';

function run(t, input, output, opts = {}) {
    return postcss([plugin(opts)]).process(input)
        .then(result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test(t => {
    return run(
        t,
`.bar {
    clear: fix;
}`,
`.bar::before,.bar::after {
    content: '';
    display: table
}
.bar::after {
    clear: both
}`
    );
});

test(t => {
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
`.b::before,.b::after,.foo::before,.foo::after,.bar::before,.bar::after {
    content: '';
    display: table;
}
.b::after,.foo::after,.bar::after {
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
