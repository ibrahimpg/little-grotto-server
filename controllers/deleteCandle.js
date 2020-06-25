const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('candles').deleteOne({ identifier: req.params.identifier })
    .then(() => res.redirect(`https://littlegrotto.com/candles-awaiting-approval/?viewunapprovedpw=${process.env.UNAPPROVED_VIEW_PW}`))
    .catch(err => console.log(err));
};
