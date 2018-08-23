'use strict';

/**
 * Update tool
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
    description: Joi.string().trim().allow(null),
    link: Joi.string().trim(),
}).min(1);

/**
 * Export route to update tool
 */
module.exports = {
    method: 'PATCH',
    path: '/tool/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update tool',
        tags: ['tool', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get tool id
        const _id = new MongoDB.ObjectId(request.params._id);

        // @hook update:before-update:tool

        // Insertion options
        const options = { w: 'majority' };

        // Update tool in database
        const result = await request.server.db.collection('tool')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Tool not found');
        }

        return h.response().code(204);
    }
};

