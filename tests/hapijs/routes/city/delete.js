'use strict';

/**
 * Delete city
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete city
 */
module.exports = {
    method: 'DELETE',
    path: '/city/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete city',
        tags: ['city', 'delete']
    },
    handler: async (request, h) => {

        // Get city id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove city from database
        const result = await request.server.db.collection('city')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('City not found');
        }

        // Remove references in edition as city
        await request.server.db.collection('edition')
            .updateMany({ city: _id }, { $set: { city: null } });
        // Remove references in event as city
        await request.server.db.collection('event')
            .updateMany({ city: _id }, { $set: { city: null } });
        // Remove references in startup as city
        await request.server.db.collection('startup')
            .updateMany({ city: _id }, { $set: { city: null } });

        return h.response().code(204);
    }
};

