"use client";

import { motion } from "framer-motion";

interface NotesPanelProps {
  monthNote: string;
  rangeNote: string;
  rangeLabel: string;
  onMonthNoteChange: (value: string) => void;
  onRangeNoteChange: (value: string) => void;
}

type TabType = "Events" | "Reminders" | "Goals";

export function NotesPanel({
  monthNote,
  onMonthNoteChange,
}: NotesPanelProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("Events");

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

      {/* Notes Block */}
      <div className="neu-panel bg-[#f4f5f6] flex-1 flex flex-col px-5 py-6 rounded-3xl min-h-[180px]">
        <div className="flex justify-between items-center mb-2 pl-1 pr-1">
          <h3 className="text-[14px] font-semibold text-[#334155] tracking-wide">
            NOTES
          </h3>
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        
        <div className="flex-1 relative mt-1">
          <div className="absolute inset-x-0 top-0 bottom-2 pointer-events-none" style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #d1d5db 31px, #d1d5db 32px)",
            backgroundPosition: "0 6px"
          }} />
          <textarea
            value={monthNote}
            onChange={(e) => onMonthNoteChange(e.target.value)}
            className="w-full h-full resize-none bg-transparent outline-none text-[#475569] leading-[32px] pt-[6px] z-10 relative font-medium text-[14px]"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}


