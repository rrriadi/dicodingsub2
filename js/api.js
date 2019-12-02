const base_url = "https://api.football-data.org/"
 let saved = [];


console.log(base_url + "v2/matches")
fetch(base_url + "v2/matches", 
{
headers : {'X-Auth-Token' : 'c9c3c5e000b64bcbb7515e47b74e48cf' },
method : 'GET'
} )
  .then(function(response)
  {
    if(response.status !=200)
    {
      console.log("Error " + response.status);
      return;
    }
    response.json()
    .then(function(data)
    {
      const matchlist = data.matches;
      let matchHTML = "";

      var dbPromise = idb.open("mydatabase", 5 , function(upgradeDb)
      {
          if(!upgradeDb.objectStoreNames.contains("match"))
            {
              upgradeDb.createObjectStore("match", {keyPath: 'id'});
            }
      }
      )
      dbPromise.then(function(db)
      {
        var tx = db.transaction('match', 'readonly');
        var store = tx.objectStore('match');
        return store.getAll();

      })
      .then(function(items)
      {
        console.log('All data', items);
        for(const item of items)
        {
          saved.push(item.id);
        }
        console.log('saved items: ', saved);

        for(const match of matchlist)
        {
          const matchdate = new Date(match.utcDate);

          let exist = false;
          let exstatus = "";
          for(let savedid of saved)
          {

            if (savedid === match.id)
            {
            console.log(`match! ${savedid} equals ${match.id}`)
              exstatus = "checked"

            }
          }


          matchHTML += `
            <tr>
            <td>${matchdate.getFullYear()}-${matchdate.getMonth() +1}-${matchdate.getDate()}</td>
            <td>${matchdate.getUTCHours()}:${matchdate.getUTCMinutes()}</td>
            <td>${match.status}</td>
            <td>${match.season.startDate}&nbsp;s/d&nbsp;${match.season.endDate}</td>
            <td>${match.homeTeam.name}</td>
            <td>${match.awayTeam.name}</td>
            <td><div class="switch">
                <label>
                  <input type="checkbox" onClick="sendToDb('${encodeURI(JSON.stringify(match))}', this)" ${exstatus}>
                  <span class="lever"></span>
                </label>
              </div>
            </td>


            </tr>

          `

        }
        document.getElementById("matchtab").innerHTML = matchHTML;
        console.log(data);

      })  
    })
  })
  .catch(function(error)
  {
    console.log("Error: " + error);
  });

  function sendToDb(data, status)
  {
    const datastring = decodeURI(data);
    let dataJSON = JSON.parse(datastring);
    console.log(dataJSON);
    console.log(status.checked)
    if(status.checked)
    {
      var dbPromise = idb.open("mydatabase", 5 , function(upgradeDb)
      {
          if(!upgradeDb.objectStoreNames.contains("match"))
            {
              upgradeDb.createObjectStore("match", {keyPath: 'id'});
            }
            console.log("adding I");
      }
      )
      dbPromise.then(function(db)
      {
        console.log('adding II')
        var tx = db.transaction('match', 'readwrite');
        var store = tx.objectStore('match');
        var testData = {
          id: dataJSON.id
        }
        console.log(testData)
        store.add(dataJSON);
      })
    }
    else
    {
      var dbPromise = idb.open("mydatabase", 5 , function(upgradeDb)
      {
          if(!upgradeDb.objectStoreNames.contains("match"))
            {
              upgradeDb.createObjectStore("match", {keyPath: 'id'});
            }
      }
      )
      dbPromise.then(function(db)
      {
        var tx = db.transaction('match', 'readwrite');
        var store = tx.objectStore('match');
        store.delete(dataJSON.id);
      })
    }
  }

