'use strict';

const Fs = require('fs');
const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const HapifySyntax = require('../src');
const IterationPattern = require('../src/patterns/iteration');

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/masks/iteration.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/iteration.txt`, 'utf8');

lab.test('run', async () => {

    //Test input validity
    expect(Input).to.be.a.string();
    expect(Output).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(Input, Model)).to.equal(Output);
});

lab.test('unit', async () => {

    const condition = (test, length = 0, v = 'f') => length ?
        `\`; for (const ${v} of root.fields.list.filter((i) => ${test}).slice(0, ${length})) { out += \`` :
        `\`; for (const ${v} of root.fields.list.filter((i) => ${test})) { out += \``;
    
    //Start with not
    expect(IterationPattern.execute('<<@ F -se*so f>>')).to.equal(condition('!i.searchable && i.sortable'));
    expect(IterationPattern.execute('<<@ F /se*so f>>')).to.equal(condition('!i.searchable && i.sortable'));
    expect(IterationPattern.execute('<<@ F !se*so f>>')).to.equal(condition('!i.searchable && i.sortable'));

    // operator
    expect(IterationPattern.execute('<<@2 F !(se+so-lb)*pr/ip g>>')).to.equal(condition('!(i.searchable || i.sortable || !i.label) && i.primary && !i.isPrivate', 2, 'g'));

    // properties
    expect(IterationPattern.execute('<<@ F pr f>>')).to.equal(condition('i.primary'));
    expect(IterationPattern.execute('<<@ F un f>>')).to.equal(condition('i.unique'));
    expect(IterationPattern.execute('<<@ F lb f>>')).to.equal(condition('i.label'));
    expect(IterationPattern.execute('<<@ F nu f>>')).to.equal(condition('i.nullable'));
    expect(IterationPattern.execute('<<@ F ml f>>')).to.equal(condition('i.multiple'));
    expect(IterationPattern.execute('<<@ F se f>>')).to.equal(condition('i.searchable'));
    expect(IterationPattern.execute('<<@ F so f>>')).to.equal(condition('i.sortable'));
    expect(IterationPattern.execute('<<@ F ip f>>')).to.equal(condition('i.isPrivate'));
    expect(IterationPattern.execute('<<@ F in f>>')).to.equal(condition('i.internal'));

    expect(IterationPattern.execute('<<@ F tS f>>')).to.equal(condition('(i.type === \'string\')'));
    expect(IterationPattern.execute('<<@ F tSe f>>')).to.equal(condition('(i.type === \'string\' && i.subtype === \'email\')'));
    expect(IterationPattern.execute('<<@ F tSp f>>')).to.equal(condition('(i.type === \'string\' && i.subtype === \'password\')'));
    expect(IterationPattern.execute('<<@ F tSt f>>')).to.equal(condition('(i.type === \'string\' && i.subtype === \'text\')'));

    expect(IterationPattern.execute('<<@ F tN f>>')).to.equal(condition('(i.type === \'number\')'));
    expect(IterationPattern.execute('<<@ F tNi f>>')).to.equal(condition('(i.type === \'number\' && i.subtype === \'integer\')'));
    expect(IterationPattern.execute('<<@ F tNf f>>')).to.equal(condition('(i.type === \'number\' && i.subtype === \'float\')'));
    expect(IterationPattern.execute('<<@ F tNt f>>')).to.equal(condition('(i.type === \'number\' && i.subtype === \'latitude\')'));
    expect(IterationPattern.execute('<<@ F tNg f>>')).to.equal(condition('(i.type === \'number\' && i.subtype === \'longitude\')'));

    expect(IterationPattern.execute('<<@ F tB f>>')).to.equal(condition('(i.type === \'boolean\')'));

    expect(IterationPattern.execute('<<@ F tD f>>')).to.equal(condition('(i.type === \'datetime\')'));
    expect(IterationPattern.execute('<<@ F tDd f>>')).to.equal(condition('(i.type === \'datetime\' && i.subtype === \'date\')'));
    expect(IterationPattern.execute('<<@ F tDt f>>')).to.equal(condition('(i.type === \'datetime\' && i.subtype === \'time\')'));

    expect(IterationPattern.execute('<<@ F tE f>>')).to.equal(condition('(i.type === \'entity\')'));
    
    // spaces
    expect(IterationPattern.execute('<<@    F    pr    f  >>')).to.equal(condition('i.primary'));
    
    // Closure
    expect(IterationPattern.execute('<<@>>')).to.equal('`; } out += `');

    // Sub fields
    expect(IterationPattern.execute('<<@ m.f f>>')).to.equal('`; for (const f of m.f.filter((i) => i)) { out += `');

});
