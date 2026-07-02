import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { menuService } from "@/services/menuService";
import { ROUTE_PATH } from "@/constants/routePaths";

export default function Menu() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

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

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    toast.success("Đã thêm món vào giỏ hàng!");
  };

  const filteredProducts = products.filter((p) => {
    // Lọc theo danh mục
    const categoryMatches =
      selectedCategory === "all" || 
      p.category?._id === selectedCategory || 
      p.category === selectedCategory;
    // Lọc theo tên tìm kiếm
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
        `}} />

        {/* Top AppBar */}
        <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-white/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
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
                  className="w-full h-12 pl-12 pr-4 bg-zinc-100 border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#f59e0b] focus:bg-white outline-none transition-all animate-fade-in"
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
                  className="bg-white rounded-2xl overflow-hidden shadow-[0px_4px_12px_rgba(59,31,10,0.06)] border border-zinc-100 flex flex-col hover:shadow-md transition-shadow"
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
                      onClick={handleAddToCart}
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
        <nav className="fixed bottom-0 max-w-md mx-auto left-0 right-0 w-full z-50 flex justify-around items-center px-2 py-2 h-16 bg-white border-t border-zinc-100 shadow-[0px_-4px_12px_rgba(59,31,10,0.04)]">
          <a className="flex flex-col items-center justify-center bg-[#ffcdae]/50 text-[#7a553c] rounded-xl px-4 py-1.5 active:scale-90 transition-transform duration-150" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_cafe</span>
            <span className="text-[11px] font-semibold mt-0.5">Thực đơn</span>
          </a>
          <a className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5 hover:bg-zinc-50 rounded-xl transition-all active:scale-90 duration-150" href="#">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[11px] font-semibold mt-0.5">Đơn hàng</span>
          </a>
          <a className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5 hover:bg-zinc-50 rounded-xl transition-all active:scale-90 duration-150" href="#">
            <span className="material-symbols-outlined">redeem</span>
            <span className="text-[11px] font-semibold mt-0.5">Điểm thưởng</span>
          </a>
          <a className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5 hover:bg-zinc-50 rounded-xl transition-all active:scale-90 duration-150" href="#">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[11px] font-semibold mt-0.5">Tài khoản</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
