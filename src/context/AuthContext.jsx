import { useContext, useState, useEffect, createContext } from "react";
import { auth, googleProvider, signInWithPopup } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../firebase/utils";

const ReportAuthContext = createContext();

export function useAuth() {
  return useContext(ReportAuthContext);
}

const AuthProvider = ({ children }) => {
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState({ 1: null }); // Track cursor for each page
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  const initializeUser = async (user) => {
    if (user) {
      setUser(user);
      setLoader(false);
      navigate("/");
    } else {
      setUser(null);
      setLoader(true);
      navigate("/login");
    }
  };

  const handleUser = (user) => {
    setUser(user);
  };

  const handleReport = (report) => {
    setSelectedReport(report);
  };

  const logout = async () => {
    try {
      await handleLogout();
      setUser(null);
      setLoader(true);
      resetPagination();
    } catch (error) {
      alert(error.message);
    }
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Reset pagination state and page cursors
  const resetPagination = () => {
    setCurrentPage(1);
    setPageCursors({ 1: null });
  };

  const value = {
    user,
    loader,
    handleUser,
    handleReport,
    setSelectedReport,
    selectedReport,
    logout,
    signInWithGoogle,
    totalCount,
    setTotalCount,
    currentPage,
    setCurrentPage,
    pageCursors,
    setPageCursors,
    resetPagination,
  };
  return (
    <ReportAuthContext.Provider value={value}>
      {children}
    </ReportAuthContext.Provider>
  );
};

export default AuthProvider;
