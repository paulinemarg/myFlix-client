import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { RegistrationView } from "../registration-view/registration-view";
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { Row, Col, Button } from 'react-bootstrap';

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

  onRegistration(user) {
    this.setState({
      user,
    });
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
        <Button onClick={() => { this.onLoggedOut() }}>Logout</Button>
        <Row className="main-view justify-content-md-center">
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
            if (user) return <Redirect to="/" />
            return <Col>
              <RegistrationView />
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
              <GenreView genre={genres.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
              <Button classname="mt-4" onClick={() => {
                history.goBack();
              }} >Back</Button>
            </Col>
          }} />
          <Route exact path="/genres" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            return genres.map((m) => (
              <Col md={12} key={m._id}>
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
              <DirectorView director={directors.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
              <Button className="mt-4" onClick={() => {
                history.goBack();
              }} >Back</Button>
            </Col>
          }} />
          <Route exact path="/directors" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            return directors.map((m) => (
              <Col md={12} key={m._id}>
                <GenreView director={m} />
              </Col>
            ));
          }} />
        </Row>
      </Router>
    );
  }
}
export default MainView;