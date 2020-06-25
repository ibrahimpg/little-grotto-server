const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('candles').find({approved:false}).toArray()
    .then((results) => {
      if(req.params.entrypw === process.env.UNAPPROVED_VIEW_PW){
        return res.json(results)
      }
      return;
    })
    .catch(err => console.log(err));
};
