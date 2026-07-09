import api from "./api";
import type {Company} from "../types/company";

export type CompanyPayload = Omit<Company, "id" | "jobs">;
export type CompanyUpdatePayload = Partial<CompanyPayload>;

export async function getCompanies(): Promise<Company[]> {
    const response = await api.get<Company[]>("/company");
    return response.data;
}

export async function getCompanyById(id: number): Promise<Company> {
    const response = await api.get<Company>(`/company/${id}`);
    return response.data;
}

export async function createCompany(company: CompanyPayload): Promise<Company> {
    const response = await api.post<Company>("/company", company);
    return response.data;
}

export async function updateCompany(id: number, company: CompanyUpdatePayload): Promise<Company> {
    const response = await api.put<Company>(`/company/${id}`, company);
    return response.data;
}

export async function deleteCompany(id: number): Promise<void> {
    await api.delete(`/company/${id}`);
}
