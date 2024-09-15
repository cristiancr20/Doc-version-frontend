import axios from "axios";

//METODO PARA SUBIR DOCUMENTO
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  const token = localStorage.getItem("jwtToken"); // Obtener el token

  if (!token) {
    throw new Error("Token JWT no encontrado");
  }

  const response = await axios.post(
    "http://localhost:1337/api/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Añadir el token en los headers
      },
    }
  );

  return response.data[0]; // Retorna el primer archivo subido
};

// MÉTODO PARA AGREGAR EL DOCUMENTO AL PROYECTO
export const createDocument = async (title, fileId, projectId) => {
  const documentData = {
    data: {
      title: title,
      documentFile: [fileId], // Asegúrate de que 'documentFile' es un array si Strapi lo requiere así
      project: projectId, // Enviar el ID del proyecto directamente
      fechaSubida: new Date().toISOString(), // Fecha de subida
      estado: false, // Estado inicial
    },
  };

  try {
    const response = await axios.post(
      "http://localhost:1337/api/documents",
      documentData
    );

    const documentoId = response.data.data.id;

    // Verificar la respuesta del documento
    if (!response || !response.data || !response.data.data) {
      throw new Error(
        "Error inesperado al crear el documento. Estructura de respuesta inválida."
      );
    }

    const document = response.data;

    // Obtener el proyecto para identificar al tutor asociado
    const projectResponse = await axios.get(
      `http://localhost:1337/api/new-projects/${projectId}?populate=tutor,estudiante`
    );

    // Verificar la respuesta del proyecto
    if (
      !projectResponse ||
      !projectResponse.data ||
      !projectResponse.data.data
    ) {
      throw new Error(
        "Error inesperado al obtener el proyecto. Estructura de respuesta inválida."
      );
    }

    const projectAttributes = projectResponse.data.data.attributes;
    const tutor = projectAttributes.tutor.data;
    const student = projectAttributes.estudiante.data;

    if (tutor && student) {
      // Crear la notificación para el tutor con el nombre del estudiante
      const notificationData = {
        data: {
          mensaje: `El estudiante ${student.attributes.username} ha subido un nuevo documento: ${title}`,
          tutor: tutor.id, // ID del tutor
          document: documentoId, // ID del documento recién creado
          leido: false, // Inicialmente no leída
        },
      };
      console.log("Notificación creada para el tutor:", notificationData);

      await axios.post(
        "http://localhost:1337/api/notificacions",
        notificationData
      );
    }

    return document;
  } catch (error) {
    console.error(
      "Error al crear el documento:",
      error.response || error.message
    );
    throw error;
  }
};

// Obtener documentos por ID del proyecto
export const getDocumentsByProjectId = async (projectId) => {
  try {
    // Utiliza la sintaxis correcta para aplicar el filtro
    const response = await axios.get(
      `http://localhost:1337/api/documents?filters[project][id][$eq]=${projectId}&populate=*`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener los documentos:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getDocumentById = async (documentId) => {
  try {
    const response = await fetch(
      `http://localhost:1337/api/documents/${documentId}?populate=*`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};