import {
    Config
} from '../../config/api'
import {
    HTTP
} from '../../utils/http'

class Index extends HTTP {
    constructor() {
        super()
    }

    getBanner(id) {
        return this.request({
            url: `ad/aid/${id}`
        })
    }

    getProductByTag(id) {
        return this.request({
            url: `product/tid/${id}`
        })
    }

    getProductByCat(id) {
        return this.request({
            url: `product/cid/${id}`
        })
    }

}

export {
    Index
}