import resumeData from "../data/resumeData";

export default function Certifications() {
  return (
    <div className="info-row">
      <div className="section-label"><span>🏅</span> Certifications</div>
      <div className="row-content gap-x-4">
        {resumeData.certifications.map((cert, idx) => (
          <span key={idx}>✔️ {cert}</span>
        ))}
      </div>
    </div>
  );
}
