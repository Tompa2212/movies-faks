'use client';
import clsx from 'clsx';
import React from 'react';
import { GroupBase } from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';

type SelectFieldProps = {};

export default function AsyncSelectField<
  OptionType,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  loadOptions,
  placeholder = 'Search...',
  ...props
}: AsyncProps<OptionType, IsMulti, GroupType> & SelectFieldProps) {
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      placeholder={placeholder}
      unstyled
      loadOptions={loadOptions}
      classNames={{
        control: (state) =>
          clsx(
            'max-w-full px-3 py-1 border border-zinc-200 text-sm text-black rounded-lg !min-h-[40px] shadow-0',
            state.isFocused && 'ring-2 ring-offset-2 ring-zinc-950'
          ),
        menuList: () => 'mt-2 z-50 border rounded-md bg-white',
        option: ({ isSelected, isDisabled }) =>
          clsx(
            '!text-sm p-2 first-child:rounded-md hover:bg-zinc-100',
            isSelected && 'bg-zinc-100',
            !isDisabled && isSelected && 'active:bg-zinc-200',
            !isDisabled && !isSelected && 'active:bg-zinc-300 opacity-0.8',
            isDisabled && 'bg-zinc-100 opacity-60'
          ),
        noOptionsMessage: () => 'text-sm p-2 bg-white',
        indicatorsContainer: () => 'text-zinc-400',
        valueContainer: ({ isMulti }) => clsx('py-1 mr-1', isMulti && 'gap-1'),
        multiValue: () => 'rounded-xl border bg-zinc-100',
        multiValueLabel: () => 'px-2 py-[2px]',
        loadingMessage: () => 'text-sm p-2 bg-white'
      }}
      {...props}
    />
  );
}
