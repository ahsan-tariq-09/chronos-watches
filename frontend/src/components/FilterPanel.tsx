import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { FiltersState, Watch } from '../types/watch';

interface Props {
  watches: Watch[];
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}

const deriveValues = (watches: Watch[], key: keyof Pick<Watch, 'brand' | 'style' | 'movement' | 'material' | 'strap'>) =>
  Array.from(new Set(watches.map((watch) => watch[key]))).sort();

export default function FilterPanel({ watches, filters, onChange }: Props) {
  const activeCount = [
    filters.brands.length,
    filters.styles.length,
    filters.movements.length,
    filters.materials.length,
    filters.straps.length,
    filters.inStockOnly ? 1 : 0,
    filters.search ? 1 : 0,
    filters.maxPrice < Math.max(...watches.map((watch) => watch.price), 0) ? 1 : 0
  ].reduce((sum, value) => sum + value, 0);

  const updateArray = (field: keyof Pick<FiltersState, 'brands' | 'styles' | 'movements' | 'materials' | 'straps'>, value: string) => {
    const current = filters[field];
    onChange({
      ...filters,
      [field]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    });
  };

  const renderGroup = (
    title: string,
    field: keyof Pick<FiltersState, 'brands' | 'styles' | 'movements' | 'materials' | 'straps'>,
    options: string[]
  ) => (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={600}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          {options.map((option) => (
            <FormControlLabel
              key={option}
              control={<Checkbox checked={filters[field].includes(option)} onChange={() => updateArray(field, option)} />}
              label={option}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box component="aside" aria-label="Watch catalogue filters" sx={{ p: 2, border: '1px solid #d9e2ec', borderRadius: 2, bgcolor: 'white' }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Badge color="primary" badgeContent={activeCount}>
            <Typography variant="h6">Filters</Typography>
          </Badge>
          <Button onClick={() => onChange({ ...filters, brands: [], styles: [], movements: [], materials: [], straps: [], inStockOnly: false, search: '', maxPrice: Math.max(...watches.map((watch) => watch.price), 0) })}>
            Reset
          </Button>
        </Stack>
        <TextField
          label="Search catalogue"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
        <Box>
          <Typography gutterBottom>Maximum price: ${filters.maxPrice.toLocaleString()}</Typography>
          <Slider
            min={0}
            max={Math.max(...watches.map((watch) => watch.price), 0)}
            step={50}
            value={filters.maxPrice}
            onChange={(_event, value) => onChange({ ...filters, maxPrice: value as number })}
            aria-label="Maximum price"
          />
        </Box>
        <FormControlLabel
          control={<Checkbox checked={filters.inStockOnly} onChange={(event) => onChange({ ...filters, inStockOnly: event.target.checked })} />}
          label="Show only items in stock"
        />
        {renderGroup('Brand', 'brands', deriveValues(watches, 'brand'))}
        {renderGroup('Style', 'styles', deriveValues(watches, 'style'))}
        {renderGroup('Movement', 'movements', deriveValues(watches, 'movement'))}
        {renderGroup('Material', 'materials', deriveValues(watches, 'material'))}
        {renderGroup('Strap', 'straps', deriveValues(watches, 'strap'))}
      </Stack>
    </Box>
  );
}
