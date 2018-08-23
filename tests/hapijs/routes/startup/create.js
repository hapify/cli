'use strict';

/**
 * Create startup.
 * Returns the created startup.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schema = Joi.object({
    name: Joi.string().trim().required(),
    about: Joi.string().trim().allow(null),
    about__fr: Joi.string().trim().allow(null),
    why: Joi.string().trim().allow(null),
    why__fr: Joi.string().trim().allow(null),
    foundation: Joi.number().required(),
    industries: Joi.array().items(Joi.string().length(24).hex()).min(1).required(),
    returning: Joi.boolean().required(),
    hiring: Joi.boolean().required(),
    looking_for: Joi.array().items(Joi.string().length(24).hex()).min(0),
    heard_about: Joi.string().length(24).hex().allow(null),
    logo_square: Joi.string().length(24).hex().required(),
    logo_rectangle: Joi.string().length(24).hex().required(),
    content_image_01: Joi.string().length(24).hex().required(),
    content_image_02: Joi.string().length(24).hex().required(),
    content_image_03: Joi.string().length(24).hex().required(),
    address_1: Joi.string().trim().required(),
    address_2: Joi.string().trim().allow(null),
    building_access: Joi.string().trim().allow(null),
    phone: Joi.string().trim().allow(null),
    wheelchair: Joi.boolean().allow(null),
    website_url: Joi.string().trim().allow(null),
    twitter_url: Joi.string().trim().allow(null),
    facebook_url: Joi.string().trim().allow(null),
    angellist_url: Joi.string().trim().allow(null),
    contact_first_name: Joi.string().trim().required(),
    contact_last_name: Joi.string().trim().required(),
    contact_position: Joi.string().trim().required(),
    contact_phone: Joi.string().trim().required(),
    contact_email: Joi.string().email().trim().required(),
    editions: Joi.array().items(Joi.string().length(24).hex()).min(1).required(),
    city: Joi.string().length(24).hex().required(),
    owners: Joi.array().items(Joi.string().length(24).hex()).min(1).required(),
    employees: Joi.number().required(),
    offices: Joi.number().required(),
    jobbio_joblist: Joi.string().trim().allow(null),
    other_joblist: Joi.string().trim().allow(null),
    validated: Joi.boolean().required(),
});

/**
 * Export route to create startup
 */
module.exports = {
    method: 'POST',
    path: '/startup',
    config: {
        validate: { payload: schema },
        description: 'Route to create startup',
        tags: ['startup', 'create']
    },
    handler: async (request, h) => {

        // Get startup from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();
        payload.latitude = 0;
        payload.longitude = 0;

        // Convert reference fields
        payload.industries = request.payload.industries instanceof Array ?
            request.payload.industries.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.looking_for = request.payload.looking_for instanceof Array ?
            request.payload.looking_for.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.heard_about = typeof request.payload.heard_about === 'string' ?
            new MongoDB.ObjectId(request.payload.heard_about) : null;
        payload.logo_square = typeof request.payload.logo_square === 'string' ?
            new MongoDB.ObjectId(request.payload.logo_square) : null;
        payload.logo_rectangle = typeof request.payload.logo_rectangle === 'string' ?
            new MongoDB.ObjectId(request.payload.logo_rectangle) : null;
        payload.content_image_01 = typeof request.payload.content_image_01 === 'string' ?
            new MongoDB.ObjectId(request.payload.content_image_01) : null;
        payload.content_image_02 = typeof request.payload.content_image_02 === 'string' ?
            new MongoDB.ObjectId(request.payload.content_image_02) : null;
        payload.content_image_03 = typeof request.payload.content_image_03 === 'string' ?
            new MongoDB.ObjectId(request.payload.content_image_03) : null;
        payload.editions = request.payload.editions instanceof Array ?
            request.payload.editions.map((i) => new MongoDB.ObjectId(i)) : null;
        payload.city = typeof request.payload.city === 'string' ?
            new MongoDB.ObjectId(request.payload.city) : null;
        payload.owners = request.payload.owners instanceof Array ?
            request.payload.owners.map((i) => new MongoDB.ObjectId(i)) : null;

        // @hook create:before-insert:startup

        // Insertion options
        const options = { w: 'majority' };

        // Insert startup into database
        const result = await request.server.db.collection('startup')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const startup = result.ops[0];

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, startup, [
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

        return h.response(startup).code(201);
    }
};

