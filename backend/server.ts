const { Socket } = require( "socket.io")

const express = require("express")
const app = express()
const http = require("http")
const {Server} = require('socket.io')
const cors = require('cors')

app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})

server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
})


import { shuffleCards, getRemainingCards } from './shuffle'

var playerCounter = 0
var playerCapacity = 4  // change to 4 later
var playerNameArray:string[] = []
var allCards: [string, string][]= [['a', 'diams'], ['2', 'diams'], ['3', 'diams'], ['4', 'diams'], ['5', 'diams'], ['6', 'diams'], ['7', 'diams'], ['8', 'diams'], ['9', 'diams'], ['10', 'diams'], ['j', 'diams'], ['q', 'diams'], ['k', 'diams'], ['a', 'spades'], ['2', 'spades'], ['3', 'spades'], ['4', 'spades'], ['5', 'spades'], ['6', 'spades'], ['7', 'spades'], ['8', 'spades'], ['9', 'spades'], ['10', 'spades'], ['j', 'spades'], ['q', 'spades'], ['k', 'spades'], ['a', 'hearts'], ['2', 'hearts'], ['3', 'hearts'], ['4', 'hearts'], ['5', 'hearts'], ['6', 'hearts'], ['7', 'hearts'], ['8', 'hearts'], ['9', 'hearts'], ['10', 'hearts'], ['j', 'hearts'], ['q', 'hearts'], ['k', 'hearts'], ['a', 'clubs'], ['2', 'clubs'], ['3', 'clubs'], ['4', 'clubs'], ['5', 'clubs'], ['6', 'clubs'], ['7', 'clubs'], ['8', 'clubs'], ['9', 'clubs'], ['10', 'clubs'], ['j', 'clubs'], ['q', 'clubs'], ['k', 'clubs']]
var returned_shuffleCards = shuffleCards(allCards)
var remainingCards = getRemainingCards(allCards, returned_shuffleCards)
var cardSetCounter = 0
var socketIDArr:any = []

io.on("connection",(socket:any)=>{
    
    console.log("user connected with a socket id", socket.id)
    //add custom events here
    socket.on("newPlayer", (myData:any)=>{
        if (playerCounter < playerCapacity)
        {
            console.log('newPlayer', myData)
            playerCounter++
            const playerName = myData.username
            console.log(`Player Name: ${playerName}`)
            playerNameArray.push(playerName)

            if (playerCounter === playerCapacity)
            {
                // console.log("Player Cap Reached")
                io.sockets.emit("UsersFull", playerNameArray)
            }
        }   
        else  // cap already reached
        {
            console.log('Max players have joined')
            socket.emit("MaxPlayers")
        }
        
        socket.on("StartGame", ()=>{
            if (!socketIDArr.includes(socket.id))
            {

                // console.log("Returned shuffle cards")
                console.log("in server: ", returned_shuffleCards, cardSetCounter, socket.id)
                io.to(socket.id).emit("CardsDealt", returned_shuffleCards, cardSetCounter, remainingCards)
                cardSetCounter += 1
                socketIDArr.push(socket.id)
            }
        
        // message sending when
        io.sockets.emit("MessagesPrompt", ["first message", "second message", "third message"])
        })

        
        socket.on("NextTurn", (deck:any, pile:any, pID:any)=>{
            const nextPlayer = socketIDArr[pID]
            io.sockets.emit("NextTurnClient", deck, pile, pID)

        })
    })
})

