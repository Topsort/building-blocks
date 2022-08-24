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


import { BidCreate } from './bid-create';
import { BudgetCreate } from './budget-create';
import { CampaignStatus } from './campaign-status';
import { CampaignType } from './campaign-type';
import { PromotionType } from './promotion-type';

/**
 * 
 * @export
 * @interface CampaignCreateRequest
 */
export interface CampaignCreateRequest {
    /**
     * 
     * @type {Array<BidCreate>}
     * @memberof CampaignCreateRequest
     */
    'bids': Array<BidCreate>;
    /**
     * 
     * @type {BudgetCreate}
     * @memberof CampaignCreateRequest
     */
    'budget': BudgetCreate;
    /**
     * 
     * @type {CampaignType}
     * @memberof CampaignCreateRequest
     */
    'campaignType': CampaignType;
    /**
     * 
     * @type {string}
     * @memberof CampaignCreateRequest
     */
    'endDate'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof CampaignCreateRequest
     */
    'isActive'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof CampaignCreateRequest
     */
    'isSmart'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof CampaignCreateRequest
     */
    'name': string;
    /**
     * 
     * @type {PromotionType}
     * @memberof CampaignCreateRequest
     */
    'promotionType': PromotionType;
    /**
     * 
     * @type {string}
     * @memberof CampaignCreateRequest
     */
    'startDate'?: string;
    /**
     * 
     * @type {CampaignStatus}
     * @memberof CampaignCreateRequest
     */
    'status'?: CampaignStatus;
    /**
     * 
     * @type {boolean}
     * @memberof CampaignCreateRequest
     */
    'usesTopsortCreditLine'?: boolean;
}

