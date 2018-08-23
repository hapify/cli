'use strict';

/**
 * Count heard about
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
    label: Joi.string(),
})
;

/**
 * Export route to count heard about
 */
module.exports = {
    method: 'GET',
    path: '/heard-about/count',
    config: {
        validate: { query: schema },
        description: 'Route to count heard about',
        tags: ['heard-about', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for label
        if (filter.label) {
            filter.label = new RegExp(filter.label, 'i');
        }

        // Count heard about from database
        const total = await request.server.db.collection('heard_about')
            .find(filter)
            .count();

        return { total };
    }
};

