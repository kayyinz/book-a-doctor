import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

const statusColor = {
  pending: "bg-secondary",
  approved: "bg-success",
  rejected: "bg-danger",
};

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      const res = await api.get("/doctor/appointments");
      setAppointments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat janji temu");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      await api.post("/doctor/update-status", { appointmentId, status });
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h3 className="mb-4">Janji Temu Masuk</h3>

        {error && <p className="text-danger small">{error}</p>}

        <div className="card border-0 shadow-sm">
          <div className="card-body table-responsive">
            <table className="table table-borderless align-middle mb-0">
              <thead>
                <tr className="text-muted small">
                  <th>Pasien</th>
                  <th>Tanggal & Jam</th>
                  <th>Dokumen</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>
                      {a.userId?.fullName}
                      <div className="text-muted small">{a.userId?.phone}</div>
                    </td>
                    <td>{new Date(a.date).toLocaleString("id-ID")}</td>
                    <td>
                      {a.document?.filename ? (
                        <a
                          href={`http://localhost:8001/uploads/${a.document.filename}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {a.document.originalname}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span className={`badge ${statusColor[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      {a.status === "pending" && (
                        <>
                          <button
                            className="btn btn-dark btn-sm me-2"
                            onClick={() => updateStatus(a._id, "approved")}
                          >
                            Setujui
                          </button>
                          <button
                            className="btn bg-white shadow-sm btn-sm"
                            onClick={() => updateStatus(a._id, "rejected")}
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && !error && (
              <p className="text-muted text-center mt-3 mb-0">Belum ada janji temu.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorDashboard;