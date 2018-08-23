'use strict';

/**
 * Create image.
 * Returns the created image.
 */

const Joi = require('joi');
const Boom = require('boom');

// Validation schema for payload
const schema = Joi.object({
    uri: Joi.string().trim().required(),
});

/**
 * Export route to create image
 */
module.exports = {
    method: 'POST',
    path: '/image',
    config: {
        validate: { payload: schema },
        description: 'Route to create image',
        tags: ['image', 'create']
    },
    handler: async (request, h) => {

        // Get image from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();

        // @hook create:before-insert:image

        // Insertion options
        const options = { w: 'majority' };

        // Insert image into database
        const result = await request.server.db.collection('image')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const image = result.ops[0];

        return h.response(image).code(201);
    }
};

