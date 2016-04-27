var express = require('express'),
    basicAuth = require('basic-auth'),
    compression = require('compression'),
    ms = require('ms'),
    port = process.env.PORT || 8080,
    lvmApp = process.env.LVM_APP || 'dist',
    password = process.env.LVM_PASSWD || 'poc2016-lvm!';

var app = express();
app.use(compression());
function authenticate(req, res, next){
    var user = basicAuth(req);
    if(user && user.pass === password){
        return next();
    }else{
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    }
}
app.use(authenticate);
app.use(express.static(lvmApp, { maxAge: ms('7 days')}));

app.listen(port);
