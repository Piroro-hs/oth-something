import React, {PropTypes} from 'react';

import {merge, style} from 'glamor';

function noop() {
}

const cell = style({
  width: '100%',
  height: '100%',
});

const clickableCell = merge(cell, {
  cursor: 'pointer',
  '::after': {
    width: '100%',
    height: '100%',
    display: 'block',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    opacity: 0,
    transition: 'opacity 0.3s',
    content: '""',
  },
  ':hover::after': {
    opacity: 1,
  },
});

const Cell = ({onClick, children, row, column}) =>
  <div
    onClick={() => {onClick({row, column});}}
    style={{gridArea: `${row + 1} / ${column + 1}`}}
    {...onClick === noop ? cell : clickableCell}
  >
    {children}
  </div>;

Cell.defaultProps = {
  onClick: noop,
};

Cell.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
};

export default Cell;
