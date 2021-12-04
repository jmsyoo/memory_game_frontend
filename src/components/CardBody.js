import React from 'react'
import { Image } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardMedia, Grid, Typography, Paper } from '@material-ui/core';
import imgs from '../components/temp/Imgs'

const CardBody = ({cards, handleFlip, life, isEvaluating}) => {
const useStyles = makeStyles((theme) => ({
  Grid: {
    height: "100%",
    width: "100%",
  },
  gridItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    height: "85%",
    width: "85%",
    borderRadius: 10
  },
  back: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    pointerEvents: life === 0 || isEvaluating ? "none" : "",
  },
  front: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    pointerEvents: life === 0 || isEvaluating ? "none" : "",
  },
  backImage: {
    // maxHeight: 150
  },
  cardValue: {
    fontSize: 50,
  },
}));
const classes = useStyles();
    return (
      <>
        {cards.map((item, index) => {
          return (
            <Grid container spacing={2} key={index} className={classes.Grid}>
              {item.map((ele, i) => {
                return (
                  <Grid item key={i} lg={3} md={3} sm={3} xs={3} className={classes.gridItem}>
                    <Paper
                      elevation={2}
                      className={classes.card}
                    >
                      {!ele.isFlipped ? (
                        <div 
                          className={classes.back}
                          id={ele.id}
                          style={{ backgroundImage:`url(${ele.cardBack})`,  cursor: "pointer", backgroundPosition: 'center', backgroundRepeat:'no-repeat', backgroundSize:"60px" }}
                          onClick={(e) => handleFlip(e, ele.value, ele.score)}
                        >
                        </div>
                      ) : (
                        <div className={classes.front}
                          style={{ backgroundImage:`url(${imgs[ele.value]})`,  cursor: "pointer", backgroundPosition: 'center', backgroundRepeat:'no-repeat', backgroundSize: "cover" }}
                        >
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