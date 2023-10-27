const {validationResult} = require('express-validator')
const Post = require('../models/post')


exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      { 
        title: 'First Post', 
        content: 'This is the first post!', 
        imageUrl: '../images/159422.jpg',
        creator: {
          name: 'Ewoma'
        },
				createdAt: new Date()
      }
    ]
  });
};

exports.createPost = async (req, res, next) => {
  try {

    const errors = validationResult(req)
	  if(!errors.isEmpty()) {
		  const error = new Error('Validation failed')
      error.statusCode = 422
      throw error
	  } 
    const {
      title,
      content,
      imageUrl, 
      creator
    } = req.body

    const post = new Post({
      title,
      content,
      imageUrl: '../images/159422.jpg',
      creator: {name: 'Ewoma'}
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

exports.getPost = (req, res, next) => {
	const postId = req.params.postId
	Post.findById(postId)
  .then(post => {
		if(!post) {
			const error = new Error('could not find post');
      error.statusCode = 404
      throw error;
		}
	}).catch((err) => {
		if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err)
	});
}