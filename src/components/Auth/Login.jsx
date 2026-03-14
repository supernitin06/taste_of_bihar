import React, { useState, useEffect } from "react";
import { showPromiseToast } from "../../utils/toastAlert";
import restaurantImage from "../../assets/image.png";
import { useLoginMutation } from "../../api/services/authapi";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiAlertTriangle, FiUsers, FiChevronRight } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

const LoginForm = ({ role = "admin", onRoleChange }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  // Floating particles effect
  useEffect(() => {
    const createParticles = () => {
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
      }));
      setParticles(newParticles);
    };
    createParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: (p.y + p.speed) % 100,
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsAnimating(true);

    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: role === "admin" ? "RESTAURANT_ADMIN" : "SUB_ADMIN",
    };

    try {
      await showPromiseToast(
        login(payload).unwrap(),
        {
          loading: 'Authenticating...',
          success: 'Welcome to Taste of Bihar!',
          error: (err) => err?.data?.message || err?.error || "Login failed"
        }
      );
      
      if (formData.rememberMe) {
        localStorage.setItem("rememberMeEmail", formData.email);
      }
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err?.data?.message || err?.error || "Access Denied");
      setIsAnimating(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            left: `${particle.x}vw`,
            top: `${particle.y}vh`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.1}s`,
          }}
        />
      ))}

      {/* Floating Orbs */}
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>
      <div style={styles.orb3}></div>

      <div style={{
        ...styles.card,
        flexDirection: isMobile ? "column" : "row",
        maxWidth: "1100px",
        height: isMobile ? "auto" : "650px",
        animation: `${isAnimating ? 'successPulse 1.5s ease' : 'slideIn 0.8s ease-out'}`
      }}>
        {/* LEFT IMAGE SECTION */}
        <div style={{
          ...styles.imageSection,
          flex: isMobile ? "none" : 1.2,
          height: isMobile ? "250px" : "100%",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={styles.imageGradient}></div>
          <img 
            src={restaurantImage} 
            alt="Taste of Bihar" 
            style={{
              ...styles.image,
              transform: isAnimating ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.5s ease"
            }} 
          />
          
          <div style={styles.floatingCutlery}>🌶️</div>
          <div style={styles.floatingPlate}>🥘</div>
          
          <div style={styles.imageContent}>
            <div style={styles.restaurantLogo}>
              <div style={styles.logoCircle}>
                 <span style={{ fontSize: '40px' }}>🍲</span>
              </div>
            </div>
            <h2 style={{
              ...styles.restaurantTitle,
              fontSize: isMobile ? "32px" : "48px",
              background: "linear-gradient(45deg, #fff, #ffd700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Taste of Bihar</h2>
            <p style={styles.restaurantTagline}>Experience the Soul of Traditional Flavors</p>
            <div style={styles.animatedLine}></div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div style={{
          ...styles.formSection,
          padding: isMobile ? "40px 24px" : "60px",
          flex: 1,
        }}>
          <div style={styles.formPattern}></div>
          
          <div style={styles.formContent}>
            <div style={styles.header}>
              <div style={styles.welcomeBack}>
                <div style={{
                  ...styles.welcomeIcon,
                  animation: "iconFloat 2s ease-in-out infinite"
                }}>
                  <FiLock />
                </div>
                <div style={styles.titleContainer}>
                  <h1 style={styles.title}>Secure Access</h1>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Welcome to the Royal Kitchen</p>
                </div>
              </div>
            </div>

            {/* ROLE SWITCHER */}
            <div style={styles.roleSwitcher}>
              <button
                onClick={() => onRoleChange?.("admin")}
                style={{
                  ...styles.roleButton,
                  ...(role === "admin" ? styles.roleButtonActive : {}),
                  transform: role === "admin" ? "scale(1.02)" : "scale(1)",
                }}
              >
                <FaCrown style={{ color: role === "admin" ? "#fff" : "#ffc107" }} />
                <span style={{ fontWeight: '700' }}>Admin</span>
              </button>
              
              <button
                onClick={() => onRoleChange?.("subadmin")}
                style={{
                  ...styles.roleButton,
                  ...(role === "subadmin" ? styles.roleButtonActive : {}),
                  transform: role === "subadmin" ? "scale(1.02)" : "scale(1)",
                }}
              >
                <FiUsers style={{ color: role === "subadmin" ? "#fff" : "#d32f2f" }} />
                <span style={{ fontWeight: '700' }}>Sub-Admin</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Official Email</label>
                <div style={styles.inputContainer}>
                  <span style={styles.inputIcon}><FiMail /></span>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@tasteofbihar.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Passkey</label>
                <div style={styles.inputContainer}>
                  <span style={styles.inputIcon}><FiLock /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={styles.errorMessage}>
                  <FiAlertTriangle /> {error}
                </div>
              )}

              <button
                type="submit"
                style={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span style={styles.spinner}></span>
                ) : (
                  <>
                    <span>Enter Kitchen</span>
                    <FiChevronRight />
                  </>
                )}
                <span style={styles.buttonShine}></span>
              </button>

              <div style={styles.footer}>
                <p style={styles.copyright}>© 2026 Taste of Bihar • Management Portal</p>
                <div style={styles.securityBadge}>
                  🛡️ Madhubani-Secure Encryption
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fffdf5 0%, #ffd8a8 100%)",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Outfit', sans-serif",
  },
  particle: {
    position: "absolute",
    background: "rgba(211, 47, 47, 0.1)",
    borderRadius: "50%",
    pointerEvents: "none",
    animation: "float 20s infinite linear",
  },
  orb1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(255,193,7,0.15) 0%, rgba(255,193,7,0) 70%)",
    borderRadius: "50%",
    top: "-150px",
    left: "-150px",
    animation: "orbFloat 20s infinite ease-in-out",
  },
  orb2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(211,47,47,0.1) 0%, rgba(211,47,47,0) 70%)",
    borderRadius: "50%",
    bottom: "-100px",
    right: "-100px",
    animation: "orbFloat 25s infinite ease-in-out reverse",
  },
  orb3: {
    position: "absolute",
    width: "250px",
    height: "250px",
    background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "50%",
    top: "40%",
    right: "5%",
    animation: "orbFloat 30s infinite ease-in-out",
  },
  card: {
    display: "flex",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    overflow: "hidden",
    width: "100%",
    boxShadow: "0 40px 100px -20px rgba(93, 16, 16, 0.25)",
    zIndex: 1,
    border: "1px solid rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(20px)",
  },
  imageSection: {
    flex: 1.2,
    position: "relative",
    overflow: "hidden",
  },
  imageGradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(93, 16, 16, 0.95) 0%, rgba(211, 47, 47, 0.6) 100%)",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  floatingCutlery: {
    position: "absolute",
    fontSize: "50px",
    top: "15%",
    left: "15%",
    animation: "floatItem 8s infinite ease-in-out",
    zIndex: 3,
  },
  floatingPlate: {
    position: "absolute",
    fontSize: "60px",
    bottom: "15%",
    right: "15%",
    animation: "floatItem 10s infinite ease-in-out reverse",
    zIndex: 3,
  },
  imageContent: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    padding: "40px",
    textAlign: "center",
  },
  logoCircle: {
    width: "100px",
    height: "100px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    marginBottom: "20px",
    animation: "logoFloat 3s infinite ease-in-out",
  },
  restaurantTitle: {
    fontWeight: "900",
    marginBottom: "12px",
    fontFamily: "'Playfair Display', serif",
    letterSpacing: "-0.04em",
  },
  restaurantTagline: {
    fontSize: "18px",
    opacity: 0.9,
    fontWeight: "500",
    letterSpacing: "0.05em",
  },
  animatedLine: {
    width: "80px",
    height: "4px",
    background: "#ffc107",
    marginTop: "24px",
    borderRadius: "2px",
    animation: "lineGrow 3s infinite",
  },
  formSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    background: "#fffdf5",
  },
  formPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(#d32f2f 0.5px, transparent 0.5px)",
    backgroundSize: "30px 30px",
    opacity: 0.03,
    pointerEvents: "none",
  },
  formContent: {
    width: "100%",
    maxWidth: "400px",
    zIndex: 2,
  },
  header: {
    marginBottom: "40px",
  },
  welcomeBack: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "10px",
  },
  welcomeIcon: {
    fontSize: "36px",
    color: "#d32f2f",
    padding: "16px",
    background: "rgba(211, 47, 47, 0.05)",
    borderRadius: "20px",
    display: "flex",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#5d1010",
    letterSpacing: "-0.02em",
  },
  roleSwitcher: {
    display: "flex",
    gap: "12px",
    marginBottom: "40px",
  },
  roleButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "18px",
    border: "2px solid #f1f1f1",
    background: "#fff",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "14px",
    color: "#5d1010",
  },
  roleButtonActive: {
    background: "#5d1010",
    borderColor: "#5d1010",
    color: "#ffffff",
    boxShadow: "0 15px 30px -10px rgba(93, 16, 16, 0.4)",
  },
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: "28px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "800",
    color: "#d32f2f",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "20px",
    fontSize: "20px",
    color: "#d32f2f",
    opacity: 0.4,
  },
  input: {
    width: "100%",
    padding: "20px 20px 20px 55px",
    borderRadius: "20px",
    border: "2px solid #f1f1f1",
    fontSize: "16px",
    background: "#fff",
    transition: "all 0.3s ease",
    outline: "none",
    color: "#1a0f0f",
    fontWeight: "600",
  },
  eyeButton: {
    position: "absolute",
    right: "20px",
    background: "none",
    border: "none",
    color: "#d32f2f",
    opacity: 0.4,
    cursor: "pointer",
    fontSize: "20px",
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fff5f5",
    color: "#d32f2f",
    padding: "16px 20px",
    borderRadius: "16px",
    marginBottom: "24px",
    fontSize: "14px",
    fontWeight: "700",
    border: "1px solid rgba(211, 47, 47, 0.1)",
  },
  loginButton: {
    width: "100%",
    padding: "22px",
    background: "linear-gradient(135deg, #d32f2f 0%, #5d1010 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "24px",
    fontSize: "18px",
    fontWeight: "900",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    boxShadow: "0 20px 40px -12px rgba(93, 16, 16, 0.4)",
    marginBottom: "30px",
    position: "relative",
    overflow: "hidden",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  buttonShine: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(45deg, transparent, rgba(255, 193, 7, 0.1), transparent)",
    transform: "translateX(-100%) rotate(45deg)",
    animation: "shine 3s infinite",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  footer: {
    textAlign: "center",
    marginTop: "10px",
  },
  copyright: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "600",
    marginBottom: "12px",
  },
  securityBadge: {
    fontSize: "11px",
    color: "#388e3c",
    background: "rgba(56, 142, 60, 0.1)",
    padding: "6px 16px",
    borderRadius: "30px",
    display: "inline-flex",
    alignItems: "center",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
};

// Global animations injected via style tag
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }
    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(30px, -30px) scale(1.1); }
    }
    @keyframes logoFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    @keyframes iconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes lineGrow {
      0%, 100% { width: 0; opacity: 0; }
      50% { width: 80px; opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes successPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    @keyframes shine {
      to { transform: translateX(200%) rotate(45deg); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default LoginForm;