export type ModelTypes = {
  title: string;
  description?: string;
  secondaryDescription?: string;
  image?: string;
  cancelButtonText?: string;
  buttonText?: string;
  handleContinue?: () => void;
  showModel: boolean;
  hideModel: () => void;
};
