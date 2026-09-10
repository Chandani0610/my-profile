import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPersonal from './pages/admin/AdminPersonal';
import AdminResume from './pages/admin/AdminResume';
import AdminProjects from './pages/admin/AdminProjects';
import AdminEducation from './pages/admin/AdminEducation';
import AdminSkills from './pages/admin/AdminSkills';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminLanguages from './pages/admin/AdminLanguages';
import AdminHobbies from './pages/admin/AdminHobbies';
import AdminTheme from './pages/admin/AdminTheme';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<Home />} />
          <Route path="/certifications" element={<Navigate to="/" replace />} />

          {/* Admin Authentication Gateway */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin Console Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/personal" element={<ProtectedRoute><AdminPersonal /></ProtectedRoute>} />
          <Route path="/admin/resume" element={<ProtectedRoute><AdminResume /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/education" element={<ProtectedRoute><AdminEducation /></ProtectedRoute>} />
          <Route path="/admin/skills" element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
          <Route path="/admin/certifications" element={<ProtectedRoute><AdminCertifications /></ProtectedRoute>} />
          <Route path="/admin/languages" element={<ProtectedRoute><AdminLanguages /></ProtectedRoute>} />
          <Route path="/admin/hobbies" element={<ProtectedRoute><AdminHobbies /></ProtectedRoute>} />
          <Route path="/admin/theme" element={<ProtectedRoute><AdminTheme /></ProtectedRoute>} />

          {/* Unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;