var Hoek = require('hoek');
var Lab = require('lab');
var Purdy = require('../');


// Test shortcuts

var lab = exports.lab = Lab.script();
var expect = Lab.expect;
var describe = lab.describe;
var it = lab.it;


describe('Purdy', function () {

    it('should indent array correctly', function (done) {

        var out = Purdy.stringify([1, 2, 1, 1, 1, 1, 12, [1, 2]]);
        expect(out).to.equal('[\n    [\u001b[1m\u001b[37m0\u001b[39m\u001b[22m] \u001b[1m\u001b[34m1\u001b[39m\u001b[22m,\n    [\u001b[1m\u001b[37m1\u001b[39m\u001b[22m] \u001b[1m\u001b[34m2\u001b[39m\u001b[22m,\n    [\u001b[1m\u001b[37m2\u001b[39m\u001b[22m] \u001b[1m\u001b[34m1\u001b[39m\u001b[22m,\n    [\u001b[1m\u001b[37m3\u001b[39m\u001b[22m] \u001b[1m\u001b[34m1\u001b[39m\u001b[22m,\n    [\u001b[1m\u001b[37m4\u001b[39m\u001b[22m] \u001b[1m\u001b[34m1\u001b[39m\u001b[22m,\n    [\u001b[1m\u001b[37m5\u001b[39m\u001b[22m] \u001b[1m\u001b[34m1\u001b[39m\u001b[22m,\n    [\u001b[1m\u001b[37m6\u001b[39m\u001b[22m] \u001b[1m\u001b[34m12\u001b[39m\u001b[22m,\n    [\u001b[1m\u001b[37m7\u001b[39m\u001b[22m] [\n        [\u001b[1m\u001b[37m0\u001b[39m\u001b[22m] \u001b[1m\u001b[34m1\u001b[39m\u001b[22m,\n        [\u001b[1m\u001b[37m1\u001b[39m\u001b[22m] \u001b[1m\u001b[34m2\u001b[39m\u001b[22m\n    ]\n]');
        done();
    });

    it('should print plain', function (done) {

        var out = Purdy.stringify('plain', { plain: true });
        expect(out).to.equal('\'plain\'');
        done();
    });

    it('should handle circular references', function (done) {
        var circularObj = { };
        circularObj.a = circularObj;
        var circ = [];
        circ.push(circ);
        var out = Purdy.stringify(circularObj);
        expect(out).to.equal('{\n    \u001b[1m\u001b[37m  a\u001b[39m\u001b[22m: \u001b[1m\u001b[90m[Circular~]\u001b[39m\u001b[22m\n}');
        out = Purdy.stringify(circ);
        expect(out).to.equal('[\n    [\u001b[1m\u001b[37m0\u001b[39m\u001b[22m] \u001b[1m\u001b[90m[Circular~]\u001b[39m\u001b[22m\n]');
        done();
    });

    it('should print a function', function (done) {

        var out = Purdy.stringify(Array.isArray);
        expect(out).to.equal('\u001b[36m\u001b[36m[Function: isArray]\u001b[39m\u001b[39m');
        done();
    });

    it('should print an anonymous function', function (done) {

        var out = Purdy.stringify(it);
        expect(out).to.equal('\u001b[36m\u001b[36m[Function: ?]\u001b[39m\u001b[39m');
        done();
    });


    it('should print a string', function (done) {

        var out = Purdy.stringify('hello purdy');
        expect(out).to.equal('\u001b[33m\'hello purdy\'\u001b[39m');
        done();
    });

    it('should print a date', function (done) {

        var out = Purdy.stringify(new Date(2014, 5, 6, 21, 22, 21));
        expect(out).to.equal('\u001b[32m' + new Date(2014, 5, 6, 21, 22, 21) + '\u001b[39m');
        done();
    });

    it('should print a number', function (done) {

        var out = Purdy.stringify(123);
        expect(out).to.equal('\u001b[1m\u001b[34m123\u001b[39m\u001b[22m');
        done();
    });

    it('should print null', function (done) {

        var out = Purdy.stringify(null);
        expect(out).to.equal('\u001b[1m\u001b[31mnull\u001b[39m\u001b[22m');
        done();
    });

    it('should print undefined', function (done) {

        var out = Purdy.stringify(undefined);
        expect(out).to.equal('\u001b[7m\u001b[31mundefined\u001b[39m\u001b[27m');
        done();
    });

    it('should print a regular expression', function (done) {

        var out = Purdy.stringify(new RegExp());
        expect(out).to.equal('\u001b[35m/(?:)/\u001b[39m');
        done();
    });

    it('should print a false boolean', function (done) {

        var out = Purdy.stringify(false);
        expect(out).to.equal('\u001b[1m\u001b[31mfalse\u001b[39m\u001b[22m');
        done();
    });

    it('should print a true boolean', function (done) {

        var out = Purdy.stringify(true);
        expect(out).to.equal('\u001b[1m\u001b[32mtrue\u001b[39m\u001b[22m');
        done();
    });

    it('should print an empty array without extra indentation', function (done) {

        var out = Purdy.stringify([]);
        expect(out).to.equal('[]');
        done();
    });

    it('should print an empty object without extra indentation', function (done) {

        var out = Purdy.stringify({});
        expect(out).to.equal('{}');
        done();
    });

    it('should print a more complex object', function (done) {

        var out = Purdy.stringify({
            array: [1, 2, [1, 2]],
            object: { another: 'string' }
        });

        expect(out).to.equal('{\n    \u001b[1m\u001b[37m array\u001b[39m\u001b[22m: [\n        [\u001b[1m\u001b[37m0\u001b[39m\u001b[22m] \u001b[1m\u001b[34m1\u001b[39m\u001b[22m,\n        [\u001b[1m\u001b[37m1\u001b[39m\u001b[22m] \u001b[1m\u001b[34m2\u001b[39m\u001b[22m,\n        [\u001b[1m\u001b[37m2\u001b[39m\u001b[22m] [\n            [\u001b[1m\u001b[37m0\u001b[39m\u001b[22m] \u001b[1m\u001b[34m1\u001b[39m\u001b[22m,\n            [\u001b[1m\u001b[37m1\u001b[39m\u001b[22m] \u001b[1m\u001b[34m2\u001b[39m\u001b[22m\n        ]\n    ],\n    \u001b[1m\u001b[37mobject\u001b[39m\u001b[22m: {\n        \u001b[1m\u001b[37manother\u001b[39m\u001b[22m: \u001b[33m\'string\'\u001b[39m\n    }\n}');
        done();
    });

    it('should not print circular after second use', function (done) {

        var obj = { a: 3 };
        Purdy.stringify(obj);
        var out = Purdy.stringify(obj, { plain: true });
        expect(out).to.not.equal('[Circular]');
        done();
    });

    it('shows circular reference with path', function (done) {

        var repeatObj = {
            text: 'repeating object'
        };
        var repeatArr = ['repeating array'];

        var obj = {
            a: { nested: repeatObj },
            b: { alsoNested: repeatObj },
            more: [repeatArr],
            array: [repeatArr]

        };
        obj.top = obj;
        Purdy.stringify(obj);
        var out = Purdy.stringify(obj, { plain: true });
        expect(out).to.equal("{\n        a: {\n        nested: {\n            text: 'repeating object'\n        }\n    },\n        b: {\n        alsoNested: [Circular~ a.nested]\n    },\n     more: [\n        [0] [\n            [0] 'repeating array'\n        ]\n    ],\n    array: [\n        [0] [Circular~ more.0]\n    ],\n      top: [Circular~]\n}");
        done();
    });

    it('will keep a path for an object in Hoek format', function (done) {

        var obj = {
            travel: {
                down: {
                    a: [{
                        path: 'to get here'
                    }]
                }
            }
        };
        var orig = Hoek.clone(obj);

        var out = Purdy.stringify(obj, { plain: false, path: true });

        expect(out).to.equal('{\n    \u001b[1m\u001b[37mtravel\u001b[39m\u001b[22m: {\n        \u001b[34m// \u001b[39m\u001b[34mtravel.down\u001b[39m\n        \u001b[1m\u001b[37mdown\u001b[39m\u001b[22m: {\n            \u001b[34m// \u001b[39m\u001b[34mtravel.down.a\u001b[39m\n            \u001b[1m\u001b[37m  a\u001b[39m\u001b[22m: [\n                \u001b[34m// \u001b[39m\u001b[34mtravel.down.a.0\u001b[39m\n                [\u001b[1m\u001b[37m0\u001b[39m\u001b[22m] {\n                    \u001b[34m// \u001b[39m\u001b[34mtravel.down.a.0.path\u001b[39m\n                    \u001b[1m\u001b[37mpath\u001b[39m\u001b[22m: \u001b[33m\'to get here\'\u001b[39m\n                }\n            ]\n        }\n    }\n}');
        expect(obj).to.deep.equal(orig);
        done();
    });

});

