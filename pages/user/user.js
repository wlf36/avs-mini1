// pages/user/index.js
import {
    Config
} from '../../config/api'
import {
    User
} from './user-model'
import {
    Order
} from '../order/order-model'

const user = new User()
const order = new Order()

const App = getApp()

Page({
    data: {
        openid: '',
        uid: null,
        userInfo: null,
        orderArr: null,
        address: [],
        tapBarItems: [
            // id name selected 选中状态
            {
                id: '1',
                name: '我的订单',
                active: true
            },
            {
                id: '2',
                name: '优惠券',
                active: false
            },
            {
                id: '3',
                name: '收货地址',
                active: false
            },
            {
                id: '4',
                name: '设置',
                active: false
            }
        ],
        tab: '1'
    },

    onLoad: function () {
        this._getUserInfo()
        this._loadData()
    },

    _loadData() {
        const uid = App.globalData.uid
        const openid = App.globalData.openid
        this.setData({
            uid,
            openid
        })

        order.getOrders().then((res) => {
            res.map((item) => {
                item.snap_img = JSON.parse(item.snap_img)
                item.snap_img.img_url = Config.uploads + item.snap_img.img_url
            })
            this.setData({
                orderArr: res
            })
        })

        user.getAddress().then((res) => {
            // console.log(res)
            res.map(item => {
                if (item.status == 1) {
                    this.setData({
                        currentAddress: item
                    })
                }
            })
            this.setData({
                address: res
            })
        })
    },

    _getUserInfo() {
        const that = this
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            that.setData({
                                userInfo: res.userInfo
                            })
                            that._updateUserInfo(res.userInfo)
                        }
                    })
                }
            }
        })
    },

    //授权获取头像昵称
    bindGetUserInfo: function (e) {
        this.setData({
            userInfo: e.detail.userInfo
        })
        this._updateUserInfo(e.detail.userInfo)
    },

    _updateUserInfo(data) {
        const userData = {
            nickName: data.nickName,
            avatarUrl: data.avatarUrl
        }
        user.updateUserInfo(userData)
    },

    //老订单支付
    rePay(event) {
        const id = order.getDataSet(event, 'id')
        const order_no = order.getDataSet(event, 'order_no')
        console.log(order_no)
        const index = order.getDataSet(event, 'index')
        const data = {
            openid: this.data.openid,
            total_fee: parseInt(this.data.orderArr[index].total_price * 100),
            out_trade_no: order_no,
            body: 'demo'
        }
        this._execPay(id, data, index);
    },


    _execPay: function (id, data, index) {
        let that = this;
        order.execPay(id, data, (statusCode) => {
            if (statusCode > 0) {
                let flag = statusCode == 2;
                wx.navigateTo({
                    url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
                });
            } else {
                that.showTips('支付失败', '商品已下架或库存不足');
            }
        });
    },

    /*
     * 提示窗口
     * params:
     * title - {string}标题
     * content - {string}内容
     * flag - {bool}是否跳转到 "我的页面"
     */
    showTips: function (title, content) {
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: function (res) {

            }
        });
    },

    editAddress: function (event) {
        let that = this;
        const id = order.getDataSet(event, 'id')
        wx.chooseAddress({
            success: function (res) {
                //前端显示地址  
                const userAddress = {
                    userName: res.userName,
                    telNumber: res.telNumber,
                    postalCode: res.postalCode,
                    address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                    status: 1
                }
                if (id) {
                    let _address = that.data.address
                    const address = _address.map((item) => {
                        if (item.id == id) {
                            item = {
                                id: id,
                                ...userAddress
                            }
                        }
                        return item
                    })
                    that.setData({
                        address
                    })
                    user.updateAddress(id, userAddress)
                } else {
                    that.setData({
                        address: [userAddress]
                    })
                    user.addAddress(userAddress)
                }
            }
        })
    },


    editAddressStatus(event) {
        const id = order.getDataSet(event, 'id')
        let _address = this.data.address
        _address.map(item => {
            if (item.id === id) {
                if (item.status === 0) {
                    item.status = 1
                } else {
                    item.status = 0
                }
                user.updateAddressStatus(id, {
                    status: item.status
                })
            } else {
                item.status = 0
            }
        })
        this.setData({
            address: _address
        })
    },

    /*显示订单的具体信息*/
    showOrderDetailInfo(event) {
        const order_no = order.getDataSet(event, 'orderno')
        wx.navigateTo({
            url: `../order/order?from=order&order_no=${order_no}`
        });
    },

    //tabs
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
    }

})