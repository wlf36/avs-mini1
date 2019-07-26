import {
    Config
} from '../../config/api'
import {
    HTTP
} from '../../utils/http'

class Product extends HTTP {
    constructor() {
        super()
    }

    getProduct(id) {
        return this.request({
            url: `product/${id}`
        })
    }

    getComments(id) {
        this.request({
            url: `v1/comments/${id}`,
        })
    }
}

export {
    Product
}