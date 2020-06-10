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
    email: req.body.candleEmail,
    city: req.body.candleCity,
    state: req.body.candleState,
    country: req.body.candleCountry,
    name: req.body.candleName,
    title: req.body.candleTitle,
    intention: req.body.candleIntention,
    friends: req.body.candleFriends,
    approved: false,
  })
    .then(() => res.redirect('https://littlegrotto.com/candles'))
    .catch(err => console.log(err));
};
