const { utils, Controller } = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const Post = require('../models/Post')

class PostController extends Controller {
  constructor () {
    super(Post, process.env)
  }

  async get (params) {
    const posts = await Post.find(params, Controller.parseFilters(params))
    return Post.convertToJson(posts)
  }

  async getById (id) {
    const post = await Post.findById(id)
    if (!post) {
      throw new Error(`${Post.resourceName} ${id} not found.`)
    }

    return post.summary()
  }

  async post (body) {
    if (body.title != null) {
      body.slug = utils.slugVersion(body.title, 6)
    }

    const dateString = utils.formattedDate() // Tuesday, May 7, 2019
    const dateParts = dateString.split(', ')
    body.dateString = (dateParts.length === 3) ? dateParts[1] + ', ' + dateParts[2] : dateString

    const post = await Post.create(body)
    return post.summary()
  }

  async put (id, params) {
    const post = await Post.findByIdAndUpdate(id, params, { new: true })
    return post.summary()
  }

  async delete (id) {
    const post = await Post.findByIdAndRemove(id)
    return post
  }
}

module.exports = new PostController()
