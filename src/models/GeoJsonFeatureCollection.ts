import Deed from './Deed';

export default class GeoJsonFeatureCollection {
  type = 'FeatureCollection';

  features: Array<Deed> = [];
}
