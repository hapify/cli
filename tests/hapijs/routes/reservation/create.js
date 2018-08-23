'use strict';

/**
 * Create reservation.
 * Returns the created reservation.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schema = Joi.object({
    event: Joi.string().length(24).hex().required(),
});

/**
 * Export route to create reservation
 */
module.exports = {
    method: 'POST',
    path: '/reservation',
    config: {
        validate: { payload: schema },
        description: 'Route to create reservation',
        tags: ['reservation', 'create']
    },
    handler: async (request, h) => {

        // Get reservation from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();
        payload.user = null;

        // Convert reference fields
        payload.event = typeof request.payload.event === 'string' ?
            new MongoDB.ObjectId(request.payload.event) : null;

        // @hook create:before-insert:reservation

        // Insertion options
        const options = { w: 'majority' };

        // Insert reservation into database
        const result = await request.server.db.collection('reservation')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const reservation = result.ops[0];

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, reservation, [
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

        return h.response(reservation).code(201);
    }
};

