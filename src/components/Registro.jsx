import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Registro = () => {
  // Estados para los campos
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  
  // Estados para errores y éxito
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegistro = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre || nombre.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    const regexCorreo = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    if (!regexCorreo.test(correo)) {
      setError('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
      return;
    }

    if (password.length < 4 || password.length > 10) {
      setError('La contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const regexTel = /^[0-9+ ]{8,12}$/;
    if (!regexTel.test(telefono)) {
      setError('Formato de teléfono inválido (ej: +56912345678).');
      return;
    }

    // Si pasa todas las validaciones
    setError('');
    setSuccess(true);
    localStorage.setItem("usuarioRegistrado", correo);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card style={{ backgroundColor: '#1E1E1E', color: '#FFF', borderRadius: '15px' }} className="p-4 shadow-lg border-0">
            <h3 className="text-center mb-4" style={{ color: '#ff6500', fontWeight: 'bold' }}>Únete al Bajón</h3>
            
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && <Alert variant="success" className="text-center">¡Registro exitoso! Redirigiendo...</Alert>}
            
            <Form onSubmit={handleRegistro}>
              <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ej: Diego Atue" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCorreo">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="usuario@duoc.cl" 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="4 a 10 caracteres" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Repite tu clave" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4" controlId="formTelefono">
                <Form.Label>Teléfono de Contacto</Form.Label>
                <Form.Control 
                  type="tel" 
                  placeholder="+56 9 1234 5678" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                />
              </Form.Group>

              <Button type="submit" className="w-100 fw-bold py-2" style={{ backgroundColor: '#ff6500', border: 'none', fontSize: '1.1rem' }}>
                REGISTRARME
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;