const { Model } = require('vertex360')({ site_id: process.env.TURBO_APP_ID })

const props = {
  image: { type: String, default: 'item'  },
  name: { type: String, default: 'item', display: true },
  category: { type: String, default: 'item'  },
  description: { type: String, default: 'item'  },
  price: { type: Number, default: 0  },
  schema: { type: String, default: 'item'  },
  timestamp: { type: Date, default: new Date(), immutable: true }
}

class Item extends Model {
  constructor () {
    super()
    this.schema(props)
  }
}

module.exports = Item
