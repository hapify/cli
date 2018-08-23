'use strict';

/**
 * Delete startup
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete startup
 */
module.exports = {
    method: 'DELETE',
    path: '/startup/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete startup',
        tags: ['startup', 'delete']
    },
    handler: async (request, h) => {

        // Get startup id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove startup from database
        const result = await request.server.db.collection('startup')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Startup not found');
        }

        // Remove references in bookmark as startup
        await request.server.db.collection('bookmark')
            .updateMany({ startup: _id }, { $set: { startup: null } });
        // Remove references in edition as featured startups
        await request.server.db.collection('edition')
            .updateMany({ featured_startups: _id }, { $pull: { featured_startups: _id } });
        // Remove references in event as startups
        await request.server.db.collection('event')
            .updateMany({ startups: _id }, { $pull: { startups: _id } });

        return h.response().code(204);
    }
};

