'use strict';

/**
 * Count industry
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
    name: Joi.string(),
})
;

/**
 * Export route to count industry
 */
module.exports = {
    method: 'GET',
    path: '/industry/count',
    config: {
        validate: { query: schema },
        description: 'Route to count industry',
        tags: ['industry', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for name
        if (filter.name) {
            filter.name = new RegExp(filter.name, 'i');
        }

        // Count industry from database
        const total = await request.server.db.collection('industry')
            .find(filter)
            .count();

        return { total };
    }
};

