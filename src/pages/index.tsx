import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = 5 }) => {
      const { data } = await api.get('/api/images', {
        params: {
          after: pageParam,
        },
      });

      return data;
    },
    {
      getNextPageParam: (lastPage, _) => {
        return lastPage.after ? lastPage.after : null;
      },
    }
  );

  const formattedData = useMemo(() => {
    const dataFormatted = data?.pages
      .flatMap(page => {
        return page.data;
      })
      .flat();

    return dataFormatted;
  }, [data]);

  const error = isError && <Error />;

  const loading = isLoading && <Loading />;

  return (
    <>
      <Header />
      {error}
      {loading}
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt="10" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
