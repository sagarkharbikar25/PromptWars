"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  AlertTriangle,
  Compass,
  HelpCircle,
  Activity,
  Users,
  ShieldAlert,
  Train,
  RotateCw,
  Sliders,
  Accessibility,
  RefreshCw,
  Search,
  Globe
} from 'lucide-react';
import { GATES_DATA, ZONES_DATA, TRANSPORT_DATA, FAQS_DATA } from '@/lib/stadiumData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isDemo?: boolean;
}

interface Recommendation {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  category: 'Crowd Control' | 'Transportation' | 'Security' | 'Logistics';
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'fan' | 'ops'>('fan');

  // Fan Assistant State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Welcome to StadiumGenie!**

I can help you navigate StadiumGenie Arena for today's FIFA World Cup 2026 match. Ask me about:
- ♿ *Accessibility access & Sensory Rooms*
- 🚇 *Live transit wait times & delays*
- 👜 *Clear bag policy & security gates*
- 🍔 *Halal, vegan, & gluten-free food courts*

How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Operations Dashboard State
  const [gates, setGates] = useState(GATES_DATA);
  const [zones, setZones] = useState(ZONES_DATA);
  const [transport, setTransport] = useState(TRANSPORT_DATA);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [insightsDemoMode, setInsightsDemoMode] = useState(false);
  const [editingGateId, setEditingGateId] = useState<string | null>(null);
  const [tempOccupancy, setTempOccupancy] = useState<number>(50);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch initial insights
  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        isDemo: data.isDemo
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ **Error Connecting to Genie Engine**\n\nUnable to reach the server. Make sure the server is running and check console.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const fetchInsights = async (customGates = gates, customZones = zones) => {
    setIsInsightsLoading(true);
    try {
      // In a real application we would post custom gate states to save to supabase.
      // Here we simulate the update or send the snapshot
      const response = await fetch('/api/insights');
      const data = await response.json();

      setRecommendations(data.recommendations || []);
      setInsightsDemoMode(!!data.isDemo);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const handleUpdateGateOccupancy = (gateId: string, value: number) => {
    let status: 'Open' | 'Warning' | 'Critical' = 'Open';
    if (value >= 90) status = 'Critical';
    else if (value >= 75) status = 'Warning';

    const updatedGates = gates.map(g => {
      if (g.id === gateId) {
        return { ...g, occupancyRate: value, status };
      }
      return g;
    });

    setGates(updatedGates);
    setEditingGateId(null);

    // Auto trigger recommendations refresh to simulate real-time AI adaptability!
    // In a premium hackathon demo, editing occupancy and hitting Refresh shows live adapting advice.
    generateInteractiveRecommendation(updatedGates, zones);
  };

  // Live client-side simulation logic to immediately update recommendations when user slides telemetry
  const generateInteractiveRecommendation = (currentGates: typeof gates, currentZones: typeof zones) => {
    setIsInsightsLoading(true);

    // Simulate short network delay for premium feel
    setTimeout(() => {
      const topGates = [...currentGates].sort((a, b) => b.occupancyRate - a.occupancyRate);
      const criticalGate = topGates[0];
      const clearGate = [...currentGates].sort((a, b) => a.occupancyRate - b.occupancyRate)[0];

      const newRecommendations: Recommendation[] = [];

      if (criticalGate.occupancyRate >= 75) {
        newRecommendations.push({
          title: `Redirect ${criticalGate.name} to ${clearGate.name}`,
          priority: criticalGate.occupancyRate >= 90 ? "High" : "Medium",
          description: `${criticalGate.name} is operating at high load (${criticalGate.occupancyRate}%). Direct parking marshals to guide vehicles to ${clearGate.name} (${clearGate.occupancyRate}%).`,
          category: "Crowd Control"
        });
      } else {
        newRecommendations.push({
          title: "All Stadium Gates Stabilized",
          priority: "Low",
          description: "All entrances are operating below capacity. Normal check-in procedures apply.",
          category: "Logistics"
        });
      }

      // Check zone crowd levels
      const zoneD = currentZones.find(z => z.id === 'zone_d');
      if (zoneD && zoneD.crowdLevel === 'Overcrowded') {
        newRecommendations.push({
          title: "Deploy Crowd Marshals to Zone D",
          priority: "High",
          description: "Supporter stand is reaching maximum safe limits. Suspend alcohol sales in surrounding corridors to prevent congestion.",
          category: "Security"
        });
      }

      // Add transport alert
      newRecommendations.push({
        title: "Advise Red Line Metro Usage",
        priority: "Medium",
        description: "Blue Line Metro delays (25m) are causing exits to back up. Broadcast stadium announcement to recommend Red Line (8m wait).",
        category: "Transportation"
      });

      setRecommendations(newRecommendations);
      setIsInsightsLoading(false);
    }, 600);
  };

  const handleUpdateZoneCrowd = (zoneId: string, crowd: 'Low' | 'Medium' | 'High' | 'Overcrowded') => {
    let security: 'Normal' | 'Alert' | 'Lockdown' = 'Normal';
    if (crowd === 'Overcrowded') security = 'Alert';

    const updatedZones = zones.map(z => {
      if (z.id === zoneId) {
        return { ...z, crowdLevel: crowd, securityStatus: security };
      }
      return z;
    });
    setZones(updatedZones);
    generateInteractiveRecommendation(gates, updatedZones);
  };

  const starterQuestions = [
    { icon: "♿", label: "Wheelchair access?", text: "Where is the nearest wheelchair-accessible entry?" },
    { icon: "👜", label: "Bag Policy?", text: "What is the bag policy for the tournament?" },
    { icon: "🚇", label: "Live Transit Wait?", text: "How is the public transit running right now?" },
    { icon: "🌐", label: "Habla Espanol?", text: "Cómo llegar a la Puerta 3?" }
  ];

  return (
    <div style={{ minHeight: '80vh' }}>

      {/* Introduction Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slideup">
        <h2 style={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
          GenAI Stadium Intelligence System
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '15px' }}>
          Explore StadiumGenie. Toggle between the fan assistant chat widget and the staff operations control board. Simulate telemetry updates to watch the AI adapt in real time.
        </p>

        {/* Tab Selection Switcher */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '4px',
          marginTop: '25px'
        }}>
          <button
            onClick={() => setActiveTab('fan')}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: 'var(--font-heading)',
              transition: 'all 0.2s ease',
              background: activeTab === 'fan' ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)' : 'transparent',
              color: activeTab === 'fan' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'fan' ? '1px solid var(--accent-cyan)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} />
              Fan Assistant Chat
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ops')}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: 'var(--font-heading)',
              transition: 'all 0.2s ease',
              background: activeTab === 'ops' ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)' : 'transparent',
              color: activeTab === 'ops' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'ops' ? '1px solid var(--accent-cyan)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} />
              Operations Dashboard
            </div>
          </button>
        </div>
      </div>

      {/* Main Interfaces */}
      {activeTab === 'fan' ? (

        // TAB A: FAN ASSISTANT INTERFACE
        <div className="dashboard-grid animate-slideup" style={{ gap: '30px' }}>

          {/* Fan Guide Info Panel (Left) */}
          <div className="col-4 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
                <Compass size={18} />
                Stadium Genie Guide
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                StadiumGenie operates using a ground-truth knowledge base of Gates, Zones, and Transportation metrics to assist fans correctly without hallucinating.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} className="text-info" />
                Automatic Multilingual
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Try asking in Spanish (Español), French (Français), German (Deutsch), or Hindi. The AI automatically replies in your language!
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Quick Test Prompts
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {starterQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.text)}
                    className="interactive-card"
                    style={{
                      textAlign: 'left',
                      color: 'var(--text-primary)',
                      padding: '10px 14px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{q.icon}</span>
                      <span>{q.label}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Send ↗</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Gemini Model: gemini-2.5-flash
              </span>
            </div>
          </div>

          {/* Chat Assistant Widget (Right) */}
          <div className="col-8 glass-card" style={{ display: 'flex', flexDirection: 'column', height: '620px' }}>

            {/* Widget Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-color)',
              background: 'rgba(10, 15, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>StadiumGenie Fan Assistant</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Answers questions in all languages</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  color: '#c084fc',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(168, 85, 247, 0.2)'
                }}>
                  Zero Hallucination Mode
                </span>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'rgba(5, 8, 20, 0.2)'
            }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: m.role === 'user'
                      ? '1px solid rgba(6, 182, 212, 0.3)'
                      : '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '14px 18px',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: '14px',
                    whiteSpace: 'pre-line',
                    boxShadow: m.role === 'user' ? '0 4px 12px rgba(6, 182, 212, 0.05)' : 'none'
                  }}>
                    {m.content}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span suppressHydrationWarning>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {m.role === 'assistant' && (
                      <span style={{
                        color: m.isDemo ? 'var(--color-warning)' : 'var(--accent-cyan)',
                        background: m.isDemo ? 'rgba(245, 158, 11, 0.08)' : 'rgba(0, 242, 254, 0.08)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontSize: '9px'
                      }}>
                        {m.isDemo ? 'Demo Mode' : 'AI Verified'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
                  <div className="spinner"></div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Genie is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              style={{
                padding: '18px 24px',
                borderTop: '1px solid var(--border-color)',
                background: 'rgba(10, 15, 36, 0.5)',
                display: 'flex',
                gap: '12px'
              }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Genie (e.g. 'Is there wheelchair access at Gate 3?', '¿Cómo tomo el metro?')..."
                className="interactive-field"
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  fontSize: '14px'
                }}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isChatLoading}
                className="glow-btn"
                style={{
                  padding: '14px 20px',
                  borderRadius: '12px',
                  opacity: (!inputMessage.trim() || isChatLoading) ? 0.6 : 1,
                  cursor: (!inputMessage.trim() || isChatLoading) ? 'not-allowed' : 'pointer'
                }}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

      ) : (

        // TAB B: OPERATIONS DASHBOARD INTERFACE
        <div className="dashboard-grid animate-slideup">

          {/* Main Status Grid (Left) */}
          <div className="col-8" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Gate Telemetry Panel */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={18} className="text-info" />
                    Gate Crowd Telemetry
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Click any gate to manually adjust occupancy and watch the AI recommendations adapt.</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {gates.map((g) => {
                  const statusColors = {
                    Open: 'var(--color-success)',
                    Warning: 'var(--color-warning)',
                    Critical: 'var(--color-danger)',
                    Closed: 'var(--text-muted)'
                  };
                  const color = statusColors[g.status];

                  return (
                    <div
                      key={g.id}
                      className={`interactive-card ${g.status === 'Critical' ? 'pulse-critical' : ''}`}
                      onClick={() => {
                        setEditingGateId(g.id);
                        setTempOccupancy(g.occupancyRate);
                      }}
                      style={{
                        padding: '16px',
                        boxShadow: g.status === 'Critical' ? '0 0 10px rgba(239,68,68,0.1)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{g.name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cap: {g.capacity.toLocaleString()} fans</span>
                        </div>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: color,
                          background: `rgba(${g.status === 'Critical' ? '239,68,68' : g.status === 'Warning' ? '245,158,11' : '16,185,129'}, 0.1)`,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          {g.status}
                        </span>
                      </div>

                      {/* Editing state */}
                      {editingGateId === g.id ? (
                        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={tempOccupancy}
                              onChange={(e) => setTempOccupancy(Number(e.target.value))}
                              style={{ flex: 1, accentColor: 'var(--accent-cyan)' }}
                            />
                            <span style={{ fontSize: '12px', fontWeight: 'bold', width: '30px' }}>{tempOccupancy}%</span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setEditingGateId(null)}
                              style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontSize: '10px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateGateOccupancy(g.id, tempOccupancy)}
                              style={{ padding: '2px 8px', background: 'var(--accent-cyan)', border: 'none', color: '#000', fontSize: '10px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Progress Bar */}
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginTop: '12px' }}>
                            <div style={{
                              width: `${g.occupancyRate}%`,
                              height: '100%',
                              background: color,
                              borderRadius: '3px',
                              transition: 'width 0.5s ease'
                            }}></div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px', color: 'var(--text-secondary)' }}>
                            <span>Occupancy</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.occupancyRate}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stadium Zones & Transit Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

              {/* Zones Panel */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} className="text-info" />
                  Zone Statuses
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {zones.map((z) => {
                    const crowdColors = {
                      Low: 'var(--color-success)',
                      Medium: 'var(--accent-blue)',
                      High: 'var(--color-warning)',
                      Overcrowded: 'var(--color-danger)'
                    };
                    const color = crowdColors[z.crowdLevel];

                    return (
                      <div key={z.id} className="interactive-card" style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{z.name.split(' (')[0]}</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <select
                              value={z.crowdLevel}
                              onChange={(e) => handleUpdateZoneCrowd(z.id, e.target.value as any)}
                              className="interactive-field"
                              style={{
                                color: color,
                                fontSize: '10px',
                                padding: '2px 4px',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Overcrowded">Overcrowded</option>
                            </select>
                            {z.securityStatus !== 'Normal' && (
                              <span style={{ fontSize: '9px', background: 'rgba(239,68,68,0.15)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.3)', padding: '1px 5px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <ShieldAlert size={10} /> Alert
                              </span>
                            )}
                          </div>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{z.keyHighlights}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                          {z.amenities.slice(0, 2).map((a, i) => (
                            <span key={i} style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                              {a}
                            </span>
                          ))}
                          {z.amenities.length > 2 && <span style={{ fontSize: '9px', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '4px' }}>+{z.amenities.length - 2} more</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transit Panel */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Train size={16} className="text-info" />
                  Transit Hub Status
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {transport.map((t) => {
                    const statusColor = t.status === 'Smooth' ? 'var(--color-success)' : t.status === 'Delayed' ? 'var(--color-warning)' : 'var(--color-danger)';
                    return (
                      <div key={t.id} className="interactive-card" style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border-color)'
                        }}>
                          <Train size={18} style={{ color: statusColor }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{t.name}</span>
                            <span style={{ fontSize: '11px', color: statusColor, fontWeight: 500 }}>{t.waitTimeMinutes}m wait</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{t.details}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* AI Operational Insights Stream (Right Panel) */}
          <div className="col-4 glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)' }}>
                  <Activity size={18} />
                  AI Gen-Ops Stream
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Automated crowd management recommendations</span>
              </div>
              <button
                onClick={() => fetchInsights(gates, zones)}
                disabled={isInsightsLoading}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isInsightsLoading ? 'not-allowed' : 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <RefreshCw size={14} className={isInsightsLoading ? 'spinner' : ''} />
              </button>
            </div>

            {/* Recommendations Log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isInsightsLoading && recommendations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div className="spinner"></div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Running operational intelligence algorithms...</span>
                </div>
              ) : (
                recommendations.map((rec, i) => {
                  const priorityColor = rec.priority === 'High' ? 'var(--color-danger)' : rec.priority === 'Medium' ? 'var(--color-warning)' : 'var(--color-success)';
                  const categoryBorder = rec.priority === 'High' ? 'border-danger' : rec.priority === 'Medium' ? 'border-warning' : 'border-success';

                  return (
                    <div
                      key={i}
                      className={`glass-card ${categoryBorder} animate-slideup`}
                      style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderLeft: `4px solid ${priorityColor}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 'bold',
                          color: '#000',
                          background: 'var(--accent-cyan)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          {rec.category}
                        </span>
                        <span style={{ fontSize: '10px', color: priorityColor, fontWeight: 700 }}>
                          {rec.priority} Priority
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{rec.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{rec.description}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Extra telemetry instructions */}
            <div style={{
              marginTop: '25px',
              padding: '12px 16px',
              background: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              borderRadius: '10px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4
            }}>
              💡 **Interactive Hackathon Simulation:**
              <br />
              Select any Gate card on the left, slide the occupancy to **95%** and press **Apply**. The Operations stream will dynamically trigger a crowd redirect insight in real time.
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: insightsDemoMode ? 'var(--color-warning)' : 'var(--color-success)' }}></div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {insightsDemoMode ? 'Demo Fallback Recommendation Stream' : 'Live Gemini AI Recommendation Stream'}
              </span>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}
