"use client";

import React, { useState, useEffect, useRef } from "react";
import formStyles from "../../../styles/ProductForm.module.css";
import modalStyles from "../../../styles/ProductForm.module.css";

// --- Interfaces ---
interface Product {
  id?: string;
  type: string;
  name: string;
  price: number;
  stock: number;
  images: (File | string)[];
  mainImageIndex: number;
  isFreeShipping: boolean;
  selectedColors: string[];
  gigas: string;
  installments: number;
  withInterest: boolean;
  categoria: string;
  marca: string;
  deviceCondition: 'Novo' | 'Usado';
  usedCondition?: 'Ótimo' | 'Bom' | 'Regular';
  _id?: string;
  imageUrl?: string;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Partial<Product>) => Promise<void>;
  loading?: boolean;
  product?: Product | null;
}

const availableColors = ["Preto", "Branco", "Azul", "Vermelho", "Verde", "Amarelo", "Cinza", "Marrom"];
const storageOptions = ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
const categories = ["Celulares", "Acessórios", "Carregadores", "Cases", "Promoções"];
const brands = ["Apple", "Samsung", "Motorola", "Xiaomi", "a'Gold"];
const machineFee = 4.99;

// --- Componente Principal ---
export default function ProductForm({ isOpen, onClose, onSubmit, loading = false, product = null }: ProductFormProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState("Celular");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [priceDisplay, setPriceDisplay] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [images, setImages] = useState<(File | string)[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [gigas, setGigas] = useState(storageOptions[0]);
  const [installments, setInstallments] = useState(1);
  const [withInterest, setWithInterest] = useState(true);
  const [installmentDetails, setInstallmentDetails] = useState<string[]>([]);
  const [categoria, setCategoria] = useState(categories[0]);
  const [marca, setMarca] = useState(brands[0]);
  const [deviceCondition, setDeviceCondition] = useState<"Novo" | "Usado">("Novo");
  const [usedCondition, setUsedCondition] = useState<"Ótimo" | "Bom" | "Regular">("Ótimo");

  // --- Funções de Lógica ---
  const resetForm = () => {
    setType("Celular");
    setName("");
    setPrice(0);
    setPriceDisplay(""); 
    setStock(0);
    setImages([]);
    setMainImageIndex(0);
    setIsFreeShipping(false);
    setSelectedColors([]);
    setGigas(storageOptions[0]);
    setInstallments(1);
    setWithInterest(true);
    setInstallmentDetails([]);
    setCategoria(categories[0]);
    setMarca(brands[0]);
    setDeviceCondition("Novo");
    setUsedCondition("Ótimo");
  }

  const calculateInstallments = (currentPrice: number, numInstallments: number, interest: boolean) => {
    if (currentPrice <= 0 || numInstallments < 1) {
      setInstallmentDetails([]);
      return;
    }
    const totalWithFee = interest ? currentPrice * (1 + machineFee / 100) : currentPrice;
    const details: string[] = [];
    for (let i = 1; i <= numInstallments; i++) {
      const installmentValue = totalWithFee / i;
      details.push(`${i}x de R$ ${installmentValue.toFixed(2)} (total R$ ${totalWithFee.toFixed(2)})`);
    }
    setInstallmentDetails(details);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputRawValue = e.target.value;

    let cleanValue = inputRawValue.replace(/[^\d,.]/g, '');

    setPriceDisplay(cleanValue);
    const parts = cleanValue.split(',');
    let numericString = "";

    if (parts.length > 1) {
      const integerPart = parts.slice(0, -1).join('').replace(/\./g, ''); 
      const decimalPart = parts.slice(-1)[0];
      numericString = `${integerPart}.${decimalPart}`;
    } else {
      numericString = cleanValue.replace(/\./g, '');
    }

    const numericValue = parseFloat(numericString);
    setPrice(isNaN(numericValue) || numericValue < 0 ? 0 : numericValue);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) setMainImageIndex(0);
    else if (mainImageIndex > index) setMainImageIndex(prev => prev - 1);
  };

  const setAsMainImage = (index: number) => setMainImageIndex(index);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔑 PASSO 1: Recalcular o valor final do preço no momento da submissão
    const finalPriceString = priceDisplay.replace(/[^\d,]/g, ''); // Remove tudo exceto dígitos e vírgula
    const priceParts = finalPriceString.split(',');
    let finalPriceNumeric = 0;

    if (priceParts.length > 1) {
      const integerPart = priceParts.slice(0, -1).join('').replace(/\./g, '');
      const decimalPart = priceParts.slice(-1)[0];
      finalPriceNumeric = parseFloat(`${integerPart}.${decimalPart}`);
    } else {
      finalPriceNumeric = parseFloat(finalPriceString.replace(/\./g, ''));
    }

    // Garantir que é um número válido, se não for, volta para 0
    finalPriceNumeric = isNaN(finalPriceNumeric) || finalPriceNumeric < 0 ? 0 : finalPriceNumeric;

    // 🔑 PASSO 2: Validação
    if (!name || finalPriceNumeric <= 0 || stock < 0 || images.length === 0) {
      console.log("Falha na Validação:", { name, finalPriceNumeric, stock, imagesCount: images.length });
      return;
    }

    const filesToUpload = images.filter(img => img instanceof File) as File[];

    const productData: Partial<Product> = {
      _id: product?._id,
      type, name,
      price: finalPriceNumeric,
      stock,
      images: filesToUpload,
      mainImageIndex,
      isFreeShipping,
      selectedColors,
      gigas,
      installments,
      withInterest,
      categoria,
      marca,
      ...(type === 'Celular' && deviceCondition === 'Usado' && { usedCondition }),
      deviceCondition
    };

    await onSubmit(productData);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, loading]);

  useEffect(() => {
    if (product && isOpen) {
      setType(product.type || "Celular");
      setName(product.name || "");
      setPrice(product.price || 0);
      setPriceDisplay(product.price ? product.price.toFixed(2).replace('.', ',') : "");
      setStock(product.stock || 0);

      if (product.images && product.images.length > 0) {
        setImages(product.images);
      } else if (product.imageUrl) {
        setImages([product.imageUrl]);
        setMainImageIndex(0);
      } else {
        setImages([]);
      }

      setMainImageIndex(product.mainImageIndex || 0);
      setIsFreeShipping(product.isFreeShipping || false);
      setSelectedColors(product.selectedColors || []);
      setGigas(product.gigas || storageOptions[0]);
      setInstallments(product.installments || 1);
      setWithInterest(product.withInterest || true);
      setCategoria(product.categoria || categories[0]);
      setMarca(product.marca || brands[0]);
      setDeviceCondition(product.deviceCondition || "Novo");
      setUsedCondition(product.usedCondition || "Ótimo");
    } else if (!product && isOpen) {
      resetForm();
    }
    return () => {
      if (!isOpen) images.forEach(img => {
        if (img instanceof File) URL.revokeObjectURL(URL.createObjectURL(img));
      });
    }
  }, [product, isOpen]);

  useEffect(() => {
    calculateInstallments(price, installments, withInterest);
  }, [price, installments, withInterest]);

  if (!isOpen) return null;

  const isEditing = !!product;

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent} ref={modalRef}>
        <h2>{isEditing ? "Editar Produto" : "Adicionar Novo Produto"}</h2>

        <form onSubmit={handleSubmit} className={modalStyles.form}>
          <div className={formStyles["form-row"]}>
            <div className={formStyles["form-group"]}>
              <label>Tipo do Produto</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Celular">Celular</option>
                <option value="Acessório">Acessório</option>
              </select>
            </div>
            <div className={formStyles["form-group"]}>
              <label>Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className={formStyles["form-group"]}>
              <label>Marca</label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ex: Motorola, Samsung..." required />
            </div>
          </div>
          <div className={formStyles["form-row"]}>
            <div className={formStyles["form-group"]}>
              <label>Nome do Produto</label>
              <input type="text" placeholder="Nome do produto" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={formStyles["form-group"]}>
              <label>Estoque</label>
              <input
                type="number"
                placeholder="Estoque"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
                min="0"
              />
            </div>
            {type === "Celular" && (
              <div className={formStyles["form-group"]}>
                <label>Armazenamento</label>
                <select value={gigas} onChange={e => setGigas(e.target.value)}>
                  {storageOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                </select>
              </div>
            )}
          </div>

          {type === "Celular" && (
            <div className={formStyles["form-row"]}>
              <div className={formStyles["form-group"]}>
                <label>Estado do Aparelho</label>
                <select value={deviceCondition} onChange={(e) => setDeviceCondition(e.target.value as "Novo" | "Usado")}>
                  <option value="Novo">Novo</option>
                  <option value="Usado">Usado</option>
                </select>
              </div>
              {deviceCondition === "Usado" && (
                <div className={formStyles["form-group"]}>
                  <label>Condição</label>
                  <select value={usedCondition} onChange={(e) => setUsedCondition(e.target.value as "Ótimo" | "Bom" | "Regular")}>
                    <option value="Ótimo">Ótimo</option>
                    <option value="Bom">Bom</option>
                    <option value="Regular">Regular</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div className={formStyles["form-group"]}>
            <label>Cores disponíveis</label>
            <div className={formStyles["color-container"]}>
              {availableColors.map((color) => (
                <button type="button" key={color} className={`${formStyles["color-button"]} ${selectedColors.includes(color) ? formStyles.selected : ""}`} onClick={() => handleColorToggle(color)}>
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className={formStyles["form-row"]}>
            <div className={formStyles["form-group"]}>
              <label>Preço (R$)</label>
              <input
                type="text"
                placeholder="Preço (R$)"
                value={priceDisplay}
                onChange={handlePriceChange}
                required
              />
            </div>
            <div className={formStyles["form-group"]}>
              <label>Frete</label>
              <div className={formStyles["checkbox-container"]}>
                <input type="checkbox" id="freeShipping" checked={isFreeShipping} onChange={(e) => setIsFreeShipping(e.target.checked)} />
                <label htmlFor="freeShipping">Frete grátis?</label>
              </div>
            </div>
          </div>

          <div className={formStyles["installments-section"]}>
            <label className={formStyles["installments-label"]}>Parcelamento</label>
            {price > 0 && installmentDetails.length > 0 && (
              <ul className={formStyles["installments-list"]}>
                {installmentDetails.map((detail, idx) => (<li key={idx}>{detail}</li>))}
              </ul>
            )}
            <div className={formStyles["installments-container"]}>
              <select value={withInterest ? "juros" : "sem"} onChange={(e) => setWithInterest(e.target.value === "juros")}>
                <option value="juros">Com Juros ({machineFee}%)</option>
                <option value="sem">Sem Juros</option>
              </select>
              <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (<option key={n} value={n}>{n}x</option>))}
              </select>
            </div>
          </div>
          <div className={formStyles["images-upload-container"]}>
            <label>Imagens do Produto</label>
            <input type="file" accept="image/*" multiple onChange={handleImagesChange} />

            <div className={formStyles["image-preview-container"]}>
              {images.map((img, index) => {
                const isFile = img instanceof File;
                const imageUrl = isFile ? URL.createObjectURL(img) : img as string;

                return (
                  <div key={index} className={formStyles["image-preview"]}>
                    <img
                      src={imageUrl}
                      alt={`Produto ${index}`}
                    />
                    {mainImageIndex === index && (<span className={formStyles["image-main-badge"]}>Principal</span>)}

                    <button type="button" onClick={() => removeImage(index)} className={formStyles["image-remove-button"]}>&times;</button>

                    {mainImageIndex !== index && (
                      <button type="button" onClick={() => setAsMainImage(index)} className={formStyles["image-main-button"]}>Definir Principal</button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className={modalStyles.buttons}>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading
                ? (isEditing ? "Salvando..." : "Adicionando...")
                : (isEditing ? "Salvar Alterações" : "Adicionar Produto")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}