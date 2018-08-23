'use strict';

/**
 * Update startup
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
    about: Joi.string().trim().allow(null),
    about__fr: Joi.string().trim().allow(null),
    why: Joi.string().trim().allow(null),
    why__fr: Joi.string().trim().allow(null),
    foundation: Joi.number(),
    industries: Joi.array().items(Joi.string().length(24).hex()).min(1),
    returning: Joi.boolean(),
    hiring: Joi.boolean(),
    looking_for: Joi.array().items(Joi.string().length(24).hex()).min(0),
    heard_about: Joi.string().length(24).hex().allow(null),
    logo_square: Joi.string().length(24).hex(),
    logo_rectangle: Joi.string().length(24).hex(),
    content_image_01: Joi.string().length(24).hex(),
    content_image_02: Joi.string().length(24).hex(),
    content_image_03: Joi.string().length(24).hex(),
    address_1: Joi.string().trim(),
    address_2: Joi.string().trim().allow(null),
    building_access: Joi.string().trim().allow(null),
    phone: Joi.string().trim().allow(null),
    wheelchair: Joi.boolean().allow(null),
    website_url: Joi.string().trim().allow(null),
    twitter_url: Joi.string().trim().allow(null),
    facebook_url: Joi.string().trim().allow(null),
    angellist_url: Joi.string().trim().allow(null),
    contact_first_name: Joi.string().trim(),
    contact_last_name: Joi.string().trim(),
    contact_position: Joi.string().trim(),
    contact_phone: Joi.string().trim(),
    contact_email: Joi.string().email().trim(),
    editions: Joi.array().items(Joi.string().length(24).hex()).min(1),
    city: Joi.string().length(24).hex(),
    owners: Joi.array().items(Joi.string().length(24).hex()).min(1),
    employees: Joi.number(),
    offices: Joi.number(),
    jobbio_joblist: Joi.string().trim().allow(null),
    other_joblist: Joi.string().trim().allow(null),
    validated: Joi.boolean(),
}).min(1);

/**
 * Export route to update startup
 */
module.exports = {
    method: 'PATCH',
    path: '/startup/{_id}',
    config: {
        validate: {
            params: schemaParams,
            payload: schemaPayload
        },
        description: 'Route to update startup',
        tags: ['startup', 'update']
    },
    handler: async (request, h) => {

        // Get updates from payload
        const updates = { $set: request.payload };

        // Get startup id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Convert reference fields
        updates.$set.industries = request.payload.industries instanceof Array ?
            request.payload.industries.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.looking_for = request.payload.looking_for instanceof Array ?
            request.payload.looking_for.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.heard_about = typeof request.payload.heard_about === 'string' ?
            new MongoDB.ObjectId(request.payload.heard_about) : null;
        updates.$set.logo_square = typeof request.payload.logo_square === 'string' ?
            new MongoDB.ObjectId(request.payload.logo_square) : null;
        updates.$set.logo_rectangle = typeof request.payload.logo_rectangle === 'string' ?
            new MongoDB.ObjectId(request.payload.logo_rectangle) : null;
        updates.$set.content_image_01 = typeof request.payload.content_image_01 === 'string' ?
            new MongoDB.ObjectId(request.payload.content_image_01) : null;
        updates.$set.content_image_02 = typeof request.payload.content_image_02 === 'string' ?
            new MongoDB.ObjectId(request.payload.content_image_02) : null;
        updates.$set.content_image_03 = typeof request.payload.content_image_03 === 'string' ?
            new MongoDB.ObjectId(request.payload.content_image_03) : null;
        updates.$set.editions = request.payload.editions instanceof Array ?
            request.payload.editions.map((i) => new MongoDB.ObjectId(i)) : null;
        updates.$set.city = typeof request.payload.city === 'string' ?
            new MongoDB.ObjectId(request.payload.city) : null;
        updates.$set.owners = request.payload.owners instanceof Array ?
            request.payload.owners.map((i) => new MongoDB.ObjectId(i)) : null;

        // @hook update:before-update:startup

        // Insertion options
        const options = { w: 'majority' };

        // Update startup in database
        const result = await request.server.db.collection('startup')
            .findOneAndUpdate({ _id }, updates, options);

        if (result.value === null) {
            return Boom.notFound('Startup not found');
        }

        return h.response().code(204);
    }
};

