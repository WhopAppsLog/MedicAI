import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function MedicAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <Sparkles size={36} className="text-indigo-500" />
          <h1 className="text-2xl font-bold">MedicAI (clean)</h1>
        </div>
        <p className="mt-4 text-gray-600">The app is running. Replace this stub with your full MedicAI component when you're ready.</p>
        <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
          <Heart size={16} className="text-pink-500" />
          <span>Ready for Vercel deployment (build target: dist)</span>
        </div>
      </div>
    </div>
  );
}
