'use strict';

const m = require('mochainon');
const angular = require('angular');
const units = require('../../../lib/shared/units');
require('angular-mocks');

describe('Browser: UpdateNotifier', function() {

  beforeEach(angular.mock.module(
    require('../../../lib/gui/components/update-notifier/update-notifier')
  ));

  describe('UpdateNotifierService', function() {

    describe('.shouldCheckForUpdates()', function() {

      let UpdateNotifierService;
      let SettingsModel;
      let UPDATE_NOTIFIER_SLEEP_DAYS;

      beforeEach(angular.mock.inject(function(_UpdateNotifierService_, _SettingsModel_, _UPDATE_NOTIFIER_SLEEP_DAYS_) {
        UpdateNotifierService = _UpdateNotifierService_;
        SettingsModel = _SettingsModel_;
        UPDATE_NOTIFIER_SLEEP_DAYS = _UPDATE_NOTIFIER_SLEEP_DAYS_;
      }));

      describe('given the `sleepUpdateCheck` is disabled', function() {

        beforeEach(function() {
          SettingsModel.set('sleepUpdateCheck', false);
        });

        it('should return true', function() {
          const result = UpdateNotifierService.shouldCheckForUpdates();
          m.chai.expect(result).to.be.true;
        });

      });

      describe('given the `sleepUpdateCheck` is enabled', function() {

        beforeEach(function() {
          SettingsModel.set('sleepUpdateCheck', true);
        });

        describe('given the `lastUpdateNotify` was never updated', function() {

          beforeEach(function() {
            SettingsModel.set('lastUpdateNotify', undefined);
          });

          it('should return true', function() {
            const result = UpdateNotifierService.shouldCheckForUpdates();
            m.chai.expect(result).to.be.true;
          });

        });

        describe('given the `lastUpdateNotify` was very recently updated', function() {

          beforeEach(function() {
            SettingsModel.set('lastUpdateNotify', Date.now() + 1000);
          });

          it('should return false', function() {
            const result = UpdateNotifierService.shouldCheckForUpdates();
            m.chai.expect(result).to.be.false;
          });

        });

        describe('given the `lastUpdateNotify` was updated long ago', function() {

          beforeEach(function() {
            const SLEEP_MS = units.daysToMilliseconds(UPDATE_NOTIFIER_SLEEP_DAYS);
            SettingsModel.set('lastUpdateNotify', Date.now() + SLEEP_MS + 1000);
          });

          it('should return true', function() {
            const result = UpdateNotifierService.shouldCheckForUpdates();
            m.chai.expect(result).to.be.true;
          });

          it('should unset the `sleepUpdateCheck` setting', function() {
            m.chai.expect(SettingsModel.get('sleepUpdateCheck')).to.be.true;
            UpdateNotifierService.shouldCheckForUpdates();
            m.chai.expect(SettingsModel.get('sleepUpdateCheck')).to.be.false;
          });

        });

      });

    });

  });

});
