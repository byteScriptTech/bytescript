export const useFetchWsToken = () => {
  return async (userId: string, roomId: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/ws-token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roomId }),
        }
      );
      if (!res.ok) return null;
      const { token } = await res.json();
      return token;
    } catch (e) {
      console.error('fetch token failed', e);
      return null;
    }
  };
};
