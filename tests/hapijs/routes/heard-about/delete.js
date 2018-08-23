'use strict';

/**
 * Delete heard about
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete heard about
 */
module.exports = {
    method: 'DELETE',
    path: '/heard-about/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete heard about',
        tags: ['heard-about', 'delete']
    },
    handler: async (request, h) => {

        // Get heard about id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove heard about from database
        const result = await request.server.db.collection('heard_about')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Heard About not found');
        }

        // Remove references in startup as heard about
        await request.server.db.collection('startup')
            .updateMany({ heard_about: _id }, { $set: { heard_about: null } });
        // Remove references in user as heard about
        await request.server.db.collection('user')
            .updateMany({ heard_about: _id }, { $set: { heard_about: null } });

        return h.response().code(204);
    }
};

