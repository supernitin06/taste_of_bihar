// src/pages/ErrorPage.jsx
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (


    <div className="relative min-h-screen flex items-center justify-center bg-slate-100 px-4">

      {/* White Blur Layer */}
      
      <div className="absolute inset-0 bg-white/60 backdrop-blur-2xl"></div>
      
      {/* Card */}
      <div className="relative z-10 max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center">

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">⚠️</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          404
        </h1>

        {/* Description */}
        <p className="text-slate-600 mb-6">
          An unexpected error occurred while loading this page.
        </p>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm font-medium">
          {error?.statusText || error?.message}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200" />

        {/* Actions */}
        <div className="flex gap-3">

          <button
            onClick={() => window.history.back()}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Home
          </button>

        </div>

      </div>

    </div>
  );
}
