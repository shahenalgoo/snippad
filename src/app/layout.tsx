import './globals.scss';

import SessionProvider from '@/components/wrappers/SessionProvider';
import { Toaster } from '@/components';
import BodyWrap from '@/components/wrappers/BodyWrap';


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
				<BodyWrap>
					{children}
					<Toaster />
				</BodyWrap>
			</SessionProvider>
		</>
	)
}
