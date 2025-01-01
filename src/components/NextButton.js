// NextButton.js

import React from 'react';

const NextButton = ({ onClick, disabled = false }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
    >
      Next
    </button>
  );
};

export default NextButton;
