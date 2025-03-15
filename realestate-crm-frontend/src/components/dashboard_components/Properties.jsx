import React, { useState, useEffect } from 'react';
import "../../style/Properties.css";

const Properties = () => {
    // Sample property data
    const initialProperties = [
        {
            id: 1,
            title: 'Modern Waterfront Villa',
            address: '123 Ocean Drive',
            city: 'Miami',
            state: 'FL',
            price: 850000,
            type: 'residential',
            category: 'sale',
            bedrooms: 4,
            bathrooms: 3,
            area: 2500,
            yearBuilt: 2018,
            description: 'Luxurious waterfront villa with panoramic ocean views, private pool, and modern amenities.',
            amenities: ['Pool', 'Garden', 'Garage', 'Security System', 'Ocean View'],
            status: 'available',
            featured: true,
            images: [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
                'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
            ],
            agent: 'John Smith',
            createdAt: '2023-01-15'
        },
        {
            id: 2,
            title: 'Downtown Luxury Apartment',
            address: '456 Main Street, #802',
            city: 'New York',
            state: 'NY',
            price: 5000,
            type: 'residential',
            category: 'rent',
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            yearBuilt: 2015,
            description: 'Modern apartment in the heart of downtown with city views and high-end finishes.',
            amenities: ['Gym', 'Doorman', 'Rooftop Terrace', 'Laundry', 'City View'],
            status: 'available',
            featured: true,
            images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
            ],
            agent: 'Jane Doe',
            createdAt: '2023-02-20'
        },
        {
            id: 3,
            title: 'Cozy Suburban Home',
            address: '789 Elm Street',
            city: 'Chicago',
            state: 'IL',
            price: 425000,
            type: 'residential',
            category: 'sale',
            bedrooms: 3,
            bathrooms: 2,
            area: 1800,
            yearBuilt: 2005,
            description: 'Charming family home in a peaceful suburban neighborhood with a spacious backyard.',
            amenities: ['Backyard', 'Garage', 'Fireplace', 'Basement', 'Patio'],
            status: 'available',
            featured: false,
            images: [
                'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
                'https://images.unsplash.com/photo-1576941089067-2de3c901e126',
            ],
            agent: 'Robert Brown',
            createdAt: '2023-03-10'
        },
        {
            id: 4,
            title: 'Commercial Office Space',
            address: '101 Business Plaza',
            city: 'San Francisco',
            state: 'CA',
            price: 750000,
            type: 'commercial',
            category: 'sale',
            bedrooms: 0,
            bathrooms: 2,
            area: 3000,
            yearBuilt: 2010,
            description: 'Prime location office space with modern amenities and excellent accessibility.',
            amenities: ['Conference Room', 'Parking', 'Security', 'Reception Area', 'High-Speed Internet'],
            status: 'available',
            featured: false,
            images: [
                'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
            ],
            agent: 'Michael Johnson',
            createdAt: '2023-04-05'
        },
        {
            id: 5,
            title: 'Beachfront Condominium',
            address: '555 Shoreline Drive, #301',
            city: 'San Diego',
            state: 'CA',
            price: 3500,
            type: 'residential',
            category: 'rent',
            bedrooms: 3,
            bathrooms: 2,
            area: 1600,
            yearBuilt: 2012,
            description: 'Stunning beachfront condo with direct access to the beach and resort-style amenities.',
            amenities: ['Beach Access', 'Pool', 'Fitness Center', 'Balcony', 'Gated Community'],
            status: 'available',
            featured: true,
            images: [
                'https://images.unsplash.com/photo-1523217582562-09d0def993a6',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858',
            ],
            agent: 'Sarah Wilson',
            createdAt: '2023-05-12'
        }
    ];

    // State management
    const [properties, setProperties] = useState(initialProperties);
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

    // Apply filters and search
    const filteredProperties = properties.filter(property => {
        // Search term filter
        const matchesSearch =
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Type filter
        const matchesType = filters.type === 'all' || property.type === filters.type;

        // Category filter
        const matchesCategory = filters.category === 'all' || property.category === filters.category;

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
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
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

    // Format price
    const formatPrice = (price, category) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price) + (category === 'rent' ? '/month' : '');
    };

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
                                    key={property.id}
                                    onClick={() => viewPropertyDetails(property)}
                                >
                                    <div className="property-image">
                                        <img src={`${property.images[0]}?auto=format&fit=crop&w=600&q=80`} alt={property.title} />
                                        {property.featured && <span className="featured-tag">Featured</span>}
                                        <span className={`status-tag ${property.status}`}>{property.status}</span>
                                        <span className="category-tag">{property.category === 'rent' ? 'For Rent' : 'For Sale'}</span>
                                    </div>

                                    <div className="property-details">
                                        <h3 className="property-title">{property.title}</h3>
                                        <p className="property-location">
                                            {property.address}, {property.city}, {property.state}
                                        </p>
                                        <p className="property-price">{formatPrice(property.price, property.category)}</p>

                                        <div className="property-features">
                                            {property.bedrooms > 0 && (
                                                <span className="feature">
                                                    <i className="feature-icon bed-icon"></i>
                                                    {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                                                </span>
                                            )}

                                            {property.bathrooms > 0 && (
                                                <span className="feature">
                                                    <i className="feature-icon bath-icon"></i>
                                                    {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                                                </span>
                                            )}

                                            <span className="feature">
                                                <i className="feature-icon area-icon"></i>
                                                {property.area} sq ft
                                            </span>
                                        </div>

                                        <div className="property-actions">
                                            <button className="view-details-btn">View Details</button>
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
                                <img
                                    src={`${selectedProperty.images[0]}?auto=format&fit=crop&w=1200&q=80`}
                                    alt={selectedProperty.title}
                                    className="main-image"
                                />

                                <div className="thumbnail-gallery">
                                    {selectedProperty.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${image}?auto=format&fit=crop&w=200&q=80`}
                                            alt={`${selectedProperty.title} - Image ${index + 1}`}
                                            className="thumbnail"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="property-modal-info">
                                <div className="modal-header">
                                    <h2>{selectedProperty.title}</h2>
                                    <p className="modal-location">{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state}</p>
                                    <p className="modal-price">{formatPrice(selectedProperty.price, selectedProperty.category)}</p>
                                </div>

                                <div className="modal-features">
                                    {selectedProperty.bedrooms > 0 && (
                                        <div className="modal-feature">
                                            <span className="feature-label">Bedrooms</span>
                                            <span className="feature-value">{selectedProperty.bedrooms}</span>
                                        </div>
                                    )}

                                    {selectedProperty.bathrooms > 0 && (
                                        <div className="modal-feature">
                                            <span className="feature-label">Bathrooms</span>
                                            <span className="feature-value">{selectedProperty.bathrooms}</span>
                                        </div>
                                    )}

                                    <div className="modal-feature">
                                        <span className="feature-label">Area</span>
                                        <span className="feature-value">{selectedProperty.area} sq ft</span>
                                    </div>

                                    <div className="modal-feature">
                                        <span className="feature-label">Year Built</span>
                                        <span className="feature-value">{selectedProperty.yearBuilt}</span>
                                    </div>

                                    <div className="modal-feature">
                                        <span className="feature-label">Property Type</span>
                                        <span className="feature-value">
                                            {selectedProperty.type.charAt(0).toUpperCase() + selectedProperty.type.slice(1)}
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
                                        {selectedProperty.amenities.map((amenity, index) => (
                                            <li key={index} className="amenity-item">{amenity}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="modal-agent">
                                    <h3>Listed By</h3>
                                    <p>{selectedProperty.agent}</p>
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
        </div>
    );
};

export default Properties;