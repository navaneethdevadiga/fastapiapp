import NavBar from "./components/NavBar";
import Welcome from "./components/welcome";
import Footer from "./components/Footer";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import {useState,useEffect} from "react";
import { getCompanies } from "./Services/CompanyService";
import type { Company } from "./types/company";
function App() {
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState<Error|null>(null);
  const[companies,setCompanies]=useState<Company[]>([]);
  async function fetchCompanies(){
    setLoading(true);
    try{
      const companies=await getCompanies();
      setCompanies(companies);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  if(loading){
    return <div>Loading...</div>;
  }

  if(error){
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <NavBar />
      <Welcome />
      <CompanyCard
      companies={companies}/>
      <JobCard />
      <Footer />
    </>
  )
}
  
export default App;