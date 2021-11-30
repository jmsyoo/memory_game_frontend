import React from 'react';
import { Container } from 'react-bootstrap';
import Login from '../components/Login';
import '../styles/styles.scss';

function App() {
  return (
    <div className="App">
      <Container fluid="md">
        <Login/>
      </Container>
    </div>
  );
}

export default App;
