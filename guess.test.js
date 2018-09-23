var guess = require('./guess');

test('simple cases', () => {
  expect(guess('OL44998W')).toEqual('OLID')
  expect(guess('9780062368751')).toEqual('ISBN')
  expect(guess('0349141924')).toEqual('ISBN');
});
