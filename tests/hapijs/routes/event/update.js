'use strict';

/**
 * Update event
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
    name: Joi.string().trim(),
    name__fr: Joi.string().trim().allow(null),
    tagline: Joi.string().trim().allow(null),
    tagline__fr: Joi.string().trim().allow(null),
    description: Joi.string().trim(),
    description__fr: Joi.string().trim().allow(null),
    cover: Joi.string().length(24).hex(),
    starts_at: Joi.number(),
    ends_at: Joi.number(),
    address_1: Joi.string().trim(),
    address_2: Joi.string().trim().allow(null),
    capacity: Joi.number(),
    price: Joi.number(),
    startups: Joi.array().items(Joi.string().length(24).hex()).min(0),
    edition: Joi.string().length(24).hex(),
    city: Joi.string().length(24).hex(),
    partners: Joi.array().items(Joi.string().length(24).hex()).min(0),
}).min(1);

/**
 * Export route to update event
 */
module.exports = {
    method: 'PATCH',
    path: '/event/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update event',
        tags: ['event', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get event id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.cover = typeof request.payload.cover === 'string' ?
            new MongoDB.ObjectId(request.payload.cover) : null;
        updates.$set.startups = request.payload.startups instanceof Array ?
            request.payload.startups.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.edition = typeof request.payload.edition === 'string' ?
            new MongoDB.ObjectId(request.payload.edition) : null;
        updates.$set.city = typeof request.payload.city === 'string' ?
            new MongoDB.ObjectId(request.payload.city) : null;
        updates.$set.partners = request.payload.partners instanceof Array ?
            request.payload.partners.map((i) => new MongoDB.ObjectId(i)) : null;

        // @hook update:before-update:event

        // Insertion options
        const options = { w: 'majority' };

        // Update event in database
        const result = await request.server.db.collection('event')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Event not found');
        }

        return h.response().code(204);
    }
};

