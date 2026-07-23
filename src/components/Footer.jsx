export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white mt-8 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center gap-6 flex-wrap mb-6 font-medium">
          <a href="#about" className="hover:text-yellow-300 transition">About</a>
          <a href="#education" className="hover:text-yellow-300 transition">Education</a>
          <a href="#skills" className="hover:text-yellow-300 transition">Skills</a>
          <a href="#projects" className="hover:text-yellow-300 transition">Projects</a>
          <a href="#contact" className="hover:text-yellow-300 transition">Contact</a>
        </div>
        <div className="flex justify-center gap-5 text-2xl mb-5">
          <span className="cursor-pointer hover:scale-110 transition" onClick={() => window.open('https://linkedin.com', '_blank')}>💼</span>
          <span className="cursor-pointer hover:scale-110 transition" onClick={() => window.open('https://github.com', '_blank')}>🔗</span>
          <span className="cursor-pointer hover:scale-110 transition" onClick={() => window.location.href = 'mailto:chandani@resume.dev'}>📧</span>
        </div>
        <p className="text-sm text-blue-200">© 2026 Chandani Kumari — All Rights Reserved | React Portfolio</p>
        <div className="w-16 h-1 bg-yellow-300/50 mx-auto mt-4 rounded-full"></div>
      </div>
    </footer>
  );
}
