import { Activity } from '../../models/Activity';

interface Props {
  activities: Activity[];
}

const formatDate = (date?: string) => {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleString();
};

const ActivityList = ({ activities }: Props) => {
  if (activities.length === 0) {
    return <p className="text-muted mb-0">No hay actividades registradas.</p>;
  }

  return (
    <ul className="list-group">
      {activities.map((activity) => (
        <li
          key={activity._id}
          className="list-group-item d-flex justify-content-between align-items-start"
        >
          <div className="me-3">
            <div className="fw-bold">
              {activity.tipoAccion} - {activity.entidad}
            </div>
            <div>{activity.nombreElemento}</div>
            {activity.entidadId && (
              <small className="text-muted">ID: {activity.entidadId}</small>
            )}
          </div>
          <small className="text-muted text-nowrap">{formatDate(activity.createdAt)}</small>
        </li>
      ))}
    </ul>
  );
};

export default ActivityList;