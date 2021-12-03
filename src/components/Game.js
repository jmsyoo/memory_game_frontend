import React, { useState, useEffect, useMemo } from 'react'
import { Button, Row, Col, ProgressBar } from 'react-bootstrap'
import { usePlay } from './contexts/PlayProvider';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper } from '@material-ui/core';
import CardBody from '../components/CardBody'

const Game = ({ setUserId, userId }) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    Grid:{
        // backgroundColor: "lightyellow",
        height: 200,
        width: "100%"
    },
    paper:{
      height: "100%",
      width: "100%",
      display:"flex",
      justifyContent:"center",
      alignItems: "center",
      // padding: 5
    },
    Typography:{
        fontSize: 20,
        textAlign: "center"
    },
    score:{
      fontSize: 30,
      textAlign: "center"
    },
    gameButton:{
        width: "100%",
        height: "100%",
        fontSize: 30        
    },
    startButton:{
        width: 150,
        height: 150,
        borderRadius: "50%",
        fontSize: 32
    },
    message: {
      color: "red",
      fontSize: 18
    },
    life:{
      width: "100%",
      height: "100%",
      fontSize: 30
    }
}));

    const classes = useStyles();
    const { handleGameStart, handleCardFlip, handleGameReset, matchedCards ,state, userRecord, openCards } = usePlay()
    const [cards, setCards] = useState([])
    const [isScoreUpdated, setIsScoreUpdated] = useState(false)

    // Log out
    const handleLogout = () => {
        setUserId(null)
    }

    const calculateTotalScore = (data) => {
      return data.reduce((acc, item, index) => {
        return acc + item.score/2
      },0)
    }
    const totalCardMatch = () => {
      return userRecord.cards.length
    }

    useEffect(() => {
        if(state.cards.length > 0){
            setCards(setChunkArray(state.cards, 4))
        }
    },[state.cards])


    const getScore = useMemo(() => {
      if(matchedCards.length > 0){
        setIsScoreUpdated(true)
        return calculateTotalScore(matchedCards)
      }
      return 0
    },[matchedCards])

    const lifeBar = () => {
      return(
        <ProgressBar variant="success" className={classes.life} now={100} label={`${100}`} />
      )    
    }

    useEffect(() => {
      if(isScoreUpdated){
        const timer = setTimeout(() => {
          setIsScoreUpdated(false)
        },500)
        return () => clearTimeout(timer)
      }
    },[isScoreUpdated])


    return (
      <div className="Game">
        <Row className="Game__Top">
          <Col lg={4} md={4} sm={4} xs={4} className="Game__Top__Col">
            <Paper
              elevation={1}
              square
              className={classes.paper}
              //variant="outlined"
            >
              <Typography className={classes.Typography}>
                {`${userId} is `}
                <strong className={classes.message}>
                  {userRecord.score ? "returned users" : "new user"}
                </strong>
              </Typography>
            </Paper>
          </Col>
          <Col lg={4} md={4} sm={4} xs={4} className="Game__Top__Col">
            <Paper
              elevation={1}
              square
              className={classes.paper}
              outlined="true"
              style={{backgroundColor: isScoreUpdated ? 'red' : ''}}
            >
              <Typography className={classes.score}>{getScore}</Typography>
            </Paper>
          </Col>
          <Col lg={4} md={4} sm={4} xs={4} className="Game__Top__Col">
              {lifeBar()}
          </Col>
        </Row>

        <Row className="Game__Body">
          <Col className="Game__Body__Col" lg={12} md={12} sm={12} xs={12}>
              <div className="Game__Body__Col__InnerDiv">
                {!state.isGameStarted ? (
                  <Button
                    variant="success"
                    className={classes.startButton}
                    onClick={handleGameStart}
                  >
                    START
                  </Button>
                ) : (
                  <div className="Game__Body_Col__InnerDiv__CardDiv">
                    <CardBody cards={cards} handleCardFlip={handleCardFlip} openCards={openCards} />
                  </div>
                )}
              </div>
          </Col>
        </Row>

        <Row className="Game__Bottom">
          <Col lg={4} md={4} sm={4} xs={4} className="Game__Bottom__Col">
            <Button
              variant="warning"
              disabled={state.isGameStarted ? false : true}
              onClick={handleGameReset}
              className={classes.gameButton}
            >
              RESET
            </Button>
          </Col>
          <Col lg={4} md={4} sm={4} xs={4} className="Game__Bottom__Col">
            <Paper
              elevation={1}
              square
              className={classes.paper}
              outlined="true"
            >
              <ul>
                {/* {userRecord.score ?
                <>
                <li>{userId} <strong className={classes.message}>is returned user.</strong></li> */}
                {Object.keys(userRecord).map((item, index) => {
                  return (
                    <li key={index}>
                      {item === "cards"
                        ? `${item} : ${totalCardMatch()}`
                        : `${item} : ${userRecord[item] ? userRecord[item] : 0}`}
                    </li>
                  );
                })}
                {/* </> */}
                {/* : <li>{userId} <strong className={classes.message}>is new user.</strong></li>} */}
              </ul>
            </Paper>
          </Col>
          <Col lg={4} md={4} sm={4} xs={4} className="Game__Bottom__Col">
            <Button
              variant="primary"
              type="button"
              className={classes.gameButton}
              onClick={handleLogout}
            >
              LOG OUT
            </Button>
          </Col>
        </Row>
      </div>
    );
}

export default Game;

function setChunkArray(data, num){
    let index = 0
        let array = []
        while(index < data.length){
            array.push(data.slice(index, index + num))
            index += num
        }
    return array
}