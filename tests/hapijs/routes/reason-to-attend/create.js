'use strict';

/**
 * Create reason to attend.
 * Returns the created reason to attend.
 */

const Joi = require('joi');
const Boom = require('boom');

// Validation schema for payload
const schema = Joi.object({
    label: Joi.string().trim().required(),
    label__fr: Joi.string().trim().allow(null),
});

/**
 * Export route to create reason to attend
 */
module.exports = {
    method: 'POST',
    path: '/reason-to-attend',
    config: {
        validate: { payload: schema },
        description: 'Route to create reason to attend',
        tags: ['reason-to-attend', 'create']
    },
    handler: async (request, h) => {

        // Get reason to attend from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // @hook create:before-insert:reason-to-attend

        // Insertion options
        const options = { w: 'majority' };

        // Insert reason to attend into database
        const result = await request.server.db.collection('reason_to_attend')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const reasonToAttend = result.ops[0];

        return h.response(reasonToAttend).code(201);
    }
};

