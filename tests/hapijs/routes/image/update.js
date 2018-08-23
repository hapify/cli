'use strict';

/**
 * Update image
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
    uri: Joi.string().trim(),
}).min(1);

/**
 * Export route to update image
 */
module.exports = {
    method: 'PATCH',
    path: '/image/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update image',
        tags: ['image', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get image id
        const _id = new MongoDB.ObjectId(request.params._id);

        // @hook update:before-update:image

        // Insertion options
        const options = { w: 'majority' };

        // Update image in database
        const result = await request.server.db.collection('image')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Image not found');
        }

        return h.response().code(204);
    }
};

