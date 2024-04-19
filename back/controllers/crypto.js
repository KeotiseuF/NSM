const NodeCache = require('node-cache');
const myCache = new NodeCache();

const  { getList } = require('../middlewares/coingecko');

exports.getCryptos = async (req, res) => {
  const listCryptoCached = myCache.get("listCrypto");
  
  if(listCryptoCached) {
    console.log("Use crypto list cached");
    
    res.send(listCryptoCached);
  } else {
    const listCrypto = await getList();
    
    console.log("First request crypto list");
    
    myCache.set("listCrypto", listCrypto, 100); // Cache for 1 week to setup LATER. 

    res.send(listCrypto);
  }
};