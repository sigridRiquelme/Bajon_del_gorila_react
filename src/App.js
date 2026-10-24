import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Login from './components/Login';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Container className="pt-5">
        <Row>
          <Col>
            <h1 className="text-center mb-5" style={{ color: '#ff6500' }}>El Bajón del Gorila</h1>
            <Login />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;