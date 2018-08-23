'use strict';

/**
 * Delete looking for
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete looking for
 */
module.exports = {
    method: 'DELETE',
    path: '/looking-for/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete looking for',
        tags: ['looking-for', 'delete']
    },
    handler: async (request, h) => {

        // Get looking for id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove looking for from database
        const result = await request.server.db.collection('looking_for')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Looking For not found');
        }

        // Remove references in startup as looking for
        await request.server.db.collection('startup')
            .updateMany({ looking_for: _id }, { $pull: { looking_for: _id } });

        return h.response().code(204);
    }
};

