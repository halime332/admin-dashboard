'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from "@/app/utils/service";
import { Product } from "@/app/types";

interface ProductFormProps {
    product?: Product | null;
    isEdit: boolean;
    productId?: string | null;
}

const ProductForm = ({ product, isEdit, productId }: ProductFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(event.currentTarget);

            // Convert FormData to object
            const formDataObject: any = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            // Convert numeric fields
            if (formDataObject.price) {
                formDataObject.price = parseFloat(formDataObject.price);
            }
            if (formDataObject.stock) {
                formDataObject.stock = parseInt(formDataObject.stock);
            }

            // Handle file upload if present
            const imageFile = formData.get('image') as File;
            if (imageFile && imageFile.size > 0) {
                // In a real app, you'd upload this to a file service
                // For now, we'll just store the filename
                formDataObject.image_url = imageFile.name;
            }

            // Remove empty values and file field
            const cleanData = Object.fromEntries(
                Object.entries(formDataObject).filter(([key, value]) =>
                    value !== '' && value !== null && value !== undefined && key !== 'image'
                )
            ) as Omit<Product, 'id'>;

            let result;
            if (isEdit && productId) {
                result = await updateProduct(productId, cleanData);
            } else {
                result = await createProduct(cleanData);
            }

            // Redirect to product-cart page on success
            router.push('/product-cart');
        } catch (error: any) {
            console.error('Form submission error:', error);
            setError(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h1>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* İsim (Name) */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    İsim
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={product?.name || ""}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                                    placeholder="Ürün adını girin"
                                />
                            </div>

                            {/* Marka (Brand) */}
                            <div className="space-y-2">
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                                    Marka
                                </label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    defaultValue={product?.brand || ""}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                                    placeholder="Marka adını girin"
                                />
                            </div>

                            {/* Kategori (Category) */}
                            <div className="space-y-2">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Kategori
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    defaultValue={product?.category || ""}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors"
                                >
                                    <option value="">Kategori seçin</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Books">Books</option>
                                    <option value="Home">Home</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>

                            {/* Fiyat (Price) */}
                            <div className="space-y-2">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Fiyat
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        ₺
                                    </span>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        step="0.01"
                                        defaultValue={product?.price || ""}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Stok (Stock) */}
                            <div className="space-y-2">
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                    Stok
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    defaultValue={product?.stock || ""}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                                    placeholder="Stok miktarı"
                                />
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Durum
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={product?.status || "active"}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                    <option value="draft">Taslak</option>
                                </select>
                            </div>
                        </div>

                        {/* Açıklama (Description) - Full Width */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Açıklama
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                defaultValue={product?.description || ""}
                                required
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors resize-vertical"
                                placeholder="Ürün açıklamasını girin"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Ürün Görseli
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-600">
                                            <span className="font-semibold">Tıklayarak yükle</span> veya sürükleyip bırakın
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 10MB)</p>
                                    </div>
                                    <input id="image" name="image" type="file" className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>

                        {/* Photo URL */}
                        <div className="space-y-2">
                            <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">
                                Fotoğraf URL
                            </label>
                            <input
                                type="url"
                                id="photoUrl"
                                name="image_url"
                                defaultValue={product?.image_url || ""}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={isLoading}
                                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Geri
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'İşleniyor...' : (isEdit ? 'Güncelle' : 'Kaydet')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
