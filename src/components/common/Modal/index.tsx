import Image from 'next/image';
import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ModelTypes } from '@/types/Model.types';

const Model: React.FC<ModelTypes> = ({
  title,
  description,
  secondaryDescription,
  buttonText,
  cancelButtonText,
  image,
  showModel,
  hideModel,
  handleContinue,
}) => {
  return (
    <AlertDialog open={showModel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {image && (
            <Image src={image} height={50} width={100} alt="image-text" />
          )}
          <AlertDialogDescription className="max-h-80 overflow-auto">
            {description}
            {secondaryDescription && (
              <p className="text-xs mt-2">{secondaryDescription}</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={hideModel}>
            {cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleContinue}
            className="bg-main hover:bg-main-dark"
          >
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Model;
