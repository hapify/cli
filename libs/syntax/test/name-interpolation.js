'use strict';

const Fs = require('fs');
const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { ParsingError } = require('../src/errors');
const HapifySyntax = require('../src');
const NameInterpolationPattern = require('../src/patterns/name-interpolation');

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/masks/name-interpolation.hpf`, 'utf8');
const InputError = Fs.readFileSync(`${__dirname}/masks/name-interpolation-error.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/name-interpolation.txt`, 'utf8');

lab.test('run', async () => {

    //Test input validity
    expect(Input).to.be.a.string();
    expect(Output).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(Input, Model)).to.equal(Output);
});

lab.test('error', async () => {

    //Test input validity
    expect(InputError).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(() => HapifySyntax.run(InputError, Model)).to.throw(ParsingError);
});

lab.test('unit', async () => {
    // Names
    expect(NameInterpolationPattern.execute('<<M aA>>')).to.equal('${root.names.lowerCamel}');
    expect(NameInterpolationPattern.execute('<<M AA>>')).to.equal('${root.names.upperCamel}');
    expect(NameInterpolationPattern.execute('<<M a>>')).to.equal('${root.names.wordsLower}');
    expect(NameInterpolationPattern.execute('<<M A>>')).to.equal('${root.names.wordsUpper}');
    expect(NameInterpolationPattern.execute('<<M a-a>>')).to.equal('${root.names.hyphen}');
    expect(NameInterpolationPattern.execute('<<M a_a>>')).to.equal('${root.names.underscore}');
    expect(NameInterpolationPattern.execute('<<M aa>>')).to.equal('${root.names.oneWord}');
    expect(NameInterpolationPattern.execute('<<M R>>')).to.equal('${root.names.raw}');
    // Variable
    expect(NameInterpolationPattern.execute('<<f aA>>')).to.equal('${f.names.lowerCamel}');
    // Spaces
    expect(NameInterpolationPattern.execute('<<f   aA>>')).to.equal('${f.names.lowerCamel}');

    // Primary field
    expect(NameInterpolationPattern.execute('<<P aA>>')).to.equal('${root.fields.primary.names.lowerCamel}');
    
    // Sub field
    expect(NameInterpolationPattern.execute('<<root.fields.primary aA>>')).to.equal('${root.fields.primary.names.lowerCamel}');
});
