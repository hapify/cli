'use strict';

/**
 * Count reservation
 */

const Joi = require('joi');
const MongoDB = require('mongodb');

// Validation schema for query
const schema = Joi.object({
    creation: Joi.number(),
    creation__min: Joi.number(),
    creation__max: Joi.number(),
    user: Joi.string().length(24).hex(),
    event: Joi.string().length(24).hex(),
})
    .without('creation', ['creation__min', 'creation__max'])
;

/**
 * Export route to count reservation
 */
module.exports = {
    method: 'GET',
    path: '/reservation/count',
    config: {
        validate: { query: schema },
        description: 'Route to count reservation',
        tags: ['reservation', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Set min for creation if defined
        if (typeof filter.creation__min !== 'undefined') {
            filter.creation = filter.creation || {};
            filter.creation.$gte = filter.creation__min;
            delete filter.creation__min;
        }
        // Set max for creation if defined
        if (typeof filter.creation__max !== 'undefined') {
            filter.creation = filter.creation || {};
            filter.creation.$lte = filter.creation__max;
            delete filter.creation__max;
        }

        // Convert MongoId for user
        if (filter.user) {
            filter.user = new MongoDB.ObjectId(filter.user);
        }

        // Convert MongoId for event
        if (filter.event) {
            filter.event = new MongoDB.ObjectId(filter.event);
        }

        // Count reservation from database
        const total = await request.server.db.collection('reservation')
            .find(filter)
            .count();

        return { total };
    }
};

