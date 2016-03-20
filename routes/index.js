var express = require('express');
var request = require('request');
var xml2js = require('xml2js');
var router = express.Router();

var parser = new xml2js.Parser();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var options = {
  host: 'http://fahrinfo.vbb.de',
  path: '/bin/stboard.exe/dn?maxJourneys=6&time=actual&inputTripleId=009002206&boardType=dep&L=vs_java3&start=yes'
};

router.get('/deps', function(req, res, next) {
  request('http://fahrinfo.vbb.de/bin/stboard.exe/dn?maxJourneys=6&time=actual&inputTripleId=009002206&boardType=dep&L=vs_java3&start=yes', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body); // Show the HTML for the Modulus homepage.
      parser.parseString(body, function (err, result) {
        //console.log(result);
        var newResult = [];
        try {
          var jurneys = result["StationTable"]["Journey"];
          var newJourneys = [];
          jurneys.forEach(function (item) {
            console.log(item["$"]);
            newItem = {};
            newItem["number"] = item["$"]["hafasname"];
            newItem["direction"] = item["$"]["dir"];
            newItem["depTime"] = item["$"]["fpTime"];
            newItem["delay"] = item["$"]["e_delay"];
            newJourneys.push(newItem);

          });
          //json = JSON.stringify(result)
          //console.log(newJourneys);
        } catch(error) {
          console.log(error)
        }

        //console.log(obje);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.json(newJourneys);
      });
      //res.
      //res.json(body);
      //res.render('deps', { title : 'Main page', news : body });
    }
  });


  //var reque = http.request(options, function(response) {
  //  res.render('index', { title : 'Main page', news : response });
  //});
});

module.exports = router;