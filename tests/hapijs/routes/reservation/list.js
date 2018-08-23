'use strict';

/**
 * List reservation
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
    _page: Joi.number().min(0).required(),
    _limit: Joi.number().min(1).max(100).required(),
    _sort: Joi.string().valid('creation'),
    _order: Joi.string().valid('asc', 'desc')
})
    .without('creation', ['creation__min', 'creation__max'])
;

/**
 * Export route to list reservation
 */
module.exports = {
    method: 'GET',
    path: '/reservation',
    config: {
        validate: { query: schema },
        description: 'Route to list reservation',
        tags: ['reservation', 'list']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);
        delete filter._page;
        delete filter._limit;
        delete filter._sort;
        delete filter._order;

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

        // Build cursor vars
        const skip = request.query._page * request.query._limit;
        const order = request.query._order || 'asc';
        const sort = request.query._sort;

        // Get reservation list from database
        const cursor = request.server.db.collection('reservation')
            .find(filter)
            .skip(skip)
            .limit(request.query._limit);

        // Add sorting if available
        if (sort) {
            cursor.sort( { [sort]: order === 'asc' ? 1 : -1 } );
        }

        // Start query
        const results = await cursor.toArray();
        const total = await cursor.count();

        return {
            page: request.query._page,
            limit: request.query._limit,
            count: results.length,
            total,
            items: results
        };
    }
};

