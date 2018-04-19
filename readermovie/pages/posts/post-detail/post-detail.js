var postsData = require('../../../data/data.js');
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var postData = postsData.postList[id];
    this.setData(postData);
    this.data.id = id;


    //设置是否收藏
    var storageList = wx.getStorageSync("storage");
    if(storageList){
      var isStorage = storageList[id];
      this.setData({
        collected : isStorage
      })
    }else{
      var storage = {};
       storage[id] =false;
       wx.setStorageSync("storage", storage)
    }
  },

  onCollectionTap: function (event) {
   var storage =  wx.getStorageSync("storage");
   var isStorage = storage[this.data.id];
    isStorage = !isStorage;
    storage[this.data.id] = isStorage;
    wx.setStorageSync("storage", storage)

    this.setData({
      collected:isStorage
    })

    wx.showToast({
      title: isStorage?"收藏成功":"取消成功",
      icon:"none"
    })

    wx.showModal({
      title: '收藏成功',
      content: '你真棒',
    })
  },

  onShareTap: function (event) {
    wx.showActionSheet({
      itemList: [
        '分享到微信',
        '分享到QQ',
        '分享到微博'
      ],
      itemColor:"#666",

      success:function(res){
        console.log(res.tapIndex);
      }
    })
  },

  onMusicTap:function(event){
    console.log("play");
    wx.playBackgroundAudio({
      dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
      title:'沉默是金-张国荣',
      coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000003at0mJ2YrR2H.jpg?max_age=2592000'
    })
  }


})