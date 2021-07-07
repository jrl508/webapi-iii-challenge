const express = require('express');
const users = require('./userDb');
const posts = require('../posts/postDb')
const router = express.Router();

router.use(express.json());


router.post('/', validateUser, async (req, res) => {
    const user = req.body;

    users.insert(user)
        .then( user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

router.post('/:id/posts', validateUserId, validatePost, async(req, res) => {
    const post = req.body;

    posts.insert({user_id:req.params.id, ...post})
        .then( post =>{
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json(err)
        })

});

router.get('/', (req, res) => {
    users.get()
        .then( users => {
            res.status(200).json(users)
        })
        .catch( err => {
            res.status(500).json(error)
        })
});

router.get('/:id', validateUserId, async (req, res) => {
    const {id} = req.params;
    users.getById(id)
        .then( user =>{
            res.status(200).json(user)
        })
        .catch( error => {
            res.status(500).json(error)
        })

});

router.get('/:id/posts', validateUserId, async (req, res) => {
    const {id} = req.params
    users.getUserPosts(id)
        .then( posts => {
            res.status(200).json(posts)
        })
        .catch( error => {
            res.status(500).json(error)
        })
    
});

router.delete('/:id', validateUserId, async (req, res) => {
    const {id} = req.params

    users.remove(id)
        .then( deleted => {
            res.status(204).json(deleted)
        })
        .catch( err => {
            res.status(500).json(err)
        })
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
    const {id} = req.params
    const changes = req.body

    users.update(id, changes)
        .then( updated => {
            res.status(200).json(updated)
        })
        .catch( err => {
            res.status(500).json(err)
        })
});

//custom middleware

async function validateUserId(req, res, next) {
    const {id} = req.params;
    const user = await users.getById(id);

    if(!user) {
        res.status(400).json({message: 'Invalid User ID'})
    } else {
        req.user = user;
        next();
    }

};

function validateUser(req, res, next) {
    const user_info = req.body

    if(!user_info){
        res.status(400).json({message:'missing user data'})
    } else if (!user_info.name) {
        res.status(400).json({message:'missing required name field'})
    } else{
        next();
    }
};

function validatePost(req, res, next) {
    const newPost = req.body;

    if(!newPost){
        res.status(400).json({message:'missing post data'})
    } else if(!newPost.text){
        res.status(400).json({message:'missing required text field'})
    } else{
        next();
    }
};

module.exports = router;
