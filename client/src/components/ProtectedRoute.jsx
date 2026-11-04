import {Navigate} from "react-router-dom";

function ProtectedRoute({children, role}) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if(!token){
        return <Navigate to="/login" replace />;
    }
    if(role === "admin" && user?.type !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }
    if (role === "doctor" && !user?.isdoctor) {
        return <Navigate to="/dashboard" replace />
    }

    return children;
}

export default ProtectedRoute;