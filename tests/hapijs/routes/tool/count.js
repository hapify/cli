'use strict';

/**
 * Count tool
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
    name: Joi.string(),
})
;

/**
 * Export route to count tool
 */
module.exports = {
    method: 'GET',
    path: '/tool/count',
    config: {
        validate: { query: schema },
        description: 'Route to count tool',
        tags: ['tool', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for name
        if (filter.name) {
            filter.name = new RegExp(filter.name, 'i');
        }

        // Count tool from database
        const total = await request.server.db.collection('tool')
            .find(filter)
            .count();

        return { total };
    }
};

