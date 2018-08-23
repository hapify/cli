'use strict';

/**
 * Create user.
 * Returns the created user.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schema = Joi.object({
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).trim().required(),
    role: Joi.string().trim().required(),
    age: Joi.string().trim().required(),
    gender: Joi.string().trim().required(),
    nationality: Joi.string().trim().required(),
    sector: Joi.array().items(Joi.string().length(24).hex()).min(0),
    profession: Joi.string().trim().allow(null),
    linkedin: Joi.string().trim().allow(null),
    reason_to_attend: Joi.array().items(Joi.string().length(24).hex()).min(0),
    heard_about: Joi.string().length(24).hex().allow(null),
    newsletter: Joi.boolean().required(),
});

/**
 * Export route to create user
 */
module.exports = {
    method: 'POST',
    path: '/user',
    config: {
        validate: { payload: schema },
        description: 'Route to create user',
        tags: ['user', 'create']
    },
    handler: async (request, h) => {

        // Get user from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();
        payload.last_connection = null;
        payload.last_connection_ip = null;
        payload.validated = false;
        payload.validation_code = null;
        payload.reset_code = null;

        // Convert reference fields
        payload.sector = request.payload.sector instanceof Array ?
            request.payload.sector.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.reason_to_attend = request.payload.reason_to_attend instanceof Array ?
            request.payload.reason_to_attend.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.heard_about = typeof request.payload.heard_about === 'string' ?
            new MongoDB.ObjectId(request.payload.heard_about) : null;

        // @hook create:before-insert:user

        // Insertion options
        const options = { w: 'majority' };

        // Insert user into database
        let result;
        try {
            result = await request.server.db.collection('user')
                .insertOne(payload, options);
        }
        catch (e) {
            // Handle duplicated key for unique indexes
            return e.name === 'MongoError' && e.code === 11000 ?
                Boom.conflict('Duplicate key') :
                Boom.boomify(e);
        }

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const user = result.ops[0];

        // Delete private properties
        delete user.password;
        delete user.validation_code;
        delete user.reset_code;

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, user, [
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

        return h.response(user).code(201);
    }
};

