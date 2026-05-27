import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch(value);
  };

  return (
    <TextField
      fullWidth
      placeholder="Search products..."
      value={value}
      onChange={e => { setValue(e.target.value); onSearch(e.target.value); }}
      onKeyDown={handleKeyDown}
      inputProps={{ 'data-testid': 'product-search-input', 'aria-label': 'Search products' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
