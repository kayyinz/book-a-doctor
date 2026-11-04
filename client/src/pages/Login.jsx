import { useState } from "react";
import {useNavigate, Link} from "react-router-dom";
import api from "../api";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
        const res = await api.post("/user/login", { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
        } catch (err) {
        setError(err.response?.data?.message || "Gagal login");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center" style={{ maxWidth: 420 }}>
        <div className="card w-100 border-0 shadow-sm">
            <div className="card-body p-4">
            <h3 className="mb-4">Login</h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <input
                    type="email"
                    className="form-control border-0 bg-light"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                </div>

                <div className="mb-3">
                <input
                    type="password"
                    className="form-control border-0 bg-light"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                </div>

                {error && <p className="text-danger small mb-3">{error}</p>}

                <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
                >
                {loading ? "Memproses..." : "Login"}
                </button>
            </form>

            <p className="mt-3 mb-0 text-center">
                Belum punya akun? <Link to="/register">Daftar</Link>
            </p>
            </div>
        </div>
        </div>
    );
}

export default Login;