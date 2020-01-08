import GeoJsonGeometry from './GeoJsonGeometry';
import DeedCreatedBy from './DeedCreatedBy';

export default class Deed {
  id?: string;

  type = 'Feature';

  geometry = new GeoJsonGeometry();

  reportType = 'self';

  description?: string;

  createdBy = new DeedCreatedBy();

  createdAt?: Date;

  modifiedAt?: Date;
}
