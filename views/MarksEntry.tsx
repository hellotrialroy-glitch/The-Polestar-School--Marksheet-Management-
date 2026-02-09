
import React, { useState } from 'react';
import { Save, Filter, AlertCircle } from 'lucide-react';
import { Student, Subject, MarkRecord, ClassLevel } from '../types';

interface MarksEntryProps {
  students: Student[];
  subjects: Record<ClassLevel, Subject[]>;
  marks: MarkRecord[];
  setMarks: React.Dispatch<React.SetStateAction<MarkRecord[]>>;
}

const MarksEntry: React.FC<MarksEntryProps> = ({ students, subjects, marks, setMarks }) => {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(ClassLevel.ONE);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  const filteredStudents = students.filter(s => s.classLevel === selectedClass);
  const classSubjects = subjects[selectedClass] || [];

  const handleMarkChange = (studentId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const existingIndex = marks.findIndex(m => m.studentId === studentId && m.subjectId === selectedSubject);
    
    if (existingIndex > -1) {
      const newMarks = [...marks];
      newMarks[existingIndex].total = numValue;
      setMarks(newMarks);
    } else {
      setMarks([...marks, {
        studentId,
        subjectId: selectedSubject,
        total: numValue,
        written: numValue,
        mcq: 0,
        practical: 0
      }]);
    }
  };

  const getStudentMark = (studentId: string) => {
    return marks.find(m => m.studentId === studentId && m.subjectId === selectedSubject)?.total || '';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Class</label>
          <select 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value as ClassLevel);
              setSelectedSubject('');
            }}
          >
            {Object.values(ClassLevel).map(level => (
              <option key={level} value={level}>Class {level}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Subject</label>
          <select 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">-- Select Subject --</option>
            {classSubjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
          <Filter size={18} />
          Load List
        </button>
      </div>

      {!selectedSubject ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
          <AlertCircle size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">Please select a class and subject to enter marks.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">
              Entering Marks: <span className="text-blue-600 font-extrabold">{classSubjects.find(s => s.id === selectedSubject)?.name}</span>
            </h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">Autosave enabled</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Roll</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Obtained Marks</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Max Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No students found for this class.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{student.roll}</td>
                    <td className="px-6 py-4 text-slate-700">{student.name}</td>
                    <td className="px-6 py-4">
                      <input 
                        type="number"
                        className="w-32 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600"
                        value={getStudentMark(student.id)}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      / {classSubjects.find(s => s.id === selectedSubject)?.fullMarks}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="p-6 bg-slate-50 flex justify-end">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 flex items-center gap-2">
              <Save size={20} />
              Finalize Marks
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntry;
