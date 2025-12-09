import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

const PROJECTS_COLLECTION = "projects";
const MAX_IMAGE_SIZE_KB = 500; // Maximum image size in KB (to stay under 1MB base64)

/**
 * Subscribe to real-time project updates
 * @param {Function} callback - Function to call with updated projects array
 * @returns {Function} Unsubscribe function
 */
export const subscribeToProjects = (callback) => {
    const projectsRef = collection(db, PROJECTS_COLLECTION);

    console.log('📡 Setting up Firestore real-time listener...');

    // Set up real-time listener with metadata changes disabled for better performance
    const unsubscribe = onSnapshot(
        projectsRef,
        (snapshot) => {
            console.log('🔄 Snapshot received! Total docs:', snapshot.size);
            const projects = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                console.log('📄 Document:', doc.id, data);
                projects.push({
                    id: doc.id,
                    ...data
                });
            });
            console.log('✅ Calling callback with', projects.length, 'projects');
            callback(projects);
        },
        (error) => {
            console.error("❌ Error in real-time listener:", error);
            callback([]);
        }
    );

    return unsubscribe;
};

/**
 * Add a new project to Firestore
 * @param {Object} projectData - Project data (name, description, imageUrl, status)
 * @returns {Promise<string>} The ID of the created project
 */
export const addProject = async (projectData) => {
    try {
        const projectToAdd = {
            name: projectData.name,
            description: projectData.description,
            imageUrl: projectData.imageUrl || '',
            status: projectData.status || 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        console.log('💾 Adding project to Firestore:', projectToAdd);
        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectToAdd);
        console.log("✅ Project added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error adding project:", error);
        throw error;
    }
};

/**
 * Update an existing project
 * @param {string} projectId - The ID of the project to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateProject = async (projectId, updates) => {
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
        await updateDoc(projectRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        console.log("✅ Project updated:", projectId);
    } catch (error) {
        console.error("❌ Error updating project:", error);
        throw error;
    }
};

/**
 * Delete a project from Firestore
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
        await deleteDoc(projectRef);
        console.log("✅ Project deleted:", projectId);
    } catch (error) {
        console.error("❌ Error deleting project:", error);
        throw error;
    }
};

/**
 * Compress and convert image file to base64 string
 * @param {File} file - The image file
 * @param {number} maxSizeKB - Maximum size in KB (default 500KB)
 * @returns {Promise<string>} Base64 encoded image string
 */
export const convertImageToBase64 = (file, maxSizeKB = MAX_IMAGE_SIZE_KB) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                // Create canvas to compress image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                const maxDimension = 1200; // Max width or height

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress image
                ctx.drawImage(img, 0, 0, width, height);

                // Start with quality 0.8 and reduce if needed
                let quality = 0.8;
                let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

                // If still too large, reduce quality further
                while (compressedDataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
                    quality -= 0.1;
                    compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                }

                // Check final size
                const sizeInKB = Math.round(compressedDataUrl.length / 1024);
                console.log(`Image compressed: ${sizeInKB}KB (quality: ${quality.toFixed(1)})`);

                if (compressedDataUrl.length > maxSizeKB * 1024 * 1.5) {
                    reject(new Error(`Image is too large (${sizeInKB}KB). Please use a smaller image.`));
                } else {
                    resolve(compressedDataUrl);
                }
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = event.target.result;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Validate image file before upload
 * @param {File} file - The image file
 * @returns {Object} Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
    // Check if file exists
    if (!file) {
        return { isValid: false, error: 'No file selected' };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        return { isValid: false, error: 'Please select an image file' };
    }

    // Check file size (before compression)
    const maxFileSizeMB = 10;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
        return {
            isValid: false,
            error: `Image is too large (${fileSizeMB.toFixed(1)}MB). Please use an image smaller than ${maxFileSizeMB}MB.`
        };
    }

    return { isValid: true };
};
