import {
    Config
} from '../../config/api'
import {
    Category
} from './category-model'
const category = new Category()

Page({

    data: {
        categoryTypeArr: [],
        currentMenuIndex: 0,
        loadedData: {}
    },

    onLoad: function (options) {
        this._loadData()
    },

    _loadData: function () {
        category.getCategories().then((res) => {
            this.setData({
                categoryTypeArr: res
            })
            this._getProducts(res[0].id, 0)
        })
    },

    changeCategory: function (event) {
        const index = category.getDataSet(event, 'index')
        const id = category.getDataSet(event, 'id')
        this.setData({
            currentMenuIndex: index
        });
        if (!this._isLoadedData(index)) {
            this._getProducts(id, index)
        } else {
            this.setData({
                products: this.data.loadedData[index]
            })
        }
    },

    _isLoadedData: function (index) {
        if (this.data.loadedData[index]) {
            return true
        }
        return false
    },

    _getProducts(id, index) {
        category.getProductsByCat(id, index)
            .then((res) => {
                this._imageUrlAddHost(res)
                this.setData({
                    products: res
                })
                this.data.loadedData[index] = res
            });
    },

    onProductsItemTap: function (event) {
        const id = category.getDataSet(event, 'id')
        wx.navigateTo({
            url: '../product/product?id=' + id
        })
    },

    _imageUrlAddHost(data) {
        data.map((item) => {
            item.thumbnail = JSON.parse(item.thumbnail)
            item.thumbnail = Config.uploads + item.thumbnail.img_url
        })
    },

})