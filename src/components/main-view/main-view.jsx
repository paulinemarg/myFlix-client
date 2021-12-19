import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';

import { connect } from 'react-redux';
import { setMovies } from '../../actions/actions';

import { RegistrationView } from "../registration-view/registration-view";
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';
import MoviesList from '../movies-list/movies-list';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';

import { Row, Col, Button, Navbar, Nav, Carousel, Container } from 'react-bootstrap';

import "./main-view.scss";

class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      //movies: [],
      genres: [],
      directors: [],
      user: null,
      hasAccount: true,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      console.log(user);
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
        /* this.setState({
          movies: response.data
        }); */
        this.props.setMovies(response.data);
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
    const { user, directors, genres, hasAccount } = this.state;
    const { movies } = this.props;

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
        <Navbar className="navbar" collapseOnSelect expand="lg" variant="dark">
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Link className="custom-link mx-3" to={`/`}>Movies</Link>
                <Link className="custom-link mx-3" to={`/directors`}>Directors</Link>
                <Link className="custom-link mx-3" to={`/genres`}>Genres</Link>
                <Link className="custom-link mx-3" to={`/users/:username`}>Profile</Link>
              </Nav>
              <Button className="logout-button" variant="outline-secondary" onClick={() => { this.onLoggedOut(); }}><FiLogOut /></Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Carousel fade>
          <Carousel.Item className="item">
            <img className="carousel-img" src="http://images6.fanpop.com/image/photos/40000000/The-Revenant-Poster-movie-trailers-40024178-1800-874.jpg" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="carousel-img" src="https://www.scified.com/media/pacificrim_support.jpg" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="carousel-img" src="https://i.pinimg.com/originals/be/d6/3e/bed63e4fa1a1be8cea48b3c630218778.jpg" />
          </Carousel.Item>
        </Carousel>
        <Row className="main-view justify-content-center">
          <Route exact path="/" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <MoviesList movies={movies} />;
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

let mapStateToProps = state => {
  return {
    movies: state.movies,
    //user: state.user
  }
}

export default connect(mapStateToProps, { setMovies })(MainView);

MainView.propTypes = {
  setMovies: PropTypes.func.isRequired,
  //setUser: PropTypes.func.isRequired,
  movies: PropTypes.array.isRequired,
  //user: PropTypes.string.isRequired,
};