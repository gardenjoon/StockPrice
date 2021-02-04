import express, {Request, Response, NextFunction, Router} from 'express';
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");

app.use(bodyParser.text());

app.post('/', function(req,res,next) {
  let ticker = req.body
  let url = `https://finance.yahoo.com/quote/${ticker}`;
  console.log(url);
  axios.get(url).then(function(html:any) {
    let $ = cheerio.load(html.data);
    let stockitem = (tag:string,num:string) => ($('div#quote-header-info').find(`${tag}[data-reactid=${num}]`).text());
    let stockinfo:object = {
      time : /\d[A-z0-9:\ ]*/.exec(stockitem('span','35'))![0],
      stock : /.*\./.exec(stockitem('h1','7'))![0],
      price : stockitem('span','32')!,
    }
    return res.json(stockinfo)
  }).catch(function(error:any) {
    console.log(error)
  });
});

app.listen(4000,()=>{
  console.log('start')
})