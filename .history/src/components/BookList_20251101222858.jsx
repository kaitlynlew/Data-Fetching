import React, { useState, useMemo } from "react";
import BookCard from "./BookCard";
import NewCard from "./NewCard"; 
import BookForm from "./BookForm"; 
import AuthorFilter from "./AuthorFilter";
import "../index.css"; 

const BookList = ({ books, loans, onAddBook, onUpdateBook, onDeleteBook }) => {
  const [selectedBookIsbn, setSelectedBookIsbn] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false); 
  const [authorFilter, setAuthorFilter] = useState("");

  const loanedIsbns = useMemo(() => new Set(loans.map(loan => loan.isbn13)), [loans]);

  const handleSelect = (isbn13) => {
    setSelectedBookIsbn(prevIsbn => (prevIsbn === isbn13 ? null : isbn13));
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

  const uniqueAuthors = useMemo(() => {
    const authors = books.map(book => book.author).filter(Boolean);
    return [...new Set(authors)].sort();
  }, [books]);

  const handleFilterChange = (e) => {
    setAuthorFilter(e.target.value);
    setSelectedBookIsbn(null);
  };

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      if (authorFilter === "") return true;
      return book.author === authorFilter;
    });
  }, [books, authorFilter]);

  return (
    <div className="booklist">
      <div className="filter-and-list">
        <AuthorFilter 
          uniqueAuthors={uniqueAuthors}
          authorFilter={authorFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

    <div className="booklist-layout">

      <div className="controls-panel">
      
            <NewCard 
                addBook={handleAddBook} 
            />

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
    </div>

  );
};

export default BookList;