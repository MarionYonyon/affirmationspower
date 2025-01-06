import React from "react";
import "../styles/Testimonial.css";

const Testimonial = ({ name, rating, quote, author, note }) => {
  return (
    <div className="testimonial-container">
      <h3 className="testimonial-name">{name}</h3>
      <p className="testimonial-rating">{rating}</p>
      <p className="testimonial-quote">"{quote}"</p>
      <p className="testimonial-author">— {author}</p>
      {note && <p className="testimonial-note">{note}</p>}
    </div>
  );
};

export default Testimonial;
