'use strict';

/**
 * Delete edition
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete edition
 */
module.exports = {
    method: 'DELETE',
    path: '/edition/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete edition',
        tags: ['edition', 'delete']
    },
    handler: async (request, h) => {

        // Get edition id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove edition from database
        const result = await request.server.db.collection('edition')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Edition not found');
        }

        // Remove references in event as edition
        await request.server.db.collection('event')
            .updateMany({ edition: _id }, { $set: { edition: null } });
        // Remove references in startup as editions
        await request.server.db.collection('startup')
            .updateMany({ editions: _id }, { $pull: { editions: _id } });

        return h.response().code(204);
    }
};

