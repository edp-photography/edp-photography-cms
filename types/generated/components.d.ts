import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksHeroGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_galleries';
  info: {
    displayName: 'Hero Gallery';
    icon: 'landscape';
  };
  attributes: {
    images: Schema.Attribute.Component<'elements.gallery-image', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
  };
}

export interface ElementsGalleryImage extends Struct.ComponentSchema {
  collectionName: 'components_elements_gallery_images';
  info: {
    displayName: 'Gallery Image';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.hero-gallery': BlocksHeroGallery;
      'elements.gallery-image': ElementsGalleryImage;
    }
  }
}
