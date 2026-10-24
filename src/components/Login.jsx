import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

    if (!correo || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (!regexCorreo.test(correo)) {
      setError('El correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com');
      return;
    }
    if (password.length < 4 || password.length > 10) {
      setError('La contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }

    setError('');
    setSuccess(true);
    localStorage.setItem('usuarioLogueado', correo);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card style={{ backgroundColor: '#1E1E1E', color: '#FFF', borderRadius: '15px' }} className="p-4 shadow-lg border-0">
            <h3 className="text-center mb-4" style={{ color: '#ff6500', fontWeight: 'bold' }}>Iniciar Sesión</h3>
            
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && <Alert variant="success" className="text-center">¡Acceso exitoso! Redirigiendo...</Alert>}
            
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-4" controlId="formCorreo">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="usuario@duoc.cl" 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                />
              </Form.Group>

              <Form.Group className="mb-5" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="********" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                />
              </Form.Group>

              <Button type="submit" className="w-100 fw-bold py-2" style={{ backgroundColor: '#ff6500', border: 'none', fontSize: '1.1rem' }}>
                Ingresar
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;