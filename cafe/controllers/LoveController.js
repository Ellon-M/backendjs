const { Controller } = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const Love = require('../models/Love')

class LoveController extends Controller {
  constructor () {
    super(Love, process.env)
  }

  async get (params) {
    const loves = await Love.find(params, Controller.parseFilters(params))
    return Love.convertToJson(loves)
  }

  async getById (id) {
    const love = await Love.findById(id)
    if (love == null) {
      throw new Error(`${Love.resourceName} ${id} not found.`)
    }

    return love.summary()
  }

  async post (body) {
    const love = await Love.create(body)
    return love.summary()
  }

  async put (id, params) {
    const love = await Love.findByIdAndUpdate(id, params, { new: true })
    return love.summary()
  }

  async delete (id) {
    const love = await Love.findByIdAndRemove(id)
    return love
  }
}

module.exports = new LoveController()

