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
        res.status(500).json({error: 'posts info could not be found'})
    })
});




//   /api/posts
router.post('/', (req, res) => {
    const {title, contents} = req.body;
    if (!title || !contents) {
       return res.status(400).json({error: 'Need title and contents'}) //return stops code so it doe not go on
    } 
    db.insert({title, contents})
        .then(({id}) => {
           getPost(id, res)
        })
        .catch(err => {
            res.status(500).json({error: 'Error inserting data'})
        });
});


function getPost(id, res) {
    return db.findById(id)
        .then(([post]) => {
            console.log(post);
            if (post) { 
                res.status(200).json(post);
            } else {
                res.status(400).json({error: `The post with the ${id} is not valid`});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error getting post"});
        });
    }

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, comments } = req.body;
    if (!title && !comments) {
        res.status(400).json({error: 'Requires some changes'});
    }
    db.update(id, {title, comments})
    .then(updated => {
        if (updated){
           getPost(id, res);
        } else {
            res.status(404).json({error: `post with ${id} does not exist`})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'error updating post'})
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
    .then((deleted) => {
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({error: 'user with id doe not exist'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'error deleting'})
    });
});

router.get('/:id/comments', (req, res) => {
    const { id: post_id } = req.params;
    db.findById(post_id)
    .then(([post]) => {
        if (post) {
            db.findPostComments(post_id)
            .then(comments => {
                if (comments)
                res.status(200).json({comments});
            });
        } else {
            res.status(404).json({error: 'post with id does not exist'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'error getting post comments'})
    });
});


router.post('/:post_id/comments', (req,res) => {
    const { post_id } = req.params;
    const { text } = req.body;

    if (text === '' || typeof text !== "string") {
        return res.status(400).json({error: "Commnent requires text!"})
    }
    db.insertComment({ text, post_id })
    .then(({ id: comment_id}) => {
        db.findCommentById(comment_id)
        .then(([comment]) => {
            if (comment) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({error: 'comment getting comment by this id'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error getting comment"});
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: "Error adding comment"});
    })
})




module.exports = router