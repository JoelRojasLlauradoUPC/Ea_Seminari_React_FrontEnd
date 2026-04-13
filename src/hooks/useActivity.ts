import { useEffect, useState } from 'react';
import activityService from '../services/activity-service';
import { CanceledError } from '../services/api-client';
import { Activity } from '../models/Activity';

interface UseActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: string;
  fetchActivities: () => void;
}

export const useActivity = (): UseActivitiesReturn => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = () => {
    setLoading(true);
    setError('');
    const { request, cancel } = activityService.getAll<Activity>();
    request
      .then((res) => {
        setActivities(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
        setLoading(false);
      });
    return () => cancel();
  };

  return {
    activities,
    loading,
    error,
    fetchActivities,
  };
};