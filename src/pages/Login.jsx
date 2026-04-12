import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminSession, loginAdmin } from "../lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const checkExistingSession = async () => {
      try {
        await getAdminSession();
        if (isActive) navigate("/admin/home", { replace: true });
      } catch {
        // User is not authenticated; keep login page.
      }
    };

    checkExistingSession();
    return () => {
      isActive = false;
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin({ email, password });
      navigate("/admin/home", { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100 relative z-10 animate-fade-in-up">
        <div className="flex flex-col items-center">
           <div className="home-hero-bg-premium w-12 sm:w-16 h-12 sm:h-14 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
              <img 
                src="/images/Screenshot_2026-03-18_182531-removebg-preview.png" 
                alt="Nexturn Logo" 
                className="h-8 sm:h-10 w-auto object-contain transform scale-[1.5]"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[23px] sm:text-[27px] font-extrabold uppercase text-[#1B365D] leading-none tracking-normal inline-block transform scale-x-[0.95]" style={{ fontFamily: "'Syne', sans-serif" }}>
                NEXTURN
              </span>
              <span className="text-[10px] sm:text-[12.5px] font-bold text-[#1B365D]/85 uppercase tracking-[0.12em] whitespace-nowrap mt-1 pl-2">
                Componentcraft Pvt. Ltd.
              </span>
            </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-muted-blue">
            Please sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-light text-xl">mail</span>
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 placeholder-slate-light text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 sm:text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-light text-xl">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-12 py-3 border border-slate-200 placeholder-slate-light text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-light hover:text-accent transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-accent focus:ring-accent border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-blue cursor-pointer">
                Remember me
              </label>
            </div>

            {/* <div className="text-sm">
              <a href="#" className="font-medium text-accent hover:text-accent/80 transition-colors">
                Forgot password?
              </a>
            </div> */}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="pt-2 text-center">
          <Link to="/" className="text-sm text-muted-blue hover:text-primary transition-colors flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
