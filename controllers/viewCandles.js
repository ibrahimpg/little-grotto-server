const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('candles').find({approved:true}).toArray()
    .then((results) => res.json(results))
    .catch(err => console.log(err));
};
