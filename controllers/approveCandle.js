const database = require('../index');

const Mailchimp = require('mailchimp-api-v3')

module.exports = (req, res) => {

  const api_key = process.env.MAILCHIMP_API;
  const list_id = '0674bb94a2';

  const mailchimp = new Mailchimp(api_key);

  database.db().collection('candles').updateOne({ identifier: req.params.identifier }, { $set: { approved: true } })
  .then(() => database.db().collection('candles').findOne({ identifier: req.params.identifier }))
  .then((candle) => mailchimp.request({ method: 'post', path: `/lists/${list_id}/members`, body: { email_address: req.body.candleEmail, status: 'subscribed' }}))
  .then(() => res.redirect('https://littlegrotto.com/candles-awaiting-approval/'))
  .catch(err => console.log(err));
};
