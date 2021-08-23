import React from 'react';
import PropTypes from "prop-types";
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

import { Link } from "react-router-dom";

import "./movie-view.scss";


export class MovieView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  addFavorite(movie) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.post(`https:backend-myflix.herokuapp.com/users/${username}/movies/${movie._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert(`Added to Favorites List`)
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    const { movie, onBackClick } = this.props;

    return (
      <Row className="movie-view mt-5 m-auto">
        <Col md={12} lg={6} className="movie-poster">
          <img className="w-120" src={movie.ImagePath} />
        </Col>
        <Col md={12} lg={6} className="custom-body">
          <div className="movie-title">
            <span className="label"></span>
            <h1 className="value">{movie.Title} - {movie.ReleaseYear}
              <br></br>
              <Button className="heartBtn" variant="outline-light" value={movie._id} onClick={() => this.addFavorite(movie)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="heart" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
              </svg></Button>
            </h1>
          </div>
          <div className="movie-genre">
            <span className="label"></span>
            {movie.Genre.map((Genre) => (
              <Link key={Genre._id} to={`/genres/${Genre.Name}`}>
                <Button className="custom-link" variant="link">
                  <h4>{Genre.Name}</h4>
                </Button>
              </Link>
            ))}
          </div>
          <div className="movie-description">
            <span className="label"></span>
            <span className="value">{movie.Description}</span>
          </div>
          <div className="movie-director mt-5">
            <span className="label">Directed by:</span>
            {movie.Director.map((Director) => (
              <Link key={Director._id} to={`/directors/${Director.Name}`}>
                <Button className="custom-link" variant="link">
                  <h3>{Director.Name}</h3>
                </Button>
              </Link>
            ))}
          </div>
          <div className="movie-stars">
            <span className="label">Stars:</span> <br></br>
            <span className="value"> {movie.Stars}</span>
          </div>
          <Button className="mt-4" variant="dark" onClick={() => { onBackClick(null); }}>Back</Button>
        </Col>
      </Row>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Genre: PropTypes.array.isRequired,
    Director: PropTypes.array.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Stars: PropTypes.array.isRequired,
    ReleaseYear: PropTypes.date,
    Rating: PropTypes.string,
  }),
};