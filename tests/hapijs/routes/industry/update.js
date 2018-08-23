'use strict';

/**
 * Update industry
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
    name: Joi.string().trim(),
    name__fr: Joi.string().trim().allow(null),
}).min(1);

/**
 * Export route to update industry
 */
module.exports = {
    method: 'PATCH',
    path: '/industry/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update industry',
        tags: ['industry', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get industry id
        const _id = new MongoDB.ObjectId(request.params._id);

        // @hook update:before-update:industry

        // Insertion options
        const options = { w: 'majority' };

        // Update industry in database
        const result = await request.server.db.collection('industry')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Industry not found');
        }

        return h.response().code(204);
    }
};

