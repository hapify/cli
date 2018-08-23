'use strict';

/**
 * Update reservation
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
    event: Joi.string().length(24).hex(),
}).min(1);

/**
 * Export route to update reservation
 */
module.exports = {
    method: 'PATCH',
    path: '/reservation/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update reservation',
        tags: ['reservation', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get reservation id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.event = typeof request.payload.event === 'string' ?
            new MongoDB.ObjectId(request.payload.event) : null;

        // @hook update:before-update:reservation

        // Insertion options
        const options = { w: 'majority' };

        // Update reservation in database
        const result = await request.server.db.collection('reservation')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Reservation not found');
        }

        return h.response().code(204);
    }
};

