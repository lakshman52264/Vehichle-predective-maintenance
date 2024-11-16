// DataCard.js
import React from 'react';

const DataCard = ({ icon, title, description, link, className }) => {
  return (
    <a href={link} className={`${className} flex items-center p-6`}>
      <div className="flex-shrink-0 mr-4">
        {icon} {/* Display icon here */}
      </div>
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </a>
  );
};

export default DataCard;
