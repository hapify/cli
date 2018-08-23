'use strict';

/**
 * Update bookmark
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
    startup: Joi.string().length(24).hex(),
}).min(1);

/**
 * Export route to update bookmark
 */
module.exports = {
    method: 'PATCH',
    path: '/bookmark/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update bookmark',
        tags: ['bookmark', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get bookmark id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.startup = typeof request.payload.startup === 'string' ?
            new MongoDB.ObjectId(request.payload.startup) : null;

        // @hook update:before-update:bookmark

        // Insertion options
        const options = { w: 'majority' };

        // Update bookmark in database
        const result = await request.server.db.collection('bookmark')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Bookmark not found');
        }

        return h.response().code(204);
    }
};

