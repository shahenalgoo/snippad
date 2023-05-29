import './globals.css';

import SessionContextProvider from '@/components/context/SessionContextProvider';
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
			<SessionContextProvider>
				<html lang="en" className=''>
					<body className='theme-light text-body-text-color'>
						{children}
						<Toaster />
					</body>
				</html>
			</SessionContextProvider>
		</>
	)
}
