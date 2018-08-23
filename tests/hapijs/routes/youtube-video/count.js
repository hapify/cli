'use strict';

/**
 * Count youtube video
 */

const Joi = require('joi');

// Validation schema for query
const schema = Joi.object({
    name: Joi.string(),
    global: Joi.boolean(),
})
;

/**
 * Export route to count youtube video
 */
module.exports = {
    method: 'GET',
    path: '/youtube-video/count',
    config: {
        validate: { query: schema },
        description: 'Route to count youtube video',
        tags: ['youtube-video', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for name
        if (filter.name) {
            filter.name = new RegExp(filter.name, 'i');
        }

        // Count youtube video from database
        const total = await request.server.db.collection('youtube_video')
            .find(filter)
            .count();

        return { total };
    }
};

