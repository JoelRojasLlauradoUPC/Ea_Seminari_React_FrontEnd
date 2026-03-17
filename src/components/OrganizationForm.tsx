import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Organization } from "../services/organization-service";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' })
});

export type OrganizationFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: OrganizationFormData) => void;
  initialData?: Organization;
  onCancel: () => void;
}

const OrganizationForm = ({ onSubmit, initialData, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(data => {
      onSubmit(data);
      reset();
    })} className="mb-4 p-3 border rounded bg-light">
      <h4 className="mb-3">{initialData ? 'Edit Organization' : 'New Organization'}</h4>
      
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input {...register("name")} id="name" type="text" className="form-control" />
        {errors.name && <p className="text-danger">{errors.name.message}</p>}
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Add'}</button>
      </div>
    </form>
  );
};

export default OrganizationForm;
