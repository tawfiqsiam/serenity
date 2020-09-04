const Schemas = require('./schemas/Schemas');
const { Client } = require('@serenity/core');
const Config = require('../config');
const Levels = require('./Levels');
const Util = require('./Util');

module.exports = class SerenityClient extends Client {
   constructor(options) {
      super(options);
      this.levels = new Levels(this);
      this.config = Config;
      this.util = Util;
   }
};
