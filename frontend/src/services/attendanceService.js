
import api from "./api";

export const getClassStudents = async () => {
  const response = await api.get("/students");
  return response.data.students;
};

export const getAttendance = async (date, className, section) => {
  const response = await api.get("/attendance", {
    params: { date, className, section }
  });

  return response.data.records;
};

export const saveStudentAttendance = async (attendanceData) => {
  const response = await api.post("/attendance", attendanceData);
  return response.data;
};
