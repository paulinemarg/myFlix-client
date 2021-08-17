import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Container } from "react-bootstrap";

import "./director-view.scss";

export class DirectorView extends React.Component {
  render() {
    const { director } = this.props;
    return (
      <Container className="director-container mt-5">
        <Row className="director-view">
          <span className="value">{director.Name}</span>
        </Row>
        <Row className="director-bio">
          <span className="value">{director.Bio}</span>
        </Row>
        <Row className="director-birthyear">
          <span className="value">{director.Birth}</span>
        </Row>
        <Row className="director-filmography">
          <span className="value">{director.Filmography}</span>
        </Row>
        <Row className="director-image">
          <Col xs={12}>
            <img className="w-50 d-flex director-img" src={director.Image}></img>
          </Col>
        </Row>
      </Container>
    );
  }
}

DirectorView.proptypes = {
  director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birthyear: PropTypes.date.isRequired,
    Filmography: PropTypes.string.isRequired,
    Image: PropTypes.string.isRequired,
  }).isRequired
};