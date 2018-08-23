'use strict';

/**
 * Delete bookmark
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete bookmark
 */
module.exports = {
    method: 'DELETE',
    path: '/bookmark/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete bookmark',
        tags: ['bookmark', 'delete']
    },
    handler: async (request, h) => {

        // Get bookmark id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove bookmark from database
        const result = await request.server.db.collection('bookmark')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Bookmark not found');
        }

        return h.response().code(204);
    }
};

