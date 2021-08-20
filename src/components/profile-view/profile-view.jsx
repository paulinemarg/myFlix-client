import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Row, Col, Form, Button, Card, FloatingLabel, Accordion } from 'react-bootstrap';

import './profile-view.scss'

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      Username: null,
      Password: null,
      Email: null,
      Birthday: null,
      FavoriteMovies: [],
      validated: null,
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
      this.getFavorites(accessToken);
    }
  }

  //Get Fav movies
  getFavorites(token) {
    const username = localStorage.getItem('user');
    const FavoriteMovies = this.state;

    axios.get(`https:backend-myflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          FavoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Gets user
  getUser(token) {
    const username = localStorage.getItem('user');
    axios.get(`https:backend-myflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
          FavoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleUpdate(e) {
    e.preventDefault();
    this.setState({
      validated: null,
    });

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        validated: true,
      });
      return;
    }

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("user");

    axios.put(`https:backend-myflix.herokuapp.com/users/${username}`, {
      Username: this.state.Username,
      Password: this.state.Password,
      Email: this.state.Email,
      Birthday: this.state.Birthday,
    }, { headers: { Authorization: `Bearer ${token}` } }
    )

      .then((response) => {
        alert("Saved Changes!");
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
        });
        localStorage.setItem("user", this.state.Username);
        window.open(`/users/${username}`, "_self");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  setUsername(input) {
    this.state.Username = input;
  }

  setPassword(input) {
    this.state.Password = input;
  }

  setEmail(input) {
    this.state.Email = input;
  }

  setBirthday(input) {
    this.state.Birthday = input;
  }

  handleDeleteUser(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.delete(`https:backend-myflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        alert('Your account has been deleted.');
        window.open(`/`, '_self');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeFavorite(movie) {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("user");

    axios.delete(`https:backend-myflix.herokuapp.com/users/${username}/movies/${movie._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        alert("Removed from favorites!");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { FavoriteMovies, validated } = this.state;
    const { movies } = this.props;

    return (
      <Row className="profile-view d-flex ">
        <Accordion defaultActiveKey="0" className="custom-accordion">
          <Accordion.Item style={{ backgroundColor: 'black' }} eventKey="0">
            <Accordion.Header>
              <h3 className="text-dark">My Profile</h3>
            </Accordion.Header>
            <Accordion.Body className="full-white w-100">
              <Form noValidate validated={validated} className="update-form" onSubmit={(e) => this.handleUpdate(e)}>
                <Row>
                  <Form.Group className="mb-3" controlId="formBasicUsername">
                    <FloatingLabel controlId="username" label="Username">
                      <Form.Control type="text" value={this.state.Username} onChange={(e) => this.setState({ Username: e.target.value })} />
                    </FloatingLabel>
                  </Form.Group>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <FloatingLabel controlId="password" label="Password">
                        <Form.Control type="password" value={this.state.Password} onChange={(e) => this.setState({ Password: e.target.value })} />
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <FloatingLabel controlId="email" label="Email address">
                        <Form.Control type="email" value={this.state.Email} onChange={(e) => this.setState({ Email: e.target.value })} />
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicBirthday">
                      <FloatingLabel controlId="birthday" label="Birthday">
                        <Form.Control type="date" value={this.state.Birthday} onChange={(e) => this.setState({ Birthday: e.target.value })} />
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Body>
                  <Button className="mx-3 mt-2" type="submit" variant="outline-light">Update</Button>
                  <Button className="mx-3 mt-2" variant="outline-danger" onClick={(e) => this.handleDeleteUser(e)}>Delete</Button>
                </Card.Body>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item style={{ backgroundColor: 'black' }} eventKey="1">
            <Accordion.Header className="text-light full-black mt-md-5">
              <h3 className="m-auto black-text">Favorites</h3>
            </Accordion.Header>
            <Accordion.Body className="text-center full-black" sm={12} md={6}>
              {FavoriteMovies.length === 0 && <div className="text-center text-light m-auto">You don`t have favorite movies yet!</div>}
              <div className="favorite-movies d-flex justify-content-center ">
                {FavoriteMovies.length > 0 &&
                  movies.map((movie) => {
                    if (movie._id === FavoriteMovies.find((favoriteMovie) => favoriteMovie === movie._id)) {
                      return (
                        <Col className="text-center justify-content-center">
                          <Row className="text-dark" key={movie._id}>
                            <Col className="m-auto image-container-profile" sm={12} md={6} lg={5}>
                              <img className="w-75 m-auto mt-2" className="movieCard" src={movie.ImagePath} />
                            </Col>
                            <Button className='remove-favorite' variant='danger' value={movie._id} onClick={e => this.removeFavorite(movie)}>Remove</Button>
                          </Row>
                        </Col>
                      );
                    }
                  })}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row >
    );
  }
}

ProfileView.propTypes = {
  username: PropTypes.shape({
    FavoriteMovies: PropTypes.array.isRequired,
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birth: PropTypes.string.isRequired,
    FavoriteMovies: PropTypes.array.isRequired,
  }),
};