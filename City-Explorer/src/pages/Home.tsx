import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Map, Globe, Umbrella } from 'lucide-react';
interface CityData {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
}

interface SuggestedCity {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

const Home: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedCity[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) return setSuggestions([]);

      try {
        const response = await fetch(
          `http://api.geonames.org/searchJSON?q=${encodeURIComponent(searchQuery)}&maxRows=5&username=mobe03`
        );
        const data = await response.json();
        const cities = data.geonames.map((g: any) => ({
          name: g.name,
          country: g.countryName,
          lat: parseFloat(g.lat),
          lng: parseFloat(g.lng),
        }));
        setSuggestions(cities);
        setShowDropdown(true);
      } catch (err) {
        console.error('Error fetching city suggestions:', err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
 const [featuredCities, setFeaturedCities] = React.useState<CityData[]>([]);

React.useEffect(() => {
  const fetchFeaturedCities = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/cities'); // Or axios.get()
      const allCities: CityData[] = await response.json();
      setFeaturedCities(allCities.slice(0, 3)); // Just grab 3
    } catch (err) {
      console.error('Error fetching featured cities:', err);
    }
  };

  fetchFeaturedCities();
}, []);

  const handleSelect = async (city: SuggestedCity) => {
  setShowDropdown(false);
  try {
    const res = await fetch('http://localhost:5005/api/lookup-city', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: city.name })
    });

    const savedCity = await res.json();
    navigate(`/cities/${savedCity.id}`);
  } catch (err) {
    console.error('Error saving city:', err);
  }
};

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Hero Section */}
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="relative p-8 md:p-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Cities</h1>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Explore detailed city data from around the world.
          </p>
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="w-full px-5 py-3 pr-12 rounded-full text-gray-800 focus:outline-none"
            />
            <Search className="absolute right-4 top-3.5 text-gray-500" />

            {showDropdown && suggestions.length > 0 && (
              <ul className=" bg-white shadow-lg rounded-md mt-2 max-h-60 overflow-y-auto divide-y divide-gray-200 border border-gray-200">
              {suggestions.map((city, i) => (
                <li
                  key={i}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center text-gray-800 text-sm transition-colors duration-150"
                  onClick={() => handleSelect(city)}
                >
                  <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                  <span>{city.name}, {city.country}</span>
                </li>
              ))}
            </ul>

            )}
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Featured Cities</h2>
          <button 
            onClick={() => navigate('/cities')}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View all
            <span className="ml-1">→</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCities.map(city => (
            <div 
              key={city.id}
              className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/cities/${city.id}`)}
            >
              <div 
                className="h-40 bg-cover bg-center" 
                style={{ backgroundImage: `url(${city.image})` }}
              ></div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{city.name}</h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {city.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 rounded-lg p-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Why Use City Explorer?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="bg-primary-100 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4">
              <Globe className="h-7 w-7 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Comprehensive Data</h3>
            <p className="text-gray-600">Detailed information about cities including demographics, landmarks, and local culture.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="bg-primary-100 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4">
              <Umbrella className="h-7 w-7 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Weather Insights</h3>
            <p className="text-gray-600">Up-to-date weather information and seasonal patterns to plan your visits.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="bg-primary-100 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4">
              <Map className="h-7 w-7 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Maps</h3>
            <p className="text-gray-600">Explore city layouts, districts, and points of interest with our interactive maps.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;