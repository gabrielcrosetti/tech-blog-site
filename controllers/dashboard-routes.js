const router = require('express').Router();
const {User, Post, Comment} = require('../models');
const withAuth = require('../utils/withAuth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'content', 'created_at', 'updated_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'content', 'user_id', 'post_id', 'created_at', 'updated_at'],
                include: {  
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ],
        order: [['created_at', 'DESC']]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'content', 'created_at', 'updated_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'content', 'user_id', 'post_id', 'created_at', 'updated_at'],
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
        if (dbPostData) {
            const post = dbPostData.get({ plain: true });
            
            res.render('edit-post', {
                post,
                loggedIn: true
            });
        }
        else {
            res.status(404).end();
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/new', withAuth, (req, res) => {
    res.render('new-post', {loggedIn: true});
});

module.exports = router;