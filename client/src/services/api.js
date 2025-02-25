import axios from 'axios';

const BASE_URL = process.env.REACT_APP_LOAD_BALANCER_URL;

export const getStudentResult = async (studentId) => {
    // Convert studentId to uppercase
    const upperCaseStudentId = studentId.toUpperCase();

    const response = await axios.get(`${BASE_URL}/${encodeURIComponent(upperCaseStudentId)}`);
    return response.data;
};
