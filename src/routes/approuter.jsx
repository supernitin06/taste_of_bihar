import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import Dashboard from "../pages/Dashboard";
import RestaurantManagement from "../pages/RestaurantManagement";
import UserManagement from "../pages/Usermanagement";
import DeliverySettings from "../pages/DeliverySettings";
import DeliveryPartnerManagement from "../pages/DeliveryPartnerManagement";
import Orders from "../pages/Orders";
import SubAdmin from "../pages/SubAdmin";
import CreateAdmin from "../components/Sub-Admin/CreateAdmin";
import AssignAdmin from "../components/Sub-Admin/AssignAdmin";
import AuthContainer from "../components/Auth/AuthContainer";
import PaymentDashboard from "../pages/payments/PaymentDashboard";
import Transactions from "../pages/payments/Transection";
import TransactionDetails from "../pages/payments/TransactionDetails";
import Refunds from "../pages/payments/Refunds";
import Invoice from "../pages/payments/Invoice";
import Settings from "../components/settings/Settings"
import CustomerReviewsPage from "../components/PageDashboard/ReviewCustomer/CustomerReviewsPage";
import OffersManagement from "../pages/OffersManagement";
import SupportManagement from "../pages/SupportManagement";
import MenuManagement from "../pages/menu/MenuManagement";
import AddMenu from "../components/menu/AddMenu";
import CookingLoader from "../pages/Loader";
import NewOrders from "../components/OrderPages/NewOrders";
import ProcessingOrders from "../components/OrderPages/ProcessingOrders";
import BirthdayParty from "../pages/party/BirthdayParty";
import KittyParty from "../pages/party/KittyParty";
import AnniversaryParty from "../pages/party/AnniversaryParty";

import AcceptedOrders from "../components/OrderPages/AcceptedOrders";
import PendingDeliveryPartners from "../pages/PendingDeliveryPartners";
// Make sure this path matches where you actually created the page



// loaders/generalLoader.js
export const generalLoader = async () => {
  // simulate API delay or global data fetching
  await new Promise((resolve) => setTimeout(resolve, 300)); // Reduced slightly for better UX on frequent clicks

  return null;
};

import ProtectedRoute from "../routes/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";


const AppRouter = createBrowserRouter([
  /* 🔐 AUTH ROUTES */
  {
    path: "/login",
    element: <AuthContainer />,
    errorElement: <ErrorPage />,
  },

  /* 🏠 MAIN APP */
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
            loader: generalLoader,
          },
          {
            path: "users",
            element: <UserManagement />,
            loader: generalLoader,
          },
          {
            path: "restaurants",
            element: <RestaurantManagement />,
            loader: generalLoader,
          },
          {
            path: "delivery-settings",
            element: <DeliverySettings />,
            loader: generalLoader,
          },
          {
            path: "delivery-partners",
            element: <DeliveryPartnerManagement />,
            loader: generalLoader,
          },

          {
            path: "pending-delivery-partners",   // new route
            element: <PendingDeliveryPartners />,
            loader: generalLoader,               // optional, if you want the same loader
          },


          {
            path: "orders",
            loader: generalLoader,
            children: [
              {
                index: true,
                element: <Orders />,
                loader: generalLoader,
              },
              {
                path: "new",
                element: <NewOrders />,
                loader: generalLoader,
              },
              {
                path: "processing",
                element: <ProcessingOrders />,
                loader: generalLoader,
              },

              {
                path: "accepted",
                element: <AcceptedOrders />,
                loader: generalLoader,
              },


            ],
          },
          {
            path: "menu-management",
            loader: generalLoader,
            children: [
              {
                index: true,
                element: <MenuManagement />,
                loader: generalLoader,
              },
              {
                path: "add",
                element: <AddMenu />,
                loader: generalLoader,
              }
            ]
          },
          {
            path: "settings",
            element: <Settings />,
            loader: generalLoader,
          },
          {
            path: "support-tickets",
            element: <SupportManagement />,
            loader: generalLoader,
          },
          {
            path: "reviews",
            element: <CustomerReviewsPage />,
            loader: generalLoader,
          },
          /* 💳 PAYMENTS */
          {
            path: "payments",
            loader: generalLoader,
            children: [
              {
                path: "dashboard",
                element: <PaymentDashboard />,
                loader: generalLoader,
              },
              {
                path: "transactions",
                element: <Transactions />,
                loader: generalLoader,
              },
              {
                path: "transactions/:id",
                element: <TransactionDetails />,
                loader: generalLoader,
              },
              {
                path: "refunds",
                element: <Refunds />,
                loader: generalLoader,
              },
              {
                path: "invoice",
                element: <Invoice />,
                loader: generalLoader,
              },
              {
                path: "details",
                element: <TransactionDetails />,
                loader: generalLoader,
              },
            ],
          },
          {
            path: "offers",
            element: <OffersManagement />,
            loader: generalLoader,
          },
          {
            path: "sub-admin",
            loader: generalLoader,
            children: [
              {
                index: true,
                element: <SubAdmin />,
                loader: generalLoader,
              },
              {
                path: "create",
                element: <CreateAdmin />,
                loader: generalLoader,
              },
              {
                path: "assign",
                element: <AssignAdmin />,
                loader: generalLoader,
              },
            ],
          },
          {
            path: "party",
            loader: generalLoader,
            children: [
              {
                path: "birthday",
                element: <BirthdayParty />,
                loader: generalLoader,
              },
              {
                path: "kitty",
                element: <KittyParty />,
                loader: generalLoader,
              },
              {
                path: "anniversary",
                element: <AnniversaryParty />,
                loader: generalLoader,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default AppRouter;
