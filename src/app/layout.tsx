import './globals.css';

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
			</body>
		</html>
	)
}
