//index.js
//获取应用实例
import {
  Config
} from '../../config/api'
import {
  Index
} from './index-model'
const index = new Index()
const App = getApp()

Page({

  data: {
    banner: [],
    product_tag: [],
    cat_10: [],
    cat_11: [],
    cat_12: [],
    cat_13: [],
  },

  onLoad: function () {
    this._loadData()
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
  },

  _loadData: function () {

    index.getBanner(1)
      .then((res) => {
        this.setData({
          banner: res
        })
      })

    index.getProductByTag(6)
      .then((res) => {
        this._imageUrlAddHost(res)
        this.setData({
          product_tag: res
        })
      })


    index.getProductByCat(10)
      .then((res) => {
        this._imageUrlAddHost(res)
        this.setData({
          cat_10: res
        })
      })

    index.getProductByCat(11)
      .then((res) => {
        this._imageUrlAddHost(res)
        this.setData({
          cat_11: res
        })
      })

    index.getProductByCat(12)
      .then((res) => {
        this._imageUrlAddHost(res)
        this.setData({
          cat_12: res
        })
      })

    index.getProductByCat(13)
      .then((res) => {
        this._imageUrlAddHost(res)
        this.setData({
          cat_13: res
        })
      })

  },

  _imageUrlAddHost(data) {
    data.map((item) => {
      item.thumbnail = JSON.parse(item.thumbnail)
      item.thumbnail = Config.uploads + item.thumbnail.img_url
    })
  },

  onShareAppMessage: function (res) {
    return {
      title: 'seed海外购',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})