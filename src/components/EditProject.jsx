import React, { useState, useEffect } from "react";
import { updateProject } from "../core/Projects";
import Swal from "sweetalert2";
import { getTutors } from "../core/Projects";
import { motion } from "framer-motion";


const EditProject = ({ project, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    Title: "",
    Descripcion: "",
    tutor: "", // Asegúrate de que esto esté alineado con tus datos
  });
  const [tutores, setTutores] = useState([]);

  useEffect(() => {
    if (project) {
      setFormData({
        Title: project.Title || "",
        Descripcion: project.Descripcion || "",
        tutor: project.tutor ? project.tutor.id : "", // Extraer el ID del tutor
      });
    }

    obtenerTutors();
  }, [project]);

  const obtenerTutors = async () => {
    try {
      const response = await getTutors();
      setTutores(response);
    } catch (error) {
      console.error("Error al obtener la lista de tutores:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.tutor) {
        Swal.fire("Error!", "Debes seleccionar un tutor.", "error");
        return;
      }

      await updateProject(project.id, formData);
      onUpdate(); // Notifica al componente padre que se actualizó el proyecto
      onClose(); // Cierra el modal
      Swal.fire("Editado!", "El proyecto ha sido editado.", "success");
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      Swal.fire(
        "Error!",
        "Hubo un problema al actualizar el proyecto.",
        "error"
      );
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Título
          </label>
          <input
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Descripción
          </label>
          <textarea
            name="Descripcion"
            value={formData.Descripcion}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label
            htmlFor="tutor"
            className="block text-gray-700 font-semibold mb-2"
          >
            Seleccionar Tutor
          </label>
          <select
            id="tutor"
            name="tutor"
            value={formData.tutor}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            required
          >
            <option value="">Selecciona un tutor</option>
            {Array.isArray(tutores) && tutores.length > 0 ? (
                tutores.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.username}
                  </option>
                ))
              ) : (
                <option disabled>Cargando tutores...</option>
              )}
          </select>
        </motion.div>

        <motion.div 
          initial={{opacity:0, y:-20}}
          animate={{opacity:1, y:0}}
          transition={{delay:0.6}}
        className="flex items-center justify-between m-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-4 m-2 rounded"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-4 m-2 rounded"
          >
            Cancelar
          </button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default EditProject;
