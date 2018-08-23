'use strict';

/**
 * Count user
 */

const Joi = require('joi');
const MongoDB = require('mongodb');

// Validation schema for query
const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    email: Joi.string(),
    role: Joi.string(),
    age: Joi.string(),
    gender: Joi.string(),
    nationality: Joi.string(),
    sector: Joi.array().items(Joi.string().length(24).hex()).single(),
    profession: Joi.string(),
    reason_to_attend: Joi.array().items(Joi.string().length(24).hex()).single(),
    heard_about: Joi.string().length(24).hex(),
    newsletter: Joi.boolean(),
    validated: Joi.boolean(),
})
;

/**
 * Export route to count user
 */
module.exports = {
    method: 'GET',
    path: '/user/count',
    config: {
        validate: { query: schema },
        description: 'Route to count user',
        tags: ['user', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for first name
        if (filter.first_name) {
            filter.first_name = new RegExp(filter.first_name, 'i');
        }

        // Use regexp for last name
        if (filter.last_name) {
            filter.last_name = new RegExp(filter.last_name, 'i');
        }

        // Convert MongoId for sector
        if (filter.sector) {
            filter.sector = { $all: filter.sector.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for reason to attend
        if (filter.reason_to_attend) {
            filter.reason_to_attend = { $all: filter.reason_to_attend.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for heard about
        if (filter.heard_about) {
            filter.heard_about = new MongoDB.ObjectId(filter.heard_about);
        }

        // Count user from database
        const total = await request.server.db.collection('user')
            .find(filter)
            .count();

        return { total };
    }
};

