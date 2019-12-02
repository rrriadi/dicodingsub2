
var dbPromise = idb.open("mydatabase", 5 , function(upgradeDb)
{
	if(!upgradeDb.objectStoreNames.contains("match"))
	{
		upgradeDb.createObjectStore("match", {keyPath: 'id'});
		

	}
});

dbPromise.then(function(db)
      {
        var tx = db.transaction('match', 'readwrite');
        var store = tx.objectStore('match');
        store.add(dataJSON);
      })