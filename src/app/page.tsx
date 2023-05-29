import { Box, Button, Container } from '@/components';
import Login from './(authentication)/Login';

export default function Home() {

	return (
		<main>
			<Container>
				<Login />
				<Box>
					Hello world!
					<br />
					<Button>Say hello!</Button>
				</Box>
			</Container>
		</main>
	)
}
