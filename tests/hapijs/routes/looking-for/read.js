'use strict';

/**
 * Read looking for
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get looking for
 */
module.exports = {
    method: 'GET',
    path: '/looking-for/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get looking for',
        tags: ['looking-for', 'read']
    },
    handler: async (request) => {

        // Get looking for id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get looking for from database
        const result = await request.server.db.collection('looking_for')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Looking For not found');
        }

        return result;
    }
};

