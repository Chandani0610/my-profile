import resumeData from "../data/resumeData";

export default function Projects() {
  return (
    <div id="projects" className="info-row">
      <div className="section-label"><span>📁</span> Projects</div>
      <div className="row-content flex-wrap gap-x-6 gap-y-3">
        {resumeData.projects.map((project, idx) => (
          <div key={idx} className="inline-flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{idx === 0 ? "💰" : idx === 1 ? "🪞" : "✨"} {project.title}</span>
            <span className="project-tag">{project.tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
