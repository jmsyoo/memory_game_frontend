import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import useLocalStorage from '../components/hooks/useLocalStorage';
import { PlayProvider } from '../components/contexts/PlayProvider';
import Login from '../components/Login';
import Game from '../components/Game';
import '../styles/styles.scss';

const URL = {
  dev: "http://localhost:3000/",
  production: "https://jae-memory-game-api.herokuapp.com/"
}

function App() {
  const [ userId, setUserId ] = useLocalStorage('id')

  const game = (
    <PlayProvider URL={URL} userId={userId}>
      <Game setUserId={setUserId} userId={userId}/>
    </PlayProvider>
  )


  // Testing user id state
  useEffect(() => {
    if(userId){
      console.log('user id:', userId)
    }   
  },[userId])

  return (
    <div className="App">
      <Container fluid="sm" className="container">
        { userId ? game : <Login URL={URL} setUserId={setUserId}/>}
      </Container>
    </div>
  );
}

export default App;
