import './globals.css';
import { Toaster } from '@/components';
import Sidebar from './(sidebar)/Sidebar';

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
			<body className='theme-light text-body-text-color'>
				<Sidebar />
				<main className='relative ml-80'>
					{children}
				</main>
				<Toaster />
			</body>
		</html>
	)
}
