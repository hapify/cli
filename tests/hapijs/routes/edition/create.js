'use strict';

/**
 * Create edition.
 * Returns the created edition.
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
    year: Joi.number().required(),
    cover: Joi.string().length(24).hex().required(),
    city: Joi.string().length(24).hex().required(),
    featured_events: Joi.array().items(Joi.string().length(24).hex()).min(0),
    featured_startups: Joi.array().items(Joi.string().length(24).hex()).min(0),
    videos: Joi.array().items(Joi.string().length(24).hex()).min(0),
    partners: Joi.array().items(Joi.string().length(24).hex()).min(0),
});

/**
 * Export route to create edition
 */
module.exports = {
    method: 'POST',
    path: '/edition',
    config: {
        validate: { payload: schema },
        description: 'Route to create edition',
        tags: ['edition', 'create']
    },
    handler: async (request, h) => {

        // Get edition from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // Convert reference fields
        payload.cover = typeof request.payload.cover === 'string' ?
            new MongoDB.ObjectId(request.payload.cover) : null;
        payload.city = typeof request.payload.city === 'string' ?
            new MongoDB.ObjectId(request.payload.city) : null;
        payload.featured_events = request.payload.featured_events instanceof Array ?
            request.payload.featured_events.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.featured_startups = request.payload.featured_startups instanceof Array ?
            request.payload.featured_startups.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.videos = request.payload.videos instanceof Array ?
            request.payload.videos.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.partners = request.payload.partners instanceof Array ?
            request.payload.partners.map((i) => new MongoDB.ObjectId(i)) : null;

        // @hook create:before-insert:edition

        // Insertion options
        const options = { w: 'majority' };

        // Insert edition into database
        const result = await request.server.db.collection('edition')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const edition = result.ops[0];

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, edition, [
                {
                    col: 'image',
                    prop: 'cover'
                },
                {
                    col: 'city',
                    prop: 'city'
                },
                {
                    col: 'event',
                    prop: 'featured_events',
                    multiple: true
                },
                {
                    col: 'startup',
                    prop: 'featured_startups',
                    multiple: true
                },
                {
                    col: 'youtube_video',
                    prop: 'videos',
                    multiple: true
                },
                {
                    col: 'partner',
                    prop: 'partners',
                    multiple: true
                },
            ]);

        return h.response(edition).code(201);
    }
};

