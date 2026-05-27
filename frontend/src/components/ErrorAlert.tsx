import Alert from '@mui/material/Alert';

interface Props {
  message: string;
  testId?: string;
}

export default function ErrorAlert({ message, testId }: Props) {
  return (
    <Alert severity="error" role="alert" data-testid={testId}>
      {message}
    </Alert>
  );
}
