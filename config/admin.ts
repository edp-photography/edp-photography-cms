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
      enabled: true,
      config: {
        allowedOrigins: env("CLIENT_URL"),
        async handler(uid, { documentId, locale, status }) {
          const document = await strapi.documents(uid).findOne({ documentId });

          const pathname = getPreviewPathname(uid, { locale, document });

          if (!pathname) {
            return null;
          }

          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: env("PREVIEW_SECRET"),
            status,
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
  { locale, document }: { locale?: string; document: any },
): string | null => {
  switch (uid) {
    case "api::home-page.home-page":
      return "/";
    case "api::about-page.about-page":
      return "/about";
    case "api::services-page.services-page":
      return "/services";
    case "api::videoclips-page.videoclips-page":
      return "/videoclips";
    case "api::fashion-page.fashion-page":
      return "/fashion";
    case "api::fine-art-page.fine-art-page":
      return "/fine-art";
    case "api::portraits-page.portraits-page":
      return "/portraits";
    case "api::travel-page.travel-page":
      return "/travel";
    case "api::workshops-page.workshops-page":
      return "/workshops";
    case "api::calendars-page.calendars-page":
      return "/calendars";
    default:
      return null;
  }
};
