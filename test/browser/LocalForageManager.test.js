import { Collection, EJSON } from 'marsdb';
import StorageManager from '../../lib/LocalForageManager';
import chai, {expect, assert} from 'chai';
import localforage from 'localforage';
chai.use(require('chai-as-promised'));
chai.should();


describe('LocalForageManager', () => {

  let db, localStorage;
  beforeEach(function () {
    db = new Collection('test', {storageManager: StorageManager});
    localStorage = db.storage.forage;

    return Promise.all([
      db.storage.destroy(),
      localStorage.clear(),
    ]);
  });

  describe('#destroy', function () {
    it('should destroy a whole collection everywhere', function () {
      return Promise.all([
        db.insert({a: 1, b: 2, _id: '1'}),
        db.insert({a: 2, b: 3, _id: '2'}),
        db.insert({a: 3, b: 4, _id: '3'}),
        db.insert({a: 4, b: 5, _id: '4'}),
        db.insert({a: 5, b: 6, _id: '5'}),
        db.insert({a: 6, b: 7, _id: '6'}),
      ]).then((ids) => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(6),
          db.storage.get('2').should.be.eventually.deep.equal({a: 2, b: 3, _id: '2'}),
          db.storage.get('1000').should.be.eventually.deep.equal(undefined),
        ]);
      }).then(() => {
        return db.storage.destroy();
      }).then(() => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(0),
          db.storage.get('2').should.not.be.eventually.deep.equal({a: 2, b: 3, _id: '2'}),
          db.storage.get('2').should.be.eventually.deep.equal(undefined),
        ]);
      });
    });
  });

  describe('#persist', function () {
    it('should persist on insert', function () {
      return db.insert({a: 1, b: 2, _id: '1'}).then(() => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(1),
          localStorage.getItem('1').should.be.eventually.deep.equal({a: 1, b: 2, _id: '1'}),
        ]);
      });
    });

    it('should persist on insert multiple docs at once', function () {
      return db.insertAll([
        {a: 1, b: 2, _id: '1'},
        {a: 2, b: 2, _id: '2'},
        {a: 3, b: 2, _id: '3'},
      ]).then(() => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(3),
          localStorage.getItem('1').should.be.eventually.deep.equal({a: 1, b: 2, _id: '1'}),
          localStorage.getItem('2').should.be.eventually.deep.equal({a: 2, b: 2, _id: '2'}),
          localStorage.getItem('3').should.be.eventually.deep.equal({a: 3, b: 2, _id: '3'}),
        ]);
      });
    });

    it('should persist on update', function () {
      return db.insert({a: 1, b: 2, _id: '1'}).then(() => {
        return db.update('1', {$set: {a: 2}});
      }).then(() => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(1),
          localStorage.getItem('1').should.be.eventually.deep.equal({a: 2, b: 2, _id: '1'}),
        ]);
      });
    });
  });

  describe('#delete', function () {
    it('should delete from storage on remove', function () {
      return db.insert({a: 1, b: 2, _id: '1'}).then(() => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(1),
          localStorage.getItem('1').should.be.eventually.deep.equal({a: 1, b: 2, _id: '1'}),
        ]);
      }).then(() => {
        return db.remove('1');
      }).then(() => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(0),
          expect(db.findOne('1')).to.be.eventually.equal(undefined)
        ]);
      });
    });

    it('should have no errors on deleting non-existing key', function () {
      return db.insert({a: 1, b: 2, _id: '1'}).then(() => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(1),
          localStorage.getItem('1').should.be.eventually.deep.equal({a: 1, b: 2, _id: '1'}),
        ]);
      }).then(() => {
        return db.remove('1');
      }).then(() => {
        return Promise.all([
          localStorage.length().should.be.eventually.equal(0),
          db.storage.delete('1')
        ]);
      });
    });
  });

  describe('#reload', function () {
    it('should reload and finds wait until reload done', function () {
      const preparePromise = localStorage.length().should.be.eventually.equal(0)
      .then(() => Promise.all([
        localStorage.setItem('1', {a: 1, _id: '1'}),
        localStorage.setItem('2', {a: 2, _id: '2'}),
        localStorage.setItem('3', {a: 3, _id: '3'}),
      ])).then(() => localStorage.length().should.be.eventually.equal(3));

      return preparePromise.then(() =>
        expect(db.findOne('1')).to.be.eventually.equal(undefined)
        .then(() => {
          db.storage.reload()
          return Promise.all([
            expect(db.findOne('1')).to.be.eventually.deep.equal({a: 1, _id: '1'}),
            expect(db.findOne('2')).to.be.eventually.deep.equal({a: 2, _id: '2'}),
            expect(db.findOne('3')).to.be.eventually.deep.equal({a: 3, _id: '3'}),
            expect(db.findOne('4')).to.be.eventually.deep.equal(undefined),
          ]);
        })
      );
    });

    it('should update wait until reload', function () {
      const preparePromise = localStorage.length().should.be.eventually.equal(0)
      .then(() => Promise.all([
        localStorage.setItem('1', {a: 1, _id: '1'}),
        localStorage.setItem('2', {a: 2, _id: '2'}),
        localStorage.setItem('3', {a: 3, _id: '3'}),
      ])).then(() => localStorage.length().should.be.eventually.equal(3));

      return preparePromise.then(() =>
        expect(db.findOne('1')).to.be.eventually.equal(undefined).then(() => {
          db.storage.reload();
          return db.update('1', {$set: {a: 5}});
        }).then(res => {
          res.modified.should.be.equal(1);
          res.updated.length.should.be.equal(1);
          res.updated[0].should.be.deep.equal({a: 5, _id: '1'});
        })
      );
    });
  });
});