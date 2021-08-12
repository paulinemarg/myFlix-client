import React from 'react';
import PropTypes from "prop-types";
import { Row, Col, Button } from 'react-bootstrap';

import "./movie-view.scss";


export class MovieView extends React.Component {

  render() {
    const { movie, onBackClick } = this.props;

    return (
      <Row className="movie-view">
        <Col xs={12} md={6} className="movie-poster">
          <img className="w-75" class="img-fluid" src={movie.ImagePath} thumbnail />
        </Col>
        <Col xs={12} md={6} className="movie-body">
          <div className="movie-title">
            <span className="label"></span>
            <h1 className="value">{movie.Title}</h1>
          </div>
          <div className="movie-description">
            <span className="label"></span>
            <span className="value">{movie.Description}</span>
          </div>
          <div className="movie-genre">
            <span className="label"></span>
            <h2 className="value">{movie.Genre}</h2>
          </div>
          <div className="movie-director">
            <span className="label"></span>
            <h2 className="value">{movie.Director}</h2>
          </div>
          <div className="movie-stars">
            <span className="label"></span>
            <h2 className="value">{movie.Stars}</h2>
          </div>
          <div className="movie-releaseYear">
            <span className="label"> </span>
            <h3 className="value">{movie.ReleaseYear}</h3>
          </div>
          <div className="movie-rating">
            <span className="label"></span>
            <h3 className="value">{movie.Rating}</h3>
          </div>
          <Button className="backbtn" variant="dark" onClick={() => { onBackClick(); }}>Go Back</Button>
        </Col>
      </Row>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Genre: PropTypes.string.isRequired,
    Director: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Stars: PropTypes.string.isRequired,
    ReleaseYear: PropTypes.date,
    Rating: PropTypes.string,
  }).isRequired,
};