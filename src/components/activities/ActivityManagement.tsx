import { useActivity } from '../../hooks/useActivity';
import ActivityList from './ActivityList';

const ActivityManagement = () => {
  const { activities, loading, error } = useActivity();

  return (
    <div>
      <h2 className="mb-4">Action list</h2>
      {error && <p className="text-danger">{error}</p>}
      {loading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!loading && <ActivityList activities={activities} />}
    </div>
  );
};

export default ActivityManagement;