console.log('something supersuper terrible');
var express = require('express');
var app = express();


app.use('*', (req, res, next) => {
    console.log(req.originalUrl);
    console.log('efwgfwse')
    next();
});

app.use(express.static('./'));
app.listen(8080);