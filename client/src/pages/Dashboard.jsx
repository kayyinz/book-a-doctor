import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import api from "../api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [bookError, setBookError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await api.get("/user/doctors");
        setDoctors(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat daftar dokter");
      } finally {
        setLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  const closeModal = () => {
    setSelected(null);
    setDate("");
    setFile(null);
    setBookError("");
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("doctorId", selected?._id);
    formData.append("date", new Date(date).toISOString());
    if (file) {
      formData.append("document", file);
    }

    try {
      await api.post("/user/book-appointment", formData);
      closeModal();
      setSuccess("Janji temu berhasil dibuat");
    } catch (err) {
      setBookError(err.response?.data?.message || "Gagal membuat janji temu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="container py-5">
      <h3 className="mb-4">Daftar Dokter</h3>

      {error && <p className="text-danger small">{error}</p>}
      {success && <p className="text-success small">{success}</p>}

      {loadingDoctors ? (
        <p className="text-muted">Memuat data dokter...</p>
      ) : (
        <div className="row g-3">
          {doctors.map((d) => (
            <div className="col-md-4" key={d._id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">Dr. {d.fullName}</h5>
                    <p className="text-muted mb-2">{d.specialization}</p>
                    <p className="mb-1 small">Pengalaman: {d.experience}</p>
                    <p className="mb-1 small">
                      Jam praktik: {d.timings?.start} - {d.timings?.end}
                    </p>
                    <p className="mb-0 small">
                      Biaya: Rp {d.fees?.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    className="btn btn-dark btn-sm mt-3 w-100"
                    onClick={() => {
                      setSuccess("");
                      setSelected(d);
                    }}
                  >
                    Buat Janji
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={selected !== null} onHide={closeModal} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Buat Janji Temu</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleBook}>
          <Modal.Body>
            <p className="text-muted mb-3">
              Dokter: <strong>Dr. {selected?.fullName}</strong>
            </p>
            
            <div className="mb-3">
              <label className="form-label small text-muted">Tanggal & Jam</label>
              <input
                type="datetime-local"
                className="form-control border-0 bg-light"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="mb-2">
              <label className="form-label small text-muted">Dokumen Pendukung</label>
              <input
                type="file"
                className="form-control border-0 bg-light"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={submitting}
              />
            </div>
            
            <p className="text-muted small mb-3">
              Dokumen pendukung (opsional), maksimal 5 MB.
            </p>

            {bookError && <p className="text-danger small mb-0">{bookError}</p>}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <button
              type="button"
              className="btn btn-light"
              onClick={closeModal}
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-dark"
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
    </>
  );
}

export default Dashboard;