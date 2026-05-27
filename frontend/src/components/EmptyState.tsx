import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface Props {
  message: string;
  testId: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ message, testId, actionLabel, onAction }: Props) {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }} data-testid={testId}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 2 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
