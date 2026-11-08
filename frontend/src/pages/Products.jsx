
import { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
    name: "",
    sku: "",
    description: "",
    quantityOnHand: "",
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: ""
};

function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

   const fetchProducts = async (searchValue = search) => {
    try {
        setError("");

        const response = await API.get("/products", {
            params: { search: searchValue }
        });

        setProducts(response.data.products);
    } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
    }
   };
   useEffect(() => {
    const delay = setTimeout(() => {
        fetchProducts(search);
    }, 300);

    return () => clearTimeout(delay);
   }, [search]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const payload = {
            ...form,
            quantityOnHand: Number(form.quantityOnHand),
            ...(form.costPrice !== "" && { costPrice: Number(form.costPrice) }),
            ...(form.sellingPrice !== "" && { sellingPrice: Number(form.sellingPrice) }),
            ...(form.lowStockThreshold !== "" && {
                lowStockThreshold: Number(form.lowStockThreshold)
            })
        };

        try {
            if (editingId) {
                await API.put(`/products/${editingId}`, payload);
            } else {
                await API.post("/products", payload);
            }

            setForm(initialForm);
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setForm({
            name: product.name,
            sku: product.sku,
            description: product.description || "",
            quantityOnHand: product.quantityOnHand,
            costPrice: product.costPrice ?? "",
            sellingPrice: product.sellingPrice ?? "",
            lowStockThreshold: product.lowStockThreshold ?? ""
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            await API.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(initialForm);
    };

    return (
        <div style={{ padding: "25px" }}>
            <h1>StockFlow - Products</h1>

            <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Product Name"
                    value={form.name} onChange={handleChange} required />

                <input name="sku" placeholder="SKU"
                    value={form.sku} onChange={handleChange} required />

                <input name="description" placeholder="Description"
                    value={form.description} onChange={handleChange} />

                <input name="quantityOnHand" type="number" min="0"
                    placeholder="Quantity" value={form.quantityOnHand}
                    onChange={handleChange} required />

                <input name="costPrice" type="number" min="0" step="0.01"
                    placeholder="Cost Price" value={form.costPrice}
                    onChange={handleChange} />

                <input name="sellingPrice" type="number" min="0" step="0.01"
                    placeholder="Selling Price" value={form.sellingPrice}
                    onChange={handleChange} />

                <input name="lowStockThreshold" type="number" min="0"
                    placeholder="Low Stock Threshold" value={form.lowStockThreshold}
                    onChange={handleChange} />

                <button type="submit">
                    {editingId ? "Update Product" : "Add Product"}
                </button>

                {editingId && (
                    <button type="button" onClick={cancelEdit}>
                        Cancel
                    </button>
                )}
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <hr />

            <h2>All Products ({products.length})</h2>

            <input
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Selling Price</th>
                        <th>Stock Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => {
                        const threshold = product.lowStockThreshold ?? 5;
                        const isLowStock = product.quantityOnHand <= threshold;

                        return (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{product.quantityOnHand}</td>
                                <td>{product.sellingPrice ?? "-"}</td>
                                <td>
                                    {isLowStock ? "Low Stock" : "In Stock"}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(product)}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(product._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {products.length === 0 && <p>No products found.</p>}
        </div>
    );
}

export default Products;
