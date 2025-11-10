import { useState, useEffect } from "react";
import "../index.css";

function BookForm({ onSubmit, initialData, isEditing, closeModal }) {
    
    const defaultFormState = {
        title: "", 
        author: "", 
        publisher: "", 
        publication_year: "", 
        language: "", 
        pages: "", 
        image: "", 
        isbn13: "" 
    };

    // FIX: Initialize formData directly from initialData when editing, 
    // or with defaults + new ISBN when adding. This eliminates the render delay 
    // caused by relying on useEffect.
    const [formData, setFormData] = useState(() => {
        if (initialData) {
            return initialData;
        }
        return { 
            ...defaultFormState, 
            isbn13: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        };
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        closeModal();
    };
    
    const modalTitle = isEditing ? "Edit Book Details" : "Add New Book";

    return(
        <div className="modal-container" onClick={(e) => {
            if (e.target.className === "modal-container") {
                closeModal();
            }
        }}>
            
            <div className="modal-form" onClick={(e) => e.stopPropagation()}> 
                <h2>{modalTitle}</h2> 
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label>Book Title:</label>
                        <input name="title" type="text" value={formData.title || ''} onChange={handleChange} placeholder="Book Title..." required></input>
                    </div>
                    <div className="form-control">
                        <label>Author:</label>
                        <input name="author" type="text" value={formData.author || ''} onChange={handleChange} placeholder="Author" required></input>
                    </div>
                    <div className="form-control">
                        <label>Publisher:</label>
                        <input name="publisher" type="text" value={formData.publisher || ''} onChange={handleChange} placeholder="Publisher" required></input>
                    </div>
                    <div className="form-control">
                        <label>Publication Year:</label>
                        <input name="publication_year" type="number" value={formData.publication_year || ''} onChange={handleChange} placeholder=" "></input>
                    </div>
                    <div className="form-control">
                        <label>Language:</label>
                        <input name="language" type="text" value={formData.language || ''} onChange={handleChange} placeholder="Language"></input>
                    </div>
                    <div className="form-control">
                        <label>Pages:</label>
                        <input name="pages" type="number" value={formData.pages || ''} onChange={handleChange} placeholder=" "></input>
                    </div>
                    <div className="form-control">
                        <label>Cover URL:</label>
                        <input name="image" type="text" value={formData.image || ''} onChange={handleChange} placeholder=" "></input>
                    </div>
                    
                    <button type="submit"> 
                        {isEditing ? "Update Details" : "Save Book"}
                    </button>
                    
                </form>
            </div>
        </div>
    )
}
    
export default BookForm;