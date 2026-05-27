import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const CATEGORIES = ['', 'headphones', 'earbuds', 'speakers', 'microphones'];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

interface Props {
  category: string;
  sort: string;
  onCategoryChange: (val: string) => void;
  onSortChange: (val: string) => void;
}

export default function FilterPanel({ category, sort, onCategoryChange, onSortChange }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          label="Category"
          value={category}
          onChange={(e: SelectChangeEvent) => onCategoryChange(e.target.value)}
          inputProps={{ 'data-testid': 'product-category-filter' }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {CATEGORIES.filter(c => c).map(c => (
            <MenuItem key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          label="Sort By"
          value={sort}
          onChange={(e: SelectChangeEvent) => onSortChange(e.target.value)}
          inputProps={{ 'data-testid': 'product-sort-select' }}
        >
          {SORT_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
