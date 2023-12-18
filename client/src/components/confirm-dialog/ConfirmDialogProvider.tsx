'use client';

import React, { useCallback, useRef, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const confirmDialogContext = React.createContext<
  ShowConfirmationFn | undefined
>(undefined);

type ShowConfirmationData = {
  title: React.ReactNode;
  description: React.ReactNode;
};

type ShowConfirmationFn = (data: ShowConfirmationData) => Promise<boolean>;

type ConfirmDialogState = {
  title: React.ReactNode;
  description: React.ReactNode;
};

const confirmDialogInitialState = {
  title: 'Are you sure?',
  description: null
};

export const ConfirmDialogProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(
    confirmDialogInitialState
  );

  const resolvePromise = useRef<(isConfirmed: boolean) => void>();

  const onAction = (isConfirmed: boolean) => {
    if (resolvePromise.current) {
      resolvePromise.current(isConfirmed);
    }

    setShow(false);
  };

  const showConfirmDialog = useCallback(
    ({ title, description }: ConfirmDialogState) => {
      setShow(true);
      setConfirmDialog({ title, description });

      return new Promise<boolean>((resolve) => {
        resolvePromise.current = resolve;
      });
    },
    []
  );

  return (
    <confirmDialogContext.Provider value={showConfirmDialog}>
      {children}
      <ConfirmDialog show={show} onAction={onAction} {...confirmDialog} />
    </confirmDialogContext.Provider>
  );
};

export const useConfirmDialog = (): ShowConfirmationFn => {
  const showDialog = React.useContext(confirmDialogContext);

  if (showDialog === undefined) {
    throw Error(
      'Confirmation Dialog Provider not found in component tree. If you forgot to include it, add <ConfirmationModalProvider> component above all code which uses useConfirmDialog hook'
    );
  }

  return showDialog;
};
