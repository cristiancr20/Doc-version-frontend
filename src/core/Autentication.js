import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

//METODO PARA REGISTRAR UN USUARIO
export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local/register`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};


export const login = async (data) => {
  try {
    // Verifica que los datos que se envían sean correctos
    console.log("Datos enviados para login:", data);

    const response = await axios.post(`${API_URL}/api/auth/local`, data);
    console.log("Login response:", response);
    return response.data;
  } catch (error) {
    // Captura y muestra detalles del error
    console.error("Error en login:", error);    
    throw error;  // Para que el error sea capturado en el `handleSubmit`
  }
};

// Método para obtener el usuario con el rol incluido
export const getUserWithRole = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/${userId}?populate=rol`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario con rol:", error);
    throw error;
  }
};

//METODO PARA OBTENER LOS ROLES
export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/rols`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
