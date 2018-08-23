'use strict';

/**
 * Count city
 */

const Joi = require('joi');
const MongoDB = require('mongodb');

// Validation schema for query
const schema = Joi.object({
    title: Joi.string(),
    partners: Joi.array().items(Joi.string().length(24).hex()).single(),
    administrators: Joi.array().items(Joi.string().length(24).hex()).single(),
})
;

/**
 * Export route to count city
 */
module.exports = {
    method: 'GET',
    path: '/city/count',
    config: {
        validate: { query: schema },
        description: 'Route to count city',
        tags: ['city', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

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

        // Count city from database
        const total = await request.server.db.collection('city')
            .find(filter)
            .count();

        return { total };
    }
};

