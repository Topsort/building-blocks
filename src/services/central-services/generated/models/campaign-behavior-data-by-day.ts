/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Events } from './events';
import { Purchases } from './purchases';

/**
 * 
 * @export
 * @interface CampaignBehaviorDataByDay
 */
export interface CampaignBehaviorDataByDay {
    /**
     * 
     * @type {Events}
     * @memberof CampaignBehaviorDataByDay
     */
    'clicks': Events;
    /**
     * 
     * @type {Events}
     * @memberof CampaignBehaviorDataByDay
     */
    'impressions': Events;
    /**
     * 
     * @type {Purchases}
     * @memberof CampaignBehaviorDataByDay
     */
    'purchases': Purchases;
    /**
     * 
     * @type {string}
     * @memberof CampaignBehaviorDataByDay
     */
    'timeGroup': string;
}

