import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function MedicAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <Sparkles size={36} className="text-indigo-500" />
          <h1 className="text-2xl font-bold">MedicAI</h1>
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
      {showImg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Photo Symptoms</h3>
              <button onClick={() => setShowImg(false)}><X size={24} /></button>
            </div>
            <div className="space-y-3">
              <button onClick={() => iRef.current.click()} className="w-full p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold">Upload Photo</button>
              <input ref={iRef} type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  const r = new FileReader();
                  r.onload = () => {
                    setShowImg(false);
                    setPage('chat');
                    setMsgs(p => [...p, 
                      { t: 'u', txt: 'I uploaded a photo' },
                      { t: 'a', txt: 'Thank you for sharing. Please describe what you\'re experiencing so I can provide better support.' }
                    ]);
                  };
                  r.readAsDataURL(f);
                }
              }} className="hidden" />
            </div>
          </div>
        </div>
      )}
      {showLayoutCustomize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${data.darkMode ? 'text-white' : ''}`}>Customize Layout</h3>
              <button onClick={() => setShowLayoutCustomize(false)}><X size={24} className={data.darkMode ? 'text-white' : ''} /></button>
            </div>
            <p className={`text-sm mb-4 ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select features to show on home screen:</p>
            <div className="space-y-2">
              {availableFeatures.map(feature => (
                <button
                  key={feature.id}
                  onClick={() => {
                    if (data.layout.includes(feature.id)) {
                      setData(p => ({ ...p, layout: p.layout.filter(id => id !== feature.id) }));
                    } else {
                      setData(p => ({ ...p, layout: [...p.layout, feature.id] }));
                    }
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition ${data.layout.includes(feature.id) ? 'border-blue-500 bg-blue-50 text-gray-900' : (data.darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200')}`}
                >
                  <span className={data.darkMode && !data.layout.includes(feature.id) ? 'text-white' : ''}>{feature.name}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowLayoutCustomize(false)} className={`w-full mt-4 p-3 bg-${getAccent().primary} text-white rounded-xl font-semibold`}>Done</button>
          </div>
        </div>
      )}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm max-h-5/6 overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${data.darkMode ? 'text-white' : ''}`}>Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)}><X size={24} className={data.darkMode ? 'text-white' : ''} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-semibold mb-2 block ${data.darkMode ? 'text-white' : ''}`}>Name</label>
                <input type="text" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} className={`w-full p-3 ${data.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50'} border rounded-xl`} />
              </div>
              <div>
                <label className={`text-sm font-semibold mb-2 block ${data.darkMode ? 'text-white' : ''}`}>Age</label>
                <input type="number" value={data.age} onChange={(e) => setData({...data, age: e.target.value})} className={`w-full p-3 ${data.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50'} border rounded-xl`} />
              </div>
              <div>
                <label className={`text-sm font-semibold mb-2 block ${data.darkMode ? 'text-white' : ''}`}>Weight (lbs)</label>
                <input type="number" value={data.weight} onChange={(e) => setData({...p

