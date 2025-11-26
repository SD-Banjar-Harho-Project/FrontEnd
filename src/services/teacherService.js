import api from "./api";

// Get all teachers
export const getTeachers = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page, limit, ...filters });
  return await api.get(`/teachers?${params}`);
};

// Get teacher by ID
export const getTeacherById = async (id) => {
  return await api.get(`/teachers/${id}`);
};

// Create new teacher
export const createTeacher = async (teacherData) => {
  return await api.post("/teachers", teacherData);
};

// Update teacher
export const updateTeacher = async (id, teacherData) => {
  return await api.put(`/teachers/${id}`, teacherData);
};

// Delete teacher
export const deleteTeacher = async (id) => {
  return await api.delete(`/teachers/${id}`);
};
