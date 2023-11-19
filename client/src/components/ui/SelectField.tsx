import React from 'react';
import { Select, SelectItem, SelectContent, SelectTrigger } from './Select';

type SelectFieldProps = {
  options: { label: string; value: string }[];
  trigger: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Select>;

const SelectField = ({ options, trigger, ...props }: SelectFieldProps) => {
  return (
    <Select {...props}>
      <SelectTrigger>{trigger}</SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectField;
