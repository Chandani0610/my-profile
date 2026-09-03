import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminEducation from './pages/admin/AdminEducation';
import AdminSkills from './pages/admin/AdminSkills';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminLanguages from './pages/admin/AdminLanguages';
import AdminHobbies from './pages/admin/AdminHobbies';
import AdminPersonal from './pages/admin/AdminPersonal';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/education" element={<AdminEducation />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/certifications" element={<AdminCertifications />} />
          <Route path="/admin/languages" element={<AdminLanguages />} />
          <Route path="/admin/hobbies" element={<AdminHobbies />} />
          <Route path="/admin/personal" element={<AdminPersonal />} />

          {/* Unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;