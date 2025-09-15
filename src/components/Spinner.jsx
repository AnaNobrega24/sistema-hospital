// src/components/Spinner.jsx
import React from 'react';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div 
        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#27ae60]"
        // A cor usada aqui é o mesmo verde do seu Header, para manter a consistência.
      >
      </div>
    </div>
  );
}