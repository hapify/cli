'use strict';

/**
 * Read tool
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get tool
 */
module.exports = {
    method: 'GET',
    path: '/tool/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get tool',
        tags: ['tool', 'read']
    },
    handler: async (request) => {

        // Get tool id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get tool from database
        const result = await request.server.db.collection('tool')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Tool not found');
        }

        return result;
    }
};

