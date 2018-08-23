'use strict';

/**
 * Read startup
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get startup
 */
module.exports = {
    method: 'GET',
    path: '/startup/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get startup',
        tags: ['startup', 'read']
    },
    handler: async (request) => {

        // Get startup id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get startup from database
        const result = await request.server.db.collection('startup')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Startup not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
                {
                    col: 'industry',
                    prop: 'industries',
                    multiple: true
                },
                {
                    col: 'looking_for',
                    prop: 'looking_for',
                    multiple: true
                },
                {
                    col: 'heard_about',
                    prop: 'heard_about'
                },
                {
                    col: 'image',
                    prop: 'logo_square'
                },
                {
                    col: 'image',
                    prop: 'logo_rectangle'
                },
                {
                    col: 'image',
                    prop: 'content_image_01'
                },
                {
                    col: 'image',
                    prop: 'content_image_02'
                },
                {
                    col: 'image',
                    prop: 'content_image_03'
                },
                {
                    col: 'edition',
                    prop: 'editions',
                    multiple: true
                },
                {
                    col: 'city',
                    prop: 'city'
                },
                {
                    col: 'user',
                    prop: 'owners',
                    multiple: true,
                    projection: {
                        password: false,
                        validation_code: false,
                        reset_code: false,
                    }
                },
            ]);

        return result;
    }
};

