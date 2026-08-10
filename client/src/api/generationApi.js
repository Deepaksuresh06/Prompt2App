import axios from 'axios';  

const BASE_API_URL = 'http://localhost:5000/api';

export const createGeneration = async (data) =>{
    const response = await axios.post(`${BASE_API_URL}/generate`, data);
    return response.data;
}
export const getGenerations = async (id) =>{
    const response = await axios.get(`${BASE_API_URL}/generations/${id}`);
    return response.data;
}
export const getHistory = async (userId) =>{
    const response = await axios.get(`${BASE_API_URL}/history/${userId}`);
    return response.data;
}
export const getStatus = async (id) =>{
    const response = await axios.get(`${BASE_API_URL}/status/${id}`);
    return response.data;
}