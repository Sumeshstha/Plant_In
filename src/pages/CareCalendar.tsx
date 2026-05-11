import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Droplets, Wind, Plus, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGarden } from '../context/GardenContext';
import { useOutletContext } from 'react-router-dom';

export default function CareCalendar() {
  const navigate = useNavigate();
  const { tasks } = useGarden();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`pad-${i}`} className="h-24" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isToday = d === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() && 
                    currentDate.getFullYear() === new Date().getFullYear();
    
    // Mocking some tasks for the calendar view
    // In a real app we would map tasks to specific dates
    const hasTask = (d % 3 === 0);
    const hasFertilizer = (d % 7 === 0);

    days.push(
      <div key={d} className={`h-24 border-t border-l border-outline-variant/10 p-2 relative transition-colors hover:bg-surface-container-low cursor-pointer ${isToday ? 'bg-primary/5' : ''}`}>
        <span className={`text-xs font-bold ${isToday ? 'bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center' : 'text-on-surface-variant'}`}>
          {d}
        </span>
        <div className="mt-2 space-y-1">
          {hasTask && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[8px] font-bold px-1.5 py-0.5 rounded">
              <Droplets className="w-2 h-2" />
              <span>Water</span>
            </div>
          )}
          {hasFertilizer && (
            <div className="flex items-center gap-1 bg-orange-100 text-orange-700 text-[8px] font-bold px-1.5 py-0.5 rounded">
              <Wind className="w-2 h-2" />
              <span>Fix</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={openSidebar} className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-xl text-primary">Care Calendar</h1>
        </div>
        <button className="p-2 hover:bg-surface-container rounded-full text-primary">
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 flex-1 flex flex-col p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-outline-variant/10 overflow-hidden flex flex-col flex-1">
          {/* Calendar Header */}
          <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
            <h2 className="font-headline font-bold text-2xl text-on-surface">
              {monthNames[currentDate.getMonth()]} <span className="font-normal opacity-50">{currentDate.getFullYear()}</span>
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 rounded-lg transition-colors">
                Today
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-surface-container-lowest">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 flex-1 border-r border-b border-outline-variant/10">
            {days}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 justify-center">
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Watering</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>Fertilizing</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Repotting</span>
          </div>
        </div>
      </main>
    </div>
  );
}
