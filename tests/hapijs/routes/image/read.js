'use strict';

/**
 * Read image
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get image
 */
module.exports = {
    method: 'GET',
    path: '/image/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get image',
        tags: ['image', 'read']
    },
    handler: async (request) => {

        // Get image id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get image from database
        const result = await request.server.db.collection('image')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Image not found');
        }

        return result;
    }
};

