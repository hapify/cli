'use strict';

/**
 * Read event
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get event
 */
module.exports = {
    method: 'GET',
    path: '/event/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get event',
        tags: ['event', 'read']
    },
    handler: async (request) => {

        // Get event id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get event from database
        const result = await request.server.db.collection('event')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Event not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
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

        return result;
    }
};

