import resumeData from "../data/resumeData";

export default function Hobbies() {
  return (
    <div className="info-row">
      <div className="section-label"><span>🎨</span> Hobbies</div>
      <div className="row-content gap-x-6">
        {resumeData.hobbies.map((hobby, idx) => (
          <span key={idx}>{idx === 0 ? "🎨" : idx === 1 ? "🎧" : "🧩"} {hobby}</span>
        ))}
      </div>
    </div>
  );
}
