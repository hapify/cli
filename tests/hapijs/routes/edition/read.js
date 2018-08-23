'use strict';

/**
 * Read edition
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get edition
 */
module.exports = {
    method: 'GET',
    path: '/edition/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get edition',
        tags: ['edition', 'read']
    },
    handler: async (request) => {

        // Get edition id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get edition from database
        const result = await request.server.db.collection('edition')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Edition not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
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

        return result;
    }
};

