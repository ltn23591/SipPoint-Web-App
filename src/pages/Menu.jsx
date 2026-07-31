import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { menuService } from "@/services/menuService";
import { ROUTE_PATH } from "@/constants/routePaths";
import BottomNavBar from "@/components/layout/BottomNavBar";
import NotificationSheet from "@/components/common/NotificationSheet";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tableName, setTableName] = useState(() => localStorage.getItem("tableName") || "");
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setTableName(localStorage.getItem("tableName") || "");
    };
    window.addEventListener("tableNameUpdated", handleUpdate);
    return () => window.removeEventListener("tableNameUpdated", handleUpdate);
  }, []);
  const [cartCount, setCartCount] = useState(() => {
    try {
      const savedCart = localStorage.getItem("sippoint_cart");
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        return cart.reduce((sum, c) => sum + c.qty, 0);
      }
    } catch {
      // ignore
    }
    return 0;
  });

  // States for Product Detail Bottom Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isSheetLoading, setIsSheetLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
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
      
      // Reset số lượng, ghi chú
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



  const handleAddToCart = () => {
    const cartItem = {
      productId: activeProduct._id,
      name: activeProduct.name,
      image: activeProduct.image,
      price: activeProduct.price,
      qty: quantity,
      variants: [
        ...(selectedSize ? [{ variantId: selectedSize._id, name: selectedSize.name, priceAdjustment: selectedSize.priceAdjustment }] : []),
      ],
      note: note,
      stock: activeProduct.stock || 0,
    };

    const savedCart = localStorage.getItem("sippoint_cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    const currentStock = activeProduct.stock || 0;
    const totalQtyInCart = cart.filter(c => c.productId === cartItem.productId).reduce((sum, c) => sum + c.qty, 0);

    if (totalQtyInCart + quantity > currentStock) {
      toast.error(`Rất tiếc! Số lượng vượt quá tồn kho (chỉ còn ${currentStock} sản phẩm).`);
      return;
    }

    // Check if same product + same variants already exists
    const existingIdx = cart.findIndex(c => c.productId === cartItem.productId && JSON.stringify(c.variants) === JSON.stringify(cartItem.variants));
    if (existingIdx >= 0) {
      cart[existingIdx].qty += quantity;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem("sippoint_cart", JSON.stringify(cart));

    setCartCount(cart.reduce((sum, c) => sum + c.qty, 0));
    toast.success(`Đã thêm ${quantity} x ${activeProduct.name} vào giỏ hàng!`);
    handleCloseDetail();
  };

  // Tính toán tổng giá trị thực tế của món ăn kèm biến thể
  const calculateSinglePrice = () => {
    if (!activeProduct) return 0;
    const base = activeProduct.price || 0;
    const sizeAdjustment = selectedSize ? (selectedSize.priceAdjustment || 0) : 0;
    return base + sizeAdjustment;
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
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-surface-dim flex justify-center selection:bg-[#f59e0b]/30">
      <div className="relative min-h-screen w-full max-w-md flex flex-col bg-white dark:bg-background shadow-xl overflow-x-hidden font-sans text-[#1a1c1c] dark:text-on-surface pb-24">
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
        <header className="sticky top-0 left-0 w-full z-10 flex justify-between items-center px-4 h-16 bg-white/95 dark:bg-surface/90 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#855300] dark:text-brand-cream text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              coffee
            </span>
            <span className="font-bold text-[18px] leading-none text-[#855300] dark:text-brand-cream tracking-wide">
              SipPoint
            </span>
          </div>
          {/* Table Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffcdae]/50 dark:bg-secondary-container text-[#7a553c] dark:text-on-secondary-container rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
            <span className="font-semibold text-[13px]">{tableName ? `Bàn ${tableName}` : "Mang đi"}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsNotiOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
              title="Thông báo"
            >
              <span className="material-symbols-outlined text-[#534434] dark:text-on-surface">notifications</span>
            </button>
            <Link to={ROUTE_PATH.CART} className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-[#534434] dark:text-on-surface">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="pt-4 px-4 flex-1">
          {/* Search & Filter Section */}
          <section className="mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#534434] dark:text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-zinc-100 dark:bg-surface-container border-none rounded-xl text-[14px] text-zinc-900 dark:text-on-surface focus:ring-2 focus:ring-[#f59e0b] dark:focus:ring-primary-container focus:bg-white dark:focus:bg-surface-container-high outline-none transition-all placeholder:text-zinc-500 dark:placeholder:text-on-surface-variant"
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
                    ? "bg-[#f59e0b] dark:bg-primary-container text-[#613b00] dark:text-on-primary-container shadow-sm"
                    : "bg-zinc-100 dark:bg-surface-container text-[#534434] dark:text-on-surface-variant hover:bg-zinc-200 dark:hover:bg-surface-container-high dark:border dark:border-outline-variant/10"
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
                      ? "bg-[#f59e0b] dark:bg-primary-container text-[#613b00] dark:text-on-primary-container shadow-sm"
                      : "bg-zinc-100 dark:bg-surface-container text-[#534434] dark:text-on-surface-variant hover:bg-zinc-200 dark:hover:bg-surface-container-high dark:border dark:border-outline-variant/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {/* Bestseller Feature Asymmetric Hero */}
          <section className="mb-6">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-[0px_8px_24px_rgba(59,31,10,0.1)] dark:shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 dark:from-black/80 to-transparent z-10" />
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop"
                alt="Salted Cream Coffee"
              />
              <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end">
                <span className="inline-block w-fit px-2 py-0.5 mb-1.5 bg-[#f59e0b] dark:bg-primary-container text-[#613b00] dark:text-on-primary-container text-[10px] font-bold rounded uppercase tracking-wider">
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300] dark:border-primary-container" />
              <span className="text-sm text-zinc-500 dark:text-on-surface-variant mt-2">Đang tải thực đơn...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 dark:text-on-surface-variant text-sm">
              Không tìm thấy món ăn phù hợp.
            </div>
          ) : (
            <section className="grid grid-cols-2 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  onClick={() => {
                    if (p.stock > 0) handleOpenDetail(p._id);
                  }}
                  className={`bg-white dark:bg-surface-container-high rounded-2xl overflow-hidden shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-lg border border-zinc-100 dark:border-none flex flex-col transition-shadow ${
                    p.stock <= 0 ? 'opacity-75' : 'cursor-pointer hover:shadow-md dark:hover:bg-surface-bright'
                  }`}
                >
                  <div className="relative h-32 bg-zinc-50 dark:bg-surface-container-low">
                    {p.image ? (
                      <img
                        className="w-full h-full object-cover"
                        src={p.image}
                        alt={p.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30 text-zinc-500 dark:text-on-surface">
                        <span className="material-symbols-outlined text-[48px]">
                          local_cafe
                        </span>
                      </div>
                    )}
                    {p.stock <= 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 dark:bg-error-container text-white dark:text-on-error-container text-[10px] font-bold rounded shadow-sm">
                        Hết hàng
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h4 className="font-semibold text-[14px] text-zinc-900 dark:text-on-surface line-clamp-1 mb-1">
                      {p.name}
                    </h4>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[14px] text-[#855300] dark:text-primary-container font-bold">
                        {p.price.toLocaleString("vi-VN")}đ
                      </p>
                      {(p.stock || 0) > 0 && (
                        <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 dark:bg-surface-container-highest px-1.5 py-0.5 rounded">
                          Còn: {p.stock}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (p.stock > 0) handleOpenDetail(p._id);
                      }}
                      disabled={p.stock <= 0}
                      className="mt-auto w-full py-2 bg-[#855300] dark:bg-primary-container text-white dark:text-on-primary-container rounded-xl text-[13px] font-semibold active:scale-95 transition-transform flex items-center justify-center gap-1 hover:bg-[#855300]/95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      {p.stock <= 0 ? "Hết" : "Thêm"}
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
              className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[60] scrim-transition opacity-100 animate-fade-in"
            />
            {/* Modal Sheet container */}
            <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-[70] bg-white dark:bg-surface rounded-t-[28px] bottom-sheet-transition transform translate-y-0 max-h-[90vh] flex flex-col shadow-[0px_-8px_24px_rgba(59,31,10,0.1)] dark:shadow-none animate-slide-up">
              {/* Handlebar */}
              <div className="w-full flex justify-center py-3">
                <div className="w-8 h-1.5 bg-zinc-200 dark:bg-outline-variant rounded-full" />
              </div>
              
              {/* Close Button overlay */}
              <div className="absolute top-4 right-4 z-[80]">
                <button 
                  onClick={handleCloseDetail}
                  className="w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-surface-container-highest/80 backdrop-blur-sm rounded-full text-zinc-800 dark:text-on-surface shadow-sm active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {isSheetLoading || !activeProduct ? (
                <div className="flex-1 flex flex-col items-center justify-center py-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300] dark:border-primary-container" />
                  <span className="text-sm text-zinc-500 dark:text-on-surface-variant mt-2">Đang tải chi tiết món ăn...</span>
                </div>
              ) : (
                <>
                  <div className="overflow-y-auto hide-scrollbar flex-1 pb-32">
                    {/* Hero Image */}
                    <div className="relative w-full aspect-[4/3] bg-zinc-50 dark:bg-surface-container-low">
                      {activeProduct.image ? (
                        <img 
                          className="w-full h-full object-cover" 
                          src={activeProduct.image}
                          alt={activeProduct.name} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30 text-zinc-500 dark:text-on-surface">
                          <span className="material-symbols-outlined text-[64px]">
                            local_cafe
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-5 pt-5 space-y-6">
                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h2 className="text-[22px] font-bold text-zinc-900 dark:text-on-surface leading-tight">
                          {activeProduct.name}
                        </h2>
                        <div className="flex items-center gap-3">
                          <p className="text-[20px] font-bold text-[#855300] dark:text-primary-container">
                            {activeProduct.price?.toLocaleString("vi-VN")}đ
                          </p>
                          <span className="text-[12px] font-medium bg-[#ffcdae]/30 text-[#855300] dark:bg-primary-container/20 dark:text-primary-container px-2.5 py-0.5 rounded-full border border-[#f59e0b]/20">
                            Còn lại: {activeProduct.stock || 0}
                          </span>
                        </div>
                        <p className="text-[13px] text-zinc-500 dark:text-on-surface-variant leading-relaxed pt-2">
                          {activeProduct.description || "Chưa có mô tả chi tiết cho món ăn này."}
                        </p>
                      </div>

                      {/* Size Selection */}
                      {activeProduct.variants?.some(v => v.variantType === 'size' && v.isActive !== 'inactive') && (
                        <div className="space-y-3">
                          <h3 className="text-[14px] font-bold text-zinc-900 dark:text-on-surface">Chọn size</h3>
                          <div className="flex gap-3">
                            {activeProduct.variants
                              .filter(v => v.variantType === 'size' && v.isActive !== 'inactive')
                              .map((size) => (
                                <button
                                  key={size._id}
                                  onClick={() => setSelectedSize(size)}
                                  className={`flex-1 py-2.5 rounded-full border-2 text-[13px] font-bold transition-all active:scale-95 ${
                                    selectedSize?._id === size._id
                                      ? "border-[#f59e0b] dark:border-primary-container bg-[#ffcdae]/30 dark:bg-primary-container/20 text-[#7a553c] dark:text-primary-container"
                                      : "border-zinc-200 dark:border-outline-variant bg-transparent text-zinc-600 dark:text-on-surface-variant hover:border-[#f59e0b]/40 dark:hover:border-primary-container/40"
                                  }`}
                                >
                                  {size.name} {size.priceAdjustment > 0 && `(+${size.priceAdjustment / 1000}k)`}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}



                      {/* Note Field */}
                      <div className="space-y-3">
                        <h3 className="text-[14px] font-bold text-zinc-900 dark:text-on-surface">Ghi chú cho quán...</h3>
                        <textarea 
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-surface-container-lowest border border-zinc-100 dark:border-outline-variant rounded-xl p-4 text-[14px] text-zinc-800 dark:text-on-surface placeholder:text-zinc-400 dark:placeholder:text-on-surface-variant focus:ring-2 focus:ring-[#f59e0b]/20 dark:focus:ring-primary-container/50 outline-none min-h-[80px] resize-none" 
                          placeholder="Ví dụ: Ít đá, nhiều kem muối..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sticky Bottom Action */}
                  <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-surface p-5 flex items-center gap-4 shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] border-t border-zinc-100 dark:border-surface-container-high z-[90]">
                    {/* Stepper */}
                    <div className="flex items-center bg-zinc-100 dark:bg-surface-container rounded-full h-12 px-2">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-[#855300] dark:text-primary-container active:scale-90 disabled:opacity-30 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[20px]">remove</span>
                      </button>
                      <span className="w-8 text-center font-bold text-[14px] text-zinc-800 dark:text-on-surface">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        disabled={quantity >= (activeProduct.stock || 0)}
                        className={`w-8 h-8 flex items-center justify-center text-[#855300] dark:text-primary-container active:scale-90 transition-transform ${quantity >= (activeProduct.stock || 0) ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      </button>
                    </div>
                    <button 
                      onClick={handleAddToCart}
                      disabled={(activeProduct.stock || 0) <= 0}
                      className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-[15px] font-bold transition-all shadow-md ${
                        (activeProduct.stock || 0) <= 0 
                          ? "bg-zinc-200 dark:bg-surface-container-highest text-zinc-400 dark:text-on-surface-variant cursor-not-allowed" 
                          : "bg-[#855300] dark:bg-primary-container text-white dark:text-on-primary-container active:scale-[0.98] hover:bg-[#855300]/95 dark:hover:bg-primary"
                      }`}
                    >
                      <span>{(activeProduct.stock || 0) <= 0 ? "Đã hết hàng" : "Thêm vào giỏ"}</span>
                      {(activeProduct.stock || 0) > 0 && (
                        <>
                          <span className="w-1 h-1 bg-white/40 dark:bg-on-primary-container/40 rounded-full" />
                          <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        {/* Notification Sheet */}
        <NotificationSheet open={isNotiOpen} onClose={() => setIsNotiOpen(false)} />
      </div>
    </div>
  );
}