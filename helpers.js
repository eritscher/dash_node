module.exports = function convertIntToHex(intArray) {
  const hexArray = [];

  for (let i in intArray) {
    let currentAsHex = intArray[i].toString(16);
    if (currentAsHex.length < 2) {
      currentAsHex = currentAsHex.padStart(2, '0');
    }
    hexArray.push(currentAsHex);
  }

  return hexArray.join(':')
}
