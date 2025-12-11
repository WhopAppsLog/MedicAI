import React, { useState, useEffect, useRef } from 'react';
import { Camera, Home, Pill, User, Send, Plus, X, Upload, Settings, MessageSquare, Heart, Sparkles, Brain } from 'lucide-react';

export default function MedicAI() {
  const [page, setPage] = useState('onboarding');
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState({
    name: '', age: '', weight: '', gender: '', activity: '', history: '', conditions: [],
    pic: null, meds: [], score: 45, water: [], wLog: [], mentalCheckins: [], therapySessions: [],
    darkMode: false, language: 'english', accentColor: 'blue', 
    layout: ['water', 'weight', 'meds', 'photo', 'checkin', 'therapy', 'activity', 'profile'],
    medStreak: 0, lastMedCheck: null, activities: [], totalActivityTime: 0, totalCalories: 0,
    healthTasks: []
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLayoutCustomize, setShowLayoutCustomize] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityStep, setActivityStep] = useState(0);
  const [activityData, setActivityData] = useState({ type: '', time: 0, search: '' });
  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState('');
  const [load, setLoad] = useState(false);
  const [profileTab, setProfileTab] = useState('info');
  const [showSettings, setShowSettings] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showTherapy, setShowTherapy] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', time: '' });
  const [wt, setWt] = useState(150);
  const [cam, setCam] = useState(false);
  const [checkin, setCheckin] = useState({ mood: '', energy: '', stress: '', notes: '' });
  const [therapyMsgs, setTherapyMsgs] = useState([]);
  const [therapyMsg, setTherapyMsg] = useState('');
  const [therapyLoad, setTherapyLoad] = useState(false);
  const vRef = useRef(null);
  const cRef = useRef(null);
  const fRef = useRef(null);
  const iRef = useRef(null);
  const eRef = useRef(null);
  const tRef = useRef(null);

  useEffect(() => {
    const s = sessionStorage.getItem('ma');
    if (s) {
      const p = JSON.parse(s);
      setData(p);
      if (p.name) setPage('home');
    }
  }, []);

  useEffect(() => {
    if (data.name) sessionStorage.setItem('ma', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (eRef.current) eRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  useEffect(() => {
    if (tRef.current) tRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [therapyMsgs]);

  const hasSymptoms = (text) => {
    const symptoms = ['pain', 'hurt', 'ache', 'sore', 'fever', 'cough', 'sick', 'nausea', 'dizzy', 'tired', 'fatigue', 'rash', 'itch', 'bleed', 'vomit'];
    return symptoms.some(s => text.toLowerCase().includes(s));
  };

  const aiResponse = (input, prevMsgs = []) => {
    const lower = input.toLowerCase();
    const isFollowUp = prevMsgs.length > 0;
    
    // If it's a follow-up response (continuing conversation)
    if (isFollowUp) {
      const lastAI = prevMsgs.filter(m => m.t === 'a').pop();
      
      if (lastAI && lastAI.txt.includes('scale of 1-10')) {
        return "Thank you for sharing that. Based on what you're telling me, here's what I think: Rest is important. Stay hydrated and monitor how you're feeling. If things get worse or you develop new symptoms, it would be good to check in with a doctor. Is there anything specific you're worried about?";
      }
      
      if (lastAI && lastAI.txt.includes('How long')) {
        return "I see. Given the timeline you mentioned, here are some thoughts: Most minor issues improve with time and self-care. Make sure you're getting enough rest and staying comfortable. If symptoms persist beyond a week or get significantly worse, definitely reach out to a healthcare provider. What other questions do you have?";
      }
      
      // General follow-up
      return "I understand. Thanks for providing more details. Is there anything else you'd like to know, or any other way I can help you today?";
    }
    
    // First message - check for symptoms
    if (hasSymptoms(input)) {
      if (lower.includes('sore') || lower.includes('throat')) {
        return "A sore throat can be uncomfortable. Can you tell me more? How long have you had it? On a scale of 1-10, how bad is the pain? Any fever or difficulty swallowing?";
      } else if (lower.includes('headache')) {
        return "Headaches are pretty common. Tell me more about it - when did it start? Is it a dull ache or sharp pain? Have you tried anything for it yet?";
      } else if (lower.includes('fever')) {
        return "A fever usually means your body is fighting something. How high is your temperature? Do you have any other symptoms along with it?";
      } else if (lower.includes('cough')) {
        return "I hear you have a cough. Is it dry or are you bringing anything up? How long has this been going on?";
      } else {
        return "Tell me more about what you're experiencing. When did this start? How would you rate the severity? Any other symptoms I should know about?";
      }
    }
    
    // Medical questions
    if (lower.includes('what is') || lower.includes('tell me about') || lower.includes('how does')) {
      if (lower.includes('diabetes')) {
        return "Diabetes is when your body has trouble managing blood sugar. There are different types - Type 1 is usually genetic and starts young, Type 2 is often related to lifestyle. People manage it with diet, exercise, and sometimes medication. What specifically about diabetes interests you?";
      } else if (lower.includes('blood pressure')) {
        return "Blood pressure is the force of blood against your artery walls. High blood pressure can be managed through healthy eating, exercise, stress management, and sometimes medication. Are you concerned about your own blood pressure?";
      } else if (lower.includes('covid')) {
        return "COVID-19 symptoms range from mild to severe - fever, cough, fatigue, loss of taste or smell are common. Most people recover at home with rest and fluids. Are you experiencing symptoms or just curious?";
      } else if (lower.includes('cancer')) {
        return "Cancer is a broad term for many different diseases where cells grow abnormally. Treatment and outcomes vary widely depending on the type. Early detection makes a big difference. What aspect of cancer would you like to know more about?";
      } else {
        return "That's a good question. I'd be happy to explain more. What specifically would you like to understand better?";
      }
    }
    
    // Greetings
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hi there! How can I help you today?";
    }
    
    // Thanks
    if (lower.includes('thank')) {
      return "You're welcome! Let me know if you need anything else.";
    }
    
    // Default
    return "I'm here to help! You can ask me health questions, describe symptoms, or just chat about wellness topics. What's on your mind?";
  };

  const therapyResponse = (input) => {
    const lower = input.toLowerCase();
    if (lower.includes('anxious') || lower.includes('anxiety')) {
      return "I hear that you're feeling anxious. That must be difficult. Can you tell me more about what's triggering these feelings?";
    } else if (lower.includes('sad') || lower.includes('depressed')) {
      return "Thank you for sharing. It takes courage to acknowledge difficult emotions. What's been contributing to these feelings?";
    } else if (lower.includes('stress') || lower.includes('overwhelm')) {
      return "It sounds like you're carrying a lot. What aspects feel most pressing? Let's explore this together.";
    }
    return "I'm listening. Your feelings are valid. Would you like to tell me more about what's on your mind?";
  };

  const calc = () => {
    let s = 45;
    const a = parseInt(data.age) || 0;
    if (a < 30) s += 5;
    else if (a > 60) s -= 5;
    const w = parseFloat(data.weight) || 0;
    if (w < 150) s += 3;
    else if (w > 250) s -= 10;
    if (data.activity === 'High') s += 10;
    else if (data.activity === 'Low') s -= 10;
    s -= data.meds.length * 2;
    if (data.water.length > 7) s += 5;
    if (data.wLog.length > 0) s += 3;
    if (data.mentalCheckins.length > 7) s += 5;
    s = Math.max(0, Math.min(100, s));
    setData(p => ({ ...p, score: s }));
    return s;
  };

  const grade = (s) => {
    if (s >= 90) return { g: 'A', l: 'Optimal', c: 'bg-green-500' };
    if (s >= 75) return { g: 'B', l: 'Sub-Optimal', c: 'bg-lime-500' };
    if (s >= 60) return { g: 'C', l: 'Compensating', c: 'bg-yellow-500' };
    if (s >= 45) return { g: 'D', l: 'Compromised', c: 'bg-orange-500' };
    return { g: 'F', l: 'Failing', c: 'bg-red-500' };
  };

  const send = async () => {
    if (!msg.trim()) return;
    const currentMsg = msg;
    const currentMsgs = [...msgs];
    setMsgs(p => [...p, { t: 'u', txt: currentMsg }]);
    setMsg('');
    setLoad(true);
    await new Promise(r => setTimeout(r, 1500));
    setMsgs(p => [...p, { t: 'a', txt: aiResponse(currentMsg, currentMsgs) }]);
    setLoad(false);
  };

  const sendTherapy = async () => {
    if (!therapyMsg.trim()) return;
    setTherapyMsgs(p => [...p, { t: 'u', txt: therapyMsg }]);
    const currentMsg = therapyMsg;
    setTherapyMsg('');
    setTherapyLoad(true);
    await new Promise(r => setTimeout(r, 1500));
    setTherapyMsgs(p => [...p, { t: 'a', txt: therapyResponse(currentMsg) }]);
    setTherapyLoad(false);
  };

  const saveCheckin = () => {
    const entry = { ...checkin, date: new Date().toISOString() };
    setData(p => ({ ...p, mentalCheckins: [...p.mentalCheckins, entry] }));
    setCheckin({ mood: '', energy: '', stress: '', notes: '' });
    setShowCheckin(false);
    calc();
  };

  const doReset = () => {
    sessionStorage.removeItem('ma');
    setData({ name: '', age: '', weight: '', gender: '', activity: '', history: '', conditions: [], pic: null, meds: [], score: 45, water: [], wLog: [], mentalCheckins: [], therapySessions: [], darkMode: false, language: 'english', accentColor: 'blue', layout: ['water', 'weight', 'meds', 'photo', 'checkin', 'therapy', 'profile'] });
    setMsgs([]);
    setStep(0);
    setPage('onboarding');
    setShowReset(false);
    setShowSettings(false);
  };

  const availableFeatures = [
    { id: 'water', name: 'Log Water', icon: '💧', color: 'blue' },
    { id: 'weight', name: 'Log Weight', icon: '⚖️', color: 'green' },
    { id: 'meds', name: 'Medications', icon: 'pill', color: 'pink' },
    { id: 'photo', name: 'Photo', icon: 'camera', color: 'teal' },
    { id: 'checkin', name: 'Check-in', icon: 'brain', color: 'purple' },
    { id: 'therapy', name: 'AI Therapy', icon: 'heart', color: 'indigo' },
    { id: 'profile', name: 'Profile', icon: 'user', color: 'green' }
  ];

  const accentColors = {
    blue: { primary: 'blue-500', hover: 'blue-600', light: 'blue-100' },
    purple: { primary: 'purple-500', hover: 'purple-600', light: 'purple-100' },
    green: { primary: 'green-500', hover: 'green-600', light: 'green-100' },
    pink: { primary: 'pink-500', hover: 'pink-600', light: 'pink-100' },
    indigo: { primary: 'indigo-500', hover: 'indigo-600', light: 'indigo-100' },
    red: { primary: 'red-500', hover: 'red-600', light: 'red-100' }
  };

  const getAccent = () => accentColors[data.accentColor] || accentColors.blue;

  const setup = () => {
    setProgress(0);
    const int = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(int);
          setTimeout(() => {
            setPage('home');
            calc();
          }, 500);
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  if (progress > 0 && progress < 100) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
            <Sparkles size={64} className="text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Setting Up</h2>
          <p className="text-gray-600 mb-8">Analyzing...</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-4xl font-bold">{progress}%</p>
        </div>
      </div>
    );
  }

  if (page === 'onboarding') {
    const qs = [
      { l: 'What is your name?', f: 'name', t: 'text' },
      { l: 'How old are you?', f: 'age', t: 'number' },
      { l: 'Weight (lbs)?', f: 'weight', t: 'number' },
      { l: 'Gender?', f: 'gender', t: 'choice', o: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
      { l: 'Activity level?', f: 'activity', t: 'choice', o: ['Low', 'Medium', 'High'] },
      { l: 'Health conditions?', f: 'conditions', t: 'multi', o: ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'None'] },
      { l: 'Medical history (optional)', f: 'history', t: 'textarea' }
    ];
    const q = qs[step];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
              <Heart size={64} className="animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold mb-2">MedicAI</h1>
            <p className="text-blue-100 text-lg">Your Health Companion</p>
          </div>
          <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {qs.map((_, i) => (
                  <div key={i} className={`h-2 flex-1 mx-1 rounded-full transition-all ${i <= step ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-200'}`}></div>
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-6">{q.l}</h2>
            {q.t === 'choice' ? (
              <div className="space-y-3 mb-6">
                {q.o.map(op => (
                  <button
                    key={op}
                    onClick={() => setData({...data, [q.f]: op})}
                    className={`w-full p-4 rounded-2xl border-2 transition-all ${data[q.f] === op ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            ) : q.t === 'multi' ? (
              <div className="space-y-3 mb-6">
                {q.o.map(op => (
                  <button
                    key={op}
                    onClick={() => {
                      const current = data[q.f] || [];
                      if (op === 'None') {
                        setData({...data, [q.f]: ['None']});
                      } else {
                        const filtered = current.filter(c => c !== 'None');
                        if (current.includes(op)) {
                          setData({...data, [q.f]: filtered.filter(c => c !== op)});
                        } else {
                          setData({...data, [q.f]: [...filtered, op]});
                        }
                      }
                    }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all ${(data[q.f] || []).includes(op) ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            ) : q.t === 'textarea' ? (
              <textarea
                value={data[q.f] || ''}
                onChange={(e) => setData({...data, [q.f]: e.target.value})}
                className="w-full p-4 mb-6 bg-gray-50 rounded-2xl border-2 focus:border-blue-500 focus:outline-none"
                rows="4"
                placeholder="Optional"
              />
            ) : (
              <input
                type={q.t}
                value={data[q.f] || ''}
                onChange={(e) => setData({...data, [q.f]: e.target.value})}
                className="w-full p-4 mb-6 bg-gray-50 rounded-2xl border-2 focus:border-blue-500 focus:outline-none"
              />
            )}
            <button
              onClick={() => step < 6 ? setStep(step + 1) : setup()}
              disabled={q.t !== 'textarea' && !data[q.f]}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 rounded-2xl font-bold text-white shadow-lg"
            >
              {step === 6 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${data.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      <div className="max-w-md mx-auto h-screen flex flex-col">
        <div className={`${data.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between shadow-md`}>
          <button onClick={() => setShowSettings(true)} className={`p-2 ${data.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl`}><Settings size={24} className={data.darkMode ? 'text-white' : ''} /></button>
          <h1 className={`text-xl font-bold ${data.darkMode ? 'text-white' : ''}`}>{page === 'home' ? 'Welcome' : page === 'chat' ? 'AI Assistant' : page === 'medications' ? 'Medications' : 'Profile'}</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {page === 'home' && (
            <div className="space-y-4 pb-6">
              <div className="text-center py-6">
                <h2 className="text-4xl font-bold mb-2">Hello, {data.name}!</h2>
                <p className="text-lg text-gray-600">How are you feeling?</p>
              </div>
              <button onClick={() => setPage('chat')} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl p-8 shadow-xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">AI Health Assistant</h3>
                <p className="opacity-90">Ask questions or describe symptoms</p>
              </button>
              <div className="grid grid-cols-2 gap-4">
                {(data.layout || []).map(featureId => {
                  const feature = availableFeatures.find(f => f.id === featureId);
                  if (!feature) return null;
                  
                  const buttonClass = `${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg`;
                  const textClass = `text-sm font-semibold ${data.darkMode ? 'text-white' : ''}`;
                  
                  if (feature.id === 'water') {
                    return (
                      <button key={feature.id} onClick={() => setShowWater(true)} className={buttonClass}>
                        <div className={`w-14 h-14 mx-auto mb-3 bg-blue-100 rounded-2xl flex items-center justify-center`}>
                          <span className="text-2xl">{feature.icon}</span>
                        </div>
                        <p className={textClass}>{feature.name}</p>
                      </button>
                    );
                  } else if (feature.id === 'weight') {
                    return (
                      <button key={feature.id} onClick={() => setShowWeight(true)} className={buttonClass}>
                        <div className={`w-14 h-14 mx-auto mb-3 bg-green-100 rounded-2xl flex items-center justify-center`}>
                          <span className="text-2xl">{feature.icon}</span>
                        </div>
                        <p className={textClass}>{feature.name}</p>
                      </button>
                    );
                  } else if (feature.id === 'meds') {
                    return (
                      <button key={feature.id} onClick={() => setPage('medications')} className={buttonClass}>
                        <div className={`w-14 h-14 mx-auto mb-3 bg-pink-100 rounded-2xl flex items-center justify-center`}>
                          <Pill size={28} className="text-pink-600" />
                        </div>
                        <p className={textClass}>{feature.name}</p>
                      </button>
                    );
                  } else if (feature.id === 'photo') {
                    return (
                      <button key={feature.id} onClick={() => setShowImg(true)} className={buttonClass}>
                        <div className={`w-14 h-14 mx-auto mb-3 bg-teal-100 rounded-2xl flex items-center justify-center`}>
                          <Camera size={28} className="text-teal-600" />
                        </div>
                        <p className={textClass}>{feature.name}</p>
                      </button>
                    );
                  } else if (feature.id === 'checkin') {
                    return (
                      <button key={feature.id} onClick={() => setShowCheckin(true)} className={buttonClass}>
                        <div className={`w-14 h-14 mx-auto mb-3 bg-purple-100 rounded-2xl flex items-center justify-center`}>
                          <Brain size={28} className="text-purple-600" />
                        </div>
                        <p className={textClass}>{feature.name}</p>
                      </button>
                    );
                  } else if (feature.id === 'therapy') {
                    return (
                      <button key={feature.id} onClick={() => { setTherapyMsgs([]); setShowTherapy(true); }} className={buttonClass}>
                        <div className={`w-14 h-14 mx-auto mb-3 bg-indigo-100 rounded-2xl flex items-center justify-center`}>
                          <Heart size={28} className="text-indigo-600" />
                        </div>
                        <p className={textClass}>{feature.name}</p>
                      </button>
                    );
                  } else if (feature.id === 'profile') {
                    const layoutLength = (data.layout || []).filter(id => availableFeatures.find(f => f.id === id)).length;
                    return (
                      <button key={feature.id} onClick={() => setPage('profile')} className={`bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-6 shadow-lg ${layoutLength % 2 === 1 ? 'col-span-2' : ''} text-white`}>
                        <div className="w-14 h-14 mx-auto mb-3 bg-white bg-opacity-30 rounded-2xl flex items-center justify-center">
                          <User size={28} />
                        </div>
                        <p className="text-sm font-semibold">{feature.name}</p>
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
          {page === 'chat' && (
            <div className="space-y-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.t === 'u' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-4/5 p-4 rounded-2xl shadow-md ${m.t === 'u' ? (data.darkMode ? 'bg-blue-900' : 'bg-blue-100') : (data.darkMode ? 'bg-gray-800' : 'bg-white')}`}>
                    <p className={`text-sm ${data.darkMode ? 'text-white' : 'text-gray-900'}`}>{m.txt}</p>
                  </div>
                </div>
              ))}
              {load && (
                <div className="flex justify-start">
                  <div className={`p-4 rounded-2xl shadow-md ${data.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={eRef}></div>
            </div>
          )}
          {page === 'medications' && (
            <div>
              <button onClick={() => setShowAddMed(true)} className="w-full bg-blue-500 text-white p-4 rounded-2xl mb-4 flex items-center justify-center gap-2 shadow-md font-semibold">
                <Plus size={20} />Add Med
              </button>
              <div className="space-y-3">
                {data.meds.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3 flex-1">
                      <input type="checkbox" checked={m.ch || false} onChange={() => {
                        setData(p => ({ ...p, meds: p.meds.map(med => med.id === m.id ? { ...med, ch: !med.ch } : med) }));
                      }} className="w-5 h-5" />
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-sm text-gray-600">{m.time}</p>
                      </div>
                    </div>
                    <button onClick={() => setData(p => ({ ...p, meds: p.meds.filter(med => med.id !== m.id) }))} className="text-red-500"><X size={20} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page === 'profile' && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setProfileTab('info')} className={`flex-1 p-3 rounded-xl font-semibold ${profileTab === 'info' ? 'bg-blue-500 text-white' : 'bg-white'}`}>Info</button>
                <button onClick={() => setProfileTab('mental')} className={`flex-1 p-3 rounded-xl font-semibold ${profileTab === 'mental' ? 'bg-blue-500 text-white' : 'bg-white'}`}>Mental Health</button>
              </div>
              {profileTab === 'info' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      {data.pic ? (
                        <img src={data.pic} className={`w-32 h-32 rounded-full object-cover border-4 border-${getAccent().primary}`} alt="Profile" />
                      ) : (
                        <div className={`w-32 h-32 rounded-full ${data.darkMode ? 'bg-gray-800' : 'bg-white'} border-4 border-${getAccent().primary} flex items-center justify-center shadow-lg`}>
                          <User size={48} className={data.darkMode ? 'text-white' : ''} />
                        </div>
                      )}
                      <button onClick={() => fRef.current.click()} className={`absolute bottom-0 right-0 bg-${getAccent().primary} p-2 rounded-full text-white`}>
                        <Upload size={16} />
                      </button>
                      <input ref={fRef} type="file" accept="image/*" onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) {
                          const r = new FileReader();
                          r.onload = (ev) => setData(p => ({ ...p, pic: ev.target.result }));
                          r.readAsDataURL(f);
                        }
                      }} className="hidden" />
                    </div>
                    <h2 className={`text-2xl font-bold mt-4 ${data.darkMode ? 'text-white' : ''}`}>{data.name}</h2>
                  </div>
                  <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-md text-center`}>
                    <h3 className={`text-lg font-bold mb-4 ${data.darkMode ? 'text-white' : ''}`}>Health Score</h3>
                    <div className={`text-5xl font-bold mb-4 ${data.darkMode ? 'text-white' : ''}`}>{data.score}</div>
                    <div className={`inline-block px-6 py-3 rounded-full text-white font-bold ${grade(data.score).c}`}>
                      Grade {grade(data.score).g}
                    </div>
                    <p className={`mt-2 text-sm ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{grade(data.score).l}</p>
                    <div className={`mt-6 p-4 ${data.darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl text-left`}>
                      <p className={`font-bold text-sm mb-2 ${data.darkMode ? 'text-blue-400' : 'text-blue-900'}`}>Ways to Improve:</p>
                      <ul className={`text-sm space-y-2 ${data.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {data.activity === 'Low' && <li>• Increase physical activity</li>}
                        {parseFloat(data.weight) > 250 && <li>• Work on healthy weight</li>}
                        {data.water.length < 8 && <li>• Stay hydrated daily</li>}
                        {data.score < 60 && <li>• Schedule a check-up</li>}
                      </ul>
                    </div>
                  </div>
                  <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 space-y-3 shadow-md`}>
                    <h3 className={`text-lg font-bold ${data.darkMode ? 'text-white' : ''}`}>Info</h3>
                    <div><label className={`text-sm ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age</label><p className={`p-3 ${data.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} border ${data.darkMode ? 'border-gray-600' : ''} rounded-xl mt-1`}>{data.age}</p></div>
                    <div><label className={`text-sm ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight</label><p className={`p-3 ${data.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} border ${data.darkMode ? 'border-gray-600' : ''} rounded-xl mt-1`}>{data.weight} lbs</p></div>
                    <div><label className={`text-sm ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender</label><p className={`p-3 ${data.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} border ${data.darkMode ? 'border-gray-600' : ''} rounded-xl mt-1`}>{data.gender}</p></div>
                    <div><label className={`text-sm ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Activity</label><p className={`p-3 ${data.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} border ${data.darkMode ? 'border-gray-600' : ''} rounded-xl mt-1`}>{data.activity}</p></div>
                  </div>
                  <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
                    <h3 className={`text-lg font-bold mb-3 ${data.darkMode ? 'text-white' : ''}`}>Water Log</h3>
                    {data.water.length === 0 ? (
                      <p className={`text-sm ${data.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No entries</p>
                    ) : (
                      <div className="space-y-2">
                        {data.water.slice(-5).reverse().map((e, i) => (
                          <div key={i} className={`flex justify-between p-2 ${data.darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
                            <span className={`text-sm font-semibold ${data.darkMode ? 'text-white' : ''}`}>{e.amt} oz</span>
                            <span className={`text-xs ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(e.d).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setShowWater(true)} className={`w-full mt-3 p-3 bg-${getAccent().primary} hover:bg-${getAccent().hover} text-white rounded-xl font-semibold`}>Log Water</button>
                  </div>
                  <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
                    <h3 className={`text-lg font-bold mb-3 ${data.darkMode ? 'text-white' : ''}`}>Weight Log</h3>
                    {data.wLog.length === 0 ? (
                      <p className={`text-sm ${data.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No entries</p>
                    ) : (
                      <div className="space-y-2">
                        {data.wLog.slice(-5).reverse().map((e, i) => (
                          <div key={i} className={`flex justify-between p-2 ${data.darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg`}>
                            <span className={`text-sm font-semibold ${data.darkMode ? 'text-white' : ''}`}>{e.w} lbs</span>
                            <span className={`text-xs ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(e.d).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setShowWeight(true)} className="w-full mt-3 p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold">Log Weight</button>
                  </div>
                </div>
              )}
              {profileTab === 'mental' && (
                <div className="space-y-4">
                  <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-md`}>
                    <h3 className={`text-lg font-bold mb-4 ${data.darkMode ? 'text-white' : ''}`}>Mental Health Check-ins</h3>
                    {data.mentalCheckins.length === 0 ? (
                      <p className={`text-sm mb-4 ${data.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No check-ins yet</p>
                    ) : (
                      <div className="space-y-3 mb-4">
                        {data.mentalCheckins.slice(-5).reverse().map((c, i) => (
                          <div key={i} className={`p-4 ${data.darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-xl`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className={`font-semibold ${data.darkMode ? 'text-purple-400' : 'text-purple-900'}`}>Mood: {c.mood}</p>
                                <p className={`text-sm ${data.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Energy: {c.energy} | Stress: {c.stress}</p>
                              </div>
                              <span className={`text-xs ${data.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(c.date).toLocaleDateString()}</span>
                            </div>
                            {c.notes && <p className={`text-sm mt-2 ${data.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{c.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setShowCheckin(true)} className="w-full p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold">New Check-in</button>
                  </div>
                  <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-md`}>
                    <h3 className={`text-lg font-bold mb-4 ${data.darkMode ? 'text-white' : ''}`}>Therapy Sessions</h3>
                    <p className={`text-sm mb-4 ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total sessions: {data.therapySessions.length}</p>
                    <button onClick={() => { setTherapyMsgs([]); setShowTherapy(true); }} className="w-full p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold">Start Session</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {page === 'chat' && (
          <div className="bg-white border-t p-4 shadow-sm">
            <div className="flex gap-2">
              <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} placeholder="Ask anything..." className="flex-1 p-3 bg-white border rounded-xl focus:outline-none focus:border-blue-500" />
              <button onClick={send} disabled={load} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"><Send size={20} /></button>
            </div>
          </div>
        )}
        <div className="bg-white border-t p-4 flex justify-around shadow-sm">
          <button onClick={() => setPage('home')} className={`p-3 rounded-2xl ${page === 'home' ? 'bg-blue-500 text-white' : ''}`}><Home size={24} /></button>
          <button onClick={() => setPage('chat')} className={`p-3 rounded-2xl ${page === 'chat' ? 'bg-blue-500 text-white' : ''}`}><MessageSquare size={24} /></button>
          <button onClick={() => setPage('medications')} className={`p-3 rounded-2xl ${page === 'medications' ? 'bg-blue-500 text-white' : ''}`}><Pill size={24} /></button>
          <button onClick={() => setPage('profile')} className={`p-3 rounded-2xl ${page === 'profile' ? 'bg-blue-500 text-white' : ''}`}><User size={24} /></button>
        </div>
      </div>
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${data.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm max-h-5/6 overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${data.darkMode ? 'text-white' : ''}`}>Settings</h2>
              <button onClick={() => setShowSettings(false)}><X size={24} className={data.darkMode ? 'text-white' : ''} /></button>
            </div>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 ${data.darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl`}>
                <span className={`font-semibold ${data.darkMode ? 'text-white' : ''}`}>Dark Mode</span>
                <button 
                  onClick={() => setData(p => ({ ...p, darkMode: !p.darkMode }))}
                  className={`w-14 h-8 rounded-full transition-colors ${data.darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transform transition-transform ${data.darkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
              
              <div className={`p-4 ${data.darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl`}>
                <label className={`font-semibold block mb-2 ${data.darkMode ? 'text-white' : ''}`}>Accent Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(accentColors).map(color => (
                    <button 
                      key={color}
                      onClick={() => setData(p => ({ ...p, accentColor: color }))}
                      className={`h-10 rounded-lg bg-${color}-500 ${data.accentColor === color ? 'ring-4 ring-white' : ''}`}
                    />
                  ))}
                </div>
              </div>
              
              <button onClick={() => setShowLayoutCustomize(true)} className={`w-full p-4 ${data.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} rounded-xl font-semibold text-left`}>
                Customize Layout
              </button>
              
              <button onClick={() => setShowEditProfile(true)} className={`w-full p-4 ${data.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} rounded-xl font-semibold text-left`}>
                Edit Profile
              </button>
              
              <button onClick={() => setShowReset(true)} className="w-full p-4 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold">Reset Account</button>
            </div>
          </div>
        </div>
      )}
      {showReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Reset Account?</h3>
            <p className="text-gray-600 mb-6">All data will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)} className="flex-1 p-3 bg-gray-200 rounded-xl font-semibold">Cancel</button>
              <button onClick={doReset} className="flex-1 p-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold">Reset</button>
            </div>
          </div>
        </div>
      )}
      {showAddMed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Medication</h3>
              <button onClick={() => setShowAddMed(false)}><X /></button>
            </div>
            <input type="text" placeholder="Medication name" value={newMed.name} onChange={(e) => setNewMed({...newMed, name: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl mb-3" />
            <input type="time" value={newMed.time} onChange={(e) => setNewMed({...newMed, time: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl mb-4" />
            <button onClick={() => {
              if (newMed.name && newMed.time) {
                setData(p => ({ ...p, meds: [...p.meds, { ...newMed, id: Date.now(), ch: false }] }));
                setNewMed({ name: '', time: '' });
                setShowAddMed(false);
              }
            }} className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl font-semibold">Add</button>
          </div>
        </div>
      )}
      {showWater && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Log Water</h3>
              <button onClick={() => setShowWater(false)}><X size={24} /></button>
            </div>
            <div className="space-y-3">
              <button onClick={() => { setData(p => ({ ...p, water: [...p.water, { amt: 8, d: new Date().toISOString() }] })); setShowWater(false); calc(); }} className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold">8 oz</button>
              <button onClick={() => { setData(p => ({ ...p, water: [...p.water, { amt: 16, d: new Date().toISOString() }] })); setShowWater(false); calc(); }} className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold">16 oz</button>
              <button onClick={() => { setData(p => ({ ...p, water: [...p.water, { amt: 24, d: new Date().toISOString() }] })); setShowWater(false); calc(); }} className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold">24 oz</button>
            </div>
          </div>
        </div>
      )}
      {showWeight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Log Weight</h3>
              <button onClick={() => setShowWeight(false)}><X size={24} /></button>
            </div>
            <div className="mb-6">
              <div className="text-5xl font-bold mb-4 text-center">{wt}</div>
              <input type="range" min="50" max="500" value={wt} onChange={(e) => setWt(parseInt(e.target.value))} className="w-full mb-4" />
              <input type="number" value={wt} onChange={(e) => setWt(parseInt(e.target.value))} className="w-full p-3 bg-gray-50 border rounded-xl text-center text-2xl font-bold" />
            </div>
            <button onClick={() => { setData(p => ({ ...p, wLog: [...p.wLog, { w: wt, d: new Date().toISOString() }], weight: wt.toString() })); setShowWeight(false); calc(); }} className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold">Log</button>
          </div>
        </div>
      )}
      {showCheckin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Mental Health Check-in</h3>
              <button onClick={() => setShowCheckin(false)}><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Mood</label>
                <select value={checkin.mood} onChange={(e) => setCheckin({...checkin, mood: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl">
                  <option value="">Select...</option>
                  <option value="Great">Great 😊</option>
                  <option value="Good">Good 🙂</option>
                  <option value="Okay">Okay 😐</option>
                  <option value="Not Good">Not Good 😔</option>
                  <option value="Bad">Bad 😢</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Energy Level</label>
                <select value={checkin.energy} onChange={(e) => setCheckin({...checkin, energy: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl">
                  <option value="">Select...</option>
                  <option value="High">High ⚡</option>
                  <option value="Medium">Medium 🔋</option>
                  <option value="Low">Low 🪫</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Stress Level</label>
                <select value={checkin.stress} onChange={(e) => setCheckin({...checkin, stress: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl">
                  <option value="">Select...</option>
                  <option value="Low">Low 😌</option>
                  <option value="Medium">Medium 😰</option>
                  <option value="High">High 😫</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Notes (optional)</label>
                <textarea value={checkin.notes} onChange={(e) => setCheckin({...checkin, notes: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl" rows="3" placeholder="How are you feeling?"></textarea>
              </div>
              <button onClick={saveCheckin} disabled={!checkin.mood || !checkin.energy || !checkin.stress} className="w-full p-4 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-xl font-semibold">Save Check-in</button>
            </div>
          </div>
        </div>
      )}
      {showTherapy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md h-5/6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">AI Therapy Session</h3>
              <button onClick={() => { 
                if (therapyMsgs.length > 0) {
                  const session = { messages: therapyMsgs, date: new Date().toISOString() };
                  setData(p => ({ ...p, therapySessions: [...p.therapySessions, session] }));
                }
                setTherapyMsgs([]); 
                setShowTherapy(false); 
              }}><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {therapyMsgs.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p className="mb-2">Welcome to your safe space.</p>
                  <p className="text-sm">Share what's on your mind. I'm here to listen.</p>
                </div>
              )}
              {therapyMsgs.map((m, i) => (
                <div key={i} className={`flex ${m.t === 'u' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-4/5 p-4 rounded-2xl ${m.t === 'u' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    <p className="text-sm">{m.txt}</p>
                  </div>
                </div>
              ))}
              {therapyLoad && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-2xl bg-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={tRef}></div>
            </div>
            <div className="flex gap-2">
              <input type="text" value={therapyMsg} onChange={(e) => setTherapyMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendTherapy()} placeholder="Share your thoughts..." className="flex-1 p-3 bg-gray-50 border rounded-xl focus:outline-none focus:border-indigo-500" />
              <button onClick={sendTherapy} disabled={therapyLoad} className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-xl"><Send size={20} /></button>
            </div>
          </div>
        </div>
      )}
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
                  className={`w-full p-4 rounded-xl border-2 transition ${data.layout.includes(feature.id) ? 'border-blue-500 bg-blue-50' : (data.darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200')}`}
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
                <input type="number" value={data.weight} onChange={(e) => setData({...data, weight: e.target.value})} className={`w-full p-3 ${data.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50'} border rounded-xl`} />
              </div>
              <div>
                <label className={`text-sm font-semibold mb-2 block ${data.darkMode ? 'text-white' : ''}`}>Activity Level</label>
                <select value={data.activity} onChange={(e) => setData({...data, activity: e.target.value})} className={`w-full p-3 ${data.darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50'} border rounded-xl`}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <button onClick={() => { calc(); setShowEditProfile(false); }} className={`w-full p-3 bg-${getAccent().primary} text-white rounded-xl font-semibold`}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {cam && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <video ref={vRef} autoPlay playsInline className="flex-1 object-cover"></video>
          <canvas ref={cRef} className="hidden"></canvas>
          <div className="p-4 flex justify-center gap-4">
            <button onClick={() => { if (vRef.current && vRef.current.srcObject) { vRef.current.srcObject.getTracks().forEach(t => t.stop()); } setCam(false); }} className="bg-gray-700 px-6 py-3 rounded-xl text-white font-semibold">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}