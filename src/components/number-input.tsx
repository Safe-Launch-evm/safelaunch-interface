import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { NumericFormat, NumericFormatProps, OnValueChange } from 'react-number-format';
import { cn } from '@/lib/utils';

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
        <p className="text-accent-error text-[12px]/[20px] tracking-[0.5px]">{message}</p>
      )}
    />
  );
}

interface NumberInputProps extends NumericFormatProps {
  name: string;
  label?: string;
  htmlFor?: string;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { name, label, htmlFor, ...props },
  ref
) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={htmlFor} className="text-[1.125rem]/[1.125rem]">
          {label}
        </label>
      ) : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <NumericFormat
            getInputRef={ref}
            // className={cn(
            //   'flex w-full rounded-lg border bg-input px-4 py-3 font-inter text-[1.25rem] font-normal text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#848E9C] disabled:cursor-not-allowed disabled:opacity-50',
            //   props.className
            // )}
            {...field}
            {...props}
          />
        )}
      />
      <FieldError name={name} />
    </div>
  );
});

export default NumberInput;
