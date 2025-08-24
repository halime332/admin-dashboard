"use client";

import Link from "next/link";
import { Product } from "../types";
import { deleteProduct } from "../utils/service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id: number | string) => {
        if (!confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteProduct(id);
            toast.success("Product deleted successfully!");
            router.refresh(); // Refresh the page to show updated data
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow flex flex-col">
            {product.image_url && (
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
            )}

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {product.name}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {product.description}
            </p>

            <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>Stock: {product.stock}</span>
                <span className={`px-2 py-1 rounded text-xs ${product.stock > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>

            <div className="flex gap-2 mt-auto">
                <Link
                    href={`/products/edit/${product.id}`}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm text-center hover:bg-blue-600 transition-colors"
                >
                    Edit
                </Link>
                <button
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    onClick={() => handleDelete(product.id)}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}
