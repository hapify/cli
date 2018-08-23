'use strict';

/**
 * Delete tool
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete tool
 */
module.exports = {
    method: 'DELETE',
    path: '/tool/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete tool',
        tags: ['tool', 'delete']
    },
    handler: async (request, h) => {

        // Get tool id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove tool from database
        const result = await request.server.db.collection('tool')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Tool not found');
        }

        return h.response().code(204);
    }
};

