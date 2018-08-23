'use strict';

/**
 * Update youtube video
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schemaParams = Joi.object({
    _id: Joi.string().length(24).hex().required()
});
// Validation schema for payload
const schemaPayload = Joi.object({
    name: Joi.string().trim(),
    thumbnail: Joi.string().length(24).hex(),
    youtube_id: Joi.string().trim(),
    global: Joi.boolean(),
}).min(1);

/**
 * Export route to update youtube video
 */
module.exports = {
    method: 'PATCH',
    path: '/youtube-video/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update youtube video',
        tags: ['youtube-video', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get youtube video id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.thumbnail = typeof request.payload.thumbnail === 'string' ?
            new MongoDB.ObjectId(request.payload.thumbnail) : null;

        // @hook update:before-update:youtube-video

        // Insertion options
        const options = { w: 'majority' };

        // Update youtube video in database
        const result = await request.server.db.collection('youtube_video')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Youtube Video not found');
        }

        return h.response().code(204);
    }
};

