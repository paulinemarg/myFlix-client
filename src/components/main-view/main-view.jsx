import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";

import { RegistrationView } from "../registration-view/registration-view";
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import { Row, Col, Button, Navbar, Nav, Form, FormControl } from 'react-bootstrap';

import "./main-view.scss";

class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      movies: [],
      user: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
      this.getDirectors(accessToken);
      this.getGenres(accessToken);
    }
  }

  // Gets movies from API
  getMovies(token) {
    axios.get('https://backend-myflix.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Gets directors from API
  getDirectors(token) {
    axios.get('https://backend-myflix.herokuapp.com/directors', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        this.setState({
          directors: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // gets genres from API
  getGenres(token) {
    axios.get('https://backend-myflix.herokuapp.com/genres', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        this.setState({
          genres: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onRegister(user) {
    this.setState({
      user,
    });
  }

  goToLogin() {
    this.setState({ register: true });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null
    });
  }

  render() {
    const { movies, user, directors, genres } = this.state;
    return (
      <Router>
        <Navbar bg="dark" collapseOnSelect expand="lg" sticky="top" variant="dark">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link className="custom-link mx-3" to={`/`}>Movies</Link>
              <Link className="custom-link mx-3" to={`/directors`}>Directors</Link>
              <Link className="custom-link mx-3" to={`/genres`}>Genres</Link>
              <Link className="custom-link mx-3" to={`/users/:username`}>Profile</Link>
            </Nav>
            <Form className="d-flex">
              <FormControl type="search" placeholder="Search" className="mr-2" aria-label="Search" />
              <Button variant="outline-danger">Search</Button>
            </Form>
            <Button className="logout-button mx-3" variant="outline-danger" onClick={() => { this.onLoggedOut(); }}>Logout</Button>
          </Navbar.Collapse>
        </Navbar>
        <Row className="main-view justify-content-center">
          <img src="../public/logo.jpg" width="30" height="30" className="justify-content-center-md-center" />
          <Route exact path="/" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            return movies.map(m => (
              <Col md={3} key={m._id}>
                <MovieCard movie={m} />
              </Col>
            ))
          }} />
          <Route path="/register" render={() => {
            if (user) return <Redirect to="/" />;
            return <Col>
              <RegistrationView />
            </Col>
          }} />
          <Route exact path="/users/:username" render={({ history }) => {
            if (!user) return (
              <LoginView onLoggedIn={(data) => this.onLoggedIn(data)} />
            );
            if (movies.length === 0) return;
            return <ProfileView history={history} movies={movies} />;
          }}
          />
          <Route path="/profile" render={() => {
            if (!user) return <Col>
              <ProfileView />
            </Col>
          }} />
          <Route path="/movies/:movieId" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
            </Col>
          }} />
          <Route path="/genres/:name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <GenreView genre={genres.find(m => m.Name === match.params.name)} onBackClick={() => history.goBack()} />
              <Button classname="mt-4" variant="dark" onClick={() => {
                history.goBack();
              }} >Back</Button>
            </Col>
          }} />
          <Route exact path="/genres" render={() => {
            return genres.map((m) => (
              <Col md={8} key={m._id}>
                <GenreView genre={m} />
              </Col>
            ));
          }} />
          <Route path="/directors/:name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <DirectorView director={directors.find(m => m.Name === match.params.name)} onBackClick={() => history.goBack()} />
              <Button className="mt-4" variant="dark" onClick={() => {
                history.goBack();
              }} >Back</Button>
            </Col>
          }} />
          <Route exact path="/directors" render={() => {
            return directors.map((m) => (
              <Col md={12} xl={6} key={m._id}>
                <DirectorView director={m} />
              </Col>
            ));
          }} />
        </Row>
      </Router>
    );
  }
}
export default MainView;