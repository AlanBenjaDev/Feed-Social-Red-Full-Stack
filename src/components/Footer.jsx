import React from "react";
function Footer({ piePag, parr, copyright }) {
  return (
    <footer className="bg-gradient-to-r from-gray-400 to-gray-400 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold mb-2">{piePag}</h3>
        <p className="text-md mb-1">{parr}</p>
        <p className="text-sm text-gray-400">{copyright}</p>
      </div>
    </footer>
  );
}

export default Footer;