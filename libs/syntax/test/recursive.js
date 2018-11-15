'use strict';

const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const HapifySyntax = require('../src');

lab.test('unit', async () => {
    expect(HapifySyntax.run('out = `Joi.array().items(${out})`;', {})).to.equal('out = `Joi.array().items(${out})`;');
    expect(HapifySyntax.run('<<< const value = 1; out = `Joi.array().items(${value})`;>>>', {})).to.equal('Joi.array().items(1)');
});
