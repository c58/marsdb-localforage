'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localforage = require('localforage');

var _localforage2 = _interopRequireDefault(_localforage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StorageManager = typeof window !== 'undefined' && window.Mars ? window.Mars.StorageManager : require('marsdb').StorageManager;
var EJSON = typeof window !== 'undefined' && window.Mars ? window.Mars.EJSON : require('marsdb').EJSON;

/**
 * LocalForage storage implementation. It uses
 * basic in-memory implementaion for fastest
 * iterating and just sync any operation with
 * a storage.
 */

var LocalForageManager = (function (_StorageManager) {
  _inherits(LocalForageManager, _StorageManager);

  function LocalForageManager(db) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, LocalForageManager);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LocalForageManager).call(this, db, options));

    _this.forage = _localforage2.default.createInstance({
      name: db.modelName
    });
    return _this;
  }

  _createClass(LocalForageManager, [{
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      return this._queue.add(function () {
        return Promise.all(Object.keys(_this2._storage).map(function (key) {
          return _this2.forage.removeItem(key);
        })).then(function () {
          return _get(Object.getPrototypeOf(LocalForageManager.prototype), 'destroy', _this2).call(_this2);
        });
      });
    }
  }, {
    key: 'persist',
    value: function persist(key, value) {
      var _this3 = this;

      return _get(Object.getPrototypeOf(LocalForageManager.prototype), 'persist', this).call(this, key, value).then(function () {
        return _this3._queue.add(function () {
          return _this3.forage.setItem(key, EJSON.stringify(value));
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      var _this4 = this;

      return _get(Object.getPrototypeOf(LocalForageManager.prototype), 'delete', this).call(this, key).then(function () {
        return _this4._queue.add(function () {
          return _this4.forage.removeItem(key);
        });
      });
    }
  }, {
    key: '_loadStorage',
    value: function _loadStorage() {
      return this._queue.add(function () {
        // TODO
      });
    }
  }]);

  return LocalForageManager;
})(StorageManager);

exports.default = LocalForageManager;