import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksHeroGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_galleries';
  info: {
    displayName: 'Hero Gallery';
    icon: 'landscape';
  };
  attributes: {
    images: Schema.Attribute.Component<'elements.gallery-image', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksImageGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_galleries';
  info: {
    displayName: 'Image Gallery';
    icon: 'apps';
  };
  attributes: {
    images: Schema.Attribute.Component<'elements.gallery-image', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksServiceCategory extends Struct.ComponentSchema {
  collectionName: 'components_blocks_service_categories';
  info: {
    displayName: 'Service Category';
    icon: 'priceTag';
  };
  attributes: {
    description: Schema.Attribute.Text;
    services: Schema.Attribute.Component<'shared.service', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsGalleryImage extends Struct.ComponentSchema {
  collectionName: 'components_elements_gallery_images';
  info: {
    displayName: 'Gallery Image';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_open_graphs';
  info: {
    displayName: 'openGraph';
    icon: 'project-diagram';
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<'shared.open-graph', false>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SharedService extends Struct.ComponentSchema {
  collectionName: 'components_shared_services';
  info: {
    displayName: 'Service';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    duration: Schema.Attribute.String;
    included: Schema.Attribute.Text;
    location: Schema.Attribute.String;
    notes: Schema.Attribute.Text;
    notIncluded: Schema.Attribute.Text;
    price: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedYoutubeEmbed extends Struct.ComponentSchema {
  collectionName: 'components_shared_youtube_embeds';
  info: {
    displayName: 'Youtube Embed';
    icon: 'play';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedYoutubeGallery extends Struct.ComponentSchema {
  collectionName: 'components_shared_youtube_galleries';
  info: {
    displayName: 'Youtube Gallery';
    icon: 'television';
  };
  attributes: {
    videos: Schema.Attribute.Component<'shared.youtube-embed', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.hero-gallery': BlocksHeroGallery;
      'blocks.image-gallery': BlocksImageGallery;
      'blocks.service-category': BlocksServiceCategory;
      'elements.gallery-image': ElementsGalleryImage;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
      'shared.service': SharedService;
      'shared.youtube-embed': SharedYoutubeEmbed;
      'shared.youtube-gallery': SharedYoutubeGallery;
    }
  }
}
