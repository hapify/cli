'use strict';

/**
 * List city
 */

const Joi = require('joi');
const MongoDB = require('mongodb');

// Validation schema for query
const schema = Joi.object({
    title: Joi.string(),
    partners: Joi.array().items(Joi.string().length(24).hex()).single(),
    administrators: Joi.array().items(Joi.string().length(24).hex()).single(),
    _page: Joi.number().min(0).required(),
    _limit: Joi.number().min(1).max(100).required(),
    _sort: Joi.string().valid('creation', 'title', 'rank'),
    _order: Joi.string().valid('asc', 'desc')
})
;

/**
 * Export route to list city
 */
module.exports = {
    method: 'GET',
    path: '/city',
    config: {
        validate: { query: schema },
        description: 'Route to list city',
        tags: ['city', 'list']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);
        delete filter._page;
        delete filter._limit;
        delete filter._sort;
        delete filter._order;

        // Use regexp for title
        if (filter.title) {
            filter.title = new RegExp(filter.title, 'i');
        }

        // Convert MongoId for partners
        if (filter.partners) {
            filter.partners = { $all: filter.partners.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for administrators
        if (filter.administrators) {
            filter.administrators = { $all: filter.administrators.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Build cursor vars
        const skip = request.query._page * request.query._limit;
        const order = request.query._order || 'asc';
        const sort = request.query._sort;

        // Get city list from database
        const cursor = request.server.db.collection('city')
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

