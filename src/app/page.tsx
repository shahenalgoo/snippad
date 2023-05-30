import { Box, Button, Container } from '@/components';
import Login from './(authentication)/Login';
import { useAmp } from 'next/amp';
import useAuth from '@/hooks/appwrite/useAuth';
import Testing from './testing';

export default function Home() {
	return (
		<main>
			<Container>
				{/* <Login /> */}
				{/* <Box>
					Hello world!
					<br />
					<Button>Say hello!</Button>
				</Box> */}
				<Testing />
			</Container>
		</main>
	)
}
