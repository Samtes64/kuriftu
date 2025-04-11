import { createAuthClient } from "better-auth/react"
import {
	organizationClient,
	passkeyClient,
	twoFactorClient,
	adminClient,
	multiSessionClient,
	oneTapClient,
	oidcClient,
	genericOAuthClient,
} from "better-auth/client/plugins";
import { toast } from "sonner";


export const authClient = createAuthClient({
    /** the base url of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000"
})

export const { signIn, signUp,signOut, useSession } = createAuthClient()



export const client = createAuthClient({
	plugins: [
		organizationClient(),
		twoFactorClient({
			onTwoFactorRedirect() {
				window.location.href = "/two-factor";
			},
		}),
		passkeyClient(),
		adminClient(),
		multiSessionClient(),
		oneTapClient({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			promptOptions: {
				maxAttempts: 1,
			},
		}),
		oidcClient(),
		genericOAuthClient(),
		
	],
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error("Too many requests. Please try again later.");
			}
		},
	},
});


export const {
	
	organization,
	useListOrganizations,
	useActiveOrganization,
} = client;