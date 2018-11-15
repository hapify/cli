'use strict';

const Fs = require('fs');
const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const HapifySyntax = require('../src');
const InterpolationPattern = require('../src/patterns/interpolation');

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/masks/interpolation.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/interpolation.txt`, 'utf8');

lab.test('run', async () => {

    //Test input validity
    expect(Input).to.be.a.string();
    expect(Output).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(Input, Model)).to.equal(Output);
});

lab.test('unit', async () => {
    // Names
    expect(InterpolationPattern.execute('<<=test.custom.prop>>')).to.equal('`; out += test.custom.prop; out += `');
    expect(InterpolationPattern.execute('<<=test.custom.prop.join(`${f.name}`) >>')).to.equal('`; out += test.custom.prop.join(`${f.name}`) ; out += `');
});
