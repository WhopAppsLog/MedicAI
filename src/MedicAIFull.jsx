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
    layout: ['water', 'weight', 'meds', 'photo', 'checkin', 'therapy', 'profile'],
    medStreak: 0, lastMedCheck: null, activities: [], totalActivityTime: 0, totalCalories: 0,
    healthTasks: [], dailyTips: [], lastTipDate: null, conversationContext: []
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
    const msgCount = prevMsgs.filter(m => m.t === 'u').length;
    
    // Varied follow-up responses
    if (prevMsgs.length > 0) {
      const lastAI = prevMsgs.filter(m => m.t === 'a').pop();
      
      if (lastAI && lastAI.txt.includes('scale of 1-10')) {
        const responses = [
          "Thank you for that information. Based on the severity you've described, I'd recommend rest and staying well-hydrated. Monitor your symptoms closely. If they worsen or persist beyond a few days, it would be prudent to consult with your primary care physician. Are there any other concerns?",
          "I appreciate you providing that detail. Given what you've shared, supportive care at home should help. Keep track of how you're feeling over the next 24-48 hours. Should you notice any concerning changes, please seek medical attention. What else can I address for you?",
          "Thank you. That helps me understand better. For now, focus on rest and adequate fluid intake. If symptoms escalate or new ones develop, I'd advise reaching out to a healthcare provider. Is there anything else troubling you?"
        ];
        return responses[msgCount % responses.length];
      }
      
      if (lastAI && (lastAI.txt.includes('How long') || lastAI.txt.includes('when did'))) {
        const responses = [
          "I see. Given that timeline, most conditions of this nature tend to improve with proper self-care. Continue monitoring your symptoms. If there's no improvement within 5-7 days, or if things worsen, I'd recommend seeing a doctor. Do you have other questions?",
          "Thank you for the timeline. Generally, symptoms persisting beyond a week warrant medical evaluation. For now, ensure you're resting adequately and staying comfortable. What else would you like to discuss?",
          "Understood. Based on the duration you mentioned, this could resolve on its own with time and care. However, if symptoms persist or intensify, medical consultation would be advisable. How else can I assist you?"
        ];
        return responses[msgCount % responses.length];
      }
      
      const generalFollowUps = [
        "I understand. Is there anything else you'd like to discuss regarding your health?",
        "Thank you for sharing that. Do you have any other concerns or questions I can help address?",
        "I see. What other health matters can I help you with today?"
      ];
      return generalFollowUps[msgCount % generalFollowUps.length];
    }
    
    // Symptom responses
    if (hasSymptoms(input)) {
      if (lower.includes('sore') || lower.includes('throat')) {
        const responses = [
          "A sore throat can have various causes. To better assess this, I need more information: How long have you been experiencing this? On a scale of 1-10, how would you rate the pain? Have you noticed any fever or difficulty swallowing?",
          "I understand you're experiencing throat discomfort. Let me gather some details: When did this begin? How severe is the pain, from 1-10? Are there any accompanying symptoms like fever or swollen glands?"
        ];
        return responses[msgCount % responses.length];
      } else if (lower.includes('headache') || lower.includes('head')) {
        const responses = [
          "Headaches can stem from various causes. To help you better, could you describe: When did it start? Is the pain throbbing, sharp, or dull? Have you taken any medication, and if so, did it help?",
          "I see you're dealing with head pain. Let me ask a few questions: How long have you had this? What does the pain feel like - sharp, dull, or pressure-like? Any visual changes or nausea?"
        ];
        return responses[msgCount % responses.length];
      } else if (lower.includes('fever') || lower.includes('temperature')) {
        const responses = [
          "A fever typically indicates your body is responding to an infection. What's your current temperature reading? How long have you had the fever? Are you experiencing any other symptoms such as chills, body aches, or fatigue?",
          "Elevated temperature is your body's immune response. Could you tell me: What temperature did you measure? When did it start? What other symptoms are present?"
        ];
        return responses[msgCount % responses.length];
      } else if (lower.includes('cough')) {
        const responses = [
          "I need to understand your cough better. Is it productive (bringing up mucus) or dry? How long has this been going on? Any chest pain, shortness of breath, or fever?",
          "Coughing can indicate several conditions. Please tell me: Is it a dry cough or are you producing phlegm? What's the duration? Any other respiratory symptoms?"
        ];
        return responses[msgCount % responses.length];
      } else {
        const responses = [
          "I'd like to help assess what you're experiencing. Could you provide more details: When did these symptoms begin? How would you describe the severity? Are there any other symptoms you've noticed?",
          "To better understand your situation, I need some additional information: What's the timeline of these symptoms? How significantly are they affecting you? Any accompanying signs?"
        ];
        return responses[msgCount % responses.length];
      }
    }
    
    // Educational questions
    if (lower.includes('what is') || lower.includes('tell me about') || lower.includes('how does') || lower.includes('explain')) {
      if (lower.includes('diabetes')) {
        return "Diabetes mellitus is a metabolic disorder characterized by elevated blood glucose levels. Type 1 is an autoimmune condition typically diagnosed in youth, while Type 2 develops over time, often related to lifestyle factors. Management includes diet modification, exercise, blood glucose monitoring, and medication when necessary. What specific aspect would you like to understand better?";
      } else if (lower.includes('blood pressure') || lower.includes('hypertension')) {
        return "Blood pressure measures the force exerted by blood against arterial walls. Hypertension, or high blood pressure, is often asymptomatic but increases cardiovascular risk. Management strategies include dietary modifications (reduced sodium, increased potassium), regular physical activity, stress management, and pharmacotherapy when indicated. Are you monitoring your blood pressure?";
      } else if (lower.includes('covid') || lower.includes('coronavirus')) {
        return "COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus. Symptoms vary from mild (fever, cough, fatigue) to severe (respiratory distress). Most cases can be managed with supportive care at home - rest, hydration, fever reducers. Seek immediate care for difficulty breathing, persistent chest pain, or confusion. Are you experiencing symptoms?";
      } else {
        return "I can provide medical information on various topics. Could you be more specific about what you'd like to know? The more details you provide, the better I can assist you.";
      }
    }
    
    // Greetings
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      const greetings = [
        "Hello. I'm here to assist with your health questions. What concerns can I address today?",
        "Good day. How can I help you with your health concerns?",
        "Hello. What health-related questions do you have for me?"
      ];
      return greetings[msgCount % greetings.length];
    }
    
    // Thanks
    if (lower.includes('thank')) {
      const thanks = [
        "You're welcome. Please don't hesitate to reach out if you have additional questions.",
        "I'm glad I could help. Feel free to ask if anything else comes up.",
        "You're welcome. Take care, and contact me if you need further assistance."
      ];
      return thanks[msgCount % thanks.length];
    }
    
    // Default
    return "I'm here to provide medical information and guidance. You can ask about symptoms, conditions, medications, or general health topics. What would you like to discuss?";
  };

  const therapyResponse = (input, prevTherapyMsgs = []) => {
    const lower = input.toLowerCase();
    const msgCount = prevTherapyMsgs.filter(m => m.t === 'u').length;
    
    // Anxiety responses
    if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('nervous') || lower.includes('worry')) {
      const responses = [
        "I hear that anxiety is affecting you right now. That takes courage to share. Can you tell me what thoughts or situations seem to trigger these anxious feelings?",
        "Thank you for opening up about your anxiety. It's a difficult experience. What aspects of your life feel most impacted by these feelings right now?",
        "I appreciate you trusting me with this. Anxiety can be overwhelming. When do you notice these feelings are strongest? What's going through your mind in those moments?"
      ];
      return responses[msgCount % responses.length];
    }
    
    // Depression/sadness responses
    if (lower.includes('sad') || lower.includes('depressed') || lower.includes('depression') || lower.includes('down') || lower.includes('empty')) {
      const responses = [
        "I'm glad you felt you could share this with me. Acknowledging these feelings is an important step. How long have you been feeling this way? What does a typical day look like for you right now?",
        "Thank you for being honest about what you're experiencing. These feelings deserve attention. Can you describe what sadness feels like for you? When do you notice it most?",
        "I hear the weight you're carrying. It takes strength to voice these feelings. Have there been any recent changes in your life, or has this been building over time?"
      ];
      return responses[msgCount % responses.length];
    }
    
    // Stress/overwhelm responses
    if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('too much') || lower.includes('pressure')) {
      const responses = [
        "It sounds like you're carrying quite a burden right now. Let's explore this together. What feels most pressing or unmanageable at this moment?",
        "I can sense the weight of what you're dealing with. Stress affects us deeply. What areas of your life are contributing most to these feelings?",
        "Thank you for sharing. Feeling overwhelmed is genuinely difficult. Can you help me understand what your days look like? What's demanding the most from you?"
      ];
      return responses[msgCount % responses.length];
    }
    
    // Anger responses
    if (lower.includes('angry') || lower.includes('mad') || lower.includes('frustrated') || lower.includes('irritated')) {
      const responses = [
        "Anger is a valid emotion, and I'm here to help you understand it. What situation or thought seems to fuel this anger? How does it show up for you?",
        "I appreciate you sharing these feelings. Anger often signals something important. Can you tell me more about what's underneath this frustration?",
        "Thank you for being open. Anger can be complex. When did you first notice these feelings? What happens in your body when you feel this way?"
      ];
      return responses[msgCount % responses.length];
    }
    
    // Loneliness responses
    if (lower.includes('lonely') || lower.includes('alone') || lower.includes('isolated') || lower.includes('disconnected')) {
      const responses = [
        "Loneliness is deeply painful, and I'm here with you. Can you tell me about your connections with others? What does loneliness feel like for you?",
        "Thank you for sharing something so personal. Feeling isolated is hard. What would connection or belonging look like for you?",
        "I hear that you're feeling alone. That's a vulnerable thing to express. How long have you been experiencing these feelings?"
      ];
      return responses[msgCount % responses.length];
    }
    
    // Sleep issues
    if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired') || lower.includes('exhausted')) {
      const responses = [
        "Sleep difficulties can affect every part of our lives. Tell me about your sleep patterns. What happens when you try to rest?",
        "I understand how exhausting poor sleep can be. What's your bedtime routine like? When did these sleep issues begin?",
        "Thank you for bringing this up. Sleep is crucial for wellbeing. Can you describe what a typical night looks like for you?"
      ];
      return responses[msgCount % responses.length];
    }
    
    // General supportive responses
    const generalResponses = [
      "I'm here and listening. Your experiences matter. What else would you like to explore in our conversation?",
      "Thank you for sharing that with me. How are you feeling as we talk about this? What else is on your mind?",
      "I appreciate your openness. What you're experiencing is significant. Is there more you'd like to tell me about this?",
      "I hear you. These feelings deserve space and attention. What would feel most helpful to discuss right now?"
    ];
    
    return generalResponses[msgCount % generalResponses.length];
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
    const currentTherapyMsgs = [...therapyMsgs];
    setTherapyMsgs(p => [...p, { t: 'u', txt: therapyMsg }]);
    const currentMsg = therapyMsg;
    setTherapyMsg('');
    setTherapyLoad(true);
    await new Promise(r => setTimeout(r, 1500));
    setTherapyMsgs(p => [...p, { t: 'a', txt: therapyResponse(currentMsg, currentTherapyMsgs) }]);
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
                    className={`w-full p-4 rounded-2xl border-2 transition-all ${data[q.f] === op ? 'border-blue-500 bg-blue-50 shadow-lg text-gray-900' : 'border-gray-200 hover:border-blue-300'}`}
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
                    className={`w-full p-4 rounded-2xl border-2 transition-all ${(data[q.f] || []).includes(op) ? 'border-blue-500 bg-blue-50 shadow-lg text-gray-900' : 'border-gray-200 hover:border-blue-300'}`}
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
          <button onClick={() => setShowSettings(true)} className={`p-2 ${data.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl`}><Settings size={24} className={data.darkMode ? 'text-gray-100' : 'text-gray-900'} /></button>
          <h1 className={`text-xl font-bold ${data.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{page === 'home' ? 'Welcome' : page === 'chat' ? 'AI Assistant' : page === 'medications' ? 'Medications' : 'Profile'}</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {page === 'home' && (
            <div className="space-y-4 pb-6">
              <div className="text-center py-6">
                <h2 className={`text-4xl font-bold mb-2 ${data.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Hello, {data.name}!</h2>
                <p className={`text-lg ${data.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>How are you feeling?</p>
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
                  
                  const buttonClass = `${data.darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow`;
                  const textClass = `text-sm font-semibold ${data.darkMode ? 'text-gray-100' : 'text-gray-900'}`;
                  
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
                  <div className={`max-w-4/5 p-4 rounded-2xl shadow-md ${m.t === 'u' ? (data.darkMode ? 'bg-blue-700 border border-blue-600' : 'bg-blue-100') : (data.darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white')}`}>
                    <p className={`text-sm ${data.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{m.txt}</p>
                  </div>
                </div>
              ))}
              {load && (
                <div className="flex justify-start">
                  <div className={`p-4 rounded-2xl shadow-md ${data.darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
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
                  <div key={m.id} className={`${data.darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-2xl p-4 flex items-center justify-between shadow-md`}>
                    <div className="flex items-center gap-3 flex-1">
                      <input type="checkbox" checked={m.ch || false} onChange={() => {
                        setData(p => ({ ...p, meds: p.meds.map(med => med.id === m.id ? { ...med, ch: !med.ch } : med) }));
                      }} className="w-5 h-5" />
                      <div>
                        <p className={`font-semibold ${data.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{m.name}</p>
                        <p className={`text-sm ${data.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{m.time}</p>
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
          <div className={`${data.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-t p-4 shadow-sm`}>
            <div className="flex gap-2">
              <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} placeholder="Ask anything..." className={`flex-1 p-3 ${data.darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white'} border rounded-xl focus:outline-none focus:border-blue-500`} />
              <button onClick={send} disabled={load} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"><Send size={20} /></button>
            </div>
          </div>
        )}
        <div className={`${data.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4 flex justify-around shadow-sm`}>
          <button onClick={() => setPage('home')} className={`p-3 rounded-2xl ${page === 'home' ? 'bg-blue-500 text-white' : (data.darkMode ? 'text-gray-300' : 'text-gray-700')}`}><Home size={24} /></button>
          <button onClick={() => setPage('chat')} className={`p-3 rounded-2xl ${page === 'chat' ? 'bg-blue-500 text-white' : (data.darkMode ? 'text-gray-300' : 'text-gray-700')}`}><MessageSquare size={24} /></button>
          <button onClick={() => setPage('medications')} className={`p-3 rounded-2xl ${page === 'medications' ? 'bg-blue-500 text-white' : (data.darkMode ? 'text-gray-300' : 'text-gray-700')}`}><Pill size={24} /></button>
          <button onClick={() => setPage('profile')} className={`p-3 rounded-2xl ${page === 'profile' ? 'bg-blue-500 text-white' : (data.darkMode ? 'text-gray-300' : 'text-gray-700')}`}><User size={24} /></button>
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
                      className={`h-10 rounded-lg bg-${color}-500 ${data.accentColor === color ? 'ring-4 ring-offset-2 ring-blue-400' : ''}`}
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
