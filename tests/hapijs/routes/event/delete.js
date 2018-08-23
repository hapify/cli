'use strict';

/**
 * Delete event
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete event
 */
module.exports = {
    method: 'DELETE',
    path: '/event/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete event',
        tags: ['event', 'delete']
    },
    handler: async (request, h) => {

        // Get event id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove event from database
        const result = await request.server.db.collection('event')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Event not found');
        }

        // Remove references in edition as featured events
        await request.server.db.collection('edition')
            .updateMany({ featured_events: _id }, { $pull: { featured_events: _id } });
        // Remove references in reservation as event
        await request.server.db.collection('reservation')
            .updateMany({ event: _id }, { $set: { event: null } });

        return h.response().code(204);
    }
};

