import {Apollo} from 'apollo-angular';
import {FetchResult} from '@apollo/client/core';
import {Injectable} from '@angular/core';

import {JwtService} from './jwt.service';

import {
  DAY_CONNECTION,
  TINYDATA_RESEARCH_BAR,
  TINYDATA_FILTER,
  TINYDATA_GET_GRANULARITIES,
  TINYDATA_GET_CONNECTIONS,
  TINYDATA_GET_TOTAL_GRANULARITIES,
  GET_TOTAL_LEARNING_TIME_PER_USER,
  GET_CONTENTS_VALID,
  GET_FEEDBACK,
  GET_OPEN_ACCOUNTS,
  GET_PERFORMANCE,
  GET_EMAIL_OPEN_ACCOUNTS,
  TINYDATA_FILTER_FORMATION_WITH_DATA
} from '../../graphql';
import {Observable} from 'rxjs';

import * as jstz from 'jstz';
import {HttpClient} from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import {NotificationsService} from './notifications.service';
import { UserZoomType, filterType } from '../models/type';

@Injectable()
export class DashboardService {
  public isExternalLink = 'false';
  deviceInfo: any;
  // public matrixLength: any ;
  constructor( private deviceService: DeviceDetectorService,
               private jwtService: JwtService,
               private apollo: Apollo,
               private http: HttpClient,
               private notificationsService: NotificationsService,
               private TINYDATA_GET_GRANULARITIES: TINYDATA_GET_GRANULARITIES,
               private GET_PERFORMANCE: GET_PERFORMANCE,
               private TINYDATA_FILTER_FORMATION_WITH_DATA: TINYDATA_FILTER_FORMATION_WITH_DATA,
               private TINYDATA_GET_TOTAL_GRANULARITIES: TINYDATA_GET_TOTAL_GRANULARITIES,
              //  private GET_FEEDBACK: GET_FEEDBACK
  ) {
    this.deviceInfo = this.deviceService.getDeviceInfo();

  }

  dayConnection(context: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DAY_CONNECTION,
      variables: {
        location: jstz.determine().name(),
        latitude: 102.2,
        longitude: 102.2,
        browser: this.deviceInfo.browser,
        browser_version: this.deviceInfo.browser_version,
        device: this.deviceInfo.device,
        os: this.deviceInfo.os,
        os_version: this.deviceInfo.os_version,
        userAgent: this.deviceInfo.userAgent,
        firebaseToken : this.notificationsService.getToken(),
        context: context,
      }
    });
  }

  researchBar(researchBar: any): Observable<any> {
    return this.apollo.query({
      query: TINYDATA_RESEARCH_BAR,
      variables: {
        researchBar: researchBar
      }
    });
  }

  filter(beginDate: any, endDate: any, parcours: any, entreprise: any): Observable<any> {
    return this.apollo.query({
      query: TINYDATA_FILTER,
      variables: {
        beginDate: beginDate,
        endDate: endDate,
        parcours: parcours,
        entreprise: entreprise
      }
    });
  }

  getGranularities(companies: any, matrixFilter: any = null, userId: any): Observable<any>  {
    return this.TINYDATA_GET_GRANULARITIES.watch({
      companies,
      matrixFilter,
      userId
    },
    {
      fetchPolicy: 'network-only' 
    }).valueChanges;
  }

  getFilterFormationWithData(companies: any, matrixFilter: any = null, userId: any, nameFilter: String|null = null, beginDate: Date|null|string = null, endDate: Date|null|string = null): Observable<any>  {
    return this.TINYDATA_FILTER_FORMATION_WITH_DATA.watch({
      companies,
      matrixFilter,
      userId,
      nameFilter,
      beginDate,
      endDate
    },
    {
      fetchPolicy: 'network-only' 
    }).valueChanges;
  }

  totalGranularities(companies: any): Observable<any>  {
    return this.TINYDATA_GET_TOTAL_GRANULARITIES.watch({
      companies
    },
    {
      fetchPolicy: 'network-only' 
    }).valueChanges;
  }

  // totalGranularities(): Observable<any> {
  //   return this.apollo.query({
  //     query: TOTAL_GRANULARITIES
  //   })
  // }

  getConnections(groupedBy:any = "MONTH", beginDate:any = null, endDate:any = null, idUser:any = null, organisationsFilter:any = null, groupByUser=false): Observable<any> {
    return this.apollo.query({
      query: TINYDATA_GET_CONNECTIONS,
      variables:{
        idUser,
        organisationsFilter,
        beginDate,
        endDate,
        groupedBy,
        groupByUser
      }
    })
  }

  getTotalLearningTimePerUser(
    beginDate: any,
    endDate: any,
    idUser: any,
    organisationsFilter: any,
  ): Observable<any>{
    return this.apollo.query({
      query: GET_TOTAL_LEARNING_TIME_PER_USER,
      variables: {
        beginDate,
        endDate,
        organisationsFilter,
        idUser
      }
    });
  }


  /*********************************************
   *       Graphique - ACQUIS VALIDÉS          *
   ********************************************/
  getContentsValid(
    matrixFilter: number[], 
    domainFilter: number[], 
    skillFilter: number[], 
    themeFilter: number[], 
    beginDate: string | Date, 
    endDate: string | Date, 
    organisationsFilter: number[], 
    idMatrix: any, 
    idUser: any, 
    isExtended: boolean): Observable<any> {
    return this.apollo.query({
      query: GET_CONTENTS_VALID,
      variables: {
        matrixFilter,
        domainFilter, 
        skillFilter, 
        themeFilter, 
        beginDate, 
        endDate,
        organisationsFilter,
        idMatrix,
        idUser,
        isExtended
      }
    });
  }

  // /***************************************************
  //  *  Graphique des retours utilisateurs - FEEDBACK  *
  //  **************************************************/
  getFeedback(
    beginDate: filterType, 
    endDate: filterType, 
    matrixFilter: filterType, 
    domainFilter: filterType, 
    skillFilter: filterType, 
    themeFilter: filterType, 
    organisationsFilter: filterType, 
    idGranularity: number | null, 
    idUser: number | null,
    formationZoom: number | null, 
    actualGranularity: number | null
    ): Observable<any> {

    return this.apollo.query({
      query: GET_FEEDBACK,
      variables: {
        beginDate, 
        endDate,
        matrixFilter,
        domainFilter, 
        skillFilter, 
        themeFilter, 
        organisationsFilter,
        idGranularity,
        idUser,
        formationZoom,
        actualGranularity
      }
      
    });
  }

  
   /***************************************************
   *                Graphique PERFORMANCE             *
   **************************************************/
  getPerformance(
    beginDate: filterType,
    endDate: filterType,
    matrixFilter: filterType,
    domainFilter: filterType,
    skillFilter: filterType,
    themeFilter: filterType,
    acquisitionFilter: filterType,
    organisationsFilter: filterType,
    userId: number | null,
    nameDepth: string,
    depthClickedID: number | null,
    filterFormationSelected: String | null,
    performanceZoom: number
  ): Observable<any>{
    return this.GET_PERFORMANCE.watch({
        beginDate,
        endDate,
        matrixFilter,
        domainFilter,
        skillFilter,
        themeFilter,
        acquisitionFilter,
        organisationsFilter,
        userId,
        nameDepth,
        depthClickedID,
        filterFormationSelected,
        performanceZoom
    },
    {
      fetchPolicy: 'network-only' 
    }).valueChanges;
  }


  /***************************************************
   *  Graphique des ouvertures de comptes - OPENACCOUNTS  *
   **************************************************/
  getOpenAccounts(
    beginDate: string | Date, 
    endDate: string | Date, 
    matrixFilter: number[], 
    organisationsFilter: number[],
    ): Observable<any> {
    return this.apollo.query({
      query: GET_OPEN_ACCOUNTS,
      variables: {
        beginDate, 
        endDate,
        matrixFilter,
        organisationsFilter
      }
    });
  }

  getEmailOpenAccounts(
    beginDate: string | Date, 
    endDate: string | Date, 
    companyId: number | null,
    formationId: number | null
    ): Observable<any> {
    return this.apollo.query({
      query: GET_EMAIL_OPEN_ACCOUNTS,
      variables: {
        beginDate, 
        endDate,
        companyId,
        formationId
      }
    });
  }

}


