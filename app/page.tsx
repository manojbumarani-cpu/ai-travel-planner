'use client';

import { useState, useEffect } from 'react';
import ClientMap from './components/ClientMap';

export default function Home() {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('Moderate');
  const [days, setDays] = useState(3);
  const [interest, setInterest] = useState('Sightseeing & Culture');
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<any>(null);
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const [checkedActivities, setCheckedActivities] = useState<{ [key: string]: boolean }>({});
  const [checkedPacking, setCheckedPacking] = useState<{ [key: string]: boolean }>({});
  const [travelers, setTravelers] = useState(1);

  useEffect(() => {
    const trips = localStorage.getItem('savedTrips');
    if (trips) setSavedTrips(JSON.parse(trips));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTripData(null);
    setActiveDay(1);
    setCheckedActivities({});
    setCheckedPacking({});
    setTravelers(1);

    try {
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, budget, days, interest }),
      });
      const data = await response.json();
      if (response.ok) {
        setTripData(data);
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err: any) {
      alert('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const toggleActivityCheck = (act: string) => {
    setCheckedActivities(prev => ({ ...prev, [act]: !prev[act] }));
  };

  const togglePackingCheck = (item: string) => {
    setCheckedPacking(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleSaveTrip = () => {
    if (!tripData) return;
    const updatedTrips = [tripData, ...savedTrips];
    setSavedTrips(updatedTrips);
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
    alert('Trip archived successfully!');
  };

  const handleClearSaved = () => {
    setSavedTrips([]);
    localStorage.removeItem('savedTrips');
  };

  const handleCopyClipboard = () => {
    if (!tripData) return;
    const text = `PlanMyWay Blueprint: ${tripData.destination}\nSummary: ${tripData.summary}\n\nMust Visit: ${tripData.mustVisitPlaces?.join(', ')}`;
    navigator.clipboard.writeText(text);
    alert('Trip itinerary copied to clipboard!');
  };

  const packingCount = tripData?.packingList 
    ? tripData.packingList.filter((item: string) => checkedPacking[item]).length 
    : 0;
  const totalPacking = tripData?.packingList ? tripData.packingList.length : 0;
  const packingProgress = totalPacking > 0 ? Math.round((packingCount / totalPacking) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#070913] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Cinematic Glowing Orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full"></div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span>✨ Autonomous AI Travel Engine</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white">
            Plan<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-500">MyWay</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base font-light">
            Generate cinematic itineraries, seasonality metrics, localized currency budgets, smart packing trackers, and interactive maps.
          </p>
        </div>

        {/* Input Form Card with Glassmorphism */}
        <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-6">
          <div>
            <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 font-semibold">Where do you want to go?</label>
            <input
              type="text"
              required
              placeholder="e.g., Kyoto, Japan or Santorini, Greece"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-medium text-base transition shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 font-semibold">Budget Tier</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition font-medium">
                <option value="Budget">🎒 Backpacker</option>
                <option value="Moderate">⭐ Moderate</option>
                <option value="Luxury">💎 Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 font-semibold">Duration (Days)</label>
              <input type="number" min={1} max={14} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition font-medium" />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 font-semibold">Expedition Vibe</label>
              <select value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition font-medium">
                <option value="Sightseeing & Culture">🏛️ Culture</option>
                <option value="Food & Culinary">🍜 Food</option>
                <option value="Adventure & Outdoors">🌲 Adventure</option>
                <option value="Relaxation & Spa">✨ Relaxation</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-400 via-teal-400 to-fuchsia-500 text-slate-950 font-black py-4 rounded-2xl hover:opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.4)] uppercase tracking-widest text-sm">
            {loading ? '✨ Synthesizing Reality Coordinates...' : '🚀 Initialize Trip Blueprint'}
          </button>
        </form>

        {/* Results Cinematic Display Card */}
        {tripData && (
          <div className="bg-slate-900/70 backdrop-blur-3xl border border-slate-800/80 p-8 sm:p-12 rounded-[2.5rem] space-y-10 relative shadow-[0_16px_48px_0_rgba(0,0,0,0.5)]">
            
            {/* Top Bar Actions */}
            <div className="absolute top-8 right-8 flex gap-2.5">
              <button onClick={handleCopyClipboard} className="bg-slate-800/80 hover:bg-slate-700 text-cyan-400 text-xs font-mono py-2.5 px-3 rounded-xl border border-cyan-500/30 transition shadow-md">
                📋 COPY LINK
              </button>
              <button onClick={() => window.print()} className="bg-slate-800/80 hover:bg-slate-700 text-cyan-400 text-xs font-mono py-2.5 px-3 rounded-xl border border-cyan-500/30 transition shadow-md">
                🖨️ PDF
              </button>
              <button onClick={handleSaveTrip} className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 text-xs font-mono font-black py-2.5 px-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition hover:opacity-90">
                💾 SAVE
              </button>
            </div>

            {/* Destination Title & Overview */}
            <div className="space-y-3">
              <div className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">Target Confirmed</div>
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">{tripData.destination}</h2>
              <p className="text-slate-300 text-base leading-relaxed max-w-2xl font-light">{tripData.summary}</p>
            </div>

            {/* Weather, Seasonality & Transit Intelligence Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tripData.weatherOutlook && (
                <div className="bg-indigo-950/30 border border-indigo-500/20 p-5 rounded-3xl space-y-2 backdrop-blur-md">
                  <div className="text-indigo-400 font-mono text-xs uppercase font-bold tracking-wider">🌤️ Weather</div>
                  <p className="text-slate-200 text-xs leading-relaxed font-light">{tripData.weatherOutlook}</p>
                </div>
              )}
              {tripData.seasonality && (
                <div className="bg-fuchsia-950/30 border border-fuchsia-500/20 p-5 rounded-3xl space-y-2 backdrop-blur-md">
                  <div className="text-fuchsia-400 font-mono text-xs uppercase font-bold tracking-wider">⏳ Best Season</div>
                  <p className="text-slate-200 text-xs leading-relaxed font-light">{tripData.seasonality}</p>
                </div>
              )}
              {tripData.transitGuide && (
                <div className="bg-cyan-950/30 border border-cyan-500/20 p-5 rounded-3xl space-y-2 backdrop-blur-md">
                  <div className="text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">🚆 Transit Guide</div>
                  <p className="text-slate-200 text-xs leading-relaxed font-light">{tripData.transitGuide}</p>
                </div>
              )}
            </div>

            {/* Local Secrets & Traps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripData.localSecret && (
                <div className="bg-cyan-950/20 border border-cyan-500/30 p-5 rounded-3xl space-y-2 backdrop-blur-md">
                  <div className="text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">🕵️‍♂️ Local Underground Secret</div>
                  <p className="text-slate-200 text-xs leading-relaxed font-light">{tripData.localSecret}</p>
                </div>
              )}
              {tripData.touristTrapsToAvoid && (
                <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded-3xl space-y-2 backdrop-blur-md">
                  <div className="text-rose-400 font-mono text-xs uppercase font-bold tracking-wider">⚠️ Traps to Bypass</div>
                  <ul className="text-slate-200 text-xs space-y-1 list-disc list-inside font-light">
                    {tripData.touristTrapsToAvoid.map((t: string, i: number) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Must-Visit Landmarks */}
            {tripData.mustVisitPlaces && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">🌟 Prime Coordinates (Must-Visit)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tripData.mustVisitPlaces.map((p: string, i: number) => (
                    <div key={i} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs font-semibold text-slate-200 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Breakdown & Group Splitter */}
            {tripData.budgetBreakdown && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">💰 Capital Allocation (Local Currency)</h3>
                  
                  <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <span className="text-xs text-slate-400 font-mono">Travelers:</span>
                    <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="text-cyan-400 font-bold px-1.5 hover:text-white">-</button>
                    <span className="text-xs font-bold text-white">{travelers}</span>
                    <button onClick={() => setTravelers(travelers + 1)} className="text-cyan-400 font-bold px-1.5 hover:text-white">+</button>
                    {travelers > 1 && <span className="text-[10px] text-fuchsia-400 font-mono ml-1">(Split)</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(tripData.budgetBreakdown).map(([k, v]: [string, any], i: number) => (
                    <div key={i} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center backdrop-blur-md">
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{k}</div>
                      <div className="text-xs font-bold text-cyan-300 mt-1">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency & Phrases Widget */}
            {tripData.emergencyAndPhrases && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl space-y-2">
                  <div className="text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">🚨 Emergency Helpline</div>
                  <div className="text-white text-base font-bold tracking-wide">{tripData.emergencyAndPhrases.emergencyNumber}</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl space-y-2">
                  <div className="text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">🗣️ Local Phrase Matrix</div>
                  <ul className="text-slate-300 text-xs space-y-1 font-light">
                    {tripData.emergencyAndPhrases.phrases?.map((ph: string, i: number) => (
                      <li key={i}>• {ph}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Smart Packing List with Progress Bar */}
            {tripData.packingList && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">🎒 Adaptive Gear Checklist</h3>
                  <span className="text-xs font-mono text-fuchsia-400 font-bold">{packingCount}/{totalPacking} Packed ({packingProgress}%)</span>
                </div>

                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 h-full transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${packingProgress}%` }}></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {tripData.packingList.map((item: string, i: number) => {
                    const isPacked = checkedPacking[item];
                    return (
                      <div 
                        key={i} 
                        onClick={() => togglePackingCheck(item)}
                        className={`p-3 rounded-2xl text-xs cursor-pointer border transition-all flex items-center gap-2.5 ${
                          isPacked ? 'bg-cyan-950/20 border-cyan-500/40 text-slate-500 line-through' : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-lg border flex items-center justify-center text-[10px] transition-all ${isPacked ? 'bg-cyan-400 border-cyan-400 text-slate-950 font-bold shadow-[0_0_8px_#22d3ee]' : 'border-slate-700'}`}>
                          {isPacked ? '✓' : ''}
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Map */}
            {tripData.coordinates && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">🗺️ Spatial Grid Matrix</h3>
                <div className="overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                  <ClientMap center={tripData.coordinates} />
                </div>
              </div>
            )}

            {/* Chronological Itinerary Simulator */}
            <div className="space-y-6">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">📅 Chronological Itinerary Simulator</h3>
              
              <div className="flex flex-wrap gap-2">
                {tripData.itinerary?.map((d: any) => (
                  <button 
                    key={d.day} 
                    onClick={() => setActiveDay(d.day)} 
                    className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all uppercase tracking-widest ${
                      activeDay === d.day 
                        ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Phase 0{d.day}
                  </button>
                ))}
              </div>

              {tripData.itinerary?.map((d: any) => {
                if (d.day !== activeDay) return null;
                return (
                  <div key={d.day} className="border-l-2 border-cyan-400 pl-6 py-4 bg-slate-950/60 rounded-r-3xl space-y-3 backdrop-blur-md">
                    <h4 className="font-mono text-cyan-400 text-xs uppercase tracking-widest font-bold">Phase 0{d.day} Execution Sequence</h4>
                    <div className="space-y-2.5 pt-1">
                      {d.activities.map((act: string, i: number) => {
                        const isChecked = checkedActivities[act];
                        return (
                          <div 
                            key={i} 
                            onClick={() => toggleActivityCheck(act)} 
                            className={`p-4 rounded-2xl border text-xs cursor-pointer flex items-center gap-3 transition-all ${
                              isChecked 
                                ? 'bg-cyan-950/20 border-cyan-500/40 text-slate-500 line-through' 
                                : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-xl border flex items-center justify-center text-[10px] transition-all ${isChecked ? 'bg-cyan-400 border-cyan-400 text-slate-950 font-bold shadow-[0_0_8px_#22d3ee]' : 'border-slate-700'}`}>
                              {isChecked ? '✓' : ''}
                            </div>
                            <span className="font-medium text-sm">{act}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommended Restaurants */}
            {tripData.restaurants && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">🍜 Recommended Gastronomy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tripData.restaurants.map((res: string, i: number) => (
                    <div key={i} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs font-medium text-slate-200 flex items-center gap-3">
                      <span className="text-fuchsia-400 font-bold">✦</span> {res}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Saved Trips Archive Section */}
        {savedTrips.length > 0 && (
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-[2.5rem] space-y-6 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest">🧳 Archived Blueprints</h3>
              <button onClick={handleClearSaved} className="text-xs font-mono text-rose-400 hover:text-rose-300 underline">Purge History</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedTrips.map((trip, idx) => (
                <div key={idx} onClick={() => { setTripData(trip); setActiveDay(1); }} className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl cursor-pointer hover:border-cyan-400 transition-all group">
                  <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition">{trip.destination}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-light">{trip.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}