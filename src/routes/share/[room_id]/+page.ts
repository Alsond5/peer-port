import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		room_id: params.room_id
	};
};