var express = require('express');
var router = express.Router();


url = require('url');
path = require('path');
fs = require('fs');
http = require('http');
https = require('https');
r = require('readability-node');
jsdom = require('jsdom').jsdom;



function fetch(uri, callback){
    uri = url.parse(uri);
    if(uri.protocol === "https:"){
        return https.get(uri, callback);
    }else{
        return http.get(uri, callback);
    }
}

function serveReadability(uri, response){
    fetch(uri, function(res){
        console.log("Got response", res.statusCode)
    
        var src = '';
        res.on('data', function(d){ src += d; });
        res.on('end', function(){
            console.log("Stream end");
            // Do something with src
            var doc = jsdom(src, {features: {
                FetchExternalResources: false,
                ProcessExternalResources: false
            }
            });
            var article = new r.Readability(uri, doc).parse();
          //  render(response, article.title);
           /// console.log('title: '+article.title);
           if(article){
  response.send(article.content);
           }else{
               response.send("can't get details");
           }
          
            //  console.log('title: '+article.title+" \ncontent: "+article.content);
        });
    }).on('error', function(e){
        console.log("Got error", e.message, uri)
            console.log('this feed does not have url ');
    response.send('this feed does not have url ');
       
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/hello', function(req, res, next) {
 // res.render('index', { title: 'Express' });

  //==


    var req_url = url.parse(req.url, true);
    var filename = path.join(process.cwd(), req_url.pathname);
    var uri = req_url.query.url;
    serveReadability(uri, res);
  //==

   
});


module.exports = router;
