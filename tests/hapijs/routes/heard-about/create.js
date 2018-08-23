'use strict';

/**
 * Create heard about.
 * Returns the created heard about.
 */

const Joi = require('joi');
const Boom = require('boom');

// Validation schema for payload
const schema = Joi.object({
    label: Joi.string().trim().required(),
    label__fr: Joi.string().trim().allow(null),
});

/**
 * Export route to create heard about
 */
module.exports = {
    method: 'POST',
    path: '/heard-about',
    config: {
        validate: { payload: schema },
        description: 'Route to create heard about',
        tags: ['heard-about', 'create']
    },
    handler: async (request, h) => {

        // Get heard about from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // @hook create:before-insert:heard-about

        // Insertion options
        const options = { w: 'majority' };

        // Insert heard about into database
        const result = await request.server.db.collection('heard_about')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const heardAbout = result.ops[0];

        return h.response(heardAbout).code(201);
    }
};

