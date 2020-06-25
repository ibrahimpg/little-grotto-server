const database = require('../index');

const nodemailer = require('nodemailer');

module.exports = (req, res) => {

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const transporter = nodemailer.createTransport({
    host: "thehealingvoices.org",
    port: 465,
    secure: true,
    auth: { user: 'sender@thehealingvoices.org', pass: process.env.EMAIL_PASS },
  });

    transporter.sendMail({
      from: '"Little Grotto" <sender@thehealingvoices.org>',
      to: process.env.RECEIVER_EMAIL,
      subject: 'Someone submitted a candle on The Little Grotto!',
      text: `
        Candle Details
        ---
        ${req.body.candleName}
        ${req.body.candleCity}, ${req.body.candleState}, ${req.body.candleCountry}
        ${req.body.candleTitle}
        ${req.body.candleIntention}

        Click here to approve or delete this candle:
        littlegrotto.com/candles-awaiting-approval/?viewunapprovedpw=${process.env.UNAPPROVED_VIEW_PW}
      `,
    })
    .then(() => {
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
        newsletter: req.body.candleNewsletter,
        approved: false,
        grottoUrl: `https://littlegrotto.com/candle-details/?title=${req.body.candleTitle}&country=${req.body.candleCountry}&state=${req.body.candleState}&city=${req.body.candleCity}&cdate=${month}/${day}/${year}&cname=${req.body.candleName}&intention=${req.body.candleIntention}`,
      })
    })
    .then(() => res.redirect('https://littlegrotto.com/candles'))
    .catch(err => {
      console.log(err);
      res.redirect('https://littlegrotto.com/candles');
    });
};
