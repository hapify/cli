'use strict';

/**
 * Create city.
 * Returns the created city.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schema = Joi.object({
    title: Joi.string().trim().required(),
    title__fr: Joi.string().trim().allow(null),
    description: Joi.string().trim().required(),
    description__fr: Joi.string().trim().allow(null),
    logo: Joi.string().length(24).hex().required(),
    cover: Joi.string().length(24).hex().required(),
    pictures: Joi.array().items(Joi.string().length(24).hex()).min(1).required(),
    partners: Joi.array().items(Joi.string().length(24).hex()).min(0),
    administrators: Joi.array().items(Joi.string().length(24).hex()).min(0),
    rank: Joi.number().allow(null),
});

/**
 * Export route to create city
 */
module.exports = {
    method: 'POST',
    path: '/city',
    config: {
        validate: { payload: schema },
        description: 'Route to create city',
        tags: ['city', 'create']
    },
    handler: async (request, h) => {

        // Get city from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // Convert reference fields
        payload.logo = typeof request.payload.logo === 'string' ?
            new MongoDB.ObjectId(request.payload.logo) : null;
        payload.cover = typeof request.payload.cover === 'string' ?
            new MongoDB.ObjectId(request.payload.cover) : null;
        payload.pictures = request.payload.pictures instanceof Array ?
            request.payload.pictures.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.partners = request.payload.partners instanceof Array ?
            request.payload.partners.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.administrators = request.payload.administrators instanceof Array ?
            request.payload.administrators.map((i) => new MongoDB.ObjectId(i)) : null;

        // @hook create:before-insert:city

        // Insertion options
        const options = { w: 'majority' };

        // Insert city into database
        const result = await request.server.db.collection('city')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const city = result.ops[0];

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, city, [
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

        return h.response(city).code(201);
    }
};

