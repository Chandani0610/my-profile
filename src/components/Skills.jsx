import resumeData from "../data/resumeData";

export default function Skills() {
  return (
    <div id="skills" className="info-row">
      <div className="section-label"><span>⚙️</span> Tech Stack</div>
      <div className="row-content gap-4">
        {Object.entries(resumeData.skills).map(([section, items]) => (
          <div key={section}>
            <strong className="block mb-2 capitalize">{section}</strong>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span key={skill} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
