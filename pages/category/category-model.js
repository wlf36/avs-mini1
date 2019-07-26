import {
    HTTP
} from '../../utils/http'

class Category extends HTTP {
    constructor() {
        super()
    }

    getCategories() {
        return this.request({
            url: `category`
        })
    }

    getProductsByCat(id) {
        return this.request({
            url: `product/cid/${id}`
        })
    }

}

export {
    Category
}