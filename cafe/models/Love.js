const { Model } = require('vertex360')({ site_id: process.env.TURBO_APP_ID })

const props = {
  image: {type: String, default: ''},
  quote: {type: String, default: ''},
  name: {type: String, default: '', display: true},
  position: {type: String, default: ''},
  schema: { type: String, default: 'love', immutable: true },
  timestamp: { type: Date, default: new Date(), immutable: true }
}

class Love extends Model {
  constructor () {
    super()
    this.schema(props)
  }
}

module.exports = Love
