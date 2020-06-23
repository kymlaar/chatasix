













const moment = require('moment');
const bondia = "Aquí va el id pero no se hacerlo :v";
function formatMessage(username, text) {
  return {
    username,
    bondia,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
