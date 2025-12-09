export class Project {
  constructor(initializer) {
    this.id = undefined;
    this.name = '';
    this.description = '';
    this.imageUrl = '';
    this.status = 'pending'; // 'pending', 'active', or 'complete'

    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.name) this.name = initializer.name;
    if (initializer.description) this.description = initializer.description;
    if (initializer.imageUrl) this.imageUrl = initializer.imageUrl;
    if (initializer.status) this.status = initializer.status;
  }

  isNew() {
    return this.id === undefined;
  }

  // Helper method to get status display color
  getStatusColor() {
    switch (this.status) {
      case 'active':
        return '#4caf50'; // green
      case 'complete':
        return '#2196f3'; // blue
      case 'pending':
      default:
        return '#ff9800'; // orange
    }
  }

  // Helper method to get status display text
  getStatusText() {
    return this.status.charAt(0).toUpperCase() + this.status.slice(1);
  }
}