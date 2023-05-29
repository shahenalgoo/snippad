import './globals.css';
import { Toaster } from '@/components';

export const metadata = {
	title: 'Snippad',
	description: 'Code snippets & note-taking for developers.',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
