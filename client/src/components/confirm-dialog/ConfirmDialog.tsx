'use client';

import React from 'react';
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';

type ConfirmDialogProps = {
  onAction: (isConfirmed: boolean) => void;
  show: boolean;
  footer?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
};

const ConfirmDialog = ({
  onAction,
  show,
  title,
  description,
  footer
}: ConfirmDialogProps) => {
  if (!footer) {
    footer = (
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => onAction(false)}>
          Cancel
        </Button>
        <Button onClick={() => onAction(true)}>Confirm</Button>
      </div>
    );
  }

  return (
    <Dialog open={show}>
      <DialogContent
        hideClose
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <header>
          {typeof title === 'string' ? (
            <h3 className="text-xl font-semibold">{title}</h3>
          ) : (
            title
          )}
        </header>
        <div className="mb-4 text-gray-500">
          {typeof description === 'string' ? <p>{description}</p> : description}
        </div>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
