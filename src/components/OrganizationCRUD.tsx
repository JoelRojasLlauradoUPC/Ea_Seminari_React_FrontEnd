import { useEffect, useState } from "react";
import organizationService, { Organization } from "../services/organization-service";
import { CanceledError } from "../services/api-client";
import OrganizationList from "./OrganizationList";
import OrganizationForm, { OrganizationFormData } from "./OrganizationForm";

const OrganizationCRUD = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = organizationService.getAll<Organization>();
    request
      .then((res) => {
        setOrganizations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
        setLoading(false);
      });
    return () => cancel();
  }, []);

  const handleDelete = (org: Organization) => {
    const originalOrgs = [...organizations];
    setOrganizations(organizations.filter((o) => o._id !== org._id));
    organizationService.delete(org._id).catch((err) => {
      setError(err.message);
      setOrganizations(originalOrgs);
    });
  };

  const handleSave = (data: OrganizationFormData) => {
    if (editingOrg) {
      // Update
      const updatedOrg = { ...editingOrg, ...data };
      const originalOrgs = [...organizations];
      
      setOrganizations(organizations.map(o => o._id === editingOrg._id ? updatedOrg : o));
      
      organizationService.update(updatedOrg).catch(err => {
        setError(err.message);
        setOrganizations(originalOrgs);
      });

    } else {
      // Create
      // Temporary ID for optimistic update
      const newOrg = { _id: "temp_" + Date.now(), ...data };
      const originalOrgs = [...organizations];

      setOrganizations([newOrg, ...organizations]);

      organizationService.create(data)
        .then((res) => {
            const savedOrg = res.data as Organization;
            setOrganizations(prevOrgs => prevOrgs.map(o => o._id === newOrg._id ? savedOrg : o));
        })
        .catch(err => {
          setError(err.message);
          setOrganizations(originalOrgs);
        });
    }
    setShowForm(false);
    setEditingOrg(null);
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingOrg(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrg(null);
  };

  return (
    <div>
      <h2 className="mb-4">Organizations</h2>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      
      {showForm ? (
        <OrganizationForm 
          onSubmit={handleSave} 
          initialData={editingOrg || undefined} 
          onCancel={handleCancel} 
        />
      ) : (
        <button className="btn btn-primary mb-3" onClick={handleAddClick}>Add Organization</button>
      )}
      
      <OrganizationList organizations={organizations} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default OrganizationCRUD;
