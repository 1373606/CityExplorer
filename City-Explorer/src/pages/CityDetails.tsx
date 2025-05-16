import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Cloud, ArrowLeft } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface City {
  id: string;
  name: string;
  country: string;
  description: string;
  population: number;
  timezone: string;
  latitude: number;
  longitude: number;
  currency: string;
  language: string;
  image: string;
  weather?: WeatherData; // optional now
}

const CityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchCityDetails = async () => {
    const response = await axios.get(`http://localhost:5005/api/cities/${id}`);
    return response.data;
  };

  const { data: city, isLoading, error } = useQuery<City>(
    ['city', id],
    fetchCityDetails,
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !city || !city.name || !city.country || !city.image) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">City not found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the city you're looking for.</p>
        <button
          onClick={() => navigate('/cities')}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Back to cities
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <button
        onClick={() => navigate('/cities')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all cities
      </button>

      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
        <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{city.name}</h1>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{city.country}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">About {city.name}</h2>
        <p className="text-gray-700 leading-body mb-6">{city.description}</p>

        <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">
          <div>
            <p className="text-gray-500 text-sm mb-1 flex items-center">
              <Users className="h-4 w-4 mr-1" /> Population
            </p>
            <p className="font-medium">{city.population.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Timezone
            </p>
            <p className="font-medium">{city.timezone}</p>
          </div>
        </div>
      </div>

      {/* Weather Section */}
      {city.weather && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
          <div className="text-center mb-4">
            <div className="flex justify-center">
              <Cloud className="h-12 w-12 text-primary-500" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold">{city.weather.temperature}°C</div>
              <div className="text-gray-600">{city.weather.condition}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div>
              <p className="text-gray-500 text-sm">Humidity</p>
              <p className="font-medium">{city.weather.humidity}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Wind</p>
              <p className="font-medium">{city.weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDetails;
