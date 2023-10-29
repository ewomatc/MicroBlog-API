const {validationResult} = require('express-validator')
const mongoose = require('mongoose')
const Post = require('../models/post')
const fs = require('fs');
const path = require('path');
const post = require('../models/post');


exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()

    if(!posts) {
      return res.status(404).json('Could not get posts')
    }
    res.status(200).json({
      success: true,
      posts
    })
  } catch (error) {
    next(error)
  }
};

exports.createPost = async (req, res, next) => {
  try {

    const errors = validationResult(req)
	  if(!errors.isEmpty()) {
		  return res.status(400).json({
        error: errors.mapped()
      })
	  } 
    if(!req.file) {
      return res.status(422).json({
        error: 'no image provided'
      })
    }
    const {
      title,
      content,
      creator
    } = req.body
    const imageUrl = req.file.path

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: 'Ewoma'
    })
    
    await post.save()
    res.status(201).json({
      success: true,
      post
    })
  } catch (error) {
    next(error)
  }
};

exports.getSinglePost = async (req, res, next) => {
  try{
    const postId = req.params.postId
    if(!mongoose.Types.ObjectId.isValid(postId)) {
      return(res.status(400).json({
        Error: 'Invalid post id'
      }))
    }
    
    const post = await Post.findById(postId)

    if(!post) {
      return res.status(404).json({
        error: 'Could not find post'
      })
    }
    res.status(200).json({
      success: true,
      post
    })
  }
  catch(err) {
    next(err)
  }
}


exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId
    if(!mongoose.Types.ObjectId.isValid(postId)) {
      return(res.status(400).json({
        Error: 'Invalid post id'
      }))
    }

    const errors = validationResult(req)
	  if(!errors.isEmpty()) {
		  return res.status(400).json({
        error: errors.mapped()
      })
    }

    const {
      title,
      content
    } = req.body;

    let newImageUrl = req.body.imageUrl
    let previousImageUrl = ''

    if(req.file) {
      newImageUrl = req.file.path
    }
    if (!newImageUrl) {
      return res.status(400).json({
        Error: 'No image picked'
      })
    }
    // find the post to get the previous image url
    const post = await Post.findById(postId)
    if(!post) {
      return res.status(404).json({ Error: 'Post not found'})
    }

    // store the previous image url
    previousImageUrl = post.imageUrl
    
    // save updated post
    const updatedPost = await Post.findOneAndUpdate({ _id: postId},
      {
        title,
        content,
        imageUrl: newImageUrl
      }, { new: true })

      if(previousImageUrl && previousImageUrl !== newImageUrl) {
        clearImage(previousImageUrl)
      }

      if(!updatedPost) {
        return res.status(404).json({
          Error: 'Post not found'
        })
      }

      res.status(200).json({
        success: true,
        updatedPost,
      })

  } catch (error) {
    next(error)
  }
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, err => {
    console.log(err);
  })
}