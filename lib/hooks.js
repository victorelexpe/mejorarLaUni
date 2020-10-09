import useSWR from 'swr';

export default async function fetcher(url) { 
  const r = await fetch(url);
  return await r.json(); 
}

export function useCurrentUser() {
  const { data, mutate } = useSWR('/api/user', fetcher);
  const user = data?.user;
  return [user, { mutate }];
}

export function useUser(id) {
  const { data } = useSWR(`/api/users/${id}`, fetcher, { revalidateOnFocus: false });
  return data?.user;
}