import React, { useState, useMemo } from "react";
import BookCard from "./BookCard";
import NewCard from "./NewCard"; 
import BookForm from "./BookForm"; 
import AuthorFilter from "./AuthorFilter";
import BookDetails from "./BookDetails"; 
import "../index.css"; 

// Added onDetailsViewChange to props
const BookList = ({ books, loans, onAddBook, onUpdateBook, onDeleteBook, onDetailsViewChange }) => { 
  const [selectedBookIsbn, setSelectedBookIsbn] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false); 
  const [authorFilter, setAuthorFilter] = useState("");
  // New state to track the book being viewed in detail
  const [detailedBookIsbn, setDetailedBookIsbn] = useState(null); 

  const loanedIsbns = useMemo(() => new Set(loans.map(loan => loan.isbn13)), [loans]);

  const handleSelect = (isbn13) => {
    // Prevent selection change if the details view is active
    if (detailedBookIsbn) return; 
    setSelectedBookIsbn(prevIsbn => (prevIsbn === isbn13 ? null : isbn13));
  };
  
  // Handler to open the details view - UPDATED
  const handleViewDetails = (isbn13) => { 
      setDetailedBookIsbn(isbn13);
      setSelectedBookIsbn(null); // Clear selection when viewing details
      if (onDetailsViewChange) onDetailsViewChange(true); // <-- Notify parent
  };

  // Handler to close the details view - UPDATED
  const handleCloseDetails = () => { 
      setDetailedBookIsbn(null);
      if (onDetailsViewChange) onDetailsViewChange(false); // <-- Notify parent
  };
  
  const handleAddBook = onAddBook;
  
  const handleDelete = () => {
    if (!selectedBookIsbn) return;
    
    onDeleteBook(selectedBookIsbn);
    setSelectedBookIsbn(null);
  };

  const handleUpdate = (updatedBook) => {
    onUpdateBook(updatedBook);
    setSelectedBookIsbn(null);
  };
  
const selectedBookIsOnLoan = selectedBookIsbn && loanedIsbns.has(selectedBookIsbn);
  
const handleEditClick = () => {
    if (selectedBookIsbn && !selectedBookIsOnLoan) { 
        setIsEditingModalOpen(true);
    }
};  

  const selectedBook = useMemo(() => {
    return books.find(book => book.isbn13 === selectedBookIsbn);
  }, [books, selectedBookIsbn]);
  
  // Find the book data for the details view
  const detailedBook = useMemo(() => { 
    return books.find(book => book.isbn13 === detailedBookIsbn);
  }, [books, detailedBookIsbn]);

  const uniqueAuthors = useMemo(() => {
    const authors = books.map((book) => book.author).filter(Boolean);
    return [...new Set(authors)].sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => 
      !authorFilter || book.author === authorFilter
    );
  }, [books, authorFilter]);
  
  const handleFilterChange = (e) => {
      setAuthorFilter(e.target.value);
      setSelectedBookIsbn(null); 
  };


  // --- Conditional Rendering for BookDetails ---
  if (detailedBook) { 
      // The BookDetails component will render the 'Back to Catalog' button
      // which calls handleCloseDetails, setting detailedBookIsbn to null and 
      // notifying the parent component.
      return <BookDetails book={detailedBook} onClose={handleCloseDetails} />;
  }
  // --- End Conditional Rendering ---


  return (
    <div className="book-list-container">
      <div className="book-actions">

          {/* NewCard is for adding new books */}
          <NewCard addBook={handleAddBook} />
          
          <div className="actions">
              
              <AuthorFilter
                  uniqueAuthors={uniqueAuthors}
                  authorFilter={authorFilter}
                  onFilterChange={handleFilterChange}
              />
              
              {/* Existing edit/delete buttons */}
              <button 
                  onClick={handleEditClick} 
                  disabled={!selectedBookIsbn || selectedBookIsOnLoan}
                  className="update-btn"
                  title={selectedBookIsOnLoan ? "Cannot edit a book that is on loan." : "Edit Book"}
              >
                  Edit
              </button>

              <button 
                  onClick={handleDelete} 
                  disabled={!selectedBookIsbn || selectedBookIsOnLoan} 
                  className="delete-btn"
                  title={selectedBookIsOnLoan ? "Cannot delete a book that is on loan." : "Delete Book"}
              >
                  Delete
              </button>
          </div>
          
        </div>
        
        <div className="books-grid"> 
                
            {filteredBooks.map((book) => (
                <BookCard
                    key={book.isbn13}
                    {...book}
                    selected={book.isbn13 === selectedBookIsbn}
                    onSelect={() => handleSelect(book.isbn13)}
                    isLoaned={loanedIsbns.has(book.isbn13)}
                    onViewDetails={() => handleViewDetails(book.isbn13)} 
                />
            ))}
        </div>

        {isEditingModalOpen && selectedBook && (
          <BookForm
            onSubmit={handleUpdate}
            initialData={selectedBook}
            isEditing={true}
            closeModal={() => setIsEditingModalOpen(false)}
          />
        )}
    </div>

  );
};

export default BookList;