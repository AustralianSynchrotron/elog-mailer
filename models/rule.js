module.exports = Rule;

var _ = require('underscore');

function Rule(condition, values) {
  if(!(this instanceof Rule)) return new Rule(condition, values);
  // TODO: Validate
  this.condition = condition;
  this.values = values;
}

Rule.prototype.toJSON = function() {
  return {
      condition: this.condition
    , values: this.values
  }
}

Rule.prototype.evaluate = function(input) {
  if (this.condition == 'all') {
    return _.intersection(this.values, input).length === this.values.length;
  } else if (this.condition == 'any') {
    return this.values.length === 0 || _.intersection(this.values, input).length !== 0;
  } else {
    throw new Error('Not implemented.');
  }
}
