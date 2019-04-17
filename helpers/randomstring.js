const generateString = (length) => {
  const scope = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += scope[parseInt(Math.random() * scope.length)];
  }
  return res;
};

module.exports = generateString;
