import React, { useState, useEffect } from "react";
import "../index.css";

const API_BASE_URL = "https://api.itbook.store/1.0/search/";

function BookDetails({ book, onClose }) {
    const [similarBooks, setSimilarBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSearchQuery = (book) => {
        const query = book.title || book.author || 'programming';
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
                Go Back to Catalog
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
                        <a 
                            key={simBook.isbn13} 
                            href={simBook.url} // ADDED: Link URL from API
                            target="_blank" // ADDED: Opens link in a new tab
                            rel="noopener noreferrer" // ADDED: Security best practice
                            className="similar-book-card" // Reusing the class for styling
                            style={{ textDecoration: 'none', color: 'inherit' }} // Ensures card doesn't look like a standard link
                        >
                            <img 
                                src={simBook.image} 
                                alt={`Cover of ${simBook.title}`} 
                                className="similar-book-image"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BookDetails;