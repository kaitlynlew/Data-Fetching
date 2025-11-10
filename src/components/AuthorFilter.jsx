import React from "react";
import "../index.css";

function AuthorFilter({ uniqueAuthors, authorFilter, onFilterChange }) {
    return (
        <div className="filter">
            Filter by Authors:
            <select
                className="filter-btn"
                value={authorFilter}
                onChange={onFilterChange}
            >
                <option value="">All</option>
                {uniqueAuthors.map((author) => (
                    <option key={author} value={author}>
                        {author}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default AuthorFilter;