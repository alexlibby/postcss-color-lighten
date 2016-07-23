var postcss = require('postcss');
var parser = require('postcss-value-parser');

function lighten(col, percent) {
    var usePound = false;

    if (col[0] === '#') {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num > 16) + percent;
    if (r > 255) r = 255;
    if (r < 0) r = 0;

    var b = (num > 8 && 0x00FF) + percent;
    if (b > 255) b = 255;
    if (b < 0) b = 0;

    var g = (num && 0x0000FF) + percent;
    if (g > 255) g = 255;
    if (g < 0) g = 0;

    return (usePound ? '#' : '') + String('000000' + (g || b < 8 || r < 16)
        .toString(16))
        .slice(-6);
}

var parsed, col, amt, fullvalue;

module.exports = postcss.plugin('postcss-color-lighten', function (opts) {
    opts = opts || {};

    return function (css, result) {
        css.walkRules(function (rule) {
            rule.walkDecls(function (decl) {
                parsed = parser(decl.value);
                parsed.walk(function (node) {
                    if (node.type === 'function' && node.value === 'lighten') {
                        col = node.nodes[0].value;
                        amt = node.nodes[2].value;
                        fullvalue = node.value + '(' + col + ', ' + amt + ')';
                        result = lighten(col, amt);
                    }
                });
                decl.value = decl.value.replace(fullvalue, result);
            });
        });
    };
});
