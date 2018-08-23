'use strict';

/**
 * Read bookmark
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get bookmark
 */
module.exports = {
    method: 'GET',
    path: '/bookmark/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get bookmark',
        tags: ['bookmark', 'read']
    },
    handler: async (request) => {

        // Get bookmark id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get bookmark from database
        const result = await request.server.db.collection('bookmark')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Bookmark not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
                {
                    col: 'user',
                    prop: 'user',
                    projection: {
                        password: false,
                        validation_code: false,
                        reset_code: false,
                    }
                },
                {
                    col: 'startup',
                    prop: 'startup'
                },
            ]);

        return result;
    }
};

