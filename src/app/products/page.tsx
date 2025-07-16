// Lokasi File: src/app/products/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";

// Mendefinisikan struktur data untuk produk
type Product = {
  id: number;
  name: string;
  price: number;
};

// Komponen utama untuk halaman /products
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Fungsi untuk format angka menjadi Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Fungsi untuk menangani submit form (Tambah & Update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const productData = { name, price: parseFloat(price) };

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      const result = await res.json();
      if (editingId) {
        setProducts(products.map((p) => (p.id === editingId ? result : p)));
      } else {
        setProducts([...products, result]);
      }
      setName("");
      setPrice("");
      setEditingId(null);
    } else {
      alert("Operasi gagal, coba lagi.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setPrice("");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Gagal menghapus produk.");
      }
    }
  };

  // Tampilan halaman (JSX)
  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
        body {
          font-family: "Inter", sans-serif;
          color: #212529;
          overflow-x: hidden; /* Mencegah scroll horizontal */
        }
        .background-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(to right, #6dd5ed, #2193b0);
          animation: move 25s linear infinite;
        }
        .circle1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 10%;
          opacity: 0.5;
        }
        .circle2 {
          width: 300px;
          height: 300px;
          top: 60%;
          left: 70%;
          opacity: 0.6;
          animation-duration: 30s;
        }
        .circle3 {
          width: 150px;
          height: 150px;
          top: 80%;
          left: 5%;
          background: linear-gradient(to right, #ff9a9e, #fecfef);
          opacity: 0.5;
          animation-duration: 20s;
        }
        @keyframes move {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(100px, 150px) rotate(90deg);
          }
          50% {
            transform: translate(-150px, 100px) rotate(180deg);
          }
          75% {
            transform: translate(50px, -100px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>

      {/* Background dengan elemen dekoratif */}
      <div className="background-container">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>

      <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              color: "#343a40",
              fontWeight: 700,
              textShadow: "0px 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            Product Dashboard
          </h1>
          <p style={{ color: "#495057", marginTop: "10px" }}>
            Kelola inventaris produk Anda dengan mudah dan efisien.
          </p>
        </header>

        {/* Form Card dengan efek Glassmorphism */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)", // Untuk Safari
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "40px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "20px",
              color: "#495057",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              paddingBottom: "10px",
            }}
          >
            {editingId ? "✏️ Edit Produk" : "➕ Tambah Produk Baru"}
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Nama Produk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: "1rem",
                gridColumn: "1 / -1",
                background: "rgba(255,255,255,0.5)",
              }}
            />
            <input
              type="number"
              placeholder="Harga (contoh: 50000)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={{
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: "1rem",
                gridColumn: "1 / -1",
                background: "rgba(255,255,255,0.5)",
              }}
            />
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    padding: "12px 25px",
                    borderRadius: "8px",
                    border: "1px solid #6c757d",
                    background: "#fff",
                    color: "#6c757d",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                  }}
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                style={{
                  padding: "12px 25px",
                  borderRadius: "8px",
                  border: "none",
                  background: editingId ? "#ffc107" : "#0d6efd",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                {editingId ? "Update Produk" : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>

        {/* Tabel Data dengan efek Glassmorphism */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)", // Untuk Safari
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#495057",
              marginBottom: "20px",
            }}
          >
            Daftar Inventaris
          </h2>
          {isLoading ? (
            <div
              style={{ textAlign: "center", padding: "50px", color: "#6c757d" }}
            >
              Memuat data...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        color: "#495057",
                      }}
                    >
                      Nama Produk
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        color: "#495057",
                      }}
                    >
                      Harga
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        color: "#495057",
                      }}
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <td style={{ padding: "15px", fontWeight: 500 }}>
                          {product.name}
                        </td>
                        <td style={{ padding: "15px" }}>
                          {formatRupiah(product.price)}
                        </td>
                        <td
                          style={{
                            padding: "15px",
                            textAlign: "center",
                            display: "flex",
                            gap: "8px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => handleEdit(product)}
                            title="Edit"
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "1.2rem",
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            title="Hapus"
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "1.2rem",
                              color: "#dc3545",
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: "center",
                          padding: "50px",
                          color: "#6c757d",
                        }}
                      >
                        Belum ada produk. Silakan tambahkan produk baru di atas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
