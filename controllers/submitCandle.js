const database = require('../index');

module.exports = (req, res) => {

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  database.db().collection('candles').insertOne({
    identifier: (Math.random()*10000000).toFixed(0).toString().substring(0, 5),
    epoch: Date.now(),
    date: `${month}/${day}/${year}`,
    email: req.body.email,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    name: req.body.name,
    title: req.body.title,
    intention: req.body.intention,
    approved: false,
  })
    .then(() => res.sendStatus(201))
    .catch(err => console.log(err));
};
