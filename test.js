import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.pass(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('does something', t => {
    return run( t,
        '.test { color: lighten(#ff23d7, 20); }',
        '.test { color: #ff56ff; }', { }
    );
});

