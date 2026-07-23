import resumeData from "../data/resumeData";

export default function Education() {
  return (
    <div id="education" className="info-row">
      <div className="section-label"><span>🎓</span> Education</div>
      <div className="row-content flex-wrap gap-x-5 gap-y-2">
        {resumeData.education.map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-2 flex-wrap">
            <strong>{item.degree}</strong>
            <span className="text-gray-600 text-sm">({item.college})</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{item.marks}</span>
            {idx < resumeData.education.length - 1 && <span className="text-blue-300 hidden sm:inline">|</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
