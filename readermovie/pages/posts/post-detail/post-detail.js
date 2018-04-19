var postsData = require('../../../data/data.js');
var app = getApp();
Page({
  data: {
    isPlay: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var globalData = app.globalData;

    var id = options.id;
    var postData = postsData.postList[id];
    this.setData(postData);
    this.data.id = id;



    //设置是否收藏
    var storageList = wx.getStorageSync("storage");
    if (storageList) {
      var isStorage = storageList[id];
      this.setData({
        collected: isStorage
      })
    } else {
      var storage = {};
      storage[id] = false;
      wx.setStorageSync("storage", storage)
    }

    if (globalData.g_isPlay && globalData.g_currentId == id) {
      this.data.isPlay = true;
      this.setData({
        isPlayed: true
      })
    }

    this.setMusicMonitor();
  },

  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayed: false,
      })
      app.globalData.g_isPlay = false;
      app.globalData.g_currentId = null;
    })

    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayed: true,

      })
      app.globalData.g_isPlay = true;
      app.globalData.g_currentId = that.data.id;
    })
  },

  onCollectionTap: function (event) {
    var storage = wx.getStorageSync("storage");
    var isStorage = storage[this.data.id];
    isStorage = !isStorage;
    storage[this.data.id] = isStorage;
    wx.setStorageSync("storage", storage)

    this.setData({
      collected: isStorage
    })

    wx.showToast({
      title: isStorage ? "收藏成功" : "取消成功",
      icon: "none"
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
      itemColor: "#666",

      success: function (res) {
        console.log(res.tapIndex);
      }
    })
  },

  onMusicTap: function (event) {
    var isPlay = this.data.isPlay;
    var postId = this.data.id;
    if (isPlay) {
      wx.stopBackgroundAudio();
      this.setData({
        isPlayed: false
      });
      this.data.isPlay = false;
      app.globalData.g_isPlay = false;

    } else {
      console.log("play");
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[postId].music.url,
        // dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
        title: postsData.postList[postId].music.title,
        coverImgUrl: postsData.postList[postId].music.coverImg
      })

      this.setData({
        isPlayed: true
      });
      this.data.isPlay = true;
      app.globalData.g_isPlay = true;

    }
  },



})