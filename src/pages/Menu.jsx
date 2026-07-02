import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { menuService } from "@/services/menuService";
import { ROUTE_PATH } from "@/constants/routePaths";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function Menu() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // States for Product Detail Bottom Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isSheetLoading, setIsSheetLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          menuService.getCategories(),
          menuService.getProducts(),
        ]);
        setCategories(categoriesRes.data || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Lỗi tải danh mục hoặc món ăn");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
  };

  const handleOpenDetail = async (productId) => {
    try {
      setIsSheetLoading(true);
      setIsSheetOpen(true);
      const detailRes = await menuService.getProductById(productId);
      const prod = detailRes.data;
      setActiveProduct(prod);
      
      // Chọn size mặc định (nếu có biến thể size)
      const sizes = prod.variants?.filter(v => v.variantType === 'size' && v.isActive !== 'inactive') || [];
      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      } else {
        setSelectedSize(null);
      }
      
      // Reset toppings, số lượng, ghi chú
      setSelectedToppings([]);
      setQuantity(1);
      setNote("");
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin chi tiết món ăn");
      setIsSheetOpen(false);
    } finally {
      setIsSheetLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setIsSheetOpen(false);
    setActiveProduct(null);
  };

  const handleToppingToggle = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t._id === topping._id);
      if (exists) {
        return prev.filter(t => t._id !== topping._id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToCart = () => {
    setCartCount(prev => prev + quantity);
    toast.success(`Đã thêm ${quantity} x ${activeProduct.name} vào giỏ hàng!`);
    handleCloseDetail();
  };

  // Tính toán tổng giá trị thực tế của món ăn kèm biến thể
  const calculateSinglePrice = () => {
    if (!activeProduct) return 0;
    const base = activeProduct.price || 0;
    const sizeAdjustment = selectedSize ? (selectedSize.priceAdjustment || 0) : 0;
    const toppingsAdjustment = selectedToppings.reduce((sum, t) => sum + (t.priceAdjustment || 0), 0);
    return base + sizeAdjustment + toppingsAdjustment;
  };

  const totalPrice = calculateSinglePrice() * quantity;

  const filteredProducts = products.filter((p) => {
    const categoryMatches =
      selectedCategory === "all" || 
      p.category?._id === selectedCategory || 
      p.category === selectedCategory;
    const searchMatches = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatches && searchMatches;
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] flex justify-center selection:bg-[#f59e0b]/30">
      <div className="relative min-h-screen w-full max-w-md flex flex-col bg-white shadow-xl overflow-x-hidden font-sans text-[#1a1c1c] pb-24">
        {/* CSS Styles injection for custom animations, scrollbars and fonts */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
          }
          
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .bottom-sheet-transition {
            transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
          }
          .scrim-transition {
            transition: opacity 0.4s ease;
          }
        `}} />

        {/* Top AppBar */}
        <header className="sticky top-0 left-0 w-full z-10 flex justify-between items-center px-4 h-16 bg-white/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#855300] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              coffee
            </span>
            <span className="font-bold text-[18px] leading-none text-[#855300] tracking-wide">
              SipPoint
            </span>
          </div>
          {/* Table Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffcdae]/50 text-[#7a553c] rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
            <span className="font-semibold text-[13px]">Bàn B05</span>
          </div>
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined text-[#534434]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </header>

        <main className="pt-4 px-4 flex-1">
          {/* Search & Filter Section */}
          <section className="mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#534434]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-zinc-100 border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#f59e0b] focus:bg-white outline-none transition-all"
                  placeholder="Tìm kiếm món yêu thích..."
                />
              </div>
            </div>
          </section>

          {/* Horizontal Categories */}
          <section className="mb-6 -mx-4 px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 pb-2">
              <button
                onClick={() => handleCategoryClick("all")}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#f59e0b] text-[#613b00] shadow-sm"
                    : "bg-zinc-100 text-[#534434] hover:bg-zinc-200"
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                    selectedCategory === cat._id
                      ? "bg-[#f59e0b] text-[#613b00] shadow-sm"
                      : "bg-zinc-100 text-[#534434] hover:bg-zinc-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {/* Bestseller Feature Asymmetric Hero */}
          <section className="mb-6">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-[0px_8px_24px_rgba(59,31,10,0.1)] group">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop"
                alt="Salted Cream Coffee"
              />
              <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end">
                <span className="inline-block w-fit px-2 py-0.5 mb-1.5 bg-[#f59e0b] text-[#613b00] text-[10px] font-bold rounded uppercase tracking-wider">
                  Bestseller
                </span>
                <h3 className="text-[20px] font-bold text-white leading-tight">
                  Món mới tháng này
                </h3>
                <p className="text-white/80 text-[13px]">
                  Thưởng thức hương vị đậm đà nguyên bản
                </p>
              </div>
            </div>
          </section>

          {/* 2-Column Product Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300]" />
              <span className="text-sm text-zinc-500 mt-2">Đang tải thực đơn...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              Không tìm thấy món ăn phù hợp.
            </div>
          ) : (
            <section className="grid grid-cols-2 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleOpenDetail(p._id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0px_4px_12px_rgba(59,31,10,0.06)] border border-zinc-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="relative h-32 bg-zinc-50">
                    {p.image ? (
                      <img
                        className="w-full h-full object-cover"
                        src={p.image}
                        alt={p.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30 text-zinc-500">
                        <span className="material-symbols-outlined text-[48px]">
                          local_cafe
                        </span>
                      </div>
                    )}
                    {p.stock <= 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                        Hết hàng
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h4 className="font-semibold text-[14px] text-zinc-900 line-clamp-1 mb-1">
                      {p.name}
                    </h4>
                    <p className="text-[14px] text-[#855300] font-bold mb-3">
                      {p.price.toLocaleString("vi-VN")}đ
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(p._id);
                      }}
                      disabled={p.stock <= 0}
                      className="mt-auto w-full py-2 bg-[#855300] text-white rounded-xl text-[13px] font-semibold active:scale-95 transition-transform flex items-center justify-center gap-1 hover:bg-[#855300]/95 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Thêm
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNavBar activeTab="MENU" />

        {/* Bottom Sheet Detail Modal */}
        {isSheetOpen && (
          <>
            {/* Scrim Overlay */}
            <div 
              onClick={handleCloseDetail}
              className="fixed inset-0 bg-black/40 z-[60] scrim-transition opacity-100 animate-fade-in"
            />
            {/* Modal Sheet container */}
            <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-[70] bg-white rounded-t-[28px] bottom-sheet-transition transform translate-y-0 max-h-[90vh] flex flex-col shadow-[0px_-8px_24px_rgba(59,31,10,0.1)] animate-slide-up">
              {/* Handlebar */}
              <div className="w-full flex justify-center py-3">
                <div className="w-8 h-1.5 bg-zinc-200 rounded-full" />
              </div>
              
              {/* Close Button overlay */}
              <div className="absolute top-4 right-4 z-[80]">
                <button 
                  onClick={handleCloseDetail}
                  className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-zinc-800 shadow-sm active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {isSheetLoading || !activeProduct ? (
                <div className="flex-1 flex flex-col items-center justify-center py-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300]" />
                  <span className="text-sm text-zinc-500 mt-2">Đang tải chi tiết món ăn...</span>
                </div>
              ) : (
                <>
                  <div className="overflow-y-auto hide-scrollbar flex-1 pb-32">
                    {/* Hero Image */}
                    <div className="relative w-full aspect-[4/3] bg-zinc-50">
                      {activeProduct.image ? (
                        <img 
                          className="w-full h-full object-cover" 
                          src={activeProduct.image}
                          alt={activeProduct.name} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30 text-zinc-500">
                          <span className="material-symbols-outlined text-[64px]">
                            local_cafe
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-5 pt-5 space-y-6">
                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h2 className="text-[22px] font-bold text-zinc-900 leading-tight">
                          {activeProduct.name}
                        </h2>
                        <p className="text-[20px] font-bold text-[#855300]">
                          {activeProduct.price?.toLocaleString("vi-VN")}đ
                        </p>
                        <p className="text-[13px] text-zinc-500 leading-relaxed pt-2">
                          {activeProduct.description || "Chưa có mô tả chi tiết cho món ăn này."}
                        </p>
                      </div>

                      {/* Size Selection */}
                      {activeProduct.variants?.some(v => v.variantType === 'size' && v.isActive !== 'inactive') && (
                        <div className="space-y-3">
                          <h3 className="text-[14px] font-bold text-zinc-900">Chọn size</h3>
                          <div className="flex gap-3">
                            {activeProduct.variants
                              .filter(v => v.variantType === 'size' && v.isActive !== 'inactive')
                              .map((size) => (
                                <button
                                  key={size._id}
                                  onClick={() => setSelectedSize(size)}
                                  className={`flex-1 py-2.5 rounded-full border-2 text-[13px] font-bold transition-all active:scale-95 ${
                                    selectedSize?._id === size._id
                                      ? "border-[#f59e0b] bg-[#ffcdae]/30 text-[#7a553c]"
                                      : "border-zinc-200 bg-transparent text-zinc-600 hover:border-[#f59e0b]/40"
                                  }`}
                                >
                                  {size.name} {size.priceAdjustment > 0 && `(+${size.priceAdjustment / 1000}k)`}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Toppings Selection */}
                      {activeProduct.variants?.some(v => v.variantType === 'topping' && v.isActive !== 'inactive') && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-[14px] font-bold text-zinc-900">Topping</h3>
                            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">Tùy chọn</span>
                          </div>
                          <div className="space-y-2">
                            {activeProduct.variants
                              .filter(v => v.variantType === 'topping' && v.isActive !== 'inactive')
                              .map((topping) => {
                                const isChecked = selectedToppings.some(t => t._id === topping._id);
                                return (
                                  <label 
                                    key={topping._id}
                                    className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl active:bg-zinc-100 transition-colors cursor-pointer border border-zinc-100"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                        isChecked ? "border-[#855300] bg-[#855300] text-white" : "border-zinc-300"
                                      }`}>
                                        {isChecked && (
                                          <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                        )}
                                      </div>
                                      <span className="text-[14px] font-medium text-zinc-800">{topping.name}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-[#855300]">
                                      +{topping.priceAdjustment?.toLocaleString("vi-VN")}đ
                                    </span>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleToppingToggle(topping)}
                                      className="hidden" 
                                    />
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Note Field */}
                      <div className="space-y-3">
                        <h3 className="text-[14px] font-bold text-zinc-900">Ghi chú cho quán...</h3>
                        <textarea 
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-4 text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#f59e0b]/20 outline-none min-h-[80px] resize-none" 
                          placeholder="Ví dụ: Ít đá, nhiều kem muối..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sticky Bottom Action */}
                  <div className="absolute bottom-0 left-0 w-full bg-white p-5 flex items-center gap-4 shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] border-t border-zinc-100 z-[90]">
                    {/* Stepper */}
                    <div className="flex items-center bg-zinc-100 rounded-full h-12 px-2">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-[#855300] active:scale-90 disabled:opacity-30 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[20px]">remove</span>
                      </button>
                      <span className="w-8 text-center font-bold text-[14px] text-zinc-800">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#855300] active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      </button>
                    </div>
                    {/* Add to Cart Button */}
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#855300] h-12 rounded-full flex items-center justify-center gap-2 text-white text-[15px] font-bold active:scale-[0.98] transition-all hover:bg-[#855300]/95 shadow-md"
                    >
                      <span>Thêm vào giỏ</span>
                      <span className="w-1 h-1 bg-white/40 rounded-full" />
                      <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
