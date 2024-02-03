import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import { parse, getFinalsTimes, ics } from '../content_script';



const App = () => {
  useEffect(() => {
    const generateGoogleCalendar = async () => {
      let courses = [];
      let finalTimeFinder = await getFinalsTimes();

      let schedule = parse();
      for (let i = 0; i < schedule.length; i++) {
        let timeStart = schedule[i].meetingTimeStart.replace(/^0+/, "").toUpperCase();
        let timeEnd = schedule[i].meetingTimeEnd.replace(/^0+/, "").toUpperCase();
        let timeKey = timeStart + " - " + timeEnd;
        let dateKey = schedule[i].meetingPattern.map(date => date.substring(0,2)).join("-");
        schedule[i].finalExamDate = finalTimeFinder.get(dateKey).get(timeKey);
      }

      console.log(schedule);
      console.log(ics(schedule));
    };

    document.getElementById('addToGoogleCalendarButton').addEventListener('click', generateGoogleCalendar);

    return () => {
      document.getElementById('addToGoogleCalendarButton').removeEventListener('click', generateGoogleCalendar);
    };
  }, []);

  return (
    <div className="antialiased bg-slate-200 text-slate-600 py-8 pb-4">
      <div className="max-w-xl mx-auto p-6 bg-green rounded-lg shadow my-10">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
      <img src="logo.png" alt="Logo" className="w-16 h-16" />
      </div>
        <h1 className="text-2xl font-medium mb-5 text-center">Generate your BroCal</h1>

        <div className="flex space-x-2">
          <button
            id="addToGoogleCalendarButton"
            className="flex-1 text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </span>
            <span>Google Calendar</span>
          </button>
        </div>

        <hr className="my-5 border border-slate-100" />

        <div className="flex space-x-2">
        </div>
      </div>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);