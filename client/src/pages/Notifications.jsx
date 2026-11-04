import {useEffect, useState} from "react";
import api from "../api";
import Navbar from "../components/Navbar";

function Notifications(){
    const[unread, setUnread] = useState([]);
    const[read, setRead] = useState([]);
    const[error, setError] = useState("");

    const loadNotifications = async () => {
        try {
            const res = await api.get("/user/notifications");
            setUnread(res.data.data.notification);
            setRead(res.data.data.seennotification);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memuat notifikasi");
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const markAllRead = async() => {
        try {
            await api.post("/user/notifications/read-all");
            loadNotifications();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menandai notifikasi");
        }
    };

    const deleteRead = async () => {
        try {
            await api.delete("/user/notifications/seen");
            loadNotifications();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menghapus notifikasi")
        }
    };

    return (
        <>
            <Navbar />
            <div className="container py-5" style={{maxWidth:700}}>
                {error && <p className="text-danger small">{error}</p>}

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">Belum Dibaca</h3>
                    <button className="btn btn-dark btn-sm" onClick={markAllRead}>
                        Tandai semua dibaca
                    </button>
                </div>
                <div className="card border-0 shadow-sm mb-5">
                    <div className="card-body">
                        {unread.length === 0 && (
                            <p className="text-muted mb-0">Tidak ada notifikasi baru</p>
                        )}
                        {unread.map((n, i) => (
                            <div key={i} className="py-2">
                                {n.message}
                                {n.createdAt && (
                                    <div className="text-muted small">
                                        {new Date(n.createdAt).toLocaleString("id-ID")}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">Sudah Dibaca</h3>
                    <button className="btn bg-white shadow-sm btn-sm" onClick={deleteRead}>
                        Hapus yang sudah dibaca
                    </button>
                </div>
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        {read.length === 0 && (
                            <p className="text-muted mb-0">Belum ada notifikasi yang dibaca</p>
                        )}
                        {read.map((n,i) => (
                            <div key={i} className="py-2 text-muted">
                                {n.message}
                                {n.createdAt && (
                                    <div className="small">
                                        {new Date(n.createdAt).toLocaleString("id-ID")}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Notifications;