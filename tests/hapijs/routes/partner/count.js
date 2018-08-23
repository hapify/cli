'use strict';

/**
 * Count partner
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
    name: Joi.string(),
    global: Joi.boolean(),
})
;

/**
 * Export route to count partner
 */
module.exports = {
    method: 'GET',
    path: '/partner/count',
    config: {
        validate: { query: schema },
        description: 'Route to count partner',
        tags: ['partner', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for name
        if (filter.name) {
            filter.name = new RegExp(filter.name, 'i');
        }

        // Count partner from database
        const total = await request.server.db.collection('partner')
            .find(filter)
            .count();

        return { total };
    }
};

