'use strict';

/**
 * Update city
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
    title: Joi.string().trim(),
    title__fr: Joi.string().trim().allow(null),
    description: Joi.string().trim(),
    description__fr: Joi.string().trim().allow(null),
    logo: Joi.string().length(24).hex(),
    cover: Joi.string().length(24).hex(),
    pictures: Joi.array().items(Joi.string().length(24).hex()).min(1),
    partners: Joi.array().items(Joi.string().length(24).hex()).min(0),
    administrators: Joi.array().items(Joi.string().length(24).hex()).min(0),
    rank: Joi.number().allow(null),
}).min(1);

/**
 * Export route to update city
 */
module.exports = {
    method: 'PATCH',
    path: '/city/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update city',
        tags: ['city', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get city id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.logo = typeof request.payload.logo === 'string' ?
            new MongoDB.ObjectId(request.payload.logo) : null;
        updates.$set.cover = typeof request.payload.cover === 'string' ?
            new MongoDB.ObjectId(request.payload.cover) : null;
        updates.$set.pictures = request.payload.pictures instanceof Array ?
            request.payload.pictures.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.partners = request.payload.partners instanceof Array ?
            request.payload.partners.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.administrators = request.payload.administrators instanceof Array ?
            request.payload.administrators.map((i) => new MongoDB.ObjectId(i)) : null;

        // @hook update:before-update:city

        // Insertion options
        const options = { w: 'majority' };

        // Update city in database
        const result = await request.server.db.collection('city')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('City not found');
        }

        return h.response().code(204);
    }
};

