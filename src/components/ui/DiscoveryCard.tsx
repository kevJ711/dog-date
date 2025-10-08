"use client";

import { useState } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Heart, MapPin, Calendar, MessageCircle, Star } from "lucide-react";

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  size: string;
  location: string;
  owner: string;
  description: string;
  energyLevel: string;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
}

interface DiscoveryCardProps {
  dog: Dog;
}

export const DiscoveryCard = ({ dog }: DiscoveryCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleRequestPlaydate = () => {
    // TODO: Implement playdate request functionality
    console.log(`Requesting playdate with ${dog.name}`);
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log(`Messaging ${dog.owner} about ${dog.name}`);
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case "Low":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "High":
        return "text-orange-600 bg-orange-100";
      case "Very High":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case "Small":
        return "text-blue-600 bg-blue-100";
      case "Medium":
        return "text-purple-600 bg-purple-100";
      case "Large":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header Section with Badges */}
      <div className="relative p-4 bg-gray-50 border-b">
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorited ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Energy Level Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getEnergyColor(
              dog.energyLevel
            )}`}
          >
            {dog.energyLevel} Energy
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{dog.name}</h3>
            <p className="text-gray-600">{dog.breed}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Age {dog.age}</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSizeColor(
                dog.size
              )}`}
            >
              {dog.size}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{dog.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {dog.description}
        </p>

        {/* Compatibility Icons */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-600">
              {dog.goodWithKids ? "Kids ✓" : "Kids ✗"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">
              {dog.goodWithDogs ? "Dogs ✓" : "Dogs ✗"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-600">
              {dog.goodWithCats ? "Cats ✓" : "Cats ✗"}
            </span>
          </div>
        </div>

        {/* Owner Info */}
        <div className="text-sm text-gray-500 mb-4">
          Owner: <span className="font-medium">{dog.owner}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleRequestPlaydate}
            className="flex-1 flex items-center gap-2"
            size="sm"
          >
            <Calendar className="w-4 h-4" />
            Request Playdate
          </Button>
          <Button
            onClick={handleMessage}
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};