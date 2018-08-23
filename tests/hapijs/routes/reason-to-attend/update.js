'use strict';

/**
 * Update reason to attend
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schemaParams = Joi.object({
    _id: Joi.string().length(24).hex().required()
});
// Validation schema for payload
const schemaPayload = Joi.object({
    label: Joi.string().trim(),
    label__fr: Joi.string().trim().allow(null),
}).min(1);

/**
 * Export route to update reason to attend
 */
module.exports = {
    method: 'PATCH',
    path: '/reason-to-attend/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update reason to attend',
        tags: ['reason-to-attend', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get reason to attend id
        const _id = new MongoDB.ObjectId(request.params._id);

        // @hook update:before-update:reason-to-attend

        // Insertion options
        const options = { w: 'majority' };

        // Update reason to attend in database
        const result = await request.server.db.collection('reason_to_attend')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Reason To Attend not found');
        }

        return h.response().code(204);
    }
};

