import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

import './registration-view.scss';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://backend-myflix.herokuapp.com/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    })
      .then(response => {
        const data = response.data;
        console.log(data);
        window.open('/', '_self');
      })
      .catch(e => {
        console.log('error registering the user')
      });
  };

  return (
    <Form className="Signin">
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control placeholder="Enter Username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control placeholder="Enter email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Form.Text className="text-muted">We'll never share your email with anyone else</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control placeholder="Enter Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicBirthday">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control placeholder="YYYY-MM-DD" type="birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
        <Form.Text className="text-muted">We'll never share your Birthday with anyone else</Form.Text>
      </Form.Group>
      <Button className="signinBtn" variant="dark" type="submit" onClick={handleSubmit}>Sign in</Button>
      <br></br>
      <p>
        Already have an account?
      </p>
      <Button className="loginBtn" variant="light" type="submit" onClick={props.goToLogin}>Log in</Button>
    </Form>
  );
}

RegistrationView.propTypes = {
  register: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.date
  }),
  onRegister: PropTypes.func.isRequired,
};