import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [errores, setErrores] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Limpia el error del campo que se está editando
    setErrores({ ...errores, [id]: '' });
  };

  const handleContacto = (e) => {
    e.preventDefault();
    let nuevosErrores = {};

    // Validar Nombre
    if (!formData.nombre || formData.nombre.length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    // Validar Correo 
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    if (!regexCorreo.test(formData.correo)) {
      nuevosErrores.correo = 'Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).';
    }

    // Validar Teléfono 
    if (formData.telefono) {
      const regexTel = /^[0-9+ ]{8,12}$/;
      if (!regexTel.test(formData.telefono)) {
        nuevosErrores.telefono = 'Formato inválido (ej: +56912345678).';
      }
    }

    // Validar Asunto
    if (!formData.asunto) {
      nuevosErrores.asunto = 'Debes seleccionar un motivo de contacto.';
    }

    // Validar Mensaje
    if (!formData.mensaje || formData.mensaje.length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setSuccess(false);
    } else {
      setErrores({});
      setSuccess(true);
      setFormData({ nombre: '', correo: '', telefono: '', asunto: '', mensaje: '' });
      
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card style={{ backgroundColor: '#1E1E1E', color: '#FFF', borderRadius: '15px' }} className="p-4 shadow-lg border-0">
            <h3 className="text-center mb-4" style={{ color: '#ff6500', fontWeight: 'bold' }}>Contacto</h3>
            
            {success && <Alert variant="success">¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</Alert>}

            <Form onSubmit={handleContacto}>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control 
                  type="text" 
                  value={formData.nombre} onChange={handleChange}
                  isInvalid={!!errores.nombre}
                  style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="correo">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={formData.correo} onChange={handleChange}
                      isInvalid={!!errores.correo}
                      style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                    />
                    <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="telefono">
                    <Form.Label>Teléfono (Opcional)</Form.Label>
                    <Form.Control 
                      type="tel" 
                      value={formData.telefono} onChange={handleChange}
                      isInvalid={!!errores.telefono}
                      style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                    />
                    <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="asunto">
                <Form.Label>Motivo de Contacto</Form.Label>
                <Form.Select 
                  value={formData.asunto} onChange={handleChange}
                  isInvalid={!!errores.asunto}
                  style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="pedido">Consulta sobre un pedido activo</option>
                  <option value="sugerencia">Felicitaciones o sugerencias</option>
                  <option value="reclamo">Problema con mi pedido</option>
                  <option value="eventos">Eventos / Pedidos masivos</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.asunto}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="mensaje">
                <Form.Label>Tu Mensaje</Form.Label>
                <Form.Control 
                  as="textarea" rows={4} 
                  value={formData.mensaje} onChange={handleChange}
                  isInvalid={!!errores.mensaje}
                  style={{ backgroundColor: '#2C2C2C', color: 'white', border: '1px solid #444' }}
                />
                <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" className="w-100 fw-bold py-2" style={{ backgroundColor: '#ff6500', border: 'none' }}>
                ENVIAR MENSAJE
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacto;

