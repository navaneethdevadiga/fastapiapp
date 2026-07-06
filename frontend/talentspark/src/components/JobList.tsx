import { useEffect, useState } from "react";
import type { Job } from "../types/job";
import type { Company } from "../types/company";
import { getJobs, createJob, updateJob, deleteJob } from "../Services/JobService";
import { getCompanies } from "../Services/CompanyService";
import "./JobList.css";

const JOBS_STORAGE_KEY = "talentspark_jobs";

const persistJobs = (jobs: Job[]) => {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
};

const mergeJobs = (existingJobs: Job[], incomingJobs: Job[]) => {
    const merged = new Map<number, Job>();

    [...existingJobs, ...incomingJobs].forEach((job) => {
        if (job?.id) {
            merged.set(job.id, job);
        }
    });

    return Array.from(merged.values());
};

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
        let storedJobs: Job[] = [];

        try {
            const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
            if (savedJobs) {
                const parsedJobs = JSON.parse(savedJobs) as Job[];
                if (Array.isArray(parsedJobs)) {
                    storedJobs = parsedJobs;
                    setJobs(parsedJobs);
                }
            }
        } catch {
            // Ignore malformed stored jobs and fall back to the server.
        }

        const fetchAll = async () => {
            // fetch jobs (public)
            try {
                const data = await getJobs();
                setJobs((prev) => {
                    const nextJobs = mergeJobs(prev.length > 0 ? prev : storedJobs, data);
                    persistJobs(nextJobs);
                    return nextJobs;
                });
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
        const optimisticJob: Job = {
            id: Date.now(),
            title: newJob.title.trim(),
            description: newJob.description.trim(),
            salary,
            company_id,
        };

        setJobs((prev) => {
            const nextJobs = [...prev, optimisticJob];
            persistJobs(nextJobs);
            return nextJobs;
        });
        setNewJob({ title: "", description: "", salary: "", company_id: "" });

        try {
            const created = await createJob({
                title: newJob.title.trim(),
                description: newJob.description.trim(),
                salary,
                company_id,
            });
            setJobs((prev) => {
                const nextJobs = prev.map((job) => (job.id === optimisticJob.id ? created : job));
                persistJobs(nextJobs);
                return nextJobs;
            });
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
            setJobs((prev) => {
                const nextJobs = prev.map((job) => (job.id === updated.id ? updated : job));
                persistJobs(nextJobs);
                return nextJobs;
            });
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
            setJobs((prev) => {
                const nextJobs = prev.filter((job) => job.id !== id);
                persistJobs(nextJobs);
                return nextJobs;
            });
            if (editingJobId === id) cancelEditJob();
        } catch (err: any) {
            setError(err?.response?.data?.detail || err?.message || "Unable to delete job");
        }
    };

    return (
        <div className="job-section">
            <h2>Jobs</h2>
            {loading ? (
                <p className="loading-text">Loading jobs...</p>
            ) : (
                <>
                    {error && <p className="error-text">{error}</p>}
                    <div className="job-list">
                        {jobs.length === 0 ? (
                            <p className="empty-text">No jobs available. Add your first job!</p>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.id} className="job-card">
                                    <h3 className="job-title">{job.title}</h3>
                                    <p className="job-description">{job.description}</p>
                                    <p className="job-salary">Salary: {job.salary}</p>
                                    <p className="job-company">
                                        Company: {companies.find((c) => c.id === job.company_id)?.name ?? job.company_id}
                                    </p>
                                    <div className="job-actions">
                                        <button
                                            onClick={() => startEditJob(job)}
                                            className="edit-btn"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            <div className="job-form">
                <h3>{editingJobId ? "Edit Job" : "Add Job"}</h3>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Title"
                        value={editingJobId ? editJob.title : newJob.title}
                        onChange={(e) =>
                            editingJobId
                                ? setEditJob({ ...editJob, title: e.target.value })
                                : setNewJob({ ...newJob, title: e.target.value })
                        }
                    />
                    <textarea
                        placeholder="Description"
                        value={editingJobId ? editJob.description : newJob.description}
                        onChange={(e) =>
                            editingJobId
                                ? setEditJob({ ...editJob, description: e.target.value })
                                : setNewJob({ ...newJob, description: e.target.value })
                        }
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
                    />
                    <select
                        value={editingJobId ? editJob.company_id : newJob.company_id}
                        onChange={(e) =>
                            editingJobId
                                ? setEditJob({ ...editJob, company_id: e.target.value })
                                : setNewJob({ ...newJob, company_id: e.target.value })
                        }
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
                </div>
                {companyError && <p className="error-text">{companyError}</p>}
                <div className="form-actions">
                    <button
                        onClick={editingJobId ? handleUpdateJob : handleAddJob}
                        disabled={saving}
                        className="submit-btn"
                    >
                        {editingJobId ? (saving ? "Saving..." : "Save Changes") : "Add Job"}
                    </button>
                    {editingJobId && (
                        <button
                            onClick={cancelEditJob}
                            className="cancel-btn"
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