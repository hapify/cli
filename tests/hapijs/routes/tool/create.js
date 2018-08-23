'use strict';

/**
 * Create tool.
 * Returns the created tool.
 */

const Joi = require('joi');
const Boom = require('boom');

// Validation schema for payload
const schema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow(null),
    link: Joi.string().trim().required(),
});

/**
 * Export route to create tool
 */
module.exports = {
    method: 'POST',
    path: '/tool',
    config: {
        validate: { payload: schema },
        description: 'Route to create tool',
        tags: ['tool', 'create']
    },
    handler: async (request, h) => {

        // Get tool from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // @hook create:before-insert:tool

        // Insertion options
        const options = { w: 'majority' };

        // Insert tool into database
        const result = await request.server.db.collection('tool')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const tool = result.ops[0];

        return h.response(tool).code(201);
    }
};

