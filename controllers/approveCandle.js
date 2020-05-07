const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('candles').updateOne({ identifier: req.params.identifier }, { $set: { approved: true } })
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err));
};
