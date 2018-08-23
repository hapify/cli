'use strict';

/**
 * Update edition
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
    year: Joi.number(),
    cover: Joi.string().length(24).hex(),
    city: Joi.string().length(24).hex(),
    featured_events: Joi.array().items(Joi.string().length(24).hex()).min(0),
    featured_startups: Joi.array().items(Joi.string().length(24).hex()).min(0),
    videos: Joi.array().items(Joi.string().length(24).hex()).min(0),
    partners: Joi.array().items(Joi.string().length(24).hex()).min(0),
}).min(1);

/**
 * Export route to update edition
 */
module.exports = {
    method: 'PATCH',
    path: '/edition/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update edition',
        tags: ['edition', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get edition id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.cover = typeof request.payload.cover === 'string' ?
            new MongoDB.ObjectId(request.payload.cover) : null;
        updates.$set.city = typeof request.payload.city === 'string' ?
            new MongoDB.ObjectId(request.payload.city) : null;
        updates.$set.featured_events = request.payload.featured_events instanceof Array ?
            request.payload.featured_events.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.featured_startups = request.payload.featured_startups instanceof Array ?
            request.payload.featured_startups.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.videos = request.payload.videos instanceof Array ?
            request.payload.videos.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.partners = request.payload.partners instanceof Array ?
            request.payload.partners.map((i) => new MongoDB.ObjectId(i)) : null;

        // @hook update:before-update:edition

        // Insertion options
        const options = { w: 'majority' };

        // Update edition in database
        const result = await request.server.db.collection('edition')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Edition not found');
        }

        return h.response().code(204);
    }
};

