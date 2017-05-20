/*
 * Copyright (c) 2016 Lars Haßler <mail@LarsHassler.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * @See https://en.wikipedia.org/wiki/Unicode_subscripts_and_superscripts
 * @param {Number} number
 * @return {string}
 */
function transfromToSuperscript(number) {
  var numberAsString = '' + number;
  var returnString = '';

  // transform each digit independently
  for (var i = 0; i < numberAsString.length; i++) {
    var digit = parseInt(numberAsString[i], 10);
    if (digit === 1) {
      returnString += '\u00B9';
    }
    else if (digit === 2) {
      returnString += '\u00B2';
    }
    else if (digit === 3) {
      returnString += '\u00B3';
    }
    else {
      returnString += String.fromCodePoint(0x2070 + digit);
    }
  }

  return returnString;
}

module.exports = function (variants) {
  var selectOptions = [];
  variants.forEach(function (variant) {
    var title = variant.size;

    if (variant.discount) {
      title += ' | ' + variant.discount.amount +
        transfromToSuperscript(variant.discount.note);
    }

    selectOptions.push({
      value: variant.id,
      title: title,
      selected: variant.selected,
      optionAttributes: [
        {
          key: "data-variant-price",
          value: variant.price
        }
      ]
    })
  });
  return selectOptions
};
