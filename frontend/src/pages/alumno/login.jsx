import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar error al escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_usuario: formData.usuario,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      // Validar estado del usuario
      if (data.datos.usuario.estado === "inactivo") {
        throw new Error(
          "Tu cuenta está inactiva. Contacta al administrador para más información."
        );
      }

      // Guardar token, datos del usuario y ROL
      localStorage.setItem("token", data.datos.token);
      localStorage.setItem("usuario", JSON.stringify(data.datos.usuario));
      localStorage.setItem("userRole", data.datos.usuario.rol); // 👈 Guardamos el rol

      // Redirigir al dashboard
      navigate("/dashboard");
      
    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/solicitar-reset");
  };

  return (
    <div className="login-container">
      {/* Formulario de login */}
      <div className="login-form-wrapper">
        <div className="login-form-container">
          {/* Icono de usuario */}
          <div className="login-icon">
            <span className="material-symbols-outlined">account_circle</span>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Campo Usuario */}
            <div className="login-form-group">
              <label htmlFor="usuario" className="login-label">
                Usuario
              </label>
              <input
                type="email"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="login-input"
                placeholder="correo@ejemplo.com"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login-input"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="login-error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {/* Link olvidé contraseña */}
            <div className="login-forgot">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="login-forgot-link"
                disabled={loading}
              >
                Olvidé mi contraseña
              </button>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  INICIANDO...
                </>
              ) : (
                "INICIAR SESIÓN"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     usuario: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     // Limpiar error al escribir
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:3000/api/v1/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email_usuario: formData.usuario,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.mensaje || "Error al iniciar sesión");
//       }

//       // Guardar token y datos del usuario
//       localStorage.setItem("token", data.datos.token);
//       localStorage.setItem("usuario", JSON.stringify(data.datos.usuario));

//       // Redirigir al dashboard
//       navigate("/dashboard");
      
//     } catch (err) {
//       setError(err.message || "Error al iniciar sesión. Intente nuevamente.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate("/solicitar-reset");
//   };

//   return (
//     <div className="login-container">
//       {/* Formulario de login */}
//       <div className="login-form-wrapper">
//         <div className="login-form-container">
//           {/* Icono de usuario */}
//           <div className="login-icon">
//             <span className="material-symbols-outlined">account_circle</span>
//           </div>

//           {/* Formulario */}
//           <form onSubmit={handleSubmit} className="login-form">
//             {/* Campo Usuario */}
//             <div className="login-form-group">
//               <label htmlFor="usuario" className="login-label">
//                 Usuario
//               </label>
//               <input
//                 type="email"
//                 id="usuario"
//                 name="usuario"
//                 value={formData.usuario}
//                 onChange={handleChange}
//                 className="login-input"
//                 placeholder="correo@ejemplo.com"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Campo Contraseña */}
//             <div className="login-form-group">
//               <label htmlFor="password" className="login-label">
//                 Contraseña
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="login-input"
//                 placeholder="••••••••"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Mensaje de error */}
//             {error && (
//               <div className="login-error">
//                 <span className="material-symbols-outlined">error</span>
//                 {error}
//               </div>
//             )}

//             {/* Link olvidé contraseña */}
//             <div className="login-forgot">
//               <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 className="login-forgot-link"
//                 disabled={loading}
//               >
//                 Olvidé mi contraseña
//               </button>
//             </div>

//             {/* Botón submit */}
//             <button
//               type="submit"
//               className="login-button"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="login-spinner"></span>
//                   INICIANDO...
//                 </>
//               ) : (
//                 "INICIAR SESIÓN"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     usuario: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Roles válidos del sistema
//   const ROLES_VALIDOS = ["admin", "docente", "preceptor", "secretario", "tutor"];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     // Limpiar error al escribir
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:3000/api/v1/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email_usuario: formData.usuario,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.mensaje || "Error al iniciar sesión");
//       }

//       // ✅ Extraer datos del usuario
//       const usuario = data.datos.usuario;
//       const rol = usuario.rol || usuario.rol_nombre || usuario.role;

//       // ✅ Validar que el rol sea válido
//       if (!rol || !ROLES_VALIDOS.includes(rol.toLowerCase())) {
//         throw new Error("Usuario sin rol válido asignado");
//       }

//       // ✅ Guardar token y datos del usuario
//       localStorage.setItem("token", data.datos.token);
//       localStorage.setItem("usuario", JSON.stringify(usuario));
//       localStorage.setItem("rol", rol.toLowerCase());

//       // ✅ FILTRAR POR ROL - Admin va a CRUD, otros a Dashboard
//       if (rol.toLowerCase() === "admin") {
//         console.log("✅ Usuario Admin - Redirigiendo a CRUD");
//         navigate("/admin-principal");
//       } else {
//         console.log(`✅ Usuario ${rol} - Redirigiendo a Dashboard`);
//         navigate("/dashboard");
//       }
      
//     } catch (err) {
//       setError(err.message || "Error al iniciar sesión. Intente nuevamente.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate("/solicitar-reset");
//   };

//   return (
//     <div className="login-container">
//       {/* Formulario de login */}
//       <div className="login-form-wrapper">
//         <div className="login-form-container">
//           {/* Icono de usuario */}
//           <div className="login-icon">
//             <span className="material-symbols-outlined">account_circle</span>
//           </div>

//           {/* Formulario */}
//           <form onSubmit={handleSubmit} className="login-form">
//             {/* Campo Usuario */}
//             <div className="login-form-group">
//               <label htmlFor="usuario" className="login-label">
//                 Usuario
//               </label>
//               <input
//                 type="email"
//                 id="usuario"
//                 name="usuario"
//                 value={formData.usuario}
//                 onChange={handleChange}
//                 className="login-input"
//                 placeholder="correo@ejemplo.com"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Campo Contraseña */}
//             <div className="login-form-group">
//               <label htmlFor="password" className="login-label">
//                 Contraseña
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="login-input"
//                 placeholder="••••••••"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Mensaje de error */}
//             {error && (
//               <div className="login-error">
//                 <span className="material-symbols-outlined">error</span>
//                 {error}
//               </div>
//             )}

//             {/* Link olvidé contraseña */}
//             <div className="login-forgot">
//               <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 className="login-forgot-link"
//                 disabled={loading}
//               >
//                 Olvidé mi contraseña
//               </button>
//             </div>

//             {/* Botón submit */}
//             <button
//               type="submit"
//               className="login-button"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="login-spinner"></span>
//                   INICIANDO...
//                 </>
//               ) : (
//                 "INICIAR SESIÓN"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
