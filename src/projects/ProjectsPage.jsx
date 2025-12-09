import { useState, useEffect } from 'react';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import { Project } from './Project';
import {
  subscribeToProjects,
  addProject,
  updateProject,
  deleteProject
} from '../services/projectService';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set up real-time listener on mount
  useEffect(() => {
    console.log('🚀 ProjectsPage: Setting up real-time listener...');

    const unsubscribe = subscribeToProjects((projectsData) => {
      console.log('📥 ProjectsPage: Received real-time update with', projectsData.length, 'projects:', projectsData);
      const projectObjects = projectsData.map(p => new Project(p));
      console.log('🔄 ProjectsPage: Setting state with', projectObjects.length, 'project objects');
      setProjects(projectObjects);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      console.log('🧹 ProjectsPage: Cleaning up listener...');
      unsubscribe();
    };
  }, []);

  const handleAddProject = async (project) => {
    try {
      console.log('➕ Adding project:', project);
      const projectId = await addProject(project);
      console.log('✅ Project added successfully with ID:', projectId);
      console.log('⏳ Waiting for real-time listener to update...');
      setShowAddForm(false);
      // No need to update state - real-time listener handles it!
    } catch (error) {
      console.error('❌ Error adding project:', error);
      alert('Failed to add project. Please try again.');
    }
  };

  const handleSaveProject = async (project) => {
    try {
      const { id, ...updates } = project;
      await updateProject(id, updates);
      // No need to update state - real-time listener handles it!
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        // No need to update state - real-time listener handles it!
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="projects-header">
        <h1>Projects</h1>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading projects...</p>
        </div>
      ) : (
        <>
          {showAddForm && (
            <div className="add-project-form">
              <h2>Add New Project</h2>
              <ProjectForm
                project={new Project()}
                onSave={handleAddProject}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {projects.length === 0 && !showAddForm ? (
            <div className="empty-state">
              <span className="icon-layers" style={{ fontSize: '64px', opacity: 0.3 }}></span>
              <h2>No projects yet</h2>
              <p>Click the + button to create your first project</p>
            </div>
          ) : (
            <ProjectList
              projects={projects}
              onSave={handleSaveProject}
              onDelete={handleDeleteProject}
            />
          )}

          {/* Floating Add Button */}
          <button
            className="floating-add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            title={showAddForm ? "Cancel" : "Add Project"}
          >
            <span className={showAddForm ? "icon-close" : "icon-plus"}></span>
          </button>
        </>
      )}
    </>
  );
}

export default ProjectsPage;