'use strict';

const Fs = require('fs');
const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const HapifySyntax = require('../src');
const EvaluatePattern = require('../src/patterns/evaluate');

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/masks/evaluate.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/evaluate.txt`, 'utf8');

lab.test('run', async () => {

    //Test input validity
    expect(Input).to.be.a.string();
    expect(Output).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(Input, Model)).to.equal(Output);
});

lab.test('unit', async () => {
    // Names
    expect(EvaluatePattern.execute('<<<this should be there>>>')).to.equal('`; this should be there out += `');
    expect(EvaluatePattern.execute('<<<[   this should be there with spaces    ]>>>')).to.equal('`; [   this should be there with spaces    ] out += `');
});
