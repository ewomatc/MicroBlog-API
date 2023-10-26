const {validationResult} = require('express-validator')

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

exports.createPost = (req, res, next) => {

	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array() })
	} 

  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { 
			id: new Date().toISOString(), 
			title: title, 
			content: content 
		}
  });
};
