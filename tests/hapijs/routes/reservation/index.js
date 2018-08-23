'use strict';

/**
 * Export endpoints for reservation.
 */

module.exports = [
    require('./create'),
    require('./read'),
    require('./update'),
    require('./delete'),
    require('./list'),
    require('./count')
];
