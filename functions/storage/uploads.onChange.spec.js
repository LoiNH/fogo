const uploadsOnChange = require('./uploads.onChange');
const environment = require('../utils').environmentUtil();
const { adminUtil, collectionsUtil } = require('../utils');
const admin = adminUtil(environment);
const uploads = collectionsUtil(environment).get('uploads');
const db = admin.firestore();
const collection = db.collection(uploads);

describe('uploadsOnChange', () => {
  let fn;
  beforeEach(() => {
    fn = uploadsOnChange({ environment });
  });


  // afterAll(done => {
  //   collection
  //     .where('isTest', '==', true)
  //     .get()
  //     .then(snapshot => {
  //       const batch = db.batch();
  //       snapshot.docs.forEach(doc => batch.delete(doc.ref));
  //       return batch.commit();
  //     });
  // });

  it('should ignore files outside an "upload" directory', done => {
    fn({ data: { name: 'not-uploads/test.gif' } }).then(({ skipped }) => {
      expect(skipped).toEqual(true);
      done();
    });
  });

  it('should process an upload', done => {
    const name = 'test-bypass/uploads/exif.jpg';
    fn({ data: { name, resourceState: 'exists', md5Hash: 'not-a-hash' } }).then(result => {
      expect(result.name).toEqual(name);
      expect(result.isTest).toEqual(true);
      done();
    });
  });
});
