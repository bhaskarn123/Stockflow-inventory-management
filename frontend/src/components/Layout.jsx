import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <h2 className="brand">StockFlow</h2>

                <nav>
                    <NavLink to="/dashboard" className="nav-link">
                        Dashboard
                    </NavLink>

                    <NavLink to="/products" className="nav-link">
                        Products
                    </NavLink>
                </nav>

                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;