import React, { useState, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'

const PlayContext = React.createContext()
const CARDIMAGE = "https://i.pinimg.com/564x/7e/fd/35/7efd3590ee35ebeb47ad80649879100c.jpg"


export function usePlay(){
    return useContext(PlayContext)
}

// Card Class
class card {
  constructor(id, value) {
    this.id = id;
    this.value = value + 1;
    this.isFlipped = false;
    this.cardBack = CARDIMAGE;
    this.score = 100;
  }
  shuffle(array) {
    const data = array.sort(() => 0.5 - Math.random())
    return data
  }
  setChunkArray(data, num) {
    let index = 0;
    let array = [];
    while (index < data.length) {
      array.push(data.slice(index, index + num));
      index += num;
    }
    return array;
  }
}

export function PlayProvider({ URL, userId, children }){

    const getUesrId = useMemo(() => { // Check when a user id is changed. To reduce number of rendering.
        return userId.split('%%')
    },[userId])
    const USER_COLUMN_KEY = ['id','score','cards'] // To filter columns from fetched user data.

    // 1. User Records
    const [userRecord, setUserRecords] = useState({})
    // 2. Card Deck
    const [state, setState] = useState({
        isGameStarted: false,
        life: null,
        cards:[],
        isGameEnded: false,
        isMatchedAllCards: false
    })
    // 3. Opened cards array state
    const [openCards, setOpenCards] = useState([])
    // 4. matched cards array state
    const [matchedCards, setMatchedCards] = useState([])
    // 5. Lock card flip during evaluation.
    const [isEvaluating, setIsEvaluating] = useState(false)


    /// Requesting call API ///
    // to show record for returned users.
    useEffect(() => {
        (async() => {
            const response = await axios.get(`${URL.production}users/${getUesrId[0]}`).then((result) => {
                console.log(result.data)
                if(!result.data) return
                
                const tempObj = {}
                for(let key in result.data){
                    if(USER_COLUMN_KEY.includes(key)){ // Check if column keys avilable
                        if(key == "cards"){
                            tempObj[key] = result.data[key].length
                        }else if(key == "score"){
                            tempObj[key] = result.data.cards.reduce((acc, item, index) => {
                                return acc + item.score
                            },0)
                        }
                        else{
                            tempObj[key] = result.data[key] // add to obj if it does
                        }
                        
                    }
                }
                setUserRecords(tempObj) // assign filtered user data obj to user records state
            })
        })() // IFFE function to fetch user's record from server when user id is updated.
    },[getUesrId])

    const saveMatchingCardToDb = async (value) => {
        try{
            const response = await axios.post(`${URL.production}cards`,{
                ...value
            }).then((result) => {
                console.log('posting matching card result: ',result.data)
                // Update record state
                setUserRecords((prv) => {
                    return{
                        ...prv,
                        score: userRecord.score + result.data.score,
                        cards: userRecord.cards + 1
                    }
                })
            })
        }catch(error){
            console.error(error)
        }
    }
    /// Requesting call API///

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
        // Update card isFlipped.
        const tempObj = {}
        tempObj["id"] = cardId
        tempObj["value"] = value
        tempObj["score"] = score
        setOpenCards([...openCards, tempObj]) // store opened card value to OpenCards array state
    }
    // Check if opened cards have matching value
    const checkCardsMatching = (id, cb) => {
        const [firstCard, secondCard] = openCards
        setIsEvaluating(true) // set evaluating to true so user can't flip the third card during the evaluation.
        if(firstCard.value === secondCard.value){ // if opened two cards' values are same add them to matched card array state.
            
            // Send data to db
            const value = {
                itemvalue: firstCard.value,
                flipped: 1, // true
                score: firstCard.score,
                user_id: id
            }
            saveMatchingCardToDb(value) // Saving data to db.
            cb() // callback for preventing card flipping during the evaluation.
            return setMatchedCards(matchedCards.concat(openCards))  // concat them and store it matched state. 
        }else{ // otherwise find cards list with opened cards' matching values and set their isFlipped values back to false.
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
            }, 700) 
            // Save new data after one second.

            cb()// callback for preventing card flipping during the evaluation
            return () => setTimeout(timer)
        }
    }
    //  Reset Game
    const handleGameReset = () => {     
        // Reset state
        setState(() => {
            return {
                isGameStarted: false,
                cards:[],
                life: 0,
                isGameEnded:false
            }
        })  
        setOpenCards([]) // Reset open card state with empty array
    }
    // Update game status
    const updateGameStatus = (status) => {
        return setState((prv) => {
            return{
                ...prv,
                isGameEnded: status
            }
        })
    }
    
    // useEffect to track open cards array state
    useEffect(() => {
      if (openCards.length === 2) {
        // Function check if opened cards' values are matching
        checkCardsMatching(getUesrId[1], () => {
            const timer = setTimeout(() => { // isEvaluating set to default after 1 sec which enables user to flip cards.
                setIsEvaluating(false)
            },1000)
            return () => clearTimeout(timer)
        }) 
        setOpenCards([]) // reset open card state to empty array
      }
    }, [openCards]);

    const value = {
        userRecord,
        handleGameStart, // game start fucntion
        handleCardFlip, // function to update card status value when card is flipped
        handleGameReset, // reset game funciton
        resetOpenCards: () => setOpenCards([]),
        resetMatchedCards: () => setMatchedCards([]),
        updateGameStatus,
        state, // game state
        openCards, // open cards array
        matchedCards, // matched cards array
        isEvaluating
    }

    return(
        <PlayContext.Provider value={value}>
            {children}
        </PlayContext.Provider>
    )
}