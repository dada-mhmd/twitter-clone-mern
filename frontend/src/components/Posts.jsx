import { useEffect } from 'react';
import Post from './Post';
import PostSkeleton from './skeletons/PostSkeleton';
import { useQuery } from '@tanstack/react-query';

const Posts = ({ feedType, username, userId }) => {
  const getPost = () => {
    if (feedType === 'forYou') {
      return '/api/posts';
    }
    if (feedType === 'following') {
      return '/api/posts/following';
    }
    if (feedType === 'posts') {
      return `/api/posts/user/${username}`;
    }
    if (feedType === 'likes') {
      return `/api/posts/likes/${userId}`;
    }

    return '/api/posts';
  };

  const POST_ENDPOINT = getPost();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch posts');
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && data?.length === 0 && (
        <p className='text-center my-4'>No posts in this tab</p>
      )}
      {!isLoading && !isRefetching && data && (
        <div>
          {data?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
