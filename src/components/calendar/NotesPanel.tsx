"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface NotesPanelProps {
  viewMode?: "left" | "right" | "all";
  monthNote: string;
  rangeNote: string;
  rangeLabel: string;
  isToday?: boolean;
  onMonthNoteChange: (value: string) => void;
  onRangeNoteChange: (value: string) => void;
}

type TabType = "Notes" | "Events" | "Goals";

interface ParsedNote {
  notes: string;
  events: string;
  goals: { text: string; done: boolean }[];
}

const defaultNote: ParsedNote = { notes: "", events: "", goals: [] };

function parseData(raw: string): ParsedNote {
  if (!raw) return defaultNote;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        notes: parsed.notes || "",
        events: parsed.events || "",
        goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      };
    }
  } catch (e) {}
  return { ...defaultNote, notes: raw };
}

export function NotesPanel({
  viewMode = "all",
  monthNote,
  rangeNote,
  rangeLabel,
  isToday,
  onMonthNoteChange,
  onRangeNoteChange,
}: NotesPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>(
    viewMode === "left" ? "Notes" : "Events"
  );
  const [inputValue, setInputValue] = useState("");

  const isRange = !!rangeLabel;
  const currentRaw = isRange ? rangeNote : monthNote;
  const data = parseData(currentRaw);

  useEffect(() => {
    setInputValue("");
  }, [rangeLabel, monthNote]);

  const saveToParent = (newData: ParsedNote) => {
    const raw = JSON.stringify(newData);
    if (isRange) onRangeNoteChange(raw);
    else onMonthNoteChange(raw);
  };

  const handleSaveNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    saveToParent({ ...data, notes: e.target.value });
  };

  const handleSaveEvents = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    saveToParent({ ...data, events: e.target.value });
  };

  const handleAddListItem = (type: "goals") => {
    if (!inputValue.trim()) return;
    const list = data[type];
    const newItem = { text: inputValue.trim(), done: false };
    saveToParent({ ...data, [type]: [...list, newItem] });
    setInputValue("");
  };

  const toggleListItem = (type: "goals", index: number) => {
    const list = data[type].map((item, i) => 
      i === index ? { ...item, done: !item.done } : item
    );
    saveToParent({ ...data, [type]: list });
  };

  const deleteListItem = (type: "goals", index: number) => {
    const list = data[type].filter((_, i) => i !== index);
    saveToParent({ ...data, [type]: list });
  };

  return (
    <div className="flex h-full flex-col gap-6 w-full max-h-full overflow-hidden">
      <div className="neu-panel px-6 py-5 flex flex-col rounded-[2rem] shrink-0 border border-white/5">
        <h3 className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] mb-4">
           {viewMode === "left" ? "Navigation" : "Plan Schedule"}
        </h3>
        
        <div className="flex w-full gap-4 items-center">
          {viewMode === "left" ? (
             <div className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 neu-pressed text-accent bg-accent/5 font-bold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-xs uppercase tracking-wider">My Journal</span>
             </div>
          ) : (
            <>
              <button 
                type="button"
                onClick={() => setActiveTab("Events")}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === "Events" ? "neu-pressed text-accent bg-accent/5 font-bold" : "text-muted hover:text-foreground"}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs uppercase tracking-wider">Events</span>
              </button>
    
              <button 
                type="button"
                onClick={() => setActiveTab("Goals")}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === "Goals" ? "neu-pressed text-accent bg-accent/5 font-bold" : "text-muted hover:text-foreground"}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs uppercase tracking-wider">Goals</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="neu-panel flex-1 flex flex-col px-7 py-6 rounded-[2.5rem] min-h-[250px] border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div className="flex flex-col gap-0.5 max-w-[70%]">
            <h2 className="text-base font-bold text-foreground tracking-tight">
               {viewMode === "left" ? "Day Notes" : activeTab}
            </h2>
            {isRange && (
              <span className="text-[10px] sm:text-xs font-semibold text-accent opacity-90 truncate">
                {rangeLabel}
              </span>
            )}
          </div>
          {isToday && (
             <span className="text-[9px] font-black py-0.5 px-2 rounded-full bg-accent text-white uppercase tracking-tighter shadow-md">Today</span>
          )}
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode === "left" ? (
            <textarea
              value={data.notes}
              onChange={handleSaveNotes}
              placeholder="Write your thoughts..."
              className="w-full h-full resize-none bg-transparent outline-none text-foreground leading-relaxed font-serif text-base custom-scrollbar italic placeholder:text-muted/40"
              spellCheck={false}
            />
          ) : activeTab === "Events" ? (
            <textarea
              value={data.events}
              onChange={handleSaveEvents}
              placeholder="List events..."
              className="w-full h-full resize-none bg-transparent outline-none text-foreground leading-relaxed font-medium text-xs custom-scrollbar placeholder:text-muted/40"
              spellCheck={false}
            />
          ) : (
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar pr-1 pt-1">
              {data.goals.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex flex-row items-center gap-3 group py-3 px-4 rounded-2xl transition-all cursor-pointer border ${item.done ? "bg-accent/5 border-accent/20" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
                  onClick={() => toggleListItem("goals", i)}
                >
                  <div className={`shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${item.done ? "bg-accent border-accent text-white" : "border-muted/40 text-transparent"}`}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className={`text-[13px] truncate ${item.done ? "line-through text-muted/50" : "text-foreground font-semibold"}`}>
                      {item.text}
                    </span>
                    {item.done && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-accent mt-0.5">
                        Task Finished
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteListItem("goals", i); }} 
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="relative group">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddListItem("goals")}
                    placeholder="New goal..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-accent/30 font-medium text-foreground transition-all"
                  />
                   <button 
                      onClick={() => handleAddListItem("goals")}
                      className="absolute right-1 top-1 h-6 px-3 bg-accent text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg active:scale-95 transition-all"
                    >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
