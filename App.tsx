
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  ClipboardList, 
  FileText, 
  PlusCircle, 
  Download, 
  Upload,
  Search,
  School,
  LogOut,
  ChevronRight,
  Printer
} from 'lucide-react';
import { ClassLevel, Student, Subject, MarkRecord } from './types';
import { INITIAL_SUBJECTS } from './constants';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getGradePoint, calculateGPA, getFinalGrade } from './utils/calculations';

// Views
import Dashboard from './views/Dashboard';
import StudentManagement from './views/StudentManagement';
import SubjectConfiguration from './views/SubjectConfiguration';
import MarksEntry from './views/MarksEntry';
import ReportGenerator from './views/ReportGenerator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'subjects' | 'marks' | 'reports'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Record<ClassLevel, Subject[]>>(INITIAL_SUBJECTS);
  const [marks, setMarks] = useState<MarkRecord[]>([]);

  // Local Storage Sync
  useEffect(() => {
    const savedStudents = localStorage.getItem('polestar_students');
    const savedSubjects = localStorage.getItem('polestar_subjects');
    const savedMarks = localStorage.getItem('polestar_marks');

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedMarks) setMarks(JSON.parse(savedMarks));
  }, []);

  useEffect(() => {
    localStorage.setItem('polestar_students', JSON.stringify(students));
    localStorage.setItem('polestar_subjects', JSON.stringify(subjects));
    localStorage.setItem('polestar_marks', JSON.stringify(marks));
  }, [students, subjects, marks]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'marks', label: 'Marks Entry', icon: ClipboardList },
    { id: 'reports', label: 'Reports/Marksheets', icon: FileText },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col no-print">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-white p-2 rounded-lg">
            <School className="text-slate-900 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xs font-bold leading-tight uppercase tracking-widest text-slate-400">System</h1>
            <p className="font-semibold text-sm truncate w-32">THE POLESTAR SCHOOL</p>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Administrator</p>
              <p className="text-[10px] text-slate-400">Super Admin</p>
            </div>
            <LogOut size={14} className="text-slate-500 hover:text-white cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-50 relative">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between no-print">
          <div>
            <h2 className="text-xl font-bold capitalize text-slate-800">{activeTab}</h2>
            <p className="text-sm text-slate-500">The Polestar School Management System</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search student..." 
                 className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg text-sm transition-all"
               />
             </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard students={students} subjects={subjects} marks={marks} />}
          {activeTab === 'students' && (
            <StudentManagement 
              students={students} 
              setStudents={setStudents} 
            />
          )}
          {activeTab === 'subjects' && (
            <SubjectConfiguration 
              subjects={subjects} 
              setSubjects={setSubjects} 
            />
          )}
          {activeTab === 'marks' && (
            <MarksEntry 
              students={students} 
              subjects={subjects} 
              marks={marks} 
              setMarks={setMarks} 
            />
          )}
          {activeTab === 'reports' && (
            <ReportGenerator 
              students={students} 
              subjects={subjects} 
              marks={marks} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
