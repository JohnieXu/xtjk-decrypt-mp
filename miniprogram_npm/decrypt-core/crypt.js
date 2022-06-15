"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = exports.decrypt = void 0;

var _crypto = require("./crypto"); // const { resolveContent, createContent } = require('./tripledes3.js')


var decrypt = function decrypt(data, appKey) {
  return (0, _crypto.resolveContent)(data, appKey);
};

exports.decrypt = decrypt;

var encrypt = function encrypt(data, appKey) {
  return (0, _crypto.createContent)(data, appKey);
};

exports.encrypt = encrypt;