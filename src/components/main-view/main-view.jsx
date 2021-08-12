import React from 'react';
import axios from 'axios';

import { RegistrationView } from "../registration-view/registration-view";
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { Row, Col } from 'react-bootstrap';

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
    axios.get('https://backend-myflix.herokuapp.com/movies')
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  backToHome() {
    this.setState({
      selectedMovie: null
    });
  }

  setSelectedMovie(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onRegister(register) {
    this.setState({
      register,
    });
  }

  goToLogin() {
    this.setState({ register: true });
  }

  onLoggedIn(user) {
    this.setState({
      user
    });
  }

  render() {
    const { movies, selectedMovie, user, register } = this.state;

    if (!register) return <RegistrationView onRegister={register => this.onRegister(register)} goToLogin={() => this.goToLogin()} />;

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    if (movies.length === 0) return <div className="main-view" />;

    return (
      <Row className="main-view justify-content-md-center">
        {selectedMovie
          ? (
            <Col md={8}>
              <MovieView movie={selectedMovie} onBackClick={() => { this.backToHome() }} />
            </Col>
          )
          : movies.map(movie => (
            <Col md={3}>
              <MovieCard key={movie._id} movie={movie} onMovieClick={(newSelectedMovie) => { this.setSelectedMovie(newSelectedMovie) }} />
            </Col>
          ))
        }
      </Row>
    );
  }
}
export default MainView;