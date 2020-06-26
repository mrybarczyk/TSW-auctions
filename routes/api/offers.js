const express = require('express');
const router = express.Router();
const Offer = require('../../models/Offer');

/**
 * @route POST api/offers/new
 * @desc New offer
 * @access Priavte
 */
router.post('/new', (req, res) => {
    let { title, description, startdate, enddate, price, isAuction} = req.body;
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let owner = req.session.passport.user.username;
    price = parseFloat(price);
    if (!title) {
        return res.status(400).json({
            msg: "Title is missing."
        });
    }
    if (!description) {
        return res.status(400).json({
            msg: "Description is missing."
        });
    }
    if (!startdate) {
        return res.status(400).json({
            msg: "Beginning date is missing."
        });
    }
    if (startdate > Date.now) {
        return res.status(400).json({
            msg: "Choose a correct beginning date."
        });
    }
    if (!enddate) {
        return res.status(400).json({
            msg: "Ending date is missing."
        });
    }
    if (!price) {
        return res.status(400).json({
            msg: "You didn't specify the (starting) price."
        });
    }
    if (isAuction === "") isAuction = false;
    let winner = "";
    let userList = [];
    let status = 'inactive';
    let newOffer = new Offer({
        owner,
        title,
        description,
        startdate,
        enddate,
        isAuction,
        price,
        userList,
        winner,
        status
    });
    newOffer.save().then(offer => {
        console.log(offer);
        return res.status(201).json({
            success: true,
            msg: "Offer registered"
        });
    });
}
});

/**
 * @route POST api/offers/modify
 * @desc Modify the offer
 * @access Private
 */
router.patch("/modify", async function(req, res) {
    let id = req.body._id;
    let oldoffer = await Offer.findById(id);
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let user = req.session.passport.user;
    if (user.username !== oldoffer.owner) return res.status(401);
    let newoffer = {};
    if (oldoffer) {
        if (oldoffer.status !== 'inactive'){
            return res.status(401).json({
                msg: "Nie można modyfikować aktywnej oferty."
            });
        }
        if (req.body.title) newoffer.title = req.body.title;
        else newoffer.title = oldoffer.title;
        if (req.body.description) newoffer.description = req.body.description;
        else newoffer.description = oldoffer.description;
        if (req.body.startdate !== "T00:00:00.001Z") newoffer.startdate = req.body.startdate;
        else newoffer.startdate = oldoffer.startdate;
        if (req.body.enddate !== "T23:59:59.999Z") newoffer.enddate = req.body.enddate;
        else newoffer.enddate = oldoffer.enddate;
        if (req.body.price) newoffer.price = req.body.price;
        else newoffer.price = oldoffer.price;
        newoffer.owner = oldoffer.owner;
        newoffer.userList = oldoffer.userList;
        newoffer.isAuction = oldoffer.isAuction;
        newoffer.winner = oldoffer.winner;
        Offer.findByIdAndUpdate(id, newoffer, (err, oldoffer) => {
            if (err) res.statusCode(500);
            else {
                console.log(oldoffer);
                res.json({ msg: "You offer has been updated!" });
            }
        });
    } else return res.json({
        msg: "There's no such offer!"
    });
}
  });

/**
 * @route GET api/offers/list
 * @desc List all the offers
 * @access Private
 */
router.get("/list", function(req, res) {
    Offer.find({}, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        return res.json(result);
      }
    });
  });


  /**
 * @route POST api/offers/getone
 * @desc Get one offer
 * @access Private
 */
router.post("/getone", function(req, res) {
    try {
        let id = req.body._id;
        Offer.findOne({_id: id}).then(offer => {
            if (offer){
                return res.json({
                    price: offer.price
                });
            }
            else return res.json({}); 
        });
    } catch (err) {
        console.log(err);
    }
  });

  /**
 * @route GET api/offers/bid
 * @desc Bid
 * @access Private
 */
router.patch("/bid", async function(req, res){
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let user = req.session.passport.user;
    let userId = user.username;
    let offerId = req.body.offerId;
    if (!offerId) return res.status(404);
    let offer = await Offer.findById(offerId);
    if (!offer.isAuction) return res.status(401).json({
        msg: "Oferty Kup teraz! nie podlegają licytacji."
    });
    if (offer.owner === userId) return res.status(401).json({
        msg: "Nie możesz licytować własnej oferty!"
    });
    if (offer.status === "sold" || offer.status === "expired" || offer.enddate < Date.now()) return res.status(401).json({
        msg: "Ta aukcja zakończyła się."
    });
    if (offer.status === "inactive") return res.status(401).json({
        msg: "Ta aukcja jeszcze się nie rozpoczęła!"
    })
    let bid = parseFloat(req.body.bid.replace(',', '.'));
    if (!bid) return res.status(404);
    if (bid <= offer.price) return res.status(402).json({
        msg: "Musisz zaoferować więcej!"
    })
    let newoffer = {};
    newoffer.title = offer.title;
    newoffer.owner = offer.owner;
    newoffer.description = offer.description;
    newoffer.startdate = offer.startdate;
    newoffer.enddate = offer.enddate;
    newoffer.status = offer.status;
    newoffer.isAuction = offer.isAuction;
    newoffer.winner = offer.winner;
    newoffer.userList = offer.userList;
    newoffer.userList.push(userId);
    newoffer.price = bid;
    Offer.findByIdAndUpdate(offerId, newoffer, (err, offer) => {
        if (err) res.statusCode(500);
        else { 
            return res.json({
                _id: offer._id,
                isAuction: newoffer.isAuction,
                price: newoffer.price
            });
        }
    });
}
});

/**
 * @route GET api/offers/your
 * @desc list of your offers
 * @access Private
 */
router.get("/your", async function(req, res){
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let userId = req.session.passport.user.username;
    Offer.aggregate([{ $match: { 'owner': userId } }], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      });
    }
});

/**
 * @route GET api/offers/history
 * @desc history
 * @access Private
 */
router.get("/history", async function(req, res){
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let userId = req.session.passport.user.username;
    Offer.aggregate([
        {$unwind: "$userList"},
        {$match: {"userList": userId}},
        {$group: { "_id": {"_id":"$_id", "title": "$title", "description":"$description", "startdate":"$startdate", "enddate":"$enddate", "price":"$price", "isAuction":"$isAuction", "winner": "$winner","status":"$status"},
         "offer":{"$first": "$_id"}}}
    ], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      });
    }
});

router.get("/panel", async function(req, res){
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let userId = req.session.passport.user.username;
    Offer.aggregate([
        {$unwind: "$userList"},
        {$match: {"userList": userId}},
        {$group: { "_id": {"_id":"$_id", "title": "$title", "description":"$description", "startdate":"$startdate", "enddate":"$enddate", "price":"$price", "isAuction":"$isAuction", "owner": "$owner", "winner": "$winner","status":"$status"},
         "offer":{"$first": "$_id"}}}
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
 * @route GET api/offers/buy
 * @desc Instabuy
 * @access Private
 */
router.patch("/buy", async function(req, res){
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let userId = req.session.passport.user.username;
    let offerId = req.body.offerId;
    let offer = await Offer.findById(offerId, (err, res)=>{
        if (err) return res.status(404);
    });
    if (offer.isAuction) return res.status(401).json({
        msg: "Nie można kupić od razu przedmiotów z licytacji"
    });
    if (offer.owner === userId) return res.status(401).json({
        msg: "Nie możesz kupić przedmiotu z własnej oferty"
    });
    if (offer.status !== 'active' || offer.enddate < Date.now()) return res.status(401).json({
        msg: "Oferta nieważna."
    });
    let newoffer = {};
    newoffer.title = offer.title;
    newoffer.owner = offer.owner;
    newoffer.description = offer.description;
    newoffer.startdate = offer.startdate;
    newoffer.enddate = offer.enddate;
    newoffer.isAuction = offer.isAuction;
    newoffer.winner = userId;
    newoffer.price = offer.price;
    newoffer.userList = offer.userList;
    newoffer.userList.push(userId);
    newoffer.status = 'sold';
    Offer.findByIdAndUpdate(offerId, newoffer, (err, offer) => {
        if (err) res.statusCode(500);
        else{
            res.json(offer);
        }
    });
}
});

/**
 * @route PATCH api/offers/status
 * @desc updating status, v important
 * @access Private
 */
router.patch("/status", async function(req, res){
    let offerId = req.body.offerId;
    let offer = await Offer.findById(offerId);
    if (!offer) return res.status(404);
    let newoffer = {};
    newoffer.owner = offer.owner;
    newoffer.title = offer.title;
    newoffer.description = offer.description;
    newoffer.startdate = offer.startdate;
    newoffer.enddate = offer.enddate;
    newoffer.isAuction = offer.isAuction;
    newoffer.price = offer.price;
    newoffer.winner = offer.winner;
    newoffer.userList = offer.userList;
    newoffer.status = offer.status;
    //późniejsza jest większa
    if (+newoffer.startdate <= +Date.now() && +newoffer.enddate >= +Date.now()){
        if (newoffer.winner !== ""){
            newoffer.status = 'sold';
        }
        else if (newoffer.winner === ""){
            newoffer.status = 'active';
        }
    } else {
        if (offer.winner === "" && offer.userList !== []){
            newoffer.status = 'sold';
            newoffer.winner = offer.userList[offer.userList.length-1];
        } else if (offer.winner === "" && offer.userList === []){
            newoffer.status = 'expired';
        }
    }
    Offer.findByIdAndUpdate(offerId, newoffer, (err, offer) => {
        if (err) res.statusCode(500);
        else res.json(offer);
    });
});

module.exports = router;