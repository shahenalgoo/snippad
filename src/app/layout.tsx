import './globals.scss';

import SessionProvider from '@/components/wrappers/SessionProvider';
import { Toaster } from '@/components';
import BodyWrap from '@/components/wrappers/BodyWrap';


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
