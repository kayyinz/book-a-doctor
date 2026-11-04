import {useEffect, useState} from "react";
import api from "../api";
import Navbar from "../components/Navbar";

const statusColor = {
    pending: "bg-secondary",
    approved: "bg-success",
    rejected: "bg-danger",
};

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const loadData = async () => {
        try{
            const resDoctors = await api.get("/admin/doctors");
            const resUsers = await api.get("/admin/users");
            setDoctors(resDoctors.data.data);
            setUsers(resUsers.data.data);
        }catch (err) {
            setError(err.response?.data?.message || "Gagal memuat data");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const updateDoctorStatus = async (doctorId, status) => {
        try{
            await api.post("/admin/update-doctor-status", {doctorId,status});
            loadData();
        } catch(err){
            setError(err.response?.data?.message || "Gagal memuat status");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container py-5">
                {error && <p className="text-danger small">{error}</p>}

                <h3 className="mb-3">Pengajuan Dokter</h3>
                <div className="card border-0 shadow-sm mb-5">
                    <div className="card-body table-responsive">
                        <table className="table table-borderless align-middle mb-0">
                            <thead>
                                <tr className="text-muted small">
                                    <th>Nama</th>
                                    <th>Spesialisasi</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((d) => (
                                    <tr key={d._id}>
                                        <td>{d.fullName}</td>
                                        <td>{d.specialization}</td>
                                        <td>{d.email}</td>
                                        <td>
                                            <span className={`badge ${statusColor[d.status]}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td>
                                            {d.status === "pending" && (
                                                <>
                                                    <button
                                                    className="btn btn-dark btn-sm me-2"
                                                    onClick={() => updateDoctorStatus(d._id, "approved")}>
                                                        Setujui
                                                    </button>
                                                    <button 
                                                    className="btn bg-white shadow-sm btn-sm"
                                                    onClick={() => updateDoctorStatus(d._id, "rejected")}>
                                                        Tolak
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {doctors.length === 0 && (
                            <p className="text-muted text-center mt-3 mb-0">Belum ada pengajuan.</p>
                        )}
                    </div>
                </div>

                <h3 className="mb-3">Daftar User</h3>
                <div className="card border-0 shadow-sm">
                    <div className="card-body table-responsive">
                        <table className="table table-borderless align-middle mb-0">
                            <thead>
                                <tr className="text-muted small">
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Peran</th>
                                    <th>Dokter</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u)  => (
                                    <tr key={u._id}>
                                        <td>{u.fullName}</td>
                                        <td>{u.email}</td>
                                        <td>{u.type}</td>
                                        <td>{u.isdoctor ? "Ya" : "Tidak"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;