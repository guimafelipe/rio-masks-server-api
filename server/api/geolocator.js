const axios = require('axios').default;
const stores = require('./mapinfo.json');
const fs = require('fs');

const url1 = "https://api.opencagedata.com/geocode/v1/json?q=",
      url2 = "&key=";

const {OPEN_KEY} = process.env;

const Geolocator = {}

async function callApi(address){
    let url = `${url1}${encodeURI(address)}${url2}${OPEN_KEY}`;
    let res = await axios.get(url);
    return res;
}

Geolocator.getCoord = async function(address){
    let res = await callApi(address);
    let results = res.data.results[0];
    let coords1 = results.bounds.northeast;
    let coords2 = results.bounds.southwest;
    return [(coords1.lng + coords2.lng)/2, (coords1.lat + coords2.lat)/2];
}

Geolocator.localize = async function () {
    let arr = stores.stores;
    try {
        for (let i = 0; i < arr.length; i++){
            let store = arr[i];
            if(store.coord) continue;
            let address = store.address;
            store.coord = await this.getCoord(address);
            stores.stores[i] = store;
        }
        let json = JSON.stringify(stores, null, 4);
        console.log("JSON NOVO: " + json);
        await fs.writeFile(__dirname + '/mapinfo.json', json);
    } catch (error) {
        console.log("Erro ao salvar") 
        console.log(error) 
    }
    
}

module.exports = Geolocator;