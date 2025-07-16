// Lokasi File: src/lib/data.ts

// Mendefinisikan struktur (tipe) data untuk sebuah produk.
export type Product = {
  id: number;
  name: string;
  price: number;
};

// Gunakan 'let' agar array ini bisa diubah (ditambah, dihapus, diupdate) dari file lain.
export let products: Product[] = [
  { id: 1, name: "Laptop Gaming Nitro V", price: 15000000 },
  { id: 2, name: "Mouse Logitech G Pro", price: 850000 },
  { id: 3, name: "Keyboard Mechanical Keychron K2", price: 1200000 },
];
