'use strict';

/**
 * List user
 */

const Joi = require('joi');
const MongoDB = require('mongodb');

// Validation schema for query
const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    email: Joi.string(),
    role: Joi.string(),
    age: Joi.string(),
    gender: Joi.string(),
    nationality: Joi.string(),
    sector: Joi.array().items(Joi.string().length(24).hex()).single(),
    profession: Joi.string(),
    reason_to_attend: Joi.array().items(Joi.string().length(24).hex()).single(),
    heard_about: Joi.string().length(24).hex(),
    newsletter: Joi.boolean(),
    validated: Joi.boolean(),
    _page: Joi.number().min(0).required(),
    _limit: Joi.number().min(1).max(100).required(),
    _sort: Joi.string().valid('creation', 'first_name', 'last_name', 'email', 'role', 'age', 'gender', 'newsletter', 'validated'),
    _order: Joi.string().valid('asc', 'desc')
})
;

/**
 * Export route to list user
 */
module.exports = {
    method: 'GET',
    path: '/user',
    config: {
        validate: { query: schema },
        description: 'Route to list user',
        tags: ['user', 'list']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);
        delete filter._page;
        delete filter._limit;
        delete filter._sort;
        delete filter._order;

        // Use regexp for first name
        if (filter.first_name) {
            filter.first_name = new RegExp(filter.first_name, 'i');
        }

        // Use regexp for last name
        if (filter.last_name) {
            filter.last_name = new RegExp(filter.last_name, 'i');
        }

        // Convert MongoId for sector
        if (filter.sector) {
            filter.sector = { $all: filter.sector.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for reason to attend
        if (filter.reason_to_attend) {
            filter.reason_to_attend = { $all: filter.reason_to_attend.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for heard about
        if (filter.heard_about) {
            filter.heard_about = new MongoDB.ObjectId(filter.heard_about);
        }

        // Build projection for filtering private fields
        const projection = {
            password: false,
            validation_code: false,
            reset_code: false,
        };

        // Build cursor vars
        const skip = request.query._page * request.query._limit;
        const order = request.query._order || 'asc';
        const sort = request.query._sort;

        // Get user list from database
        const cursor = request.server.db.collection('user')
            .find(filter, { projection })
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

