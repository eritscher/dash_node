const DashButton = require('./button');

const neatButton = new DashButton('Some MAC Address')


neatButton.on('pressed', function () {
  console.log('something')
})
