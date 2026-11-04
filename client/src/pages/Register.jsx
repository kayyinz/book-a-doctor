import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/user/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container min-vh-100 d-flex align-items-center justify-content-center"
      style={{ maxWidth: 420 }}
    >
      <div className="card w-100 border-0 shadow-sm">
        <div className="card-body p-4">
          <h3 className="mb-4">Register</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="fullName"
                className="form-control border-0 bg-light"
                placeholder="Nama lengkap"
                value={form.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control border-0 bg-light"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control border-0 bg-light"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <input
                type="tel"
                name="phone"
                className="form-control border-0 bg-light"
                placeholder="Nomor telepon"
                value={form.phone}
                onChange={handleChange}
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
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="mt-3 mb-0 text-center">
            Sudah punya akun? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;