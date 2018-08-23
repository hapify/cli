'use strict';

/**
 * Delete user
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete user
 */
module.exports = {
    method: 'DELETE',
    path: '/user/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete user',
        tags: ['user', 'delete']
    },
    handler: async (request, h) => {

        // Get user id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove user from database
        const result = await request.server.db.collection('user')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('User not found');
        }

        // Remove references in bookmark as user
        await request.server.db.collection('bookmark')
            .updateMany({ user: _id }, { $set: { user: null } });
        // Remove references in city as administrators
        await request.server.db.collection('city')
            .updateMany({ administrators: _id }, { $pull: { administrators: _id } });
        // Remove references in reservation as user
        await request.server.db.collection('reservation')
            .updateMany({ user: _id }, { $set: { user: null } });
        // Remove references in startup as owners
        await request.server.db.collection('startup')
            .updateMany({ owners: _id }, { $pull: { owners: _id } });

        return h.response().code(204);
    }
};

