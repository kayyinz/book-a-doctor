import {Link, useNavigate} from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="container d-flex align-items-center justify-content-between py-3">
                <Link to="/dashboard" className="fw-bold text-dark text-decoration-none">
                Book a Doctor 
                </Link>
                <div className="d-flex align-items-center gap-3">
                    {user?.type === "admin" && (
                        <>
                            <Link to="/admin" className="text-dark text-decoration-none small">
                                Dashboard Admin
                            </Link>
                            <span className="text-muted mx-2">|</span>
                        </>    
                    )}
                    {user?.isdoctor && (
                        <>
                            <Link to="/doctor" className="text-dark text-decoration-none small">
                                Dashboard Dokter
                            </Link>
                            <span  className="text-muted mx-2">|</span>
                        </>    
                    )}
                    <Link to="/notifications" className="text-dark text-decoration-none small">
                    Notifikasi 
                    </Link>
                    <span className="text-muted mx-2">|</span>
                    <Link to="/apply-doctor" className="text-dark text-decoration-none small">
                    Daftar sebagai Dokter 
                    </Link>
                    <button className="btn btn-dark btn-sm" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;