'use strict';

/**
 * Read partner
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to get partner
 */
module.exports = {
    method: 'GET',
    path: '/partner/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to get partner',
        tags: ['partner', 'read']
    },
    handler: async (request) => {

        // Get partner id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Get partner from database
        const result = await request.server.db.collection('partner')
            .findOne({ _id });

        if (!result) {
            return Boom.notFound('Partner not found');
        }

        // Convert reference fields
        await request.server.utils.Entity
            .populate(request.server.db, result, [
                {
                    col: 'image',
                    prop: 'logo'
                },
            ]);

        return result;
    }
};

