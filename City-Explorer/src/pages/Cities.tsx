import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface City {
  id: string;
  name: string;
  country: string;
  population: number;
  timezone: string;
  image: string;
}

const Cities: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get search query from URL params
  const searchParams = new URLSearchParams(location.search);
  const urlSearchQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    minPopulation: '',
    maxPopulation: '',
  });

  // Update search bar when URL changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Fetch cities data from backend
  const fetchCities = async () => {
    const response = await axios.get('http://localhost:5005/api/cities', {
      params: {
        search: searchQuery,
        country: filters.country,
        minPopulation: filters.minPopulation,
        maxPopulation: filters.maxPopulation,
      },
    });
    return response.data;
  };

  // Use react-query to fetch and cache data
  const { data, isLoading, error, refetch } = useQuery<City[]>(
    ['cities', searchQuery, filters],
    fetchCities,
    {
      enabled: false, // Don't fetch automatically
      keepPreviousData: true,
    }
  );

  // Ensure cities is always an array
  const cities = Array.isArray(data) ? data : [];

  // Trigger fetch when search or filters change
  useEffect(() => {
    refetch();
  }, [searchQuery, filters, refetch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    navigate({ pathname: '/cities', search: params.toString() });
    refetch();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      minPopulation: '',
      maxPopulation: '',
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cities: {(error as Error).message}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Explore Cities</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        >
          <Filter className="h-4 w-4 mr-1" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city or country..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-3 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700">Filter Results</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Filter by country"
              />
            </div>

            <div>
              <label htmlFor="minPopulation" className="block text-sm font-medium text-gray-700 mb-1">
                Min Population
              </label>
              <input
                type="number"
                id="minPopulation"
                name="minPopulation"
                value={filters.minPopulation}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Minimum"
              />
            </div>

            <div>
              <label htmlFor="maxPopulation" className="block text-sm font-medium text-gray-700 mb-1">
                Max Population
              </label>
              <input
                type="number"
                id="maxPopulation"
                name="maxPopulation"
                value={filters.maxPopulation}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Maximum"
              />
            </div>
          </div>
        </div>
      )}

      <p className="text-gray-600">
        {cities.length} {cities.length === 1 ? 'city' : 'cities'} found
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div
            key={city.id}
            className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/cities/${city.id}`)}
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${city.image})` }}
            ></div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{city.name}</h2>
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {city.country}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Population</p>
                    <p className="font-medium">{city.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Timezone</p>
                    <p className="font-medium">{city.timezone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     {cities.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-600 mb-4 text-lg">
      No cities found matching your search.
    </p>
    <p className="text-gray-500 mb-6">
      Would you like to add <strong className="text-primary-600">{searchQuery}</strong> to the city list?
    </p>
    <button
      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      onClick={async () => {
        try {
          const res = await fetch('http://localhost:5005/api/lookup-city', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: searchQuery }),
          });

          const savedCity = await res.json();
          if (savedCity?.id) {
            navigate(`/cities/${savedCity.id}`);
          } else {
            alert('Could not fetch city details from external sources.');
          }
        } catch (err) {
          console.error('Error adding city:', err);
          alert('Failed to add city. Try again later.');
        }
      }}
    >
      Search “{searchQuery}”
    </button>
  </div>
)}

    </div>
  );
};

export default Cities;