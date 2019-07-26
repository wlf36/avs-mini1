// order.js
import {
    Config
} from '../../config/api'
import {
    Cart
} from '../cart/cart-model'
import {
    Order
} from './order-model'
import {
    User
} from '../user/user-model'
const cart = new Cart()
const order = new Order()
const user = new User()
const App = getApp()

Page({
    data: {
        uid: null,
        openid: null,
        order_id: null,
        productsArr: null,
        account: 0,
<<<<<<< HEAD
        orderStatus: ""
=======
        orderStatus: "",
        address: []
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
    },

    onLoad: function (options) {
        this.setData({
            uid: App.globalData.uid,
            openid: App.globalData.openid
        })

        let from = options.from;
        if (from == 'cart') {
            this._fromCart(options.account)
        } else {
<<<<<<< HEAD
            let order_id = options.id
=======
            let order_no = options.order_no
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
            this.setData({
                order_no
            })
            this._fromOrder(order_no)
        }

    },

    _fromCart: function (account) {
        let productsArr;
        productsArr = cart.getCartDataFromLocal(true);

        this.setData({
            productsArr,
            account,
            orderStatus: "noOrder"
        });

<<<<<<< HEAD
        user.getAddress(App.globalData.uid).then((res) => {
            this._bindAddress(res.data)
        })
    },

    _fromOrder(order_id) {
        if (order_id) {
            order.getOrderInfoById(order_id).then((res) => {
                const order = res.data[0]

                let products = JSON.parse(order.snap_items)
                console.log(products)
=======
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

    _fromOrder(order_no) {
        if (order_no) {
            order.getOrderInfoById(order_no).then((res) => {
                let products = JSON.parse(res.snap_items)
                const userAddress = JSON.parse(res.snap_address)
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
                products.map((item) => {
                    item.thumbnail = JSON.parse(item.thumbnail)
                    item.image = Config.uploads + item.thumbnail.img_url
                })
                this.setData({
                    orderInfo: res,
                    productsArr: products,
<<<<<<< HEAD
                    account: order.total_price,
                    order_no: order.order_no,
                    orderStatus: order.status
                })
                const address = JSON.parse(order.snap_address)
                this._bindAddress(address)
                console.log(products)
=======
                    account: res.total_price,
                    order_no: res.order_no,
                    orderStatus: res.status,
                    address: [userAddress],
                    currentAddress: userAddress
                })

>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
            });
        }
    },

<<<<<<< HEAD
    _bindAddress: function (data) {
        this.setData({
            address: {
                name: data.userName,
                phone: data.telNumber,
                info: data.provinceName + data.cityName + data.countyName + data.detailInfo
            }
        })
    },

=======
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
    //支付订单后返回查看订单
    onShow: function () {
        if (this.data.order_id) {
            this._fromOrder(this.data.order_id);
        }
    },

    //添加或编辑地址
    editAddress: function (event) {
        let that = this;
        const id = order.getDataSet(event, 'id')
        wx.chooseAddress({
            success: function (res) {
<<<<<<< HEAD
                //前端显示地址
                that._bindAddress(res);
                // const data = {
                //     userName: res.userName,
                //     telNumber: res.telNumber,
                //     postalCode: res.postalCode,
                //     provinceName: res.provinceName,
                //     cityName: res.cityName,
                //     countyName: res.countyName,
                //     detailInfo: res.detailInfo
                // }
                //保存地址到数据库
                user.submitAddress(res).then((flag) => {
                    if (!flag) {
                        that.showTips('操作提示', '地址信息更新失败！');
                    }
                });
=======
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
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
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

    /*
     * 提示窗口
     * params:
     * title - {string}标题
     * content - {string}内容
     * flag - {bool}是否跳转到 "我的页面"
     */
    showTips: function (title, content, flag) {
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: function (res) {
                if (flag) {
                    wx.switchTab({
                        url: '/pages/my/my'
                    });
                }
            }
        });
    },

    /*下单和付款*/
    pay: function () {
        if (!this.data.address) {
            this.showTips('下单提示', '请填写您的收货地址');
            return;
        }
        if (this.data.orderStatus == "noOrder") {
            this._firstTimePay();
        } else {
            this._oneMoresTimePay();
        }
    },

    _firstTimePay: function () {
        let products = []
        this.data.productsArr.map((item) => {
            products.push({
                product_id: item.id,
                count: item.counts
            })
        })
<<<<<<< HEAD
        console.log(products)
        order.doOrder(products).then((res) => {
            if (res.code == 200) {
                const order_id = res.data.order_id
                const order_no = res.data.order_no
=======
        // console.log(products)
        console.log('address', this.data.currentAddress);
        order.doOrder(products, this.data.currentAddress).then((res) => {
            // console.log('111', res)
            if (res.code == 200) {
                const order_id = res.order_id
                const order_no = res.order_no
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
                this.data.order_id = order_id
                let data = {
                    openid: this.data.openid,
                    total_fee: parseInt(this.data.account * 100),
                    out_trade_no: order_no,
<<<<<<< HEAD
                    body: 'demo'
=======
                    body: 'seed'
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
                }

                this._execPay(order_id, data)
            } else {
                console.log(res)
            }
        })
    },

    _oneMoresTimePay: function () {
        let data = {
            openid: this.data.openid,
            total_fee: parseInt(this.data.account * 100),
            out_trade_no: this.data.order_no,
<<<<<<< HEAD
            body: 'demo'
=======
            body: 'seed'
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
        }
        this._execPay(this.data.order_id, data)
    },

    /*
     *开始支付    
     */
    _execPay: function (order_id, data) {
        let that = this;
        order.execPay(order_id, data, (statusCode) => {
            if (statusCode !== 0) {
                //将已经下单的商品从购物车删除
                that.deleteProducts();

                let flag = statusCode == 2;
                wx.navigateTo({
                    url: '../pay-result/pay-result?id=' + order_id +
                        '&flag=' + flag + '&from=order'
                });
            }
        });
    },

    //将已经下单的商品从购物车删除 
    //ids订单商品id数组
    deleteProducts: function () {
        let ids = [],
            arr = this.data.productsArr;
        for (let i = 0; i < arr.length; i++) {
            ids.push(arr[i].id);
        }
        cart.delete(ids);
    }
})