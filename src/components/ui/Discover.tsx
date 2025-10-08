"use client";

import { useState } from "react";
import { DiscoveryCard } from "./DiscoveryCard";
import { Button } from "./button";
import { Input } from "./input";
import { Search, Filter, MapPin } from "lucide-react";

// Mock data for demonstration
const mockDogs = [
  {
    id: 1,
    name: "Buddy the Dog",
    breed: "Golden Retriever",
    age: 3,
    size: "Large",
    location: "Downtown, Los Angeles",
    owner: "Steve Jobs",
    description: "Friendly and energetic, loves playing fetch and swimming!",
    energyLevel: "High",
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: false,
  },
  {
    id: 2,
    name: "Luna",
    breed: "Chihuahua",
    age: 2,
    size: "Small",
    location: "Griffith Park",
    owner: "Kevin Jijon",
    description: "Smart and energetic, perfect for outdoor adventures!",
    energyLevel: "Very High",
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: true,
  },
];

export const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedEnergy, setSelectedEnergy] = useState("all");
  const [filteredDogs, setFilteredDogs] = useState(mockDogs);

  const handleSearch = () => {
    let filtered = mockDogs;

    if (searchTerm) {
      filtered = filtered.filter(
        (dog) =>
          dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dog.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dog.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSize !== "all") {
      filtered = filtered.filter((dog) => dog.size === selectedSize);
    }

    if (selectedEnergy !== "all") {
      filtered = filtered.filter((dog) => dog.energyLevel === selectedEnergy);
    }

    setFilteredDogs(filtered);
  };

  const handleFilterChange = () => {
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Dogs</h1>
          <p className="text-lg text-gray-600">
            Find the perfect playmate for your furry friend!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, breed, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                handleFilterChange();
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>

            {/* Energy Level Filter */}
            <select
              value={selectedEnergy}
              onChange={(e) => {
                setSelectedEnergy(e.target.value);
                handleFilterChange();
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Energy Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>

            {/* Search Button */}
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredDogs.length} dog{filteredDogs.length !== 1 ? "s" : ""} matching your criteria
          </p>
        </div>

        {/* Dog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDogs.map((dog) => (
            <DiscoveryCard key={dog.id} dog={dog} />
          ))}
        </div>

        {/* No Results */}
        {filteredDogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No dogs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};