import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Row, Col, Form, Button, Card, FloatingLabel, Accordion } from 'react-bootstrap';
import { RiDeleteBin5Line } from 'react-icons/ri';

import './profile-view.scss'

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      Username: null,
      Password: null,
      Email: null,
      Birthyear: null,
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

    axios.get(`https://backend-myflix.herokuapp.com/users/${username}`, {
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
    axios.get(`https://backend-myflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthyear: response.data.Birthyear,
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

    axios.put(`https://backend-myflix.herokuapp.com/users/${username}`, {
      Username: this.state.Username,
      Password: this.state.Password,
      Email: this.state.Email,
      Birthyear: this.state.Birthyear,
    }, { headers: { Authorization: `Bearer ${token}` } }
    )

      .then((response) => {
        alert("Saved Changes!");
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthyear: response.data.Birthyear,
        });
        localStorage.setItem("user", this.state.Username);
        this.componentDidMount();
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

  setBirthyear(input) {
    this.state.Birthyear = input;
  }

  handleDeleteUser(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.delete(`https://backend-myflix.herokuapp.com/users/${username}`, {
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

    axios.delete(`https://backend-myflix.herokuapp.com/users/${username}/movies/${movie._id}`, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: function (status) {
        return status < 500;
      }
    })
      .then(response => {
        alert("Removed from favorites!");
        this.componentDidMount();
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
            <Accordion.Header className="custom-header">
              <h3 className="profile text-dark">My Profile</h3>
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
                    <Form.Group className="mb-3" controlId="formBasicBirthyear">
                      <FloatingLabel controlId="birthyear" label="Date of Birth">
                        <Form.Control type="date" value={this.state.Birthyear} onChange={(e) => this.setState({ Birthyear: e.target.value })} />
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Body>
                  <Button className="mx-3 mt-2" type="submit" variant="outline-light"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>Update</Button>
                  <Button className="mx-3 mt-2" variant="outline-danger" onClick={(e) => this.handleDeleteUser(e)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>Delete Account</Button>
                </Card.Body>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item style={{ backgroundColor: 'black' }} eventKey="1">
            <Accordion.Header>
              <h3 className="black-text">Favorites</h3>
            </Accordion.Header>
            <Accordion.Body className="text-center full-black" sm={12} md={6}>
              {(FavoriteMovies || []).length === 0 && <div className="text-center text-light m-auto">You don`t have favorite movies yet!</div>}
              <div className="favorite-movies flex-wrap">
                {FavoriteMovies.length > 0 &&
                  movies.map((movie) => {
                    if (movie._id === FavoriteMovies.find((favoriteMovie) => favoriteMovie === movie._id)) {
                      return (
                        <Col className="text-center justify-content-center">
                          <Row className="text-light" key={movie._id}>
                            <Col className="m-auto image-container-profile" sm={12} md={6} lg={5}>
                              <img className="movieCard" src={movie.ImagePath} />
                            </Col>
                            <div className='trash' variant='danger' value={movie._id} onClick={e => this.removeFavorite(movie)}><RiDeleteBin5Line />
                            </div>
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

/* let mapStateToProps = state => {
  return {
    user: state.user,
    movies: state.movies
  }
} */

// export default connect(mapStateToProps, { setUser, updateUser })(ProfileView);

ProfileView.propTypes = {
  username: PropTypes.shape({
    FavoriteMovies: PropTypes.array.isRequired,
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthyear: PropTypes.date,
    FavoriteMovies: PropTypes.array.isRequired,
  }),
};
