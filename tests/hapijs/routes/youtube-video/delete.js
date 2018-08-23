'use strict';

/**
 * Delete youtube video
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete youtube video
 */
module.exports = {
    method: 'DELETE',
    path: '/youtube-video/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete youtube video',
        tags: ['youtube-video', 'delete']
    },
    handler: async (request, h) => {

        // Get youtube video id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove youtube video from database
        const result = await request.server.db.collection('youtube_video')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Youtube Video not found');
        }

        // Remove references in edition as videos
        await request.server.db.collection('edition')
            .updateMany({ videos: _id }, { $pull: { videos: _id } });

        return h.response().code(204);
    }
};

