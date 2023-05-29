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
		<html lang="en" className=''>
			<body className='theme-light text-text-default'>
				<Sidebar />
				<main className='relative'>
					{children}
				</main>
				<Toaster />
			</body>
		</html>
	)
}
