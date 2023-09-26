const routes = require('express').Router()
const multer = require('multer')
const multerConfig = require('./config/multer')
const { s3Uploadv2, s3Deletev2 } = require("./config/s3Service")

const Post = require('./models/Post')

routes.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();

    return res.json(posts)
  } catch (error) {
    console.error(error);
    return res.status(500).send("Getting error.");
  }
  
})

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {
  try {
    const { originalname: name, size } = req.file;

    const result = await s3Uploadv2(req.file);

    const post = await Post.create({
      name,
      size,
      key: result.Key,
      url: result.Location,
    });

    return res.json(post);
    
  } catch (error) {
    console.error(error);
    return res.status(500).send("Creating error.");
  }
  
});

routes.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }
    
    await s3Deletev2(post.key) 

    await post.deleteOne();

    return res.status(200).send("Post deleted from database and S3 successfuly.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Deleting error.");
  }
});


// routes.delete('/posts', async (req, res) => {
//   const posts = await Post.deleteMany();

//   return res.send()
// })

module.exports = routes

