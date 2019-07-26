// cart.js
import { Cart } from './cart-model';
let cart = new Cart(); //实例化 购物车

Page({

    data: {
        cartData: null,             //购物车数据
        account: null,              //总金额
        selectedCounts: null,       //商品总数量    
        selectedTypeCounts: null    //商品种类总数量
    },

    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '购物车'
        })
    },
    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let cartData = cart.getCartDataFromLocal();
        // var countsInfo = cart.getCartTotalCounts(true);
        let cal = this._calcTotalAccountAndCounts(cartData);

        this.setData({
            selectedCounts: cal.selectedCounts,
            selectedTypeCounts: cal.selectedTypeCounts,
            account: cal.account,
            cartData: cartData
        });        
    },

    onHide: function () {
        cart.execSetStorageSync(this.data.cartData);
    },

    toggleSelect: function (event) {
        let id = cart.getDataSet(event, 'id'),
            status = cart.getDataSet(event, 'status'),
            index = this._getProductIndexById(id);
        this.data.cartData[index].selectStatus = !status;
        this._resetCartData();
    },

    toggleSelectAll: function (event) {
        let status = cart.getDataSet(event, 'status') == 'true';
        let data = this.data.cartData,
            len = data.length;
        for (let i = 0; i < len; i++) {
            data[i].selectStatus = !status;
        }
        this._resetCartData();
    },

    changeCounts: function (event) {
        let id = cart.getDataSet(event, 'id'),
            type = cart.getDataSet(event, 'type'),
            index = this._getProductIndexById(id),
            counts = 1;

        if (type == 'add') {
            cart.addCounts(id);
        } else {
            counts = -1;
            cart.cutCounts(id);
        }

        this.data.cartData[index].counts += counts;
        this._resetCartData();
    },

    delete: function (event) {
        let id = cart.getDataSet(event, 'id'),
            index = this._getProductIndexById(id);

        this.data.cartData.splice(index, 1);//删除某一项商品

        this._resetCartData();
        cart.delete(id);
    },

    /*重新计算总金额和商品总数*/
    _resetCartData: function () {        
        let newData =
            this._calcTotalAccountAndCounts(this.data.cartData);
        this.setData({
            account: newData.account,
            selectedCounts: newData.selectedCounts,
            selectedTypeCounts: newData.selectedTypeCounts,
            cartData: this.data.cartData        //数据绑定UI
        });
    },

    //计算总金额和数量
    _calcTotalAccountAndCounts: function (data) {
        let len = data.length,
            // 所需要计算的总价格，但是要注意排除掉未选中的商品
            account = 0,
            // 购买商品的总个数
            selectedCounts = 0,
            // 购买商品种类的总数
            selectedTypeCounts = 0;

        let multiple = 100;

        for (let i = 0; i < len; i++) {
            //避免 0.05 + 0.01 = 0.060 000 000 000 000 005 的问题，乘以 100 *100
            if (data[i].selectStatus) {
                account +=
                    data[i].counts * multiple * Number(data[i].price) * multiple;
                selectedCounts += data[i].counts;
                selectedTypeCounts++;
            }
        }

        return {
            selectedCounts: selectedCounts,
            selectedTypeCounts: selectedTypeCounts,
            account: account / (multiple * multiple)
        }
    },    

    /*根据商品productId得到 商品所在下标*/
    _getProductIndexById: function (id) {
        let data = this.data.cartData,
            len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].id == id) {
                return i;
            }
        }
    },    

    submitOrder: function (event) {
        wx.navigateTo({
            url: '../order/order?account=' + this.data.account + '&from=cart'
        });
    }

})