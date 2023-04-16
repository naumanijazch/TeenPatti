import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";

import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface TeenPattiPageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

var temp1: string[] = [];
var temp2: string[] = [];
var temp3: string[] = [];

const symbols: Record<string, string> = {
  hearts: "♥",
  diams: "⋄",
  spades: "♠",
  clubs: "♣",
};

function App({ socket }: TeenPattiPageProps) {

  // use location variables
  const location = useLocation();
  const players_names = location.state.playerNames;

  // userState variables
  const [cardsInHand, setcardsInHand] = useState<string[]>([]);
  const [cardsFaceDown, setcardsFaceDown] = useState<string[]>([]);
  const [cardsFaceUp, setcardsFaceUp] = useState<string[]>([]);
  const [message, setmessage] = useState<string[]>([]);
  const [deck, setdeck] = useState([]);
  const [p1, setp1] = useState<string[]>([]);
  const [p2, setp2] = useState<string[]>([]);
  const [p3, setp3] = useState<string[]>([]);
  const [p4, setp4] = useState<string[]>([]);
  const [pID, setpID] = useState(0);
  const [pile, setpile] = useState<string[]>([]);


  // useEffect conditonals and sockets 
  useEffect(() => {
    socket.emit("StartGame", players_names);

    socket.on(
      "CardsDealt",
      (cards: any, playerID: number, incoming_deck: any) => {
        console.log("-Received shuffled cards:", cards);
        temp1 = [cards[playerID][0], cards[playerID][1], cards[playerID][2]]; // my cards
        temp2 = [cards[playerID][3], cards[playerID][4], cards[playerID][5]];
        temp3 = [cards[playerID][6], cards[playerID][7], cards[playerID][8]];
        
        // setters
        setpID(playerID);
        setp1(cards[0]);
        setp2(cards[1]);
        setp3(cards[2]);
        setp4(cards[3]);
        setcardsInHand(temp1);
        setcardsFaceDown(temp2);
        setcardsFaceUp(temp3);
        setdeck(incoming_deck);
      });

      socket.on(
        "NextTurnClient", (deck2:any, pile2:any, pID2:any) => {
          setdeck(deck2)
          setpile(pile2)
          setpID(pID2);
        })


    socket.on("MessagesPrompt", (messagesRecieved: any) => {
      // console.log("Messages received:", messagesRecieved)
      setmessage(messagesRecieved);
    });
  }, [socket]);

  useEffect(() => {
    if (deck.length >0)
    {
      var UE_pile= [deck[0] ]
      setpile(UE_pile);
    }
  }, [deck]);

  // win condition
  useEffect(() => {
    if (deck.length <= 0 && pile.length !== 0)
    {
      console.log("You have won!")
      alert("You have won!")
    }
  }, [cardsInHand, cardsFaceDown, cardsFaceUp]);


  // print statements
  useEffect(() => {
    console.log("pile:", pile);
  }, [pile]);

  useEffect(() => {
    console.log("cardsInHand", cardsInHand);
    console.log("cardsFaceDown", cardsFaceDown);
    console.log("cardsFaceUp", cardsFaceUp);
    console.log("p1:", p1);
    console.log("p2:", p2);
    console.log("p3:", p3);
    console.log("p4:", p4);
    console.log("deck:", deck);
  }, [cardsInHand, cardsFaceDown, cardsFaceUp]);

  // cardsinhand cardClick 
  const cardClick = (index:number) => {
    var tempCards=cardsInHand; // create a copy of cardsInHand to avoid mutating state directly

    console.log("removefromhand:", tempCards[index]);
    var a: string[] = [tempCards[index]];  // replaces topmost in pile
    // console.log("a:", a)
    setpile(a)

    tempCards.splice(index, 1);
  
    const firstValueDeck:string[] = deck.splice(0, 1)[0];
    const pushtohand: string[] = [firstValueDeck[0], firstValueDeck[1]].flat()

    if (index === 0)
    {
      const temp2:any= [ [pushtohand[0], pushtohand[1]], cardsInHand[0], cardsInHand[1] ]
      setcardsInHand(temp2)
    }    
    else if (index === 1) 
    {
      const temp2:any= [cardsInHand[0], [pushtohand[0], pushtohand[1]], cardsInHand[1] ]
      setcardsInHand(temp2)
    }
    else if (index === 2)
    {
      const temp2:any= [cardsInHand[0], cardsInHand[1], [pushtohand[0], pushtohand[1]] ]
      setcardsInHand(temp2)
    }

    // console.log("cardsInHand:", cardsInHand);
    socket.emit("NextTurn", deck, pile, pID)
  }

  // html
  return (
    <>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Rang</title>
      <link rel="stylesheet" href="teenpatti.css" />
      <link rel="stylesheet" href="playing-cards.css" />
      <div className="main-container playingCards">
        <div className="game-container">
          <div className="heading-container">
            <h1>Teen Patti</h1>
          </div>
          <div className="game-table-container">
            <div className="game-table">
              <div className="card-area">
                <ul className="hand remove-margin">
                  {/* <ul> */}
                  {/* {pile && pile.length>0 && pile.map((card, index) => (
                      <li key={index}>
                        <div className={`card rank-${card[0]} ${card[1]}`}>
                          <span className="rank">{card[0]}</span>
                          <span className="suit">{symbols[card[1]]}</span>
                        </div>
                      </li>
                    ))} */}
                  {/* </ul> */}

                  <li>
                    {pile && pile.length > 0 && pile[0] && (
                      <div className={`card rank-${pile[0][0]} ${p1[0][1]}`}>
                        <div>
                          <span className="rank">{pile[0][0]}</span>
                          <span className="suit">{symbols[pile[0][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>

                {/* <div class="card-area-rows output-row-one">
              <div class="card rank-7 spades">
                <span class="rank">7</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div class="card-area-rows output-row-two">
              <div class="card rank-7 spades">
                <span class="rank">7</span>
                <span class="suit">&spades;</span>
              </div>
              <div class="card rank-7 spades">
                <span class="rank">7</span>
                <span class="suit">&spades;</span>
              </div>
            </div>
            <div class="card-area-rows output-row-three">
              <div class="card rank-7 spades">
                <span class="rank">7</span>
                <span class="suit">&spades;</span>
              </div>
            </div> */}
              </div>
              <div className="game-players-container">
                <div className="player-tag player-one">{players_names[0]}</div>
                <ul className="hand remove-margin player-one-cards">
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p1 && p1.length > 0 && p1[3][0]}
                    </span>
                    <span className="suit">
                      {p1 && p1.length > 0 && symbols[p1[3][1]]}
                    </span>
                  </li>
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p1 && p1.length > 0 && p1[4][0]}
                    </span>
                    <span className="suit">
                      {p1 && p1.length > 0 && symbols[p1[4][1]]}
                    </span>
                  </li>
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p1 && p1.length > 0 && p1[5][0]}
                    </span>
                    <span className="suit">
                      {p1 && p1.length > 0 && symbols[p1[5][1]]}
                    </span>
                  </li>

                  <li>
                    {p1 && p1.length > 0 && p1[6] && (
                      <div className={`card rank-${p1[6][0]} ${p1[6][1]}`}>
                        <div>
                          <span className="rank">{p1[6][0]}</span>
                          <span className="suit">{symbols[p1[6][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li>
                    {p1 && p1.length > 0 && p1[7] && (
                      <div className={`card rank-${p1[7][0]} ${p1[7][1]}`}>
                        <div>
                          <span className="rank">{p1[7][0]}</span>
                          <span className="suit">{symbols[p1[7][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li>
                    {p1 && p1.length > 0 && p1[8] && (
                      <div className={`card rank-${p1[8][0]} ${p1[8][1]}`}>
                        <div>
                          <span className="rank">{p1[8][0]}</span>
                          <span className="suit">{symbols[p1[8][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
              <div className="game-players-container">
                <div className="player-tag player-two">{players_names[1]}</div>
                <ul className="hand remove-margin player-two-cards">
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p2 && p2.length > 0 && p2[3][0]}
                    </span>
                    <span className="suit">
                      {p2 && p2.length > 0 && symbols[p2[3][1]]}
                    </span>
                  </li>
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p2 && p2.length > 0 && p2[4][0]}
                    </span>
                    <span className="suit">
                      {p2 && p2.length > 0 && symbols[p2[4][1]]}
                    </span>
                  </li>
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p2 && p2.length > 0 && p2[5][0]}
                    </span>
                    <span className="suit">
                      {p2 && p2.length > 0 && symbols[p2[5][1]]}
                    </span>
                  </li>

                  <li>
                    {p2 && p2.length > 0 && p2[6] && (
                      <div className={`card rank-${p2[6][0]} ${p2[6][1]}`}>
                        <div>
                          <span className="rank">{p2[6][0]}</span>
                          <span className="suit">{symbols[p2[6][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li>
                    {p2 && p2.length > 0 && p2[7] && (
                      <div className={`card rank-${p2[7][0]} ${p2[7][1]}`}>
                        <div>
                          <span className="rank">{p2[7][0]}</span>
                          <span className="suit">{symbols[p2[7][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li>
                    {p2 && p2.length > 0 && p2[8] && (
                      <div className={`card rank-${p2[8][0]} ${p2[8][1]}`}>
                        <div>
                          <span className="rank">{p2[8][0]}</span>
                          <span className="suit">{symbols[p2[8][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
              <div className="game-players-container">
                <div className="player-tag player-three">
                  {players_names[2]}
                </div>
                <ul className="hand remove-margin player-three-cards">
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p3 && p3.length > 0 && p3[3][0]}
                    </span>
                    <span className="suit">
                      {p3 && p3.length > 0 && symbols[p3[3][1]]}
                    </span>
                  </li>
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p3 && p3.length > 0 && p3[4][0]}
                    </span>
                    <span className="suit">
                      {p3 && p3.length > 0 && symbols[p3[4][1]]}
                    </span>
                  </li>
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p3 && p3.length > 0 && p3[5][0]}
                    </span>
                    <span className="suit">
                      {p3 && p3.length > 0 && symbols[p3[5][1]]}
                    </span>
                  </li>

                  <li>
                    {p3 && p3.length > 0 && p3[6] && (
                      <div className={`card rank-${p3[6][0]} ${p3[6][1]}`}>
                        <div>
                          <span className="rank">{p3[6][0]}</span>
                          <span className="suit">{symbols[p3[6][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li>
                    {p3 && p3.length > 0 && p3[7] && (
                      <div className={`card rank-${p3[7][0]} ${p3[7][1]}`}>
                        <div>
                          <span className="rank">{p3[7][0]}</span>
                          <span className="suit">{symbols[p3[7][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li>
                    {p3 && p3.length > 0 && p3[8] && (
                      <div className={`card rank-${p3[8][0]} ${p3[8][1]}`}>
                        <div>
                          <span className="rank">{p3[8][0]}</span>
                          <span className="suit">{symbols[p3[8][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
              <div className="game-players-container">
                <div className="player-tag player-four">{players_names[3]}</div>
                <ul className="hand remove-margin player-four-cards">
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p4 && p4.length > 0 && p4[3][0]}
                    </span>
                    <span className="suit">
                      {p4 && p4.length > 0 && symbols[p4[3][1]]}
                    </span>
                  </li>

                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p4 && p4.length > 0 && p4[4][0]}
                    </span>
                    <span className="suit">
                      {p4 && p4.length > 0 && symbols[p4[4][1]]}
                    </span>
                  </li>
                  <li>
                    <div className="card back">*</div>
                    <span className="rank">
                      {p4 && p4.length > 0 && p4[5][0]}
                    </span>
                    <span className="suit">
                      {p4 && p4.length > 0 && symbols[p4[5][1]]}
                    </span>
                  </li>

                  <li>
                    {p4 && p4.length > 0 && p4[6] && (
                      <div className={`card rank-${p4[6][0]} ${p4[6][1]}`}>
                        <div>
                          <span className="rank">{p4[6][0]}</span>
                          <span className="suit">{symbols[p4[6][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li>
                    {p4 && p4.length > 0 && p4[7] && (
                      <div className={`card rank-${p4[7][0]} ${p4[7][1]}`}>
                        <div>
                          <span className="rank">{p4[7][0]}</span>
                          <span className="suit">{symbols[p4[7][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>

                  <li>
                    {p4 && p4.length > 0 && p4[8] && (
                      <div className={`card rank-${p4[8][0]} ${p4[8][1]}`}>
                        <div>
                          <span className="rank">{p4[8][0]}</span>
                          <span className="suit">{symbols[p4[8][1]]}</span>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="messages-and-cards-container">
          <div className="right-side-container messages-container">
            <h1>Messages</h1>
            <div className="message-box">
              {message.map((message, index) => (
                <div key={index} className="message-content-container">
                  {message}
                </div>
              ))}
            </div>
          </div>

          <div className="right-side-container my-cards-container">
            <h1>My Cards</h1>
            <div className="my-cards-inner-container">
              <ul className="hand remove-margin">
                <li>
                  {cardsInHand && cardsInHand.length > 0 && cardsInHand[0] && (
                    <div
                      className={`card rank-${cardsInHand[0][0]} ${cardsInHand[0][1]}`}
                      onClick={() => deck.length > 0 && cardClick(0)}
                    >
                      <div>
                        <span className="rank">{cardsInHand[0][0]}</span>
                        <span className="suit">
                          {symbols[cardsInHand[0][1]]}
                        </span>
                      </div>
                    </div>
                  )}
                </li>

                <li>
                  {cardsInHand && cardsInHand.length > 0 && cardsInHand[1] && (
                    <div
                      className={`card rank-${cardsInHand[1][0]} ${cardsInHand[1][1]}`}
                      onClick={() => deck.length > 0 && cardClick(1)}
                    >
                      <div>
                        <span className="rank">{cardsInHand[1][0]}</span>
                        <span className="suit">
                          {symbols[cardsInHand[1][1]]}
                        </span>
                      </div>
                    </div>
                  )}
                </li>

                <li>
                  {cardsInHand && cardsInHand.length > 0 && cardsInHand[2] && (
                    <div
                      className={`card rank-${cardsInHand[2][0]} ${cardsInHand[2][1]}`}
                      onClick={() => deck.length > 0 && cardClick(2)}
                    >
                      <div>
                        <span className="rank">{cardsInHand[2][0]}</span>
                        <span className="suit">
                          {symbols[cardsInHand[2][1]]}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
            <div className="my-fixed-cards-container">
              <ul className="hand remove-margin">
                <li>
                  <div className="card back">*</div> {/* deck first */}
                  {/* <span className="rank">{cardsFaceDown && cardsFaceDown.length > 0 && cardsFaceDown[0][0]}</span> */}
                  {/* <span className="suit">{cardsFaceDown && cardsFaceDown.length > 0 && symbols[cardsFaceDown[0][1]]}</span> */}
                </li>
                <li>
                  <div className="card back">*</div> {/* deck second */}
                  {/* <span className="rank">{cardsFaceDown && cardsFaceDown.length > 0 && cardsFaceDown[1][0]}</span> */}
                  {/* <span className="suit">{cardsFaceDown && cardsFaceDown.length > 0 && symbols[cardsFaceDown[1][1]]}</span> */}
                </li>
                <li>
                  <div className="card back">*</div> {/* deck third */}
                  {/* <span className="rank">{cardsFaceDown && cardsFaceDown.length > 0 && cardsFaceDown[2][0]}</span> */}
                  {/* <span className="suit">{cardsFaceDown && cardsFaceDown.length > 0 && symbols[cardsFaceDown[2][1]]}</span> */}
                </li>

                <li>
                  {cardsFaceUp && cardsFaceUp.length > 0 && cardsFaceUp[0] && (
                    <div
                      className={`card rank-${cardsFaceUp[0][0]} ${cardsFaceUp[0][1]}`}
                      onClick={() => console.log("Clicked on card", cardsFaceUp[0])}
                    >
                      <div>
                        <span className="rank">{cardsFaceUp[0][0]}</span>
                        <span className="suit">
                          {symbols[cardsFaceUp[0][1]]}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
                <li>
                  {cardsFaceUp && cardsFaceUp.length > 0 && cardsFaceUp[1] && (
                    <div
                      className={`card rank-${cardsFaceUp[1][0]} ${cardsFaceUp[1][1]}`}
                      onClick={() => console.log("Clicked on card", cardsFaceUp[1])}
                    >
                      <div>
                        <span className="rank">{cardsFaceUp[1][0]}</span>
                        <span className="suit">
                          {symbols[cardsFaceUp[1][1]]}
                        </span>
                      </div>
                    </div>
                  )}
                </li>

                <li>
                  {cardsFaceUp && cardsFaceUp.length > 0 && cardsFaceUp[2] && (
                    <div
                      className={`card rank-${cardsFaceUp[2][0]} ${cardsFaceUp[2][1]}`}
                      onClick={() => console.log("Clicked on card", cardsFaceUp[2])}
                    >
                      <div>
                        <span className="rank">{cardsFaceUp[2][0]}</span>
                        <span className="suit">
                          {symbols[cardsFaceUp[2][1]]}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
