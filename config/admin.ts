export default ({ env }) => {
  return {
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    flags: {
      nps: env.bool("FLAG_NPS", true),
      promoteEE: env.bool("FLAG_PROMOTE_EE", true),
    },
    preview: {
      enabled: env("NODE_ENV") === "production",
      config: {
        allowedOrigins: env("CLIENT_URL"),
        async handler(uid, { documentId, locale, status }) {
          // Fetch the document to get any needed data
          const document = await strapi.documents(uid).findOne({ documentId });

          // Generate the preview pathname
          const pathname = getPreviewPathname(uid, { locale, document });

          // If no pathname, disable preview for this content type
          if (!pathname) {
            return null;
          }

          // Build the preview URL with query params for Next.js draft mode
          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: env("PREVIEW_SECRET"),
            status, // 'draft' or 'published'
          });

          return `${env("CLIENT_URL")}/api/preview?${urlSearchParams}`;
        },
      },
    },
    secrets: {
      encryptionKey: env("ENCRYPTION_KEY"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
  };
};

const getPreviewPathname = (
  uid: string,
  { locale, document }: { locale?: string; document: any }
): string | null => {
  // Map your single types to their front-end routes
  switch (uid) {
    case "api::home-page.home-page":
      return "/";
    case "api::services-page.services-page":
      return "/services";
    case "api::videoclips-page.videoclips-page":
      return "/videoclips";
    // Add more single types as needed
    // case "api::about.about":
    //   return "/about";
    default:
      return null; // Return null for types that shouldn't have preview
  }
};
