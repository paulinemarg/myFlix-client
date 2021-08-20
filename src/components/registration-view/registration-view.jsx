import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import './registration-view.scss';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  let history = useHistory();

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
        alert('Registration successfull! Please Login.');
        window.open('/', '_self');
      })
      .catch((e) => {
        alert("The user is already registered.")
        console.log('error registering the user')
      });
  };

  function handleClick() {
    history.push("/");
  }

  return (
    <Form className="Signin justify-content-md-center">
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control placeholder="Enter Username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control placeholder="Enter email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Form.Text className="text-white">We'll never share your email with anyone else</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control placeholder="Enter Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicBirthday">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control placeholder="YYYY-MM-DD" type="birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
        <Form.Text className="text-white">We'll never share your Birthday with anyone else</Form.Text>
      </Form.Group>
      <Button className="signinBtn" variant="light" type="submit" onClick={handleSubmit}>Register</Button>
      <br></br>
      <p className="have-account">Already have an account?</p>
      <Button className="loginBtn" variant="light" type="submit" onClick={handleClick}>Log in</Button>
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
};