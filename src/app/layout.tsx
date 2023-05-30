import './globals.css';

import SessionProvider from '@/components/context/SessionProvider';
import { Toaster } from '@/components';

export const metadata = {
	title: 'Snippad Notepad',
	description: 'Code snippets & note-taking for developers.',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<SessionProvider>
				<html lang="en">
					<body>
						{children}
						<Toaster />
					</body>
				</html>
			</SessionProvider>
		</>
	)
}
