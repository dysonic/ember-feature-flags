import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service features;

  @action toggleAcceptanceFeatureOff() {
    this.features.disable('acceptance-feature');
  }
  @action toggleAcceptanceFeatureSetupOff() {
    this.features.setup({ 'acceptance-feature': false });
  }
}
