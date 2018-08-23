'use strict';

/**
 * List event
 */

const Joi = require('joi');
const MongoDB = require('mongodb');

// Validation schema for query
const schema = Joi.object({
    name: Joi.string(),
    starts_at: Joi.number(),
    starts_at__min: Joi.number(),
    starts_at__max: Joi.number(),
    ends_at: Joi.number(),
    ends_at__min: Joi.number(),
    ends_at__max: Joi.number(),
    startups: Joi.array().items(Joi.string().length(24).hex()).single(),
    edition: Joi.string().length(24).hex(),
    city: Joi.string().length(24).hex(),
    partners: Joi.array().items(Joi.string().length(24).hex()).single(),
    _page: Joi.number().min(0).required(),
    _limit: Joi.number().min(1).max(100).required(),
    _sort: Joi.string().valid('creation', 'name', 'starts_at', 'ends_at', 'capacity', 'remaining', 'price'),
    _order: Joi.string().valid('asc', 'desc')
})
    .without('starts_at', ['starts_at__min', 'starts_at__max'])
    .without('ends_at', ['ends_at__min', 'ends_at__max'])
;

/**
 * Export route to list event
 */
module.exports = {
    method: 'GET',
    path: '/event',
    config: {
        validate: { query: schema },
        description: 'Route to list event',
        tags: ['event', 'list']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);
        delete filter._page;
        delete filter._limit;
        delete filter._sort;
        delete filter._order;

        // Use regexp for name
        if (filter.name) {
            filter.name = new RegExp(filter.name, 'i');
        }

        // Set min for starts at if defined
        if (typeof filter.starts_at__min !== 'undefined') {
            filter.starts_at = filter.starts_at || {};
            filter.starts_at.$gte = filter.starts_at__min;
            delete filter.starts_at__min;
        }
        // Set max for starts at if defined
        if (typeof filter.starts_at__max !== 'undefined') {
            filter.starts_at = filter.starts_at || {};
            filter.starts_at.$lte = filter.starts_at__max;
            delete filter.starts_at__max;
        }

        // Set min for ends at if defined
        if (typeof filter.ends_at__min !== 'undefined') {
            filter.ends_at = filter.ends_at || {};
            filter.ends_at.$gte = filter.ends_at__min;
            delete filter.ends_at__min;
        }
        // Set max for ends at if defined
        if (typeof filter.ends_at__max !== 'undefined') {
            filter.ends_at = filter.ends_at || {};
            filter.ends_at.$lte = filter.ends_at__max;
            delete filter.ends_at__max;
        }

        // Convert MongoId for startups
        if (filter.startups) {
            filter.startups = { $all: filter.startups.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for edition
        if (filter.edition) {
            filter.edition = new MongoDB.ObjectId(filter.edition);
        }

        // Convert MongoId for city
        if (filter.city) {
            filter.city = new MongoDB.ObjectId(filter.city);
        }

        // Convert MongoId for partners
        if (filter.partners) {
            filter.partners = { $all: filter.partners.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Build cursor vars
        const skip = request.query._page * request.query._limit;
        const order = request.query._order || 'asc';
        const sort = request.query._sort;

        // Get event list from database
        const cursor = request.server.db.collection('event')
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

