'use strict';

/**
 * Create partner.
 * Returns the created partner.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schema = Joi.object({
    name: Joi.string().trim().required(),
    logo: Joi.string().length(24).hex().allow(null),
    website_url: Joi.string().trim().allow(null),
    global: Joi.boolean().required(),
    rank: Joi.number().allow(null),
});

/**
 * Export route to create partner
 */
module.exports = {
    method: 'POST',
    path: '/partner',
    config: {
        validate: { payload: schema },
        description: 'Route to create partner',
        tags: ['partner', 'create']
    },
    handler: async (request, h) => {

        // Get partner from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // Convert reference fields
        payload.logo = typeof request.payload.logo === 'string' ?
            new MongoDB.ObjectId(request.payload.logo) : null;

        // @hook create:before-insert:partner

        // Insertion options
        const options = { w: 'majority' };

        // Insert partner into database
        const result = await request.server.db.collection('partner')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const partner = result.ops[0];

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, partner, [
                {
                    col: 'image',
                    prop: 'logo'
                },
            ]);

        return h.response(partner).code(201);
    }
};

