'use strict';

/**
 * Create youtube video.
 * Returns the created youtube video.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schema = Joi.object({
    name: Joi.string().trim().required(),
    thumbnail: Joi.string().length(24).hex().required(),
    youtube_id: Joi.string().trim().required(),
    global: Joi.boolean().required(),
});

/**
 * Export route to create youtube video
 */
module.exports = {
    method: 'POST',
    path: '/youtube-video',
    config: {
        validate: { payload: schema },
        description: 'Route to create youtube video',
        tags: ['youtube-video', 'create']
    },
    handler: async (request, h) => {

        // Get youtube video from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // Convert reference fields
        payload.thumbnail = typeof request.payload.thumbnail === 'string' ?
            new MongoDB.ObjectId(request.payload.thumbnail) : null;

        // @hook create:before-insert:youtube-video

        // Insertion options
        const options = { w: 'majority' };

        // Insert youtube video into database
        const result = await request.server.db.collection('youtube_video')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const youtubeVideo = result.ops[0];

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, youtubeVideo, [
                {
                    col: 'image',
                    prop: 'thumbnail'
                },
            ]);

        return h.response(youtubeVideo).code(201);
    }
};

