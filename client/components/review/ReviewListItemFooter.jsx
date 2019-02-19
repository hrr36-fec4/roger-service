import React from 'react';
import PropTypes from 'prop-types';

const ReviewListItemFooter = ({
  helpful, not, flag, id, patch, helpfulClicked,
}) => (
  <div id="review-list-item-footer">
    <span className="pad-right">Helpful?</span>
    <span
      onKeyPress={() => {}}
      role="button"
      tabIndex={0}
      onClick={helpfulClicked ? () => {} : () => patch(id, 'helpful')}
      className={helpfulClicked ? '' : 'button-helpful'}
    >
      <span>Yes · </span>
      <span>{helpful}</span>
    </span>
    <span
      onKeyPress={() => {}}
      role="button"
      tabIndex={0}
      onClick={helpfulClicked ? () => {} : () => patch(id, 'notHelpful')}
      className={helpfulClicked ? '' : 'button-helpful'}
    >
      <span> No · </span>
      <span>{not}</span>
    </span>
    <span onKeyPress={() => {}} role="button" tabIndex={0} onClick={() => patch(id, 'flag')} className={flag ? 'bold' : 'button-helpful'}>
      <span>{flag ? 'Reported' : 'Report as inappropiate'}</span>
    </span>
  </div>
);

ReviewListItemFooter.propTypes = {
  helpful: PropTypes.number,
  not: PropTypes.number,
  flag: PropTypes.bool,
  id: PropTypes.node,
  patch: PropTypes.func,
  helpfulClicked: PropTypes.bool,
};

ReviewListItemFooter.defaultProps = {
  helpful: 0,
  not: 0,
  flag: false,
  id: '',
  patch: () => {},
  helpfulClicked: false,
};

export default ReviewListItemFooter;
