import api from "./api";
import type { Job } from "../types/job";

type JobInput = Omit<Job, "id"> & {
  salary: number | string;
  company_id: number | string;
};

const normalizeJobPayload = (job: JobInput) => ({
  ...job,
  salary: Number(job.salary),
  company_id: Number(job.company_id),
});

export const getJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>("/job");
  return response.data;
};

export const createJob = async (job: JobInput): Promise<Job> => {
  const response = await api.post<Job>("/job", normalizeJobPayload(job));
  return response.data;
};

export const updateJob = async (id: number, job: JobInput): Promise<Job> => {
  const response = await api.put<Job>(`/job/${id}`, normalizeJobPayload(job));
  return response.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/job/${id}`);
};
