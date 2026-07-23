import resumeData from "../data/resumeData";

export default function Contact() {
  return (
    <div id="contact" className="info-row">
      <div className="section-label"><span>📞</span> Contact</div>
      <div className="row-content gap-x-6">
        <span>📱 {resumeData.contact.phone}</span>
        <span>📍 {resumeData.contact.location}</span>
        <span>✉️ {resumeData.contact.email}</span>
      </div>
    </div>
  );
}
