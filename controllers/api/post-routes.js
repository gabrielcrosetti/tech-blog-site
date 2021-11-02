const router = require('express').Router();
const {User, Post, Comment} = require('../../models');
const withAuth = require('../../utils/withAuth');

// get all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'content', 'user_id'],
        include: [
            {
                // include comment model
                model: Comment,
                attributes: ['id', 'content', 'user_id', 'post_id'],
                include: {  
                    model: User,
                    attributes: ['username']
                }
            },
            {
                // include username from User model
                model: User,
                attributes: ['username']
            }
        ],
        order: [['createdAt','DESC']]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get one post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'content', 'user_id', 'post_id'],
                include: {  
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: `No post found`})
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a post
router.post('/', withAuth, (req, res) => {

    Post.create({
        title: req.body.title,
        content: req.body.content,
        // use the id from the session
        user_id: req.session.user_id    
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// update a post
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        // options that can be updated
        {
            title: req.body.title,
            content: req.body.content
        },
        {
            where: {
                id: req.params.id
            }
        }      
    )
    .then(async()  => {
        // find post with requested id
        const id = await Post.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!id) {
            res.status(404).json({message: `No post found with id`});
            return;
        }
        // if post with requested id exist then send updated response
        res.json({
            message: `Post has been updated!`,
            post: {
                id: parseInt(req.params.id),
                update: req.body
            }            
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });  
});

// delete a post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: `No post found with id!`});
            return;
        }
        res.json({message: `Post has been deleted!`});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;