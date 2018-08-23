'use strict';

/**
 * Read city
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get city
 */
module.exports = {
    method: 'GET',
    path: '/city/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get city',
        tags: ['city', 'read']
    },
    handler: async (request) => {

        // Get city id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get city from database
        const result = await request.server.db.collection('city')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('City not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
                {
                    col: 'image',
                    prop: 'logo'
                },
                {
                    col: 'image',
                    prop: 'cover'
                },
                {
                    col: 'image',
                    prop: 'pictures',
                    multiple: true
                },
                {
                    col: 'partner',
                    prop: 'partners',
                    multiple: true
                },
                {
                    col: 'user',
                    prop: 'administrators',
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

