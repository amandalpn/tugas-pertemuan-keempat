// Lokasi File: src/app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { products, Product } from "@/lib/data";

// [READ] Handler untuk GET /api/products
export async function GET() {
  return NextResponse.json(products);
}

// [CREATE] Handler untuk POST /api/products
export async function POST(request: NextRequest) {
  // Kita akan log body dari request untuk melihat apa isinya
  const newProductData = await request.json();

  // ================== BARIS DEBUGGING ==================
  console.log("Data yang diterima di server:", newProductData);
  // =====================================================

  // Validasi sederhana
  if (!newProductData.name || !newProductData.price) {
    return NextResponse.json(
      { message: "Nama dan harga produk wajib diisi." },
      { status: 400 }
    );
  }

  const newProduct: Product = {
    id: Date.now(),
    name: newProductData.name,
    price: newProductData.price,
  };

  products.push(newProduct);

  return NextResponse.json(newProduct, { status: 201 });
}
