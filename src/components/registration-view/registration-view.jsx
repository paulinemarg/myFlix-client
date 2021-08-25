import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Navbar, Container } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import logo from '../../../public/logo.jpg';
import './registration-view.scss';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthyear, setBirthyear] = useState('');
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [errorResponse, setErrorResponse] = useState('');

  let history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    axios.post('https://backend-myflix.herokuapp.com/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthyear: birthyear,
    })
      .then(response => {
        const data = response.data;
        console.log(data);
        alert('Registration successfull! Please Login.');
        window.open('/', '_self');
      })
      .catch((event) => {
        console.log('error');
        console.log(event.response);
        console.log(event.response.request.response);
        setErrorStatus(event.response.request.status);
        setErrorMessage(event.response.request.statusText);
        setErrorResponse(event.response.request.response);

      });
    setValidated(true);
  };
  function handleClick() {
    history.push("/");
  }

  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand href="#home">
            <img src={logo} className="logo justify-content-center-md-center" />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Form noValidate validated={validated} className="Signin justify-content-md-center">
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder="Enter Username" type="text" value={username} onChange={e => setUsername(e.target.value)} minLength="5" pattern="[a-zA-Z0-9]+" required />
          <Form.Control.Feedback>Perfect!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Invalid Username.(minimum length = 5)</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control placeholder="Enter email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Form.Control.Feedback>Perfect!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Invalid Email.</Form.Control.Feedback>
          <Form.Text className="text-white">We'll never share your email with anyone else</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control placeholder="Enter Password" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength="5" required />
          <Form.Control.Feedback>Perfect!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Invalid Password.(minimum length = 5)</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicBirthday">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control placeholder="YYYY-MM-DD" type="birthday" value={birthyear} onChange={e => setBirthyear(e.target.value)} />
          <Form.Text className="text-white">We'll never share your Birthday with anyone else</Form.Text>
        </Form.Group>
        <Button className="signinBtn" variant="outline-light" type="submit" onClick={handleSubmit}>Register</Button>
        <br></br>
        <p className="have-account">Already have an account?</p>
        <Button className="loginBtn" variant="outline-light" type="submit" onClick={handleClick}>Log in</Button>
      </Form>
    </>
  );
}

RegistrationView.propTypes = {
  register: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthyear: PropTypes.date
  }),
};