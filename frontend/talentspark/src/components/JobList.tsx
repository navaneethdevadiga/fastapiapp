import { useEffect, useState } from "react";
import type { Job } from "../types/job";
import type { Company } from "../types/company";
import { getJobs, createJob, updateJob, deleteJob } from "../Services/JobService";
import { getCompanies } from "../Services/CompanyService";

type JobForm = {
  title: string;
  description: string;
  salary: string;
  company_id: string;
};

function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [newJob, setNewJob] = useState<JobForm>({
    title: "",
    description: "",
    salary: "",
    company_id: "",
  });
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editJob, setEditJob] = useState<JobForm>({
    title: "",
    description: "",
    salary: "",
    company_id: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      // fetch jobs (public)
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || err?.message || "Unable to load jobs");
      } finally {
        setLoading(false);
      }

      // fetch companies (may require auth)
      try {
        const companiesData = await getCompanies();
        setCompanies(companiesData);
        setCompanyError(null);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          setCompanyError("Please log in to load companies.");
        } else {
          setCompanyError(err?.response?.data?.detail || err?.message || "Unable to load companies");
        }
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchAll();
  }, []);

  const handleAddJob = async () => {
    const salary = Number(newJob.salary);
    const company_id = Number(newJob.company_id);

    if (!newJob.title.trim() || !newJob.description.trim() || Number.isNaN(salary) || Number.isNaN(company_id) || salary <= 0 || company_id <= 0) {
      setError("All job fields are required, salary must be a number greater than 0, and company_id must be a number greater than 0.");
      return;
    }

    setError(null);
    try {
      const created = await createJob({
        title: newJob.title.trim(),
        description: newJob.description.trim(),
        salary,
        company_id,
      });
      setJobs((prev) => [...prev, created]);
      setNewJob({ title: "", description: "", salary: "", company_id: "" });
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Unable to add job");
    }
  };

  const startEditJob = (job: Job) => {
    setEditingJobId(job.id);
    setEditJob({
      title: job.title,
      description: job.description,
      salary: String(job.salary),
      company_id: String(job.company_id),
    });
    setError(null);
  };

  const cancelEditJob = () => {
    setEditingJobId(null);
    setEditJob({ title: "", description: "", salary: "", company_id: "" });
  };

  const handleUpdateJob = async () => {
    if (editingJobId === null) return;

    const salary = Number(editJob.salary);
    const company_id = Number(editJob.company_id);

    if (!editJob.title.trim() || !editJob.description.trim() || Number.isNaN(salary) || Number.isNaN(company_id) || salary <= 0 || company_id <= 0) {
      setError("All job fields are required, salary must be a number greater than 0, and company_id must be a number greater than 0.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updated = await updateJob(editingJobId, {
        title: editJob.title.trim(),
        description: editJob.description.trim(),
        salary,
        company_id,
      });
      setJobs((prev) => prev.map((job) => (job.id === updated.id ? updated : job)));
      cancelEditJob();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Unable to update job");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    setError(null);
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      if (editingJobId === id) cancelEditJob();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Unable to delete job");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginTop: "2rem", maxWidth: "720px" }}>
      <h2>Jobs</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <ul>
            {jobs.map((job) => (
              <li key={job.id} style={{ marginBottom: "0.75rem", border: "1px solid #ddd", padding: "0.75rem", borderRadius: "8px" }}>
                <strong>{job.title}</strong>
                <p>{job.description}</p>
                <p>Salary: {job.salary}</p>
                <p>
                  Company: {companies.find((c) => c.id === job.company_id)?.name ?? job.company_id}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => startEditJob(job)}
                    style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", cursor: "pointer", background: "#ffdddd" }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <h3>{editingJobId ? "Edit Job" : "Add Job"}</h3>
        <input
          type="text"
          placeholder="Title"
          value={editingJobId ? editJob.title : newJob.title}
          onChange={(e) =>
            editingJobId
              ? setEditJob({ ...editJob, title: e.target.value })
              : setNewJob({ ...newJob, title: e.target.value })
          }
          style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
        />
        <textarea
          placeholder="Description"
          value={editingJobId ? editJob.description : newJob.description}
          onChange={(e) =>
            editingJobId
              ? setEditJob({ ...editJob, description: e.target.value })
              : setNewJob({ ...newJob, description: e.target.value })
          }
          style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Salary"
          value={editingJobId ? editJob.salary : newJob.salary}
          onChange={(e) =>
            editingJobId
              ? setEditJob({ ...editJob, salary: e.target.value })
              : setNewJob({ ...newJob, salary: e.target.value })
          }
          style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
        />
        <select
          value={editingJobId ? editJob.company_id : newJob.company_id}
          onChange={(e) =>
            editingJobId
              ? setEditJob({ ...editJob, company_id: e.target.value })
              : setNewJob({ ...newJob, company_id: e.target.value })
          }
          style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
          disabled={loadingCompanies || companies.length === 0}
        >
          <option value="">
            {loadingCompanies
              ? "Loading companies..."
              : companies.length === 0
              ? "No companies available"
              : "Select company"}
          </option>
          {companies.map((company) => (
            <option key={company.id} value={company.id.toString()}>
              {company.name || company.email || `Company ${company.id}`}
            </option>
          ))}
        </select>
        {companyError && <p style={{ color: "#ff4444", marginTop: "0.5rem" }}>{companyError}</p>}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={editingJobId ? handleUpdateJob : handleAddJob}
            disabled={saving}
            style={{ padding: "0.75rem 1rem", borderRadius: "6px", cursor: "pointer" }}
          >
            {editingJobId ? (saving ? "Saving..." : "Save Changes") : "Add Job"}
          </button>
          {editingJobId && (
            <button
              onClick={cancelEditJob}
              style={{ padding: "0.75rem 1rem", borderRadius: "6px", cursor: "pointer", background: "#eee" }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobList;
