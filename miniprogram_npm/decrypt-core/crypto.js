"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContent = createContent;
exports.decryptByDES = decryptByDES;
exports.encryptByDES = encryptByDES;
exports.resolveContent = resolveContent;

var _encHex = _interopRequireDefault(require("./crypto-js/enc-hex"));

var _tripledes = _interopRequireDefault(require("./crypto-js/tripledes"));

var _core = _interopRequireDefault(require("./crypto-js/core"));

var _util = require("./util");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/* eslint-disable no-use-before-define */

/* eslint-disable no-param-reassign */

/* eslint-disable no-bitwise */

/* eslint-disable no-plusplus */

/* eslint-disable func-names */

/* eslint-disable no-underscore-dangle */
// const Hex = require('crypto-js/enc-hex')
// const TripleDES = require('crypto-js/tripledes')
// const Core = require('crypto-js/core')

/**
 * Electronic Codebook block mode.
 */


var CryptoECB = function () {
  var ECB = _core.default.lib.BlockCipherMode.extend();

  ECB.Encryptor = ECB.extend({
    processBlock: function processBlock(words, offset) {
      this._cipher.encryptBlock(words, offset);
    }
  });
  ECB.Decryptor = ECB.extend({
    processBlock: function processBlock(words, offset) {
      this._cipher.decryptBlock(words, offset);
    }
  });
  return ECB;
}();
/**
* A noop padding strategy.
*/


var NoPadding = {
  pad: function pad() {},
  unpad: function unpad() {}
}; // 加密

function encryptByDES(mpiKey, message, isSessionKey) {
  mpiKey += mpiKey.substring(0, 16); // console.log("秘钥："+mpiKey)
  // 转16进制
  // console.log(message)
  // 过程密钥不做填充

  if (!isSessionKey) {
    message = (0, _util.padding80)(message, true); // console.log('padding:'+message)
  }

  message = _encHex.default.parse(message); // console.log(`mpiKey: ${mpiKey}`)
  // console.log(`message: ${message}`)

  var keyHex = _encHex.default.parse(mpiKey);

  var encrypted = _tripledes.default.encrypt(message, keyHex, {
    mode: CryptoECB,
    padding: NoPadding
  }); // console.log("加密密文："+encrypted.ciphertext.toString().toUpperCase())


  return encrypted.ciphertext.toString().toUpperCase();
} // 3des解密


function decryptByDES(mpiKey, ciphertext) {
  // mpiKey = "77c3052b141a481dd2f377c51571812c"
  mpiKey += mpiKey.substring(0, 16);

  var keyHex = _encHex.default.parse(mpiKey);

  ciphertext = _encHex.default.parse(ciphertext); // direct decrypt ciphertext

  var decrypted = _tripledes.default.decrypt({
    ciphertext: ciphertext
  }, keyHex, {
    mode: CryptoECB,
    padding: NoPadding
  });

  var data = decrypted.toString(); // console.log(`data:${data}`)

  data = (0, _util.hexCharCodeToStr)(data); // console.log('data2:'+data)

  var num = data.lastIndexOf('80'); // 截取actionInfoString
  // 最后一个'80'出现的位置

  if (num !== -1) {
    data = data.substring(0, num);
  }

  var result = (0, _util.hexCharCodeToStr)(data);
  return result;
}
/**
* 创建加密报文
* @param config
*/


function createContent(config, appkey) {
  // 最终生成密文
  // 生成随机数
  var randData = (0, _util.s2as)(32); // console.log("随机数:"+randData)

  var mpiKey = appkey; // 获取过程密钥

  var processKey = encryptByDES(mpiKey, randData, true); // console.log("过程秘钥:"+processKey)
  // 加密ActionInfo
  // console.log('json明文:'+JSON.stringify(config))

  var src = (0, _util.strToHexCharCode)(JSON.stringify(config)); // console.log('16进制明文:'+src)

  var actionInfo = encryptByDES(processKey, src, false);
  var encStr = randData + actionInfo;
  return encStr;
} // 解析数据


function resolveContent(actionInfo, appkey) {
  var mpiKey = appkey; // 获取随机数

  var randData = actionInfo.substring(0, 32); // console.log(`de-randData : ${randData}`)
  // 获取应用密文

  var singData = actionInfo.substring(32, actionInfo.length); // console.log(`de-enData : ${singData}`)
  // 获取过程密钥

  var processKey = encryptByDES(mpiKey, randData, true); // console.log(`de-processKey : ${processKey}`)
  // 解密singData

  var actionInfoString = decryptByDES(processKey, singData); // console.log(`de-HexString : ${actionInfoString}`)
  // console.log(`actionInfoString:${actionInfoString}`)

  var res;

  try {
    res = JSON.parse(actionInfoString);
  } catch (e) {
    res = actionInfoString;
  } // console.log('parse json:'+json)


  return res;
}