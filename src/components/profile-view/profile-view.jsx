import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';

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
      this.getUserFavs(accessToken);
    }
  }

  // Gets user
  getUser(token) {
    const username = localStorage.getItem('user');
    axios.get('https://backend-myflix.herokuapp.com/users/${username}', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Birthday,
          FavoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Gets fav
  getUserFavs(token) {
    axios.get('https://backend-myflix.herokuapp.com/users/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        this.setState({
          FavoriteMovies: response.data.FavoriteMovies,
        });
      });
  }

  // remove Favourite Movie
  removeFavouriteMovie() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("user");

    axios.delete(`https://backend-myflix.herokuapp.com/users/${username}/movies/${movie._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("Removed!");
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleUpdate(e, newUsername, newPassword, newEmail, newBirthday) {
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
    e.preventDefault();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("user");

    axios.put(`https://backend-myflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        Username: newUsername ? newUsername : this.state.Username,
        Password: newPassword ? newPassword : this.state.Password,
        Email: newEmail ? newEmail : this.state.Email,
        Birthday: newBirthday ? newBirthday : this.state.Birthday,
      },
    })
      .then((response) => {
        alert("Saved!");
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birth,
        });
        localStorage.setItem("user", this.state.Username);
        window.open(`/users/${username}`, "_self");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  setUsername(input) {
    this.Username = input;
  }

  setPassword(input) {
    this.Password = input;
  }

  setEmail(input) {
    this.Email = input;
  }

  setBirthday(input) {
    this.Birthday = input;
  }

  handleDeleteUser(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("user");

    axios.delete(`https://backend-myflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        alert("Your account has been removed.");
        window.open(`/`, "_self");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { FavoriteMovies, validated } = this.state;
    const { movies } = this.props;

    return (
      <Row className="profile-view">
        <Card className="profile-card">
          <h2 className="m-auto">Update Profile</h2>
          <Card.Body>
            <Form noValidate validated={validated} className="update-form d-flex" onSubmit={(e) => this.handleUpdate(e, this.Name, this.Username, this.Password, this.Email, this.Birthday)}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control placeholder="Username" type="text" onChange={e => this.setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control placeholder="Password" type="password" onChange={e => this.setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicBirthday">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control placeholder="YYYY-MM-DD" type="birthday" value={birthday} onChange={e => this.setBirthday(e.target.value)} />
              </Form.Group>
              <Button className="updateBtn" variant="dark" type="submit" onClick={(e) => this.handleUpdate(e)}>Update</Button>
              <h3>Delete Your Account</h3>
              <Card.Body>
                <Button className="deleteBtn" variant="dark" type="submit" onClick={(e) => this.handleDeleteUser(e)}>Delete</Button>
              </Card.Body>
              <Card.Body>
                {FavoriteMovies.length === 0 && <div className="text-center m-auto">You don't have favorite movies yet!</div>}
                <div className="favorites-movies ">
                  {FavoriteMovies.length > 0 &&
                    movies.map((movie) => {
                      if (movie._id === FavoriteMovies.find((m) => m._id === movies._id)) {
                        return (
                          <CardDeck className="movie-card-deck">
                            <Card className="favorites-item card-content" style={{ width: '16rem' }} key={movie._id}>
                              <Card.Img style={{ width: '18rem' }} className="movieCard" variant="top" src={movie.ImagePath} />
                              <Card.Body>
                                <Card.Title className="movie-card-title">{movie.Title}</Card.Title>
                                <Button size='sm' className='profile-button remove-favorite' variant='danger' value={movie._id} onClick={(e) => this.removeFavouriteMovie(e, movie)}>Remove</Button>
                              </Card.Body>
                            </Card>
                          </CardDeck>
                        );
                      }
                    })}
                </div>
              </Card.Body>
            </Form>
          </Card.Body>
        </Card>
      </Row>
    )
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