import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Tasks from './pages/Tasks.jsx'
import Meetings from './pages/Meetings.jsx'
import Links from './pages/Links.jsx'
import { useState } from "react";
import UserSelect from "./pages/UserSelect";

export default function App() {

  const [currentUser, setCurrentUser] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "currentUser"
        );

      return saved
        ? JSON.parse(saved)
        : null;

    });

  if (!currentUser) {
    return (
      <UserSelect
        onSelect={(user) => {

          localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
          );

          setCurrentUser(
            user
          );

        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/links" element={<Links />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}