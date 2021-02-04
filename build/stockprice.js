"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var axios = require("axios");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
app.use(bodyParser.text());
app.post('/', function (req, res, next) {
    var ticker = req.body;
    var url = "https://finance.yahoo.com/quote/" + ticker;
    console.log(url);
    axios.get(url).then(function (html) {
        var $ = cheerio.load(html.data);
        var stockitem = function (tag, num) { return ($('div#quote-header-info').find(tag + "[data-reactid=" + num + "]").text()); };
        var stockinfo = {
            time: /\d[A-z0-9:\ ]*/.exec(stockitem('span', '35'))[0],
            stock: /.*\./.exec(stockitem('h1', '7'))[0],
            price: stockitem('span', '32'),
        };
        return res.json(stockinfo);
    }).catch(function (error) {
        console.log(error);
    });
});
app.listen(3000, function () {
    console.log('start');
});
