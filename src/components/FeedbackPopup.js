import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import "../styles/Buttons.css";
import "../styles/FeedbackPopup.css";
import useFeedbackSubmit from "../hooks/useFeedbackSubmit";
import Submit from "../images/Submit.svg";
import CloseIcon from "../images/close.svg";

const FeedbackPopup = ({
  onClose = () => console.warn("onClose function not provided"),
}) => {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const { submitFeedback, loading, error } = useFeedbackSubmit();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      await submitFeedback({ feedback, email });
      if (!error) {
        setFeedback("");
        setEmail("");
        onClose(); // Close popup after successful submission
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  return (
    <div className="overlay">
      <div className="popup">
        <button
          className="close-button"
          onClick={() => {
            console.log("Close button clicked");
            onClose(); // Trigger the onClose function
          }}
          aria-label="Close"
        >
          <img src={CloseIcon} alt="submit-button" />
        </button>
        <h2>We value honest feedback</h2>
        <p>
          What do you think of our product? <br /> Any improvement ideas?
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Let us know here what’s working well or what could be better."
            required
          />
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for follow-up (optional)"
          />
          <div className="button-container">
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
              <img src={Submit} alt="submit-button" />
            </button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

// Prop validation
FeedbackPopup.propTypes = {
  onClose: PropTypes.func.isRequired, // Ensure onClose is a required function
};

export default FeedbackPopup;
