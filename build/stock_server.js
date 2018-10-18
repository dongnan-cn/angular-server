"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
app.get('/api/stock', function (req, res) {
    var result = stocks;
    var params = req.query;
    if (params.name) {
        result = result.filter(function (stock) { return stock.name.indexOf(params.name) != -1; });
    }
    res.json(result);
});
app.get('/api/stock/:id', function (req, res) {
    res.json(stocks.find(function (stock) { return stock.id == req.params.id; }));
});
var server = app.listen(8000, 'localhost', function () {
    console.log("server started");
});
//connection pool
var subscriptions = new Set();
var wsServer = new ws_1.Server({
    port: 8085
});
wsServer.on("connection", function (websocket) {
    subscriptions.add(websocket);
});
var messageCount = 0;
setInterval(function () {
    subscriptions.forEach(function (ws) {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                messageCount: messageCount++
            }));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
var Stock = /** @class */ (function () {
    function Stock(id, name, price, rating, desc, categories) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Stock;
}());
exports.Stock = Stock;
var stocks = [
    new Stock(1, "600001", 1.99, 3.5, " First stock", ["IT", "互联网"]),
    new Stock(2, "600002", 2.99, 2.5, " First stock", ["IT", "互联网"]),
    new Stock(3, "600003", 3.99, 3.5, " First stock", ["IT", "互联网"]),
    new Stock(4, "600004", 4.99, 4.5, " First stock", ["IT", "互联网"]),
    new Stock(5, "600005", 5.99, 3.5, " First stock", ["IT", "互联网"]),
    new Stock(6, "600006", 6.99, 1.0, " First stock", ["IT", "互联网"]),
    new Stock(7, "600007", 7.99, 3.5, " First stock", ["IT", "互联网"])
];
