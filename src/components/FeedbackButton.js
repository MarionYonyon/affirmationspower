import React, { useState } from 'react';
import FeedbackPopup from './FeedbackPopup';

function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="feedback-button" onClick={togglePopup}>Give us feedback</button>
      {isOpen && <FeedbackPopup onClose={togglePopup} />}
    </div>
  );
}

export default FeedbackButton;
