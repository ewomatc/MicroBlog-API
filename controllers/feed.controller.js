const {validationResult} = require('express-validator')
const Post = require('../models/post')
const mongoose = require('mongoose')


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
		  const error = new Error('Validation failed')
      error.statusCode = 422
      throw error
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
    const {
      title,
      content,
      imageUrl
    } = req.body;
// check if the image was updated and passed as a file, get the new image name from there instead
    if(req.file) {
      imageUrl = req.file.path
    }

    if (!imageUrl) {
      return res.status(400).json({
        Error: 'No image picked'
      })
    }
  } catch (error) {
    next(error)
  }
}