
import React, { useState } from 'react';
import { Plus, Upload, Trash2, Download } from 'lucide-react';
import { Student, ClassLevel } from '../types';
import * as XLSX from 'xlsx';

interface StudentManagementProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ students, setStudents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    classLevel: ClassLevel.ONE,
    section: 'A'
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const importedStudents: Student[] = data.map((row: any, idx) => ({
        id: `imported-${Date.now()}-${idx}`,
        name: row.Name || row.name || 'Unknown',
        roll: parseInt(row.Roll || row.roll || '0'),
        classLevel: (row.Class || row.classLevel || ClassLevel.ONE).toString() as ClassLevel,
        section: row.Section || row.section || 'A'
      }));

      setStudents(prev => [...prev, ...importedStudents]);
    };
    reader.readAsBinaryString(file);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.roll) return;
    const student: Student = {
      ...newStudent,
      id: `student-${Date.now()}`,
    } as Student;
    setStudents(prev => [...prev, student]);
    setIsModalOpen(false);
    setNewStudent({ classLevel: ClassLevel.ONE, section: 'A' });
  };

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const downloadSampleTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Name: 'John Doe', Roll: 1, Class: '10', Section: 'A' },
      { Name: 'Jane Doe', Roll: 2, Class: '10', Section: 'A' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "polestar_student_template.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            <span className="font-medium text-sm">Add Student</span>
          </button>
          
          <label className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer font-medium text-sm">
            <Upload size={18} />
            Import Excel
            <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
          </label>
        </div>

        <button 
          onClick={downloadSampleTemplate}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          <Download size={18} />
          Download Template
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No students found. Add or import students to get started.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{student.roll}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{student.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">Class {student.classLevel}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{student.section}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => removeStudent(student.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Add New Student</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newStudent.name || ''}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Roll Number</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newStudent.roll || ''}
                    onChange={(e) => setNewStudent({...newStudent, roll: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Section</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newStudent.section || ''}
                    onChange={(e) => setNewStudent({...newStudent, section: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Class</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newStudent.classLevel}
                  onChange={(e) => setNewStudent({...newStudent, classLevel: e.target.value as ClassLevel})}
                >
                  {Object.values(ClassLevel).map(level => (
                    <option key={level} value={level}>Class {level}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddStudent}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20"
              >
                Save Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
