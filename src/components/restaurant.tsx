import React from "react";

interface IrestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IrestaurantProps> = ({ coverImg, name, categoryName }) => (
  <div>
    <div style={{ backgroundImage: `url('data:image/jpeg;base64, ${coverImg}')` }} className="bg-red-500 bg-cover bg-center mb-3 py-28"></div>
    <h3 className="text-xl font-medium">{name}</h3>
    <span className="=border-t-2 border-gray-200">{categoryName}</span>
  </div>
);
