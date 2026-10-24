import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Nosotros = () => {
  return (
    <Container className="py-5" style={{ minHeight: '80vh', color: '#fff' }}>
      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8} className="text-center">
          <h2 style={{ color: '#ff6500', fontWeight: 'bold' }}>¿Quiénes Somos?</h2>
          <hr style={{ borderColor: '#ff6500', borderWidth: '2px' }} />
          <p className="lead mt-4">
            <strong>El Bajón del Gorila</strong> nació con una misión clara: calmar el hambre feroz de las noches santiaguinas con comida rápida, abundante y de calidad.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={4} className="mb-4">
          <Card style={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }} className="h-100 shadow">
            <Card.Body className="text-center">
              <h4 style={{ color: '#ffc400' }}>Nuestra Historia</h4>
              <Card.Text>
                Comenzamos como un pequeño carrito y, gracias a la preferencia de nuestros clientes más noctámbulos, hoy somos el punto de encuentro por excelencia para el bajón.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card style={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }} className="h-100 shadow">
            <Card.Body className="text-center">
              <h4 style={{ color: '#ffc400' }}>Calidad Bestial</h4>
              <Card.Text>
                Ingredientes frescos, porciones tamaño gorila y salsas caseras que marcan la diferencia. No escatimamos a la hora de armar tu hamburguesa o tus papas.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card style={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }} className="h-100 shadow">
            <Card.Body className="text-center">
              <h4 style={{ color: '#ffc400' }}>El Equipo</h4>
              <Card.Text>
                Somos un equipo apasionado por la comida callejera. Trabajamos a toda máquina para que tu pedido llegue caliente, rápido y listo para devorar.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Nosotros;