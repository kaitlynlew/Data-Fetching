import React from "react";
import "../index.css";

function BookCard({ title, author, image, selected, onSelect, isLoaned, onViewDetails }) { 
  const handleCardClick = () => {
    onSelect();
  };

  const handleViewDetailsClick = (e) => {
      e.stopPropagation(); // Prevents the card selection handler from firing
      onViewDetails();
  };

  return (
    <div 
      className={`book-card ${selected ? 'selected' : ''} ${isLoaned ? 'loaned' : ''}`}
      onClick={handleCardClick}
    >
      {isLoaned && <div className="loan-badge">ON LOAN</div>}
      <img src={image} alt={title} className="book-image"/>
      <h3>{title}</h3>
      <p>{author && `By: ${author}`}</p>
      
      {/* RESTORED: View Details button */}
      <button 
        onClick={handleViewDetailsClick}
        className="details-btn" 
        // Note: The details-btn CSS must be active. We will add a style rule for it in index.css
      >
        View Details
      </button>

    </div>
  );
}

export default BookCard;