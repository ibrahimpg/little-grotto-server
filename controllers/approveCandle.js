const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('candles').updateOne({ identifier: req.params.identifier }, { $set: { approved: true } })
    .then((candle) => {
      console.log(candle.email);
    })
    .then(() => res.redirect('https://littlegrotto.com/candles-awaiting-approval/'))
    .catch(err => console.log(err));
};
