'use strict';

/**
 * Read user
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get user
 */
module.exports = {
    method: 'GET',
    path: '/user/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get user',
        tags: ['user', 'read']
    },
    handler: async (request) => {

        // Get user id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Build projection for filtering private fields
        const projection = {
            password: false,
            validation_code: false,
            reset_code: false,
        };

        // Get user from database
        const result = await request.server.db.collection('user')
            .findOne({ _id }, { projection });

        if (!result) {
            return Boom.notFound('User not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
                {
                    col: 'industry',
                    prop: 'sector',
                    multiple: true
                },
                {
                    col: 'reason_to_attend',
                    prop: 'reason_to_attend',
                    multiple: true
                },
                {
                    col: 'heard_about',
                    prop: 'heard_about'
                },
            ]);

        return result;
    }
};

