'use strict';

/**
 * Read heard about
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get heard about
 */
module.exports = {
    method: 'GET',
    path: '/heard-about/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get heard about',
        tags: ['heard-about', 'read']
    },
    handler: async (request) => {

        // Get heard about id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get heard about from database
        const result = await request.server.db.collection('heard_about')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Heard About not found');
        }

        return result;
    }
};

