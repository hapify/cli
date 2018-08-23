'use strict';

/**
 * Read reservation
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get reservation
 */
module.exports = {
    method: 'GET',
    path: '/reservation/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get reservation',
        tags: ['reservation', 'read']
    },
    handler: async (request) => {

        // Get reservation id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get reservation from database
        const result = await request.server.db.collection('reservation')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Reservation not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
                {
                    col: 'user',
                    prop: 'user',
                    projection: {
                        password: false,
                        validation_code: false,
                        reset_code: false,
                    }
                },
                {
                    col: 'event',
                    prop: 'event'
                },
            ]);

        return result;
    }
};

