class IDB {
  constructor(dbName, version){
    this.dbName = dbName;
    this.version = version;
    this.request = indexedDB.open(dbName, version);
    this.request.onerror = console.log;
  }
  set onupgradeneeded(f){ this.request.onupgradeneeded = f; }
  getStore(store, mode){ return this.request.result.transaction([store], mode).objectStore(store); }
  getAll(store){
    return new Promise(res=>{
      this.getStore(store).getAll().onsuccess = e => res(e.target.result);
    });
  }
  add(store, item){ this.getStore(store, 'readwrite').add(item); }
  clear(store){ this.getStore(store, 'readwrite').clear(); }
}
log = {
  db: new IDB('log',2),
  store: 'log',
  add(obj){
    obj.timestamp = new Date();
    obj.pathname = location.pathname;
    this.db.add(this.store, obj);
  },
  getAll(){
    return this.db.getAll(this.store);
  },
  clear(){
    this.db.clear(this.store);
  }
};
log.db.onupgradeneeded = function(event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore("log", { autoIncrement: true });
  objectStore.createIndex("type", "type", { unique: false });
  objectStore.createIndex("timestamp", "timestamp", { unique: false });
  objectStore.createIndex('pathname', 'pathname', {unique: false});
};
window.addEventListener('beforeunload', ()=>log.clear());
log.add({type: 'error', data: 'error stuff here2'});
