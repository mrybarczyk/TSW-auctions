const express = require('express');
const router = express.Router();
const Message = require('../../models/Message');

/**
 * @route POST api/msgs/new
 * @desc New message
 * @access Priavte
 */
router.post('/new', (req, res) => {
    let { to, msg } = req.body;
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
      let from = req.session.passport.user.username;
      let date = Date.now();
      let n = new Message({
          from,
          to,
          msg,
          date
      });
      n.save().then(m => {
        return res.status(201).json(m);
      });
  }
});

/**
 * @route GET api/msgs/filter
 * @desc A filter
 * @access Private
 */
router.get("/filter", async function(req, res){
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let userId = req.session.passport.user.id;
    Message.aggregate([
      {$match:{"to": userId}}, 
      {$group: {"_id": {"_id":"$_id", "from":"$from", "to":"$to", "msg":"$msg", "date":"$date"}, "from":{"$first":"$from"}}}
    ], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      });
    }
});

/**
 * @route GET api/msgs/inbox
 * @desc Getting messages addressed to the logged in user.
 * @access Private
 */
router.post("/inbox", async function(req, res){
  if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
  else {
    let username = req.session.passport.user.username;
    let from = req.body.from;
    Message.aggregate([{ 
      $match: { 
        $or: [{'to': username, 'from': from }, {'to': from, 'from': username }]}}], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      });
    }
});


module.exports = router;