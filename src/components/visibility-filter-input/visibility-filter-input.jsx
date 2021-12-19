import React from 'react';
import { connect } from 'react-redux';

import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

import { setFilter } from '../../actions/actions';

function VisibilityFilterInput(props) {
  return <Form.Control
    className='text-center'
    onChange={e => props.setFilter(e.target.value)}
    value={props.visibilityFilter}
    placeholder="Search a movie"
  />;
}

export default connect(
  null,
  { setFilter }
)(VisibilityFilterInput);

VisibilityFilterInput.propTypes = {
  visibilityFilter: PropTypes.string.isRequired,
};