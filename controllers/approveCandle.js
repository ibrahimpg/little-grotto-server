const database = require('../index');

const Mailchimp = require('mailchimp-api-v3');

const nodemailer = require('nodemailer');

module.exports = (req, res) => {

  const transporter = nodemailer.createTransport({
    host: "thehealingvoices.org",
    port: 465,
    secure: true,
    auth: { user: 'sender@thehealingvoices.org', pass: process.env.EMAIL_PASS },
  });

  const api_key = process.env.MAILCHIMP_API;
  const list_id = '0674bb94a2';

  const mailchimp = new Mailchimp(api_key);

  let friendsList = []; // push confirmed friends email here and use as BCC list

  database.db().collection('candles').updateOne({  identifier: req.params.identifier }, { $set: { approved: true } })
  .then(() => database.db().collection('candles').findOne({ identifier: req.params.identifier }))
  .then((candle) => mailchimp.request({ method: 'post', path: `/lists/${list_id}/members`, body: { email_address: candle.email, status: 'subscribed' }}))
  .then(() => database.db().collection('candles').findOne({ identifier: req.params.identifier }))
  .then((candle) => {
    if(candle.newsletter === 'on') {
      return transporter.sendMail({
        from: '"Little Grotto" <sender@thehealingvoices.org>',
        to: candle.email,
        subject: 'Your candle has been approved on The Little Grotto!',
        text: `
          Your candle has been approved!

          Click here to see your candle:
          https://littlegrotto.com/candles
        `,
      })
      .then(() => {
        if (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(candle.friends[0]) === true) {
          return transporter.sendMail({
            from: '"Little Grotto" <sender@thehealingvoices.org>',
            to: candle.friends[0],
            subject: 'Someone sent you a candle on The Little Grotto!',
            html: `
              <img src="http://littlegrotto.com/wp-content/uploads/2020/05/newcandlegif.gif" width=200 alt="burning candle" />
              <p>
              ${candle.name}<br><br>
              ${candle.title}<br><br>
              ${req.body.intention}<br><br>
              Head over to <a href="https://littlegrotto.com">the Little Grotto</a> and light a candle of your own!<br><br>
              </p>
            `,
          })
            .catch(err => console.log(err));
        }
        return;
      })
      .then(() => {
        if (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(candle.friends[1]) === true) {
            return transporter.sendMail({
              from: '"Little Grotto" <sender@thehealingvoices.org>',
              to: candle.friends[1],
              subject: 'Someone sent you a candle on The Little Grotto!',
              html: `
                <img src="http://littlegrotto.com/wp-content/uploads/2020/05/newcandlegif.gif" width=200 alt="burning candle" />
                <p>
                ${candle.name}<br><br>
                ${candle.title}<br><br>
                ${req.body.intention}<br><br>
                Head over to <a href="https://littlegrotto.com">the Little Grotto</a> and light a candle of your own!<br><br>
                </p>
              `,
            })
            .catch(err => console.log(err));
        }
        return;
      })
      .then(() => {
        if (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(candle.friends[2]) === true) {
            return transporter.sendMail({
              from: '"Little Grotto" <sender@thehealingvoices.org>',
              to: candle.friends[2],
              subject: 'Someone sent you a candle on The Little Grotto!',
              html: `
                <img src="http://littlegrotto.com/wp-content/uploads/2020/05/newcandlegif.gif" width=200 alt="burning candle" />
                <p>
                ${candle.name}<br><br>
                ${candle.title}<br><br>
                ${req.body.intention}<br><br>
                Head over to <a href="https://littlegrotto.com">the Little Grotto</a> and light a candle of your own!<br><br>
                </p>
              `,
            })
            .catch(err => console.log(err));
        }
        return;
      })
    }
    return;
  })
  .then(() => res.redirect('https://littlegrotto.com/candles-awaiting-approval/'))
  .catch(err => console.log(err));
};
