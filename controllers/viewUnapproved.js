const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('candles').find({approved:false}).toArray()
    .then((results) => res.json(results))
    .catch(err => console.log(err));
};
