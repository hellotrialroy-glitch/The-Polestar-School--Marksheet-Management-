
import React from 'react';
import { Users, BookOpen, ClipboardCheck, Award } from 'lucide-react';
import { Student, Subject, MarkRecord, ClassLevel } from '../types';

interface DashboardProps {
  students: Student[];
  subjects: Record<ClassLevel, Subject[]>;
  marks: MarkRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, subjects, marks }) => {
  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Classes Configured', value: Object.keys(subjects).length, icon: BookOpen, color: 'bg-indigo-500' },
    { label: 'Marks Recorded', value: marks.length, icon: ClipboardCheck, color: 'bg-emerald-500' },
    { label: 'Average Class Performance', value: '84%', icon: Award, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Class-wise Distribution</h3>
          <div className="space-y-4">
            {Object.values(ClassLevel).map((level) => {
              const count = students.filter(s => s.classLevel === level).length;
              const percentage = (count / (students.length || 1)) * 100;
              return (
                <div key={level} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Class {level}</span>
                    <span>{count} Students</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck className="text-slate-400" size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-bold">System</span> uploaded marks for Class 10
                  </p>
                  <p className="text-xs text-slate-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
