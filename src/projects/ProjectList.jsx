import { useState } from 'react';
import PropTypes from 'prop-types';
import { Project } from './Project';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';

function ProjectList({ projects, onSave, onDelete }) {
  const [projectBeingEdited, setProjectBeingEdited] = useState(null);

  const handleEdit = (project) => {
    setProjectBeingEdited(project);
  };

  const cancelEditing = () => {
    setProjectBeingEdited(null);
  };

  const handleSave = (project) => {
    onSave(project);
    setProjectBeingEdited(null);
  };

  return (
    <div className="row">
      {projects.map((project) => (
        <div key={project.id} className="cols-sm">
          {project === projectBeingEdited ? (
            <ProjectForm
              project={project}
              onSave={handleSave}
              onCancel={cancelEditing}
            />
          ) : (
            <ProjectCard
              project={project}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      ))}
    </div>
  );
}

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.instanceOf(Project)).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProjectList;