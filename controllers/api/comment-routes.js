const router = require('express').Router();
const {Comment} = require('../../models');
const withAuth = require('../../utils/withAuth');

// get all comments
router.get('/', (req, res) => {
    Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a comment
router.post('/', withAuth, (req, res) => {
    // check if session exists
    if (req.session) {
        Comment.create({
            content: req.body.content,
            // use the id from the session
            user_id: req.session.user_id,
            post_id: req.body.post_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

// delete a comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: `No comment found`});
            return;
        }
        res.json({message: `Deleted comment`});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;