import React from 'react';
import PropTypes from "prop-types";
import { Card, Button } from 'react-bootstrap';
import { BsFillHeartFill } from 'react-icons/bs';
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

    axios.post(`https://backend-myflix.herokuapp.com/users/${username}/movies/${movie._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: function (status) {
        return status < 500;
      }
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
      <>
        <Card className="text-center">
          <Card.Header>{movie.Title} - {movie.ReleaseYear}</Card.Header>
          <Card.Body>
            <Card.Title>
            </Card.Title>
            <Card.Subtitle>
              <Button className="heartBtn" variant="dark" value={movie._id} onClick={() => this.addFavorite(movie)}> <BsFillHeartFill />
              </Button>
            </Card.Subtitle>
            <Card.Text>
              {movie.Description}
              <br></br>
              <span className="label">Stars:</span> <br></br>
              <span className="value"> {movie.Stars}</span>
            </Card.Text>
            <img className="w-100" src={movie.ImagePath} />
          </Card.Body>
          <Button className="mt-4" variant="dark" onClick={() => { onBackClick(null); }}>Back</Button>
          <Card.Footer>
            <span className="label">Genre:</span>
            {movie.Genre.map((Genre) => (
              <Link key={Genre._id} to={`/genres/${Genre.Name}`}>
                <Button className="custom-link" variant="link">
                  <h4>{Genre.Name}</h4>
                </Button>
              </Link>
            ))}
            <br></br>
            <span className="label">Directed by:</span>
            {movie.Director.map((Director) => (
              <Link key={Director._id} to={`/directors/${Director.Name}`}>
                <Button className="custom-link" variant="link">
                  <h3>{Director.Name}</h3>
                </Button>
              </Link>
            ))}
          </Card.Footer>
        </Card >
      </>
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