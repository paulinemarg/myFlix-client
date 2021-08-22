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
import { Row, Col, Button, Navbar, Nav, Form, FormControl, FormLabel, Carousel } from 'react-bootstrap';

import logo from '../../../public/logo.jpg';
import "./main-view.scss";

class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      movies: [],
      genres: [],
      directors: [],
      user: null,
      hasAccount: true,
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

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
    this.getDirectors(authData.token);
    this.getGenres(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    <Redirect push to="/" />;
    this.setState({
      user: null
    });
  }

  // Handler to navigate from LoginView to RegistrationView
  handleRegister = () => {
    this.setState({
      hasAccount: false,
    });
  };

  //Handler to navigate from RegistrationView to LoginView
  handleLogin = () => {
    this.setState({
      hasAccount: true,
    });
  };

  render() {
    const { movies, user, directors, genres, hasAccount } = this.state;

    // on LoginView, when 'New User Sign Up' is clicked, goes to ReistrationView
    if (!hasAccount) return <RegistrationView handleLogin={this.handleLogin} />;

    // Renders LoginView if no user
    if (!user)
      return (
        <LoginView
          onLoggedIn={(user) => this.onLoggedIn(user)}
          handleRegister={this.handleRegister}
        />
      );

    if (!movies) return <div className="main-view" />;

    return (
      <Router className="mainview-container">
        <Navbar className="custom-navbar" collapseOnSelect expand="lg" sticky="top">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link className="custom-link mx-3" to={`/`}>Movies</Link>
              <Link className="custom-link mx-3" to={`/directors`}>Directors</Link>
              <Link className="custom-link mx-3" to={`/genres`}>Genres</Link>
              <Link className="custom-link mx-3" to={`/users/:username`}>Profile</Link>
            </Nav>
            <Button className="logout-button mx-3" variant="outline-light" onClick={() => { this.onLoggedOut(); }}>Logout</Button>
          </Navbar.Collapse>
        </Navbar>
        <Row className="main-view justify-content-center">
          <img src={logo} width={20} height={200} className="custom-logo justify-content-center-md-center" />
          <Carousel className="Carousel-container">
            <Carousel.Item>
              <img className="thor" src="https://www.assignmentx.com/wp-content/uploads/2011/03/THOR-12x5-Banner_fin2-online.jpg" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="italian-job" src="https://filmmusiccentral.files.wordpress.com/2019/08/0_0_121368_00h_1280x640.jpg" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="interstellar" src="https://www.joblo.com/wp-content/uploads/2014/10/interstellar-quad-nolan-1.jpg" />
            </Carousel.Item>
          </Carousel>
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