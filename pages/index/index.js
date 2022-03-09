// index.js
const { encrypt, decrypt } = require('decrypt-core')

const appkey = '12345678'
const data = JSON.stringify([
  "c9ac6d2ef0b0465fbf6de25002b544dd",
  "9f3cd43e68374ad2899a7ddf99d7b81a"
])
const enc = `54901079705754923221006629416524EA15D19E77B5D74091F31D042C6DD9C7A504BEA2FDE9851C2EBE19062FDF5AD6F546FE0395ADF0174B6BC58D87BDFABCA978415AE320065E4A8F13F5B96355EE201E8DF04696A72560B21CE1DF5D2F91BB19B6F834817069F3FBF155023A874F94058D510D6DEDE84CA4D5D02870F5E217698A81C82CA8027B142A8CB5E73397E2F0C163C63E069FE334F24226CED8DAC53FDAFBF018863B9A662453168D8A0618983CD5190C08B66596CC0A289E49FDF5849B4982D71A0DFC198DE2856A36FB`

// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindEncrypt(e) {
    try {
      const content = encrypt(data, appkey)
      wx.showModal({
        showCancel: false,
        title: '加密成功',
        content
      })
    } catch (e) {
      wx.showModal({
        showCancel: false,
        title: '加密失败',
        content: e.message
      })
    }
  },
  bindDecrypt(e) {
    try {
      const content = decrypt(enc, appkey)
      wx.showModal({
        showCancel: false,
        title: '解密成功',
        content
      })
    } catch (e) {
      wx.showModal({
        showCancel: false,
        title: '解密失败',
        content: e.message
      })
    }
  }
})
