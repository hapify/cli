'use strict';

/**
 * Count edition
 */

const Joi = require('joi');
const MongoDB = require('mongodb');

// Validation schema for query
const schema = Joi.object({
    name: Joi.string(),
    year: Joi.number(),
    year__min: Joi.number(),
    year__max: Joi.number(),
    city: Joi.string().length(24).hex(),
    featured_events: Joi.array().items(Joi.string().length(24).hex()).single(),
    featured_startups: Joi.array().items(Joi.string().length(24).hex()).single(),
    videos: Joi.array().items(Joi.string().length(24).hex()).single(),
    partners: Joi.array().items(Joi.string().length(24).hex()).single(),
})
    .without('year', ['year__min', 'year__max'])
;

/**
 * Export route to count edition
 */
module.exports = {
    method: 'GET',
    path: '/edition/count',
    config: {
        validate: { query: schema },
        description: 'Route to count edition',
        tags: ['edition', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for name
        if (filter.name) {
            filter.name = new RegExp(filter.name, 'i');
        }

        // Set min for year if defined
        if (typeof filter.year__min !== 'undefined') {
            filter.year = filter.year || {};
            filter.year.$gte = filter.year__min;
            delete filter.year__min;
        }
        // Set max for year if defined
        if (typeof filter.year__max !== 'undefined') {
            filter.year = filter.year || {};
            filter.year.$lte = filter.year__max;
            delete filter.year__max;
        }

        // Convert MongoId for city
        if (filter.city) {
            filter.city = new MongoDB.ObjectId(filter.city);
        }

        // Convert MongoId for featured events
        if (filter.featured_events) {
            filter.featured_events = { $all: filter.featured_events.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for featured startups
        if (filter.featured_startups) {
            filter.featured_startups = { $all: filter.featured_startups.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for videos
        if (filter.videos) {
            filter.videos = { $all: filter.videos.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for partners
        if (filter.partners) {
            filter.partners = { $all: filter.partners.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Count edition from database
        const total = await request.server.db.collection('edition')
            .find(filter)
            .count();

        return { total };
    }
};

