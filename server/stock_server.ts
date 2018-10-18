import * as express from "express"
import { Server } from "ws";
import * as path from 'path';


const app = express()
//使用静态资源
app.use('/', express.static(path.join(__dirname, '..', 'client')))

app.get('/api/stock', (req, res) => {
    let result = stocks
    let params = req.query
    if (params.name) {
        result = result.filter(stock => stock.name.indexOf(params.name) != -1)
    }
    res.json(result)
});

app.get('/api/stock/:id', (req, res) => {
    res.json(stocks.find(stock => stock.id == req.params.id))
});

const server = app.listen(8000, 'localhost', () => {
    console.log("server started")
})
//connection pool
const subscriptions = new Set<any>()

const wsServer = new Server({
    port: 8085
})

wsServer.on("connection", websocket => {
    subscriptions.add(websocket)
})
var messageCount = 0

setInterval(() => {
    subscriptions.forEach(ws => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                messageCount: messageCount++
            }))
        } else {
            subscriptions.delete(ws)
        }
    })
}, 2000)

export class Stock {
    constructor(
        public id: number,
        public name: string,
        public price: number,
        public rating: number,
        public desc: string,
        public categories: Array<string>
    ) {

    }
}

const stocks: Stock[] = [
    new Stock(1, "600001", 1.99, 3.5, " First stock", ["IT", "互联网"]),
    new Stock(2, "600002", 2.99, 2.5, " First stock", ["IT", "互联网"]),
    new Stock(3, "600003", 3.99, 3.5, " First stock", ["IT", "互联网"]),
    new Stock(4, "600004", 4.99, 4.5, " First stock", ["IT", "互联网"]),
    new Stock(5, "600005", 5.99, 3.5, " First stock", ["IT", "互联网"]),
    new Stock(6, "600006", 6.99, 1.0, " First stock", ["IT", "互联网"]),
    new Stock(7, "600007", 7.99, 3.5, " First stock", ["IT", "互联网"])
];