import React, { useState } from 'react';
import './Searchbar.css';

export default function Searchbar() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Aquí puedes implementar la lógica de búsqueda
        console.log('Buscando:', searchTerm);
        // TODO: Conectar con el backend para buscar productos
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <nav className="searchbar">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                </div>
            </form>
        </nav>
    );
}