const Dash = require('./button');
const buttonConfig = require('./buttonConfig');
const buttons = new Dash(buttonConfig);

buttons.on('pressed', function (evt) {
    console.log('The button has been pressed.');
    console.log(evt);
});
