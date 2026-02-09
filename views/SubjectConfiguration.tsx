
import React, { useState } from 'react';
import { Plus, Trash2, Settings2 } from 'lucide-react';
import { Subject, ClassLevel } from '../types';

interface SubjectConfigurationProps {
  subjects: Record<ClassLevel, Subject[]>;
  setSubjects: React.Dispatch<React.SetStateAction<Record<ClassLevel, Subject[]>>>;
}

const SubjectConfiguration: React.FC<SubjectConfigurationProps> = ({ subjects, setSubjects }) => {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(ClassLevel.TEN);
  const [newSub, setNewSub] = useState<Partial<Subject>>({ fullMarks: 100, passMarks: 33 });

  const addSubject = () => {
    if (!newSub.name) return;
    const s: Subject = {
      ...newSub,
      id: `sub-${Date.now()}`,
    } as Subject;
    
    setSubjects(prev => ({
      ...prev,
      [selectedClass]: [...prev[selectedClass], s]
    }));
    setNewSub({ fullMarks: 100, passMarks: 33 });
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => ({
      ...prev,
      [selectedClass]: prev[selectedClass].filter(s => s.id !== id)
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Settings2 size={20} className="text-blue-500" />
          Select Class
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(ClassLevel).map(level => (
            <button
              key={level}
              onClick={() => setSelectedClass(level)}
              className={`p-4 rounded-xl border text-center transition-all ${
                selectedClass === level 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 font-bold' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              Class {level}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Class {selectedClass} - Subject List</h3>
          <div className="space-y-3">
            {subjects[selectedClass].map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 group">
                <div>
                  <p className="font-bold text-slate-800">{sub.name}</p>
                  <p className="text-xs text-slate-500">Full: {sub.fullMarks} | Pass: {sub.passMarks}</p>
                </div>
                <button 
                  onClick={() => removeSubject(sub.id)}
                  className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <h4 className="font-bold text-sm text-slate-700 mb-4 uppercase tracking-wider">Add New Subject</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <input 
                  placeholder="Subject Name" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={newSub.name || ''}
                  onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Full" 
                  className="w-20 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={newSub.fullMarks || ''}
                  onChange={(e) => setNewSub({...newSub, fullMarks: parseInt(e.target.value)})}
                />
                <input 
                  type="number" 
                  placeholder="Pass" 
                  className="w-20 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={newSub.passMarks || ''}
                  onChange={(e) => setNewSub({...newSub, passMarks: parseInt(e.target.value)})}
                />
                <button 
                  onClick={addSubject}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectConfiguration;
