'use strict';

/**
 * Create bookmark.
 * Returns the created bookmark.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schema = Joi.object({
    startup: Joi.string().length(24).hex().required(),
});

/**
 * Export route to create bookmark
 */
module.exports = {
    method: 'POST',
    path: '/bookmark',
    config: {
        validate: { payload: schema },
        description: 'Route to create bookmark',
        tags: ['bookmark', 'create']
    },
    handler: async (request, h) => {

        // Get bookmark from payload
        const payload = request.payload;

        // Init internal fields
        payload.creation = Date.now();
        payload.user = null;

        // Convert reference fields
        payload.startup = typeof request.payload.startup === 'string' ?
            new MongoDB.ObjectId(request.payload.startup) : null;

        // @hook create:before-insert:bookmark

        // Insertion options
        const options = { w: 'majority' };

        // Insert bookmark into database
        const result = await request.server.db.collection('bookmark')
            .insertOne(payload, options);

        if (result.insertedCount === 0) {
            return Boom.internal('Insert error');
        }

        const bookmark = result.ops[0];

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, bookmark, [
                {
                    col: 'user',
                    prop: 'user',
                    projection: {
                        password: false,
                        validation_code: false,
                        reset_code: false,
                    }
                },
                {
                    col: 'startup',
                    prop: 'startup'
                },
            ]);

        return h.response(bookmark).code(201);
    }
};

