import "./jobCard.css";

type Props = {
    title?: string;
    company?: string;
    location?: string;
    salary?: string;
}

function JobCard({ title = "Software Engineer", company = "Google", location = "Bangalore", salary = "5 LPA" }: Props) {
    return (
        <div className="job-card">
            <h3 className="job-title">{title}</h3>
            <p className="job-company">{company}</p>
            <p className="job-location">{location}</p>
            <p className="job-salary">{salary}</p>
        </div>
    )
}

export default JobCard;