import { Project } from './Project';
import PropTypes from 'prop-types';

function formatDescription(description) {
  return description.length > 60 ? description.substring(0, 60) + '...' : description;
}

function ProjectCard(props) {
  const { project, onEdit, onDelete } = props;

  const handleEditClick = (projectBeingEdited) => {
    onEdit(projectBeingEdited);
  };

  const handleDeleteClick = (projectId) => {
    onDelete(projectId);
  };

  return (
    <div className="card project-card">
      {project.imageUrl && (
        <img src={project.imageUrl} alt={project.name} className="project-image" />
      )}
      <section className="section dark">
        <div className="project-header">
          <h5 className="strong">
            <strong>{project.name}</strong>
          </h5>
          <span
            className="status-badge"
            style={{ backgroundColor: project.getStatusColor() }}
          >
            {project.getStatusText()}
          </span>
        </div>
        <p>{formatDescription(project.description)}</p>
        <div className="card-actions">
          <button
            className="bordered"
            onClick={() => handleEditClick(project)}
          >
            <span className="icon-edit"></span>
            Edit
          </button>
          <button
            className="bordered error"
            onClick={() => handleDeleteClick(project.id)}
          >
            <span className="icon-close"></span>
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.instanceOf(Project).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProjectCard;