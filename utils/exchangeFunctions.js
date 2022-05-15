const fetch = require("node-fetch");

var myHeaders = new fetch.Headers();
myHeaders.append("apikey", process.env.EXCHANGERATES_API_KEY);

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

function latestConvertTo(base, to) {
return fetch(`https://api.apilayer.com/exchangerates_data/latest?symbols=${to}&base=${base}`, requestOptions)
  .then(response => response.json())
  .then(res => {
      console.log(res);
      return res;
    })
  .catch(error => console.log('error', error));
}

module.exports = {
    latestConvertTo
}



