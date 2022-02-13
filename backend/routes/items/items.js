var express = require('express');
var mongoose = require('mongoose');

const { validateToken } = require('../middleware/validateToken');
var router = express.Router();

var ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    availability: Number,
    article_state: Number,
    created_on: Date,
    modified_on: Date,
    weight: Number,
    image: [String],
    linked_articles: [String],
    size: {
        width: Number,
        height: Number,
        depth: Number
    },
});
var ItemModel = mongoose.model('ItemModel', ItemSchema);

router.post('/', validateToken, (req, res, next) => {
    name = req.body?.name || res.sendStatus(403).send('name is required');
    description = req.body?.description || '';
    price = req.body?.price || 0;
    availability = req.body?.availability || 0;
    article_state = req.body?.article_state || 0;
    created_on = req.body?.created_on || new Date();
    modified_on = req.body?.modified_on || new Date();
    weight = req.body?.weight || 0;
    image = req.body?.image || [];
    linked_articles = req.body?.linked_articles || [];
    width = req.body?.width || 0;
    height = req.body?.height || 0;
    depth = req.body?.depth || 0;


    const newItem = new ItemModel({
        name: name,
        description: description,
        price: price,
        availability: availability,
        article_state: article_state,
        created_on: created_on,
        modified_on: modified_on,
        weight: weight,
        image: image,
        linked_articles: linked_articles,
        size: {
            width: width,
            height: height,
            depth: depth
        }
    });
    newItem.save((err, item) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(201).send(item);
    });
});

router.get('/', (req, res, next) => {
    start_date = req.query?.start_date || null;
    end_date = req.query?.end_date || null;
    name = req.query?.name || "";
    limit_items = req.query?.limit || 20;

    sort = req.query?.sort || "name";
    order = req.query?.order || -1;

    if (sort != "name" && sort != "price" && sort != "date") {
        sort = "name";
    }
    if (sort == "date") {
        sort = "modified_on";
    }

    var sort_object = {};
    sort_object[sort] = order;

    console.log(sort_object)

    if (start_date == null) start_date = new Date(0);
    if (end_date == null) end_date = new Date();

    ItemModel.find({
        modified_on: { $gt: start_date, $lte: end_date },
        name: new RegExp(name, 'i'),
    }, null, {
        sort:  sort_object,
        limit: limit_items
    }, (err, items) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send(items);
    })
});

router.put('/', validateToken, (req, res, next) => {
    id = req.body?.id || res.sendStatus(403).send('id is required');

    ItemModel.findById(id).then(item => {
        item.name = req.body?.name || item.name;
        item.description = req.body?.description || item.description;
        item.price = req.body?.price || item.price;
        item.availability = req.body?.availability || item.availability;
        item.article_state = req.body?.article_state || item.article_state;
        item.created_on = req.body?.created_on || item.created_on;
        item.modified_on = req.body?.modified_on || item.modified_on;
        item.weight = req.body?.weight || item.weight;
        item.image = req.body?.image || item.image;
        item.linked_articles = req.body?.linked_articles || item.linked_articles;
        item.size = {
            width: req.body?.width || item.size.width,
            height: req.body?.height || item.size.height,
            depth: req.body?.depth || item.size.depth
        }

        item.save((err, item) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(201).send(item);
        });

    }).catch(err => {
        res.status(404).send("resource not found");
    });
});

module.exports = router;