'use strict';

/**
 * Read reason to attend
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get reason to attend
 */
module.exports = {
    method: 'GET',
    path: '/reason-to-attend/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get reason to attend',
        tags: ['reason-to-attend', 'read']
    },
    handler: async (request) => {

        // Get reason to attend id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get reason to attend from database
        const result = await request.server.db.collection('reason_to_attend')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Reason To Attend not found');
        }

        return result;
    }
};

