'use strict';

/**
 * Create event.
 * Returns the created event.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schema = Joi.object({
    name: Joi.string().trim().required(),
    name__fr: Joi.string().trim().allow(null),
    tagline: Joi.string().trim().allow(null),
    tagline__fr: Joi.string().trim().allow(null),
    description: Joi.string().trim().required(),
    description__fr: Joi.string().trim().allow(null),
    cover: Joi.string().length(24).hex().required(),
    starts_at: Joi.number().required(),
    ends_at: Joi.number().required(),
    address_1: Joi.string().trim().required(),
    address_2: Joi.string().trim().allow(null),
    capacity: Joi.number().required(),
    price: Joi.number().required(),
    startups: Joi.array().items(Joi.string().length(24).hex()).min(0),
    edition: Joi.string().length(24).hex().required(),
    city: Joi.string().length(24).hex().required(),
    partners: Joi.array().items(Joi.string().length(24).hex()).min(0),
});

/**
 * Export route to create event
 */
module.exports = {
    method: 'POST',
    path: '/event',
    config: {
        validate: { payload: schema },
        description: 'Route to create event',
        tags: ['event', 'create']
    },
    handler: async (request, h) => {

        // Get event from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();
        payload.remaining = 0;

        // Convert reference fields
        payload.cover = typeof request.payload.cover === 'string' ?
            new MongoDB.ObjectId(request.payload.cover) : null;
        payload.startups = request.payload.startups instanceof Array ?
            request.payload.startups.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.edition = typeof request.payload.edition === 'string' ?
            new MongoDB.ObjectId(request.payload.edition) : null;
        payload.city = typeof request.payload.city === 'string' ?
            new MongoDB.ObjectId(request.payload.city) : null;
        payload.partners = request.payload.partners instanceof Array ?
            request.payload.partners.map((i) => new MongoDB.ObjectId(i)) : null;

        // @hook create:before-insert:event

        // Insertion options
        const options = { w: 'majority' };

        // Insert event into database
        const result = await request.server.db.collection('event')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const event = result.ops[0];

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, event, [
                {
                    col: 'image',
                    prop: 'cover'
                },
                {
                    col: 'startup',
                    prop: 'startups',
                    multiple: true
                },
                {
                    col: 'edition',
                    prop: 'edition'
                },
                {
                    col: 'city',
                    prop: 'city'
                },
                {
                    col: 'partner',
                    prop: 'partners',
                    multiple: true
                },
            ]);

        return h.response(event).code(201);
    }
};

