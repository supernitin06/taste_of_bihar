import React, { useState } from "react";
import BiharHeroBanner from "../components/home/BiharHeroBanner";
import BiharMenuCategories from "../components/home/BiharMenuCategories";
import BiharFoodCard from "../components/home/BiharFoodCard";
import BiharBadge from "../components/ui/BiharBadge";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const featuredDishes = [
    {
      id: 1,
      name: "Special Litti Chokha Thali",
      description: "Authentic roasted wheat balls filled with sattu, served with mashed potatoes, brinjals and desi ghee.",
      price: 249,
      originalPrice: 299,
      rating: 4.9,
      category: "Traditional",
      isFeatured: true,
      isVeg: true,
      tags: ["Classic", "Best Seller"],
      image: "https://images.unsplash.com/photo-1626132646529-5006375bc90e?q=80&w=800"
    },
    {
      id: 2,
      name: "Sattu Paratha Combo",
      description: "Hearty flatbreads stuffed with spiced gram flour, served with chilled curd and pickle.",
      price: 189,
      rating: 4.7,
      category: "Traditional",
      isVeg: true,
      tags: ["Popular"],
      image: "https://images.unsplash.com/photo-1627387115324-7588e9a5b041?q=80&w=800"
    },
    {
      id: 3,
      name: "Special Thekua Box",
      description: "Traditional sun-dried sweet delicacy made with whole wheat, jaggery and dry fruits.",
      price: 149,
      originalPrice: 199,
      rating: 4.8,
      category: "Sweets",
      isFeatured: true,
      isVeg: true,
      tags: ["Gift Pack"],
      image: "https://images.unsplash.com/photo-1621677244015-410a8cda9711?q=80&w=800"
    },
    {
      id: 4,
      name: "Sattu Sharbat (Chilled)",
      description: "Refreshing traditional protein drink made with roasted gram flour and roasted cumin.",
      price: 59,
      rating: 4.6,
      category: "Drinks",
      isVeg: true,
      tags: ["Healthy"],
      image: "https://images.unsplash.com/photo-1621356891040-5e6a0a030704?q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen page-background overflow-x-hidden">
      {/* Hero Section */}
      <BiharHeroBanner 
        onOrderClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
        onMenuClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Featured Section */}
      <section className="py-20 px-6 backdrop-blur-3xl bg-white/10 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <BiharBadge variant="mustard" className="animate-pulse">Today's Special</BiharBadge>
              <h2 className="text-4xl md:text-6xl font-black font-display text-vibrant">
                Our Signature Dishes
              </h2>
            </div>
            <button className="text-bihar-red font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Dishes <span>→</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDishes.map((dish) => (
              <BiharFoodCard key={dish.id} {...dish} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="menu-section">
        <BiharMenuCategories onCategorySelect={(cat) => setSelectedCategory(cat.id)} />
      </section>

      {/* Culture Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-bihar-maroon-dark text-white">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bihar-mustard/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black font-display leading-[1.1] text-white">
              Bihar's Heritage <br />
              <span className="text-vibrant italic">On Your Plate</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed font-hindi">
              हर निवाले में बिहार की सोंधी खुशबू। 
              <br />
              Beyond just food, we bring you the stories, the tradition, and the soul of Bihar. From the ghats of Ganga to the fields of Mithila.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold text-bihar-mustard mb-2">100%</div>
                <div className="text-sm font-medium">Authentic Recipes</div>
              </div>
              <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold text-bihar-mustard mb-2">DESI</div>
                <div className="text-sm font-medium">Ingredients</div>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square rounded-full border-2 border-dashed border-bihar-mustard/30 animate-spin-slow absolute inset-0 -m-8"></div>
             <img 
               src="https://images.unsplash.com/photo-1589187151003-0dd472410407?q=80&w=800" 
               alt="Bihari Thali" 
               className="rounded-full w-full aspect-square object-cover shadow-2xl relative z-10 border-8 border-white/10"
             />
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 px-6 border-t border-bihar-red/10 bg-white dark:bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-bihar-red/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-black text-vibrant tracking-tighter uppercase italic">
              Taste of Bihar
            </div>
            <p className="text-gray-400 font-bold tracking-widest text-xs uppercase">
              The Soul of Mithila & Magadh
            </p>
          </div>
          
          <div className="w-24 h-1 vibrant-gradient rounded-full"></div>
          
          <p className="max-w-md text-gray-500 font-medium leading-relaxed">
            Bringing the authentic culinary heritage of Bihar to your table with love and tradition.
          </p>
          
          <div className="pt-8 border-t border-gray-100 dark:border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">
              © 2026 Taste of Bihar • Premium Restaurant
            </p>
            <div className="flex gap-6 text-2xl font-black text-bihar-red/30">
               Bihar • Delhi • Mumbai
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
