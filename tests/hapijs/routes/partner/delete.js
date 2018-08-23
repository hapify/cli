'use strict';

/**
 * Delete partner
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete partner
 */
module.exports = {
    method: 'DELETE',
    path: '/partner/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete partner',
        tags: ['partner', 'delete']
    },
    handler: async (request, h) => {

        // Get partner id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove partner from database
        const result = await request.server.db.collection('partner')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Partner not found');
        }

        // Remove references in city as partners
        await request.server.db.collection('city')
            .updateMany({ partners: _id }, { $pull: { partners: _id } });
        // Remove references in edition as partners
        await request.server.db.collection('edition')
            .updateMany({ partners: _id }, { $pull: { partners: _id } });
        // Remove references in event as partners
        await request.server.db.collection('event')
            .updateMany({ partners: _id }, { $pull: { partners: _id } });

        return h.response().code(204);
    }
};

