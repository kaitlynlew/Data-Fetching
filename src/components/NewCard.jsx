import { useState } from "react";
import "../index.css";
import BookForm from "./BookForm.jsx"

function NewCard({ addBook }) { 
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    function openModal() {
        setIsModalOpen(true);
    }
    
    function closeModal() {
        setIsModalOpen(false);
    }

    const handleFormSubmit = (data) => {
        addBook(data);
    }

    return(
        <>
            <div className="new-card" onClick={openModal}>
                <span>New</span>
            </div>
            
            {isModalOpen && (
                <BookForm 
                    onSubmit={handleFormSubmit}
                    initialData={null}
                    isEditing={false}
                    closeModal={closeModal}
                />
            )}
        </>
    )
}

export default NewCard;