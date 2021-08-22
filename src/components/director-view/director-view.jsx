import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Container } from "react-bootstrap";

import "./director-view.scss";

export class DirectorView extends React.Component {
  render() {
    const { director } = this.props;
    return (
      <Container className="director-container mt-5">
        <Row className="director-image">
          <Col xs={12}>
            <img className="director-img" src={director.Image}></img>
          </Col>
          <Row className="director-view">
            <span className="label"></span>
            <span className="value text-white font-weight-bold">{director.Name}-{director.Birth}</span>
          </Row>
          <Row className="director-bio">
            <span className="label"></span>
            <span className="value text-white">{director.Bio}</span>
          </Row>
          <Row className="director-filmography">
            <span className="label text-white font-weight-bold">His famous works:</span>
            <span className="value text-white">{director.Filmography}</span>
          </Row>
        </Row>
      </Container>
    );
  }
}

DirectorView.proptypes = {
  director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birthyear: PropTypes.date,
    Filmography: PropTypes.string.isRequired,
    Image: PropTypes.string.isRequired,
  }).isRequired
};