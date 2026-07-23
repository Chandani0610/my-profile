import resumeData from "../data/resumeData";

export default function Languages() {
  return (
    <div className="info-row">
      <div className="section-label"><span>🌐</span> Languages</div>
      <div className="row-content gap-x-6">
        {resumeData.languages.map((lang, idx) => (
          <span key={idx}>{lang.flag} {lang.name} ({lang.level})</span>
        ))}
      </div>
    </div>
  );
}
