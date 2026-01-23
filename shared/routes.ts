import { z } from 'zod';
import { insertProfileSchema, insertListingSchema, insertRideSchema, insertWallBookingSchema, profiles, listings, rides, messages, wallSpaces, wallBookings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  profile: {
    me: {
      method: 'GET' as const,
      path: '/api/profile/me',
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/profile/me',
      input: insertProfileSchema.partial(),
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
      },
    },
  },
  listings: {
    list: {
      method: 'GET' as const,
      path: '/api/listings',
      input: z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof listings.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/listings/:id',
      responses: {
        200: z.custom<typeof listings.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/listings',
      input: insertListingSchema.omit({ sellerId: true }),
      responses: {
        201: z.custom<typeof listings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  rides: {
    list: {
      method: 'GET' as const,
      path: '/api/rides',
      responses: {
        200: z.array(z.custom<typeof rides.$inferSelect>()),
      },
    },
    available: {
      method: 'GET' as const,
      path: '/api/rides/available',
      responses: {
        200: z.array(z.custom<typeof rides.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/rides',
      input: insertRideSchema.omit({ riderId: true }),
      responses: {
        201: z.custom<typeof rides.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/rides/:id',
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof rides.$inferSelect>(),
      },
    },
  },
  messages: {
    list: {
      method: 'GET' as const,
      path: '/api/messages',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/messages',
      input: z.object({
        receiverId: z.string(),
        content: z.string(),
        listingId: z.number().optional(),
        rideId: z.number().optional(),
      }),
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
      },
    },
  },
  walls: {
    list: {
      method: 'GET' as const,
      path: '/api/walls',
      responses: {
        200: z.array(z.custom<typeof wallSpaces.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/walls/:id',
      responses: {
        200: z.custom<typeof wallSpaces.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    book: {
      method: 'POST' as const,
      path: '/api/walls/:id/book',
      input: insertWallBookingSchema.omit({ userId: true, wallId: true }),
      responses: {
        201: z.custom<typeof wallBookings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    myBookings: {
      method: 'GET' as const,
      path: '/api/walls/my-bookings',
      responses: {
        200: z.array(z.custom<typeof wallBookings.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
