
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await API.get("/dashboard");
                setDashboard(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h1>StockFlow Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <h2>Inventory Overview</h2>

            <div style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px",
                flexWrap: "wrap"
            }}>
                <div>
                    <h3>Total Products</h3>
                    <h1>{dashboard.totalProducts}</h1>
                </div>

                <div>
                    <h3>Total Quantity</h3>
                    <h1>{dashboard.totalQuantity}</h1>
                </div>

                <div>
                    <h3>Low Stock Items</h3>
                    <h1>{dashboard.lowStockCount}</h1>
                </div>
            </div>

            <h2 style={{ marginTop: "40px" }}>Low Stock Products</h2>

            {dashboard.lowStockItems.length === 0 ? (
                <p>No low-stock products. Your inventory looks good!</p>
            ) : (
                <table border="1" cellPadding="10" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Low Stock Threshold</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dashboard.lowStockItems.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{product.quantityOnHand}</td>
                                <td>{product.lowStockThreshold ?? 5}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Dashboard;
