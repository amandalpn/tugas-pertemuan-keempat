// Lokasi File: src/app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";

// Tipe untuk mendapatkan parameter dari URL
type Params = {
  params: {
    id: string;
  };
};

// [UPDATE] Handler untuk PUT /api/products/{id}
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = params;
  const productIndex = products.findIndex((p) => p.id === parseInt(id));

  if (productIndex === -1) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan." },
      { status: 404 }
    );
  }

  const { name, price } = await request.json();
  products[productIndex] = { ...products[productIndex], name, price };

  return NextResponse.json(products[productIndex]);
}

// [DELETE] Handler untuk DELETE /api/products/{id}
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = params;
  const productIndex = products.findIndex((p) => p.id === parseInt(id));

  if (productIndex === -1) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan." },
      { status: 404 }
    );
  }

  // Hapus 1 elemen dari array pada index yang ditemukan
  products.splice(productIndex, 1);

  return NextResponse.json({ message: "Produk berhasil dihapus." });
}
