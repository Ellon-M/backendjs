const PostController = require('./PostController')
const ItemController = require('./ItemController')
const OrderController = require('./OrderController')
const LoveController = require('./LoveController')

//always name it after the resource itself
module.exports = {
  post: PostController,
  item: ItemController,
  order: OrderController,
  love: LoveController
}
