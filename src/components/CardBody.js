import React from 'react'
import { Image } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardMedia, Grid, Typography, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    Grid:{
        backgroundColor: "#f5f5f5",
        height: "100%",
        width: "100%",
        // margin: "6px 6px 0px 6px",
        // marginBottom: 10
    },
    card:{
      backgroundColor: "white",
      height: "100%",
      borderRadius: 0,
    },
    back: {
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
      // maxWidth: "100%",
      // maxHeight: "100%",
      // display: "block"
      // height: 0,
      // width: '100%',
      // paddingTop: '56.25%', // 16:9
      // cursor: "pointer"
    },
    front:{
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    backImage:{
      // maxHeight: 150
    },
    cardValue:{
      fontSize: 30
    }
  }));

const CardBody = ({cards, handleCardFlip, openCards}) => {
  const classes = useStyles();

  const handleFlip = (e, value, score) => {
    // console.log('open Cards: ', openCards)
    openCards.length < 2 && handleCardFlip(e, value, score) // prevent user open card before previous two cards are back to closed.
  }
    return (
      <>
        {cards.map((item, index) => {
          return (
            <Grid container spacing={2} key={index} className={classes.Grid}>
              {item.map((ele, i) => {
                return (
                  <Grid item key={i} lg={3} md={3} sm={3} xs={3}>
                    <Paper
                      elevation={2}
                      className={classes.card}
                      // variant="outlined"
                      // square
                    >
                      {!ele.isFlipped ? (
                        // <CardMedia
                        //   id={ele.id}
                        //   className={classes.cardBack}
                        //   image={ele.cardBack}
                        //   onClick={(e) => handleCardFlip(e)}
                        // />
                        // <img id={ele.id} src={ele.cardBack} className={classes.back}
                        // onClick={(e) => handleCardFlip(e)}/>
                        <div className={classes.back}>
                          <Typography
                            id={ele.id}
                            className={classes.cardValue}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => handleFlip(e, ele.value, ele.score)}
                            variant="h5"
                          >
                            Back
                          </Typography>
                        </div>
                      ) : (
                        <div className={classes.front}>
                          <Typography
                            className={classes.cardValue}
                            variant="h5"
                          >
                            {ele.value}
                          </Typography>
                        </div>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          );
        })}
      </>
    );
}

export default CardBody