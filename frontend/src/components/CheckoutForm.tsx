import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardNumber: string;
}

interface Props {
  data: FormData;
  errors: Partial<FormData>;
  onChange: (field: keyof FormData, value: string) => void;
}

const fields: Array<{
  key: keyof FormData;
  label: string;
  testId: string;
  type?: string;
  xs?: number;
  sm?: number;
}> = [
  { key: 'firstName', label: 'First Name', testId: 'checkout-first-name-input', xs: 12, sm: 6 },
  { key: 'lastName', label: 'Last Name', testId: 'checkout-last-name-input', xs: 12, sm: 6 },
  { key: 'email', label: 'Email', testId: 'checkout-email-input', type: 'email', xs: 12 },
  { key: 'address', label: 'Address', testId: 'checkout-address-input', xs: 12 },
  { key: 'city', label: 'City', testId: 'checkout-city-input', xs: 12, sm: 5 },
  { key: 'state', label: 'State', testId: 'checkout-state-input', xs: 12, sm: 3 },
  { key: 'zip', label: 'ZIP Code', testId: 'checkout-zip-input', xs: 12, sm: 4 },
  { key: 'cardNumber', label: 'Card Number', testId: 'checkout-card-number-input', xs: 12 },
];

export default function CheckoutForm({ data, errors, onChange }: Props) {
  return (
    <Grid container spacing={2}>
      {fields.map(f => (
        <Grid item xs={f.xs ?? 12} sm={f.sm} key={f.key}>
          <TextField
            fullWidth
            label={f.label}
            type={f.type || 'text'}
            value={data[f.key]}
            error={!!errors[f.key]}
            helperText={errors[f.key]}
            onChange={e => onChange(f.key, e.target.value)}
            inputProps={{
              'data-testid': f.testId,
              'aria-describedby': errors[f.key] ? `${f.testId}-error` : undefined,
            }}
            FormHelperTextProps={{ id: `${f.testId}-error`, role: 'alert' }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
