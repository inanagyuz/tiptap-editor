'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';

interface Props {
   children: React.ReactNode;
}

/**
 * @function makeQueryClient
 * @description Yeni QueryClient instance oluşturur
 */
function makeQueryClient(): QueryClient {
   return new QueryClient({
      defaultOptions: {
         queries: {
            staleTime: 60 * 1000, // 1 dakika
            gcTime: 1000 * 60 * 60 * 24, // 24 saat
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            retry: (failureCount, error: any) => {
               // 404, 403 gibi client errorlarda retry yapma
               if (error?.status >= 400 && error?.status < 500) {
                  return false;
               }
               return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
         },
         mutations: {
            retry: 1,
            networkMode: 'online',
         },
      },
   });
}

// Browser-side singleton
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * @function getQueryClient
 * @description SSR-safe QueryClient getter
 */
function getQueryClient(): QueryClient {
   if (isServer) {
      // Server: Her request için yeni client
      return makeQueryClient();
   } else {
      // Browser: Singleton pattern
      if (!browserQueryClient) {
         browserQueryClient = makeQueryClient();
      }
      return browserQueryClient;
   }
}

export const QueryProvider = ({ children }: Props) => {
   const queryClient = getQueryClient();

   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
