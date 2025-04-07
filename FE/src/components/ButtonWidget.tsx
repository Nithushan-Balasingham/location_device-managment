import { Button, ButtonProps } from '@mui/material'
import { ReactNode } from 'react';

type ButtonWidgetProps = {
  text: string;
  loading?: boolean;
  variantType?: ButtonProps['variant'];
  onClickFunction?: () => void;
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  type:  'submit' | 'button' 
}

const ButtonWidget: React.FC<ButtonWidgetProps> = ({
  text,
  type,
  loading = false,
  variantType = 'contained',
  onClickFunction,
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon
}) => {
  return (
    <Button
      disabled={loading}
      variant={variantType}
      onClick={onClickFunction}
      type={type}
      color={color}
      size={size}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {text}
    </Button>
  );
}

export default ButtonWidget;
