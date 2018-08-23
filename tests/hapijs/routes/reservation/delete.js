'use strict';

/**
 * Delete reservation
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete reservation
 */
module.exports = {
    method: 'DELETE',
    path: '/reservation/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete reservation',
        tags: ['reservation', 'delete']
    },
    handler: async (request, h) => {

        // Get reservation id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove reservation from database
        const result = await request.server.db.collection('reservation')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Reservation not found');
        }

        return h.response().code(204);
    }
};

