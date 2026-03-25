"use client";

import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  name: string;
  image: string;
  rating: number;
  time: string;
  category: string;
  priceRange: string;
  isPromo?: boolean;
}

const RestaurantCard = ({ name, image, rating, time, category, priceRange, isPromo }: RestaurantCardProps) => {
  return (
    <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative h-44 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        {isPromo && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-none px-3 py-1 rounded-full font-bold">
              PROMOÇÃO
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm border border-slate-100">
          <Star className="text-orange-500 fill-orange-500" size={14} />
          <span className="text-xs font-bold text-slate-800">{rating}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">{name}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>{category}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{priceRange}</span>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
          <Clock size={12} />
          <span>{time} • Frete Grátis</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;