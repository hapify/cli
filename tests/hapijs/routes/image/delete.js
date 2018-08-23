'use strict';

/**
 * Delete image
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete image
 */
module.exports = {
    method: 'DELETE',
    path: '/image/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete image',
        tags: ['image', 'delete']
    },
    handler: async (request, h) => {

        // Get image id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove image from database
        const result = await request.server.db.collection('image')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Image not found');
        }

        // Remove references in city as logo
        await request.server.db.collection('city')
            .updateMany({ logo: _id }, { $set: { logo: null } });
        // Remove references in city as cover
        await request.server.db.collection('city')
            .updateMany({ cover: _id }, { $set: { cover: null } });
        // Remove references in city as pictures
        await request.server.db.collection('city')
            .updateMany({ pictures: _id }, { $pull: { pictures: _id } });
        // Remove references in edition as cover
        await request.server.db.collection('edition')
            .updateMany({ cover: _id }, { $set: { cover: null } });
        // Remove references in event as cover
        await request.server.db.collection('event')
            .updateMany({ cover: _id }, { $set: { cover: null } });
        // Remove references in partner as logo
        await request.server.db.collection('partner')
            .updateMany({ logo: _id }, { $set: { logo: null } });
        // Remove references in startup as logo square
        await request.server.db.collection('startup')
            .updateMany({ logo_square: _id }, { $set: { logo_square: null } });
        // Remove references in startup as logo rectangle
        await request.server.db.collection('startup')
            .updateMany({ logo_rectangle: _id }, { $set: { logo_rectangle: null } });
        // Remove references in startup as content image 01
        await request.server.db.collection('startup')
            .updateMany({ content_image_01: _id }, { $set: { content_image_01: null } });
        // Remove references in startup as content image 02
        await request.server.db.collection('startup')
            .updateMany({ content_image_02: _id }, { $set: { content_image_02: null } });
        // Remove references in startup as content image 03
        await request.server.db.collection('startup')
            .updateMany({ content_image_03: _id }, { $set: { content_image_03: null } });
        // Remove references in youtube video as thumbnail
        await request.server.db.collection('youtube_video')
            .updateMany({ thumbnail: _id }, { $set: { thumbnail: null } });

        return h.response().code(204);
    }
};

