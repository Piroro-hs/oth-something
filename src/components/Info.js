import React, {PropTypes} from 'react';

import {style} from 'glamor';

import {B, W, count} from '../oth';

const info = style({
  marginTop: '2vmin',
  marginBottom: '2vmin',
  marginRight: '2vmin',
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  flexGrow: 1,
});

const Info = ({board}) =>
  <div {...info}>
    {`Black: ${count(board, B)}, White: ${count(board, W)}`}
  </div>;

Info.propTypes = {
  board: PropTypes.any.isRequired,
};

export default Info;
