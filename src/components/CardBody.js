import React from 'react'
import { Image } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardMedia, Grid, Typography, Paper } from '@material-ui/core';

const CardBody = ({cards, handleFlip, life, isEvaluating}) => {
const useStyles = makeStyles((theme) => ({
  Grid: {
    //backgroundColor: "#f5f5f5",
    //backgroundColor: "lightyellow",
    height: "100%",
    width: "100%",
    // margin: "6px 6px 0px 6px",
    // marginBottom: 10
  },
  gridItem: {
    //backgroundColor: "#6c757d",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // padding: 30
  },
  card: {
    backgroundColor: "white",
    height: "85%",
    width: "85%",
    // borderRadius: 0,
  },
  back: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    pointerEvents: life === 0 || isEvaluating ? "none" : "",
  },
  front: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
                      // variant="outlined"
                      // square
                    >
                      {!ele.isFlipped ? (
                        <div 
                          className={classes.back}
                          id={ele.id}
                          style={{ cursor: "pointer", backgroundPosition: 'center' }}
                          onClick={(e) => handleFlip(e, ele.value, ele.score)}
                        >
                          <img src={ele.cardBack} style={{maxWidth: "80px"}}/>
                        </div>
                      ) : (
                        <div className={classes.front}>
                          <Typography
                            className={classes.cardValue}
                            variant="h3"
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