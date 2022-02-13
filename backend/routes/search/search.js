var express = require('express');
var mongoose = require('mongoose');

const { validateToken, isAuth } = require('../middleware/validateToken');
var router = express.Router();

var ResearchSchema = new mongoose.Schema({
    request: String,
    created_on: Date,
    modified_on: Date,
    nb_occurences: Number,
});

var ResearchModel = mongoose.model('ResearchModel', ResearchSchema);

router.post('/', (req, res, next) => {
    request = req.body?.request || res.sendStatus(403).send('request is required');

    // get request from database
    ResearchModel.findOne({ request: request }, (err, research) => {
        if (err) {
            res.sendStatus(500).send("error while processing research");
            return ;
        } else if (research) {
            // if research already exists, increment nb_occurences
            research.nb_occurences++;
            research.modified_on = new Date();
            research.save((err, research) => {
                if (err) {
                    res.sendStatus(500).send("error while processing research");
                    return ;
                } else {
                    res.send("ok");
                    return ;
                }
            });
        } else {
            // if research doesn't exist, create it
            const newResearch = new ResearchModel({
                request: request,
                created_on: new Date(),
                modified_on: new Date(),
                nb_occurences: 1,
            });
            newResearch.save((err, research) => {
                if (err) {
                    res.sendStatus(500).send("error while processing research");
                    return ;
                } else {
                    res.send(research);
                    return ;
                }
            });
        }
    });
});

router.get('/', validateToken, (req, res, next) => {
    limit_items = req.query?.limit || 20;
    sort = req.query?.sort || "name";
    order = req.query?.order || -1;

    if (sort != "name" && sort != "popularity") {
        sort = "name";
    }
    if (sort == "popularity") {
        sort = "nb_occurences";
    }

    var sort_object = {};
    sort_object[sort] = order;
    
    ResearchModel.find({}, null, { 
        limit: limit_items,
        sort: sort_object,
    }, (err, researches) => {
        if (err) {
            res.sendStatus(500).send("error while processing research");
            return ;
        } else {
            res.send(researches);
            return ;
        }
    });
});

module.exports = router;