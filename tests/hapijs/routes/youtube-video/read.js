'use strict';

/**
 * Read youtube video
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get youtube video
 */
module.exports = {
    method: 'GET',
    path: '/youtube-video/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get youtube video',
        tags: ['youtube-video', 'read']
    },
    handler: async (request) => {

        // Get youtube video id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get youtube video from database
        const result = await request.server.db.collection('youtube_video')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Youtube Video not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
                {
                    col: 'image',
                    prop: 'thumbnail'
                },
            ]);

        return result;
    }
};

