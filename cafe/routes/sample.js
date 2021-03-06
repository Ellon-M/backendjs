// Full Documentation - https://docs.turbo360.co
const express = require('express')
const router = express.Router()
const { post } = require('../controllers')

/* *
 * This is an example home route which renders the "home"
 * template using the 'home.json' file from the pages
 * folder to populate template data.
 */
router.get('/', (req, res) => {
  const { context } = req // {cdn:<STRING>, global:<OBJECT>}
  res.render('index', context) // render index.mustache
})

/* *
 * This is an example request for blog posts.
 * REST resources are managed in the "controllers" directory
 * where all CRUD operations can be found and customized.
 */
router.get('/posts', async (req, res) => {
  try {
    const posts = await post.get()
    res.json({
      confirmation: 'success',
      data: posts
    })
  } catch (error) {
    res.json({
      confirmation: 'fail',
      message: error.message
    })    
  }
})

module.exports = router
