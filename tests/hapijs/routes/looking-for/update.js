'use strict';

/**
 * Update looking for
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
 * Export route to update looking for
 */
module.exports = {
    method: 'PATCH',
    path: '/looking-for/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update looking for',
        tags: ['looking-for', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get looking for id
        const _id = new MongoDB.ObjectId(request.params._id);

        // @hook update:before-update:looking-for

        // Insertion options
        const options = { w: 'majority' };

        // Update looking for in database
        const result = await request.server.db.collection('looking_for')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Looking For not found');
        }

        return h.response().code(204);
    }
};

