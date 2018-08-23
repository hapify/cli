'use strict';

/**
 * Delete industry
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete industry
 */
module.exports = {
    method: 'DELETE',
    path: '/industry/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete industry',
        tags: ['industry', 'delete']
    },
    handler: async (request, h) => {

        // Get industry id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove industry from database
        const result = await request.server.db.collection('industry')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Industry not found');
        }

        // Remove references in startup as industries
        await request.server.db.collection('startup')
            .updateMany({ industries: _id }, { $pull: { industries: _id } });
        // Remove references in user as sector
        await request.server.db.collection('user')
            .updateMany({ sector: _id }, { $pull: { sector: _id } });

        return h.response().code(204);
    }
};

