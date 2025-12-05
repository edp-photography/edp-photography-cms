import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksHeroGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_galleries';
  info: {
    displayName: 'Hero Gallery';
    icon: 'landscape';
  };
  attributes: {
    images: Schema.Attribute.Component<'elements.image', true> &
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
    images: Schema.Attribute.Component<'elements.image', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 30;
          min: 1;
        },
        number
      >;
  };
}

export interface ElementsImage extends Struct.ComponentSchema {
  collectionName: 'components_elements_images';
  info: {
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.Text & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.hero-gallery': BlocksHeroGallery;
      'blocks.image-gallery': BlocksImageGallery;
      'elements.image': ElementsImage;
    }
  }
}
