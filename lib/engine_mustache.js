/*
 * mustache pattern engine for patternlab-node - v0.10.1 - 2015
 *
 * Geoffrey Pursell, Brian Muenzenmeyer, and the web community.
 * Licensed under the MIT license.
 *
 * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice.
 *
 */

/*
 * ENGINE SUPPORT LEVEL:
 *
 * Full + extensions. Partial calls and lineage hunting are supported. Style
 * modifiers and pattern parameters are used to extend the core feature set of
 * Mustache templates.
 *
 */

"use strict";

var Mustache = require('mustache');
var utilMustache = require('./util_mustache');

var engine_mustache = {
  engine: Mustache,
  engineName: 'mustache',
  engineFileExtension: '.mustache',

  // partial expansion is only necessary for Mustache templates that have
  // style modifiers or pattern parameters (I think)
  expandPartials: true,

  // regexes, stored here so they're only compiled once
  findPartialsRE: utilMustache.partialsRE,
  findPartialsWithStyleModifiersRE: utilMustache.partialsWithStyleModifiersRE,
  findPartialsWithPatternParametersRE: utilMustache.partialsWithPatternParametersRE,
  findListItemsRE: utilMustache.listItemsRE,
  findPartialKeyRE: utilMustache.partialKeyRE,

  // render it
  renderPattern: function renderPattern(template, data, partials) {
    if (partials) {
      return Mustache.render(template, data, partials);
    }
    return Mustache.render(template, data);
  },

  /**
   * Find regex matches within both pattern strings and pattern objects.
   *
   * @param {string|object} pattern Either a string or a pattern object.
   * @param {object} regex A JavaScript RegExp object.
   * @returns {array|null} An array if a match is found, null if not.
   */
  patternMatcher: function patternMatcher(pattern, regex) {
    var matches;

    if (typeof pattern === 'string') {
      matches = pattern.match(regex);
    } else if (typeof pattern === 'object' && typeof pattern.template === 'string') {
      matches = pattern.template.match(regex);
    }

    return matches;
  },

  // find and return any {{> template-name }} within pattern
  findPartials: function findPartials(pattern) {
    var matches = this.patternMatcher(pattern, this.findPartialsRE);
    return matches;
  },
  findPartialsWithStyleModifiers: function (pattern) {
    var matches = this.patternMatcher(pattern, this.findPartialsWithStyleModifiersRE);
    return matches;
  },

  // returns any patterns that match {{> value(foo:"bar") }} or {{>
  // value:mod(foo:"bar") }} within the pattern
  findPartialsWithPatternParameters: function (pattern) {
    var matches = this.patternMatcher(pattern, this.findPartialsWithPatternParametersRE);
    return matches;
  },
  findListItems: function (pattern) {
    var matches = this.patternMatcher(pattern, this.findListItemsRE);
    return matches;
  },

  // given a pattern, and a partial string, tease out the "pattern key" and
  // return it.
  findPartialKey_new: function (partialString) {
    var partialKey = partialString.replace(this.findPartialKeyRE, '$1');
    return partialKey;
  },

  // GTP: the old implementation works better. We might not need
  // this.findPartialKeyRE anymore if it works in all cases!
  findPartialKey: function (partialString) {
    //strip out the template cruft
    var foundPatternKey = partialString.replace("{{> ", "").replace(" }}", "").replace("{{>", "").replace("}}", "");

    // remove any potential pattern parameters. this and the above are rather brutish but I didn't want to do a regex at the time
    if (foundPatternKey.indexOf('(') > 0) {
      foundPatternKey = foundPatternKey.substring(0, foundPatternKey.indexOf('('));
    }

    //remove any potential stylemodifiers.
    foundPatternKey = foundPatternKey.split(':')[0];

    return foundPatternKey;
  }
};

module.exports = engine_mustache;