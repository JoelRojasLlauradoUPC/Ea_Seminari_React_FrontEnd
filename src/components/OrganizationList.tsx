import { Organization } from "../services/organization-service";

interface Props {
  organizations: Organization[];
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

const OrganizationList = ({ organizations, onEdit, onDelete }: Props) => {
  return (
    <ul className="list-group">
      {organizations.map((org) => (
        <li key={org._id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold">{org.name}</span>
            <span className="mx-2 text-muted">|</span>
            <small className="text-muted">ID: {org._id}</small>
          </div>
          <div>
            <button
              className="btn btn-outline-secondary mx-1"
              onClick={() => onEdit(org)}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => onDelete(org)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationList;
