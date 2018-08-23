'use strict';

/**
 * Count reason to attend
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
    label: Joi.string(),
})
;

/**
 * Export route to count reason to attend
 */
module.exports = {
    method: 'GET',
    path: '/reason-to-attend/count',
    config: {
        validate: { query: schema },
        description: 'Route to count reason to attend',
        tags: ['reason-to-attend', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for label
        if (filter.label) {
            filter.label = new RegExp(filter.label, 'i');
        }

        // Count reason to attend from database
        const total = await request.server.db.collection('reason_to_attend')
            .find(filter)
            .count();

        return { total };
    }
};

