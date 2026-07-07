import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobList from "./components/JobList";
import ChatBox from "./components/ChatBox";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Register from "./pages/register";
import { useEffect, useState } from "react";
import { getCompanies, updateCompany, deleteCompany, createCompany } from "./Services/CompanyService";
import { isLoggedIn, logout } from "./Services/AuthService";
import type { Company } from "./types/company";
import "./App.css";
import "./styles.css";

function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [authenticated, setAuthenticated] = useState(isLoggedIn());
    const [showRegister, setShowRegister] = useState(false);

    async function fetchCompanies() {
        setLoading(true);
        setError(null);
        try {
            const company = await getCompanies();
            setCompanies(company);
        } catch (err: any) {
            if (err?.response?.status === 401) {
                logout();
                setAuthenticated(false);
                setCompanies([]);
                return;
            }
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function handleEdit(company: Company) {
        try {
            const updatedCompany = await updateCompany(company.id, company);
            setCompanies(companies.map((c) => c.id === updatedCompany.id ? updatedCompany : c));
        } catch (err) {
            setError(err as Error);
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteCompany(id);
            setCompanies(companies.filter((c) => c.id !== id));
        } catch (err) {
            setError(err as Error);
        }
    }

    async function handleAdd(company: Company) {
        try {
            const newCompany = await createCompany(company);
            setCompanies([...companies, newCompany]);
        } catch (err) {
            setError(err as Error);
        }
    }

    const handleLogin = () => {
        setAuthenticated(true);
        setShowRegister(false);
        fetchCompanies();
    }

    const handleLogout = () => {
        logout();
        setAuthenticated(false);
        setCompanies([]);
        setError(null);
    }

    useEffect(() => {
        if (authenticated) {
            fetchCompanies();
        }
    }, [authenticated]);

    // Show login/register page if not authenticated
    if (!authenticated) {
        return (
            <div className="auth-wrapper">
                {showRegister ? (
                    <Register onRegister={handleLogin} onSwitchToLogin={() => setShowRegister(false)} />
                ) : (
                    <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-state">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                Error: {error.message}
            </div>
        );
    }

    return (
        <div className="app-layout">
            <NavBar onLogout={handleLogout} />
            <main className="main-container">
                <CompanyCard
                    companies={companies}
                    onedit={handleEdit}
                    ondelete={handleDelete}
                    onadd={handleAdd}
                />
                <JobList />
                <ResumeAnalyzer />
                <ChatBox />
            </main>
            <Footer />
        </div>
    );
}

export default App;