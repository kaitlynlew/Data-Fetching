import React, { useState, useMemo } from "react";
import BookCard from "./BookCard";
import NewCard from "./NewCard"; 
import BookForm from "./BookForm"; 
import AuthorFilter from "./AuthorFilter";
import BookDetails from "./BookDetails"; // <-- Ensure this component exists
import "../index.css"; 

// RESTORED: onDetailsViewChange prop
const BookList = ({ books, loans, onAddBook, onUpdateBook, onDeleteBook, onDetailsViewChange }) => { 
  const [selectedBookIsbn, setSelectedBookIsbn] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false); 
  const [authorFilter, setAuthorFilter] = useState("");
  const [detailedBookIsbn, setDetailedBookIsbn] = useState(null); // RESTORED: details state

  const loanedIsbns = useMemo(() => new Set(loans.map(loan => loan.isbn13)), [loans]);

  const handleSelect = (isbn13) => {
    // Prevent selection change if the details view is active
    if (detailedBookIsbn) return; 
    setSelectedBookIsbn(prevIsbn => (prevIsbn === isbn13 ? null : isbn13));
  };
  
  const handleViewDetails = (isbn13) => { 
      setDetailedBookIsbn(isbn13);
      setSelectedBookIsbn(null);
      if (onDetailsViewChange) onDetailsViewChange(true);

  const handleCloseDetails = () => { 
      setDetailedBookIsbn(null);
      if (onDetailsViewChange) onDetailsViewChange(false);
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


  if (detailedBook) { 
      return <BookDetails book={detailedBook} onClose={handleCloseDetails} />;
  }


  return (
    <div className="book-list-container">
      
      <div className="filter-and-list">
        <AuthorFilter
            uniqueAuthors={uniqueAuthors}
            authorFilter={authorFilter}
            onFilterChange={handleFilterChange}
        />
      </div>

      <div className="booklist-layout">
          
          <div className="controls-panel">
            
              <NewCard addBook={handleAddBook} />
              
              <div className="action-buttons">
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