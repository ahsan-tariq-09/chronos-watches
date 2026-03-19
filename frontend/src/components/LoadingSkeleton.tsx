import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export default function LoadingSkeleton() {
  return (
    <Card variant="outlined" aria-hidden="true">
      <Skeleton variant="rectangular" height={220} />
      <CardContent>
        <Stack spacing={1}>
          <Skeleton variant="text" height={30} width="70%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rounded" height={38} />
        </Stack>
      </CardContent>
    </Card>
  );
}
