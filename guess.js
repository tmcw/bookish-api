/**
 * Guess the type of a book identifier
 *
 * Guessed types:
 *
 * DONE
 *
 * - openlibrary
 * - isbn 10
 * - isbn 13
 * - lccn
 *
 * TODO
 *
 * - goodreads
 *
 * Resources https://en.wikipedia.org/wiki/Library_of_Congress_Control_Number#Format
 */
module.exports = function(id) {
  const numbersOnly = id.replace(/[^0-9]/g, '');

  // Dead-giveaway prefixes
  if (id.startsWith('OL')) return 'OLID';

  if (numbersOnly.length === 12) {
    // Confirm Library of Congress format
    return 'LCCN';
  }

  if (numbersOnly.length === 13) {
    // Confirm ISBN check digit
    return 'ISBN';
  }

  // TODO: tolerate X as last digit
  if (numbersOnly.length === 10) {
    let s = 0, t = 0;
    for (let digit of numbersOnly) {
      t += parseInt(digit);
      s += t;
    }
    if (s % 11 === 0) {
      return 'ISBN';
    }
  }

  return null;
}
