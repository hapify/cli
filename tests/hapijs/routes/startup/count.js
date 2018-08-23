'use strict';

/**
 * Count startup
 */

const Joi = require('joi');
const MongoDB = require('mongodb');

// Validation schema for query
const schema = Joi.object({
    name: Joi.string(),
    industries: Joi.array().items(Joi.string().length(24).hex()).single(),
    returning: Joi.boolean(),
    hiring: Joi.boolean(),
    looking_for: Joi.array().items(Joi.string().length(24).hex()).single(),
    heard_about: Joi.string().length(24).hex(),
    latitude: Joi.number(),
    latitude__min: Joi.number(),
    latitude__max: Joi.number(),
    longitude: Joi.number(),
    longitude__min: Joi.number(),
    longitude__max: Joi.number(),
    contact_email: Joi.string(),
    editions: Joi.array().items(Joi.string().length(24).hex()).single(),
    city: Joi.string().length(24).hex(),
    owners: Joi.array().items(Joi.string().length(24).hex()).single(),
    employees: Joi.number(),
    employees__min: Joi.number(),
    employees__max: Joi.number(),
    offices: Joi.number(),
    offices__min: Joi.number(),
    offices__max: Joi.number(),
    validated: Joi.boolean(),
})
    .without('latitude', ['latitude__min', 'latitude__max'])
    .without('longitude', ['longitude__min', 'longitude__max'])
    .without('employees', ['employees__min', 'employees__max'])
    .without('offices', ['offices__min', 'offices__max'])
;

/**
 * Export route to count startup
 */
module.exports = {
    method: 'GET',
    path: '/startup/count',
    config: {
        validate: { query: schema },
        description: 'Route to count startup',
        tags: ['startup', 'count']
    },
    handler: async (request) => {

        // Build filter from query
        const filter = Object.assign({}, request.query);

        // Use regexp for name
        if (filter.name) {
            filter.name = new RegExp(filter.name, 'i');
        }

        // Convert MongoId for industries
        if (filter.industries) {
            filter.industries = { $all: filter.industries.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for looking for
        if (filter.looking_for) {
            filter.looking_for = { $all: filter.looking_for.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for heard about
        if (filter.heard_about) {
            filter.heard_about = new MongoDB.ObjectId(filter.heard_about);
        }

        // Set min for latitude if defined
        if (typeof filter.latitude__min !== 'undefined') {
            filter.latitude = filter.latitude || {};
            filter.latitude.$gte = filter.latitude__min;
            delete filter.latitude__min;
        }
        // Set max for latitude if defined
        if (typeof filter.latitude__max !== 'undefined') {
            filter.latitude = filter.latitude || {};
            filter.latitude.$lte = filter.latitude__max;
            delete filter.latitude__max;
        }

        // Set min for longitude if defined
        if (typeof filter.longitude__min !== 'undefined') {
            filter.longitude = filter.longitude || {};
            filter.longitude.$gte = filter.longitude__min;
            delete filter.longitude__min;
        }
        // Set max for longitude if defined
        if (typeof filter.longitude__max !== 'undefined') {
            filter.longitude = filter.longitude || {};
            filter.longitude.$lte = filter.longitude__max;
            delete filter.longitude__max;
        }

        // Convert MongoId for editions
        if (filter.editions) {
            filter.editions = { $all: filter.editions.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Convert MongoId for city
        if (filter.city) {
            filter.city = new MongoDB.ObjectId(filter.city);
        }

        // Convert MongoId for owners
        if (filter.owners) {
            filter.owners = { $all: filter.owners.map((i) => new MongoDB.ObjectId(i)) };
        }

        // Set min for employees if defined
        if (typeof filter.employees__min !== 'undefined') {
            filter.employees = filter.employees || {};
            filter.employees.$gte = filter.employees__min;
            delete filter.employees__min;
        }
        // Set max for employees if defined
        if (typeof filter.employees__max !== 'undefined') {
            filter.employees = filter.employees || {};
            filter.employees.$lte = filter.employees__max;
            delete filter.employees__max;
        }

        // Set min for offices if defined
        if (typeof filter.offices__min !== 'undefined') {
            filter.offices = filter.offices || {};
            filter.offices.$gte = filter.offices__min;
            delete filter.offices__min;
        }
        // Set max for offices if defined
        if (typeof filter.offices__max !== 'undefined') {
            filter.offices = filter.offices || {};
            filter.offices.$lte = filter.offices__max;
            delete filter.offices__max;
        }

        // Count startup from database
        const total = await request.server.db.collection('startup')
            .find(filter)
            .count();

        return { total };
    }
};

