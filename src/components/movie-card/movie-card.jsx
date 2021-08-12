import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, Button } from 'react-bootstrap';

export class MovieCard extends React.Component {
  render() {
    const { movie, onMovieClick } = this.props;

    return (
      <Card className="h-100 shadow-sm bg-white rounded">
        <Card.Img variant="top" src={movie.ImagePath} />
        <Card.Body className="d-flex flex-column">
          <div className="d-flex mb-2 justify-content-between">
            <Card.Title className="mb-0 font-weight-bold">{movie.Title}</Card.Title>
            <Badge bg="danger">{movie.Rating}</Badge>
          </div>
          <Card.Text className="text-secondary">{movie.Description}</Card.Text>
          <Button onClick={() => onMovieClick(movie)} className="mt-auto font-weight-bold" variant="dark">Open</Button>
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
