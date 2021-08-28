import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Form, Button, Container, Col, Row, Image } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

import logo from '../../../public/logo.jpg';
import './login-view.scss';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { handleRegister } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://backend-myflix.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        alert('Invalid username or password');
      });
  };

  return (
    <>
      <Container>
        <Col xs={12} md={8} lg={6} className="d-flex mx-auto">
          <Row className="d-flex mx-auto mt-5 justify-content-center">
            <h3 className="text-center mt-5 text-light">Welcome to</h3>
            <Image className="logo mr-4" src={logo} />
            <h4 className="text-center mt-5 text-light">Please login</h4>
            <Form className="Login">
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control placeholder="Username" type="text" onChange={e => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Button className="loginBtn" variant="outline-light" type="submit" onClick={handleSubmit}>Log In</Button>
              <p className="account">Don't have an acount?</p>
              <Button className="RegisterBtn" variant="outline-light" type="submit" onClick={handleRegister}>Register</Button>
            </Form>
          </Row>
        </Col>
      </Container>
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({
  handleSubmit: (username, password) => dispatch(handleSubmit(username, password))
});

export default connect(null, mapDispatchToProps)(LoginView);

LoginView.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired
  }),
  onLoggedIn: PropTypes.func.isRequired,
};