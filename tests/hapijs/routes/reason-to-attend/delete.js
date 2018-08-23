'use strict';

/**
 * Delete reason to attend
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for params
const schema = Joi.object({
    _id: Joi.string().length(24).hex().required()
});

/**
 * Export route to delete reason to attend
 */
module.exports = {
    method: 'DELETE',
    path: '/reason-to-attend/{_id}',
    config: {
        validate: { params: schema },
        description: 'Route to delete reason to attend',
        tags: ['reason-to-attend', 'delete']
    },
    handler: async (request, h) => {

        // Get reason to attend id
        const _id = new MongoDB.ObjectId(request.params._id);

        // Remove reason to attend from database
        const result = await request.server.db.collection('reason_to_attend')
            .deleteOne({ _id });

        if (result.deletedCount === 0) {
            return Boom.notFound('Reason To Attend not found');
        }

        // Remove references in user as reason to attend
        await request.server.db.collection('user')
            .updateMany({ reason_to_attend: _id }, { $pull: { reason_to_attend: _id } });

        return h.response().code(204);
    }
};

