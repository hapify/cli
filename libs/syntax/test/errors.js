'use strict';

const Fs = require('fs');
const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const {
    ConstructorError,
    ArgumentsError
} = require('../src/errors');
const HapifySyntax = require('../src');

const Model = require('./models/video.json');
const Simple = Fs.readFileSync(`${__dirname}/masks/simple.hpf`, 'utf8');

lab.test('constructor', async () => {
    expect(() => new HapifySyntax()).to.throw(ConstructorError);
});

lab.test('run', async () => {
    
    //Test input validity
    expect(Simple).to.be.a.string();
    expect(Model).to.be.an.object();
    
    expect(() => HapifySyntax.run()).to.throw(ArgumentsError);
    
    expect(() => HapifySyntax.run(Simple)).to.throw(ArgumentsError);

    expect(() => HapifySyntax.run(Simple, undefined)).to.throw(ArgumentsError);
    expect(() => HapifySyntax.run(Simple, null)).to.throw(ArgumentsError);
    expect(() => HapifySyntax.run(Simple, true)).to.throw(ArgumentsError);
    expect(() => HapifySyntax.run(Simple, 3)).to.throw(ArgumentsError);
    expect(() => HapifySyntax.run(Simple, 'string')).to.throw(ArgumentsError);

    expect(() => HapifySyntax.run(undefined, Model)).to.throw(ArgumentsError);
    expect(() => HapifySyntax.run(null, Model)).to.throw(ArgumentsError);
    expect(() => HapifySyntax.run(false, Model)).to.throw(ArgumentsError);
    expect(() => HapifySyntax.run(4, Model)).to.throw(ArgumentsError);
    expect(() => HapifySyntax.run({}, Model)).to.throw(ArgumentsError);
    
    expect(HapifySyntax.run(Simple, Model)).to.be.a.string();
    
});
