const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const io = require('../socket');
/**
 * In this get all posts I have learnt and implemented pagination
 * so basically we need two variables, the 'currentPage' and the number of posts to display- 'perPage'.
 * We then use the .skip() method to skip the specified number of posts, in this case, depends on the currentPage we are on.
 * The .limit() limits the number of posts that can be displayed on a page to the perPage which is hard coded here as '2'.
 */
exports.getPosts = async (req, res, next) => {
	try {
		// setup pagination
		const currentPage = req.query.page || 1;
		const perPage = 2;

		let totalItems = await Post.find().countDocuments();
		/* if(!totalItems) {
      return res.status(404).json({error: 'could not get item count'})
    } */

		const posts = await Post.find()
			.skip((currentPage - 1) * perPage)
			.limit(perPage);

		if (!posts) {
			return res.status(404).json('Could not get posts');
		}
		res.status(200).json({
			success: true,
			posts,
			totalItems,
		});
	} catch (error) {
		next(error);
	}
};

exports.createPost = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				error: errors.mapped(),
			});
		}
		if (!req.file) {
			return res.status(422).json({
				error: 'no image provided',
			});
		}
		const { title, content, creator } = req.body;
		const imageUrl = req.file.path;

		const post = new Post({
			title,
			content,
			imageUrl,
			creator: req.userId, // the req.userId is from the payload/token
		});

		await post.save();

		const user = await User.findById(req.userId);
		// add the post to the user's post array
		user.posts.push(post);
		// save the user
		await user.save();

		// the getIo() first tries to retrieve a running instance of socketio, if theres none, it throws an error.
		// uset the .emit() method provided by socketio to send a message to all connected users
		io.getIo().emit('posts', { action: 'create', post });

		res.status(201).json({
			success: true,
			post,
		});
	} catch (error) {
		next(error);
	}
};

exports.getSinglePost = async (req, res, next) => {
	try {
		const postId = req.params.postId;
		if (!mongoose.Types.ObjectId.isValid(postId)) {
			return res.status(400).json({
				Error: 'Invalid post id',
			});
		}

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({
				error: 'Could not find post',
			});
		}
		res.status(200).json({
			success: true,
			post,
		});
	} catch (err) {
		next(err);
	}
};

exports.updatePost = async (req, res, next) => {
	try {
		const postId = req.params.postId;
		if (!mongoose.Types.ObjectId.isValid(postId)) {
			return res.status(400).json({
				Error: 'Invalid post id',
			});
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				error: errors.mapped(),
			});
		}

		const { title, content } = req.body;

		let newImageUrl = req.body.imageUrl;
		let previousImageUrl = '';

		if (req.file) {
			newImageUrl = req.file.path;
		}
		if (!newImageUrl) {
			return res.status(400).json({
				Error: 'No image picked',
			});
		}
		// find the post to get the previous image url
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ Error: 'Post not found' });
		}
		// check for authorization to update the post
		if (post.creator.toString() !== req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// store the previous image url
		previousImageUrl = post.imageUrl;

		// save updated post
		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{
				title,
				content,
				imageUrl: newImageUrl,
			},
			{ new: true }
		);

		if (previousImageUrl && previousImageUrl !== newImageUrl) {
			clearImage(previousImageUrl);
		}

		if (!updatedPost) {
			return res.status(404).json({
				Error: 'Post not found',
			});
		}

		res.status(200).json({
			success: true,
			updatedPost,
		});
	} catch (error) {
		next(error);
	}
};

const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) => {
		console.log(err);
	});
};

exports.deletePost = async (req, res, next) => {
	try {
		const postId = req.params.postId;

		if (!mongoose.Types.ObjectId.isValid(postId)) {
			return res.status(400).json({
				Error: 'Invalid post id',
			});
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				error: 'Post not found',
			});
		}

		// check for authorization to delete the post
		if (post.creator.toString() !== req.userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const deletedPost = await Post.findByIdAndRemove(postId);

		if (deletedPost) {
			clearImage(post.imageUrl);
		}

		// logic to clear the post from the creator array after it has been deleted
		const user = await User.findById(req.userId);
		user.posts.pull(postId); // the .pull() method is built-in to mongoose to remove array items
		await user.save();

		res.status(200).json({
			success: true,
			message: 'Post deleted successfully',
		});
	} catch (error) {
		next(error);
	}
};
