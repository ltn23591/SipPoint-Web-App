import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { menuService } from "@/services/menuService";
import { ROUTE_PATH } from "@/constants/routePaths";
import BottomNavBar from "@/components/layout/BottomNavBar";
import NotificationSheet from "@/components/common/NotificationSheet";
import ProductDetailSheet from "@/features/menu/components/ProductDetailSheet";
import { HeaderBar } from "@/components/layout/HeaderBar";

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

        {/* Top AppBar Component */}
        <HeaderBar
          title="SipPoint"
          tableName={tableName}
          cartCount={cartCount}
          onOpenCart={() => window.location.href = ROUTE_PATH.CART}
        />

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

        {/* Product Detail Sheet Component */}
        <ProductDetailSheet
          isOpen={isSheetOpen}
          isLoading={isSheetLoading}
          product={activeProduct}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          note={note}
          setNote={setNote}
          onAddToCart={handleAddToCart}
          onClose={handleCloseDetail}
        />

        {/* Notification Sheet */}
        <NotificationSheet open={isNotiOpen} onClose={() => setIsNotiOpen(false)} />
      </div>
    </div>
  );
}