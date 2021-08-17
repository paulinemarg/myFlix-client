import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Container } from "react-bootstrap";

import "./genre-view.scss";

export class GenreView extends React.Component {
  render() {
    const { genre } = this.props;
    return (
      <Container className="mt-5">
        <Col>
          <Row className="text-black">
            <span className="font-weight-bold">{genre.Name}</span>
          </Row>
          <Row className="text-black">
            <span className="genre-description">{genre.Description}</span>
          </Row>
        </Col>
      </Container>
    );
  }
}

GenreView.propTypes = {
  genre: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Description: PropTypes.string.isrequired,
  }).isRequired
};