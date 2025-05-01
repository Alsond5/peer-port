import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		shareId: params.share_id
	};
};