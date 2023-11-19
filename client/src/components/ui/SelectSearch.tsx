'use client';
import clsx from 'clsx';
import React from 'react';
import Select from 'react-select';

type SelectFieldProps = {
  options: { value: string; label: string }[];
  onSearch?: (value: string) => void;
  placeholder?: string;
};

const SelectSearch = ({
  options,
  onSearch,
  placeholder = 'Search...'
}: SelectFieldProps) => {
  return (
    <Select
      placeholder={placeholder}
      unstyled
      onInputChange={(newValue) => {
        if (onSearch) {
          onSearch(newValue);
        }
      }}
      options={options}
      // isMulti
      classNames={{
        control: (state) =>
          'px-3 py-1 border border-zinc-200 text-sm text-black rounded-lg !min-h-[40px] shadow-0 outline-0 hover:border-zinc-200',
        menuList: () => 'mt-2 z-50 border rounded-md ',
        option: ({ isSelected, isFocused, isDisabled }) =>
          clsx(
            '!text-sm p-2 bg-white first-child:rounded-md',
            isSelected && 'bg-zinc-100',
            !isSelected && isFocused && 'bg-zinc-100',
            !isDisabled && isSelected && 'active:bg-zinc-200',
            !isDisabled && !isSelected && 'active:bg-zinc-300 opacity-0.8'
          ),
        noOptionsMessage: () => 'text-sm p-2 bg-white',
        indicatorsContainer: () => 'text-zinc-400',
        valueContainer: ({ isMulti }) => clsx('py-1 mr-1', isMulti && 'gap-1'),
        multiValue: () => 'rounded-xl border bg-zinc-100',
        multiValueLabel: () => 'px-2 py-[2px]'
      }}
    />
  );
};

export default SelectSearch;
