const StorageManager = typeof window !== 'undefined' && window.Mars
  ? window.Mars.StorageManager : require('marsdb').StorageManager;
const EJSON = typeof window !== 'undefined' && window.Mars
  ? window.Mars.EJSON : require('marsdb').EJSON;
import localforage from 'localforage';


/**
 * LocalForage storage implementation. It uses
 * basic in-memory implementaion for fastest
 * iterating and just sync any operation with
 * a storage.
 */
export default class LocalForageManager extends StorageManager {
  constructor(db, options = {}) {
    super(db, options);
  }

  destroy() {
    return this._queue.add(() => {
      return this.forage.clear().then(() => super.destroy());
    });
  }

  persist(key, value) {
    return super.persist(key, value).then(() => {
      return this._queue.add(() => {
        return this.forage.setItem(key, value);
      });
    });
  }

  delete(key) {
    return super.delete(key).then(() => {
      return this._queue.add(() => {
        return this.forage.removeItem(key);
      });
    });
  }

  _loadStorage() {
    this.forage = this.forage || localforage.createInstance({
      name: this.db.modelName,
    });

    return this._queue.add(() => {
      return this.forage.iterate((value, key, i) => {
        const doc = this.db.create(value);
        this._storage[doc._id] = doc;
      });
    });
  }
}
