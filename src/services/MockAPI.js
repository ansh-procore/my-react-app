// APIService to interact with the real Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/tasks/v1'; // Base URL for your Spring Boot API

class MockAPIService {
  /**
   * Fetches all tasks from the backend.
   * @returns {Promise<{success: boolean, data?: Array, total?: number, error?: string}>}
   */
  static async getAllTasks() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
        total: data.length // Assuming your API returns an array directly
      };
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetches a single task by its ID.
   * @param {number} id - The ID of the task to fetch.
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  static async getTaskById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (response.status === 404) {
        return { success: false, error: 'Task not found' };
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Creates a new task.
   * @param {Object} taskData - The task data to create.
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  static async createTask(taskData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.error("Error creating task:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Updates an existing task.
   * @param {number} id - The ID of the task to update.
   * @param {Object} taskData - The updated task data.
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  static async updateTask(id, taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (response.status === 404) {
        return { success: false, error: 'Task not found' };
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deletes a task by its ID.
   * @param {number} id - The ID of the task to delete.
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  static async deleteTask(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.status === 404) {
        return { success: false, error: 'Task not found' };
      }
      if (!response.ok && response.status !== 204) { // 204 No Content is a successful response for DELETE
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // For a 204 No Content response, there's no body to parse.
      return { success: true, data: { id: id, message: 'Task deleted successfully' } };
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Adds a comment to a specific task.
   * @param {number} taskId - The ID of the task to add the comment to.
   * @param {Object} commentData - The comment data to add.
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  static async addCommentToTask(taskId, commentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.error(`Error adding comment to task ${taskId}:`, error);
      return { success: false, error: error.message };
    }
  }


  // Note: The following methods (searchTasks, getTasksByStatus, getTasksByAssignee)
  // are not directly supported by your current Spring Boot API (TaskController.java).
  // If you need these functionalities, you would need to add corresponding
  // endpoints and logic in your Spring Boot application first.
  // For now, they are removed from this real APIService to avoid confusion.
}

export default MockAPIService;