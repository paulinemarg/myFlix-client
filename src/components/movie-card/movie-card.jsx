import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFillStarFill } from 'react-icons/bs';

import "./movie-card.scss";

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;


    return (
      <Card className="card-container">
        <Card.Body className="card p-0">
          <Link to={`/movies/${movie._id}`}>
            <Card.Img className="card-img" fluid src={movie.ImagePath} />
          </Link>
        </Card.Body>
        <Link to={`/movies/${movie._id}`}>
          <div className="title-container">
            {movie.Featured ? (
              <p className="card-title"><span className="featured">Featured</span></p>
            ) : (
              <p className="card-title"></p>
            )}
            <p className="rating">
              {" "}
              <div className="star" >
                <BsFillStarFill /> {movie.Rating}</div>
            </p>
          </div>{" "}
        </Link>
      </Card>
    );
  }
}


MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
  }).isRequired,
};
