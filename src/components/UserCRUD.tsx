import { useEffect, useState } from "react";
import userService, { User } from "../services/user-service";
import organizationService, { Organization } from "../services/organization-service";
import { CanceledError } from "../services/api-client";
import UserList from "./UserList";
import UserForm, { UserFormData } from "./UserForm";

const UserCRUD = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = userService.getAll<User>();
    request
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
        setLoading(false);
      });
    return () => cancel();
  }, []);

  useEffect(() => {
    const { request, cancel } = organizationService.getAll<Organization>();
    request
      .then((res) => {
        setOrganizations(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
      });
    return () => cancel();
  }, []);

  const handleDelete = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u._id !== user._id));
    userService.delete(user._id).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const handleSave = (data: UserFormData) => {
    const apiPayload = { ...data };
    // If password is empty, remove it from the payload for updates
    if (editingUser && !apiPayload.password) {
      delete (apiPayload as Partial<UserFormData>).password;
    }

    if (editingUser) {
      // Update
      const updatedUser = { ...editingUser, ...apiPayload };
      const originalUsers = [...users];
      
      setUsers(users.map(u => u._id === editingUser._id ? updatedUser : u));
      
      userService.update(updatedUser).catch(err => {
        setError(err.message);
        setUsers(originalUsers);
      });

    } else {
      // Create
      const newUser = { _id: "temp_" + Date.now(), ...apiPayload };
      const originalUsers = [...users];

      setUsers([newUser, ...users]);

      userService.create(apiPayload)
        .then((res) => {
            const savedUser = res.data as User;
            setUsers(prevUsers => prevUsers.map(u => u._id === newUser._id ? savedUser : u));
        })
        .catch(err => {
          setError(err.message);
          setUsers(originalUsers);
        });
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div>
      <h2 className="mb-4">Users</h2>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      
      {showForm ? (
        <UserForm 
          onSubmit={handleSave} 
          initialData={editingUser || undefined} 
          onCancel={handleCancel}
          organizations={organizations}
        />
      ) : (
        <button className="btn btn-primary mb-3" onClick={handleAddClick}>Add User</button>
      )}
      
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default UserCRUD;
