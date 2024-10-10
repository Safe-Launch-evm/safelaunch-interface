'use client';

import { ComponentProps } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  UseFormProps,
  FormProvider,
  UseFormReturn,
  FieldValues
} from 'react-hook-form';

import { ZodSchema, TypeOf } from 'zod';

interface UseZodFormProps<T extends ZodSchema<any>> extends UseFormProps<TypeOf<T>> {
  schema: T;
}

export const useZodForm = <T extends ZodSchema<any>>({
  schema,
  ...formConfig
}: UseZodFormProps<T>) => {
  return useForm({
    ...formConfig,
    resolver: zodResolver(schema)
  });
};

interface FormProps<T extends FieldValues = any> extends ComponentProps<'form'> {
  form: UseFormReturn<T>;
  disabled?: boolean;
}

const Form = <T extends FieldValues>({ form, disabled, children, ...props }: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form {...props}>
        <fieldset
          className="grid w-full gap-6"
          disabled={form.formState.isSubmitting || disabled}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default Form;
