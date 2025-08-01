import React from "react";

function PerfilCard({ usuario_id, img_url, seguidores, seguir }) {
  return (
    <div className="bg-white p-4 rounded shadow hover:scale-105 transition-all">
      <img
        src={`http://localhost:3000${img_url}`}
        alt={usuario_id}
        className="w-full h-40 object-cover rounded-full"
      />
      <h3 className="text-xl font-bold text-gray-800">{usuario_id}</h3>
      <p className="text-gray-600 text-sm">Seguidores: {seguidores}</p>
      <button className="rounded bg-blue-500 text-white px-4 py-2 mt-2 hover:bg-blue-600 transition-all">
        {seguir}
      </button>
    </div>
  );
}

export default PerfilCard;