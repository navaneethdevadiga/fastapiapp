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
    const [editform, setEditform] = useState<Company>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        location: "",
        jobs: []
    });

    const handleAdd = () => {
        onadd(addform);
        setAddform({
            id: 0,
            name: "",
            email: "",
            phone: "",
            location: "",
            jobs: []
        });
    };

    const handleSave = () => {
        onedit(editform);
        setEditform({
            id: 0,
            name: "",
            email: "",
            phone: "",
            location: "",
            jobs: []
        });
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
                                    <button className="edit-btn" onClick={handleSave}>Save</button>
                                    <button className="delete-btn" onClick={handleCancel}>Cancel</button>
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
                                    <button className="edit-btn" onClick={() => startEdit(company)}>Edit</button>
                                    <button className="delete-btn" onClick={() => ondelete(company.id)}>Delete</button>
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
                <button className="add-btn" onClick={handleAdd}>Add Company</button>
            </div>
        </div>
    )
}

export default CompanyCard;