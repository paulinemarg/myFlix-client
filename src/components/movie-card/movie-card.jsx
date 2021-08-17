import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, Button } from 'react-bootstrap';

import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;

    return (
      <Card className="h-100 shadow-sm bg-white rounded">
        <Link to={`/movies/${movie._id}`}>
          <Card.Img variant="top" src={movie.ImagePath} />
        </Link>
        <Card.Body className="d-flex flex-column">
          <Link to={`/movies/${movie._id}`}>
            <div className="d-flex mb-2 justify-content-between">
              <Card.Title className="mb-0 font-weight-bold">{movie.Title}</Card.Title>
              <Badge bg="danger">{movie.Rating}</Badge>
            </div>
            <Card.Text className="text-secondary">{movie.Description}</Card.Text>
          </Link>
          <Button className="mt-auto font-weight-bold" variant="dark">Open</Button>
        </Card.Body>
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
  onMovieClick: PropTypes.func.isRequired
};
