import { useState, useEffect } from "react";

// 🚩 INTERFACE ATUALIZADA para corresponder ao ProductForm e ProductList
export interface Product {
  _id: string;
  name: string;
  sku?: string; // Propriedades principais do formulário:
  categoria: string; // 👈 Corrigido: Agora é 'categoria'
  price: number;
  stock: number; // 👈 Corrigido: Agora é 'stock' // Propriedades derivadas/específicas do frontend:
  inStock: boolean; // Derivado de 'stock > 0'
  imageUrl?: string; // URL da imagem para exibição na tabela // Dados temporários/Files que vêm do Formulário
  images?: (File | string)[]; // Suporta File (criação) ou string (edição)
  mainImageIndex?: number; // Mantenho as propriedades 'category' e 'quantity' OPCIONAIS // para evitar erros de tipo se estiverem presentes em dados antigos.
  category?: string;
  quantity?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); 

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts([
        {
          _id: "1",
          name: "Notebook Pro",
          categoria: "Eletrônicos", 
          price: 3500,
          stock: 5,
          inStock: true,
          imageUrl:
            "https://images.pexels.com/photos/40149/notebook-laptop-apple-mac-40149.jpeg?w=100",
        },
        {
          _id: "2",
          name: "Camisa Algodão",
          categoria: "Roupas", 
          price: 120,
          stock: 0, 
          inStock: false,
          imageUrl:
            "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?w=100",
        },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const createProduct = async (data: Partial<Product>) => {
    const stockValue = data.stock ?? 0;
    const mainImageFile = data.images?.[data.mainImageIndex || 0]; 
    const tempImageUrl =
      mainImageFile && mainImageFile instanceof File
        ? URL.createObjectURL(mainImageFile)
        : undefined; 

    const newProduct: Product = {
      _id: Date.now().toString(), 
      name: data.name ?? "Novo Produto",
      price: data.price ?? 0,
      stock: stockValue, 
      categoria: data.categoria ?? "Outros", 
      inStock: stockValue > 0,
      imageUrl: tempImageUrl,
      images: data.images,
      mainImageIndex: data.mainImageIndex,
    } as Product;

    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const stockValue = data.stock ?? 0;

    let previewUrl = data.imageUrl;
    const mainImage = data.images?.[data.mainImageIndex || 0]; 
    if (mainImage && mainImage instanceof File) {
      previewUrl = URL.createObjectURL(mainImage);
    }

    const updatedData: Partial<Product> = {
      ...data,
      stock: stockValue,
      inStock: stockValue > 0, 
      imageUrl: previewUrl, 
    };

    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }; 

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.categoria.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  return {
    products: filteredProducts, 
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
