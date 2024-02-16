'use strict';

/**
 * rich-text service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rich-text.rich-text');
