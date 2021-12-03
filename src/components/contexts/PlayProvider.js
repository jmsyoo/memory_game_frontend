import React, { useState, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'

const PlayContext = React.createContext()
const CARDIMAGE = "https://i.pinimg.com/564x/7e/fd/35/7efd3590ee35ebeb47ad80649879100c.jpg"

export function usePlay(){
    return useContext(PlayContext)
}

// Card Class
class card {
    constructor(id, value){
        this.id = id
        this.value = value + 1
        this.isFlipped = false
        this.cardBack = CARDIMAGE
        this.score = 100
    }
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
    }
    setChunkArray(data, num) {
        let index = 0
        let array = []
        while(index < data.length){
            array.push(data.slice(index, index + num))
            index += num
        }
        return array
    }
}

export function PlayProvider({ URL, userId, children }){

    const getUesrId = useMemo(() => { // Check when a user id is changed. To reduce number of rendering.
        return userId
    },[userId])
    const USER_COLUMN_KEY = ['score','cards'] // To filter colums from fetched user data.

    // to show record for returned users.
    useEffect(() => {
        (async() => {
            const response = await axios.get(`${URL.production}users/${getUesrId}`).then((result) => {
                if(!result.data) return
                
                const tempObj = {}
                for(let key in result.data){
                    if(USER_COLUMN_KEY.includes(key)){ // Check if column keys avilable
                        tempObj[key] = result.data[key] // add to obj if it does
                    }
                }
                setUerRecords(tempObj) // assign filtered user data obj to user records state
            })
        })() // IFFE functino to fetch user's record from server when user id is updated.
    },[getUesrId])

    // 1. User Records
    const [userRecord, setUerRecords] = useState({})
    // 2. Card Deck
    const [state, setState] = useState({
        isGameStarted: false,
        life: null,
        cards:[]
    })
    // 3. Opened cards array state
    const [openCards, setOpenCards] = useState([])
    // 4. matched cards array state
    const [matchedCards, setMatchedCards] = useState([])

    // Make card function
    const makeCards = (cb) => {
        let counter = 0

        const cardArray = [...Array(6).keys()].reduce((acc, item, index) => {
            const cardObj = new card(counter, item) // Create new card instance
            counter ++
            const cardObj2 = new card(counter, item)
            counter ++
            return acc.concat([cardObj, cardObj2]) // concat and return array
        },[])
        return cb(cardArray) // shuffle Callback
    }
    // Start game function
    const handleGameStart = () => {
        const cardMethod = new card()
        const newCards = makeCards(cardMethod.shuffle)
        setState((prv) => {
            return{
                ...prv,
                isGameStarted: true,
                cards: newCards,
                life: 100
            }
        })
    }
    // updating card status callback function when it's flipped.
    const updateState = (data, cardId, status, cb) => {
      const updatedData = data.map((item) => {
        if (item.id == cardId) {
          return { ...item, isFlipped: status };
        }
        return item;
      });
      return cb(updatedData)
    };
    // Card flip function
    const handleCardFlip = (event, value, score) => {
        const cardId = event.target.id // unique card Id

        if(!cardId) return // check if card id is available.

        const flipped = true
        updateState(state.cards, cardId, flipped, (data) => {
            setState((prv) => {
                return{
                    ...prv,
                    cards: data
                }
            })
        })
        // Update card isFlipped. Fix this later.
        const tempObj = {}
        tempObj["id"] = cardId
        tempObj["value"] = value
        tempObj["score"] = score
        setOpenCards([...openCards, tempObj]) // store opened card value to OpenCards array state
    }
    // Check if opened cards have matching value
    const checkCardsMatching = () => {

        const [firstCard, secondCard] = openCards

        if(firstCard.value === secondCard.value){ // if opened two cards' values are same
            return setMatchedCards(matchedCards.concat(openCards))  // concat them and store it matched state. 
        }else{ // otherwise find cards list with matching values and set their isFlipped back to false
            const data = state.cards.map((item) => {
                if(item.value == firstCard.value || item.value == secondCard.value){
                    return {...item, isFlipped: false}
                }
                return item
            })
            const timer = setTimeout(() => {
                setState((prv) => {
                    return {
                        ...prv,
                        cards: data,
                        life: state.life -10
                    }
                })                
            }, 500) // Save new data after one second.
            return () => setTimeout(timer)
        }
    }

    // Check if user have every matched cards in matched array.
    const CheckComplete = () => {
        return matchedCards.length === state.cards.length / 2 && alert('You won.')
    }
    //  Reset Game
    const handleGameReset = () => {     
        // Reset state
        setState(() => {
            return {
                isGameStarted: false,
                cards:[],
                life: 0
            }
        })  
        setOpenCards([]) // Reset open card state with empty array
        setMatchedCards([]) // Reset matched card state with empty array
    }
    
    useEffect(() => {
      if (openCards.length === 2) {
        checkCardsMatching() // Function check if opened cards' values are matching
        setOpenCards([]) // reset open card state to empty array
      }
    }, [openCards]);

    const value = {
        userRecord,
        handleGameStart, // game start fucntion
        handleCardFlip, // function to update card status value when card is flipped
        handleGameReset, // reset game funciton
        state, // game state
        openCards, // open cards array
        matchedCards
    }

    return(
        <PlayContext.Provider value={value}>
            {children}
        </PlayContext.Provider>
    )
}