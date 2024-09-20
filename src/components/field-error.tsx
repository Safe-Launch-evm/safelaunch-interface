import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from 'react-hook-form';

interface FieldErrorProps {
  name?: string;
}

export function FieldError({ name }: FieldErrorProps) {
  const {
    formState: { errors }
  } = useFormContext();

  if (!name) return null;

  const error = errors[name];

  if (!error) return null;

  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p className="text-[12px]/[20px] tracking-[0.5px] text-destructive">{message}</p>
      )}
    />
  );
}
