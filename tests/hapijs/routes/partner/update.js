'use strict';

/**
 * Update partner
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
    logo: Joi.string().length(24).hex().allow(null),
    website_url: Joi.string().trim().allow(null),
    global: Joi.boolean(),
    rank: Joi.number().allow(null),
}).min(1);

/**
 * Export route to update partner
 */
module.exports = {
    method: 'PATCH',
    path: '/partner/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update partner',
        tags: ['partner', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get partner id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.logo = typeof request.payload.logo === 'string' ?
            new MongoDB.ObjectId(request.payload.logo) : null;

        // @hook update:before-update:partner

        // Insertion options
        const options = { w: 'majority' };

        // Update partner in database
        const result = await request.server.db.collection('partner')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Partner not found');
        }

        return h.response().code(204);
    }
};

