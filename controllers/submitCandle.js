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
      https://littlegrotto.com/candles-awaiting-approval
    `,
  })
    .then(() => {
      if (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(req.body.candleFriends[0]) === true) {
          return transporter.sendMail({
            from: '"Little Grotto" <sender@thehealingvoices.org>',
            to: req.body.candleFriends[0],
            subject: 'Someone sent you a candle on The Little Grotto!',
            html: `
              <img src="http://littlegrotto.com/wp-content/uploads/2020/05/newcandlegif.gif" width=200 alt="burning candle" />
              <p>
              ${req.body.candleName}<br><br>
              ${req.body.candleTitle}<br><br>
              ${req.body.candleIntention}<br><br>
              <b>Head over to <a href="https://littlegrotto.com">the Little Grotto</a> and light a candle of your own!</b>
              </p>
            `,
          })
          .catch(err => console.log(err));
      }
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
        approved: false,
      })
    })
    .then(() => res.redirect('https://littlegrotto.com/candles'))
    .catch(() => res.status(500).json({ msg: 'Error!' }));

};
