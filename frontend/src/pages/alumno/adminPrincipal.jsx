// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/dashboard.css";
// import LineaSeparadora from "../../components/ui/LineaSeparadora";

// const AdminPrincipal = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="nombre_vista">
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           marginLeft: "20px",
//           gap: "10px",
//         }}
//       >
//         <span
//           className="material-symbols-outlined"
//           style={{ marginRight: "15px", fontSize: "28px" }}
//         >
//           admin_panel_settings
//         </span>
//         <h4>Panel de Administración</h4>
//       </div>

//       <LineaSeparadora />

//       {/* Cards Container - Centradas */}
//       <div 
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "calc(100vh - 200px)",
//           padding: "20px",
//         }}
//       >
//         <div 
//           className="contenedor-botones-dash"
//           style={{
//             display: "flex",
//             gap: "80px",
//             flexWrap: "wrap",
//             justifyContent: "center",
//             maxWidth: "1400px",
//           }}
//         >
//           {/* Card Dashboard */}
//           <button
//             className="btn-tipo"
//             onClick={() => navigate("/dashboard")}
//             type="button"
//             style={{
//               height: "380px",
//               width: "420px",
//               cursor: "pointer",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "40px 30px",
//             }}
//           >
//             <div 
//               style={{
//                 width: "140px",
//                 height: "140px",
//                 borderRadius: "50%",
//                 backgroundColor: "#e3f2fd",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginBottom: "30px",
//               }}
//             >
//               <span
//                 className="material-symbols-outlined search"
//                 style={{ fontSize: "72px", color: "#1976d2" }}
//               >
//                 search
//               </span>
//             </div>
//             <span className="btn-texto" style={{ fontSize: "24px", fontWeight: "600", marginBottom: "15px" }}>
//               Consulta Académica
//             </span>
//             <p
//               style={{
//                 fontSize: "16px",
//                 color: "#666",
//                 padding: "0 20px",
//                 textAlign: "center",
//                 lineHeight: "1.6",
//               }}
//             >
//               Consultar información de alumnos y cursos
//             </p>
//           </button>

//           {/* Card CRUD */}
//           <button
//             className="btn-tipo"
//             onClick={() => navigate("/crud")}
//             type="button"
//             style={{
//               height: "380px",
//               width: "420px",
//               cursor: "pointer",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "40px 30px",
//             }}
//           >
//             <div 
//               style={{
//                 width: "140px",
//                 height: "140px",
//                 borderRadius: "50%",
//                 backgroundColor: "#fce4ec",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginBottom: "30px",
//               }}
//             >
//               <span
//                 className="material-symbols-outlined group"
//                 style={{ fontSize: "72px", color: "#c2185b" }}
//               >
//                 settings
//               </span>
//             </div>
//             <span className="btn-texto" style={{ fontSize: "24px", fontWeight: "600", marginBottom: "15px" }}>
//               Gestión de Datos
//             </span>
//             <p
//               style={{
//                 fontSize: "16px",
//                 color: "#666",
//                 padding: "0 20px",
//                 textAlign: "center",
//                 lineHeight: "1.6",
//               }}
//             >
//               Alumnos, Docentes, Materias y Equivalencias
//             </p>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPrincipal;