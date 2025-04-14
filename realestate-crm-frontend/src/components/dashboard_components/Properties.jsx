import React, { useState, useEffect } from 'react';
import "../../style/Properties.css";
import AddPropertyModel from './AddPropertyModel';

const Properties = () => {
    // State management
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        category: 'all',
        priceMin: '',
        priceMax: '',
        bedrooms: 'any',
        featured: false
    });
    const [sortOption, setSortOption] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isViewingDetails, setIsViewingDetails] = useState(false);

    // Add state for modal
    const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);

    // Fetch properties from API
    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5001/api/property/getAllProperty');

            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }

            const data = await response.json();
            console.log('Fetched properties:', data);

            // Check if data has the expected structure
            if (data && data.properties) {
                setProperties(data.properties);
            } else {
                console.error('Unexpected data structure:', data);
                setProperties([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    // Fetch properties on component mount
    useEffect(() => {
        fetchProperties();
    }, []);

    // Add function to open modal
    const openAddPropertyModal = () => {
        setIsAddPropertyModalOpen(true);
    };

    // Add function to close modal
    const closeAddPropertyModal = () => {
        setIsAddPropertyModalOpen(false);
        // Refresh properties after adding a new one
        fetchProperties();
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    // Apply filters and search
    const filteredProperties = properties.filter(property => {
        // Search term filter
        const matchesSearch =
            property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Type filter
        const matchesType = filters.type === 'all' || property.property_type === filters.type;

        // Category filter
        const matchesCategory = filters.category === 'all' || property.property_for === filters.category;

        // Price filter
        const aboveMinPrice = !filters.priceMin || property.price >= Number(filters.priceMin);
        const belowMaxPrice = !filters.priceMax || property.price <= Number(filters.priceMax);

        // Bedrooms filter
        const matchesBedrooms =
            filters.bedrooms === 'any' ||
            (filters.bedrooms === '4+' && property.bedrooms >= 4) ||
            property.bedrooms === Number(filters.bedrooms);

        // Featured filter
        const matchesFeatured = !filters.featured || property.featured;

        return matchesSearch && matchesType && matchesCategory &&
            aboveMinPrice && belowMaxPrice && matchesBedrooms && matchesFeatured;
    });

    // Sort properties
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        switch (sortOption) {
            case 'newest':
                return new Date(b.year_built) - new Date(a.year_built);
            case 'oldest':
                return new Date(a.year_built) - new Date(b.year_built);
            case 'priceHigh':
                return b.price - a.price;
            case 'priceLow':
                return a.price - b.price;
            default:
                return 0;
        }
    });

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            type: 'all',
            category: 'all',
            priceMin: '',
            priceMax: '',
            bedrooms: 'any',
            featured: false
        });
        setSearchTerm('');
    };

    // View property details
    const viewPropertyDetails = (property) => {
        setSelectedProperty(property);
        setIsViewingDetails(true);
    };

    // Close property details
    const closePropertyDetails = () => {
        setIsViewingDetails(false);
    };

    // Show loading state
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading properties...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={fetchProperties}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="property-container">
            <div className="property-controls">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by location, description, or features..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="property-search-input"
                    />
                </div>

                <div className="view-controls">
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid View
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        List View
                    </button>

                </div>
                <button
                    className="add-property-btn"
                    onClick={openAddPropertyModal}
                >
                    Add Property
                </button>
            </div>

            <div className="property-content">
                <aside className="property-filters">
                    <div className="filter-section">
                        <h3>Filters</h3>
                        <button className="reset-filters-btn" onClick={resetFilters}>Reset All</button>
                    </div>

                    <div className="filter-group">
                        <label>Property Type</label>
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All Types</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="land">Land</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All Categories</option>
                            <option value="sale">For Sale</option>
                            <option value="rent">For Rent</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Price Range</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                name="priceMin"
                                placeholder="Min"
                                value={filters.priceMin}
                                onChange={handleFilterChange}
                            />
                            <span className="price-separator">-</span>
                            <input
                                type="number"
                                name="priceMax"
                                placeholder="Max"
                                value={filters.priceMax}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Bedrooms</label>
                        <select
                            name="bedrooms"
                            value={filters.bedrooms}
                            onChange={handleFilterChange}
                        >
                            <option value="any">Any</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4+">4+</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={filters.featured}
                                onChange={handleFilterChange}
                            />
                            <span>Featured Properties Only</span>
                        </label>
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="priceLow">Price: Low to High</option>
                            <option value="priceHigh">Price: High to Low</option>
                        </select>
                    </div>
                </aside>
                <main className="property-listings">
                    <div className="listing-header">
                        <h2>
                            {sortedProperties.length}
                            {sortedProperties.length === 1 ? ' Property' : ' Properties'} Found
                        </h2>
                    </div>

                    {sortedProperties.length > 0 ? (
                        <div className={`property-grid ${viewMode}`}>
                            {sortedProperties.map(property => (
                                <div
                                    className="property-card"
                                    key={property.property_id}
                                    onClick={() => viewPropertyDetails(property)}
                                >
                                    <div className="property-image">
                                        {/* Using a placeholder image since we don't have actual image URLs */}
                                        <img
                                            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
                                            alt={property.name}
                                        />
                                        <span className="property-status">{property.status}</span>
                                        <span className="property-for">{property.property_for}</span>
                                    </div>

                                    <div className="property-details">
                                        <h3 className="property-title">{property.name}</h3>
                                        <p className="property-location">{property.location}</p>
                                        <div className="property-price">{formatPrice(property.price)}</div>
                                        <div className="property-features">
                                            <span className="feature">
                                                <i className="fas fa-bed"></i> {property.bedrooms} Beds
                                            </span>
                                            <span className="feature">
                                                <i className="fas fa-bath"></i> {property.bathrooms} Baths
                                            </span>
                                            <span className="feature">
                                                <i className="fas fa-ruler-combined"></i> {property.area} sq ft
                                            </span>
                                        </div>
                                        <p className="property-type">{property.property_type}</p>
                                        <div className="property-footer">
                                            <span className="property-agent">{property.contact_agent}</span>
                                            <span className="property-year">Built: {property.year_built}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-properties">
                            <p>No properties match your current filters.</p>
                            <button className="reset-search-btn" onClick={resetFilters}>Reset Filters</button>
                        </div>
                    )}
                </main>
            </div>

            {isViewingDetails && selectedProperty && (
                <div className="property-modal-overlay">
                    <div className="property-modal">
                        <button className="close-modal-btn" onClick={closePropertyDetails}>×</button>

                        <div className="property-modal-content">
                            <div className="property-modal-gallery">
                                {/* Using a placeholder image since we don't have actual image URLs */}
                                <img
                                    src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
                                    alt={selectedProperty.name}
                                    className="main-image"
                                />

                                <div className="thumbnail-gallery">
                                    {/* Using a placeholder image since we don't have actual image URLs */}
                                    <img
                                        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
                                        alt={selectedProperty.name}
                                        className="thumbnail"
                                    />
                                </div>
                            </div>

                            <div className="property-modal-info">
                                <div className="modal-header">
                                    <h2>{selectedProperty.name}</h2>
                                    <p className="modal-location">{selectedProperty.location}</p>
                                    <p className="modal-price">{formatPrice(selectedProperty.price)}</p>
                                </div>

                                <div className="modal-features">
                                    <div className="modal-feature">
                                        <span className="feature-label">Bedrooms</span>
                                        <span className="feature-value">{selectedProperty.bedrooms}</span>
                                    </div>

                                    <div className="modal-feature">
                                        <span className="feature-label">Bathrooms</span>
                                        <span className="feature-value">{selectedProperty.bathrooms}</span>
                                    </div>

                                    <div className="modal-feature">
                                        <span className="feature-label">Area</span>
                                        <span className="feature-value">{selectedProperty.area} sq ft</span>
                                    </div>

                                    <div className="modal-feature">
                                        <span className="feature-label">Year Built</span>
                                        <span className="feature-value">{selectedProperty.year_built}</span>
                                    </div>

                                    <div className="modal-feature">
                                        <span className="feature-label">Property Type</span>
                                        <span className="feature-value">
                                            {selectedProperty.property_type.charAt(0).toUpperCase() + selectedProperty.property_type.slice(1)}
                                        </span>
                                    </div>

                                    <div className="modal-feature">
                                        <span className="feature-label">Status</span>
                                        <span className="feature-value status-badge">
                                            {selectedProperty.status.charAt(0).toUpperCase() + selectedProperty.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="modal-description">
                                    <h3>Description</h3>
                                    <p>{selectedProperty.description}</p>
                                </div>

                                <div className="modal-amenities">
                                    <h3>Amenities</h3>
                                    <ul className="amenities-list">
                                        {/* Using a placeholder amenity since we don't have actual amenities */}
                                        <li className="amenity-item">Amenity 1</li>
                                    </ul>
                                </div>

                                <div className="modal-agent">
                                    <h3>Listed By</h3>
                                    <p>{selectedProperty.contact_agent}</p>
                                </div>

                                <div className="modal-actions">
                                    <button className="contact-agent-btn">Contact Agent</button>
                                    <button className="schedule-viewing-btn">Schedule Viewing</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Property Modal */}
            <AddPropertyModel
                isOpen={isAddPropertyModalOpen}
                onClose={closeAddPropertyModal}
            />
        </div>
    );
};

export default Properties;