"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface NotesPanelProps {
  monthNote: string;
  rangeNote: string;
  rangeLabel: string;
  onMonthNoteChange: (value: string) => void;
  onRangeNoteChange: (value: string) => void;
}

type TabType = "Events" | "Reminders" | "Goals";

interface ParsedNote {
  events: string;
  reminders: { text: string; time?: string; done: boolean }[];
  goals: { text: string; done: boolean }[];
}

const defaultNote: ParsedNote = { events: "", reminders: [], goals: [] };

function parseData(raw: string): ParsedNote {
  if (!raw) return defaultNote;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        events: parsed.events || "",
        reminders: Array.isArray(parsed.reminders) ? parsed.reminders : [],
        goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      };
    }
  } catch (e) {}
  return { ...defaultNote, events: raw };
}

export function NotesPanel({
  monthNote,
  rangeNote,
  rangeLabel,
  onMonthNoteChange,
  onRangeNoteChange,
}: NotesPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Events");
  const [inputValue, setInputValue] = useState("");
  const [inputTime, setInputTime] = useState("");

  // Determine current active note based on whether a range is selected
  const isRange = !!rangeLabel;
  const currentRaw = isRange ? rangeNote : monthNote;
  const data = parseData(currentRaw);

  // Edge case fix: Reset buffers when the user clicks a different date
  useEffect(() => {
    setInputValue("");
    setInputTime("");
  }, [rangeLabel, monthNote]);

  const saveToParent = (newData: ParsedNote) => {
    const raw = JSON.stringify(newData);
    if (isRange) onRangeNoteChange(raw);
    else onMonthNoteChange(raw);
  };

  const handleSaveEvents = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    saveToParent({ ...data, events: e.target.value });
  };

  const appendEmoji = (emoji: string) => {
    saveToParent({ ...data, events: data.events + emoji });
  };

  const handleAddListItem = (type: "reminders" | "goals") => {
    if (!inputValue.trim()) return;
    const list = data[type];
    const newItem: any = { text: inputValue.trim(), done: false };
    if (type === "reminders" && inputTime) {
      newItem.time = inputTime;
    }
    saveToParent({ ...data, [type]: [...list, newItem] });
    setInputValue("");
    setInputTime("");
  };

  const toggleListItem = (type: "reminders" | "goals", index: number) => {
    const list = [...data[type]];
    list[index].done = !list[index].done;
    saveToParent({ ...data, [type]: list });
  };

  const deleteListItem = (type: "reminders" | "goals", index: number) => {
    const list = [...data[type]];
    list.splice(index, 1);
    saveToParent({ ...data, [type]: list });
  };

  return (
    <div className="flex h-full flex-col gap-6 w-full">
      {/* Plan Schedule Block */}
      <div className="neu-panel bg-[#f4f5f6] px-5 py-6 flex flex-col rounded-3xl shrink-0">
        <h3 className="text-[14px] font-semibold text-[#334155] mb-5 pl-1 tracking-wide">
          PLAN SCHEDULE
        </h3>
        
        <div className="flex w-full justify-between items-center px-1">
          <button 
            type="button"
            onClick={() => setActiveTab("Events")}
            className={`flex flex-col items-center gap-1 group transition-opacity ${activeTab !== "Events" ? "opacity-60 hover:opacity-100" : ""}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeTab === "Events" ? "neu-panel bg-white shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,1)] text-slate-800 scale-105" : "text-slate-600"}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={`text-[10px] font-semibold mt-1 ${activeTab === "Events" ? "text-slate-700" : "text-slate-500"}`}>Events</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab("Reminders")}
            className={`flex flex-col items-center gap-1 group transition-opacity ${activeTab !== "Reminders" ? "opacity-60 hover:opacity-100" : ""}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeTab === "Reminders" ? "neu-panel bg-white shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,1)] text-slate-800 scale-105" : "text-slate-600"}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className={`text-[10px] font-semibold mt-1 ${activeTab === "Reminders" ? "text-slate-700" : "text-slate-500"}`}>Reminders</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("Goals")}
            className={`flex flex-col items-center gap-1 group transition-opacity ${activeTab !== "Goals" ? "opacity-60 hover:opacity-100" : ""}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeTab === "Goals" ? "neu-panel bg-white shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,1)] text-slate-800 scale-105" : "text-slate-600"}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v8l9-11h-7z" />
              </svg>
            </div>
            <span className={`text-[10px] font-semibold mt-1 ${activeTab === "Goals" ? "text-slate-700" : "text-slate-500"}`}>Goals</span>
          </button>
        </div>
      </div>

      <div className="neu-panel bg-[#f4f5f6] flex-1 flex flex-col px-6 py-5 rounded-3xl min-h-[220px]">
        <div className="flex justify-between items-center mb-3 border-b border-gray-200/60 pb-3">
          <h3 className="text-[13px] font-bold text-slate-700 tracking-wider uppercase">
            {isRange && rangeLabel ? `${activeTab} (${rangeLabel})` : `${activeTab} (Month)`}
          </h3>
        </div>
        
        <div className="flex-1 relative flex flex-col">
          {activeTab === "Events" && (
            <>
              <div className="flex gap-2 mb-2 pb-2 border-b border-gray-200/50 overflow-x-auto custom-scrollbar">
                {["🎂", "🕘", "🚨", "🧳", "🎯", "📈"].map(emoji => (
                  <button key={emoji} onClick={() => appendEmoji(emoji)} className="shrink-0 w-8 h-8 rounded bg-white shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={data.events}
                  onChange={handleSaveEvents}
                  placeholder="Type an event here..."
                  className="w-full h-full resize-none bg-transparent outline-none text-slate-700 leading-relaxed pt-1 z-10 relative font-medium text-[13px]"
                  spellCheck={false}
                />
              </div>
            </>
          )}

          {(activeTab === "Reminders" || activeTab === "Goals") && (
            <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1 pt-1">
              {data[activeTab.toLowerCase() as "reminders" | "goals"].map((item, i) => (
                <div key={i} className="flex flex-row items-center gap-2 group py-1.5 px-2 rounded-lg hover:bg-slate-200/50 transition-colors">
                  <button onClick={() => toggleListItem(activeTab.toLowerCase() as "reminders"|"goals", i)} className={`shrink-0 w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${item.done ? "bg-slate-800 border-slate-800 text-white" : "border-slate-400 text-transparent hover:border-slate-600"}`}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </button>
                  {activeTab === "Reminders" && !item.done && <span className="text-[11px] shrink-0">🚨</span>}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <span className={`text-[13px] truncate ${item.done ? "line-through text-slate-400" : "text-slate-700 font-medium"}`}>
                      {item.text}
                    </span>
                    {activeTab === "Reminders" && item.time && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-semibold">
                        <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {item.time}
                      </span>
                    )}
                  </div>
                  <button onClick={() => deleteListItem(activeTab.toLowerCase() as "reminders"|"goals", i)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              
              {data[activeTab.toLowerCase() as "reminders"| "goals"].length === 0 && (
                <div className="flex justify-center text-slate-400 text-xs italic mt-2 opacity-70">No {activeTab.toLowerCase()} set.</div>
              )}

              <div className="flex flex-col gap-2 mt-auto pt-4 pb-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddListItem(activeTab.toLowerCase() as "reminders"|"goals")}
                    placeholder={`New ${activeTab.slice(0, -1)}...`}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] outline-none focus:ring-2 focus:ring-blue-100 font-medium text-slate-700 shadow-sm"
                  />
                </div>
                {activeTab === "Reminders" && (
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[12px] bg-white rounded-md px-2 py-1 shadow-sm border border-slate-200">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <input 
                        type="time" 
                        value={inputTime}
                        onChange={(e) => setInputTime(e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-600 font-medium cursor-pointer"
                      />
                    </div>
                    <button onClick={() => handleAddListItem(activeTab.toLowerCase() as "reminders"|"goals")} className="px-4 py-1.5 bg-slate-800 text-white rounded-md text-[11px] font-bold tracking-wider hover:bg-slate-700 shadow-md active:scale-95 transition-all">
                      ADD
                    </button>
                  </div>
                )}
                {activeTab === "Goals" && (
                  <div className="flex justify-end px-1 mt-1">
                     <button onClick={() => handleAddListItem(activeTab.toLowerCase() as "reminders"|"goals")} className="px-4 py-1.5 bg-slate-800 text-white rounded-md text-[11px] font-bold tracking-wider hover:bg-slate-700 shadow-md active:scale-95 transition-all">
                      ADD
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


