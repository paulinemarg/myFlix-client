import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Form, Button, Row } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import axios from 'axios';

import './login-view.scss';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let history = useHistory();

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
        console.log('Invalid username or password');
      });
  };

  function handleClick() {
    history.push("/register");
  }

  return (
    <>
      <Form className="Login">
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder="Username" type="text" onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button className="loginBtn" variant="light" type="submit" onClick={handleSubmit}>Log In</Button>
        <br></br>
        Don't have an acount?
        <br></br>
        <Button className="RegisterBtn" variant="light" type="submit" onClick={handleClick}>Register</Button>
      </Form>
    </>
  );
}

LoginView.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired
  }),
  onLoggedIn: PropTypes.func.isRequired,
};