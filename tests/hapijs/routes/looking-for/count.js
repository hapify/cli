'use strict';

/**
 * Count looking for
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
    label: Joi.string(),
})
;

/**
 * Export route to count looking for
 */
module.exports = {
    method: 'GET',
    path: '/looking-for/count',
    config: {
        validate: { query: schema },
        description: 'Route to count looking for',
        tags: ['looking-for', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for label
        if (filter.label) {
            filter.label = new RegExp(filter.label, 'i');
        }

        // Count looking for from database
        const total = await request.server.db.collection('looking_for')
            .find(filter)
            .count();

        return { total };
    }
};

