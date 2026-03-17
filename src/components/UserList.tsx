import { User } from "../services/user-service";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserList = ({ users, onEdit, onDelete }: Props) => {
  const getOrganizationName = (organizacion: User['organizacion']) => {
    if (typeof organizacion === 'object' && organizacion !== null) {
      return organizacion.name;
    }
    return organizacion; // Fallback to showing the ID string
  };

  return (
    <ul className="list-group">
      {users.map((user) => (
        <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold">{user.name}</span>
            <span className="mx-2 text-muted">|</span>
            <span>{user.email}</span>
            <span className="mx-2 text-muted">|</span>
            <span className="badge bg-info text-dark">
              {getOrganizationName(user.organizacion)}
            </span>
          </div>
          <div>
            <button
              className="btn btn-outline-secondary mx-1"
              onClick={() => onEdit(user)}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => onDelete(user)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
