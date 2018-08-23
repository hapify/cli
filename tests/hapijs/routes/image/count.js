'use strict';

/**
 * Count image
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
})
;

/**
 * Export route to count image
 */
module.exports = {
    method: 'GET',
    path: '/image/count',
    config: {
        validate: { query: schema },
        description: 'Route to count image',
        tags: ['image', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Count image from database
        const total = await request.server.db.collection('image')
            .find(filter)
            .count();

        return { total };
    }
};

