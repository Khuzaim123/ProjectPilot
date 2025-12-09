import { useState } from 'react';
import PropTypes from 'prop-types';
import { Project } from './Project';
import { convertImageToBase64, validateImageFile } from '../services/projectService';

function ProjectForm({ project: initialProject, onSave, onCancel }) {
  const [project, setProject] = useState(initialProject);
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialProject.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid()) return;

    setUploading(true);
    try {
      let projectToSave = { ...project };

      // If a new image was selected, convert to base64
      if (imageFile) {
        console.log('Compressing image...');
        const base64Image = await convertImageToBase64(imageFile);
        projectToSave.imageUrl = base64Image;
        console.log('Image compressed successfully!');
      }

      onSave(projectToSave);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({
        ...prev,
        image: error.message || 'Failed to upload image. Please try again.'
      }));
      setUploading(false);
    }
  };

  const handleChange = (event) => {
    const { type, name, value } = event.target;
    let updatedValue = value;

    const change = {
      [name]: updatedValue,
    };

    let updatedProject;
    setProject((p) => {
      updatedProject = new Project({ ...p, ...change });
      return updatedProject;
    });
    setErrors(() => validate(updatedProject));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    // Clear previous image error
    setErrors(prev => ({ ...prev, image: '' }));

    if (file) {
      // Validate image file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, image: validation.error }));
        event.target.value = ''; // Clear file input
        return;
      }

      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function validate(project) {
    let errors = { name: '', description: '', image: '' };
    if (project.name.length === 0) {
      errors.name = 'Name is required';
    }
    if (project.name.length > 0 && project.name.length < 3) {
      errors.name = 'Name needs to be at least 3 characters.';
    }
    if (project.description.length === 0) {
      errors.description = 'Description is required.';
    }
    return errors;
  }

  function isValid() {
    return (
      errors.name.length === 0 &&
      errors.description.length === 0 &&
      errors.image.length === 0
    );
  }

  return (
    <form className="input-group vertical project-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Project Name</label>
      <input
        type="text"
        name="name"
        placeholder="enter name"
        value={project.name}
        onChange={handleChange}
      />
      {errors.name.length > 0 && (
        <div className="card error">
          <p>{errors.name}</p>
        </div>
      )}

      <label htmlFor="description">Project Description</label>
      <textarea
        name="description"
        placeholder="enter description"
        value={project.description}
        onChange={handleChange}
        rows="4"
      />
      {errors.description.length > 0 && (
        <div className="card error">
          <p>{errors.description}</p>
        </div>
      )}

      <label htmlFor="status">Status</label>
      <select
        name="status"
        value={project.status}
        onChange={handleChange}
      >
        <option value="pending">Pending</option>
        <option value="active">Active</option>
        <option value="complete">Complete</option>
      </select>

      <label htmlFor="image">Project Image (optional)</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
      />
      <p className="help-text">Images will be automatically compressed. Max 10MB.</p>

      {errors.image.length > 0 && (
        <div className="card error">
          <p>{errors.image}</p>
        </div>
      )}

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
        </div>
      )}

      <div className="input-group">
        <button
          className="primary bordered medium"
          disabled={uploading}
        >
          {uploading ? 'Saving...' : 'Save'}
        </button>
        <span />
        <button
          type="button"
          className="bordered medium"
          onClick={onCancel}
          disabled={uploading}
        >
          cancel
        </button>
      </div>
    </form>
  );
}

ProjectForm.propTypes = {
  project: PropTypes.instanceOf(Project),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProjectForm;