import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
            <h1 className="mb-3">Book a Doctor</h1>
            <p className="text-muted mb-4" style={{maxWidth:480}}>
                Buat janji temu dengan dokter lebih mudah dan kapan saja.
            </p>
            <div>
                <Link to="/login" className="btn btn-dark me-2">
                Login
                </Link>
                <Link to="/register" className="btn bg-white shadow-sm">
                Daftar 
                </Link>
            </div>
        </div>  
    );
}

export default Home;