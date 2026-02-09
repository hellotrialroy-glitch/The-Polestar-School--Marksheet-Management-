
import React, { useState, useRef } from 'react';
import { Search, Printer, FileDown, Eye, Download } from 'lucide-react';
import { Student, Subject, MarkRecord, ClassLevel } from '../types';
import { getGradePoint, calculateGPA, getFinalGrade } from '../utils/calculations';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportGeneratorProps {
  students: Student[];
  subjects: Record<ClassLevel, Subject[]>;
  marks: MarkRecord[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ students, subjects, marks }) => {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(ClassLevel.TEN);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => 
    s.classLevel === selectedClass && 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll.toString().includes(searchTerm))
  );

  const getStudentMarksheetData = (student: Student) => {
    const classSubs = subjects[student.classLevel] || [];
    const studentMarks = marks.filter(m => m.studentId === student.id);
    
    const detailedMarks = classSubs.map(sub => {
      const m = studentMarks.find(mark => mark.subjectId === sub.id);
      const total = m?.total || 0;
      const gp = getGradePoint(total, sub.fullMarks);
      return {
        subject: sub.name,
        fullMarks: sub.fullMarks,
        obtained: total,
        grade: gp.grade,
        point: gp.point
      };
    });

    const gpa = calculateGPA(detailedMarks.map(dm => ({ grade: dm.grade, point: dm.point })));
    const finalGrade = getFinalGrade(gpa);

    return { detailedMarks, gpa, finalGrade };
  };

  const downloadPDF = (student: Student) => {
    const { detailedMarks, gpa, finalGrade } = getStudentMarksheetData(student);
    const doc = new jsPDF();

    // School Header
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 128);
    doc.text("THE POLESTAR SCHOOL", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Academic Transcript / Marksheet", 105, 28, { align: "center" });
    
    // Student Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Name: ${student.name}`, 20, 45);
    doc.text(`Roll: ${student.roll}`, 20, 52);
    doc.text(`Class: ${student.classLevel}`, 140, 45);
    doc.text(`Section: ${student.section}`, 140, 52);

    // Table
    autoTable(doc, {
      startY: 65,
      head: [['Subject Name', 'Full Marks', 'Obtained', 'Grade', 'Point']],
      body: detailedMarks.map(dm => [dm.subject, dm.fullMarks, dm.obtained, dm.grade, dm.point.toFixed(2)]),
      headStyles: { fillStyle: 'DF', fillColor: [0, 51, 102] },
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text(`GPA: ${gpa.toFixed(2)}`, 140, finalY);
    doc.text(`Final Grade: ${finalGrade}`, 140, finalY + 8);

    doc.save(`${student.name}_Marksheet.pdf`);
  };

  const exportClassExcel = () => {
    const classData = students.filter(s => s.classLevel === selectedClass).map(student => {
      const { detailedMarks, gpa, finalGrade } = getStudentMarksheetData(student);
      const row: any = {
        Roll: student.roll,
        Name: student.name,
        Class: student.classLevel,
        Section: student.section,
        GPA: gpa,
        Grade: finalGrade
      };
      detailedMarks.forEach(dm => {
        row[dm.subject] = dm.obtained;
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(classData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Class ${selectedClass}`);
    XLSX.writeFile(wb, `Class_${selectedClass}_Results.xlsx`);
  };

  return (
    <div className="space-y-8 no-print">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Class</label>
          <select 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as ClassLevel)}
          >
            {Object.values(ClassLevel).map(level => (
              <option key={level} value={level}>Class {level}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Search Student</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Name or Roll..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-1 flex items-end">
          <button 
            onClick={exportClassExcel}
            className="w-full bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Download size={18} />
            Export Class Results (Excel)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">GPA</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Grade</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const { gpa, finalGrade } = getStudentMarksheetData(student);
              return (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{student.roll}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{student.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${gpa === 0 ? 'text-red-500' : 'text-slate-800'}`}>
                      {gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-black ${
                      finalGrade === 'A+' ? 'bg-emerald-100 text-emerald-700' : 
                      finalGrade === 'F' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {finalGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="View Marksheet"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => downloadPDF(student)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="Download PDF"
                      >
                        <FileDown size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Marksheet Preview Overlay */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-4xl min-h-[90vh] my-8 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
            <div className="bg-slate-900 px-8 py-4 flex justify-between items-center no-print">
              <h3 className="text-white font-bold">Marksheet Preview</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.print()}
                  className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100"
                >
                  <Printer size={16} /> Print
                </button>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="text-slate-400 hover:text-white font-bold text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 p-12 bg-white" id="printable-marksheet">
              {/* Header */}
              <div className="text-center space-y-2 mb-12 border-b-2 border-slate-900 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center text-white text-3xl font-black">P</div>
                </div>
                <h1 className="text-4xl font-black text-blue-900 tracking-tight">THE POLESTAR SCHOOL</h1>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Academic Transcript - Annual Examination</p>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm font-bold">Student Name:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm font-bold">Class:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.classLevel}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm font-bold">Roll Number:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.roll}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500 text-sm font-bold">Section:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.section}</span>
                </div>
              </div>

              {/* Grade Table */}
              <div className="overflow-hidden border border-slate-200 rounded-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="px-6 py-4 font-bold text-sm uppercase">Subject Name</th>
                      <th className="px-6 py-4 font-bold text-sm uppercase text-center">Full Marks</th>
                      <th className="px-6 py-4 font-bold text-sm uppercase text-center">Obtained</th>
                      <th className="px-6 py-4 font-bold text-sm uppercase text-center">Ltr Grade</th>
                      <th className="px-6 py-4 font-bold text-sm uppercase text-center">Grd Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getStudentMarksheetData(selectedStudent).detailedMarks.map((dm, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-6 py-4 font-medium text-slate-800">{dm.subject}</td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-500">{dm.fullMarks}</td>
                        <td className="px-6 py-4 text-center font-bold text-slate-900">{dm.obtained}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded font-black ${dm.grade === 'F' ? 'text-red-600' : 'text-slate-800'}`}>
                            {dm.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800">{dm.point.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 border-t-2 border-slate-900">
                      <td colSpan={3} className="px-6 py-6 font-black text-lg text-slate-900 text-right">Grand Total Result:</td>
                      <td className="px-6 py-6 text-center font-black text-2xl text-blue-900">
                        {getStudentMarksheetData(selectedStudent).finalGrade}
                      </td>
                      <td className="px-6 py-6 text-center font-black text-2xl text-blue-900">
                        {getStudentMarksheetData(selectedStudent).gpa.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures */}
              <div className="mt-20 flex justify-between px-12">
                <div className="text-center w-40 border-t border-slate-300 pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Class Teacher</p>
                </div>
                <div className="text-center w-40 border-t border-slate-300 pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Headmaster</p>
                </div>
                <div className="text-center w-40 border-t border-slate-300 pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Guardian</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
