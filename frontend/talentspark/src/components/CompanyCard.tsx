import type { Company } from "../types/company";
import { useState } from "react";
import "./CompanyCard.css";

type Props = {
    companies: Company[];
    onedit: (company: Company) => void;
    ondelete: (id: number) => void;
    onadd: (company: Company) => void;
}

function CompanyCard({
    companies, onadd, onedit, ondelete
}: Props) {
    const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
    const [addform, setAddform] = useState<Company>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        location: "",
        jobs: []
    });
    const [formError, setFormError] = useState<string>("");
    const [editform, setEditform] = useState<Company>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        location: "",
        jobs: []
    });

    const handleAdd = async () => {
        setFormError("");
        // Basic client-side validation to avoid submitting empty strings
        if (!addform.name.trim() || !addform.email.trim() || !addform.phone.trim() || !addform.location.trim()) {
            setFormError("All fields are required.");
            return;
        }
        try {
            await onadd({
                ...addform,
                // trim whitespace
                name: addform.name.trim(),
                email: addform.email.trim(),
                phone: addform.phone.trim(),
                location: addform.location.trim(),
            });
            setAddform({
                id: 0,
                name: "",
                email: "",
                phone: "",
                location: "",
                jobs: []
            });
        } catch (error: any) {
            console.error("Failed to add company:", error);
            setFormError(error?.response?.data?.detail || "Failed to add company");
        }
    };

    const handleSave = async () => {
        setFormError("");
        if (!editform.name.trim() || !editform.email.trim() || !editform.phone.trim() || !editform.location.trim()) {
            setFormError("All fields are required.");
            return;
        }
        try {
            await onedit({
                ...editform,
                name: editform.name.trim(),
                email: editform.email.trim(),
                phone: editform.phone.trim(),
                location: editform.location.trim(),
            });
            setEditCompanyId(null);
            setEditform({
                id: 0,
                name: "",
                email: "",
                phone: "",
                location: "",
                jobs: []
            });
        } catch (error: any) {
            console.error("Failed to save company:", error);
            setFormError(error?.response?.data?.detail || "Failed to save company");
        }
    };

    const handleCancel = () => {
        setEditCompanyId(null);
        setEditform({
            id: 0,
            name: "",
            email: "",
            phone: "",
            location: "",
            jobs: []
        });
    };

    const startEdit = (company: Company) => {
        setEditCompanyId(company.id);
        setEditform({ ...company });
    };

    return (
        <div className="company-section">
            <h2>Companies</h2>
            {formError && <p className="form-error">{formError}</p>}
            <div className="company-list">
                {companies.map((company) => (
                    <div key={company.id} className="company-card">
                        {editCompanyId === company.id ? (
                            <div className="company-edit-form">
                                <div className="form-row">
                                    <input
                                        type="text"
                                        value={editform.name}
                                        onChange={(e) => setEditform({ ...editform, name: e.target.value })}
                                        placeholder={company.name}
                                    />
                                    <input
                                        type="email"
                                        value={editform.email}
                                        onChange={(e) => setEditform({ ...editform, email: e.target.value })}
                                        placeholder={company.email}
                                    />
                                    <input
                                        type="tel"
                                        value={editform.phone}
                                        onChange={(e) => setEditform({ ...editform, phone: e.target.value })}
                                        placeholder={company.phone}
                                    />
                                    <input
                                        type="text"
                                        value={editform.location}
                                        onChange={(e) => setEditform({ ...editform, location: e.target.value })}
                                        placeholder={company.location}
                                    />
                                </div>
                                <div className="company-actions">
                                    <button type="button" className="edit-btn" onClick={handleSave}>Save</button>
                                    <button type="button" className="delete-btn" onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="company-header">
                                    <div className="company-title">
                                        <h3>{company.name}</h3>
                                    </div>
                                </div>
                                <div className="company-details">
                                    <p><span className="label">Email:</span> {company.email}</p>
                                    <p><span className="label">Phone:</span> {company.phone}</p>
                                    <p><span className="label">Location:</span> {company.location}</p>
                                </div>
                                <div className="company-actions">
                                    <button type="button" className="edit-btn" onClick={() => startEdit(company)}>Edit</button>
                                    <button type="button" className="delete-btn" onClick={() => ondelete(company.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="add-company-form">
                <h3>Add New Company</h3>
                <div className="form-row">
                    <input
                        type="text"
                        value={addform.name}
                        onChange={(e) => setAddform({ ...addform, name: e.target.value })}
                        placeholder="Company Name"
                    />
                    <input
                        type="email"
                        value={addform.email}
                        onChange={(e) => setAddform({ ...addform, email: e.target.value })}
                        placeholder="Email"
                    />
                    <input
                        type="tel"
                        value={addform.phone}
                        onChange={(e) => setAddform({ ...addform, phone: e.target.value })}
                        placeholder="Phone"
                    />
                    <input
                        type="text"
                        value={addform.location}
                        onChange={(e) => setAddform({ ...addform, location: e.target.value })}
                        placeholder="Location"
                    />
                </div>
                <button type="button" className="add-btn" onClick={handleAdd}>Add Company</button>
            </div>
        </div>
    )
}

export default CompanyCard;