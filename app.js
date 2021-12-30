//Load express module with `require` directive
var express = require('express');
var https = require('https');
var app = express();
var listenPort = process.argv[2];

if (!listenPort) {
    console.log('usage: app.js <port>');
    process.exit(-1);
}


//Define request response in root URL (/)
app.get('/', function (req, res) {
    var authorization = req.header('Authorization');
    var str = "";
    const meReq = https.request({
        hostname: 'discord.com',
        port: 443,
        path: '/api/v9/users/@me',
        method: 'GET',
        headers: { 'Authorization': authorization }
    }, meRes => {
        meRes.on('data', chunk => {
            str += chunk;
        });
        meRes.on('end', function() {
            var me = JSON.parse(str);
            me.email = me.id + '@discord.com'
            res.send(me);
        });
        meRes.on('error', function(e) {
            res.send(e);
        });
    });

    meReq.end();
});

//Launch listening server on port 8081
app.listen(listenPort, function () {
    console.log('app listening on port ' + listenPort + '!')
});
