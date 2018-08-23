'use strict';

/**
 * Update user
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schemaParams = Joi.object({
    _id: Joi.string().length(24).hex().required()
});
// Validation schema for payload
const schemaPayload = Joi.object({
    first_name: Joi.string().trim(),
    last_name: Joi.string().trim(),
    email: Joi.string().email().trim(),
    password: Joi.string().min(6).trim(),
    role: Joi.string().trim(),
    age: Joi.string().trim(),
    gender: Joi.string().trim(),
    nationality: Joi.string().trim(),
    sector: Joi.array().items(Joi.string().length(24).hex()).min(0),
    profession: Joi.string().trim().allow(null),
    linkedin: Joi.string().trim().allow(null),
    reason_to_attend: Joi.array().items(Joi.string().length(24).hex()).min(0),
    heard_about: Joi.string().length(24).hex().allow(null),
    newsletter: Joi.boolean(),
}).min(1);

/**
 * Export route to update user
 */
module.exports = {
    method: 'PATCH',
    path: '/user/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update user',
        tags: ['user', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get user id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.sector = request.payload.sector instanceof Array ?
            request.payload.sector.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.reason_to_attend = request.payload.reason_to_attend instanceof Array ?
            request.payload.reason_to_attend.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.heard_about = typeof request.payload.heard_about === 'string' ?
            new MongoDB.ObjectId(request.payload.heard_about) : null;

        // @hook update:before-update:user

        // Insertion options
        const options = { w: 'majority' };

        // Update user in database
        let result;
        try {
            result = await request.server.db.collection('user')
                .findOneAndUpdate({ _id }, updates, options);
        }
        catch (e) {
            // Handle duplicated key for unique indexes
            return e.name === 'MongoError' && e.code === 11000 ?
                Boom.conflict('Duplicate key') :
                Boom.boomify(e);
        }

        if (result.value === null) {
            return Boom.notFound('User not found');
        }

        return h.response().code(204);
    }
};

