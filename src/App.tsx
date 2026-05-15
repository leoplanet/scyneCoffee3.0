import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout/Layout";
import OrderPage from "./pages/OrderPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import MenuPage from "./pages/MenuPage";
import StatisticPage from "./pages/StatisticPage";
import BugReportPage from "./pages/BugReportPage";
import News from "./pages/News";
import "./index.css";

function ErrorFallback() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        color: "white",
        fontFamily: "sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2>Something went wrong</h2>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "16px",
          padding: "10px 24px",
          borderRadius: "8px",
          border: "none",
          background: "#7069d5",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Reload page
      </button>
    </div>
  );
}

function App() {
  return (
    <Router basename="/scyneCoffee3.0">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/statistic" element={<StatisticPage />} />
            <Route path="/bugreport" element={<BugReportPage />} />
            <Route path="/news" element={<News />} />
          </Route>

          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
