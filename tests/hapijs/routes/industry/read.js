'use strict';

/**
 * Read industry
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get industry
 */
module.exports = {
    method: 'GET',
    path: '/industry/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get industry',
        tags: ['industry', 'read']
    },
    handler: async (request) => {

        // Get industry id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get industry from database
        const result = await request.server.db.collection('industry')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Industry not found');
        }

        return result;
    }
};

