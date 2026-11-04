import { useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

function ApplyDoctor(){
    const[form, setForm] = useState({
        fullName:"",
        email:"",
        phone:"",
        address:"",
        specialization:"",
        experience: "",
        fees: "",
        start: "",
        end: "",
    });
    const [error, setError] =useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try{
            const res = await api.post("/user/apply-doctor", {
                fullName: form.fullName,
                email: form.email,
                phone:form.phone,
                address:form.address,
                specialization:form.specialization,
                experience: form.experience,
                fees: form.fees,
                timings: {start: form.start, end: form.end},
            });
            setSuccess(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengirim pengajuan");
        }
    };

    return (
    <>
      <Navbar />
      <div className="container py-5" style={{ maxWidth: 600 }}>
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h3 className="mb-4">Daftar sebagai Dokter</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                className="form-control border-0 bg-light mb-3"
                placeholder="Nama lengkap"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                className="form-control border-0 bg-light mb-3"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                className="form-control border-0 bg-light mb-3"
                placeholder="Nomor telepon"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="address"
                className="form-control border-0 bg-light mb-3"
                placeholder="Alamat praktik"
                value={form.address}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="specialization"
                className="form-control border-0 bg-light mb-3"
                placeholder="Spesialisasi (mis. Dokter Umum)"
                value={form.specialization}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="experience"
                className="form-control border-0 bg-light mb-3"
                placeholder="Pengalaman (mis. 5 tahun)"
                value={form.experience}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="fees"
                className="form-control border-0 bg-light mb-3"
                placeholder="Biaya konsultasi (Rp)"
                value={form.fees}
                onChange={handleChange}
                min="0"
                required
              />
              <div className="row g-3 mb-3">
                <div className="col">
                  <label className="form-label small text-muted">Jam mulai</label>
                  <input
                    type="time"
                    name="start"
                    className="form-control border-0 bg-light"
                    value={form.start}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label small text-muted">Jam selesai</label>
                  <input
                    type="time"
                    name="end"
                    className="form-control border-0 bg-light"
                    value={form.end}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-danger small">{error}</p>}
              {success && <p className="text-success small">{success}</p>}

              <button type="submit" className="btn btn-dark w-100">
                Kirim Pengajuan
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplyDoctor;