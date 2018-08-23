'use strict';

/**
 * Create industry.
 * Returns the created industry.
 */

const Joi = require('joi');
const Boom = require('boom');

// Validation schema for payload
const schema = Joi.object({
    name: Joi.string().trim().required(),
    name__fr: Joi.string().trim().allow(null),
});

/**
 * Export route to create industry
 */
module.exports = {
    method: 'POST',
    path: '/industry',
    config: {
        validate: { payload: schema },
        description: 'Route to create industry',
        tags: ['industry', 'create']
    },
    handler: async (request, h) => {

        // Get industry from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // @hook create:before-insert:industry

        // Insertion options
        const options = { w: 'majority' };

        // Insert industry into database
        const result = await request.server.db.collection('industry')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const industry = result.ops[0];

        return h.response(industry).code(201);
    }
};

