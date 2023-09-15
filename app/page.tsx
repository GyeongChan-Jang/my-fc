import { Button, Container, Paper } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Paper h="100%" display="flex" style={{ alignItems: 'center' }}>
      <Container>
        <Link href="/market">
          <Button>상권분석으로 이동</Button>
        </Link>
      </Container>
    </Paper>
  );
}
