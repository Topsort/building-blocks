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


import { AppInvitationServiceApiModelsEntity } from './app-invitation-service-api-models-entity';
import { Invitee } from './invitee';

/**
 * 
 * @export
 * @interface InvitesResponse
 */
export interface InvitesResponse {
    /**
     * 
     * @type {string}
     * @memberof InvitesResponse
     */
    'createdAt': string;
    /**
     * 
     * @type {string}
     * @memberof InvitesResponse
     */
    'createdBy': string;
    /**
     * 
     * @type {string}
     * @memberof InvitesResponse
     */
    'id': string;
    /**
     * 
     * @type {Invitee}
     * @memberof InvitesResponse
     */
    'invitee': Invitee;
    /**
     * 
     * @type {string}
     * @memberof InvitesResponse
     */
    'key': string;
    /**
     * 
     * @type {AppInvitationServiceApiModelsEntity}
     * @memberof InvitesResponse
     */
    'origin': AppInvitationServiceApiModelsEntity;
    /**
     * 
     * @type {AppInvitationServiceApiModelsEntity}
     * @memberof InvitesResponse
     */
    'target': AppInvitationServiceApiModelsEntity;
    /**
     * 
     * @type {string}
     * @memberof InvitesResponse
     */
    'updatedAt': string;
    /**
     * 
     * @type {boolean}
     * @memberof InvitesResponse
     */
    'used': boolean;
}

