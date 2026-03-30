"use client";

import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface RestaurantCardProps {
  id?: string;
  name: string;
  image: string;
  rating: number;
  time: string;
  category: string;
  priceRange: string;
  isPromo?: boolean;
}

const RestaurantCard = ({ id = "1", name, image, rating, time, category, priceRange, isPromo }: RestaurantCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/delivery/restaurant/${id}`)}
      className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 active:scale-95"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        {isPromo && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
              PROMOÇÃO
            </Badge>
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm border border-slate-100">
          <Star className="text-orange-500 fill-orange-500" size={14} />
          <span className="text-xs font-black text-slate-800">{rating}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 uppercase tracking-tight">{name}</h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>{category}</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <span>{priceRange}</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 w-fit px-3 py-1.5 rounded-xl border border-emerald-100">
          <Clock size={14} />
          <span>{time} • FRETE GRÁTIS</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;