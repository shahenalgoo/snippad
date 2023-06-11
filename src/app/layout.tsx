import './globals.scss';

import SessionProvider from '@/components/wrappers/SessionProvider';
import BodyWrap from '@/components/wrappers/BodyWrap';

import { Toaster } from '@/components';


export const metadata = {
	title: 'Snippad',
	description: 'An open-source code snippet & note-taking app for developers.',
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
