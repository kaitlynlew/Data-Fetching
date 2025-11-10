import React, { useState, useMemo, useEffect } from "react";
import "../index.css";

const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function LoanForm({ books, loans, onLoanBook }) {
    const [borrower, setBorrower] = useState("");
    const [selectedIsbn, setSelectedIsbn] = useState("");
    const [loanPeriod, setLoanPeriod] = useState(1);
    const loanedIsbns = useMemo(() => new Set(loans.map(loan => loan.isbn13)), [loans]);
    const availableBooks = useMemo(() => 
        books.filter(book => !loanedIsbns.has(book.isbn13))
    , [books, loanedIsbns]);

    const allBooksLoaned = availableBooks.length === 0;

    useEffect(() => {
        if (availableBooks.length > 0 && selectedIsbn === "") {
            setSelectedIsbn(availableBooks[0].isbn13);
        }
        if (selectedIsbn && loanedIsbns.has(selectedIsbn)) {
            setSelectedIsbn(availableBooks.length > 0 ? availableBooks[0].isbn13 : "");
        }
    }, [availableBooks, selectedIsbn, loanedIsbns]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!borrower.trim() || !selectedIsbn || loanPeriod < 1 || loanPeriod > 4) {
            alert("Please fill out all fields correctly and select a book.");
            return;
        }

        const today = new Date();
        const dueDate = new Date(today.getTime() + loanPeriod * 7 * 24 * 60 * 60 * 1000);

        onLoanBook({
            borrower: borrower.trim(),
            isbn13: selectedIsbn,
            dueDate: dueDate.toISOString(),
        });

        setBorrower("");
    };

    if (allBooksLoaned) {
        return (
            <div className="loan-section-container">
                <h2 style={{color: '#90a254'}}>Loan Creation Form</h2>
                <p style={{fontSize: '1.2rem', padding: '20px', backgroundColor: '#fef4e0', borderRadius: '5px', textAlign: 'center', border: '1px solid #90a254'}}>
                    There are currently no available books to borrow.
                </p>
            </div>
        );
    }

    return (
        <div className="loan-section-container">
            <h2 style={{color: '#90a254'}}>Loan Creation Form</h2>
            <form onSubmit={handleSubmit} className="loan-form">
                <div className="form-control-loan">
                    <label htmlFor="borrower">Borrower:</label>
                    <input
                        id="borrower"
                        type="text"
                        value={borrower}
                        onChange={(e) => setBorrower(e.target.value)}
                        placeholder="Borrower Name"
                        required
                    />
                </div>

                <div className="form-control-loan">
                    <label htmlFor="book">Book to Loan:</label>
                    <select
                        id="book"
                        value={selectedIsbn}
                        onChange={(e) => setSelectedIsbn(e.target.value)}
                        required
                        className="loan-select-input"
                    >
                        {availableBooks.map(book => (
                            <option key={book.isbn13} value={book.isbn13}>
                                {book.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control-loan">
                    <label htmlFor="period">Loan Period (weeks):</label>
                    <input
                        id="period"
                        type="number"
                        min="1"
                        max="4"
                        value={loanPeriod}
                        onChange={(e) => setLoanPeriod(Math.max(1, Math.min(4, Number(e.target.value))))}
                        required
                    />
                </div>
                
                <button type="submit" className="loan-submit-btn">
                    Create Loan
                </button>
            </form>
        </div>
    );
}

function LoanList({ books, loans }) {
    const loanedBooksDetails = useMemo(() => {
        return loans.map(loan => {
            const book = books.find(b => b.isbn13 === loan.isbn13);
            const dueDate = new Date(loan.dueDate);
            return {
                ...loan,
                title: book ? book.title : 'Unknown Book',
                dueDateString: formatDate(dueDate),
            };
        });
    }, [books, loans]);

    return (
        <div className="loan-section-container">
            <h2 style={{color: '#90a254'}}>Currently Loaned Books</h2>
            {loanedBooksDetails.length === 0 ? (
                <p style={{fontStyle: 'italic'}}>No books are currently on loan.</p>
            ) : (
                <ul className="loan-list">
                    {loanedBooksDetails.map(loan => (
                        <li key={loan.isbn13} className="loan-item">
                            <div className="loan-details">
                                <span style={{fontWeight: 'bold', color: '#657337'}}>Borrower:</span> {loan.borrower} <br/>
                                <span style={{fontWeight: 'bold', color: '#657337'}}>Book:</span> {loan.title} <br/>
                                <span style={{fontWeight: 'bold', color: '#657337'}}>Due Date:</span> {loan.dueDateString}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function LoanManager({ books, loans, onLoanBook, onSwitchView }) {
    return (
        // The container is used for centering/padding for the entire Loan View
        <div className="loan-manager-content"> 
            <LoanForm books={books} loans={loans} onLoanBook={onLoanBook} />
            <LoanList books={books} loans={loans} />
        </div>
    );
}

export default LoanManager;