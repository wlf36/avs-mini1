// pages/product/show.js
import {
  Config
} from '../../config/api'
import {
  Product
} from './product-model'
import {
  Cart
} from '../cart/cart-model';
import {
  ModalView
} from '../../plugs/modal-view/modal-view.js'
import Poster from '../../plugs/components/wxa-plugin-canvas-poster/poster/poster';
import {
  base64src
} from '../../utils/util'
const product = new Product()
const cart = new Cart()
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js')

Page({
  data: {
    userInfo: {},
    posterConfig: {},
    id: null,
    comments: null,
    cartTotalCounts: 0,
    productCount: 1,
    tapBarItems: [
      // id name selected 选中状态
      {
        id: '1',
        name: '商品详情',
        active: true
      },
      {
        id: '2',
        name: '规格参数',
        active: false
      },
      {
        id: '3',
        name: '商品评价',
        active: false
      }
    ]
  },

  onLoad: function (options) {
    new ModalView;
    this.setData({
      id: options.id,
      cartTotalCounts: cart.getCartTotalCounts()
    })
    this._loadData()
    this._getUserInfo()
  },

  _getUserInfo() {
    const that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },


  _loadData: function () {
    product.getProduct(this.data.id).then((res) => {
      res.thumbnail = JSON.parse(res.thumbnail)
      res.thumbnail.img_url = Config.uploads + res.thumbnail.img_url
      res.banner = JSON.parse(res.banner)
      res.banner.map(item => {
        item.img_url = Config.uploads + item.img_url
      })
      res.body = JSON.parse(res.body)
      res.body.map(item => {
        item.img_url = Config.uploads + item.img_url
      })
      this.setData({
        product: res
      })
      console.log(this.data.product)
      wx.setNavigationBarTitle({
        title: product.title
      })
    })

    // product.getComments(this.data.id).then((res) => {
    //     this.setData({
    //         comments: res.data
    //     })
    // })
  },

  onAddingToCartTap: function (event) {
    this.addToCart()
    this.setData({
      cartTotalCounts: cart.getCartTotalCounts()
    })
  },

  addToCart: function () {
    let price = 0
    const product = this.data.product
    if (product.sale_price) {
      price = product.sale_price
    } else {
      price = product.price
    }
    let item = {
      id: this.data.id,
      title: product.title,
      image: product.thumbnail.img_url,
      price: parseFloat(price)
    }
    cart.add(item, this.data.productCount);
  },

  onTapActive: function (e) {
    let tab = e.currentTarget.id;
    let tapBarItems = this.data.tapBarItems;
    // 切换tapBarItem 
    for (var i = 0; i < tapBarItems.length; i++) {
      if (tab == tapBarItems[i].id) {
        tapBarItems[i].active = true;
      } else {
        tapBarItems[i].active = false;
      }
    }
    this.setData({
      tapBarItems: tapBarItems,
      tab: tab
    })
  },

  onCreatePoster: function () {
    const that = this
    wx.request({
      url: Config.api_qrcode,
      data: {
        pid: 1,
        uid: 1
      },
      method: 'POST',
      success: function (res) {
        let qrcode = res.data.img.data
        qrcode = 'data:image/jpeg;base64,' + wx.arrayBufferToBase64(qrcode)
        base64src(qrcode, (res) => {
          const qrcodeUrl = res
          console.log(qrcodeUrl)
          that.setData({
            posterConfig: {
              width: 750,
              height: 1200,
              backgroundColor: '#fff',
              debug: false,
              blocks: [
                // {
                //   width: 690,
                //   height: 808,
                //   x: 30,
                //   y: 183,
                //   borderWidth: 2,
                //   borderColor: '#f0c2a0',
                //   borderRadius: 20,
                // },
                {
                  width: 640,
                  height: 75,
                  x: 60,
                  y: 680,
                  backgroundColor: '#fff',
                  opacity: 0.5,
                  zIndex: 100,
                }
              ],
              texts: [{
                  x: 130,
                  y: 70,
                  baseLine: 'middle',
                  text: that.data.userInfo.nickName,
                  fontSize: 40,
                  color: '#080808',
                  width: 400,
                  lineNum: 1
                },
                {
                  x: 30,
                  y: 130,
                  baseLine: 'top',
                  text: '发现不错的商品推荐给你',
                  fontSize: 36,
                  color: '#080808',
                },
                {
                  x: 30,
                  y: 900,
                  baseLine: 'middle',
                  text: that.data.product.title,
                  fontSize: 36,
                  color: '#080808',
                  marginLeft: 30,
                  width: 680,
                  lineNum: 2,
                  lineHeight: 50
                },
                {
                  x: 350,
                  y: 1050,
                  baseLine: 'top',
                  text: '长按识别小程序码立即购买',
                  width: 300,
                  fontSize: 36,
                  color: '#080808',
                  lineHeight: 50,
                  lineNum: 2
                }
              ],
              images: [{
                  width: 80,
                  height: 80,
                  x: 30,
                  y: 30,
                  borderRadius: 60,
                  url: that.data.userInfo.avatarUrl, //用户头像
                },
                {
                  width: 680,
                  height: 680,
                  x: 30,
                  y: 180,
                  url: that.data.product.banner[0].img_url, //海报主图
                },
                {
                  width: 220,
                  height: 220,
                  x: 92,
                  y: 1020,
                  url: qrcodeUrl, //二维码的图
                }
              ],
            }
          })
          Poster.create(true)
        })

      }
    })

  },

  showModal: function (posterPath) {
    this.modalView.showModal({
      title: '保存至相册可以分享给好友',
      confirmation: false,
      confirmationText: '',
      inputFields: [{
        fieldName: 'posterImage',
        fieldType: 'Image',
        fieldPlaceHolder: '',
        fieldDatasource: posterPath,
        isRequired: false,
      }],
      confirm: function (res) {
        console.log(res)
      }
    })
  },

  onPosterSuccess(e) {
    const {
      detail
    } = e;
    this.showModal(detail);
  },
  onPosterFail(err) {
    wx.showToast({
      title: err,
      mask: true,
      duration: 2000
    });
  },

})