import React, { useState, useEffect } from "react";
import "../index.css";

const API_BASE_URL = "https://api.itbook.store/1.0/search/";

function BookDetails({ book, onClose }) {
    const [similarBooks, setSimilarBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to generate a search query (using the book title or author)
    const getSearchQuery = (book) => {
        const query = book.title || book.author || 'programming';
        // Use the first few words to keep the search query concise
        return query.split(' ').slice(0, 3).join(' '); 
    }

    useEffect(() => {
        const fetchSimilarBooks = async () => {
            setIsLoading(true);
            setError(null);
            
            const query = getSearchQuery(book);

            try {
                const response = await fetch(`${API_BASE_URL}${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Filter out the current book and take up to 4 similar books
                const filteredBooks = (data.books || [])
                    .filter(b => b.isbn13 !== book.isbn13)
                    .slice(0, 4); 
                
                setSimilarBooks(filteredBooks);
            } catch (err) {
                console.error("Failed to fetch similar books:", err);
                setError("Could not load similar books. Check console for API error.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSimilarBooks();
    }, [book]);

    return (
        <div className="book-details-container">
            {/* ONLY THE TOP DISMISS BUTTON IS RETAINED */}
            <button onClick={onClose} className="dismiss-btn">
                ← Back to Catalog
            </button>
            
            <div className="details-header">
                <img 
                    src={book.image} 
                    alt={`Cover of ${book.title}`} 
                    className="details-book-image"
                />
                <div className="details-info">
                    <h2>{book.title}</h2>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
                    <p><strong>Publication Year:</strong> {book.publication_year || 'N/A'}</p>
                    <p><strong>Page Count:</strong> {book.pages || 'N/A'}</p>
                    <p><strong>Language:</strong> {book.language || 'N/A'}</p>
                    <p><strong>ISBN-13:</strong> {book.isbn13}</p>
                    <p style={{marginTop: '10px'}}>
                        This book is a valuable addition to our catalog. Please check the similar titles below for other recommendations.
                    </p>
                </div>
            </div>

            <div className="similar-books-section">
                <h3>Similar Books</h3>
                {isLoading && <p>Loading similar books...</p>}
                {error && <p className="error-message">{error}</p>}
                
                {!isLoading && !error && similarBooks.length === 0 && (
                    <p>No similar books found matching the search query.</p>
                )}

                <div className="similar-books-grid">
                    {similarBooks.map((simBook) => (
                        <div key={simBook.isbn13} className="similar-book-card">
                            <img 
                                src={simBook.image} 
                                alt={`Cover of ${simBook.title}`} 
                                className="similar-book-image"
                            />
                            <h4>{simBook.title}</h4>
                            <p className="similar-book-subtitle">ISBN: {simBook.isbn13}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BookDetails;