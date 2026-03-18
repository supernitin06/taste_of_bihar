import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Truck,
  Bike,
  ShoppingBag,
  CreditCard,
  ChevronDown,
  UserPlus,
  Shield,
  ShieldCheck,
  Circle,
  Menu,
  X,
  Clock,
  MessageSquare,
  GripVertical,
  Receipt,
  RefreshCw,
  FileText,
  PartyPopper,
  Cake,
  Heart,
  Diamond
} from "lucide-react";
import { FiClock } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./sidebar.css";

// Draggable Item Wrapper
const DraggableMenuItem = ({ item, isCollapsed, isActive, isExpanded, handleMenuClick, navigate, location, setIsMobileOpen }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative",
    opacity: isDragging ? 0.8 : 1
  };

  const Icon = item.icon;

  return (
    <div ref={setNodeRef} style={style} className="mb-1 group relative">
      <div className="flex items-center">
        {/* Main Item Content (Clickable for navigation) */}
        <div
          onClick={() => handleMenuClick(item)}
          className={`flex-1 flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition border-l-4
            ${isActive ? "sidebar-item-active border-white" : "text-sidebar hover:bg-white/10 border-transparent hover:border-white"}
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </div>

          {!isCollapsed && item.hasDropdown && (
            <ChevronDown
              className={`w-4 h-4 transition ${isExpanded ? "rotate-180" : ""}`}
            />
          )}
        </div>

        {/* Drag Handle (Only visible when not collapsed and on hover) */}
        {!isCollapsed && (
          <div
            {...attributes}
            {...listeners}
            className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-2 text-sidebar/50 hover:text-white transition-opacity"
          >
            <GripVertical size={16} />
          </div>
        )}
      </div>

      {/* Dropdown (Not sortable within itself for now) */}
      {item.hasDropdown && !isCollapsed && (
        <div
          className={`
            overflow-hidden transition-all duration-400 ml-4
            ${isExpanded ? "max-h-96 mt-2" : "max-h-0"}
          `}
        >
          {item.subItems.map((sub) => {
            const SubIcon = sub.icon || Circle;
            const isSubActive = location.pathname === sub.path;

            return (
              <div
                key={sub.id}
                onClick={() => {
                  navigate(sub.path);
                  setIsMobileOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer
                  transition-all duration-200
                  ${isSubActive
                    ? "bg-primary/20 text-white scale-105 font-semibold translate-x-4"
                    : "text-sidebar/70 hover:bg-white/10 hover:translate-x-2"
                  }
                `}
              >
                <SubIcon className="w-4 h-4" />
                <span>{sub.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ theme = "dark" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Theme Context for sorting
  const { sidebarOrder, setSidebarOrder } = useTheme();

  /* ---------------- Menu config ---------------- */
  const baseMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "users", label: "Users", icon: Users, path: "/users" },
    { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed, path: "/restaurants" },
    { id: "delivery-settings", label: "Delivery Settings", icon: Truck, path: "/delivery-settings" },
    {
      id: "delivery-partners",
      label: "Delivery Partners",
      icon: Bike,
      hasDropdown: true,
      subItems: [
        { id: "all-partners", label: "Manage Partners", path: "/delivery-partners", icon: Bike },
        { id: "pending-partners", label: "Pending Approvals", path: "/pending-delivery-partners", icon: Clock },
      ],
    },
    {
      id: "orders",
      label: "Orders",
      path: "/orders",
      icon: ShoppingBag,
      hasDropdown: true,
      subItems: [
        { id: "new-orders", label: "Order Management", icon: FiClock, path: "/orders/new" },
      ],
    },
    {
      id: "menu_items",
      label: "Menu",
      icon: UtensilsCrossed,
      hasDropdown: true,
      subItems: [
        { id: "menu-management", label: "Menu Management", icon: UtensilsCrossed, path: "/menu-management" },
        { id: "add-menu", label: "Add Menu", icon: UtensilsCrossed, path: "/menu-management/add" }
      ]
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      hasDropdown: true,
      subItems: [
        { id: "pay-dashboard", label: "Dashboard", path: "/payments/dashboard", icon: LayoutDashboard },
        { id: "transactions", label: "Transactions", path: "/payments/transactions", icon: Receipt },
        { id: "refunds", label: "Refunds", path: "/payments/refunds", icon: RefreshCw },
        { id: "invoice", label: "Invoice", path: "/payments/invoice", icon: FileText },
      ],
    },
    {
      id: "sub-admin",
      label: "Sub Admin",
      icon: ShieldCheck,
      path: "/sub-admin",
      hasDropdown: true,
      subItems: [
        { id: "create-sub-admin", label: "Create SubAdmin", path: "/sub-admin/create", icon: UserPlus },
        { id: "assign-sub-admin", label: "Assign SubAdmin", path: "/sub-admin/assign", icon: Shield },
      ],
    },
    { id: "offers", label: "Offers", icon: FaCog, path: "/offers" },
    { id: "reviews", label: "Reviews", icon: MessageSquare, path: "/reviews" },
    {
      id: "party",
      label: "Party",
      icon: PartyPopper,
      hasDropdown: true,
      subItems: [
        { id: "birthday-party", label: "Birthday Party", path: "/party/birthday", icon: Cake },
        { id: "kitty-party", label: "Kitty Party", path: "/party/kitty", icon: Users },
        { id: "anniversary-party", label: "Anniversary Party", path: "/party/anniversary", icon: Heart },
      ],
    },
    { id: "settings", label: "Settings", icon: FaCog, path: "/settings" },
  ];

  /* ---------------- Sync & Sort ---------------- */
  const menuItems = React.useMemo(() => {
    if (!sidebarOrder || sidebarOrder.length === 0) return baseMenuItems;
    const sorted = [];
    const itemMap = new Map(baseMenuItems.map((item) => [item.id, item]));
    sidebarOrder.forEach((id) => {
      if (itemMap.has(id)) {
        sorted.push(itemMap.get(id));
        itemMap.delete(id);
      }
    });
    itemMap.forEach((item) => sorted.push(item));
    return sorted;
  }, [sidebarOrder]);

  useEffect(() => {
    const current = location.pathname;
    for (const item of menuItems) {
      if (item.path === current) {
        setActiveMenu(item.id);
        setExpandedMenu(item.hasDropdown ? item.id : null);
        return;
      }
      if (item.hasDropdown) {
        const sub = item.subItems.find((s) => current.startsWith(s.path));
        if (sub) {
          setActiveMenu(item.id);
          setExpandedMenu(item.id);
          return;
        }
      }
    }
  }, [location.pathname]);

  /* ---------------- Handlers ---------------- */
  const handleMenuClick = (item) => {
    if (item.hasDropdown) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
      setActiveMenu(item.id);
      if (item.path) navigate(item.path);
    } else {
      navigate(item.path);
      setActiveMenu(item.id);
      setExpandedMenu(null);
      setIsMobileOpen(false);
    }
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Requires slight move to drag
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sidebarOrder.indexOf(active.id);
      const newIndex = sidebarOrder.indexOf(over.id);
      const newOrder = arrayMove(sidebarOrder, oldIndex, newIndex);
      setSidebarOrder(newOrder);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`lg:hidden fixed top-4 left-4 z-[100] p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${isMobileOpen ? "hidden" : "block"}`}
        aria-label="Toggle menu"
      >
        <Menu size={24} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={`h-screen sidebar-wrapper`}>
        <div
          className={`
            fixed lg:static top-0 left-0 z-[100] h-full bg-sidebar border-r border-sidebar
            transition-transform duration-300 ease-in-out
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${isCollapsed ? "lg:w-20 w-20" : "lg:w-64 w-64"}
            shadow-xl lg:shadow-none
          `}
        >

          {/* ---------- Header ---------- */}
          <div className="relative border-b border-sidebar p-4 ">
            <div className="flex items-center gap-3 h-14">
              <div
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="bg-accent/10 border border-accent/20 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <UtensilsCrossed className="w-6 h-6 text-accent" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                  Taste of <span className="text-accent underline decoration-primary decoration-4 underline-offset-4">Bihar</span>
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden ${isCollapsed ? "hidden" : "lg:flex"} absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center z-[101] border border-sidebar rounded-full shadow-md text-sidebar transition-transform duration-200 hover:scale-110`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={isCollapsed ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"} />
              </svg>
            </button>

            {/* Mobile Close Button */}
            {isMobileOpen && !isCollapsed && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* ---------- Menu (Sortable) ---------- */}
          <nav className="py-4 px-3 overflow-y-auto sidebar-scroll h-[calc(100vh-120px)] overflow-hidden">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={menuItems.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {menuItems.map((item) => (
                  <DraggableMenuItem
                    key={item.id}
                    item={item}
                    isCollapsed={isCollapsed}
                    isActive={activeMenu === item.id}
                    isExpanded={expandedMenu === item.id}
                    handleMenuClick={handleMenuClick}
                    navigate={navigate}
                    location={location}
                    setIsMobileOpen={setIsMobileOpen}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;