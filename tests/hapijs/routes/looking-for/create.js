'use strict';

/**
 * Create looking for.
 * Returns the created looking for.
 */

const Joi = require('joi');
const Boom = require('boom');

// Validation schema for payload
const schema = Joi.object({
    label: Joi.string().trim().required(),
    label__fr: Joi.string().trim().allow(null),
});

/**
 * Export route to create looking for
 */
module.exports = {
    method: 'POST',
    path: '/looking-for',
    config: {
        validate: { payload: schema },
        description: 'Route to create looking for',
        tags: ['looking-for', 'create']
    },
    handler: async (request, h) => {

        // Get looking for from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // @hook create:before-insert:looking-for

        // Insertion options
        const options = { w: 'majority' };

        // Insert looking for into database
        const result = await request.server.db.collection('looking_for')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const lookingFor = result.ops[0];

        return h.response(lookingFor).code(201);
    }
};

