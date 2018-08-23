'use strict';

/**
 * List image
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
    _page: Joi.number().min(0).required(),
    _limit: Joi.number().min(1).max(100).required(),
    _sort: Joi.string().valid('creation'),
    _order: Joi.string().valid('asc', 'desc')
})
;

/**
 * Export route to list image
 */
module.exports = {
    method: 'GET',
    path: '/image',
    config: {
        validate: { query: schema },
        description: 'Route to list image',
        tags: ['image', 'list']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);
        delete filter._page;
        delete filter._limit;
        delete filter._sort;
        delete filter._order;

        // Build cursor vars
        const skip = request.query._page * request.query._limit;
        const order = request.query._order || 'asc';
        const sort = request.query._sort;

        // Get image list from database
        const cursor = request.server.db.collection('image')
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

