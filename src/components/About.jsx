import resumeData from "../data/resumeData";

export default function About() {
  return (
    <div id="about" className="info-row">
      <div className="section-label"><span>📖</span> About</div>
      <div className="row-content">{resumeData.about}</div>
    </div>
  );
}
