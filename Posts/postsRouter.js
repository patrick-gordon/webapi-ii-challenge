const express = require('express');
const db = require('../data/db');

const router = express.Router();


//localhost:4444/api/posts
router.get('/', (req, res) => {
    db.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'posts info could not be returned'})
        });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
    .then(([post]) => { //makes it just return an object by destructuring post, instead of array of obj
        console.log(post);
        if (post) { 
            res.status(200).json(post);
        } else {
            res.status(400).json({error: `The post with the ${id} is not valid`})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'posts infor could not be found'})
    })
})



module.exports = router